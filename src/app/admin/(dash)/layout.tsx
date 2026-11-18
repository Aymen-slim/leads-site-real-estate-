import React from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { authConfigured } from "@/lib/auth";
import { supabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminShell configured={supabaseConfigured()} authEnabled={authConfigured()}>
      {children}
    </AdminShell>
  );
}
