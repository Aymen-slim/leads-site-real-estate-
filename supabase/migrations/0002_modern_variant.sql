-- =====================================================================
-- Add Modern NordHjem site variant ('M') to the landing experiment
-- (Modern site shows ONLY its Home A layout — no Modern Home B).
-- =====================================================================

insert into public.variants (experiment_id, key, label, weight, enabled) values
  ('landing', 'M', 'M - Modern NordHjem site (Home A)', 34, true)
on conflict (experiment_id, key) do nothing;

-- Rebalance landing A/B/M to 33/33/34 only if A and B are still at the initial 50/50 seed
update public.variants
set weight = 33
where experiment_id = 'landing'
  and key in ('A', 'B')
  and exists (
    select 1 from public.variants where experiment_id = 'landing' and key = 'M' and weight = 34
  )
  and (select sum(weight) from public.variants where experiment_id = 'landing' and enabled = true) > 100;

insert into public.route_rules (source, label) values
  ('recipe-banner', 'Modern home - fjord recipe banner CTA')
on conflict (source) do nothing;
