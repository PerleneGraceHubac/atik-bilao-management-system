export const queryKeys = {
  orders: {
    all: ['orders'] as const,
    list: (filter: string, search: string) => ['orders', 'list', filter, search] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
    stats: ['orders', 'stats'] as const,
    byDate: (date: string) => ['orders', 'date', date] as const,
    counts: (from: string, to: string) => ['orders', 'counts', from, to] as const,
    kitchen: (date: string) => ['orders', 'kitchen', date] as const,
  },
  menu: {
    all: ['menu'] as const,
    dishes: ['menu', 'dishes'] as const,
    sizes: ['menu', 'sizes'] as const,
    prices: ['menu', 'prices'] as const,
  },
  customers: {
    all: ['customers'] as const,
    search: (q: string) => ['customers', 'search', q] as const,
    detail: (id: string) => ['customers', 'detail', id] as const,
  },
  reports: {
    all: ['reports'] as const,
    summary: ['reports', 'summary'] as const,
    daily: (days: number) => ['reports', 'daily', days] as const,
    monthly: (months: number) => ['reports', 'monthly', months] as const,
  },
};
