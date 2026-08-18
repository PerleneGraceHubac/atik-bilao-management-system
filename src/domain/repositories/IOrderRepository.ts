import type {
  CreateOrderItemInput,
  DashboardStats,
  KitchenDishGroup,
  Order,
  OrderFilters,
  OrderListItem,
  OrderStatus,
  UpsertOrderInput,
} from '@/domain/entities';

export interface IOrderRepository {
  getOrders(filters: OrderFilters): Promise<OrderListItem[]>;
  getOrderById(id: string): Promise<Order>;
  createOrder(input: UpsertOrderInput): Promise<Order>;
  updateOrder(id: string, input: UpsertOrderInput): Promise<Order>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<void>;
  deleteOrder(id: string): Promise<void>;
  getOrderStats(): Promise<DashboardStats>;
  getOrdersByDate(date: string): Promise<OrderListItem[]>;
  getOrderCountsByDateRange(from: string, to: string): Promise<Record<string, number>>;
  getKitchenSummary(date: string): Promise<KitchenDishGroup[]>;
}

export type { CreateOrderItemInput };
