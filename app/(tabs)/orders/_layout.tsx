import { Stack } from 'expo-router';
import { colors } from '@/theme/colors';

export default function OrdersLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.brown,
        headerStyle: { backgroundColor: colors.cream },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.cream },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="new" options={{ title: 'New order' }} />
      <Stack.Screen name="[id]" options={{ title: 'Edit order' }} />
    </Stack>
  );
}
