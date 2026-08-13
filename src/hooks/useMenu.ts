import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { menuRepository } from '@/data/repositories/menuRepository';
import { queryKeys } from '@/lib/queryKeys';

export function useDishes(includeInactive = false) {
  return useQuery({
    queryKey: [...queryKeys.menu.dishes, includeInactive],
    queryFn: () => menuRepository.getDishes(includeInactive),
  });
}

export function useSizes(includeInactive = false) {
  return useQuery({
    queryKey: [...queryKeys.menu.sizes, includeInactive],
    queryFn: () => menuRepository.getSizes(includeInactive),
  });
}

export function useDishPrices() {
  return useQuery({
    queryKey: queryKeys.menu.prices,
    queryFn: () => menuRepository.getDishPrices(),
  });
}

function invalidateMenu(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: queryKeys.menu.all });
}

export function useCreateDish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => menuRepository.createDish(name),
    onSuccess: () => invalidateMenu(queryClient),
  });
}

export function useUpdateDish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => menuRepository.updateDish(id, name),
    onSuccess: () => invalidateMenu(queryClient),
  });
}

export function useToggleDish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      menuRepository.deactivateDish(id, isActive),
    onSuccess: () => invalidateMenu(queryClient),
  });
}

export function useCreateSize() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => menuRepository.createSize(name),
    onSuccess: () => invalidateMenu(queryClient),
  });
}

export function useUpdateSize() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => menuRepository.updateSize(id, name),
    onSuccess: () => invalidateMenu(queryClient),
  });
}

export function useToggleSize() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      menuRepository.deactivateSize(id, isActive),
    onSuccess: () => invalidateMenu(queryClient),
  });
}

export function useUpsertPrice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ dishId, sizeId, unitPrice }: { dishId: string; sizeId: string; unitPrice: number }) =>
      menuRepository.upsertPrice(dishId, sizeId, unitPrice),
    onSuccess: () => invalidateMenu(queryClient),
  });
}
