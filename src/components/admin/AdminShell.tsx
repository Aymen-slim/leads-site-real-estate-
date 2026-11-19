"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  { href: "/admin/experiments", label: "Traffic % & Sites", icon: SlidersIcon },
  { href: "/admin/routing", label: "Form Routing", icon: RouteSplitIcon },
  { href: "/admin/funnel", label: "Funnel Drop-off", icon: FunnelStepsIcon },
  { href: "/admin/leads", label: "Leads & CSV", icon: UsersLeadsIcon },
];

const RANGE_PRESETS = [
  { id: "today", label: "Today" },
  { id: "7d", label: "7d" },
  { id: "30d", label: "30d" },
  { id: "90d", label: "90d" },
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
    <div className="min-h-screen bg-[#F4F6F5] text-[#14201A] font-modern flex flex-col">
      {/* Frosted Top Navigation */}
      <header className="bg-[#FFFFFF]/85 backdrop-blur-md border-b border-[#E2E8E4] sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <Link href={`/admin?${qs}`} className="inline-flex items-center gap-3 group">
            <Image
              src="/images/vurderboligen-logo.png"
              alt="VurderBoligen"
              width={180}
              height={31}
              priority
              className="h-7 sm:h-8 w-auto"
            />
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#EEF2EF] text-[#14533C] text-[11px] font-semibold">
              Studio
            </span>
          </Link>

          <div className="flex items-center gap-2 overflow-x-auto">
            {/* Pill Date Range Switcher */}
            <div
              role="group"
              aria-label="Date range"
              className="inline-flex items-center bg-[#EEF2EF] rounded-full p-1 border border-[#DFE6E1] shrink-0"
            >
              {RANGE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setRange(preset.id)}
                  className={`px-3 py-1 rounded-full text-[13px] font-medium cursor-pointer transition-all ${
                    currentRange === preset.id
                      ? "bg-[#FFFFFF] text-[#0F291E] font-semibold shadow-xs"
                      : "text-[#4D6157] hover:text-[#0F291E]"
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
                className={`px-3 py-1 rounded-full text-[13px] font-medium cursor-pointer transition-all ${
                  currentRange === "custom"
                    ? "bg-[#FFFFFF] text-[#0F291E] font-semibold shadow-xs"
                    : "text-[#4D6157] hover:text-[#0F291E]"
                }`}
              >
                Custom
              </button>
            </div>

            {currentRange === "custom" && (
              <div className="hidden md:flex items-center gap-1.5 bg-[#FFFFFF] border border-[#D8E1DC] rounded-full px-3 py-1 text-[13px]">
                <input
                  type="date"
                  aria-label="From date"
                  value={customFrom}
                  onChange={(e) => setRange("custom", e.target.value, customTo || e.target.value)}
                  className="bg-transparent text-[#0F291E] outline-none"
                />
                <span className="text-[#788B81]">→</span>
                <input
                  type="date"
                  aria-label="To date"
                  value={customTo}
                  onChange={(e) => setRange("custom", customFrom || e.target.value, e.target.value)}
                  className="bg-transparent text-[#0F291E] outline-none"
                />
              </div>
            )}

            <Link
              href="/"
              target="_blank"
              className="h-9 px-3.5 rounded-full bg-[#FFFFFF] border border-[#D5DFD9] text-[#0F291E] hover:bg-[#EAF4EF] hover:border-[#147A53]/40 text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors shrink-0"
            >
              <span>Live site</span>
              <ExternalLinkIcon className="w-3.5 h-3.5 text-[#147A53]" />
            </Link>

            {authEnabled ? (
              <button
                type="button"
                onClick={handleLogout}
                className="h-9 px-3.5 rounded-full bg-[#F4F6F5] hover:bg-[#E7ECE9] border border-[#DCE3DF] text-[#3B4E44] text-[13px] font-medium inline-flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
              >
                <LogOutIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            ) : (
              <span className="h-9 px-3 rounded-full bg-[#FEF6E2] border border-[#EED9A4] text-[#7A4E00] text-[12px] font-semibold inline-flex items-center shrink-0">
                Preview (Auth off)
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:w-60 shrink-0">
          <div className="lg:sticky lg:top-24 bg-[#FFFFFF] border border-[#E2E8E4] rounded-2xl p-2 shadow-[0_1px_2px_rgba(15,41,30,0.03),0_6px_18px_rgba(15,41,30,0.03)]">
            <nav
              aria-label="Dashboard sections"
              className="flex lg:flex-col gap-1 overflow-x-auto"
            >
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
                    className={`min-h-[42px] px-3.5 py-2.5 rounded-xl text-[14px] font-medium inline-flex items-center gap-2.5 whitespace-nowrap transition-all ${
                      active
                        ? "bg-[#0F291E] text-[#FFFFFF] font-semibold shadow-xs"
                        : "text-[#43564C] hover:bg-[#F2F6F4] hover:text-[#0F291E]"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        active ? "text-[#7CE5B5]" : "text-[#637B6F]"
                      }`}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 space-y-6">
          {!authEnabled && (
            <div className="rounded-2xl bg-[#FEF6E2] border border-[#ECD8A4] px-4 py-3 text-[13px] text-[#6B4500] flex items-center justify-between gap-3">
              <span>
                <strong>Open preview mode:</strong> Set{" "}
                <code className="bg-[#FFFFFF]/80 px-1.5 py-0.5 rounded-md border border-[#E6CE91]">
                  ADMIN_PASSWORD
                </code>{" "}
                and{" "}
                <code className="bg-[#FFFFFF]/80 px-1.5 py-0.5 rounded-md border border-[#E6CE91]">
                  ADMIN_SESSION_SECRET
                </code>{" "}
                before deploying to lock <code className="font-mono">/admin</code>.
              </span>
            </div>
          )}

          {!configured && (
            <div className="rounded-2xl bg-[#FFFFFF] border border-[#EED9A4] p-4 sm:p-5 text-[14px] text-[#14201A] shadow-xs">
              <p className="font-semibold text-[#7A4E00]">
                Supabase connection required to store live analytics and leads
              </p>
              <p className="mt-1 text-[#4D6157]">
                Run{" "}
                <code className="bg-[#F4F6F5] px-1.5 py-0.5 rounded-md border border-[#DFE6E1]">
                  supabase/migrations/0001_dashboard.sql
                </code>{" "}
                and set <code className="font-mono">SUPABASE_URL</code> +{" "}
                <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code>.
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
    <Suspense fallback={<div className="p-8 text-[#147A53] font-modern">Loading dashboard...</div>}>
      <AdminShellInner configured={configured} authEnabled={authEnabled}>
        {children}
      </AdminShellInner>
    </Suspense>
  );
}
