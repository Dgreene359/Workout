# Garage Strength

A phone-friendly workout tracker built with Next.js, TypeScript, Tailwind, and Supabase.

## What is included

- Mobile-first screens for Today, Plan, Exercise Library, History, Progress, and Settings.
- Guided setup that generates a 3, 4, 5, or 6 day plan from selected equipment.
- Profile setup for sex, age range, multiple goals, and a primary goal.
- Exercise library with tracking type, substitutions, form notes, and YouTube demo links.
- Custom exercise creation from workout swaps, including time, distance, weight, reps, effort, and notes tracking.
- Supabase magic-link login and saved workout sessions.
- Automatic next-workout rotation after each completed workout.
- Strength logging with manual first weights and +/- controls for later workouts.
- Time-based conditioning logs with optional distance and effort.
- Supabase schema with global-readable library support, user-owned plans, and row-level security.

## Local setup

1. Install dependencies:

```bash
pnpm install
```

2. Optional local Supabase setup:

```bash
cp .env.example .env.local
```

Add:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

The deployed app also has public Supabase fallback values in code so Vercel can connect even before environment variables are added. You can still add Vercel environment variables later to override them.

3. In Supabase, run `supabase/schema.sql` in the SQL editor. The current schema file uses `add column if not exists` for V3 profile/custom-exercise fields so it can be rerun over the existing project without deleting saved workouts.

4. In Supabase Auth settings, add your local and deployed callback URLs:

```text
http://localhost:3000/auth/callback
https://your-domain.com/auth/callback
```

5. Start the app:

```bash
pnpm dev
```

## Deployment

Deploy the repository to Vercel and add the same two Supabase environment variables. New users are sent through guided setup after sign-in.

```text
https://your-domain.com/auth/callback
```
