"use client";

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Download, FileText } from "lucide-react";
import { NotesList } from "./NotesList";
import { IconButton } from "@/components/UI/IconButton";
import { cn } from "@/lib/utils";
import { formatDateKey, formatRange, getDaysBetween } from "@/lib/calendar-engine";
import { downloadICS } from "@/lib/export-ics";
import { buildRangeKey } from "@/lib/utils";
import type { Note, NoteColor } from "@/lib/types";

interface NotesPanelProps {
  notes: Note[];
  allNotes: Note[];
  selectedDateKey: string | null;
  rangeStartKey: string | null;
  rangeEndKey: string | null;
  isRangeSelected: boolean;
  onAddNote: (dateKey: string, content: string, color?: NoteColor) => Note;
  onUpdateNote: (id: string, content: string) => void;
  onUpdateNoteColor: (id: string, color: NoteColor) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesPanel = memo(function NotesPanel({
  notes,
  allNotes,
  selectedDateKey,
  rangeStartKey,
  rangeEndKey,
  isRangeSelected,
  onAddNote,
  onUpdateNote,
  onUpdateNoteColor,
  onDeleteNote,
}: NotesPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleAddNote = () => {
    if (isRangeSelected && rangeStartKey && rangeEndKey) {
      const rangeKey = buildRangeKey(rangeStartKey, rangeEndKey);
      onAddNote(rangeKey, "");
    } else if (selectedDateKey) {
      onAddNote(selectedDateKey, "");
    }
  };

  const canAddNote = selectedDateKey || (isRangeSelected && rangeStartKey && rangeEndKey);

  const dateLabel = isRangeSelected && rangeStartKey && rangeEndKey
    ? `${formatRange(rangeStartKey, rangeEndKey)} (${getDaysBetween(rangeStartKey, rangeEndKey)} days)`
    : selectedDateKey
      ? formatDateKey(selectedDateKey)
      : null;

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="flex items-center justify-between px-1 py-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-accent-val)] transition-colors"
        >
          <FileText size={16} />
          <span>Notes</span>
          {notes.length > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-[var(--color-accent-subtle-val)] text-[var(--color-accent-val)] font-bold">
              {notes.length}
            </span>
          )}
        </button>

        <div className="flex items-center gap-1">
          {allNotes.length > 0 && (
            <IconButton
              onClick={() => downloadICS(allNotes)}
              label="Export all notes as .ics"
            >
              <Download size={14} />
            </IconButton>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Date label */}
            {dateLabel && (
              <p className="text-xs text-[var(--color-text-secondary)] px-1 mb-2 font-medium">
                {dateLabel}
              </p>
            )}

            {/* Add note button */}
            {canAddNote && (
              <motion.button
                onClick={handleAddNote}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-2 mb-3",
                  "rounded-lg border border-dashed border-[var(--color-border)]",
                  "text-sm text-[var(--color-text-muted)]",
                  "hover:border-[var(--color-accent-val)] hover:text-[var(--color-accent-val)]",
                  "hover:bg-[var(--color-accent-subtle-val)]",
                  "transition-colors duration-150"
                )}
              >
                <Plus size={16} />
                Add note
              </motion.button>
            )}

            {/* Notes list */}
            <NotesList
              notes={notes}
              onUpdate={onUpdateNote}
              onUpdateColor={onUpdateNoteColor}
              onDelete={onDeleteNote}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
