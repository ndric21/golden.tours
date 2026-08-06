-- Golden Tours: core schema, roles, and row-level security
-- East Africa AI tourism platform (Tanzania, Kenya, Uganda, Rwanda, Zanzibar)

create extension if not exists pgcrypto;

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  avatar_url text,
  nationality text,
  created_at timestamptz not null default now()
);

-- security-definer helper so RLS policies can check role without recursive lookups
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'phone',
    'customer' -- public signup can never self-assign admin
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- DESTINATIONS
-- ============================================================
create table public.destinations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  country text not null check (country in ('Tanzania', 'Kenya', 'Uganda', 'Rwanda', 'Zanzibar')),
  category text not null check (category in ('wildlife', 'beach', 'mountain', 'culture', 'gorilla', 'adventure', 'lake')),
  short_description text not null,
  description text not null,
  best_season text not null,
  highlights text[] not null default '{}',
  lat double precision not null,
  lng double precision not null,
  images text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- ============================================================
-- TOUR PACKAGES
-- ============================================================
create table public.packages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  destination_ids uuid[] not null default '{}',
  countries text[] not null default '{}',
  description text not null,
  duration_days int not null check (duration_days > 0),
  price_min numeric(10, 2) not null,
  price_max numeric(10, 2) not null,
  currency text not null default 'USD',
  budget_level text not null default 'mid-range' check (budget_level in ('budget', 'mid-range', 'luxury')),
  interests text[] not null default '{}',
  images text[] not null default '{}',
  highlights text[] not null default '{}',
  itinerary jsonb not null default '[]',
  map_points jsonb not null default '[]',
  best_months text[] not null default '{}',
  group_size text,
  rating numeric(2, 1) not null default 0,
  review_count int not null default 0,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- BOOKINGS
-- ============================================================
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  package_id uuid not null references public.packages(id) on delete restrict,
  travelers int not null default 1 check (travelers > 0),
  start_date date not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  total_price numeric(10, 2) not null,
  currency text not null default 'USD',
  notes text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- PAYMENTS
-- ============================================================
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  amount numeric(10, 2) not null,
  currency text not null default 'USD',
  method text not null default 'card' check (method in ('card', 'mobile_money', 'bank_transfer', 'cash')),
  status text not null default 'pending' check (status in ('paid', 'pending', 'refunded', 'failed')),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================================
