import { create } from 'zustand';
import type { OrderFilter } from '@/domain/entities';
import { todayIso } from '@/lib/dates';

interface FilterState {
  orderFilter: OrderFilter;
  searchQuery: string;
  kitchenDate: string;
  setOrderFilter: (filter: OrderFilter) => void;
  setSearchQuery: (query: string) => void;
  setKitchenDate: (date: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  orderFilter: 'today',
  searchQuery: '',
  kitchenDate: todayIso(),
  setOrderFilter: (orderFilter) => set({ orderFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setKitchenDate: (kitchenDate) => set({ kitchenDate }),
}));
