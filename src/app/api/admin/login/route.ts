import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_SECONDS,
  authConfigured,
  checkPassword,
  createSessionToken,
  isSameOrigin,
} from "@/lib/auth";
import { PREVIEW_COOKIE } from "@/lib/ab";

export async function GET() {
  return NextResponse.json({ authConfigured: authConfigured() });
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  if (!authConfigured()) {
    return NextResponse.json(
      { error: "Admin auth not configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET (32+ chars)." },
      { status: 503 }
    );
  }

  let password = "";
  try {
    const body = (await req.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const valid = await checkPassword(password);
  if (!valid) {
    // Small constant-feel delay to slow brute force attempts
    await new Promise((r) => setTimeout(r, 350));
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: req.nextUrl.protocol === "https:",
    maxAge: ADMIN_SESSION_SECONDS,
  });
  return res;
}

export async function DELETE(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set(PREVIEW_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
