-- Golden Tours: real backend for the multi-vendor East Africa tours marketplace
-- Replaces the frontend's localStorage-backed fake persistence (bookings,
-- enquiries, payments, reviews, packages, customers, and plaintext-password
-- auth) with Postgres + Supabase Auth + Row Level Security.

create extension if not exists pgcrypto;

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role text not null default 'user' check (role in ('user', 'company')),
  company_name text,
  avatar_url text,
  phone text,
  country text,
  preferences text,
  language text not null default 'en' check (language in ('en', 'sw')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- COMPANIES (tour operators — the marketplace's sellers)
-- ============================================================
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references public.profiles(id) on delete cascade,
  name text not null,
  tagline text not null default '',
  emoji text not null default '🌍',
  description text not null default '',
  rating numeric(2, 1) not null default 0,
  review_count int not null default 0,
  specialties text[] not null default '{}',
  category text not null default 'safari' check (category in ('safari', 'beach', 'mountain', 'cultural', 'adventure')),
  established text not null default '',
  location text not null default '',
  is_seeded boolean not null default false,
  contact_email text,
  contact_phone text,
  website text,
  logo_url text,
  created_at timestamptz not null default now()
);

-- security-definer helper: the caller's own company id (null if they aren't a company)
create or replace function public.get_my_company_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select id from public.companies where owner_id = auth.uid();
$$;

