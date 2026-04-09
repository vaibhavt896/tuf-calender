"use client";

import { useState, useCallback, useEffect } from "react";
import type { Note, NoteColor } from "@/lib/types";
import { generateId, buildRangeKey } from "@/lib/utils";
import { LOCAL_STORAGE_KEYS } from "@/lib/constants";

interface UseNotesReturn {
  notes: Note[];
  addNote: (dateKey: string, content: string, color?: NoteColor) => Note;
  updateNote: (id: string, content: string) => void;
  updateNoteColor: (id: string, color: NoteColor) => void;
  deleteNote: (id: string) => void;
  getNotesForDate: (dateKey: string) => Note[];
  getNotesForRange: (startKey: string, endKey: string) => Note[];
  getNotesForMonth: (year: number, month: number) => Note[];
  hasNotesForDate: (dateKey: string) => boolean;
}

export function useNotes(): UseNotesReturn {
  const [notes, setNotes] = useState<Note[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage AFTER hydration to avoid SSR mismatch
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.NOTES);
      if (stored) {
        setNotes(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Auto-persist to localStorage (only after initial load)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {
      console.warn("Failed to save notes to localStorage:", e);
    }
  }, [notes, hydrated]);

  const addNote = useCallback(
    (dateKey: string, content: string, color: NoteColor = "default"): Note => {
      const now = Date.now();
      const note: Note = {
        id: generateId(),
        dateKey,
        content,
        color,
        createdAt: now,
        updatedAt: now,
      };
      setNotes((prev) => [...prev, note]);
      return note;
    },
    []
  );

  const updateNote = useCallback((id: string, content: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, content, updatedAt: Date.now() } : n
      )
    );
  }, []);

  const updateNoteColor = useCallback((id: string, color: NoteColor) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, color, updatedAt: Date.now() } : n
      )
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const getNotesForDate = useCallback(
    (dateKey: string): Note[] => {
      return notes.filter((n) => {
        // Direct match
        if (n.dateKey === dateKey) return true;
        // Range match: note assigned to a range that includes this date
        if (n.dateKey.includes(":")) {
          const [start, end] = n.dateKey.split(":");
          return dateKey >= start && dateKey <= end;
        }
        return false;
      });
    },
    [notes]
  );

  const getNotesForRange = useCallback(
    (startKey: string, endKey: string): Note[] => {
      const rangeKey = buildRangeKey(startKey, endKey);
      return notes.filter((n) => n.dateKey === rangeKey);
    },
    [notes]
  );

  const getNotesForMonth = useCallback(
    (year: number, month: number): Note[] => {
      const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
      return notes.filter((n) => n.dateKey.startsWith(prefix));
    },
    [notes]
  );

  const hasNotesForDate = useCallback(
    (dateKey: string): boolean => {
      return notes.some((n) => {
        if (n.dateKey === dateKey) return true;
        if (n.dateKey.includes(":")) {
          const [start, end] = n.dateKey.split(":");
          return dateKey >= start && dateKey <= end;
        }
        return false;
      });
    },
    [notes]
  );

  return {
    notes,
    addNote,
    updateNote,
    updateNoteColor,
    deleteNote,
    getNotesForDate,
    getNotesForRange,
    getNotesForMonth,
    hasNotesForDate,
  };
}
