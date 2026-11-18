import { NextRequest, NextResponse } from "next/server";
import {
  AB_COOKIE,
  AB_COOKIE_MAX_AGE,
  FUNNEL_PATHS,
  PREVIEW_COOKIE,
  isVariant,
  parseAbCookie,
  parsePreviewCookie,
  resolveAssignment,
  resolveFormVariant,
  serializeAbCookie,
  serializePreviewCookie,
} from "@/lib/ab";
import { getSiteConfig } from "@/lib/config";
import { ADMIN_COOKIE, authConfigured, verifySessionToken } from "@/lib/auth";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/api/admin/login"];

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // ---------- 1. Admin protection ----------
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!authConfigured()) return NextResponse.next();
    if (PUBLIC_ADMIN_PATHS.includes(pathname)) return NextResponse.next();
    const ok = await verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value);
    if (ok) return NextResponse.next();
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const login = req.nextUrl.clone();
    login.pathname = "/admin/login";
    login.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(login);
  }

  // Public API routes need no assignment.
  if (pathname.startsWith("/api/")) return NextResponse.next();

  // ---------- 2. Sticky weighted A/B assignment (before render => no flicker) ----------
  const config = await getSiteConfig();
  const current = parseAbCookie(req.cookies.get(AB_COOKIE)?.value);
  const landing = resolveAssignment(config.experiments.landing, current.landing);
  const funnel = resolveAssignment(config.experiments.funnel, current.funnel);

  // ---------- 3. Admin preview override (logged-in admin, or local unconfigured dev) ----------
  const isAdmin = authConfigured()
    ? await verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value)
    : false;
  let preview = isAdmin ? parsePreviewCookie(req.cookies.get(PREVIEW_COOKIE)?.value) : {};
  let previewCookieOp: "none" | "set" | "clear" = "none";

  if (isAdmin) {
    const previewParam = searchParams.get("preview");
    if (previewParam === "clear") {
      preview = {};
      previewCookieOp = "clear";
    } else if (previewParam) {
      const [exp, v] = previewParam.split(":");
      if ((exp === "landing" || exp === "funnel") && isVariant(v)) {
        preview = { ...preview, [exp]: v };
        previewCookieOp = "set";
      }
    }
  }

  const effectiveLanding = preview.landing ?? landing.assignment.v;
  const effectiveFunnel = preview.funnel ?? funnel.assignment.v;
  const isPreviewActive = Boolean(isAdmin && (preview.landing || preview.funnel));

  // ---------- 4. Form routing for funnel pages ----------
  const isFunnel = FUNNEL_PATHS.includes(pathname);
  const form = isFunnel
    ? preview.funnel
      ? { variant: preview.funnel, routed: true, source: searchParams.get("source") ?? "preview" }
      : resolveFormVariant(config, searchParams.get("source"), effectiveFunnel)
    : null;

  // Strip forged internal headers, then set authoritative server decisions.
  const requestHeaders = new Headers(req.headers);
  for (const h of [
    "x-kr-landing",
    "x-kr-funnel",
    "x-kr-form",
    "x-kr-routed",
    "x-kr-source",
    "x-kr-admin",
    "x-kr-preview",
  ]) {
    requestHeaders.delete(h);
  }
  requestHeaders.set("x-kr-landing", effectiveLanding);
  requestHeaders.set("x-kr-funnel", effectiveFunnel);
  if (isAdmin) requestHeaders.set("x-kr-admin", "1");
  if (isPreviewActive) requestHeaders.set("x-kr-preview", "1");
  if (form) {
    requestHeaders.set("x-kr-form", form.variant);
    requestHeaders.set("x-kr-routed", form.routed ? "1" : "0");
    requestHeaders.set("x-kr-source", form.source);
  }

  const res = NextResponse.next({ request: { headers: requestHeaders } });

  if (!isPreviewActive && (landing.changed || funnel.changed)) {
    res.cookies.set(
      AB_COOKIE,
      serializeAbCookie({ landing: landing.assignment, funnel: funnel.assignment }),
      {
        path: "/",
        maxAge: AB_COOKIE_MAX_AGE,
        sameSite: "lax",
        httpOnly: true,
        secure: req.nextUrl.protocol === "https:",
      }
    );
  }

  if (previewCookieOp === "set") {
    res.cookies.set(PREVIEW_COOKIE, serializePreviewCookie(preview), {
      path: "/",
      maxAge: 60 * 60 * 4,
      sameSite: "lax",
      httpOnly: true,
      secure: req.nextUrl.protocol === "https:",
    });
  } else if (previewCookieOp === "clear") {
    res.cookies.set(PREVIEW_COOKIE, "", { path: "/", maxAge: 0 });
  }

  return res;
}

export const config = {
  // Skip Next internals, static images and any file with an extension.
  matcher: ["/((?!_next/|images/|favicon\\.ico|.*\\.[a-zA-Z0-9]+$).*)"],
};
