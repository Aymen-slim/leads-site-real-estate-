// Minimal Supabase PostgREST client using fetch only (works on Cloudflare Workers + edge middleware).
// Uses the service-role / secret key, so it must ONLY be imported from server code.

const DEFAULT_TIMEOUT_MS = 8_000;
const DEFAULT_RETRIES = 2;
const RETRYABLE_STATUSES = new Set([408, 429, 502, 503, 504]);
const RETRYABLE_ERROR_CODES = new Set([
  "ETIMEDOUT",
  "ECONNRESET",
  "ECONNREFUSED",
  "EAI_AGAIN",
  "ENOTFOUND",
  "EPIPE",
  "UND_ERR_CONNECT_TIMEOUT",
  "UND_ERR_HEADERS_TIMEOUT",
  "UND_ERR_BODY_TIMEOUT",
  "UND_ERR_SOCKET",
]);

function env() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return { url, key };
}

export function supabaseConfigured(): boolean {
  const { url, key } = env();
  return Boolean(url && key);
}

function headers(extra?: Record<string, string>): Record<string, string> {
  const { key } = env();
  const h: Record<string, string> = {
    apikey: key ?? "",
    "Content-Type": "application/json",
    ...extra,
  };
  // Legacy JWT service_role keys go in Authorization too; new `sb_secret_` keys only need `apikey`.
  if (key && key.startsWith("eyJ")) h.Authorization = `Bearer ${key}`;
  return h;
}

export class SupabaseError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = "SupabaseError";
  }
}

export interface RequestOptions {
  timeoutMs?: number;
  retries?: number;
}

function extractErrorCode(err: unknown): string | undefined {
  if (!err || typeof err !== "object") return undefined;
  const e = err as { code?: unknown; cause?: unknown; name?: unknown };
  if (typeof e.code === "string") return e.code;
  if (e.cause && typeof e.cause === "object") {
    const c = e.cause as { code?: unknown; errors?: unknown[] };
    if (typeof c.code === "string") return c.code;
    if (Array.isArray(c.errors)) {
      for (const sub of c.errors) {
        if (sub && typeof sub === "object" && typeof (sub as { code?: unknown }).code === "string") {
          return (sub as { code: string }).code;
        }
      }
    }
  }
  if (typeof e.name === "string" && (e.name === "AbortError" || e.name === "TimeoutError")) {
    return "ETIMEDOUT";
  }
  return undefined;
}

function isRetryableNetworkError(err: unknown): boolean {
  const code = extractErrorCode(err);
  if (code && RETRYABLE_ERROR_CODES.has(code)) return true;
  if (err instanceof TypeError && /fetch failed/i.test(err.message)) return true;
  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(
  path: string,
  init: RequestInit & { prefer?: string; timeoutMs?: number; retries?: number } = {}
): Promise<Response> {
  const { url } = env();
  if (!supabaseConfigured()) {
    throw new SupabaseError(
      "Supabase is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).",
      503,
      "NOT_CONFIGURED"
    );
  }

  const {
    prefer,
    headers: extraHeaders,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    retries = DEFAULT_RETRIES,
    ...rest
  } = init;

  const reqHeaders = headers({
    ...(prefer ? { Prefer: prefer } : {}),
    ...((extraHeaders as Record<string, string>) ?? {}),
  });

  let lastErr: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(`${url}/rest/v1/${path}`, {
        ...rest,
        cache: "no-store",
        signal: controller.signal,
        headers: reqHeaders,
      });

      if (res.ok) {
        return res;
      }

      const text = await res.text().catch(() => "");
      const sbErr = new SupabaseError(
        `Supabase ${res.status}: ${text.slice(0, 300)}`,
        res.status
      );

      if (RETRYABLE_STATUSES.has(res.status) && attempt < retries) {
        lastErr = sbErr;
        await sleep(250 * (attempt + 1));
        continue;
      }

      throw sbErr;
    } catch (err) {
      if (err instanceof SupabaseError) {
        throw err;
      }

      const code = extractErrorCode(err);
      const isTimeout = code === "ETIMEDOUT" || code === "UND_ERR_CONNECT_TIMEOUT";

      if (attempt < retries && isRetryableNetworkError(err)) {
        lastErr = err;
        await sleep(250 * (attempt + 1));
        continue;
      }

      throw new SupabaseError(
        isTimeout
          ? `Supabase connection timed out (${code || "ETIMEDOUT"}).`
          : `Supabase network error (${code || (err instanceof Error ? err.message : "unknown")}).`,
        isTimeout ? 504 : 503,
        code || "NETWORK_ERROR"
      );
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastErr instanceof SupabaseError
    ? lastErr
    : new SupabaseError("Supabase request failed after retries.", 503, "RETRY_EXHAUSTED");
}

/** Map a caught error to an appropriate HTTP status and safe user-facing message. */
export function supabaseErrorResponse(err: unknown, fallbackMessage: string): {
  status: number;
  error: string;
} {
  if (err instanceof SupabaseError) {
    if (err.status === 504) {
      return { status: 504, error: "Database connection timed out. Please try again." };
    }
    if (err.status === 503) {
      return { status: 503, error: "Database temporarily unreachable. Please try again." };
    }
    if (err.status >= 400 && err.status < 500) {
      return { status: err.status, error: fallbackMessage };
    }
  }
  return { status: 500, error: fallbackMessage };
}

/** GET rows. `query` is a PostgREST query, e.g. `leads?select=*&order=created_at.desc`. */
export async function sbSelect<T>(
  query: string,
  opts: RequestOptions & { count?: boolean } = {}
): Promise<{ rows: T[]; count: number | null }> {
  const res = await request(query, {
    method: "GET",
    prefer: opts.count ? "count=exact" : undefined,
    timeoutMs: opts.timeoutMs,
    retries: opts.retries,
  });
  const rows = (await res.json()) as T[];
  let count: number | null = null;
  if (opts.count) {
    const range = res.headers.get("content-range"); // e.g. "0-49/1234"
    const total = range?.split("/")[1];
    count = total && total !== "*" ? Number(total) : null;
  }
  return { rows, count };
}

export async function sbRpc<T>(
  fn: string,
  args: Record<string, unknown> = {},
  opts: RequestOptions = {}
): Promise<T> {
  const res = await request(`rpc/${fn}`, {
    method: "POST",
    body: JSON.stringify(args),
    timeoutMs: opts.timeoutMs,
    retries: opts.retries,
  });
  return (await res.json()) as T;
}

export async function sbInsert(
  table: string,
  rows: Record<string, unknown> | Record<string, unknown>[],
  opts: RequestOptions & { ignoreDuplicates?: boolean; upsert?: boolean; onConflict?: string } = {}
): Promise<void> {
  const prefer = ["return=minimal"];
  if (opts.ignoreDuplicates) prefer.push("resolution=ignore-duplicates");
  else if (opts.upsert) prefer.push("resolution=merge-duplicates");
  const q = opts.onConflict ? `${table}?on_conflict=${encodeURIComponent(opts.onConflict)}` : table;
  await request(q, {
    method: "POST",
    body: JSON.stringify(rows),
    prefer: prefer.join(","),
    timeoutMs: opts.timeoutMs,
    retries: opts.retries,
  });
}

/** PATCH rows matching `filter`, e.g. `id=eq.123`. */
export async function sbUpdate(
  table: string,
  filter: string,
  patch: Record<string, unknown>,
  opts: RequestOptions = {}
): Promise<void> {
  await request(`${table}?${filter}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
    prefer: "return=minimal",
    timeoutMs: opts.timeoutMs,
    retries: opts.retries,
  });
}
