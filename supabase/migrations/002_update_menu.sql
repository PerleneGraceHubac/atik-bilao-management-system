-- Update the live menu without wiping existing tables.
-- Run this in the Supabase SQL Editor.

update public.dishes
set is_active = false
where name not in (
  'Fried Chicken',
  'Pancit Sotanghon',
  'Pancit Bam-i',
  'Fish Fillet',
  'Chicken Fillet',
  'Cordon Bleu',
  'Pork Lollipop',
  'Pork Larocca',
  'Buttered Shrimp',
  'Lumpiang Shanghai',
  'Vegetable Lumpia',
  'Pork Humba',
  'Sweet & Sour',
  'Escabeche',
  'Menudo',
  'Bola-Bola',
  'Chopsuey',
  'Spaghetti'
);

insert into public.dishes (name, sort_order, is_active)
select seed.name, seed.sort_order, true
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

update public.dishes d
set
  is_active = true,
  sort_order = seed.sort_order
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
where d.name = seed.name;

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
where d.is_active = true
on conflict (dish_id, size_id) do nothing;
