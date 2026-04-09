/**
 * Indian national holidays + major festivals + select international holidays.
 * Key format: "M-D" (month 1-indexed, day).
 * Returns a Map for O(1) lookup per date.
 *
 * Note: Some festivals (Eid, Holi, Diwali) shift yearly with the lunar calendar.
 * These are fixed approximate 2026 dates.
 */

interface Holiday {
  name: string;
  type: "national" | "festival" | "international";
  emoji: string;
}

const HOLIDAYS_2026: Record<string, Holiday> = {
  // ─── NATIONAL ───
  "1-26":  { name: "Republic Day",        type: "national",      emoji: "\u{1F1EE}\u{1F1F3}" },
  "8-15":  { name: "Independence Day",    type: "national",      emoji: "\u{1F1EE}\u{1F1F3}" },
  "10-2":  { name: "Gandhi Jayanti",      type: "national",      emoji: "\u{1F54A}\u{FE0F}" },

  // ─── MAJOR FESTIVALS ───
  "1-14":  { name: "Makar Sankranti",     type: "festival",      emoji: "\u{1FA81}" },
  "3-3":   { name: "Maha Shivaratri",     type: "festival",      emoji: "\u{1F531}" },
  "3-17":  { name: "Holi",               type: "festival",      emoji: "\u{1F3A8}" },
  "3-30":  { name: "Eid ul-Fitr",        type: "festival",      emoji: "\u{1F319}" },
  "4-6":   { name: "Ram Navami",         type: "festival",      emoji: "\u{1F3F9}" },
  "4-14":  { name: "Ambedkar Jayanti",   type: "festival",      emoji: "\u{1F4D8}" },
  "4-14b": { name: "Baisakhi",           type: "festival",      emoji: "\u{1F33E}" },
  "5-12":  { name: "Buddha Purnima",     type: "festival",      emoji: "\u{2638}\u{FE0F}" },
  "6-6":   { name: "Eid ul-Adha",        type: "festival",      emoji: "\u{1F319}" },
  "7-6":   { name: "Muharram",           type: "festival",      emoji: "\u{1F54C}" },
  "8-16":  { name: "Janmashtami",        type: "festival",      emoji: "\u{1F99A}" },
  "9-5":   { name: "Teachers' Day",      type: "festival",      emoji: "\u{1F4D6}" },
  "10-2b": { name: "Navratri Begins",    type: "festival",      emoji: "\u{1FA94}" },
  "10-12": { name: "Dussehra",           type: "festival",      emoji: "\u{1F3F9}" },
  "10-31": { name: "Diwali",             type: "festival",      emoji: "\u{2728}" },
  "11-1":  { name: "Govardhan Puja",     type: "festival",      emoji: "\u{1FA94}" },
  "11-5":  { name: "Guru Nanak Jayanti", type: "festival",      emoji: "\u{1F64F}" },
  "12-25": { name: "Christmas",          type: "festival",      emoji: "\u{1F384}" },

  // ─── INTERNATIONAL ───
  "1-1":   { name: "New Year's Day",     type: "international",  emoji: "\u{1F386}" },
  "2-14":  { name: "Valentine's Day",    type: "international",  emoji: "\u{1F495}" },
  "5-1":   { name: "May Day",            type: "international",  emoji: "\u{270A}" },
  "6-21":  { name: "Yoga Day",           type: "international",  emoji: "\u{1F9D8}" },
  "11-14": { name: "Children's Day",     type: "international",  emoji: "\u{1F467}" },
};

/**
 * Get holiday for a specific date.
 * Checks against fixed dates (month-day pattern).
 */
export function getHoliday(date: Date): Holiday | null {
  const key = `${date.getMonth() + 1}-${date.getDate()}`;
  return HOLIDAYS_2026[key] ?? null;
}

/**
 * Get all holidays for a given month (0-indexed).
 */
export function getMonthHolidays(month: number): { day: number; holiday: Holiday }[] {
  const results: { day: number; holiday: Holiday }[] = [];
  const monthNum = month + 1;

  for (const [key, holiday] of Object.entries(HOLIDAYS_2026)) {
    const cleanKey = key.replace(/[a-z]$/, ""); // handle "4-14b" style dupes
    const [m, d] = cleanKey.split("-").map(Number);
    if (m === monthNum) {
      results.push({ day: d, holiday });
    }
  }

  return results.sort((a, b) => a.day - b.day);
}

export { HOLIDAYS_2026 };
export type { Holiday };
