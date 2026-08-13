import { Modal, Pressable, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable className="flex-1 items-center justify-center bg-black/40 px-6" onPress={onCancel}>
        <Pressable className="w-full rounded-2xl bg-cream p-5" onPress={() => undefined}>
          <Text className="text-lg font-bold text-brown">{title}</Text>
          <Text className="mt-2 text-base text-brown-muted">{message}</Text>
          <View className="mt-4 gap-2">
            <Button label={confirmLabel} variant="destructive" onPress={onConfirm} />
            <Button label="Cancel" variant="secondary" onPress={onCancel} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
