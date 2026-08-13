import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

export function LoadingState({ message = 'Loading…' }: { message?: string }) {
  return (
    <View className="flex-1 items-center justify-center py-16">
      <ActivityIndicator size="large" color={colors.gold} />
      <Text className="mt-3 text-base text-brown-muted">{message}</Text>
    </View>
  );
}

export function EmptyState({
  icon = 'file-tray-outline',
  title,
  message,
  actionLabel,
  onAction,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View className="items-center rounded-2xl border border-dashed border-sand bg-paper px-5 py-10">
      <Ionicons name={icon} size={36} color={colors.brownLight} />
      <Text className="mt-3 text-center text-lg font-semibold text-brown">{title}</Text>
      <Text className="mt-1 text-center text-base text-brown-muted">{message}</Text>
      {actionLabel && onAction ? (
        <Pressable className="mt-4 rounded-xl bg-gold px-4 py-3" onPress={onAction}>
          <Text className="font-semibold text-white">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <View className="items-center rounded-2xl border border-red-200 bg-red-50 px-5 py-8">
      <Ionicons name="alert-circle-outline" size={32} color={colors.danger} />
      <Text className="mt-2 text-center text-base text-brown">{message}</Text>
      {onRetry ? (
        <Pressable className="mt-3 rounded-xl bg-brown px-4 py-3" onPress={onRetry}>
          <Text className="font-semibold text-white">Try again</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
