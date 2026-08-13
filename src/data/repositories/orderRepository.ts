import { getSupabase } from '@/data/supabase/client';
import { throwIfError } from '@/data/supabase/errors';
import { mapOrder, mapOrderListItem, type OrderRow } from '@/data/supabase/mappers';
import { upsertCustomer } from '@/data/repositories/customerHelpers';
import type {
  DashboardStats,
  KitchenDishGroup,
  Order,
  OrderFilters,
  OrderListItem,
  UpsertOrderInput,
} from '@/domain/entities';
import type { IOrderRepository } from '@/domain/repositories/IOrderRepository';
import { todayIso, tomorrowIso, weekRangeIso } from '@/lib/dates';
import { toMoney } from '@/lib/currency';

const DETAIL_SELECT = `
  id, customer_id, order_type, delivery_date, delivery_time, remarks, status, total_amount, created_at, updated_at,
  customers (*),
  order_items (
    id, order_id, dish_id, size_id, quantity, unit_price, subtotal,
    dishes (*),
    bilao_sizes (*)
  )
`;

const LIST_SELECT = `
  id, customer_id, order_type, delivery_date, delivery_time, remarks, status, total_amount, created_at, updated_at,
  customers (*),
  order_items (id)
`;

function totalFromItems(items: UpsertOrderInput['items']): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

async function insertItems(orderId: string, items: UpsertOrderInput['items']): Promise<void> {
  const supabase = getSupabase();
  const payload = items.map((item) => ({
    order_id: orderId,
    dish_id: item.dishId,
    size_id: item.sizeId,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    subtotal: item.quantity * item.unitPrice,
  }));
  const { error } = await supabase.from('order_items').insert(payload);
  throwIfError(error, 'Could not save order items.');
}

