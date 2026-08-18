import { Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/layout/States';
import { Card } from '@/components/ui/Card';
import { OrderCard } from '@/components/orders/OrderCard';
import { useCustomerDetail } from '@/hooks/useCustomers';
import { useUpdateOrderStatus } from '@/hooks/useOrders';

export default function CustomerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const detail = useCustomerDetail(id);
  const updateStatus = useUpdateOrderStatus();

  if (detail.isLoading) {
    return (
      <Screen topInset={false}>
        <LoadingState message="Loading history…" />
      </Screen>
    );
  }

  if (detail.isError || !detail.data) {
    return (
      <Screen topInset={false}>
        <ErrorState message="Could not load this customer." onRetry={() => detail.refetch()} />
      </Screen>
    );
  }

  const { customer, orders } = detail.data;

  return (
    <Screen topInset={false}>
      <Card>
        <Text className="text-xl font-bold text-brown">{customer.name}</Text>
        <Text className="mt-1 text-base text-brown-muted">{customer.contactNumber}</Text>
        {customer.address ? <Text className="mt-1 text-base text-brown-muted">{customer.address}</Text> : null}
      </Card>
      <Text className="mb-2 mt-5 text-lg font-bold text-brown">Previous orders</Text>
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onPress={() => router.push(`/(tabs)/orders/${order.id}`)}
          completing={updateStatus.isPending && updateStatus.variables?.id === order.id}
          onMarkCompleted={() => updateStatus.mutate({ id: order.id, status: 'completed' })}
        />
      ))}
      {orders.length === 0 ? <EmptyState title="No orders" message="This customer has no saved orders yet." /> : null}
    </Screen>
  );
}
