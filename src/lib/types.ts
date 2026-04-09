/* ═══ CALENDAR TYPES ═══ */

export interface CalendarDay {
  date: Date;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  holiday: string | null;
  dateKey: string; // "YYYY-MM-DD" — universal identifier
}

export type CalendarGrid = CalendarDay[][];  // 6 rows × 7 cols

export interface MonthData {
  year: number;
  month: number; // 0-indexed (Jan=0, Dec=11)
  grid: CalendarGrid;
  daysInMonth: number;
  startDay: number; // 0=Mon, 6=Sun
}

/* ═══ DATE RANGE SELECTION ═══ */

export type SelectionStatus = "idle" | "selecting" | "selected";

export interface DateRangeState {
  status: SelectionStatus;
  start: string | null;    // dateKey
  end: string | null;      // dateKey
  hovered: string | null;  // dateKey of hovered cell during "selecting"
}

export type DateRangeAction =
  | { type: "CLICK_DATE"; dateKey: string }
  | { type: "HOVER_DATE"; dateKey: string }
  | { type: "CLEAR" }
  | { type: "LEAVE_GRID" };

/* ═══ NOTES ═══ */

export interface Note {
  id: string;
  dateKey: string;          // single date "2026-04-08" or range "2026-04-08:2026-04-12"
  content: string;
  color: NoteColor;
  createdAt: number;        // timestamp
  updatedAt: number;        // timestamp
}

export type NoteColor = "amber" | "blue" | "green" | "rose" | "purple" | "default";

export interface NotesState {
  notes: Record<string, Note[]>; // keyed by dateKey or range key
  activeNoteId: string | null;
}

/* ═══ THEME ═══ */

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeState {
  mode: ThemeMode;
  resolved: "light" | "dark"; // actual applied theme
}

/* ═══ MONTH THEME (visual) ═══ */

export interface MonthTheme {
  name: string;
  icon: string;
  gradient: string;           // CSS gradient for hero section
  accentHue: number;          // HSL hue for dynamic accent
  season: Season;
  svgScene: "mountains" | "blossoms" | "holi" | "rain" | "sun" | "ocean" | "storm" | "peaks" | "leaves" | "festival" | "lights" | "snow" | "stars";
}

export type Season = "winter" | "spring" | "summer" | "monsoon" | "autumn" | "festival";

/* ═══ NAVIGATION ═══ */

export type NavigationDirection = "prev" | "next" | "jump";

/* ═══ KEYBOARD ═══ */

export interface GridPosition {
  row: number;
  col: number;
}

/* ═══ COMPONENT PROPS ═══ */

export interface DayCellProps {
  day: CalendarDay;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  isHoverRange: boolean;
  hasNotes: boolean;
  isFocused: boolean;
  onSelect: (dateKey: string) => void;
  onHover: (dateKey: string) => void;
  onHoverEnd: () => void;
}
