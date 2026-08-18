import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/layout/Screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/layout/States';
import { OrderCard } from '@/components/orders/OrderCard';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { FilterChips, SearchBar } from '@/components/ui/SearchFilter';
import { useDeleteOrder, useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { ORDER_FILTERS } from '@/lib/constants';
import { useFilterStore } from '@/stores/filterStore';
import { colors } from '@/theme/colors';
import type { OrderFilter } from '@/domain/entities';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrdersScreen() {
  const filter = useFilterStore((state) => state.orderFilter);
  const search = useFilterStore((state) => state.searchQuery);
  const setFilter = useFilterStore((state) => state.setOrderFilter);
  const setSearch = useFilterStore((state) => state.setSearchQuery);
  const orders = useOrders({ filter, search });
  const remove = useDeleteOrder();
  const updateStatus = useUpdateOrderStatus();
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top', 'left', 'right']}>
      <View className="flex-1 px-4 pt-3">
        <ScreenHeader title="Orders" subtitle="Search, filter, and update bookings." />
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search name or number" />
        <FilterChips
          chips={ORDER_FILTERS}
          selected={filter}
          onSelect={(value) => setFilter(value as OrderFilter)}
        />
        {orders.isLoading ? <LoadingState /> : null}
        {orders.isError ? (
          <ErrorState message="Could not load orders." onRetry={() => orders.refetch()} />
        ) : null}
        <FlatList
          data={orders.data ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() => router.push(`/(tabs)/orders/${item.id}`)}
              onLongPress={() => setPendingDelete(item.id)}
              completing={updateStatus.isPending && updateStatus.variables?.id === item.id}
              onMarkCompleted={() => updateStatus.mutate({ id: item.id, status: 'completed' })}
            />
          )}
          ListEmptyComponent={
            orders.isLoading ? null : (
              <EmptyState
                title="No orders yet"
                message="Create an order to replace the notebook."
                actionLabel="New order"
                onAction={() => router.push('/(tabs)/orders/new')}
              />
            )
          }
          refreshControl={
            <RefreshControl refreshing={orders.isRefetching} onRefresh={() => orders.refetch()} tintColor={colors.gold} />
          }
          contentContainerStyle={{ paddingBottom: 96 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <Pressable
        onPress={() => router.push('/(tabs)/orders/new')}
        className="absolute bottom-6 right-5 h-14 w-14 items-center justify-center rounded-full bg-gold shadow-lg">
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
      <ConfirmDialog
        visible={Boolean(pendingDelete)}
        title="Delete this order?"
        message="This cannot be undone."
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            remove.mutate(pendingDelete);
            setPendingDelete(null);
          }
        }}
      />
    </SafeAreaView>
  );
}
