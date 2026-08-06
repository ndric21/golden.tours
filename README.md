# Golden Tours

A premium, AI-powered tourism platform specialized exclusively in East Africa — Tanzania, Kenya, Uganda, Rwanda and Zanzibar. Customers plan and book trips with an AI travel consultant; the Golden Tours team manages bookings, customers, packages and AI conversations from a dedicated admin console.

## Stack

- **Frontend**: React + Vite + Tailwind CSS + React Router + Recharts (charts) + React-Leaflet (maps)
- **Backend**: Supabase (Postgres database, Auth, Row-Level Security, Edge Functions)
- **AI**: Claude API (`claude-sonnet-5`), called from a Supabase Edge Function so the API key never reaches the browser

## Project structure

```
supabase/
  migrations/0001_init.sql   -- full schema, roles, RLS policies
  seed.sql                   -- demo destinations, packages, customers, bookings…
  functions/chat/index.ts    -- Claude API proxy (chat + AI planner notes)
src/
  lib/                       -- supabaseClient.js, api.js (all data access)
  context/AuthContext.jsx    -- session + role state
  components/                -- shared UI, customer nav/footer, admin sidebar
  pages/auth/                -- Login, Signup, Forgot Password
  pages/customer/            -- Home, Destinations, Planner, Bookings, Profile…
  pages/admin/                -- Dashboard, Bookings, Customers, Packages, Reports…
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create/link a Supabase project

```bash
supabase login
supabase link --project-ref <your-project-ref>
```

### 3. Push the database schema and seed data

```bash
supabase db push
psql "$(supabase db remote-commit-url 2>/dev/null || echo YOUR_DB_CONNECTION_STRING)" -f supabase/seed.sql
```

(Or paste the contents of `supabase/migrations/0001_init.sql` then `supabase/seed.sql` into the Supabase Dashboard's SQL Editor, in that order.)

### 4. Deploy the Claude API edge function

```bash
supabase functions deploy chat
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

### 5. Configure environment variables

Copy `.env.example` to `.env` and fill in your Supabase project's URL and anon key (Project Settings → API):

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 6. (Optional) Enable Google sign-in

In the Supabase Dashboard, go to Authentication → Providers → Google and configure OAuth credentials. Email/password sign-in works out of the box with no extra configuration.

### 7. Run the app

```bash
npm run dev
```

## Demo accounts (seeded)

| Role | Email | Password |
|---|---|---|
| Admin | `grace.mwangi@goldentours.africa` | `GoldenAdmin2026!` |
| Customer | `james.whitfield@example.com` | `Traveler2026!` |
| Customer | `sophie.bennett@example.com` | `Traveler2026!` |
| Customer | `lukas.weber@example.com` | `Traveler2026!` |
| Customer | `amara.okafor@example.com` | `Traveler2026!` |
| Customer | `chen.wei@example.com` | `Traveler2026!` |
| Customer | `isabella.rossi@example.com` | `Traveler2026!` |

These seed records (customers, bookings, payments, reviews, enquiries, AI conversations) exist so every admin dashboard, chart and report renders with realistic data immediately — delete or replace them from the Supabase Dashboard whenever you're ready to go live.

## How access control works

Every authenticated user gets a row in `public.profiles` with `role` = `customer` or `admin` (set via a database trigger on signup; public sign-up can never self-assign `admin`). Row-Level Security policies on every table enforce that customers only ever see their own bookings/payments/conversations, while admins can read and manage everything — enforced at the database layer, not just in the UI.
