"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
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
  todayDate: Date | null;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  goToMonth: (year: number, month: number) => void;
  goToToday: () => void;
}

export function useCalendar(): UseCalendarReturn {
  // todayDate is null during SSR — set client-side after hydration to avoid mismatches.
  // This ensures generateMonthGrid produces identical output on server and client.
  const [todayDate, setTodayDate] = useState<Date | null>(null);

  useEffect(() => {
    setTodayDate(new Date());
  }, []);

  // Initialize year/month from a stable reference, updated once after hydration
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [direction, setDirection] = useState<NavigationDirection>("next");

  const monthData = useMemo(
    () => getMonthData(year, month, todayDate),
    [year, month, todayDate]
  );

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
    todayDate,
    goToPrevMonth,
    goToNextMonth,
    goToMonth,
    goToToday,
  };
}
