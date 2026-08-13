import { Text, TextInput, View } from 'react-native';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'phone-pad' | 'numeric' | 'decimal-pad';
  multiline?: boolean;
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words';
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  error,
  autoCapitalize = 'sentences',
}: InputProps) {
  return (
    <View className="mb-3">
      <Text className="mb-1.5 text-sm font-semibold text-brown">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9A8474"
        keyboardType={keyboardType}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        className={`rounded-xl border bg-paper px-4 text-base text-brown ${multiline ? 'min-h-[88px] py-3' : 'min-h-[48px]'} ${error ? 'border-red-500' : 'border-sand'}`}
      />
      {error ? <Text className="mt-1 text-sm text-red-700">{error}</Text> : null}
    </View>
  );
}
