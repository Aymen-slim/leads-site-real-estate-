"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRightIcon, ShieldCheckIcon } from "@/components/Icons";

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
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,#E6F2EC_0%,#F4F6F5_55%,#EEF1EF_100%)] font-modern flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FFFFFF] border border-[#DCE5DF] rounded-3xl p-7 sm:p-9 shadow-[0_20px_60px_rgba(15,41,30,0.08)] space-y-6">
        <div className="space-y-1.5">
          <Image
            src="/images/vurderboligen-logo.png"
            alt="VurderBoligen"
            width={210}
            height={36}
            priority
            className="h-9 w-auto"
          />
          <p className="text-[13px] text-[#566A60] font-medium">
            Admin Dashboard · Traffic %, Form Routing &amp; Lead Analytics
          </p>
        </div>

        {authEnabled === false && (
          <div className="rounded-2xl bg-[#EAF4EF] border border-[#C6E1D3] p-4 space-y-3">
            <p className="text-[13px] text-[#0F291E] font-medium leading-relaxed">
              No admin password is configured yet (<code className="bg-[#FFFFFF] px-1.5 py-0.5 rounded">ADMIN_PASSWORD</code>). You can skip login and open the dashboard directly.
            </p>
            <Link
              href={nextUrl}
              className="nm-btn-primary w-full min-h-[46px] text-[15px]"
            >
              <span>Skip Login &amp; Open Dashboard</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-password"
              className="block text-[14px] font-semibold text-[#14201A] mb-1.5"
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
              className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#F7FAF8] border border-[#CFDAD3] focus:border-[#147A53] focus:bg-[#FFFFFF] text-[16px] text-[#0F291E] outline-none transition-colors"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="p-3 rounded-xl bg-[#FEF2F0] border border-[#F0C2B9] text-[#B8422C] text-[13px] font-medium"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full min-h-[48px] px-5 py-3 rounded-full bg-[#0F291E] hover:bg-[#147A53] text-[#FFFFFF] text-[15px] font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60 shadow-sm"
          >
            <span>{submitting ? "Signing in..." : "Sign in to Dashboard"}</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#EAEFEA] flex items-center justify-between text-[12px] text-[#5B7065]">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheckIcon className="w-4 h-4 text-[#147A53]" />
            <span>Signed HMAC session</span>
          </span>
          <Link href="/" className="font-semibold text-[#0F291E] hover:text-[#147A53] transition-colors">
            Back to site →
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F6F5]" />}>
      <LoginFormInner />
    </Suspense>
  );
}
