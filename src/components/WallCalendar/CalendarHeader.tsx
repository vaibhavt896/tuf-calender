"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { IconButton } from "@/components/UI/IconButton";
import { MONTH_NAMES } from "@/lib/constants";
import type { NavigationDirection } from "@/lib/types";

interface CalendarHeaderProps {
  year: number;
  month: number;
  direction: NavigationDirection;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  isCurrentMonth: boolean;
}

export const CalendarHeader = memo(function CalendarHeader({
  year,
  month,
  direction,
  onPrev,
  onNext,
  onToday,
  isCurrentMonth,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-2 py-3 no-print">
      {/* Month + Year — dramatic typography hierarchy */}
      <div className="flex items-baseline gap-2.5 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${year}-${month}`}
            custom={direction}
            initial={{ y: direction === "next" ? 24 : -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: direction === "next" ? -24 : 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex items-baseline gap-2.5"
          >
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-text-primary)] tracking-tight">
              {MONTH_NAMES[month]}
            </h2>
            <span className="font-body text-base sm:text-lg text-[var(--color-text-muted)] font-normal">
              {year}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-1">
        {!isCurrentMonth && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <IconButton onClick={onToday} label="Go to today">
              <CalendarDays size={18} />
            </IconButton>
          </motion.div>
        )}

        <IconButton onClick={onPrev} label="Previous month">
          <ChevronLeft size={20} />
        </IconButton>

        <IconButton onClick={onNext} label="Next month">
          <ChevronRight size={20} />
        </IconButton>
      </div>

      {/* Screen reader announcement */}
      <div aria-live="polite" className="sr-only">
        Now showing {MONTH_NAMES[month]} {year}
      </div>
    </div>
  );
});
