import { useState } from 'react';
import { Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { ErrorState, LoadingState } from '@/components/layout/States';
import { OrderForm } from '@/components/orders/OrderForm';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useDeleteOrder, useOrder, useUpdateOrder } from '@/hooks/useOrders';
import type { UpsertOrderInput } from '@/domain/entities';

export default function EditOrderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useOrder(id);
  const update = useUpdateOrder();
  const remove = useDeleteOrder();
  const [confirm, setConfirm] = useState(false);

  const handleSubmit = async (input: UpsertOrderInput) => {
    if (!id) return;
    try {
      await update.mutateAsync({ id, input });
      router.back();
    } catch (error) {
      Alert.alert('Could not update order', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  if (order.isLoading) {
    return (
      <Screen topInset={false}>
        <LoadingState message="Loading order…" />
      </Screen>
    );
  }

  if (order.isError || !order.data) {
    return (
      <Screen topInset={false}>
        <ErrorState message="This order could not be loaded." onRetry={() => order.refetch()} />
      </Screen>
    );
  }

  return (
    <Screen topInset={false}>
      <OrderForm initial={order.data} submitting={update.isPending} onSubmit={handleSubmit} />
      <Button label="Delete order" variant="destructive" onPress={() => setConfirm(true)} />
      <ConfirmDialog
        visible={confirm}
        title="Delete this order?"
        message="This cannot be undone."
        onCancel={() => setConfirm(false)}
        onConfirm={async () => {
          if (!id) return;
          await remove.mutateAsync(id);
          setConfirm(false);
          router.back();
        }}
      />
    </Screen>
  );
}
