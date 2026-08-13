import { useQuery } from '@tanstack/react-query';
import { customerRepository } from '@/data/repositories/customerRepository';
import { queryKeys } from '@/lib/queryKeys';

export function useCustomerSearch(query: string) {
  return useQuery({
    queryKey: queryKeys.customers.search(query),
    queryFn: () => customerRepository.searchCustomers(query),
  });
}

export function useCustomerDetail(id?: string) {
  return useQuery({
    queryKey: queryKeys.customers.detail(id ?? ''),
    queryFn: () => customerRepository.getCustomerWithOrders(id!),
    enabled: Boolean(id),
  });
}
