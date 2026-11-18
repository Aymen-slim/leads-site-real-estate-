"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { HouseIcon, ArrowRightIcon, ShieldCheckIcon } from "@/components/Icons";

function LoginFormInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const nextRaw = sp.get("next") || "/admin";
  const nextUrl = nextRaw.startsWith("/admin") ? nextRaw : "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [authEnabled, setAuthEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/login", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { authConfigured?: boolean }) => setAuthEnabled(Boolean(d.authConfigured)))
      .catch(() => setAuthEnabled(true));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || submitting) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setError(j.error || "Invalid password");
        return;
      }
      router.push(nextUrl);
      router.refresh();
    } catch {
      setError("Network error while signing in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#EDF0E7] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FFFFFF] border-2 border-[#5D726A] p-7 sm:p-9 space-y-6">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 bg-[#000000] text-[#EDF0E7] flex items-center justify-center shrink-0">
            <HouseIcon className="w-5 h-5" />
          </span>
          <div>
            <h1 className="font-serif text-[28px] leading-tight text-[#000000]">
              Admin Dashboard
            </h1>
            <p className="text-[14px] text-[#5D726A] font-medium">
              Krogsveen Stil — Seller Funnel Control
            </p>
          </div>
        </div>

        {authEnabled === false && (
          <div className="bg-[#EDF0E7] border-2 border-[#5D726A] p-4 space-y-3">
            <p className="text-[14px] text-[#000000] font-medium">
              No admin password is configured yet (<code className="bg-[#FFFFFF] px-1">ADMIN_PASSWORD</code>). You can skip login and open the dashboard directly.
            </p>
            <Link
              href={nextUrl}
              className="kr-btn-primary w-full min-h-[48px] border border-[#5D726A] text-[16px]"
            >
              <span>Skip Login &amp; Open Dashboard</span>
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-password"
              className="block text-[15px] font-medium text-[#000000] mb-1.5"
            >
              Admin Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter dashboard password"
              className="w-full min-h-[52px] px-4 py-2.5 bg-[#F7F7F7] border-2 border-[#5D726A] text-[17px] text-[#000000]"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="p-3 bg-[hsl(6deg_100%_97%)] border border-[#BA5B3E] text-[#BA5B3E] text-[14px] font-medium"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="kr-btn-primary w-full min-h-[52px] border border-[#5D726A] text-[17px] disabled:opacity-60"
          >
            <span>{submitting ? "Signing in..." : "Sign in to Dashboard"}</span>
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#DFDFDF] flex items-center justify-between text-[13px] text-[#5A5954]">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheckIcon className="w-4 h-4 text-[#5D726A]" />
            <span>Protected by HMAC session cookie</span>
          </span>
          <Link href="/" className="underline decoration-[#5D726A] text-[#000000]">
            Back to site
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#EDF0E7]" />}>
      <LoginFormInner />
    </Suspense>
  );
}
