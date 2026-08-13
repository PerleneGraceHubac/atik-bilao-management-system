import { Pressable, Text, View } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  disabled?: boolean;
  fullWidth?: boolean;
}

const variants = {
  primary: 'bg-gold',
  secondary: 'bg-sand',
  destructive: 'bg-red-700',
  ghost: 'bg-transparent',
};

const labelVariants = {
  primary: 'text-white',
  secondary: 'text-brown',
  destructive: 'text-white',
  ghost: 'text-gold',
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  fullWidth = true,
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      className={`min-h-[48px] items-center justify-center rounded-xl px-4 py-3 ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50' : ''}`}>
      <Text className={`text-base font-semibold ${labelVariants[variant]}`}>{label}</Text>
    </Pressable>
  );
}

export function ButtonRow({ children }: { children: React.ReactNode }) {
  return <View className="mt-3 flex-row gap-3">{children}</View>;
}
