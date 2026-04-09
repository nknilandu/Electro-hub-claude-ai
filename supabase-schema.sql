-- ═══════════════════════════════════════════════════════════════
-- ElectroHub — Supabase Schema
-- Run this entire script in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ── profiles ────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ── products ─────────────────────────────────────────────────────
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  image_url text default '',
  price numeric(10, 2) not null default 0,
  category text not null default 'General',
  created_at timestamptz default now()
);

alter table public.products enable row level security;

-- Anyone can read products
create policy "Public can read products"
  on public.products for select
  using (true);

-- Only admins can insert/update/delete products
create policy "Admins can insert products"
  on public.products for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update products"
  on public.products for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete products"
  on public.products for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ── cart_items ───────────────────────────────────────────────────
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

alter table public.cart_items enable row level security;

create policy "Users manage own cart"
  on public.cart_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── orders ───────────────────────────────────────────────────────
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  total numeric(10, 2) not null default 0,
  status text not null default 'completed',
  created_at timestamptz default now()
);

alter table public.orders enable row level security;

create policy "Users read own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- Allow admins to read all orders for analytics
create policy "Admins read all orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ── order_items ──────────────────────────────────────────────────
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete set null,
  quantity integer not null default 1,
  price_at_purchase numeric(10, 2) not null default 0,
  created_at timestamptz default now()
);

alter table public.order_items enable row level security;

create policy "Users read own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

create policy "Users insert own order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

-- Admins can read all order items for analytics
create policy "Admins read all order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ════════════════════════════════════════════════════════════════
-- Optional: Seed a few sample products to start
-- ════════════════════════════════════════════════════════════════
-- insert into public.products (name, description, image_url, price, category) values
--   ('USB-C Fast Charging Cable 2m', 'Braided nylon cable, 100W PD fast charging support', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80', 14.99, 'Cables'),
--   ('Wireless Bluetooth Earbuds', 'Active noise cancelling, 30hr battery life', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80', 79.99, 'Audio'),
--   ('20000mAh Power Bank', 'Dual USB-C, 65W fast charging, airline approved', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80', 49.99, 'Charging'),
--   ('MacBook Pro Sleeve 14"', 'Water-resistant vegan leather, multiple pockets', 'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=400&q=80', 34.99, 'Mobile'),
--   ('7-in-1 USB-C Hub', 'HDMI 4K, SD card, 3x USB-A, PD 100W passthrough', 'https://images.unsplash.com/photo-1625831847908-17c14e5a1a6d?w=400&q=80', 59.99, 'Computing'),
--   ('MagSafe Wireless Charger', '15W fast charging, compatible with MagSafe cases', 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=400&q=80', 39.99, 'Charging');
