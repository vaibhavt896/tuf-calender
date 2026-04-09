"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { MONTH_NAMES_SHORT } from "@/lib/constants";

interface MiniYearViewProps {
  currentYear: number;
  currentMonth: number;
  onSelectMonth: (year: number, month: number) => void;
  hasNotesForMonth: (year: number, month: number) => boolean;
}

export const MiniYearView = memo(function MiniYearView({
  currentYear,
  currentMonth,
  onSelectMonth,
  hasNotesForMonth,
}: MiniYearViewProps) {
  const today = new Date();
  const isTodayYear = currentYear === today.getFullYear();

  return (
    <div className="grid grid-cols-4 gap-2">
      {MONTH_NAMES_SHORT.map((name, monthIdx) => {
        const isActive = monthIdx === currentMonth;
        const isTodayMonth = isTodayYear && monthIdx === today.getMonth();
        const hasNotes = hasNotesForMonth(currentYear, monthIdx);

        return (
          <button
            key={name}
            onClick={() => onSelectMonth(currentYear, monthIdx)}
            className={cn(
              "relative flex flex-col items-center py-2 px-1 rounded-lg",
              "text-xs font-medium transition-all duration-150",
              "hover:bg-[var(--color-surface-hover-val)]",
              isActive
                ? "bg-[var(--color-accent-subtle-val)] text-[var(--color-accent-val)] ring-1 ring-[var(--color-accent-val)]"
                : "text-[var(--color-text-secondary)]",
              isTodayMonth && !isActive && "font-bold text-[var(--color-today)]"
            )}
          >
            <span>{name}</span>
            {hasNotes && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[var(--color-accent-val)]" />
            )}
          </button>
        );
      })}
    </div>
  );
});
