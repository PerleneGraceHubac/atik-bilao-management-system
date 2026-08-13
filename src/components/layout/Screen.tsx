import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  topInset?: boolean;
}

export function Screen({ children, scroll = true, padded = true, topInset = true }: ScreenProps) {
  const body = padded ? <View className="flex-1 px-4 py-3">{children}</View> : children;
  const edges = topInset ? (['top', 'left', 'right'] as const) : (['left', 'right'] as const);

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={edges}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {scroll ? (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {body}
          </ScrollView>
        ) : (
          body
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View className="mb-4">
      <View className="mb-3 h-1 w-12 rounded-full bg-gold" />
      <Text className="text-2xl font-bold text-brown">{title}</Text>
      {subtitle ? <Text className="mt-1 text-base text-brown-muted">{subtitle}</Text> : null}
    </View>
  );
}
