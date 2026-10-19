-- VYOMAI / aviagent.shop — shared schema (V1 MVP)
-- Scope: shops, products, sales, credit. No GST / e-way / loans yet.

create extension if not exists "pgcrypto";

create table shops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id),
  name text not null,
  phone text,
  created_at timestamptz default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete cascade,
  name text not null,
  sku text,
  cost_price numeric not null check (cost_price >= 0),
  sell_price numeric not null check (sell_price >= 0),
  quantity numeric not null default 0 check (quantity >= 0),
  unit text default 'pcs',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index products_shop_id_idx on products(shop_id);

create table sales (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete cascade,
  product_id uuid references products(id),
  quantity numeric not null check (quantity > 0),
  price_per_unit numeric not null check (price_per_unit >= 0),
  cost_per_unit numeric not null default 0,
  customer_name text,
  sold_at timestamptz default now()
);

create index sales_shop_id_idx on sales(shop_id);
create index sales_product_id_idx on sales(product_id);
create index sales_sold_at_idx on sales(sold_at);

create table credit_ledger (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete cascade,
  customer_name text not null,
  customer_phone text,
  amount numeric not null check (amount > 0),
  status text check (status in ('pending','paid','partial')) default 'pending',
  due_date date,
  created_at timestamptz default now(),
  paid_at timestamptz
);

create index credit_ledger_shop_id_idx on credit_ledger(shop_id);

-- Optional: enable RLS after wiring Supabase Auth
-- alter table shops enable row level security;
-- alter table products enable row level security;
-- alter table sales enable row level security;
-- alter table credit_ledger enable row level security;
