import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { addMonths, format, startOfMonth, subMonths } from 'date-fns';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, ScreenHeader } from '@/components/layout/Screen';
import { ErrorState, LoadingState } from '@/components/layout/States';
import { Card } from '@/components/ui/Card';
import { useCalendarCounts } from '@/hooks/useOrders';
import { isCurrentMonth, isToday, monthGrid, toIsoDate } from '@/lib/dates';
import { colors } from '@/theme/colors';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarScreen() {
  const [anchor, setAnchor] = useState(startOfMonth(new Date()));
  const days = useMemo(() => monthGrid(anchor), [anchor]);
  const from = toIsoDate(days[0]);
  const to = toIsoDate(days[days.length - 1]);
  const counts = useCalendarCounts(from, to);

  return (
    <Screen>
      <ScreenHeader title="Calendar" subtitle="Tap a date to see that day's orders." />
      <View className="mb-4 flex-row items-center justify-between">
        <Pressable className="h-12 w-12 items-center justify-center rounded-full bg-sand" onPress={() => setAnchor(subMonths(anchor, 1))}>
          <Ionicons name="chevron-back" size={20} color={colors.brown} />
        </Pressable>
        <Text className="text-lg font-bold text-brown">{format(anchor, 'MMMM yyyy')}</Text>
        <Pressable className="h-12 w-12 items-center justify-center rounded-full bg-sand" onPress={() => setAnchor(addMonths(anchor, 1))}>
          <Ionicons name="chevron-forward" size={20} color={colors.brown} />
        </Pressable>
      </View>

      {counts.isLoading ? <LoadingState message="Loading calendar…" /> : null}
      {counts.isError ? <ErrorState message="Could not load calendar." onRetry={() => counts.refetch()} /> : null}

      <Card>
        <View className="flex-row">
          {weekdays.map((day) => (
            <Text key={day} className="flex-1 pb-2 text-center text-xs font-semibold text-brown-muted">
              {day}
            </Text>
          ))}
        </View>
        <View className="flex-row flex-wrap">
          {days.map((day) => {
            const iso = toIsoDate(day);
            const count = counts.data?.[iso] ?? 0;
            const inMonth = isCurrentMonth(day, anchor);
            const today = isToday(day);
            return (
              <Pressable
                key={iso}
                onPress={() => router.push(`/(tabs)/calendar/${iso}`)}
                className="mb-2 items-center"
                style={{ width: '14.28%' }}>
                <View
                  className={`h-10 w-10 items-center justify-center rounded-full ${today ? 'bg-gold' : ''}`}>
                  <Text className={`text-sm font-semibold ${today ? 'text-white' : inMonth ? 'text-brown' : 'text-brown-light'}`}>
                    {format(day, 'd')}
                  </Text>
                </View>
                {count > 0 ? (
                  <View className="mt-1 rounded-full bg-sand px-1.5">
                    <Text className="text-[10px] font-bold text-gold">{count}</Text>
                  </View>
                ) : (
                  <View className="mt-1 h-4" />
                )}
              </Pressable>
            );
          })}
        </View>
      </Card>
    </Screen>
  );
}
