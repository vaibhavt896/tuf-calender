"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const IconButton = memo(function IconButton({
  onClick,
  label,
  children,
  className,
  disabled = false,
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      className={cn(
        "relative flex items-center justify-center rounded-lg p-2",
        "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
        "hover:bg-[var(--color-surface-hover-val)] active:scale-95",
        "transition-all duration-150",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
        className
      )}
    >
      {children}
    </button>
  );
});
