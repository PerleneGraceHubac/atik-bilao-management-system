import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from 'date-fns';

export const DATE_FMT = 'yyyy-MM-dd';
export const TIME_FMT = 'HH:mm';
export const DISPLAY_DATE = 'MMM d, yyyy';
export const DISPLAY_DAY = 'EEEE';

export function todayIso(): string {
  return format(startOfToday(), DATE_FMT);
}

export function tomorrowIso(): string {
  return format(addDays(startOfToday(), 1), DATE_FMT);
}

export function weekRangeIso(): { from: string; to: string } {
  const start = startOfWeek(startOfToday(), { weekStartsOn: 0 });
  const end = addDays(start, 6);
  return { from: format(start, DATE_FMT), to: format(end, DATE_FMT) };
}

export function formatDate(isoDate: string): string {
  return format(parseISO(isoDate), DISPLAY_DATE);
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = Number(hours);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const twelve = hour % 12 || 12;
  return `${twelve}:${minutes?.slice(0, 2) ?? '00'} ${suffix}`;
}

export function formatDateTime(isoDate: string, time: string): string {
  return `${formatDate(isoDate)} · ${formatTime(time)}`;
}

export function monthGrid(anchor: Date): Date[] {
  const start = startOfWeek(startOfMonth(anchor), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(anchor), { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

export function toIsoDate(date: Date): string {
  return format(date, DATE_FMT);
}

export function fromIsoDate(iso: string): Date {
  return parseISO(iso);
}

export function isCurrentMonth(date: Date, anchor: Date): boolean {
  return isSameMonth(date, anchor);
}

export { isToday, format };
