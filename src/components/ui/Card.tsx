import { Text, View } from 'react-native';
import { statusColors } from '@/theme/colors';
import type { OrderStatus } from '@/domain/entities';

export function Badge({ status }: { status: OrderStatus }) {
  const tone = statusColors[status];
  return (
    <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: tone.bg }}>
      <Text className="text-xs font-semibold" style={{ color: tone.text }}>
        {tone.label}
      </Text>
    </View>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return <View className="rounded-2xl border border-sand bg-paper p-4">{children}</View>;
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <View className="min-h-[96px] flex-1 rounded-2xl border border-sand bg-paper p-3">
      <Text className="text-sm text-brown-muted">{label}</Text>
      <Text className="mt-1 text-2xl font-bold text-brown">{value}</Text>
      {hint ? <Text className="mt-1 text-xs text-gold">{hint}</Text> : null}
    </View>
  );
}
