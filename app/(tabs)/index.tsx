import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, ScreenHeader } from '@/components/layout/Screen';
import { ErrorState, LoadingState } from '@/components/layout/States';
import { StatCard } from '@/components/ui/Card';
import { useDashboardStats } from '@/hooks/useOrders';
import { formatPeso } from '@/lib/currency';
import { useFilterStore } from '@/stores/filterStore';
import { colors } from '@/theme/colors';
import type { OrderFilter } from '@/domain/entities';

const actions = [
  { label: 'New order', icon: 'add-circle-outline' as const, href: '/(tabs)/orders/new' },
  { label: 'Calendar', icon: 'calendar-outline' as const, href: '/(tabs)/calendar' },
  { label: 'Kitchen', icon: 'restaurant-outline' as const, href: '/(tabs)/kitchen' },
];

export default function DashboardScreen() {
  const stats = useDashboardStats();
  const setOrderFilter = useFilterStore((state) => state.setOrderFilter);

  const openOrders = (filter: OrderFilter) => {
    setOrderFilter(filter);
    router.push('/(tabs)/orders');
  };

  return (
    <Screen>
      <ScreenHeader title="ABMS" subtitle="Atik Bilao Management System" />
      {stats.isLoading ? <LoadingState message="Loading today's summary…" /> : null}
      {stats.isError ? (
        <ErrorState message="Could not load dashboard." onRetry={() => stats.refetch()} />
      ) : null}
      {stats.data ? (
        <View>
          <View className="flex-row gap-3">
            <Pressable className="flex-1" onPress={() => openOrders('today')}>
              <StatCard label="Today" value={String(stats.data.todayCount)} hint="Tap to view" />
            </Pressable>
            <Pressable className="flex-1" onPress={() => openOrders('tomorrow')}>
              <StatCard label="Tomorrow" value={String(stats.data.tomorrowCount)} hint="Tap to view" />
            </Pressable>
          </View>
          <View className="mt-3 flex-row gap-3">
            <Pressable className="flex-1" onPress={() => openOrders('this_week')}>
              <StatCard label="This week" value={String(stats.data.weekCount)} />
            </Pressable>
            <Pressable className="flex-1" onPress={() => openOrders('pending')}>
              <StatCard label="Pending" value={String(stats.data.pendingCount)} />
            </Pressable>
          </View>
          <View className="mt-3">
            <StatCard label="Today's completed sales" value={formatPeso(stats.data.todaySales)} />
          </View>
        </View>
      ) : null}

      <Text className="mb-2 mt-6 text-lg font-bold text-brown">Quick actions</Text>
      <View className="gap-3">
        {actions.map((action) => (
          <Pressable
            key={action.label}
            onPress={() => router.push(action.href as never)}
            className="min-h-[56px] flex-row items-center rounded-2xl border border-sand bg-paper px-4">
            <Ionicons name={action.icon} size={22} color={colors.gold} />
            <Text className="ml-3 text-base font-semibold text-brown">{action.label}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
