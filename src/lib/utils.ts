/**
 * Lightweight className merger.
 * We don't need the full clsx package — this handles our use cases.
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

/** Generate a unique ID for notes */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Build a range key from two date keys: "2026-04-05:2026-04-12" */
export function buildRangeKey(start: string, end: string): string {
  return `${start}:${end}`;
}
