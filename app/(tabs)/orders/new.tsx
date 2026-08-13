import { Alert } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { EmptyState } from '@/components/layout/States';
import { OrderForm } from '@/components/orders/OrderForm';
import { useCreateOrder } from '@/hooks/useOrders';
import { useDishes } from '@/hooks/useMenu';
import type { UpsertOrderInput } from '@/domain/entities';

export default function NewOrderScreen() {
  const create = useCreateOrder();
  const dishes = useDishes();

  const handleSubmit = async (input: UpsertOrderInput) => {
    try {
      await create.mutateAsync(input);
      router.back();
    } catch (error) {
      Alert.alert('Could not save order', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  if (!dishes.isLoading && (dishes.data?.length ?? 0) === 0) {
    return (
      <Screen topInset={false}>
        <EmptyState
          title="Add dishes first"
          message="Go to Menu in the More tab and add dishes and prices before taking orders."
          actionLabel="Open menu"
          onAction={() => router.push('/(tabs)/more/menu')}
        />
      </Screen>
    );
  }

  return (
    <Screen topInset={false}>
      <OrderForm submitting={create.isPending} onSubmit={handleSubmit} />
    </Screen>
  );
}
