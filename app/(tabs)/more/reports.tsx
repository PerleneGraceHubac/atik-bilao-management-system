import { Text, View } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { ErrorState, LoadingState } from '@/components/layout/States';
import { Card, StatCard } from '@/components/ui/Card';
import { useDailySales, useMonthlySales, useReportSummary } from '@/hooks/useReports';
import { formatPeso } from '@/lib/currency';
import { formatDate } from '@/lib/dates';

export default function ReportsScreen() {
  const summary = useReportSummary();
  const daily = useDailySales(7);
  const monthly = useMonthlySales(6);
  const loading = summary.isLoading || daily.isLoading || monthly.isLoading;

  return (
    <Screen topInset={false}>
      <Text className="mb-4 text-base text-brown-muted">Simple sales totals for completed orders.</Text>
      {loading ? <LoadingState message="Loading reports…" /> : null}
      {summary.isError ? <ErrorState message="Could not load reports." onRetry={() => summary.refetch()} /> : null}

      {summary.data ? (
        <View>
          <View className="flex-row gap-3">
            <StatCard label="Today's sales" value={formatPeso(summary.data.todaySales)} />
            <StatCard label="This month" value={formatPeso(summary.data.monthSales)} />
          </View>
          <View className="mt-3">
            <StatCard label="Total orders" value={String(summary.data.totalOrders)} />
          </View>
        </View>
      ) : null}

      <Text className="mb-2 mt-6 text-lg font-bold text-brown">Most ordered dishes</Text>
      <Card>
        {(summary.data?.topDishes.length ?? 0) === 0 ? (
          <Text className="text-base text-brown-muted">Completed orders will appear here.</Text>
        ) : (
          summary.data?.topDishes.map((dish, index) => (
            <View key={dish.dishName} className={`flex-row items-center justify-between py-2 ${index === 0 ? '' : 'border-t border-sand'}`}>
              <View className="flex-1 pr-3">
                <Text className="text-base font-semibold text-brown">{dish.dishName}</Text>
                <Text className="text-sm text-brown-muted">{dish.quantity} ordered</Text>
              </View>
              <Text className="font-bold text-gold">{formatPeso(dish.revenue)}</Text>
            </View>
          ))
        )}
      </Card>

      <Text className="mb-2 mt-6 text-lg font-bold text-brown">Daily sales (7 days)</Text>
      <Card>
        <View className="mb-2 flex-row">
          <Text className="flex-1 text-xs font-semibold text-brown-muted">Date</Text>
          <Text className="w-16 text-right text-xs font-semibold text-brown-muted">Orders</Text>
          <Text className="w-24 text-right text-xs font-semibold text-brown-muted">Sales</Text>
        </View>
        {(daily.data ?? []).map((row) => (
          <View key={row.date} className="flex-row border-t border-sand py-2">
            <Text className="flex-1 text-sm text-brown">{formatDate(row.date)}</Text>
            <Text className="w-16 text-right text-sm text-brown">{row.orderCount}</Text>
            <Text className="w-24 text-right text-sm font-semibold text-brown">{formatPeso(row.sales)}</Text>
          </View>
        ))}
      </Card>

      <Text className="mb-2 mt-6 text-lg font-bold text-brown">Monthly sales (6 months)</Text>
      <Card>
        <View className="mb-2 flex-row">
          <Text className="flex-1 text-xs font-semibold text-brown-muted">Month</Text>
          <Text className="w-16 text-right text-xs font-semibold text-brown-muted">Orders</Text>
          <Text className="w-24 text-right text-xs font-semibold text-brown-muted">Sales</Text>
        </View>
        {(monthly.data ?? []).map((row) => (
          <View key={row.month} className="flex-row border-t border-sand py-2">
            <Text className="flex-1 text-sm text-brown">{row.month}</Text>
            <Text className="w-16 text-right text-sm text-brown">{row.orderCount}</Text>
            <Text className="w-24 text-right text-sm font-semibold text-brown">{formatPeso(row.sales)}</Text>
          </View>
        ))}
      </Card>
    </Screen>
  );
}
