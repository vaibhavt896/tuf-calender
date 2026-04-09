"use client";

import { cn } from "@/lib/utils";

export function SkeletonLoader() {
  return (
    <div className="w-full max-w-[var(--calendar-max-width)] mx-auto animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between p-4">
        <div className="h-8 w-48 rounded bg-[var(--color-surface-elevated-val)]" />
        <div className="flex gap-2">
          <div className="h-8 w-8 rounded bg-[var(--color-surface-elevated-val)]" />
          <div className="h-8 w-8 rounded bg-[var(--color-surface-elevated-val)]" />
        </div>
      </div>
      {/* Grid skeleton */}
      <div className="grid grid-cols-7 gap-1 p-4">
        {Array.from({ length: 42 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-10 rounded",
              "bg-[var(--color-surface-elevated-val)]"
            )}
          />
        ))}
      </div>
    </div>
  );
}
