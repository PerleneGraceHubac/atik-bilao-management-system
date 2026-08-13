import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, ScreenHeader } from '@/components/layout/Screen';
import { colors } from '@/theme/colors';

const links = [
  { title: 'Customers', subtitle: 'Search repeat customers and past orders', icon: 'people-outline' as const, href: '/(tabs)/more/customers' },
  { title: 'Menu', subtitle: 'Dishes, bilao sizes, and default prices', icon: 'fast-food-outline' as const, href: '/(tabs)/more/menu' },
  { title: 'Reports', subtitle: 'Daily and monthly sales summaries', icon: 'bar-chart-outline' as const, href: '/(tabs)/more/reports' },
];

export default function MoreScreen() {
  return (
    <Screen>
      <ScreenHeader title="More" subtitle="Customers, menu, and reports." />
      <View className="gap-3">
        {links.map((link) => (
          <Pressable
            key={link.title}
            onPress={() => router.push(link.href as never)}
            className="min-h-[72px] flex-row items-center rounded-2xl border border-sand bg-paper px-4">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-sand">
              <Ionicons name={link.icon} size={22} color={colors.gold} />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-base font-bold text-brown">{link.title}</Text>
              <Text className="text-sm text-brown-muted">{link.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.brownLight} />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
