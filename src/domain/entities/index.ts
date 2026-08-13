export type OrderType = 'pickup' | 'delivery';
export type OrderStatus = 'pending' | 'preparing' | 'completed' | 'cancelled';

export interface Customer {
  id: string;
  name: string;
  contactNumber: string;
  address: string | null;
  createdAt: string;
}

export interface Dish {
  id: string;
  name: string;
  isActive: boolean;
  sortOrder: number;
}

export interface BilaoSize {
  id: string;
  name: string;
  isActive: boolean;
  sortOrder: number;
}

export interface DishPrice {
  id: string;
  dishId: string;
  sizeId: string;
  unitPrice: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  dishId: string;
  dishName: string;
  sizeId: string;
  sizeName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  customer: Customer;
  orderType: OrderType;
  deliveryDate: string;
  deliveryTime: string;
  remarks: string | null;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderListItem {
  id: string;
  customerName: string;
  contactNumber: string;
  orderType: OrderType;
  deliveryDate: string;
  deliveryTime: string;
  status: OrderStatus;
  totalAmount: number;
  itemCount: number;
  remarks: string | null;
}

export type OrderFilter =
  | 'all'
  | 'today'
  | 'tomorrow'
  | 'this_week'
  | 'pending'
  | 'completed'
  | 'cancelled';

export interface OrderFilters {
  filter: OrderFilter;
  search: string;
}

export interface CreateOrderItemInput {
  dishId: string;
  sizeId: string;
  quantity: number;
  unitPrice: number;
}

export interface UpsertOrderInput {
  customerName: string;
  contactNumber: string;
  address?: string;
  orderType: OrderType;
  deliveryDate: string;
  deliveryTime: string;
  remarks?: string;
  status: OrderStatus;
  items: CreateOrderItemInput[];
}

export interface DashboardStats {
  todayCount: number;
  tomorrowCount: number;
  weekCount: number;
  pendingCount: number;
  todaySales: number;
}

export interface KitchenSizeQty {
  sizeId: string;
  sizeName: string;
  quantity: number;
}

export interface KitchenDishGroup {
  dishId: string;
  dishName: string;
  sizes: KitchenSizeQty[];
  totalQuantity: number;
}

export interface CustomerDetail {
  customer: Customer;
  orders: OrderListItem[];
}

export interface DailySalesRow {
  date: string;
  orderCount: number;
  sales: number;
}

export interface MonthlySalesRow {
  month: string;
  orderCount: number;
  sales: number;
}

export interface TopDishRow {
  dishName: string;
  quantity: number;
  revenue: number;
}

export interface ReportSummary {
  todaySales: number;
  monthSales: number;
  totalOrders: number;
  topDishes: TopDishRow[];
}
