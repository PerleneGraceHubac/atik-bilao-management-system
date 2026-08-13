import { useState } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export function Select({ label, value, options, onChange, placeholder = 'Select', error }: SelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <View className="mb-3">
      <Text className="mb-1.5 text-sm font-semibold text-brown">{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        className={`min-h-[48px] flex-row items-center justify-between rounded-xl border bg-paper px-4 ${error ? 'border-red-500' : 'border-sand'}`}>
        <Text className={`text-base ${selected ? 'text-brown' : 'text-brown-light'}`}>
          {selected?.label ?? placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.brownLight} />
      </Pressable>
      {error ? <Text className="mt-1 text-sm text-red-700">{error}</Text> : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setOpen(false)}>
          <Pressable className="max-h-[70%] rounded-t-3xl bg-cream px-4 pb-8 pt-4" onPress={() => undefined}>
            <View className="mb-3 h-1 w-12 self-center rounded-full bg-sand" />
            <Text className="mb-3 text-lg font-bold text-brown">{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  className={`mb-2 min-h-[48px] justify-center rounded-xl px-4 ${item.value === value ? 'bg-sand' : 'bg-paper'}`}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}>
                  <Text className="text-base text-brown">{item.label}</Text>
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
