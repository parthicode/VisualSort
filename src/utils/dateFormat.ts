/**
 * Date formatting utilities for ISO 8601 strings
 */

export function getCurrentISODate(): string {
  return new Date().toISOString();
}

export function formatISODate(date: Date): string {
  return date.toISOString();
}

export function parseISODate(isoString: string): Date {
  return new Date(isoString);
}
