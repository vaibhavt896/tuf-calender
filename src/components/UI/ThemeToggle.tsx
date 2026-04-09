"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { useThemeContext } from "@/components/Providers/ThemeProvider";
import { cn } from "@/lib/utils";
import type { ThemeMode } from "@/lib/types";

const modes: { mode: ThemeMode; icon: typeof Sun; label: string }[] = [
  { mode: "light", icon: Sun, label: "Light mode" },
  { mode: "dark", icon: Moon, label: "Dark mode" },
  { mode: "system", icon: Monitor, label: "System theme" },
];

export const ThemeToggle = memo(function ThemeToggle() {
  const { mode, setMode } = useThemeContext();

  const cycleMode = () => {
    const currentIndex = modes.findIndex((m) => m.mode === mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex].mode);
  };

  const current = modes.find((m) => m.mode === mode) ?? modes[1];
  const Icon = current.icon;

  return (
    <button
      onClick={cycleMode}
      aria-label={`Current: ${current.label}. Click to switch.`}
      title={current.label}
      className={cn(
        "flex items-center justify-center rounded-lg p-2 overflow-hidden",
        "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
        "hover:bg-[var(--color-surface-hover-val)]",
        "transition-all duration-200",
        "no-print"
      )}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={mode}
          initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          <Icon size={18} />
        </motion.span>
      </AnimatePresence>
    </button>
  );
});
