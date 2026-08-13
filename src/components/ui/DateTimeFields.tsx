import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { formatTime } from '@/lib/dates';

interface DatePickerFieldProps {
  label: string;
  value: string;
  onChange: (isoDate: string) => void;
  error?: string;
}

export function DatePickerField({ label, value, onChange, error }: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const date = value ? new Date(`${value}T00:00:00`) : new Date();

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS !== 'ios') {
      setOpen(false);
    }
    if (event.type === 'dismissed') return;
    if (selected) onChange(format(selected, 'yyyy-MM-dd'));
  };

  return (
    <View className="mb-3">
      <Text className="mb-1.5 text-sm font-semibold text-brown">{label}</Text>
      <Pressable
        onPress={() => setOpen((current) => !current)}
        className={`min-h-[48px] justify-center rounded-xl border bg-paper px-4 ${error ? 'border-red-500' : 'border-sand'}`}>
        <Text className="text-base text-brown">{format(date, 'MMM d, yyyy')}</Text>
      </Pressable>
      {error ? <Text className="mt-1 text-sm text-red-700">{error}</Text> : null}
      {open ? (
        <View className="mt-2 rounded-xl bg-paper">
          <DateTimePicker value={date} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={handleChange} />
          {Platform.OS === 'ios' ? (
            <Pressable className="items-center py-3" onPress={() => setOpen(false)}>
              <Text className="font-semibold text-gold">Done</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

interface TimePickerFieldProps {
  label: string;
  value: string;
  onChange: (time: string) => void;
  error?: string;
}

export function TimePickerField({ label, value, onChange, error }: TimePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const [hours, minutes] = (value || '12:00').split(':').map(Number);
  const date = new Date();
  date.setHours(hours || 12, minutes || 0, 0, 0);

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS !== 'ios') {
      setOpen(false);
    }
    if (event.type === 'dismissed') return;
    if (selected) onChange(format(selected, 'HH:mm'));
  };

  return (
    <View className="mb-3">
      <Text className="mb-1.5 text-sm font-semibold text-brown">{label}</Text>
      <Pressable
        onPress={() => setOpen((current) => !current)}
        className={`min-h-[48px] justify-center rounded-xl border bg-paper px-4 ${error ? 'border-red-500' : 'border-sand'}`}>
        <Text className="text-base text-brown">{formatTime(value || '12:00')}</Text>
      </Pressable>
      {error ? <Text className="mt-1 text-sm text-red-700">{error}</Text> : null}
      {open ? (
        <View className="mt-2 rounded-xl bg-paper">
          <DateTimePicker value={date} mode="time" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={handleChange} />
          {Platform.OS === 'ios' ? (
            <Pressable className="items-center py-3" onPress={() => setOpen(false)}>
              <Text className="font-semibold text-gold">Done</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
