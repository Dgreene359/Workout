create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Me',
  units text not null default 'lb',
  training_days integer check (training_days in (3, 4, 5, 6)),
  setup_completed boolean not null default false,
  active_plan_id uuid,
  sex text,
  age_range text,
  goals text[] not null default '{}',
  primary_goal text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.equipment (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  quantity integer not null default 1,
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  slug text not null,
  name text not null,
  category text not null,
  track_type text not null default 'strength',
  movement_pattern text not null,
  muscle_focus text[] not null default '{}',
  equipment text[] not null default '{}',
  unilateral boolean not null default false,
  default_sets integer not null default 3,
  default_rep_min integer not null default 8,
  default_rep_max integer not null default 12,
  default_duration_seconds integer,
  track_fields text[] not null default '{"weight","reps","effort","notes"}',
  substitution_group text not null,
  demo_url text,
  instructions text,
  difficulty text not null default 'beginner',
  equipment_tier text not null default 'bodyweight',
  is_global boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, slug)
);

create table if not exists public.workout_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  slug text not null,
  name text not null,
  day_type text not null,
  training_days integer not null check (training_days in (3, 4, 5, 6)),
  duration_minutes integer not null,
  summary text not null,
  active boolean not null default true,
  is_global boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, slug)
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_active_plan_fk'
  ) then
    alter table public.profiles
      add constraint profiles_active_plan_fk
      foreign key (active_plan_id) references public.workout_templates(id) on delete set null;
  end if;
end $$;

create table if not exists public.template_exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  template_id uuid not null references public.workout_templates(id) on delete cascade,
  exercise_id uuid references public.exercises(id) on delete set null,
  exercise_slug text not null,
  order_index integer not null,
  block text not null,
  sets integer not null,
  rep_min integer,
  rep_max integer,
  duration_seconds integer,
  target_rpe numeric(3,1) not null,
  rest_seconds integer not null default 60,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid references public.workout_templates(id) on delete set null,
  session_date date not null default current_date,
  status text not null default 'planned',
  notes text,
  duration_minutes integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.set_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  exercise_id uuid references public.exercises(id) on delete set null,
  exercise_slug text not null,
  set_number integer not null,
  weight numeric(6,2) not null default 0,
  reps integer not null default 0,
  rpe numeric(3,1) not null default 7,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.cardio_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid references public.workout_sessions(id) on delete cascade,
  exercise_id uuid references public.exercises(id) on delete set null,
  exercise_slug text not null,
  modality text not null,
  duration_minutes integer not null,
  distance numeric(7,2),
  distance_unit text,
  effort numeric(3,1),
  intervals jsonb,
  custom_values jsonb,
  notes text,
  completed boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists sex text;
alter table public.profiles add column if not exists age_range text;
alter table public.profiles add column if not exists goals text[] not null default '{}';
alter table public.profiles add column if not exists primary_goal text;
alter table public.exercises add column if not exists track_fields text[] not null default '{"weight","reps","effort","notes"}';
alter table public.cardio_logs add column if not exists distance_unit text;
alter table public.cardio_logs add column if not exists custom_values jsonb;

create table if not exists public.body_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  metric_date date not null default current_date,
  body_weight numeric(6,2),
  waist numeric(6,2),
  resting_heart_rate integer,
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, metric_date)
);

alter table public.profiles enable row level security;
alter table public.equipment enable row level security;
alter table public.exercises enable row level security;
alter table public.workout_templates enable row level security;
alter table public.template_exercises enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.set_logs enable row level security;
alter table public.cardio_logs enable row level security;
alter table public.body_metrics enable row level security;

drop policy if exists "profiles own rows" on public.profiles;
drop policy if exists "equipment own rows" on public.equipment;
drop policy if exists "exercises readable" on public.exercises;
drop policy if exists "exercises write own rows" on public.exercises;
drop policy if exists "templates readable" on public.workout_templates;
drop policy if exists "templates write own rows" on public.workout_templates;
drop policy if exists "template exercises readable" on public.template_exercises;
drop policy if exists "template exercises write own rows" on public.template_exercises;
drop policy if exists "sessions own rows" on public.workout_sessions;
drop policy if exists "sets own rows" on public.set_logs;
drop policy if exists "cardio own rows" on public.cardio_logs;
drop policy if exists "metrics own rows" on public.body_metrics;

create policy "profiles own rows" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "equipment own rows" on public.equipment for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "exercises readable" on public.exercises for select using (is_global or auth.uid() = user_id);
create policy "exercises write own rows" on public.exercises for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "templates readable" on public.workout_templates for select using (is_global or auth.uid() = user_id);
create policy "templates write own rows" on public.workout_templates for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "template exercises readable" on public.template_exercises for select using (
  user_id is null or auth.uid() = user_id
);
create policy "template exercises write own rows" on public.template_exercises for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "sessions own rows" on public.workout_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "sets own rows" on public.set_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "cardio own rows" on public.cardio_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "metrics own rows" on public.body_metrics for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'Me'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