export const orderRepository: IOrderRepository = {
  async getOrders(filters: OrderFilters): Promise<OrderListItem[]> {
    const supabase = getSupabase();
    let query = supabase.from('orders').select(LIST_SELECT);

    if (filters.filter === 'today') {
      query = query.eq('delivery_date', todayIso());
    } else if (filters.filter === 'tomorrow') {
      query = query.eq('delivery_date', tomorrowIso());
    } else if (filters.filter === 'this_week') {
      const { from, to } = weekRangeIso();
      query = query.gte('delivery_date', from).lte('delivery_date', to);
    } else if (filters.filter === 'pending' || filters.filter === 'completed' || filters.filter === 'cancelled') {
      query = query.eq('status', filters.filter);
    }

    query = query.order('delivery_date', { ascending: true }).order('delivery_time', { ascending: true });

    const { data, error } = await query;
    throwIfError(error, 'Could not load orders.');

    let rows = ((data ?? []) as OrderRow[]).map(mapOrderListItem);
    const search = filters.search.trim().toLowerCase();
    if (search) {
      rows = rows.filter(
        (order) =>
          order.customerName.toLowerCase().includes(search) ||
          order.contactNumber.toLowerCase().includes(search) ||
          (order.remarks ?? '').toLowerCase().includes(search),
      );
    }
    return rows;
  },

  async getOrderById(id: string): Promise<Order> {
    const supabase = getSupabase();
    const { data, error } = await supabase.from('orders').select(DETAIL_SELECT).eq('id', id).single();
    throwIfError(error, 'Could not load order.');
    return mapOrder(data as OrderRow);
  },

  async createOrder(input: UpsertOrderInput): Promise<Order> {
    const supabase = getSupabase();
    const customer = await upsertCustomer({
      name: input.customerName,
      contactNumber: input.contactNumber,
      address: input.address,
    });

    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_id: customer.id,
        order_type: input.orderType,
        delivery_date: input.deliveryDate,
        delivery_time: input.deliveryTime,
        remarks: input.remarks?.trim() || null,
        status: input.status,
        total_amount: totalFromItems(input.items),
      })
      .select('id')
      .single();

    throwIfError(error, 'Could not create order.');
    if (!data?.id) {
      throw new Error('Could not create order.');
    }
    await insertItems(data.id, input.items);
    return this.getOrderById(data.id);
  },

  async updateOrder(id: string, input: UpsertOrderInput): Promise<Order> {
    const supabase = getSupabase();
    const customer = await upsertCustomer({
      name: input.customerName,
      contactNumber: input.contactNumber,
      address: input.address,
    });

    const { error } = await supabase
      .from('orders')
      .update({
        customer_id: customer.id,
        order_type: input.orderType,
        delivery_date: input.deliveryDate,
        delivery_time: input.deliveryTime,
        remarks: input.remarks?.trim() || null,
        status: input.status,
        total_amount: totalFromItems(input.items),
      })
      .eq('id', id);

    throwIfError(error, 'Could not update order.');

    const { error: deleteError } = await supabase.from('order_items').delete().eq('order_id', id);
    throwIfError(deleteError, 'Could not refresh order items.');
    await insertItems(id, input.items);
    return this.getOrderById(id);
  },

  async deleteOrder(id: string): Promise<void> {
    const supabase = getSupabase();
    const { error } = await supabase.from('orders').delete().eq('id', id);
    throwIfError(error, 'Could not delete order.');
  },

  async getOrderStats(): Promise<DashboardStats> {
    const supabase = getSupabase();
    const today = todayIso();
    const tomorrow = tomorrowIso();
    const { from, to } = weekRangeIso();

    const { data, error } = await supabase
      .from('orders')
      .select('delivery_date, status, total_amount')
      .gte('delivery_date', from)
      .lte('delivery_date', to);

    throwIfError(error, 'Could not load dashboard stats.');

    const { count: pendingCount, error: pendingError } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending');

    throwIfError(pendingError, 'Could not load pending count.');

    const rows = data ?? [];
    const todayRows = rows.filter((row) => row.delivery_date === today);

    return {
      todayCount: todayRows.length,
      tomorrowCount: rows.filter((row) => row.delivery_date === tomorrow).length,
      weekCount: rows.length,
      pendingCount: pendingCount ?? 0,
      todaySales: todayRows
        .filter((row) => row.status === 'completed')
        .reduce((sum, row) => sum + toMoney(row.total_amount), 0),
    };
  },

  async getOrdersByDate(date: string): Promise<OrderListItem[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('orders')
      .select(LIST_SELECT)
      .eq('delivery_date', date)
      .order('delivery_time', { ascending: true });

    throwIfError(error, 'Could not load orders for this date.');
    return ((data ?? []) as OrderRow[]).map(mapOrderListItem);
  },

  async getOrderCountsByDateRange(from: string, to: string): Promise<Record<string, number>> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('orders')
      .select('delivery_date')
      .gte('delivery_date', from)
      .lte('delivery_date', to)
      .neq('status', 'cancelled');

    throwIfError(error, 'Could not load calendar counts.');
    const counts: Record<string, number> = {};
    for (const row of data ?? []) {
      counts[row.delivery_date] = (counts[row.delivery_date] ?? 0) + 1;
    }
    return counts;
  },

  async getKitchenSummary(date: string): Promise<KitchenDishGroup[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('order_items')
      .select(
        `
        quantity,
        dish_id,
        size_id,
        dishes (id, name, sort_order),
        bilao_sizes (id, name, sort_order),
        orders!inner (delivery_date, status)
      `,
      )
      .eq('orders.delivery_date', date)
      .neq('orders.status', 'cancelled');

    throwIfError(error, 'Could not load kitchen summary.');

    const groups = new Map<string, KitchenDishGroup>();

    for (const row of data ?? []) {
      const dish = Array.isArray(row.dishes) ? row.dishes[0] : row.dishes;
      const size = Array.isArray(row.bilao_sizes) ? row.bilao_sizes[0] : row.bilao_sizes;
      if (!dish || !size) continue;

      const group: KitchenDishGroup = groups.get(dish.id) ?? {
        dishId: dish.id,
        dishName: dish.name,
        sizes: [],
        totalQuantity: 0,
      };

      const existingSize = group.sizes.find((item) => item.sizeId === size.id);
      if (existingSize) {
        existingSize.quantity += row.quantity;
      } else {
        group.sizes.push({ sizeId: size.id, sizeName: size.name, quantity: row.quantity });
      }
      group.totalQuantity += row.quantity;
      groups.set(dish.id, group);
    }

    return [...groups.values()].sort((a, b) => a.dishName.localeCompare(b.dishName));
  },
};
