/**
 * Calendar engine — pure functions, zero side effects, zero dependencies.
 * Grid layout follows the ISO week standard: Monday is the first day of the week.
 */

import type { CalendarDay, CalendarGrid, MonthData } from "./types";
import { getHoliday } from "./holidays";

/* ─── DATE HELPERS ─── */

/** Check if a year is a leap year */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** Get the number of days in a given month (0-indexed) */
export function getDaysInMonth(year: number, month: number): number {
  // The "day 0 of next month" trick: reliable across all months
  return new Date(year, month + 1, 0).getDate();
}

/** Get the day-of-week for the 1st of a month, Monday-indexed (Mon=0, Sun=6) */
export function getFirstDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Convert Sun=0 to Sun=6
}

/** Format a date as "YYYY-MM-DD" key string */
export function dateToKey(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

/** Parse a "YYYY-MM-DD" key back to a Date */
export function keyToDate(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Check if two dates are the same calendar day */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Compare two dateKeys chronologically. Returns -1, 0, or 1. */
export function compareDateKeys(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/** Ensure start <= end; swap if needed */
export function normalizeRange(a: string, b: string): [string, string] {
  return compareDateKeys(a, b) <= 0 ? [a, b] : [b, a];
}

/** Check if a dateKey falls between start and end (inclusive) */
export function isDateInRange(dateKey: string, start: string, end: string): boolean {
  const [s, e] = normalizeRange(start, end);
  return dateKey >= s && dateKey <= e;
}

/* ─── GRID GENERATION ─── */

/**
 * Generate the full 6x7 calendar grid for a given month.
 *
 * Includes trailing days from the previous month and
 * leading days from the next month to fill the grid.
 *
 * @param year - Full year (e.g. 2026)
 * @param month - 0-indexed month (0 = January)
 * @param today - The current date for isToday computation. Pass null during SSR to avoid hydration mismatches.
 * @returns 6 rows of 7 CalendarDay objects
 */
export function generateMonthGrid(year: number, month: number, today: Date | null): CalendarGrid {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOffset = getFirstDayOfWeek(year, month);

  // Previous month info (for leading days)
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  const grid: CalendarGrid = [];
  let dayCounter = 1 - firstDayOffset; // Can be negative (prev month days)

  for (let row = 0; row < 6; row++) {
    const week: CalendarDay[] = [];

    for (let col = 0; col < 7; col++) {
      let actualDay: number;
      let actualMonth: number;
      let actualYear: number;
      let isCurrentMonth: boolean;

      if (dayCounter < 1) {
        // Previous month
        actualDay = daysInPrevMonth + dayCounter;
        actualMonth = prevMonth;
        actualYear = prevYear;
        isCurrentMonth = false;
      } else if (dayCounter > daysInMonth) {
        // Next month
        actualDay = dayCounter - daysInMonth;
        actualMonth = month === 11 ? 0 : month + 1;
        actualYear = month === 11 ? year + 1 : year;
        isCurrentMonth = false;
      } else {
        // Current month
        actualDay = dayCounter;
        actualMonth = month;
        actualYear = year;
        isCurrentMonth = true;
      }

      const date = new Date(actualYear, actualMonth, actualDay);
      const dateKey = dateToKey(actualYear, actualMonth, actualDay);
      const holiday = getHoliday(date);

      week.push({
        date,
        day: actualDay,
        month: actualMonth,
        year: actualYear,
        isCurrentMonth,
        isToday: today ? isSameDay(date, today) : false,
        isWeekend: col >= 5, // Sat=5, Sun=6
        holiday: holiday?.name ?? null,
        dateKey,
      });

      dayCounter++;
    }

    grid.push(week);
  }

  return grid;
}

/**
 * Build the complete MonthData object.
 */
export function getMonthData(year: number, month: number, today: Date | null): MonthData {
  return {
    year,
    month,
    grid: generateMonthGrid(year, month, today),
    daysInMonth: getDaysInMonth(year, month),
    startDay: getFirstDayOfWeek(year, month),
  };
}

/**
 * Navigate to previous month, handling year rollover.
 */
export function getPrevMonth(year: number, month: number): { year: number; month: number } {
  return month === 0
    ? { year: year - 1, month: 11 }
    : { year, month: month - 1 };
}

/**
 * Navigate to next month, handling year rollover.
 */
export function getNextMonth(year: number, month: number): { year: number; month: number } {
  return month === 11
    ? { year: year + 1, month: 0 }
    : { year, month: month + 1 };
}

/**
 * Get the number of days between two dateKeys (inclusive).
 */
export function getDaysBetween(startKey: string, endKey: string): number {
  const [s, e] = normalizeRange(startKey, endKey);
  const startDate = keyToDate(s);
  const endDate = keyToDate(e);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Format a dateKey for display: "Apr 8, 2026"
 */
export function formatDateKey(dateKey: string): string {
  const date = keyToDate(dateKey);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * Format a range for display: "Apr 5 - Apr 12, 2026"
 */
export function formatRange(startKey: string, endKey: string): string {
  const [s, e] = normalizeRange(startKey, endKey);
  const start = keyToDate(s);
  const end = keyToDate(e);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  if (s === e) return formatDateKey(s);

  const sameMonth = start.getMonth() === end.getMonth();
  const sameYear = start.getFullYear() === end.getFullYear();

  if (sameMonth && sameYear) {
    return `${months[start.getMonth()]} ${start.getDate()} \u2013 ${end.getDate()}, ${start.getFullYear()}`;
  }
  if (sameYear) {
    return `${months[start.getMonth()]} ${start.getDate()} \u2013 ${months[end.getMonth()]} ${end.getDate()}, ${start.getFullYear()}`;
  }
  return `${formatDateKey(s)} \u2013 ${formatDateKey(e)}`;
}
