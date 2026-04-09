"use client";

import { memo } from "react";
import { AnimatePresence } from "framer-motion";
import { NoteEditor } from "./NoteEditor";
import { PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
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
      <div className="flex flex-col items-center justify-center py-8 text-center select-none">
        {/* Stacked note-card illustration */}
        <div className="relative w-11 h-11 mb-3">
          <div className={cn(
            "absolute inset-0 rounded-xl rotate-3",
            "bg-[var(--color-surface-elevated-val)] border border-[var(--color-border)]"
          )} />
          <div className={cn(
            "absolute inset-0 rounded-xl -rotate-1",
            "bg-[var(--color-surface-elevated-val)] border border-[var(--color-border)]",
            "flex items-center justify-center"
          )}>
            <PenLine size={16} className="text-[var(--color-text-muted)] opacity-60" />
          </div>
        </div>
        <p className="text-[13px] font-medium text-[var(--color-text-secondary)]">
          Nothing here yet
        </p>
        <p className="text-xs text-[var(--color-text-muted)] mt-1 opacity-75">
          Pick a date to start writing
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
