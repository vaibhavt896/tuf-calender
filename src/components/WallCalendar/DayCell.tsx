"use client";

import { memo, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/UI/Tooltip";
import { getHoliday } from "@/lib/holidays";
import type { DayCellProps } from "@/lib/types";

export const DayCell = memo(function DayCell({
  day,
  isRangeStart,
  isRangeEnd,
  isInRange,
  isHoverRange,
  hasNotes,
  isFocused,
  onSelect,
  onHover,
  onHoverEnd,
}: DayCellProps) {
  const handleClick = useCallback(() => {
    onSelect(day.dateKey);
  }, [day.dateKey, onSelect]);

  const handleMouseEnter = useCallback(() => {
    onHover(day.dateKey);
  }, [day.dateKey, onHover]);

  const holidayData = useMemo(() => {
    if (!day.holiday) return null;
    return getHoliday(day.date);
  }, [day.holiday, day.date]);

  const isEndpoint = isRangeStart || isRangeEnd;
  const isSingleDay = isRangeStart && isRangeEnd;

  const cellContent = (
    <motion.button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onHoverEnd}
      whileHover={
        !isEndpoint && !isInRange
          ? { scale: 1.08, transition: { type: "spring", stiffness: 400, damping: 17 } }
          : undefined
      }
      whileTap={{ scale: 0.93, transition: { type: "spring", stiffness: 400, damping: 10 } }}
      role="gridcell"
      tabIndex={isFocused ? 0 : -1}
      aria-selected={isInRange || isEndpoint}
      aria-label={`${day.isToday ? "Today, " : ""}${day.holiday ? day.holiday + ", " : ""}${day.date.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}${isRangeStart ? ", Start of range" : ""}${isRangeEnd ? ", End of range" : ""}`}
      className={cn(
        "relative flex items-center justify-center",
        "w-full min-h-[44px] text-sm font-medium",
        "transition-all duration-150 cursor-pointer select-none",
        "focus-visible:outline-2 focus-visible:outline-[var(--color-accent-val)] focus-visible:outline-offset-1",

        // Default border-radius
        !isEndpoint && !isInRange && !isHoverRange && "rounded-lg",

        // Base state
        !day.isCurrentMonth && "opacity-30",
        day.isCurrentMonth && "text-[var(--color-text-primary)]",

        // Weekend
        day.isWeekend && day.isCurrentMonth && !isEndpoint && "text-[var(--color-weekend)]",

        // Holiday
        day.holiday && day.isCurrentMonth && !isEndpoint && "text-[var(--color-holiday)]",

        // Today — pulse animation
        day.isToday && !isEndpoint && "today-pulse font-bold",

        // Hover (non-range cells only)
        !isEndpoint && !isInRange && !isHoverRange && "hover:bg-[var(--color-surface-hover-val)]",

        // Range endpoints — pill shapes
        isSingleDay && "bg-[var(--color-accent-val)] text-white font-bold shadow-md rounded-full",
        isRangeStart && !isSingleDay && "bg-[var(--color-accent-val)] text-white font-bold shadow-md rounded-l-full rounded-r-none",
        isRangeEnd && !isSingleDay && "bg-[var(--color-accent-val)] text-white font-bold shadow-md rounded-r-full rounded-l-none",

        // In confirmed range — flat continuous strip
        isInRange && !isEndpoint && "bg-[var(--color-range-fill)] rounded-none",

        // Hover preview range — flat strip
        isHoverRange && !isEndpoint && !isInRange && "bg-[var(--color-range-fill-hover)] rounded-none",

        // Keyboard focus
        isFocused && "ring-2 ring-[var(--color-accent-val)] ring-offset-2 ring-offset-[var(--color-surface-val)]"
      )}
    >
      {/* Number — nudged 3px above center so dot has visual room below */}
      <span className="-translate-y-[3px] leading-none">{day.day}</span>

      {/* Indicator dot — always absolutely positioned at bottom so number never shifts */}
      <span
        className={cn(
          "absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full",
          hasNotes && !isEndpoint
            ? "bg-[var(--color-accent-val)]"
            : day.holiday && day.isCurrentMonth && !isEndpoint && !hasNotes
            ? "bg-[var(--color-holiday)]"
            : "hidden"
        )}
      />
    </motion.button>
  );

  // Wrap in tooltip if holiday
  if (day.holiday && day.isCurrentMonth) {
    return (
      <Tooltip
        content={day.holiday}
        emoji={holidayData?.emoji}
        typeBadge={holidayData?.type}
      >
        {cellContent}
      </Tooltip>
    );
  }

  return cellContent;
});
