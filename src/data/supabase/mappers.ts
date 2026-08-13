import type {
  BilaoSize,
  Customer,
  Dish,
  DishPrice,
  Order,
  OrderItem,
  OrderListItem,
  OrderStatus,
  OrderType,
} from '@/domain/entities';
import { toMoney } from '@/lib/currency';

export interface CustomerRow {
  id: string;
  name: string;
  contact_number: string;
  address: string | null;
  created_at: string;
}

export interface DishRow {
  id: string;
  name: string;
  is_active: boolean;
  sort_order: number;
}

export interface SizeRow {
  id: string;
  name: string;
  is_active: boolean;
  sort_order: number;
}

export interface PriceRow {
  id: string;
  dish_id: string;
  size_id: string;
  unit_price: number | string;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  dish_id: string;
  size_id: string;
  quantity: number;
  unit_price: number | string;
  subtotal: number | string;
  dishes?: DishRow | DishRow[] | null;
  bilao_sizes?: SizeRow | SizeRow[] | null;
}

export interface OrderRow {
  id: string;
  customer_id: string;
  order_type: OrderType;
  delivery_date: string;
  delivery_time: string;
  remarks: string | null;
  status: OrderStatus;
  total_amount: number | string;
  created_at: string;
  updated_at: string;
  customers?: CustomerRow | CustomerRow[] | null;
  order_items?: OrderItemRow[] | null;
}

function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export function mapCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    name: row.name,
    contactNumber: row.contact_number,
    address: row.address,
    createdAt: row.created_at,
  };
}

export function mapDish(row: DishRow): Dish {
  return {
    id: row.id,
    name: row.name,
    isActive: row.is_active,
    sortOrder: row.sort_order,
  };
}

export function mapSize(row: SizeRow): BilaoSize {
  return {
    id: row.id,
    name: row.name,
    isActive: row.is_active,
    sortOrder: row.sort_order,
  };
}

export function mapPrice(row: PriceRow): DishPrice {
  return {
    id: row.id,
    dishId: row.dish_id,
    sizeId: row.size_id,
    unitPrice: toMoney(row.unit_price),
  };
}

export function mapOrderItem(row: OrderItemRow): OrderItem {
  const dish = one(row.dishes);
  const size = one(row.bilao_sizes);
  return {
    id: row.id,
    orderId: row.order_id,
    dishId: row.dish_id,
    dishName: dish?.name ?? 'Unknown dish',
    sizeId: row.size_id,
    sizeName: size?.name ?? 'Unknown size',
    quantity: row.quantity,
    unitPrice: toMoney(row.unit_price),
    subtotal: toMoney(row.subtotal),
  };
}

function normalizeTime(time: string): string {
  return time.slice(0, 5);
}

export function mapOrder(row: OrderRow): Order {
  const customer = one(row.customers);
  if (!customer) {
    throw new Error('Order is missing customer data.');
  }
  return {
    id: row.id,
    customer: mapCustomer(customer),
    orderType: row.order_type,
    deliveryDate: row.delivery_date,
    deliveryTime: normalizeTime(row.delivery_time),
    remarks: row.remarks,
    status: row.status,
    totalAmount: toMoney(row.total_amount),
    items: (row.order_items ?? []).map(mapOrderItem),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapOrderListItem(row: OrderRow): OrderListItem {
  const customer = one(row.customers);
  return {
    id: row.id,
    customerName: customer?.name ?? 'Unknown customer',
    contactNumber: customer?.contact_number ?? '',
    orderType: row.order_type,
    deliveryDate: row.delivery_date,
    deliveryTime: normalizeTime(row.delivery_time),
    status: row.status,
    totalAmount: toMoney(row.total_amount),
    itemCount: row.order_items?.length ?? 0,
    remarks: row.remarks,
  };
}
