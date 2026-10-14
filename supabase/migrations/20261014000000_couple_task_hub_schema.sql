-- Couple Task Hub: Supabase Realtime Database Schema & Row-Level Security
-- Supports multi-device live pairing for couples

-- 1. Households Table
create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Our Household',
  join_code text unique default upper(substring(md5(random()::text) from 1 for 6)),
  created_at timestamptz not null default now()
);

-- 2. Partners Table
create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  key text not null check (key in ('alex', 'sam')),
  name text not null,
  points integer not null default 0,
  streak integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (household_id, key)
);

-- 3. Routines Table (Board 1: Habit checklist)
create table if not exists public.routines (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  title text not null,
  assignee text not null default 'both' check (assignee in ('mine', 'partner', 'both')),
  frequency text not null default 'daily',
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

-- 4. Routine Completions Table (Calendar-day history)
create table if not exists public.routine_completions (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.routines(id) on delete cascade,
  date_key text not null, -- YYYY-MM-DD
  completed boolean not null default false,
  completed_by text, -- 'alex' or 'sam'
  updated_at timestamptz not null default now(),
  unique (routine_id, date_key)
);

-- 5. Daily Tasks Table (Board 2: Immediate ad-hoc daily tasks)
create table if not exists public.daily_tasks (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  title text not null,
  assignee text not null default 'mine' check (assignee in ('mine', 'partner', 'both')),
  target_date text not null, -- YYYY-MM-DD
  origin_date text not null, -- YYYY-MM-DD
  completed boolean not null default false,
  notes text not null default '',
  is_kanban_synced boolean not null default false,
  kanban_id text,
  updated_at timestamptz not null default now()
);

-- 6. Kanban Cards Table (Board 3: 3-column vertical board)
create table if not exists public.kanban_cards (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  title text not null,
  category text not null default 'home',
  stage text not null default 'todo' check (stage in ('todo', 'inprogress', 'done')),
  assignee text not null default 'both' check (assignee in ('mine', 'partner', 'both')),
  do_today boolean not null default false,
  description text not null default '',
  updated_at timestamptz not null default now()
);

-- 7. Couple Rewards Table (Wishlist shop)
create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  title text not null,
  description text not null default '',
  cost integer not null default 10,
  created_at timestamptz not null default now()
);

-- 8. Frozen Dates Table (Vacation & rest day exemptions)
create table if not exists public.frozen_dates (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  date_key text not null, -- YYYY-MM-DD
  is_frozen boolean not null default true,
  unique (household_id, date_key)
);

-- Indexes for Foreign Keys & Common Query Paths
create index if not exists idx_partners_household on public.partners(household_id);
create index if not exists idx_routines_household on public.routines(household_id);
create index if not exists idx_routine_completions_routine on public.routine_completions(routine_id);
create index if not exists idx_daily_tasks_household_date on public.daily_tasks(household_id, target_date);
create index if not exists idx_daily_tasks_kanban on public.daily_tasks(kanban_id);
create index if not exists idx_kanban_cards_household_stage on public.kanban_cards(household_id, stage);
create index if not exists idx_rewards_household on public.rewards(household_id);
create index if not exists idx_frozen_dates_household on public.frozen_dates(household_id);

-- Enable Row Level Security (RLS) on all tables
alter table public.households enable row level security;
alter table public.partners enable row level security;
alter table public.routines enable row level security;
alter table public.routine_completions enable row level security;
alter table public.daily_tasks enable row level security;
alter table public.kanban_cards enable row level security;
alter table public.rewards enable row level security;
alter table public.frozen_dates enable row level security;

-- Permissive RLS policies for household pairing
create policy "Allow all read on households" on public.households for select using (true);
create policy "Allow all write on households" on public.households for all using (true);

create policy "Allow household partners read" on public.partners for select using (true);
create policy "Allow household partners write" on public.partners for all using (true);

create policy "Allow household routines read" on public.routines for select using (true);
create policy "Allow household routines write" on public.routines for all using (true);

create policy "Allow routine completions read" on public.routine_completions for select using (true);
create policy "Allow routine completions write" on public.routine_completions for all using (true);

create policy "Allow daily tasks read" on public.daily_tasks for select using (true);
create policy "Allow daily tasks write" on public.daily_tasks for all using (true);

create policy "Allow kanban cards read" on public.kanban_cards for select using (true);
create policy "Allow kanban cards write" on public.kanban_cards for all using (true);

create policy "Allow rewards read" on public.rewards for select using (true);
create policy "Allow rewards write" on public.rewards for all using (true);

create policy "Allow frozen dates read" on public.frozen_dates for select using (true);
create policy "Allow frozen dates write" on public.frozen_dates for all using (true);

-- Enable Realtime publication for multi-device sync
alter publication supabase_realtime add table public.partners;
alter publication supabase_realtime add table public.routines;
alter publication supabase_realtime add table public.routine_completions;
alter publication supabase_realtime add table public.daily_tasks;
alter publication supabase_realtime add table public.kanban_cards;
alter publication supabase_realtime add table public.frozen_dates;
