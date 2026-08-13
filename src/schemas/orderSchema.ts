import { z } from 'zod';

export const orderItemSchema = z.object({
  dishId: z.string().min(1, 'Select a dish'),
  sizeId: z.string().min(1, 'Select a size'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Price cannot be negative'),
});

export const orderFormSchema = z
  .object({
    customerName: z.string().trim().min(1, 'Customer name is required'),
    contactNumber: z.string().trim().min(7, 'Contact number is required'),
    address: z.string(),
    orderType: z.enum(['pickup', 'delivery']),
    deliveryDate: z.string().min(1, 'Date is required'),
    deliveryTime: z.string().min(1, 'Time is required'),
    remarks: z.string(),
    status: z.enum(['pending', 'preparing', 'completed', 'cancelled']),
    items: z.array(orderItemSchema).min(1, 'Add at least one item'),
  })
  .superRefine((value, ctx) => {
    if (value.orderType === 'delivery' && !value.address.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Address is required for delivery',
        path: ['address'],
      });
    }
  });

export type OrderFormValues = z.infer<typeof orderFormSchema>;

export const dishFormSchema = z.object({
  name: z.string().trim().min(1, 'Dish name is required'),
});

export const sizeFormSchema = z.object({
  name: z.string().trim().min(1, 'Size name is required'),
});
