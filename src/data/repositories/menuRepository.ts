import { getSupabase } from '@/data/supabase/client';
import { throwIfError } from '@/data/supabase/errors';
import { mapDish, mapPrice, mapSize, type DishRow, type PriceRow, type SizeRow } from '@/data/supabase/mappers';
import type { BilaoSize, Dish, DishPrice } from '@/domain/entities';
import type { IMenuRepository } from '@/domain/repositories/IMenuRepository';

export const menuRepository: IMenuRepository = {
  async getDishes(includeInactive = false): Promise<Dish[]> {
    const supabase = getSupabase();
    let query = supabase.from('dishes').select('*').order('sort_order').order('name');
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }
    const { data, error } = await query;
    throwIfError(error, 'Could not load dishes.');
    return ((data ?? []) as DishRow[]).map(mapDish);
  },

  async getSizes(includeInactive = false): Promise<BilaoSize[]> {
    const supabase = getSupabase();
    let query = supabase.from('bilao_sizes').select('*').order('sort_order').order('name');
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }
    const { data, error } = await query;
    throwIfError(error, 'Could not load bilao sizes.');
    return ((data ?? []) as SizeRow[]).map(mapSize);
  },

  async getDishPrices(): Promise<DishPrice[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase.from('dish_prices').select('*');
    throwIfError(error, 'Could not load prices.');
    return ((data ?? []) as PriceRow[]).map(mapPrice);
  },

  async createDish(name: string): Promise<Dish> {
    const supabase = getSupabase();
    const { data: last } = await supabase
      .from('dishes')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data, error } = await supabase
      .from('dishes')
      .insert({ name: name.trim(), sort_order: (last?.sort_order ?? 0) + 1 })
      .select()
      .single();

    throwIfError(error, 'Could not add dish.');
    return mapDish(data as DishRow);
  },

  async updateDish(id: string, name: string): Promise<Dish> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('dishes')
      .update({ name: name.trim() })
      .eq('id', id)
      .select()
      .single();

    throwIfError(error, 'Could not update dish.');
    return mapDish(data as DishRow);
  },

  async deactivateDish(id: string, isActive: boolean): Promise<void> {
    const supabase = getSupabase();
    const { error } = await supabase.from('dishes').update({ is_active: isActive }).eq('id', id);
    throwIfError(error, 'Could not update dish status.');
  },

  async createSize(name: string): Promise<BilaoSize> {
    const supabase = getSupabase();
    const { data: last } = await supabase
      .from('bilao_sizes')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data, error } = await supabase
      .from('bilao_sizes')
      .insert({ name: name.trim(), sort_order: (last?.sort_order ?? 0) + 1 })
      .select()
      .single();

    throwIfError(error, 'Could not add size.');
    return mapSize(data as SizeRow);
  },

  async updateSize(id: string, name: string): Promise<BilaoSize> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('bilao_sizes')
      .update({ name: name.trim() })
      .eq('id', id)
      .select()
      .single();

    throwIfError(error, 'Could not update size.');
    return mapSize(data as SizeRow);
  },

  async deactivateSize(id: string, isActive: boolean): Promise<void> {
    const supabase = getSupabase();
    const { error } = await supabase.from('bilao_sizes').update({ is_active: isActive }).eq('id', id);
    throwIfError(error, 'Could not update size status.');
  },

  async upsertPrice(dishId: string, sizeId: string, unitPrice: number): Promise<DishPrice> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('dish_prices')
      .upsert({ dish_id: dishId, size_id: sizeId, unit_price: unitPrice }, { onConflict: 'dish_id,size_id' })
      .select()
      .single();

    throwIfError(error, 'Could not save price.');
    return mapPrice(data as PriceRow);
  },
};
