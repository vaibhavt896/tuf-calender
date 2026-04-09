"use client";

import { useState, useCallback } from "react";
import type { GridPosition } from "@/lib/types";
import { clamp } from "@/lib/utils";
import { GRID_ROWS, GRID_COLS } from "@/lib/constants";

interface UseKeyboardNavReturn {
  focusedPosition: GridPosition | null;
  setFocusedPosition: (pos: GridPosition | null) => void;
  handleKeyDown: (
    e: React.KeyboardEvent,
    onSelect: (row: number, col: number) => void
  ) => void;
  isPositionFocused: (row: number, col: number) => boolean;
}

export function useKeyboardNav(): UseKeyboardNavReturn {
  const [focusedPosition, setFocusedPosition] = useState<GridPosition | null>(null);

  const isPositionFocused = useCallback(
    (row: number, col: number): boolean => {
      if (!focusedPosition) return false;
      return focusedPosition.row === row && focusedPosition.col === col;
    },
    [focusedPosition]
  );

  const handleKeyDown = useCallback(
    (
      e: React.KeyboardEvent,
      onSelect: (row: number, col: number) => void
    ) => {
      if (!focusedPosition) {
        // If no cell is focused and user presses arrow/enter, focus first cell
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(e.key)) {
          e.preventDefault();
          setFocusedPosition({ row: 0, col: 0 });
          return;
        }
        return;
      }

      const { row, col } = focusedPosition;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setFocusedPosition({
            row: clamp(row - 1, 0, GRID_ROWS - 1),
            col,
          });
          break;
        case "ArrowDown":
          e.preventDefault();
          setFocusedPosition({
            row: clamp(row + 1, 0, GRID_ROWS - 1),
            col,
          });
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (col > 0) {
            setFocusedPosition({ row, col: col - 1 });
          } else if (row > 0) {
            setFocusedPosition({ row: row - 1, col: GRID_COLS - 1 });
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          if (col < GRID_COLS - 1) {
            setFocusedPosition({ row, col: col + 1 });
          } else if (row < GRID_ROWS - 1) {
            setFocusedPosition({ row: row + 1, col: 0 });
          }
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          onSelect(row, col);
          break;
        case "Escape":
          e.preventDefault();
          setFocusedPosition(null);
          break;
      }
    },
    [focusedPosition]
  );

  return {
    focusedPosition,
    setFocusedPosition,
    handleKeyDown,
    isPositionFocused,
  };
}
