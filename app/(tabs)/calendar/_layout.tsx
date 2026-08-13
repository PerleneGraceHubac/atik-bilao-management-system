import { Stack } from 'expo-router';
import { colors } from '@/theme/colors';

export default function CalendarLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.brown,
        headerStyle: { backgroundColor: colors.cream },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.cream },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[date]" options={{ title: 'Scheduled orders' }} />
    </Stack>
  );
}
