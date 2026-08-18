import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderRepository } from '@/data/repositories/orderRepository';
import type { OrderFilters, OrderStatus, UpsertOrderInput } from '@/domain/entities';
import { queryKeys } from '@/lib/queryKeys';

export function useOrders(filters: OrderFilters) {
  return useQuery({
    queryKey: queryKeys.orders.list(filters.filter, filters.search),
    queryFn: () => orderRepository.getOrders(filters),
  });
}

export function useOrder(id?: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id ?? ''),
    queryFn: () => orderRepository.getOrderById(id!),
    enabled: Boolean(id),
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.orders.stats,
    queryFn: () => orderRepository.getOrderStats(),
  });
}

export function useOrdersByDate(date: string) {
  return useQuery({
    queryKey: queryKeys.orders.byDate(date),
    queryFn: () => orderRepository.getOrdersByDate(date),
    enabled: Boolean(date),
  });
}

export function useCalendarCounts(from: string, to: string) {
  return useQuery({
    queryKey: queryKeys.orders.counts(from, to),
    queryFn: () => orderRepository.getOrderCountsByDateRange(from, to),
  });
}

export function useKitchenSummary(date: string) {
  return useQuery({
    queryKey: queryKeys.orders.kitchen(date),
    queryFn: () => orderRepository.getKitchenSummary(date),
    enabled: Boolean(date),
  });
}

function invalidateOrders(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.orders.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.customers.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.reports.all }),
  ]);
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpsertOrderInput) => orderRepository.createOrder(input),
    onSuccess: () => invalidateOrders(queryClient),
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpsertOrderInput }) =>
      orderRepository.updateOrder(id, input),
    onSuccess: () => invalidateOrders(queryClient),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      orderRepository.updateOrderStatus(id, status),
    onSuccess: () => invalidateOrders(queryClient),
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderRepository.deleteOrder(id),
    onSuccess: () => invalidateOrders(queryClient),
  });
}
