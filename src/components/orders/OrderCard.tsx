import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Card';
import { formatPeso } from '@/lib/currency';
import { formatDateTime } from '@/lib/dates';
import { colors } from '@/theme/colors';
import type { OrderListItem } from '@/domain/entities';

export function OrderCard({
  order,
  onPress,
  onLongPress,
}: {
  order: OrderListItem;
  onPress: () => void;
  onLongPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="mb-3 rounded-2xl border border-sand bg-paper p-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-lg font-bold text-brown">{order.customerName}</Text>
          <Text className="mt-0.5 text-sm text-brown-muted">{order.contactNumber}</Text>
        </View>
        <Badge status={order.status} />
      </View>
      <View className="mt-3 flex-row items-center">
        <Ionicons
          name={order.orderType === 'delivery' ? 'bicycle-outline' : 'bag-handle-outline'}
          size={16}
          color={colors.brownLight}
        />
        <Text className="ml-1.5 text-sm text-brown-muted">
          {order.orderType === 'delivery' ? 'Delivery' : 'Pickup'} · {formatDateTime(order.deliveryDate, order.deliveryTime)}
        </Text>
      </View>
      <View className="mt-2 flex-row items-center justify-between">
        <Text className="text-sm text-brown-muted">
          {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
        </Text>
        <Text className="text-base font-bold text-gold">{formatPeso(order.totalAmount)}</Text>
      </View>
    </Pressable>
  );
}
