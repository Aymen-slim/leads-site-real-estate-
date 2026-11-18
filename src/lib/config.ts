import {
  DEFAULT_CONFIG,
  ExperimentConfig,
  ExperimentId,
  RouteDestination,
  SiteConfig,
  Variant,
  VariantConfig,
} from "@/lib/ab";
import { sbSelect, supabaseConfigured } from "@/lib/supabase";

// Short in-memory cache per Worker isolate: dashboard changes go live within ~30s.
const TTL_MS = 30_000;
let cache: { at: number; data: SiteConfig } | null = null;
let inflight: Promise<SiteConfig> | null = null;

interface ExperimentRow {
  id: ExperimentId;
  name: string;
  status: "running" | "winner";
  winner: Variant | null;
  version: number;
  started_at: string;
}
interface VariantRow {
  experiment_id: ExperimentId;
  key: Variant;
  label: string;
  weight: number;
  enabled: boolean;
}
interface RouteRow {
  source: string;
  destination: RouteDestination;
}

async function load(): Promise<SiteConfig> {
  const [exps, vars, routes] = await Promise.all([
    sbSelect<ExperimentRow>("experiments?select=id,name,status,winner,version,started_at"),
    sbSelect<VariantRow>("variants?select=experiment_id,key,label,weight,enabled&order=key.asc"),
    sbSelect<RouteRow>("route_rules?select=source,destination"),
  ]);

  const experiments = { ...DEFAULT_CONFIG.experiments };
  for (const e of exps.rows) {
    const variants: VariantConfig[] = vars.rows
      .filter((v) => v.experiment_id === e.id)
      .map((v) => ({ key: v.key, label: v.label, weight: v.weight, enabled: v.enabled }));
    experiments[e.id] = {
      ...e,
      variants: variants.length ? variants : DEFAULT_CONFIG.experiments[e.id].variants,
    } as ExperimentConfig;
  }

  const routeMap: Record<string, RouteDestination> = { ...DEFAULT_CONFIG.routes };
  for (const r of routes.rows) routeMap[r.source] = r.destination;

  return { experiments, routes: routeMap };
}

export async function getSiteConfig(opts: { fresh?: boolean } = {}): Promise<SiteConfig> {
  if (!supabaseConfigured()) return DEFAULT_CONFIG;
  const now = Date.now();
  if (!opts.fresh && cache && now - cache.at < TTL_MS) return cache.data;
  if (!inflight) {
    inflight = load()
      .then((data) => {
        cache = { at: Date.now(), data };
        return data;
      })
      .catch((err) => {
        console.error("[config] falling back:", err);
        return cache?.data ?? DEFAULT_CONFIG; // stale-on-error
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export function invalidateSiteConfig() {
  cache = null;
}
