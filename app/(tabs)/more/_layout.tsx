import { Stack } from 'expo-router';
import { colors } from '@/theme/colors';

export default function MoreLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.brown,
        headerStyle: { backgroundColor: colors.cream },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.cream },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="customers" options={{ headerShown: false }} />
      <Stack.Screen name="menu" options={{ title: 'Menu' }} />
      <Stack.Screen name="reports" options={{ title: 'Reports' }} />
    </Stack>
  );
}
