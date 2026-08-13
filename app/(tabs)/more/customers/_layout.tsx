import { Stack } from 'expo-router';
import { colors } from '@/theme/colors';

export default function CustomersLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.brown,
        headerStyle: { backgroundColor: colors.cream },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.cream },
      }}>
      <Stack.Screen name="index" options={{ title: 'Customers' }} />
      <Stack.Screen name="[id]" options={{ title: 'Customer history' }} />
    </Stack>
  );
}
