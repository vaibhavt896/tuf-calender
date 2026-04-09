"use client";

import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { DayCell } from "./DayCell";
import { cn } from "@/lib/utils";
import { DAY_LABELS, DAY_LABELS_SHORT, DAY_LABELS_FULL } from "@/lib/constants";
import type { CalendarGrid as CalendarGridType } from "@/lib/types";

const cellVariants = {
  hidden: { opacity: 0, y: 6, scale: 0.92 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.012,
      duration: 0.22,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
};

interface CalendarGridProps {
  grid: CalendarGridType;
  year: number;
  month: number;
  isRangeStart: (dateKey: string) => boolean;
  isRangeEnd: (dateKey: string) => boolean;
  isInRange: (dateKey: string) => boolean;
  isHoverRange: (dateKey: string) => boolean;
  hasNotes: (dateKey: string) => boolean;
  isPositionFocused: (row: number, col: number) => boolean;
  onDateSelect: (dateKey: string) => void;
  onDateHover: (dateKey: string) => void;
  onGridLeave: () => void;
  onKeyDown: (e: React.KeyboardEvent, onSelect: (row: number, col: number) => void) => void;
}


export const CalendarGrid = memo(function CalendarGrid({
  grid,
  year,
  month,
  isRangeStart,
  isRangeEnd,
  isInRange,
  isHoverRange,
  hasNotes,
  isPositionFocused,
  onDateSelect,
  onDateHover,
  onGridLeave,
  onKeyDown,
}: CalendarGridProps) {
  const handleKeySelect = useCallback(
    (row: number, col: number) => {
      const day = grid[row]?.[col];
      if (day) onDateSelect(day.dateKey);
    },
    [grid, onDateSelect]
  );

  return (
    <div
      role="grid"
      aria-label={`Calendar for ${new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`}
      onMouseLeave={onGridLeave}
      onKeyDown={(e) => onKeyDown(e, handleKeySelect)}
      tabIndex={0}
      className="outline-none"
      style={{ perspective: "1200px" }}
    >
      {/* Day-of-week headers */}
      <div role="row" className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((label, i) => (
          <div
            key={label}
            role="columnheader"
            aria-label={DAY_LABELS_FULL[i]}
            className={cn(
              "text-center text-xs font-semibold py-2 uppercase tracking-wider",
              "text-[var(--color-text-muted)]",
              i >= 5 && "text-[var(--color-weekend)] opacity-70"
            )}
          >
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{DAY_LABELS_SHORT[i]}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid — stagger animation per cell, page-flip handled by parent */}
      <div className="grid grid-cols-7 gap-0.5">
          {grid.map((week, rowIdx) =>
            week.map((day, colIdx) => {
              const cellIndex = rowIdx * 7 + colIdx;
              return (
                <motion.div
                  key={day.dateKey}
                  custom={cellIndex}
                  variants={cellVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <DayCell
                    day={day}
                    isRangeStart={isRangeStart(day.dateKey)}
                    isRangeEnd={isRangeEnd(day.dateKey)}
                    isInRange={isInRange(day.dateKey)}
                    isHoverRange={isHoverRange(day.dateKey)}
                    hasNotes={hasNotes(day.dateKey)}
                    isFocused={isPositionFocused(rowIdx, colIdx)}
                    onSelect={onDateSelect}
                    onHover={onDateHover}
                    onHoverEnd={onGridLeave}
                  />
                </motion.div>
              );
            })
          )}
      </div>
    </div>
  );
});
