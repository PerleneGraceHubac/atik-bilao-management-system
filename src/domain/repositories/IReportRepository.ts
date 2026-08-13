import type {
  DailySalesRow,
  MonthlySalesRow,
  ReportSummary,
} from '@/domain/entities';

export interface IReportRepository {
  getSummary(): Promise<ReportSummary>;
  getDailySales(days: number): Promise<DailySalesRow[]>;
  getMonthlySales(months: number): Promise<MonthlySalesRow[]>;
}
