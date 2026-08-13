import { useQuery } from '@tanstack/react-query';
import { reportRepository } from '@/data/repositories/reportRepository';
import { queryKeys } from '@/lib/queryKeys';

export function useReportSummary() {
  return useQuery({
    queryKey: queryKeys.reports.summary,
    queryFn: () => reportRepository.getSummary(),
  });
}

export function useDailySales(days = 7) {
  return useQuery({
    queryKey: queryKeys.reports.daily(days),
    queryFn: () => reportRepository.getDailySales(days),
  });
}

export function useMonthlySales(months = 6) {
  return useQuery({
    queryKey: queryKeys.reports.monthly(months),
    queryFn: () => reportRepository.getMonthlySales(months),
  });
}
