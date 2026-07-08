# Garage Strength

A phone-friendly workout tracker built with Next.js, TypeScript, Tailwind, and Supabase.

## What is included

- Mobile-first screens for Today, Plan, Exercise Library, History, Progress, and Settings.
- Guided setup that generates a 3, 4, 5, or 6 day plan from selected equipment.
- Exercise library with tracking type, substitutions, form notes, and YouTube demo links.
- Supabase magic-link login and saved workout sessions.
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

3. In Supabase, run `supabase/schema.sql` in the SQL editor.

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