-- auto-create profile (+ a starter company row for company signups) on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_role text := coalesce(new.raw_user_meta_data ->> 'role', 'user');
begin
  insert into public.profiles (id, full_name, email, role, company_name, language)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    case when new_role = 'company' then 'company' else 'user' end,
    new.raw_user_meta_data ->> 'company_name',
    coalesce(new.raw_user_meta_data ->> 'language', 'en')
  );

  if new_role = 'company' then
    insert into public.companies (owner_id, name, category, established, location)
    values (
      new.id,
      coalesce(new.raw_user_meta_data ->> 'company_name', split_part(new.email, '@', 1)),
      'safari',
      extract(year from now())::text,
      'East Africa'
    );
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- DESTINATIONS (platform-wide curated catalog, shown to travelers)
-- ============================================================
create table public.destinations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, -- stable string id (e.g. "zanzibar") the frontend references directly
  name text not null,
  tag text not null,
  category text not null check (category in ('Beach', 'Safari', 'Mountain', 'Heritage', 'Island', 'Crater', 'Forest', 'Park', 'Lake')),
  rating numeric(2, 1) not null default 0,
  image text not null,
  images text[] not null default '{}',
  description text not null,
  highlights text[] not null default '{}',
  country text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- COMPANY DESTINATIONS (a company's own mini-catalog, company-scoped)
-- ============================================================
create table public.company_destinations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  country text not null,
  description text not null default '',
  image_url text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- PACKAGES (unified: platform-seeded and company-owned tour packages)
-- ============================================================
create table public.packages (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  title text not null,
  destination text not null,
  duration_days int not null check (duration_days > 0),
  max_group_size int,
  price_from numeric(10, 2) not null,
  price_to numeric(10, 2) not null,
  currency text not null default 'USD',
  best_for text check (best_for in ('Couple', 'Family', 'Group', 'Solo')),
  description text not null default '',
  inclusions text[] not null default '{}',
  exclusions text[] not null default '{}',
  itinerary text not null default '',
  highlights text[] not null default '{}',
  category text check (category in ('safari', 'beach', 'mountain', 'cultural', 'adventure')),
  difficulty text check (difficulty in ('easy', 'moderate', 'challenging')),
  is_active boolean not null default true,
  image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- BOOKINGS
-- ============================================================
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  user_name text not null,
  user_email text not null,
  destination text not null,
  package_id uuid references public.packages(id) on delete set null,
  package_name text,
  company_id uuid references public.companies(id) on delete set null,
  company_name text,
  start_date date not null,
  end_date date not null,
  guests int not null default 1 check (guests > 0),
  amount numeric(10, 2) not null,
  currency text not null default 'USD',
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'paid', 'completed', 'cancelled')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- ENQUIRIES / LEADS (incl. AI chat-derived leads)
-- ============================================================
create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  user_name text not null,
  user_email text not null,
  messages jsonb not null default '[]',
  destination text,
  budget text,
  company_id uuid references public.companies(id) on delete set null,
  status text not null default 'new' check (status in ('new', 'reviewed', 'converted', 'closed')),
  admin_notes text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- PAYMENTS
-- ============================================================
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  user_name text not null,
  user_email text not null,
  company_id uuid references public.companies(id) on delete set null,
  amount numeric(10, 2) not null,
  currency text not null default 'USD',
  method text not null default 'card' check (method in ('card', 'bank_transfer', 'mobile_money', 'cash')),
  status text not null default 'pending' check (status in ('pending', 'completed', 'refunded', 'failed')),
  reference text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- REVIEWS (single source of truth — replaces the frontend's two
-- colliding "Review" interfaces)
-- ============================================================
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  user_name text not null,
  user_email text not null,
  company_id uuid not null references public.companies(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete set null,
  destination text not null,
  rating int not null check (rating between 1 and 5),
  title text not null,
  comment text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- FAVORITES (net new — the frontend never persisted these)
-- ============================================================
create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  destination_id uuid references public.destinations(id) on delete cascade,
  package_id uuid references public.packages(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint favorites_target_check check (
    (destination_id is not null and package_id is null) or
    (destination_id is null and package_id is not null)
  ),
  unique (user_id, destination_id),
  unique (user_id, package_id)
);

-- ============================================================
-- TRAVEL BUDDIES (net new — replaces the buggy bidirectional
-- array-in-JSON approach with a real, queryable join table)
-- ============================================================
create table public.travel_buddies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  buddy_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint travel_buddies_not_self check (user_id <> buddy_id),
  unique (user_id, buddy_id)
);

-- ============================================================
-- AI CONVERSATIONS + MESSAGES (real Claude-powered chat, replacing Botpress)
-- ============================================================
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'New conversation',
  created_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_companies_owner_id on public.companies(owner_id);
create index idx_company_destinations_company_id on public.company_destinations(company_id);
create index idx_packages_company_id on public.packages(company_id);
create index idx_bookings_user_id on public.bookings(user_id);
create index idx_bookings_company_id on public.bookings(company_id);
create index idx_bookings_status on public.bookings(status);
create index idx_enquiries_user_id on public.enquiries(user_id);
create index idx_enquiries_company_id on public.enquiries(company_id);
create index idx_payments_booking_id on public.payments(booking_id);
create index idx_payments_company_id on public.payments(company_id);
create index idx_reviews_company_id on public.reviews(company_id);
create index idx_favorites_user_id on public.favorites(user_id);
create index idx_travel_buddies_user_id on public.travel_buddies(user_id);
create index idx_travel_buddies_buddy_id on public.travel_buddies(buddy_id);
create index idx_conversations_user_id on public.conversations(user_id);
create index idx_messages_conversation_id on public.messages(conversation_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.destinations enable row level security;
alter table public.company_destinations enable row level security;
alter table public.packages enable row level security;
alter table public.bookings enable row level security;
alter table public.enquiries enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;
alter table public.travel_buddies enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- Profiles: public read (needed for travel-buddy lookup, company owner
-- display, etc.), owner-only write
create policy "profiles_select_all" on public.profiles
  for select using (true);
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

-- Companies: public read (marketplace browsing), owner-only write
create policy "companies_select_all" on public.companies
  for select using (true);
create policy "companies_update_own" on public.companies
  for update using (owner_id = auth.uid());

-- Destinations: public read-only platform catalog
create policy "destinations_select_all" on public.destinations
  for select using (true);

-- Company destinations: owner-only, not publicly exposed
create policy "company_destinations_all_owner" on public.company_destinations
  for all using (company_id = public.get_my_company_id())
  with check (company_id = public.get_my_company_id());

-- Packages: public reads active rows; company owner has full control of their own
create policy "packages_select_active_or_own" on public.packages
  for select using (is_active = true or company_id = public.get_my_company_id());
create policy "packages_insert_own" on public.packages
  for insert with check (company_id = public.get_my_company_id());
create policy "packages_update_own" on public.packages
  for update using (company_id = public.get_my_company_id());
create policy "packages_delete_own" on public.packages
  for delete using (company_id = public.get_my_company_id());

-- Bookings: traveler sees/creates own; company sees/manages bookings made with them
create policy "bookings_select_own_or_company" on public.bookings
  for select using (user_id = auth.uid() or company_id = public.get_my_company_id());
create policy "bookings_insert_own" on public.bookings
  for insert with check (user_id = auth.uid());
create policy "bookings_update_own_pending_or_company" on public.bookings
  for update using (
    company_id = public.get_my_company_id() or (user_id = auth.uid() and status = 'pending')
  );

-- Enquiries: traveler sees/creates own; company sees/manages enquiries scoped to them
create policy "enquiries_select_own_or_company" on public.enquiries
  for select using (user_id = auth.uid() or company_id = public.get_my_company_id());
create policy "enquiries_insert_own" on public.enquiries
  for insert with check (user_id = auth.uid());
create policy "enquiries_update_own_or_company" on public.enquiries
  for update using (user_id = auth.uid() or company_id = public.get_my_company_id());

-- Payments: traveler sees own; company sees/manages their own company's payments
create policy "payments_select_own_or_company" on public.payments
  for select using (user_id = auth.uid() or company_id = public.get_my_company_id());
create policy "payments_insert_own_or_company" on public.payments
  for insert with check (user_id = auth.uid() or company_id = public.get_my_company_id());
create policy "payments_update_company" on public.payments
  for update using (company_id = public.get_my_company_id());

-- Reviews: public reads approved reviews; author can read/create own;
-- company moderates (approve/reject) reviews about them
create policy "reviews_select_approved_or_own_or_company" on public.reviews
  for select using (
    status = 'approved' or user_id = auth.uid() or company_id = public.get_my_company_id()
  );
create policy "reviews_insert_own" on public.reviews
  for insert with check (user_id = auth.uid());
create policy "reviews_update_own_or_company" on public.reviews
  for update using (user_id = auth.uid() or company_id = public.get_my_company_id());
create policy "reviews_delete_own_or_company" on public.reviews
  for delete using (user_id = auth.uid() or company_id = public.get_my_company_id());

-- Favorites: owner-only
create policy "favorites_all_own" on public.favorites
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Travel buddies: visible to both sides of the relationship; either side can remove it
create policy "travel_buddies_select_either_side" on public.travel_buddies
  for select using (user_id = auth.uid() or buddy_id = auth.uid());
create policy "travel_buddies_insert_own" on public.travel_buddies
  for insert with check (user_id = auth.uid());
create policy "travel_buddies_delete_either_side" on public.travel_buddies
  for delete using (user_id = auth.uid() or buddy_id = auth.uid());

-- Conversations & messages: owner-only
create policy "conversations_all_own" on public.conversations
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());
create policy "messages_select_via_conversation" on public.messages
  for select using (
    exists (select 1 from public.conversations c where c.id = messages.conversation_id and c.user_id = auth.uid())
  );
create policy "messages_insert_via_conversation" on public.messages
  for insert with check (
    exists (select 1 from public.conversations c where c.id = messages.conversation_id and c.user_id = auth.uid())
  );

-- ============================================================
-- KEEP COMPANY RATING / REVIEW_COUNT IN SYNC WITH APPROVED REVIEWS
-- ============================================================
create or replace function public.refresh_company_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_company_id uuid := coalesce(new.company_id, old.company_id);
begin
  update public.companies c
  set
    rating = coalesce((select round(avg(r.rating)::numeric, 1) from public.reviews r where r.company_id = target_company_id and r.status = 'approved'), 0),
    review_count = (select count(*) from public.reviews r where r.company_id = target_company_id and r.status = 'approved')
  where c.id = target_company_id;
  return null;
end;
$$;

create trigger reviews_refresh_company_rating
  after insert or update or delete on public.reviews
  for each row execute procedure public.refresh_company_rating();
