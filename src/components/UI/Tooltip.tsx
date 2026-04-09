"use client";

import { useState, memo } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  emoji?: string;
  typeBadge?: "national" | "festival" | "international";
  children: React.ReactNode;
  className?: string;
}

export const Tooltip = memo(function Tooltip({ content, emoji, typeBadge, children, className }: TooltipProps) {
  const [show, setShow] = useState(false);

  const badgeColors = {
    national: "bg-orange-500/20 text-orange-300",
    festival: "bg-purple-500/20 text-purple-300",
    international: "bg-blue-500/20 text-blue-300",
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          role="tooltip"
          className={cn(
            "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50",
            "px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap",
            "bg-[var(--color-text-primary)] text-[var(--color-bg)]",
            "shadow-lg animate-fade-in pointer-events-none",
            className
          )}
        >
          <span className="flex items-center gap-1.5">
            {emoji && <span>{emoji}</span>}
            <span>{content}</span>
            {typeBadge && (
              <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-semibold capitalize", badgeColors[typeBadge])}>
                {typeBadge}
              </span>
            )}
          </span>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-[var(--color-text-primary)]" />
        </div>
      )}
    </div>
  );
});
