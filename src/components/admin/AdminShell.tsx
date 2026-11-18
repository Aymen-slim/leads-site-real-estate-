"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HouseIcon } from "@/components/Icons";
import {
  ChartBarIcon,
  PagesDocIcon,
  SlidersIcon,
  RouteSplitIcon,
  FunnelStepsIcon,
  UsersLeadsIcon,
  ExternalLinkIcon,
  LogOutIcon,
} from "@/components/AdminIcons";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: ChartBarIcon },
  { href: "/admin/pages", label: "Pages", icon: PagesDocIcon },
  { href: "/admin/experiments", label: "Traffic % & A/B", icon: SlidersIcon },
  { href: "/admin/routing", label: "Form Routing", icon: RouteSplitIcon },
  { href: "/admin/funnel", label: "Funnel Drop-off", icon: FunnelStepsIcon },
  { href: "/admin/leads", label: "Leads & CSV", icon: UsersLeadsIcon },
];

const RANGE_PRESETS = [
  { id: "today", label: "Today" },
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
] as const;

function AdminShellInner({
  children,
  configured,
  authEnabled,
}: {
  children: React.ReactNode;
  configured: boolean;
  authEnabled: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();

  const currentRange = sp.get("range") || "30d";
  const customFrom = sp.get("from") || "";
  const customTo = sp.get("to") || "";

  const buildRangeQs = () => {
    const p = new URLSearchParams();
    p.set("range", currentRange);
    if (currentRange === "custom" && customFrom && customTo) {
      p.set("from", customFrom);
      p.set("to", customTo);
    }
    return p.toString();
  };

  const setRange = (nextRange: string, fromVal?: string, toVal?: string) => {
    const p = new URLSearchParams(sp.toString());
    p.set("range", nextRange);
    if (nextRange === "custom") {
      if (fromVal) p.set("from", fromVal);
      if (toVal) p.set("to", toVal);
    } else {
      p.delete("from");
      p.delete("to");
    }
    router.replace(`${pathname}?${p.toString()}`);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" }).catch(() => {});
    router.push("/admin/login");
    router.refresh();
  };

  const qs = buildRangeQs();

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#292823] flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-[#EDF0E7] border-b border-[#DCE2CF] sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href={`/admin?${qs}`} className="inline-flex items-center gap-2.5 text-[#000000]">
              <span className="w-9 h-9 bg-[#000000] text-[#EDF0E7] flex items-center justify-center shrink-0">
                <HouseIcon className="w-5 h-5" />
              </span>
              <div>
                <span className="block text-[17px] font-semibold text-[#000000] leading-tight">
                  Krogsveen Stil
                </span>
                <span className="block text-[12px] text-[#5D726A] font-medium">
                  Growth &amp; Funnel Control
                </span>
              </div>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Global Date Range Selector */}
            <div
              role="group"
              aria-label="Date range"
              className="inline-flex items-center bg-[#FFFFFF] border border-[#BFBFBD] p-0.5"
            >
              {RANGE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setRange(preset.id)}
                  className={`px-2.5 py-1.5 text-[13px] font-medium cursor-pointer transition-colors ${
                    currentRange === preset.id
                      ? "bg-[#292823] text-[#FFFFFF]"
                      : "text-[#000000] hover:bg-[#EDF0E7]"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  const today = new Date().toISOString().slice(0, 10);
                  const weekAgo = new Date(Date.now() - 6 * 86_400_000).toISOString().slice(0, 10);
                  setRange("custom", customFrom || weekAgo, customTo || today);
                }}
                className={`px-2.5 py-1.5 text-[13px] font-medium cursor-pointer transition-colors ${
                  currentRange === "custom"
                    ? "bg-[#292823] text-[#FFFFFF]"
                    : "text-[#000000] hover:bg-[#EDF0E7]"
                }`}
              >
                Custom
              </button>
            </div>

            {currentRange === "custom" && (
              <div className="flex items-center gap-1.5 bg-[#FFFFFF] border border-[#BFBFBD] px-2 py-1">
                <input
                  type="date"
                  aria-label="From date"
                  value={customFrom}
                  onChange={(e) => setRange("custom", e.target.value, customTo || e.target.value)}
                  className="text-[13px] bg-transparent text-[#000000]"
                />
                <span className="text-[#5A5954]">–</span>
                <input
                  type="date"
                  aria-label="To date"
                  value={customTo}
                  onChange={(e) => setRange("custom", customFrom || e.target.value, e.target.value)}
                  className="text-[13px] bg-transparent text-[#000000]"
                />
              </div>
            )}

            <Link
              href="/"
              target="_blank"
              className="min-h-[36px] px-3 py-1.5 bg-[#FFFFFF] border border-[#5D726A] text-[#000000] hover:bg-[#DCE2CF] text-[13px] font-medium inline-flex items-center gap-1.5"
            >
              <span>Live site</span>
              <ExternalLinkIcon className="w-3.5 h-3.5" />
            </Link>

            {authEnabled ? (
              <button
                type="button"
                onClick={handleLogout}
                className="min-h-[36px] px-3 py-1.5 bg-[#FFFFFF] border border-[#BFBFBD] text-[#292823] hover:bg-[#DCE2CF] text-[13px] font-medium inline-flex items-center gap-1.5 cursor-pointer"
              >
                <LogOutIcon className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            ) : (
              <span className="min-h-[36px] px-3 py-1.5 bg-[#FFF7D4] border border-[#BFBFBD] text-[#000000] text-[12px] font-medium inline-flex items-center">
                Login skipped (no password set)
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Sidebar / Mobile Tab Bar */}
        <aside className="lg:w-60 shrink-0">
          <nav aria-label="Dashboard sections" className="flex lg:flex-col gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={`${item.href}?${qs}`}
                  className={`min-h-[44px] px-3.5 py-2.5 border text-[15px] font-medium inline-flex items-center gap-2.5 whitespace-nowrap transition-colors ${
                    active
                      ? "bg-[#DCE2CF] border-[#5D726A] text-[#000000]"
                      : "bg-[#FFFFFF] border-[#DFDFDF] text-[#292823] hover:bg-[#EDF0E7]"
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#5D726A] shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 space-y-6">
          {!authEnabled && (
            <div className="bg-[#EDF0E7] border border-[#5D726A] px-4 py-3 text-[14px] text-[#292823]">
              <strong>Open preview mode:</strong> Admin login is skipped because{" "}
              <code className="bg-[#FFFFFF] px-1 border border-[#DFDFDF]">ADMIN_PASSWORD</code> and{" "}
              <code className="bg-[#FFFFFF] px-1 border border-[#DFDFDF]">ADMIN_SESSION_SECRET</code> are not set. Set both before deploying to Cloudflare to protect <code className="bg-[#FFFFFF] px-1">/admin</code>.
            </div>
          )}
          {!configured && (
            <div className="bg-[#FFF7D4] border-2 border-[#5D726A] p-4 sm:p-5 text-[15px] text-[#000000]">
              <p className="font-semibold">
                Supabase connection required to store live stats and leads
              </p>
              <p className="mt-1 text-[#292823]">
                Run <code className="bg-[#FFFFFF] px-1.5 py-0.5 border border-[#BFBFBD]">supabase/migrations/0001_dashboard.sql</code> in your Supabase SQL Editor, then set{" "}
                <code className="bg-[#FFFFFF] px-1.5 py-0.5 border border-[#BFBFBD]">SUPABASE_URL</code> and{" "}
                <code className="bg-[#FFFFFF] px-1.5 py-0.5 border border-[#BFBFBD]">SUPABASE_SERVICE_ROLE_KEY</code> in your environment / Cloudflare Worker secrets.
              </p>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminShell({
  children,
  configured,
  authEnabled,
}: {
  children: React.ReactNode;
  configured: boolean;
  authEnabled: boolean;
}) {
  return (
    <Suspense fallback={<div className="p-8 text-[#5D726A]">Loading dashboard...</div>}>
      <AdminShellInner configured={configured} authEnabled={authEnabled}>{children}</AdminShellInner>
    </Suspense>
  );
}
