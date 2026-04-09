"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { formatRange, getDaysBetween } from "@/lib/calendar-engine";

interface DateRangeBadgeProps {
  startKey: string | null;
  endKey: string | null;
  isVisible: boolean;
  onClear: () => void;
}

export const DateRangeBadge = memo(function DateRangeBadge({
  startKey,
  endKey,
  isVisible,
  onClear,
}: DateRangeBadgeProps) {
  return (
    <AnimatePresence>
      {isVisible && startKey && endKey && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-accent-subtle-val)] border border-[var(--color-accent-val)]/30 no-print"
        >
          <span className="text-xs font-semibold text-[var(--color-accent-val)]">
            {formatRange(startKey, endKey)}
          </span>
          <span className="text-[10px] text-[var(--color-accent-val)] opacity-70">
            ({getDaysBetween(startKey, endKey)} days)
          </span>
          <button
            onClick={onClear}
            aria-label="Clear selection"
            className="p-0.5 rounded-full hover:bg-[var(--color-accent-val)]/20 text-[var(--color-accent-val)] transition-colors"
          >
            <X size={12} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
