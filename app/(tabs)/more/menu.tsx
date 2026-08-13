import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/layout/States';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
  useCreateDish,
  useCreateSize,
  useDishPrices,
  useDishes,
  useSizes,
  useToggleDish,
  useToggleSize,
  useUpdateDish,
  useUpsertPrice,
} from '@/hooks/useMenu';
import { formatPeso } from '@/lib/currency';

export default function MenuScreen() {
  const dishes = useDishes(true);
  const sizes = useSizes(true);
  const prices = useDishPrices();
  const createDish = useCreateDish();
  const updateDish = useUpdateDish();
  const toggleDish = useToggleDish();
  const createSize = useCreateSize();
  const toggleSize = useToggleSize();
  const upsertPrice = useUpsertPrice();

  const [dishName, setDishName] = useState('');
  const [sizeName, setSizeName] = useState('');
  const [editingDish, setEditingDish] = useState<string | null>(null);
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});

  const saveDish = async () => {
    try {
      if (!dishName.trim()) return;
      if (editingDish) {
        await updateDish.mutateAsync({ id: editingDish, name: dishName });
        setEditingDish(null);
      } else {
        await createDish.mutateAsync(dishName);
      }
      setDishName('');
    } catch (error) {
      Alert.alert('Could not save dish', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  const saveSize = async () => {
    try {
      if (!sizeName.trim()) return;
      await createSize.mutateAsync(sizeName);
      setSizeName('');
    } catch (error) {
      Alert.alert('Could not save size', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  const priceKey = (dishId: string, sizeId: string) => `${dishId}:${sizeId}`;

  const currentPrice = (dishId: string, sizeId: string) => {
    const key = priceKey(dishId, sizeId);
    if (priceDrafts[key] !== undefined) return priceDrafts[key];
    const found = prices.data?.find((price) => price.dishId === dishId && price.sizeId === sizeId);
    return found ? String(found.unitPrice) : '';
  };

  const savePrice = async (dishId: string, sizeId: string) => {
    const raw = currentPrice(dishId, sizeId);
    const unitPrice = Number(raw);
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      Alert.alert('Invalid price', 'Enter a number 0 or greater.');
      return;
    }
    try {
      await upsertPrice.mutateAsync({ dishId, sizeId, unitPrice });
    } catch (error) {
      Alert.alert('Could not save price', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  if (dishes.isLoading || sizes.isLoading) {
    return (
      <Screen topInset={false}>
        <LoadingState message="Loading menu…" />
      </Screen>
    );
  }

  if (dishes.isError || sizes.isError) {
    return (
      <Screen topInset={false}>
        <ErrorState message="Could not load the menu." onRetry={() => dishes.refetch()} />
      </Screen>
    );
  }

  return (
    <Screen topInset={false}>
      <Text className="mb-4 text-base text-brown-muted">Manage dishes, sizes, and default prices.</Text>

      <Text className="mb-2 text-lg font-bold text-brown">Bilao sizes</Text>
      <Input label="New size" value={sizeName} onChangeText={setSizeName} placeholder="e.g. Party tray" />
      <Button label="Add size" variant="secondary" onPress={saveSize} disabled={createSize.isPending} />
      <View className="mt-3">
        {(sizes.data ?? []).map((size) => (
          <View key={size.id} className="mb-2 flex-row items-center justify-between rounded-xl bg-paper px-3 py-3">
            <Text className={`text-base ${size.isActive ? 'text-brown' : 'text-brown-light'}`}>{size.name}</Text>
            <Pressable onPress={() => toggleSize.mutate({ id: size.id, isActive: !size.isActive })}>
              <Text className="font-semibold text-gold">{size.isActive ? 'Hide' : 'Show'}</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <Text className="mb-2 mt-6 text-lg font-bold text-brown">Dishes</Text>
      <Input
        label={editingDish ? 'Rename dish' : 'New dish'}
        value={dishName}
        onChangeText={setDishName}
        placeholder="e.g. Palabok"
        autoCapitalize="words"
      />
      <Button
        label={editingDish ? 'Save dish name' : 'Add dish'}
        onPress={saveDish}
        disabled={createDish.isPending || updateDish.isPending}
      />
      {editingDish ? (
        <View className="mt-2">
          <Button
            label="Cancel rename"
            variant="ghost"
            onPress={() => {
              setEditingDish(null);
              setDishName('');
            }}
          />
        </View>
      ) : null}

      {(dishes.data ?? []).length === 0 ? (
        <View className="mt-4">
          <EmptyState title="No dishes yet" message="Add a dish, then set a price for each size." />
        </View>
      ) : null}

      {(dishes.data ?? []).map((dish) => (
        <View key={dish.id} className="mt-4">
          <Card>
            <View className="flex-row items-center justify-between">
              <Text className={`text-lg font-bold ${dish.isActive ? 'text-brown' : 'text-brown-light'}`}>{dish.name}</Text>
              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => {
                    setEditingDish(dish.id);
                    setDishName(dish.name);
                  }}>
                  <Text className="font-semibold text-gold">Rename</Text>
                </Pressable>
                <Pressable onPress={() => toggleDish.mutate({ id: dish.id, isActive: !dish.isActive })}>
                  <Text className="font-semibold text-gold">{dish.isActive ? 'Hide' : 'Show'}</Text>
                </Pressable>
              </View>
            </View>
            {(sizes.data ?? [])
              .filter((size) => size.isActive)
              .map((size) => (
                <View key={size.id} className="mt-3 border-t border-sand pt-3">
                  <Input
                    label={`${size.name} price`}
                    value={currentPrice(dish.id, size.id)}
                    onChangeText={(text) =>
                      setPriceDrafts((current) => ({ ...current, [priceKey(dish.id, size.id)]: text }))
                    }
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                  />
                  <Button
                    label={`Save ${size.name} ${formatPeso(Number(currentPrice(dish.id, size.id) || 0))}`}
                    variant="secondary"
                    onPress={() => savePrice(dish.id, size.id)}
                  />
                </View>
              ))}
          </Card>
        </View>
      ))}
    </Screen>
  );
}