-- REVIEWS
-- ============================================================
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  package_id uuid not null references public.packages(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ENQUIRIES / LEADS
-- ============================================================
create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  source text not null default 'contact_form' check (source in ('contact_form', 'ai_chat', 'planner')),
  status text not null default 'new' check (status in ('new', 'contacted', 'converted', 'closed')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- AI CONVERSATIONS + MESSAGES
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
-- COMPANY SETTINGS (single row)
-- ============================================================
create table public.company_settings (
  id int primary key default 1,
  company_name text not null default 'Golden Tours',
  support_email text not null default 'hello@goldentours.africa',
  support_phone text not null default '+255 754 000 000',
  office_address text not null default 'Arusha, Tanzania',
  default_currency text not null default 'USD',
  booking_notice text not null default 'Bookings are confirmed once a 30% deposit is received.',
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into public.company_settings (id) values (1);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_bookings_user_id on public.bookings(user_id);
create index idx_bookings_package_id on public.bookings(package_id);
create index idx_bookings_status on public.bookings(status);
create index idx_payments_booking_id on public.payments(booking_id);
create index idx_reviews_package_id on public.reviews(package_id);
create index idx_enquiries_status on public.enquiries(status);
create index idx_conversations_user_id on public.conversations(user_id);
create index idx_messages_conversation_id on public.messages(conversation_id);
create index idx_destinations_country on public.destinations(country);
create index idx_packages_interests on public.packages using gin(interests);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.destinations enable row level security;
alter table public.packages enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.enquiries enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.company_settings enable row level security;

-- Profiles
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own_or_admin" on public.profiles
  for update using (id = auth.uid() or public.is_admin());

-- Destinations: public catalog, admin-managed
create policy "destinations_select_all" on public.destinations
  for select using (true);
create policy "destinations_write_admin" on public.destinations
  for insert with check (public.is_admin());
create policy "destinations_update_admin" on public.destinations
  for update using (public.is_admin());
create policy "destinations_delete_admin" on public.destinations
  for delete using (public.is_admin());

-- Packages: public catalog, admin-managed
create policy "packages_select_all" on public.packages
  for select using (true);
create policy "packages_write_admin" on public.packages
  for insert with check (public.is_admin());
create policy "packages_update_admin" on public.packages
  for update using (public.is_admin());
create policy "packages_delete_admin" on public.packages
  for delete using (public.is_admin());

-- Bookings: owner + admin
create policy "bookings_select_own_or_admin" on public.bookings
  for select using (user_id = auth.uid() or public.is_admin());
create policy "bookings_insert_own" on public.bookings
  for insert with check (user_id = auth.uid());
create policy "bookings_update_own_cancel_or_admin" on public.bookings
  for update using (
    public.is_admin() or (user_id = auth.uid() and status = 'pending')
  );
create policy "bookings_delete_admin" on public.bookings
  for delete using (public.is_admin());

-- Payments: owner (read-only via their booking) + admin manages
create policy "payments_select_own_or_admin" on public.payments
  for select using (
    public.is_admin() or
    exists (select 1 from public.bookings b where b.id = payments.booking_id and b.user_id = auth.uid())
  );
create policy "payments_write_admin" on public.payments
  for insert with check (public.is_admin());
create policy "payments_update_admin" on public.payments
  for update using (public.is_admin());
create policy "payments_delete_admin" on public.payments
  for delete using (public.is_admin());

-- Reviews: public read, owner writes own, admin moderates
create policy "reviews_select_all" on public.reviews
  for select using (true);
create policy "reviews_insert_own" on public.reviews
  for insert with check (user_id = auth.uid());
create policy "reviews_update_own_or_admin" on public.reviews
  for update using (user_id = auth.uid() or public.is_admin());
create policy "reviews_delete_own_or_admin" on public.reviews
  for delete using (user_id = auth.uid() or public.is_admin());

-- Enquiries: anyone can submit (incl. anonymous contact form), owner/admin can read
create policy "enquiries_insert_any" on public.enquiries
  for insert with check (true);
create policy "enquiries_select_own_or_admin" on public.enquiries
  for select using (user_id = auth.uid() or public.is_admin());
create policy "enquiries_update_admin" on public.enquiries
  for update using (public.is_admin());
create policy "enquiries_delete_admin" on public.enquiries
  for delete using (public.is_admin());

-- Conversations: owner + admin (read all, for AI Chat Logs)
create policy "conversations_select_own_or_admin" on public.conversations
  for select using (user_id = auth.uid() or public.is_admin());
create policy "conversations_insert_own" on public.conversations
  for insert with check (user_id = auth.uid());
create policy "conversations_delete_own_or_admin" on public.conversations
  for delete using (user_id = auth.uid() or public.is_admin());

-- Messages: visible if the parent conversation is visible
create policy "messages_select_via_conversation" on public.messages
  for select using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
      and (c.user_id = auth.uid() or public.is_admin())
    )
  );
create policy "messages_insert_via_conversation" on public.messages
  for insert with check (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id and c.user_id = auth.uid()
    )
  );

-- Company settings: publicly readable (e.g. footer contact info), admin-editable
create policy "company_settings_select_all" on public.company_settings
  for select using (true);
create policy "company_settings_update_admin" on public.company_settings
  for update using (public.is_admin());

-- ============================================================
-- KEEP PACKAGE RATING/REVIEW_COUNT IN SYNC
-- ============================================================
create or replace function public.refresh_package_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  pkg_id uuid := coalesce(new.package_id, old.package_id);
begin
  update public.packages p
  set
    rating = coalesce((select round(avg(r.rating)::numeric, 1) from public.reviews r where r.package_id = pkg_id), 0),
    review_count = (select count(*) from public.reviews r where r.package_id = pkg_id)
  where p.id = pkg_id;
  return null;
end;
$$;

create trigger reviews_refresh_package_rating
  after insert or update or delete on public.reviews
  for each row execute procedure public.refresh_package_rating();
