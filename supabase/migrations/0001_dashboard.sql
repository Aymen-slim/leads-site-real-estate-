-- =====================================================================
-- Krogsveen Stil — Admin dashboard schema (A/B traffic, analytics, leads)
-- Run once in Supabase: Dashboard -> SQL Editor -> paste -> Run.
-- All tables have RLS enabled with NO policies: only the server-side
-- service-role / secret key can read or write. Never expose that key.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 1. Experiments (traffic split control)
-- ---------------------------------------------------------------------
create table if not exists public.experiments (
  id          text primary key,                       -- 'landing' | 'funnel'
  name        text not null,
  status      text not null default 'running'
              check (status in ('running', 'winner')),
  winner      text,                                    -- variant key when status = 'winner'
  version     int  not null default 1,                 -- bump = everyone re-assigned
  started_at  timestamptz not null default now(),      -- stats window start for this round
  updated_at  timestamptz not null default now()
);

create table if not exists public.variants (
  experiment_id text not null references public.experiments(id) on delete cascade,
  key           text not null,                         -- 'A' | 'B'
  label         text not null,
  weight        int  not null default 50 check (weight between 0 and 100),
  enabled       boolean not null default true,
  primary key (experiment_id, key)
);

-- ---------------------------------------------------------------------
-- 2. Form routing: which form a CTA source opens
--    destination: 'split' = follow funnel experiment, 'A' / 'B' = forced
--    source '*' is the fallback for unknown sources
-- ---------------------------------------------------------------------
create table if not exists public.route_rules (
  source      text primary key,
  label       text,
  destination text not null default 'split' check (destination in ('split', 'A', 'B')),
  first_seen  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3. Events (first-party analytics)
--    types: page_view | page_time | cta_click | funnel_view | funnel_step
-- ---------------------------------------------------------------------
create table if not exists public.events (
  id              bigint generated always as identity primary key,
  created_at      timestamptz not null default now(),
  type            text not null,
  path            text not null,
  view_id         text,                                -- one id per page view (time is summed per view)
  session_id      text not null,
  visitor_id      text,                                -- only with analytics consent
  landing_variant text,
  funnel_variant  text,
  routed          boolean not null default false,
  source          text,
  step            text,
  duration_ms     int,
  referrer        text,
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  device          text,
  consent         boolean not null default false
);

create index if not exists events_created_idx      on public.events (created_at);
create index if not exists events_type_created_idx on public.events (type, created_at);
create index if not exists events_session_idx      on public.events (session_id);
create index if not exists events_path_created_idx on public.events (path, created_at);

-- ---------------------------------------------------------------------
-- 4. Leads (form submissions = conversions)
-- ---------------------------------------------------------------------
create table if not exists public.leads (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  name            text not null,
  phone           text not null,
  property_type   text,
  size            text,
  city            text,
  area            text,
  timeline        text,
  property_text   text,                                -- funnel B typed answer
  location_text   text,                                -- funnel B typed answer
  source          text,                                -- CTA that opened the form (last touch)
  landing_page    text,                                -- first page of the session (first touch)
  landing_variant text,
  form_variant    text,                                -- form actually shown: 'A' | 'B'
  routed          boolean not null default false,      -- true = forced by routing rule (excluded from A/B stats)
  session_id      text,
  visitor_id      text,
  referrer        text,
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  lang            text,
  details         jsonb not null default '{}'::jsonb,  -- price, net, heirs, repairs, zone ...
  status          text not null default 'new'
                  check (status in ('new', 'contacted', 'won', 'lost')),
  notes           text
);

create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_source_idx  on public.leads (source);
create index if not exists leads_session_idx on public.leads (session_id);

-- ---------------------------------------------------------------------
-- 5. Security: RLS on, no policies => anon/authenticated get nothing
-- ---------------------------------------------------------------------
alter table public.experiments enable row level security;
alter table public.variants    enable row level security;
alter table public.route_rules enable row level security;
alter table public.events      enable row level security;
alter table public.leads       enable row level security;

-- ---------------------------------------------------------------------
-- 6. Seed data
-- ---------------------------------------------------------------------
insert into public.experiments (id, name) values
  ('landing', 'Landing page (home hero)'),
  ('funnel',  'Seller form (Connect agency)')
on conflict (id) do nothing;

insert into public.variants (experiment_id, key, label, weight) values
  ('landing', 'A', 'A - Split photo hero + calculator', 50),
  ('landing', 'B', 'B - Sage hero, single CTA',          50),
  ('funnel',  'A', 'A - Tap cards, 5 steps',             50),
  ('funnel',  'B', 'B - Single page typed form',         50)
on conflict do nothing;

insert into public.route_rules (source, label) values
  ('*',           'Fallback (unknown / no source)'),
  ('nav',         'Menu / navigation links'),
  ('hero-a',      'Home A - hero button'),
  ('landing-b',   'Home B - hero button'),
  ('growth-calc', 'Home - price growth calculator'),
  ('land-value',  'Home - land value section'),
  ('sell-as-is',  'Home - sell as-is section'),
  ('sample-ads',  'Home - sample ads header CTA'),
  ('tools-hub',   'Tools overview page CTA'),
  ('ad-villa',    'Sample ad - villa'),
  ('ad-land',     'Sample ad - land plot'),
  ('ad-family',   'Sample ad - family house'),
  ('price-m2',    'Tool 1 - price per m2'),
  ('net-cash',    'Tool 2 - net cash'),
  ('land',        'Tool 3 - land buildability'),
  ('inheritance', 'Tool 4 - inherited property'),
  ('as-is',       'Tool 5 - sell as-is vs fix')
on conflict (source) do nothing;

-- =====================================================================
-- 7. Dashboard functions (called through PostgREST /rpc/...)
-- =====================================================================

-- Overview KPIs + daily series + top sources
create or replace function public.dash_overview(p_from timestamptz, p_to timestamptz)
returns json language sql stable as $$
  with ev as (
    select * from public.events where created_at >= p_from and created_at < p_to
  ),
  views as (
    select view_id, sum(duration_ms) as ms
    from ev where type = 'page_time' and view_id is not null
    group by view_id
  ),
  ld as (
    select * from public.leads where created_at >= p_from and created_at < p_to
  )
  select json_build_object(
    'page_views', (select count(*) from ev where type = 'page_view'),
    'sessions',   (select count(distinct session_id) from ev where type = 'page_view'),
    'visitors',   (select count(distinct visitor_id) from ev where type = 'page_view' and visitor_id is not null),
    'avg_time_ms',(select coalesce(round(avg(ms)), 0) from views),
    'cta_clicks', (select count(*) from ev where type = 'cta_click'),
    'leads',      (select count(*) from ld),
    'daily', coalesce((
      select json_agg(d order by d.day) from (
        select days.day::date as day,
          (select count(*) from ev where type = 'page_view'
             and (created_at at time zone 'Europe/Oslo')::date = days.day::date) as page_views,
          (select count(distinct session_id) from ev where type = 'page_view'
             and (created_at at time zone 'Europe/Oslo')::date = days.day::date) as sessions,
          (select count(*) from ld
             where (created_at at time zone 'Europe/Oslo')::date = days.day::date) as leads
        from generate_series(
          (p_from at time zone 'Europe/Oslo')::date,
          ((p_to - interval '1 second') at time zone 'Europe/Oslo')::date,
          interval '1 day') as days(day)
      ) d
    ), '[]'::json),
    'top_sources', coalesce((
      select json_agg(s order by s.leads desc, s.clicks desc) from (
        select x.* from (
          select src as source,
            (select count(*) from ev where type = 'cta_click' and coalesce(ev.source, 'nav') = src) as clicks,
            (select count(*) from ld where coalesce(ld.source, 'nav') = src) as leads
          from (
            select coalesce(source, 'nav') as src from ev where type = 'cta_click'
            union
            select coalesce(source, 'nav') from ld
          ) u
        ) x
        order by x.leads desc, x.clicks desc
        limit 12
      ) s
    ), '[]'::json)
  );
$$;

-- Per-page stats
drop function if exists public.dash_pages(timestamptz, timestamptz);
create or replace function public.dash_pages(p_from timestamptz, p_to timestamptz)
returns table (
  path text, views bigint, sessions bigint, visitors bigint, avg_time_ms numeric,
  exits bigint, cta_clicks bigint, lead_sessions bigint, first_touch_leads bigint
) language sql stable as $$
  with ev as (
    select * from public.events where created_at >= p_from and created_at < p_to
  ),
  pv as (select * from ev where type = 'page_view'),
  times as (
    select e.path, e.view_id, sum(e.duration_ms) as ms
    from ev e where e.type = 'page_time' and e.view_id is not null
    group by e.path, e.view_id
  ),
  last_pv as (
    select distinct on (session_id) session_id, path
    from pv order by session_id, created_at desc
  ),
  ld as (
    select session_id, landing_page from public.leads
    where created_at >= p_from and created_at < p_to
  ),
  lead_s as (
    select distinct session_id from ld where session_id is not null
  )
  select
    p.path,
    count(*)                                                as views,
    count(distinct p.session_id)                            as sessions,
    count(distinct p.visitor_id)                            as visitors,
    coalesce((select round(avg(t.ms)) from times t where t.path = p.path), 0) as avg_time_ms,
    (select count(*) from last_pv l where l.path = p.path)  as exits,
    (select count(*) from ev c where c.type = 'cta_click' and c.path = p.path) as cta_clicks,
    count(distinct p.session_id) filter (where p.session_id in (select session_id from lead_s)) as lead_sessions,
    (select count(*) from ld where ld.landing_page = p.path) as first_touch_leads
  from pv p
  group by p.path
  order by views desc;
$$;

-- Experiment results per variant (exposure = session, conversion = lead in that session)
create or replace function public.dash_experiment(p_exp text, p_from timestamptz, p_to timestamptz)
returns table (variant text, exposures bigint, conversions bigint)
language sql stable as $$
  with expo as (
    select distinct on (session_id) session_id,
      case when p_exp = 'landing' then landing_variant else funnel_variant end as variant
    from public.events
    where created_at >= p_from and created_at < p_to
      and (
        (p_exp = 'landing' and type = 'page_view' and path = '/')
        or (p_exp = 'funnel' and type = 'funnel_view' and routed = false)
      )
    order by session_id, created_at asc
  ),
  conv as (
    select distinct session_id from public.leads
    where created_at >= p_from and created_at < p_to and session_id is not null
      and (p_exp = 'landing' or routed = false)
  )
  select e.variant,
         count(*) as exposures,
         count(*) filter (where e.session_id in (select session_id from conv)) as conversions
  from expo e
  where e.variant is not null
  group by e.variant
  order by e.variant;
$$;

-- Funnel step drop-off (distinct sessions reaching each step)
drop function if exists public.dash_funnel(timestamptz, timestamptz);
drop function if exists public.dash_funnel(timestamptz, timestamptz, boolean);
create or replace function public.dash_funnel(
  p_from timestamptz,
  p_to timestamptz,
  p_include_routed boolean default true
)
returns table (variant text, step text, sessions bigint)
language sql stable as $$
  select
    funnel_variant as variant,
    case when type = 'funnel_view' then 'view' else step end as step,
    count(distinct session_id) as sessions
  from public.events
  where type in ('funnel_view', 'funnel_step')
    and created_at >= p_from and created_at < p_to
    and funnel_variant is not null
    and (type = 'funnel_view' or step is not null)
    and (p_include_routed or routed = false)
  group by 1, 2;
$$;

-- Per-source clicks and leads (for the routing page)
create or replace function public.dash_sources(p_from timestamptz, p_to timestamptz)
returns table (source text, clicks bigint, leads bigint)
language sql stable as $$
  with c as (
    select coalesce(source, 'nav') as source, count(*) as clicks
    from public.events
    where type = 'cta_click' and created_at >= p_from and created_at < p_to
    group by 1
  ),
  l as (
    select coalesce(source, 'nav') as source, count(*) as leads
    from public.leads where created_at >= p_from and created_at < p_to
    group by 1
  )
  select coalesce(c.source, l.source), coalesce(c.clicks, 0), coalesce(l.leads, 0)
  from c full outer join l on c.source = l.source;
$$;

-- Distinct values for the leads filter dropdowns
create or replace function public.dash_lead_facets()
returns json language sql stable as $$
  select json_build_object(
    'sources',       coalesce((select json_agg(distinct source)        from public.leads where source is not null), '[]'::json),
    'landing_pages', coalesce((select json_agg(distinct landing_page)  from public.leads where landing_page is not null), '[]'::json),
    'cities',        coalesce((select json_agg(distinct city)          from public.leads where city is not null), '[]'::json),
    'utm_sources',   coalesce((select json_agg(distinct utm_source)    from public.leads where utm_source is not null), '[]'::json)
  );
$$;

-- Lock functions down to the service role
revoke all on function public.dash_overview(timestamptz, timestamptz)            from public, anon, authenticated;
revoke all on function public.dash_pages(timestamptz, timestamptz)               from public, anon, authenticated;
revoke all on function public.dash_experiment(text, timestamptz, timestamptz)    from public, anon, authenticated;
revoke all on function public.dash_funnel(timestamptz, timestamptz, boolean)     from public, anon, authenticated;
revoke all on function public.dash_sources(timestamptz, timestamptz)             from public, anon, authenticated;
revoke all on function public.dash_lead_facets()                                 from public, anon, authenticated;
grant execute on function public.dash_overview(timestamptz, timestamptz)         to service_role;
grant execute on function public.dash_pages(timestamptz, timestamptz)            to service_role;
grant execute on function public.dash_experiment(text, timestamptz, timestamptz) to service_role;
grant execute on function public.dash_funnel(timestamptz, timestamptz, boolean)  to service_role;
grant execute on function public.dash_sources(timestamptz, timestamptz)          to service_role;
grant execute on function public.dash_lead_facets()                              to service_role;
