import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View className="flex-1 items-center justify-center bg-cream px-6">
        <Text className="text-xl font-bold text-brown">This screen does not exist.</Text>
        <Link href="/(tabs)" className="mt-4">
          <Text className="text-base font-semibold text-gold">Go back home</Text>
        </Link>
      </View>
    </>
  );
}
