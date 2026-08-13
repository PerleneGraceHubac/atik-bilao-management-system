import { useEffect, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DatePickerField, TimePickerField } from '@/components/ui/DateTimeFields';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useCustomerSearch } from '@/hooks/useCustomers';
import { useDishPrices, useDishes, useSizes } from '@/hooks/useMenu';
import { ORDER_STATUSES, ORDER_TYPES } from '@/lib/constants';
import { formatPeso } from '@/lib/currency';
import { todayIso } from '@/lib/dates';
import { orderFormSchema, type OrderFormValues } from '@/schemas/orderSchema';
import { colors } from '@/theme/colors';
import type { Order, UpsertOrderInput } from '@/domain/entities';

const emptyItem = { dishId: '', sizeId: '', quantity: 1, unitPrice: 0 };

interface OrderFormProps {
  initial?: Order;
  submitting?: boolean;
  onSubmit: (input: UpsertOrderInput) => void;
}

export function OrderForm({ initial, submitting, onSubmit }: OrderFormProps) {
  const { data: dishes = [] } = useDishes();
  const { data: sizes = [] } = useSizes();
  const { data: prices = [] } = useDishPrices();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: initial
      ? {
          customerName: initial.customer.name,
          contactNumber: initial.customer.contactNumber,
          address: initial.customer.address ?? '',
          orderType: initial.orderType,
          deliveryDate: initial.deliveryDate,
          deliveryTime: initial.deliveryTime,
          remarks: initial.remarks ?? '',
          status: initial.status,
          items: initial.items.map((item) => ({
            dishId: item.dishId,
            sizeId: item.sizeId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        }
      : {
          customerName: '',
          contactNumber: '',
          address: '',
          orderType: 'pickup',
          deliveryDate: todayIso(),
          deliveryTime: '12:00',
          remarks: '',
          status: 'pending',
          items: [emptyItem],
        },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'items' });
  const watchName = form.watch('customerName');
  const watchItems = form.watch('items');
  const { data: matches = [] } = useCustomerSearch(watchName);

  const dishOptions = dishes.map((dish) => ({ label: dish.name, value: dish.id }));
  const sizeOptions = sizes.map((size) => ({ label: size.name, value: size.id }));

  const total = useMemo(
    () => watchItems.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0),
    [watchItems],
  );

  useEffect(() => {
    if (initial) {
      form.reset({
        customerName: initial.customer.name,
        contactNumber: initial.customer.contactNumber,
        address: initial.customer.address ?? '',
        orderType: initial.orderType,
        deliveryDate: initial.deliveryDate,
        deliveryTime: initial.deliveryTime,
        remarks: initial.remarks ?? '',
        status: initial.status,
        items: initial.items.map((item) => ({
          dishId: item.dishId,
          sizeId: item.sizeId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });
    }
  }, [initial, form]);

  const applyPrice = (index: number, dishId: string, sizeId: string) => {
    const match = prices.find((price) => price.dishId === dishId && price.sizeId === sizeId);
    if (match) {
      form.setValue(`items.${index}.unitPrice`, match.unitPrice, { shouldValidate: true });
    }
  };

  return (
    <View>
      <Text className="mb-2 text-lg font-bold text-brown">Customer</Text>
      <Controller
        control={form.control}
        name="customerName"
        render={({ field, fieldState }) => (
          <Input
            label="Name"
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Customer name"
            error={fieldState.error?.message}
            autoCapitalize="words"
          />
        )}
      />
      {watchName.length >= 2 && matches.length > 0 ? (
        <Card>
          {matches.slice(0, 4).map((customer) => (
            <Pressable
              key={customer.id}
              className="min-h-[44px] justify-center border-b border-sand py-2 last:border-b-0"
              onPress={() => {
                form.setValue('customerName', customer.name);
                form.setValue('contactNumber', customer.contactNumber);
                form.setValue('address', customer.address ?? '');
              }}>
              <Text className="font-semibold text-brown">{customer.name}</Text>
              <Text className="text-sm text-brown-muted">{customer.contactNumber}</Text>
            </Pressable>
          ))}
        </Card>
      ) : null}

      <Controller
        control={form.control}
        name="contactNumber"
        render={({ field, fieldState }) => (
          <Input
            label="Contact number"
            value={field.value}
            onChangeText={field.onChange}
            placeholder="09XXXXXXXXX"
            keyboardType="phone-pad"
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={form.control}
        name="address"
        render={({ field, fieldState }) => (
          <Input
            label="Address"
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Required for delivery"
            multiline
            error={fieldState.error?.message}
          />
        )}
      />

      <Text className="mb-2 mt-4 text-lg font-bold text-brown">Order details</Text>
      <Controller
        control={form.control}
        name="orderType"
        render={({ field }) => (
          <Select label="Order type" value={field.value} options={ORDER_TYPES} onChange={field.onChange} />
        )}
      />
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Controller
            control={form.control}
            name="deliveryDate"
            render={({ field, fieldState }) => (
              <DatePickerField label="Date" value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
            )}
          />
        </View>
        <View className="flex-1">
          <Controller
            control={form.control}
            name="deliveryTime"
            render={({ field, fieldState }) => (
              <TimePickerField label="Time" value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
            )}
          />
        </View>
      </View>
      <Controller
        control={form.control}
        name="status"
        render={({ field }) => (
          <Select label="Status" value={field.value} options={ORDER_STATUSES} onChange={field.onChange} />
        )}
      />
      <Controller
        control={form.control}
        name="remarks"
        render={({ field }) => (
          <Input label="Remarks" value={field.value} onChangeText={field.onChange} placeholder="Allergies, extra sauce, notes…" multiline />
        )}
      />

      <Text className="mb-2 mt-4 text-lg font-bold text-brown">Items</Text>
      {fields.map((field, index) => (
        <View key={field.id} className="mb-3 rounded-2xl border border-sand bg-paper p-3">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="font-semibold text-brown">Item {index + 1}</Text>
            {fields.length > 1 ? (
              <Pressable onPress={() => remove(index)} className="p-1">
                <Ionicons name="trash-outline" size={18} color={colors.danger} />
              </Pressable>
            ) : null}
          </View>
          <Controller
            control={form.control}
            name={`items.${index}.dishId`}
            render={({ field: itemField, fieldState }) => (
              <Select
                label="Dish"
                value={itemField.value}
                options={dishOptions}
                placeholder="Choose dish"
                error={fieldState.error?.message}
                onChange={(value) => {
                  itemField.onChange(value);
                  applyPrice(index, value, form.getValues(`items.${index}.sizeId`));
                }}
              />
            )}
          />
          <Controller
            control={form.control}
            name={`items.${index}.sizeId`}
            render={({ field: itemField, fieldState }) => (
              <Select
                label="Bilao size"
                value={itemField.value}
                options={sizeOptions}
                placeholder="Choose size"
                error={fieldState.error?.message}
                onChange={(value) => {
                  itemField.onChange(value);
                  applyPrice(index, form.getValues(`items.${index}.dishId`), value);
                }}
              />
            )}
          />
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Controller
                control={form.control}
                name={`items.${index}.quantity`}
                render={({ field: itemField, fieldState }) => (
                  <Input
                    label="Qty"
                    value={String(itemField.value ?? '')}
                    onChangeText={(text) => itemField.onChange(Number(text) || 0)}
                    keyboardType="numeric"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </View>
            <View className="flex-1">
              <Controller
                control={form.control}
                name={`items.${index}.unitPrice`}
                render={({ field: itemField, fieldState }) => (
                  <Input
                    label="Unit price"
                    value={String(itemField.value ?? '')}
                    onChangeText={(text) => itemField.onChange(Number(text) || 0)}
                    keyboardType="decimal-pad"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </View>
          </View>
          <Text className="text-right font-semibold text-brown">
            Subtotal {formatPeso(Number(watchItems[index]?.quantity || 0) * Number(watchItems[index]?.unitPrice || 0))}
          </Text>
        </View>
      ))}

      <Button label="Add item" variant="secondary" onPress={() => append(emptyItem)} />
      {form.formState.errors.items?.root?.message || form.formState.errors.items?.message ? (
        <Text className="mt-2 text-sm text-red-700">
          {form.formState.errors.items?.root?.message || form.formState.errors.items?.message}
        </Text>
      ) : null}

      <View className="mt-5 rounded-2xl bg-brown px-4 py-4">
        <Text className="text-sm text-sand">Total amount</Text>
        <Text className="text-3xl font-bold text-white">{formatPeso(total)}</Text>
      </View>

      <View className="mt-4">
        <Button
          label={submitting ? 'Saving…' : 'Save order'}
          disabled={submitting}
          onPress={form.handleSubmit((values) => onSubmit(values))}
        />
      </View>
    </View>
  );
}
