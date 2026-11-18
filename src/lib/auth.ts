// Single-admin auth: password from env + HMAC-signed session cookie. Edge-safe (Web Crypto only).

export const ADMIN_COOKIE = "kr_admin";
export const ADMIN_SESSION_SECONDS = 60 * 60 * 24 * 7; // 7 days

const encoder = new TextEncoder();

function toBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return toBase64Url(await crypto.subtle.sign("HMAC", key, encoder.encode(data)));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function secret(): string | null {
  const s = process.env.ADMIN_SESSION_SECRET;
  return s && s.length >= 32 ? s : null;
}

export function authConfigured(): boolean {
  return Boolean(secret() && process.env.ADMIN_PASSWORD);
}

export async function createSessionToken(): Promise<string> {
  const s = secret();
  if (!s) throw new Error("ADMIN_SESSION_SECRET missing or shorter than 32 characters");
  const exp = Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS;
  return `${exp}.${await hmac(s, `admin.${exp}`)}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  const s = secret();
  if (!s || !token) return false;
  const [expStr, sig] = token.split(".");
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || !sig || exp < Date.now() / 1000) return false;
  return timingSafeEqual(sig, await hmac(s, `admin.${exp}`));
}

export async function checkPassword(input: string): Promise<boolean> {
  const s = secret();
  const expected = process.env.ADMIN_PASSWORD;
  if (!s || !expected) return false;
  // Compare HMACs so length/timing of the real password is not leaked.
  const [a, b] = await Promise.all([hmac(s, `pw.${input}`), hmac(s, `pw.${expected}`)]);
  return timingSafeEqual(a, b);
}

/** Basic CSRF defence for mutating admin requests: Origin must match Host. */
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return req.method === "GET" || req.method === "HEAD";
  try {
    const originHost = new URL(origin).host;
    const targetHost =
      req.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
      req.headers.get("host")?.trim() ||
      new URL(req.url).host;
    return originHost === targetHost;
  } catch {
    return false;
  }
}
