"use client";

import { memo } from "react";
import { AnimatePresence } from "framer-motion";
import { NoteEditor } from "./NoteEditor";
import { StickyNote } from "lucide-react";
import type { Note, NoteColor } from "@/lib/types";

interface NotesListProps {
  notes: Note[];
  onUpdate: (id: string, content: string) => void;
  onUpdateColor: (id: string, color: NoteColor) => void;
  onDelete: (id: string) => void;
}

export const NotesList = memo(function NotesList({
  notes,
  onUpdate,
  onUpdateColor,
  onDelete,
}: NotesListProps) {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <StickyNote size={32} className="text-[var(--color-text-muted)] mb-2 opacity-40" />
        <p className="text-sm text-[var(--color-text-muted)]">
          No notes yet
        </p>
        <p className="text-xs text-[var(--color-text-muted)] mt-1 opacity-60">
          Select a date and add one
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
      <AnimatePresence mode="popLayout">
        {notes.map((note, i) => (
          <NoteEditor
            key={note.id}
            note={note}
            index={i}
            onUpdate={onUpdate}
            onUpdateColor={onUpdateColor}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
});
