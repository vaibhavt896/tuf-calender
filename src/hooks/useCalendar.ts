"use client";

import { useState, useMemo, useCallback } from "react";
import {
  getMonthData,
  getPrevMonth,
  getNextMonth,
} from "@/lib/calendar-engine";
import type { MonthData, NavigationDirection } from "@/lib/types";

interface UseCalendarReturn {
  year: number;
  month: number;
  monthData: MonthData;
  direction: NavigationDirection;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  goToMonth: (year: number, month: number) => void;
  goToToday: () => void;
}

export function useCalendar(): UseCalendarReturn {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [direction, setDirection] = useState<NavigationDirection>("next");

  const monthData = useMemo(() => getMonthData(year, month), [year, month]);

  const goToPrevMonth = useCallback(() => {
    setDirection("prev");
    const prev = getPrevMonth(year, month);
    setYear(prev.year);
    setMonth(prev.month);
  }, [year, month]);

  const goToNextMonth = useCallback(() => {
    setDirection("next");
    const next = getNextMonth(year, month);
    setYear(next.year);
    setMonth(next.month);
  }, [year, month]);

  const goToMonth = useCallback((targetYear: number, targetMonth: number) => {
    setDirection(
      targetYear > year || (targetYear === year && targetMonth > month)
        ? "next"
        : "prev"
    );
    setYear(targetYear);
    setMonth(targetMonth);
  }, [year, month]);

  const goToToday = useCallback(() => {
    const now = new Date();
    goToMonth(now.getFullYear(), now.getMonth());
  }, [goToMonth]);

  return {
    year,
    month,
    monthData,
    direction,
    goToPrevMonth,
    goToNextMonth,
    goToMonth,
    goToToday,
  };
}
