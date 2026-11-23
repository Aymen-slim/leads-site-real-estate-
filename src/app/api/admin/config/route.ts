import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_CONFIG,
  ExperimentId,
  Variant,
  isVariantForExperiment,
} from "@/lib/ab";
import { isSameOrigin } from "@/lib/auth";
import { getSiteConfig, invalidateSiteConfig } from "@/lib/config";
import { sbInsert, sbUpdate, supabaseConfigured, supabaseErrorResponse } from "@/lib/supabase";

export async function GET() {
  const config = await getSiteConfig({ fresh: true });
  return NextResponse.json({ configured: supabaseConfigured(), config });
}

function equalWeights(count: number): number[] {
  const base = Math.floor(100 / count);
  const rem = 100 - base * count;
  return Array.from({ length: count }, (_, i) => base + (i === count - 1 ? rem : 0));
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
  const expectedDefs = DEFAULT_CONFIG.experiments[expId as ExperimentId].variants;
  const labelFor = (key: Variant) =>
    current.variants.find((v) => v.key === key)?.label ??
    expectedDefs.find((v) => v.key === key)?.label ??
    `Variant ${key}`;

  const now = new Date().toISOString();
  const action = body.action;

  try {
    if (action === "winner") {
      if (!isVariantForExperiment(expId, body.winner)) {
        return NextResponse.json({ error: "Invalid winner variant" }, { status: 400 });
      }
      const winner = body.winner;
      const upsertRows = expectedDefs.map((def) => ({
        experiment_id: expId,
        key: def.key,
        label: labelFor(def.key),
        weight: def.key === winner ? 100 : 0,
        enabled: def.key === winner,
      }));
      await Promise.all([
        sbUpdate("experiments", `id=eq.${expId}`, {
          status: "winner",
          winner,
          updated_at: now,
        }),
        sbInsert("variants", upsertRows, { upsert: true, onConflict: "experiment_id,key" }),
      ]);
    } else if (action === "resume") {
      const enabledCount = current.variants.filter((v) => v.enabled).length;
      const weightSum = current.variants
        .filter((v) => v.enabled)
        .reduce((acc, v) => acc + v.weight, 0);
      const validExisting = enabledCount >= 2 && weightSum === 100;

      const eq = equalWeights(expectedDefs.length);
      const upsertRows = expectedDefs.map((def, idx) => ({
        experiment_id: expId,
        key: def.key,
        label: labelFor(def.key),
        weight: eq[idx],
        enabled: true,
      }));

      await Promise.all([
        sbUpdate("experiments", `id=eq.${expId}`, {
          status: "running",
          winner: null,
          version: current.version + 1,
          started_at: now,
          updated_at: now,
        }),
        ...(validExisting
          ? []
          : [sbInsert("variants", upsertRows, { upsert: true, onConflict: "experiment_id,key" })]),
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

      const parsed: { key: Variant; weight: number; enabled: boolean }[] = [];
      for (const item of incoming) {
        if (!item || typeof item !== "object") continue;
        const k = (item as { key?: unknown }).key;
        const w = Number((item as { weight?: unknown }).weight);
        const en = Boolean((item as { enabled?: unknown }).enabled);
        if (!isVariantForExperiment(expId, k) || !Number.isInteger(w) || w < 0 || w > 100) {
          return NextResponse.json({ error: "Invalid variant weight" }, { status: 400 });
        }
        parsed.push({ key: k, weight: en ? w : 0, enabled: en });
      }

      const enabled = parsed.filter((v) => v.enabled);
      if (enabled.length === 0) {
        return NextResponse.json(
          { error: "At least one variant must stay enabled" },
          { status: 400 }
        );
      }
      const sum = enabled.reduce((acc, v) => acc + v.weight, 0);
      if (sum !== 100) {
        return NextResponse.json(
          { error: `Enabled variant weights must sum to 100% (got ${sum}%)` },
          { status: 400 }
        );
      }

      const upsertRows = parsed.map((v) => ({
        experiment_id: expId,
        key: v.key,
        label: labelFor(v.key),
        weight: v.weight,
        enabled: v.enabled,
      }));

      await sbInsert("variants", upsertRows, { upsert: true, onConflict: "experiment_id,key" });

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
    const { status, error } = supabaseErrorResponse(err, "Failed to save config");
    return NextResponse.json({ error }, { status });
  }
}
