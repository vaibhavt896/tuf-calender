"use client";

import { useState, useEffect, useCallback } from "react";
import type { ThemeMode } from "@/lib/types";
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";

interface UseThemeReturn {
  mode: ThemeMode;
  resolved: "light" | "dark";
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

export function useTheme(): UseThemeReturn {
  const [mode, setModeState] = useState<ThemeMode>("dark"); // Default: dark (matches TUF)

  const getSystemTheme = (): "light" | "dark" => {
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const resolved = mode === "system" ? getSystemTheme() : mode;

  // Load saved preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME) as ThemeMode | null;
      if (saved && ["light", "dark", "system"].includes(saved)) {
        setModeState(saved);
      }
    } catch {}
  }, []);

  // Apply class to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolved === "dark");
  }, [resolved]);

  // Listen for system theme changes when mode is "system"
  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setModeState("system"); // re-trigger resolved calculation
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, newMode);
    } catch {}
  }, []);

  const toggle = useCallback(() => {
    setMode(resolved === "dark" ? "light" : "dark");
  }, [resolved, setMode]);

  return { mode, resolved, setMode, toggle };
}
