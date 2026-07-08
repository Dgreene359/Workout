# Garage Strength

A phone-friendly workout tracker built with Next.js, TypeScript, Tailwind, and Supabase.

## What is included

- Mobile-first screens for Today, Plan, History, Progress, and Settings.
- Seeded exercise library based on the old tracker plus the current garage gym.
- Four-day balanced strength plan with autoregulated progression cues.
- Supabase magic-link login when environment keys are configured.
- Supabase schema with user-owned tables and row-level security.
- Preview/demo mode when Supabase keys are not configured.

## Local setup

1. Install dependencies:

```bash
pnpm install
```

2. Optional Supabase setup:

```bash
cp .env.example .env.local
```

Add:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

3. In Supabase, run `supabase/schema.sql` in the SQL editor.

4. Start the app:

```bash
pnpm dev
```

## Deployment

Deploy the repository to Vercel and add the same two Supabase environment variables. In Supabase Auth settings, add the Vercel URL as an allowed redirect URL and include:

```text
https://your-domain.com/auth/callback
```
