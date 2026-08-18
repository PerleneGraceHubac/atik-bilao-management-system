-- ABMS Phase 1 schema
-- Run this in the Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_number text not null unique,
  address text,
  created_at timestamptz not null default now()
);

create table if not exists public.dishes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.bilao_sizes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.dish_prices (
  id uuid primary key default gen_random_uuid(),
  dish_id uuid not null references public.dishes(id) on delete cascade,
  size_id uuid not null references public.bilao_sizes(id) on delete cascade,
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  unique (dish_id, size_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete restrict,
  order_type text not null check (order_type in ('pickup', 'delivery')),
  delivery_date date not null,
  delivery_time time not null,
  remarks text,
  status text not null default 'pending' check (status in ('pending', 'preparing', 'completed', 'cancelled')),
  total_amount numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  dish_id uuid not null references public.dishes(id) on delete restrict,
  size_id uuid not null references public.bilao_sizes(id) on delete restrict,
  quantity int not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  subtotal numeric(12, 2) not null check (subtotal >= 0)
);

create index if not exists orders_delivery_date_idx on public.orders (delivery_date);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_customer_id_idx on public.orders (customer_id);
create index if not exists customers_name_idx on public.customers (name);
create index if not exists customers_contact_number_idx on public.customers (contact_number);
create index if not exists order_items_order_id_idx on public.order_items (order_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute procedure public.set_updated_at();

alter table public.customers enable row level security;
alter table public.dishes enable row level security;
alter table public.bilao_sizes enable row level security;
alter table public.dish_prices enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "family_all_customers" on public.customers;
drop policy if exists "family_all_dishes" on public.dishes;
drop policy if exists "family_all_bilao_sizes" on public.bilao_sizes;
drop policy if exists "family_all_dish_prices" on public.dish_prices;
drop policy if exists "family_all_orders" on public.orders;
drop policy if exists "family_all_order_items" on public.order_items;

create policy "family_all_customers" on public.customers for all to anon, authenticated using (true) with check (true);
create policy "family_all_dishes" on public.dishes for all to anon, authenticated using (true) with check (true);
create policy "family_all_bilao_sizes" on public.bilao_sizes for all to anon, authenticated using (true) with check (true);
create policy "family_all_dish_prices" on public.dish_prices for all to anon, authenticated using (true) with check (true);
create policy "family_all_orders" on public.orders for all to anon, authenticated using (true) with check (true);
create policy "family_all_order_items" on public.order_items for all to anon, authenticated using (true) with check (true);

grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;

insert into public.bilao_sizes (name, sort_order)
select * from (values
  ('Small', 1),
  ('Medium', 2),
  ('Large', 3),
  ('Extra Large', 4)
) as seed(name, sort_order)
where not exists (select 1 from public.bilao_sizes);

insert into public.dishes (name, sort_order)
select seed.name, seed.sort_order
from (values
  ('Fried Chicken', 1),
  ('Pancit Sotanghon', 2),
  ('Pancit Bam-i', 3),
  ('Fish Fillet', 4),
  ('Chicken Fillet', 5),
  ('Cordon Bleu', 6),
  ('Pork Lollipop', 7),
  ('Pork Larocca', 8),
  ('Buttered Shrimp', 9),
  ('Lumpiang Shanghai', 10),
  ('Vegetable Lumpia', 11),
  ('Pork Humba', 12),
  ('Sweet & Sour', 13),
  ('Escabeche', 14),
  ('Menudo', 15),
  ('Bola-Bola', 16),
  ('Chopsuey', 17),
  ('Spaghetti', 18)
) as seed(name, sort_order)
where not exists (
  select 1 from public.dishes d where d.name = seed.name
);

insert into public.dish_prices (dish_id, size_id, unit_price)
select d.id, s.id,
  case s.name
    when 'Small' then 300
    when 'Medium' then 400
    when 'Large' then 600
    else 900
  end
from public.dishes d
cross join public.bilao_sizes s
on conflict (dish_id, size_id) do nothing;
