import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SetupScreen } from '@/components/layout/SetupScreen';
import { isSupabaseConfigured } from '@/data/supabase/client';
import { AppProviders } from '@/providers/AppProviders';
import { colors } from '@/theme/colors';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      {isSupabaseConfigured() ? (
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.cream },
          }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      ) : (
        <SetupScreen />
      )}
    </AppProviders>
  );
}
