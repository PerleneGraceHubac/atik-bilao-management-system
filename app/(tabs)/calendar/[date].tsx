import { router, useLocalSearchParams } from 'expo-router';
import { Screen, ScreenHeader } from '@/components/layout/Screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/layout/States';
import { OrderCard } from '@/components/orders/OrderCard';
import { useOrdersByDate } from '@/hooks/useOrders';
import { formatDate } from '@/lib/dates';

export default function CalendarDateScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const orders = useOrdersByDate(date ?? '');

  return (
    <Screen topInset={false}>
      <ScreenHeader title={date ? formatDate(date) : 'Orders'} subtitle="Pickup and delivery for this day." />
      {orders.isLoading ? <LoadingState /> : null}
      {orders.isError ? <ErrorState message="Could not load this day." onRetry={() => orders.refetch()} /> : null}
      {(orders.data ?? []).map((order) => (
        <OrderCard key={order.id} order={order} onPress={() => router.push(`/(tabs)/orders/${order.id}`)} />
      ))}
      {!orders.isLoading && (orders.data?.length ?? 0) === 0 ? (
        <EmptyState title="No orders" message="Nothing is scheduled for this date." />
      ) : null}
    </Screen>
  );
}
