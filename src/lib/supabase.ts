// Minimal Supabase PostgREST client using fetch only (works on Cloudflare Workers + edge middleware).
// Uses the service-role / secret key, so it must ONLY be imported from server code.

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
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function request(path: string, init: RequestInit & { prefer?: string } = {}): Promise<Response> {
  const { url } = env();
  if (!supabaseConfigured()) {
    throw new SupabaseError("Supabase is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).", 500);
  }
  const { prefer, headers: extraHeaders, ...rest } = init;
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...rest,
    cache: "no-store",
    headers: headers({
      ...(prefer ? { Prefer: prefer } : {}),
      ...((extraHeaders as Record<string, string>) ?? {}),
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new SupabaseError(`Supabase ${res.status}: ${text.slice(0, 300)}`, res.status);
  }
  return res;
}

/** GET rows. `query` is a PostgREST query, e.g. `leads?select=*&order=created_at.desc`. */
export async function sbSelect<T>(
  query: string,
  opts: { count?: boolean } = {}
): Promise<{ rows: T[]; count: number | null }> {
  const res = await request(query, {
    method: "GET",
    prefer: opts.count ? "count=exact" : undefined,
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

export async function sbRpc<T>(fn: string, args: Record<string, unknown> = {}): Promise<T> {
  const res = await request(`rpc/${fn}`, { method: "POST", body: JSON.stringify(args) });
  return (await res.json()) as T;
}

export async function sbInsert(
  table: string,
  rows: Record<string, unknown> | Record<string, unknown>[],
  opts: { ignoreDuplicates?: boolean; upsert?: boolean; onConflict?: string } = {}
): Promise<void> {
  const prefer = ["return=minimal"];
  if (opts.ignoreDuplicates) prefer.push("resolution=ignore-duplicates");
  else if (opts.upsert) prefer.push("resolution=merge-duplicates");
  const q = opts.onConflict ? `${table}?on_conflict=${encodeURIComponent(opts.onConflict)}` : table;
  await request(q, { method: "POST", body: JSON.stringify(rows), prefer: prefer.join(",") });
}

/** PATCH rows matching `filter`, e.g. `id=eq.123`. */
export async function sbUpdate(table: string, filter: string, patch: Record<string, unknown>): Promise<void> {
  await request(`${table}?${filter}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
    prefer: "return=minimal",
  });
}
