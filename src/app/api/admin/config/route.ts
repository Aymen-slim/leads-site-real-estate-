import { NextRequest, NextResponse } from "next/server";
import { ExperimentId, isVariant } from "@/lib/ab";
import { isSameOrigin } from "@/lib/auth";
import { getSiteConfig, invalidateSiteConfig } from "@/lib/config";
import { sbUpdate, supabaseConfigured } from "@/lib/supabase";

export async function GET() {
  const config = await getSiteConfig({ fresh: true });
  return NextResponse.json({ configured: supabaseConfigured(), config });
}

export async function PATCH(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const expId = body.experimentId;
  if (expId !== "landing" && expId !== "funnel") {
    return NextResponse.json({ error: "Invalid experimentId" }, { status: 400 });
  }

  const current = (await getSiteConfig({ fresh: true })).experiments[expId as ExperimentId];
  const now = new Date().toISOString();
  const action = body.action;

  try {
    if (action === "winner") {
      if (!isVariant(body.winner)) {
        return NextResponse.json({ error: "Invalid winner variant" }, { status: 400 });
      }
      const winner = body.winner;
      const loser = winner === "A" ? "B" : "A";
      await Promise.all([
        sbUpdate("experiments", `id=eq.${expId}`, {
          status: "winner",
          winner,
          updated_at: now,
        }),
        sbUpdate("variants", `experiment_id=eq.${expId}&key=eq.${winner}`, {
          weight: 100,
          enabled: true,
        }),
        sbUpdate("variants", `experiment_id=eq.${expId}&key=eq.${loser}`, {
          weight: 0,
          enabled: false,
        }),
      ]);
    } else if (action === "resume") {
      // Re-open split test with 50/50 weights if one variant was turned off, and start a fresh round.
      const vA = current.variants.find((v) => v.key === "A");
      const vB = current.variants.find((v) => v.key === "B");
      const bothEnabled = Boolean(vA?.enabled && vB?.enabled && (vA.weight + vB.weight === 100));
      await Promise.all([
        sbUpdate("experiments", `id=eq.${expId}`, {
          status: "running",
          winner: null,
          version: current.version + 1,
          started_at: now,
          updated_at: now,
        }),
        ...(bothEnabled
          ? []
          : [
              sbUpdate("variants", `experiment_id=eq.${expId}&key=eq.A`, {
                weight: 50,
                enabled: true,
              }),
              sbUpdate("variants", `experiment_id=eq.${expId}&key=eq.B`, {
                weight: 50,
                enabled: true,
              }),
            ]),
      ]);
    } else if (action === "reset") {
      await sbUpdate("experiments", `id=eq.${expId}`, {
        status: "running",
        winner: null,
        version: current.version + 1,
        started_at: now,
        updated_at: now,
      });
    } else if (action === "weights") {
      const incoming = Array.isArray(body.variants) ? body.variants : null;
      if (!incoming) {
        return NextResponse.json({ error: "Missing variants array" }, { status: 400 });
      }

      const parsed: { key: "A" | "B"; weight: number; enabled: boolean }[] = [];
      for (const item of incoming) {
        if (!item || typeof item !== "object") continue;
        const k = (item as { key?: unknown }).key;
        const w = Number((item as { weight?: unknown }).weight);
        const en = Boolean((item as { enabled?: unknown }).enabled);
        if (!isVariant(k) || !Number.isInteger(w) || w < 0 || w > 100) {
          return NextResponse.json({ error: "Invalid variant weight" }, { status: 400 });
        }
        parsed.push({ key: k, weight: en ? w : 0, enabled: en });
      }

      const enabled = parsed.filter((v) => v.enabled);
      if (enabled.length === 0) {
        return NextResponse.json({ error: "At least one variant must stay enabled" }, { status: 400 });
      }
      const sum = enabled.reduce((acc, v) => acc + v.weight, 0);
      if (sum !== 100) {
        return NextResponse.json(
          { error: `Enabled variant weights must sum to 100% (got ${sum}%)` },
          { status: 400 }
        );
      }

      await Promise.all(
        parsed.map((v) =>
          sbUpdate("variants", `experiment_id=eq.${expId}&key=eq.${v.key}`, {
            weight: v.weight,
            enabled: v.enabled,
          })
        )
      );

      const resetRound = Boolean(body.resetRound);
      await sbUpdate("experiments", `id=eq.${expId}`, {
        status: "running",
        winner: null,
        ...(resetRound ? { version: current.version + 1, started_at: now } : {}),
        updated_at: now,
      });
    } else {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    invalidateSiteConfig();
    const updated = await getSiteConfig({ fresh: true });
    return NextResponse.json({ ok: true, config: updated });
  } catch (err) {
    console.error("[api/admin/config] update failed:", err);
    return NextResponse.json({ error: "Failed to save config" }, { status: 500 });
  }
}
