"use client";

import { useState, memo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { NOTE_COLORS } from "@/lib/constants";
import type { Note, NoteColor } from "@/lib/types";

interface NoteEditorProps {
  note: Note;
  index?: number;
  onUpdate: (id: string, content: string) => void;
  onUpdateColor: (id: string, color: NoteColor) => void;
  onDelete: (id: string) => void;
}

export const NoteEditor = memo(function NoteEditor({
  note,
  index = 0,
  onUpdate,
  onUpdateColor,
  onDelete,
}: NoteEditorProps) {
  const [content, setContent] = useState(note.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setContent(note.content);
  }, [note.content]);

  const handleBlur = () => {
    if (content !== note.content) {
      onUpdate(note.id, content);
    }
  };

  const colorConfig = NOTE_COLORS.find((c) => c.value === note.color) ?? NOTE_COLORS[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: index * 0.05,
      }}
      className={cn(
        "rounded-lg border-l-4 p-3",
        colorConfig.bg,
        colorConfig.border,
        "border border-[var(--color-border)]"
      )}
    >
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={handleBlur}
        placeholder="Write your note..."
        rows={2}
        className={cn(
          "w-full bg-transparent resize-none text-sm",
          "text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]",
          "outline-none"
        )}
      />

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--color-border)]">
        {/* Color picker */}
        <div className="flex items-center gap-1.5">
          {NOTE_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => onUpdateColor(note.id, color.value as NoteColor)}
              aria-label={`Set color to ${color.label}`}
              title={color.label}
              className={cn(
                "w-5 h-5 rounded-full border-2 transition-transform hover:scale-110",
                color.value === note.color
                  ? "border-[var(--color-accent-val)] scale-110"
                  : "border-transparent",
                color.value === "default" && "bg-[var(--color-text-muted)]",
                color.value === "amber" && "bg-amber-500",
                color.value === "blue" && "bg-blue-500",
                color.value === "green" && "bg-emerald-500",
                color.value === "rose" && "bg-rose-500",
                color.value === "purple" && "bg-purple-500"
              )}
            />
          ))}
        </div>

        {/* Delete button */}
        <button
          onClick={() => onDelete(note.id)}
          aria-label="Delete note"
          className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
});
