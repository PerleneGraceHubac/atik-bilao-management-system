import { Alert, Share, Text, View } from 'react-native';
import { Screen, ScreenHeader } from '@/components/layout/Screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/layout/States';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DatePickerField } from '@/components/ui/DateTimeFields';
import { useKitchenSummary } from '@/hooks/useOrders';
import { formatDate } from '@/lib/dates';
import { useFilterStore } from '@/stores/filterStore';

export default function KitchenScreen() {
  const date = useFilterStore((state) => state.kitchenDate);
  const setDate = useFilterStore((state) => state.setKitchenDate);
  const summary = useKitchenSummary(date);

  const shareSummary = async () => {
    if (!summary.data?.length) {
      Alert.alert('Nothing to share', 'There are no kitchen items for this date.');
      return;
    }
    const lines = [`Kitchen summary — ${formatDate(date)}`, ''];
    for (const dish of summary.data) {
      lines.push(`${dish.dishName} (total ${dish.totalQuantity})`);
      for (const size of dish.sizes) {
        lines.push(`  ${size.sizeName}: ${size.quantity}`);
      }
      lines.push('');
    }
    await Share.share({ message: lines.join('\n') });
  };

  return (
    <Screen>
      <ScreenHeader title="Kitchen summary" subtitle="Grouped by dish and bilao size." />
      <DatePickerField label="Production date" value={date} onChange={setDate} />
      {summary.isLoading ? <LoadingState message="Counting trays…" /> : null}
      {summary.isError ? <ErrorState message="Could not load kitchen summary." onRetry={() => summary.refetch()} /> : null}
      {(summary.data ?? []).map((dish) => (
        <View key={dish.dishId} className="mb-3">
          <Card>
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold text-brown">{dish.dishName}</Text>
              <Text className="text-base font-bold text-gold">{dish.totalQuantity}</Text>
            </View>
            {dish.sizes.map((size) => (
              <View key={size.sizeId} className="mt-2 flex-row items-center justify-between border-t border-sand pt-2">
                <Text className="text-base text-brown-muted">{size.sizeName}</Text>
                <Text className="text-base font-semibold text-brown">{size.quantity}</Text>
              </View>
            ))}
          </Card>
        </View>
      ))}
      {!summary.isLoading && (summary.data?.length ?? 0) === 0 ? (
        <EmptyState title="No production yet" message="Orders for this date will appear here, grouped by dish and size." />
      ) : null}
      <View className="mt-2">
        <Button label="Share summary" variant="secondary" onPress={shareSummary} />
      </View>
    </Screen>
  );
}
