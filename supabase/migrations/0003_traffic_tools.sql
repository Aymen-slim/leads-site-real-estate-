-- =====================================================================
-- Seed route_rules for the 11 new traffic-generating Norwegian tools
-- Run once in Supabase SQL Editor (also auto-created on first CTA click)
-- =====================================================================

insert into public.route_rules (source, label) values
  ('tax-calc',        'Tool 6 - capital gains & residency tax'),
  ('partner-buyout',  'Tool 7 - partner buyout & separation split'),
  ('broker-fee',      'Tool 8 - broker fee & DIY vs agency'),
  ('bridge-loan',     'Tool 9 - bridge loan (mellomfinansiering)'),
  ('rent-or-sell',    'Tool 10 - rent out vs sell'),
  ('property-tax',    'Tool 11 - municipal property tax'),
  ('document-fee',    'Tool 12 - 2.5% document fee & buying costs'),
  ('cabin-cost',      'Tool 13 - cabin annual cost & sale'),
  ('energy-rating',   'Tool 14 - energy rating (A-G)'),
  ('ground-lease',    'Tool 15 - ground lease (tomtefeste)'),
  ('sun-conditions',  'Tool 16 - sun conditions (solforhold)')
on conflict (source) do nothing;
