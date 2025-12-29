import { format, formatDistance, formatDistanceToNow, isPast, isFuture, differenceInMinutes, differenceInHours, differenceInDays, isValid } from 'date-fns';

// Helper to validate and parse date
const parseDate = (date: string | Date | null | undefined): Date | null => {
  if (!date) return null;
  
  if (date instanceof Date) {
    return isValid(date) ? date : null;
  }
  
  const parsed = new Date(date);
  return isValid(parsed) ? parsed : null;
};

export const formatDate = (date: string | Date): string => {
  const parsed = parseDate(date);
  if (!parsed) return 'Invalid date';
  return format(parsed, 'MMM dd, yyyy');
};

export const formatDateTime = (date: string | Date): string => {
  const parsed = parseDate(date);
  if (!parsed) return 'Invalid date';
  return format(parsed, 'MMM dd, yyyy HH:mm');
};

export const formatTimeAgo = (date: string | Date): string => {
  const parsed = parseDate(date);
  if (!parsed) return 'Unknown';
  return formatDistanceToNow(parsed, { addSuffix: true });
};

export const formatDuration = (startDate: string | Date, endDate: string | Date): string => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (!start || !end) return 'Unknown';
  return formatDistance(start, end);
};

export const isDatePast = (date: string | Date): boolean => {
  const parsed = parseDate(date);
  if (!parsed) return false;
  return isPast(parsed);
};

export const isDateFuture = (date: string | Date): boolean => {
  const parsed = parseDate(date);
  if (!parsed) return false;
  return isFuture(parsed);
};

export const getAuctionStatus = (startDate: string, endDate: string): 'upcoming' | 'active' | 'ended' => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  
  if (!start || !end) return 'ended'; // Default to ended if dates are invalid
  
  const now = new Date();

  if (now < start) return 'upcoming';
  if (now > end) return 'ended';
  return 'active';
};

export const getTimeRemaining = (targetDate: string | Date): {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} => {
  const parsed = parseDate(targetDate);
  if (!parsed) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  const total = parsed.getTime() - new Date().getTime();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
};

export const formatCountdown = (targetDate: string | Date): string => {
  const parsed = parseDate(targetDate);
  if (!parsed) return 'Invalid date';
  
  const { total, days, hours, minutes } = getTimeRemaining(targetDate);

  if (total <= 0) return 'Ended';

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const getMinutesUntil = (date: string | Date): number => {
  const parsed = parseDate(date);
  if (!parsed) return 0;
  return differenceInMinutes(parsed, new Date());
};

export const getHoursUntil = (date: string | Date): number => {
  const parsed = parseDate(date);
  if (!parsed) return 0;
  return differenceInHours(parsed, new Date());
};

export const getDaysUntil = (date: string | Date): number => {
  const parsed = parseDate(date);
  if (!parsed) return 0;
  return differenceInDays(parsed, new Date());
};

