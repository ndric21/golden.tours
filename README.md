# Golden Tours

An AI-powered East Africa travel marketplace — travelers plan and book trips across Tanzania, Kenya, Uganda and Rwanda; independent tour companies list their own packages and manage their own bookings, customers, payments and reviews.

## Stack

- **Frontend**: React 19 + TanStack Start/Router + Tailwind CSS 4 + shadcn/ui, deployed as a Cloudflare Worker (`@cloudflare/vite-plugin`)
- **Backend**: Supabase (Postgres, Auth, Row-Level Security, Edge Functions)
- **AI**: Claude API (`claude-sonnet-5`), called from a Supabase Edge Function so the key never reaches the browser

## Project structure

```
supabase/
  migrations/0001_init.sql   -- schema: profiles, companies, destinations,
                                 packages, bookings, payments, reviews,
                                 enquiries, favorites, travel_buddies, RLS
  seed.sql                   -- real destination + package catalog only
  functions/chat/index.ts    -- Claude API proxy (the AI chat assistant)
src/
  lib/
    auth.ts, auth-provider.tsx   -- real Supabase Auth (user | company roles)
    store.ts                     -- all Postgres-backed CRUD (bookings,
                                     payments, reviews, packages, favorites…)
    destinations.ts, companies.ts -- catalog + marketplace queries
    integrations/supabase/client.ts
  components/                -- shared UI, Chat (AI assistant), Sidebar, Header
  components/dashboards/     -- traveler dashboards (Trips, Favorites, Profile,
                                 Settings) + dashboards/company/ (the tour
                                 operator console: Bookings, Customers,
                                 Packages, Payments, Reviews, Reports…)
  routes/                    -- TanStack Router file routes (/, /login, /signup)
```

## Roles

Every signup chooses `user` (traveler) or `company` (tour operator). A database trigger creates the `profiles` row and, for companies, a starter `companies` row — public signup can never self-assign a role outside those two. Row-Level Security enforces that a company only ever sees its **own** bookings, customers, payments and reviews; nothing is filtered client-side.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Link a Supabase project

```bash
supabase login
supabase link --project-ref <your-project-ref>
```

### 3. Push the schema and seed the destination/package catalog

```bash
supabase db push
supabase db query --linked --file supabase/seed.sql
```

### 4. Deploy the Claude API edge function

```bash
supabase functions deploy chat
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

### 5. Configure environment variables

Copy `.env.example` to `.env` and fill in your Supabase project's URL and publishable key (Project Settings → API):

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

(Both `VITE_`-prefixed and plain versions are needed — the browser bundle reads the former, server-side rendering reads the latter.)

### 6. Run the app

```bash
npm run dev
```

## Data

No demo accounts, bookings, payments or reviews are seeded. `supabase/seed.sql` only contains the real destination catalog (25 East African national parks, reserves, lakes and tourism centers) and 7 platform-curated trip packages — every account, booking, payment and review comes from real people signing up and using the platform.
