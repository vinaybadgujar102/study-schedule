import {
  format,
  formatDistance,
  formatRelative,
  isToday,
  isTomorrow,
} from "date-fns";

/**
 * Format a date as a relative string (e.g., "today", "tomorrow", or "in 3 days")
 */
export function formatRelativeDate(date: Date): string {
  if (isToday(date)) {
    return "Today";
  }

  if (isTomorrow(date)) {
    return "Tomorrow";
  }

  return (
    formatRelative(date, new Date()).charAt(0).toUpperCase() +
    formatRelative(date, new Date()).slice(1)
  );
}

/**
 * Format the distance from today to a future date
 */
export function formatDateDistance(date: Date): string {
  return formatDistance(date, new Date(), { addSuffix: true });
}

/**
 * Format a date in a readable format
 */
export function formatReadableDate(date: Date): string {
  return format(date, "MMMM d, yyyy");
}
