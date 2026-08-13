import { addMonths, format, parseISO, startOfMonth, subDays, subMonths } from 'date-fns';
import { getSupabase } from '@/data/supabase/client';
import { throwIfError } from '@/data/supabase/errors';
import { todayIso } from '@/lib/dates';
import { toMoney } from '@/lib/currency';
import type { DailySalesRow, MonthlySalesRow, ReportSummary, TopDishRow } from '@/domain/entities';
import type { IReportRepository } from '@/domain/repositories/IReportRepository';

interface CompletedOrderRow {
  id: string;
  delivery_date: string;
  total_amount: number | string;
}

interface CompletedItemRow {
  quantity: number;
  subtotal: number | string;
  dishes: { name: string } | { name: string }[] | null;
}

function dishName(value: CompletedItemRow['dishes']): string {
  if (!value) return 'Unknown dish';
  return Array.isArray(value) ? value[0]?.name ?? 'Unknown dish' : value.name;
}

export const reportRepository: IReportRepository = {
  async getSummary(): Promise<ReportSummary> {
    const supabase = getSupabase();
    const today = todayIso();
    const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');

    const { data: completed, error: completedError } = await supabase
      .from('orders')
      .select('id, delivery_date, total_amount')
      .eq('status', 'completed');

    throwIfError(completedError, 'Could not load sales summary.');
    const rows = (completed ?? []) as CompletedOrderRow[];

    const todaySales = rows
      .filter((row) => row.delivery_date === today)
      .reduce((sum, row) => sum + toMoney(row.total_amount), 0);

    const monthSales = rows
      .filter((row) => row.delivery_date >= monthStart)
      .reduce((sum, row) => sum + toMoney(row.total_amount), 0);

    const { count, error: countError } = await supabase.from('orders').select('id', { count: 'exact', head: true });
    throwIfError(countError, 'Could not count orders.');

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('quantity, subtotal, dishes(name), orders!inner(status)')
      .eq('orders.status', 'completed');

    throwIfError(itemsError, 'Could not load top dishes.');

    const totals = new Map<string, TopDishRow>();
    for (const item of (items ?? []) as CompletedItemRow[]) {
      const name = dishName(item.dishes);
      const current = totals.get(name) ?? { dishName: name, quantity: 0, revenue: 0 };
      current.quantity += item.quantity;
      current.revenue += toMoney(item.subtotal);
      totals.set(name, current);
    }

    const topDishes = [...totals.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5);

    return {
      todaySales,
      monthSales,
      totalOrders: count ?? 0,
      topDishes,
    };
  },

  async getDailySales(days: number): Promise<DailySalesRow[]> {
    const supabase = getSupabase();
    const from = format(subDays(new Date(), days - 1), 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('orders')
      .select('delivery_date, total_amount, status')
      .gte('delivery_date', from)
      .eq('status', 'completed');

    throwIfError(error, 'Could not load daily sales.');

    const map = new Map<string, DailySalesRow>();
    for (let i = 0; i < days; i += 1) {
      const date = format(subDays(new Date(), days - 1 - i), 'yyyy-MM-dd');
      map.set(date, { date, orderCount: 0, sales: 0 });
    }

    for (const row of data ?? []) {
      const current = map.get(row.delivery_date);
      if (!current) continue;
      current.orderCount += 1;
      current.sales += toMoney(row.total_amount);
    }

    return [...map.values()];
  },

  async getMonthlySales(months: number): Promise<MonthlySalesRow[]> {
    const supabase = getSupabase();
    const fromDate = startOfMonth(subMonths(new Date(), months - 1));
    const from = format(fromDate, 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('orders')
      .select('delivery_date, total_amount, status')
      .gte('delivery_date', from)
      .eq('status', 'completed');

    throwIfError(error, 'Could not load monthly sales.');

    const map = new Map<string, MonthlySalesRow>();
    for (let i = 0; i < months; i += 1) {
      const monthDate = addMonths(fromDate, i);
      const key = format(monthDate, 'yyyy-MM');
      map.set(key, { month: format(monthDate, 'MMM yyyy'), orderCount: 0, sales: 0 });
    }

    for (const row of data ?? []) {
      const key = format(parseISO(row.delivery_date), 'yyyy-MM');
      const current = map.get(key);
      if (!current) continue;
      current.orderCount += 1;
      current.sales += toMoney(row.total_amount);
    }

    return [...map.values()];
  },
};
