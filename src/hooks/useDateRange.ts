"use client";

import { useReducer, useCallback } from "react";
import { normalizeRange, isDateInRange } from "@/lib/calendar-engine";
import type { DateRangeState, DateRangeAction } from "@/lib/types";

const initialState: DateRangeState = {
  status: "idle",
  start: null,
  end: null,
  hovered: null,
};

function dateRangeReducer(state: DateRangeState, action: DateRangeAction): DateRangeState {
  switch (action.type) {
    case "CLICK_DATE": {
      if (state.status === "idle" || state.status === "selected") {
        // Start new selection
        return {
          status: "selecting",
          start: action.dateKey,
          end: null,
          hovered: null,
        };
      }
      if (state.status === "selecting" && state.start) {
        // Complete selection
        const [start, end] = normalizeRange(state.start, action.dateKey);
        return {
          status: "selected",
          start,
          end,
          hovered: null,
        };
      }
      return state;
    }

    case "HOVER_DATE": {
      if (state.status === "selecting") {
        return { ...state, hovered: action.dateKey };
      }
      return state;
    }

    case "LEAVE_GRID": {
      if (state.status === "selecting") {
        return { ...state, hovered: null };
      }
      return state;
    }

    case "CLEAR":
      return initialState;

    default:
      return state;
  }
}

interface UseDateRangeReturn {
  rangeState: DateRangeState;
  handleDateClick: (dateKey: string) => void;
  handleDateHover: (dateKey: string) => void;
  handleGridLeave: () => void;
  clearRange: () => void;
  isInActiveRange: (dateKey: string) => boolean;
  isInHoverRange: (dateKey: string) => boolean;
  isRangeStart: (dateKey: string) => boolean;
  isRangeEnd: (dateKey: string) => boolean;
  rangeStartKey: string | null;
  rangeEndKey: string | null;
}

export function useDateRange(): UseDateRangeReturn {
  const [rangeState, dispatch] = useReducer(dateRangeReducer, initialState);

  const handleDateClick = useCallback((dateKey: string) => {
    dispatch({ type: "CLICK_DATE", dateKey });
  }, []);

  const handleDateHover = useCallback((dateKey: string) => {
    dispatch({ type: "HOVER_DATE", dateKey });
  }, []);

  const handleGridLeave = useCallback(() => {
    dispatch({ type: "LEAVE_GRID" });
  }, []);

  const clearRange = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  // Computed: is a dateKey inside the confirmed range?
  const isInActiveRange = useCallback(
    (dateKey: string): boolean => {
      if (rangeState.status !== "selected" || !rangeState.start || !rangeState.end) {
        return false;
      }
      return isDateInRange(dateKey, rangeState.start, rangeState.end);
    },
    [rangeState]
  );

  // Computed: is a dateKey inside the hover-preview range?
  const isInHoverRange = useCallback(
    (dateKey: string): boolean => {
      if (rangeState.status !== "selecting" || !rangeState.start || !rangeState.hovered) {
        return false;
      }
      return isDateInRange(dateKey, rangeState.start, rangeState.hovered);
    },
    [rangeState]
  );

  const isRangeStart = useCallback(
    (dateKey: string): boolean => {
      if (rangeState.status === "selected" && rangeState.start) {
        return dateKey === rangeState.start;
      }
      if (rangeState.status === "selecting" && rangeState.start) {
        return dateKey === rangeState.start;
      }
      return false;
    },
    [rangeState]
  );

  const isRangeEnd = useCallback(
    (dateKey: string): boolean => {
      if (rangeState.status === "selected" && rangeState.end) {
        return dateKey === rangeState.end;
      }
      if (rangeState.status === "selecting" && rangeState.hovered) {
        const [, end] = normalizeRange(rangeState.start!, rangeState.hovered);
        return dateKey === end;
      }
      return false;
    },
    [rangeState]
  );

  return {
    rangeState,
    handleDateClick,
    handleDateHover,
    handleGridLeave,
    clearRange,
    isInActiveRange,
    isInHoverRange,
    isRangeStart,
    isRangeEnd,
    rangeStartKey: rangeState.start,
    rangeEndKey: rangeState.status === "selected" ? rangeState.end : null,
  };
}
