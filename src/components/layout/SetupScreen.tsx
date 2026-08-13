import { Linking, Text, View } from 'react-native';
import { Screen, ScreenHeader } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function SetupScreen() {
  return (
    <Screen>
      <ScreenHeader title="ABMS setup" subtitle="Connect Supabase to start taking orders." />
      <Card>
        <Text className="text-base leading-6 text-brown">
          Create a free Supabase project, run the SQL in supabase/migrations/001_initial_schema.sql, then add these values to a .env file in the project root:
        </Text>
        <Text className="mt-3 rounded-xl bg-sand p-3 font-mono text-sm text-brown">
          EXPO_PUBLIC_SUPABASE_URL=...{'\n'}EXPO_PUBLIC_SUPABASE_ANON_KEY=...
        </Text>
        <Text className="mt-3 text-base text-brown-muted">
          Restart Expo after saving the file. This app is for family devices only and does not include a login screen in Phase 1.
        </Text>
      </Card>
      <View className="mt-4">
        <Button label="Open Supabase" onPress={() => Linking.openURL('https://supabase.com/dashboard')} />
      </View>
    </Screen>
  );
}
