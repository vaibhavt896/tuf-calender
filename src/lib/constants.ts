export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

export const MONTH_NAMES_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const DAY_LABELS_SHORT = ["M", "T", "W", "T", "F", "S", "S"] as const;

export const DAY_LABELS_FULL = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
] as const;

export const GRID_ROWS = 6;
export const GRID_COLS = 7;

export const NOTE_COLORS: { value: string; label: string; bg: string; border: string }[] = [
  { value: "default", label: "Default",  bg: "bg-[var(--color-surface-elevated-val)]", border: "border-[var(--color-border)]" },
  { value: "amber",   label: "Amber",    bg: "bg-amber-500/10",  border: "border-amber-500/30" },
  { value: "blue",    label: "Blue",     bg: "bg-blue-500/10",   border: "border-blue-500/30" },
  { value: "green",   label: "Green",    bg: "bg-emerald-500/10",border: "border-emerald-500/30" },
  { value: "rose",    label: "Rose",     bg: "bg-rose-500/10",   border: "border-rose-500/30" },
  { value: "purple",  label: "Purple",   bg: "bg-purple-500/10", border: "border-purple-500/30" },
];

export const LOCAL_STORAGE_KEYS = {
  NOTES: "tuf-calendar-notes",
  THEME: "tuf-calendar-theme",
} as const;
