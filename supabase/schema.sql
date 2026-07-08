create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Me',
  units text not null default 'lb',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.equipment (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  quantity integer not null default 1,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  slug text not null,
  name text not null,
  category text not null,
  movement_pattern text not null,
  muscle_focus text[] not null default '{}',
  equipment text[] not null default '{}',
  unilateral boolean not null default false,
  default_sets integer not null default 3,
  default_rep_min integer not null default 8,
  default_rep_max integer not null default 12,
  substitution_group text not null,
  created_at timestamptz not null default now(),
  unique (user_id, slug)
);

create table if not exists public.workout_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null,
  name text not null,
  day_type text not null,
  duration_minutes integer not null,
  summary text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (user_id, slug)
);

create table if not exists public.template_exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid not null references public.workout_templates(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete restrict,
  order_index integer not null,
  block text not null,
  sets integer not null,
  rep_min integer not null,
  rep_max integer not null,
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
  exercise_id uuid not null references public.exercises(id) on delete restrict,
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
  modality text not null,
  duration_minutes integer not null,
  distance numeric(7,2),
  calories integer,
  intervals jsonb,
  notes text,
  created_at timestamptz not null default now()
);

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

create policy "profiles own rows" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "equipment own rows" on public.equipment for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "exercises own rows" on public.exercises for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "templates own rows" on public.workout_templates for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "template exercises own rows" on public.template_exercises for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
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
