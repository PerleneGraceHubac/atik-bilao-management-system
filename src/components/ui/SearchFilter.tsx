import { Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search',
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}) {
  return (
    <View className="mb-3 min-h-[48px] flex-row items-center rounded-xl border border-sand bg-paper px-3">
      <Ionicons name="search" size={18} color={colors.brownLight} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9A8474"
        className="ml-2 flex-1 py-3 text-base text-brown"
        autoCapitalize="none"
      />
    </View>
  );
}

interface Chip {
  value: string;
  label: string;
}

export function FilterChips({
  chips,
  selected,
  onSelect,
}: {
  chips: readonly Chip[] | Chip[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View className="mb-3 flex-row flex-wrap">
      {chips.map((chip) => {
        const active = chip.value === selected;
        return (
          <Pressable
            key={chip.value}
            onPress={() => onSelect(chip.value)}
            className={`mb-2 mr-2 rounded-full px-3 py-2 ${active ? 'bg-gold' : 'bg-sand'}`}>
            <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-brown'}`}>{chip.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
