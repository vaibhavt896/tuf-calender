"use client";

import { useMemo, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCalendar } from "@/hooks/useCalendar";
import { useDateRange } from "@/hooks/useDateRange";
import { useNotes } from "@/hooks/useNotes";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { HeroSection } from "./HeroSection";
import { MiniYearView } from "./MiniYearView";
import { DateRangeBadge } from "./DateRangeBadge";
import { NotesPanel } from "@/components/Notes/NotesPanel";
import { ThemeToggle } from "@/components/UI/ThemeToggle";
import { cn } from "@/lib/utils";
import { formatRange, getDaysBetween, formatDateKey } from "@/lib/calendar-engine";
import { Printer, StickyNote, X } from "lucide-react";
import { IconButton } from "@/components/UI/IconButton";
import type { Note, NoteColor, NavigationDirection } from "@/lib/types";

const pageFlipVariants = {
  enter: (dir: NavigationDirection) => ({
    rotateX: dir === "next" ? 40 : -40,
    y: dir === "next" ? 24 : -24,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    rotateX: 0,
    y: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir: NavigationDirection) => ({
    rotateX: dir === "next" ? -40 : 40,
    y: dir === "next" ? -24 : 24,
    opacity: 0,
    scale: 0.97,
  }),
};

export function WallCalendar() {
  const {
    year,
    month,
    monthData,
    direction,
    todayDate,
    goToPrevMonth,
    goToNextMonth,
    goToMonth,
    goToToday,
  } = useCalendar();

  const {
    rangeState,
    handleDateClick,
    handleDateHover,
    handleGridLeave,
    clearRange,
    isInActiveRange,
    isInHoverRange,
    isRangeStart,
    isRangeEnd,
    rangeStartKey,
    rangeEndKey,
  } = useDateRange();

  const {
    notes,
    addNote,
    updateNote,
    updateNoteColor,
    deleteNote,
    getNotesForDate,
    getNotesForRange,
    getNotesForMonth,
    hasNotesForDate,
  } = useNotes();

  const { handleKeyDown, isPositionFocused } = useKeyboardNav();

  const [announcement, setAnnouncement] = useState("");
  const [isNotesSheetOpen, setIsNotesSheetOpen] = useState(false);

  const isCurrentMonth = todayDate
    ? year === todayDate.getFullYear() && month === todayDate.getMonth()
    : false;

  // Clear range selection when navigating months so notes context stays relevant
  const navPrev = useCallback(() => { clearRange(); goToPrevMonth(); }, [clearRange, goToPrevMonth]);
  const navNext = useCallback(() => { clearRange(); goToNextMonth(); }, [clearRange, goToNextMonth]);
  const navToMonth = useCallback((y: number, m: number) => { clearRange(); goToMonth(y, m); }, [clearRange, goToMonth]);
  const navToToday = useCallback(() => { clearRange(); goToToday(); }, [clearRange, goToToday]);

  // Check if selected date belongs to the currently displayed month
  const selectedDateInCurrentMonth = rangeStartKey
    ? rangeStartKey.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)
    : false;

  // Get notes relevant to current selection or current month
  const currentNotes = useMemo(() => {
    if (rangeState.status === "selected" && rangeStartKey && rangeEndKey) {
      return getNotesForRange(rangeStartKey, rangeEndKey);
    }
    if (rangeStartKey && selectedDateInCurrentMonth) {
      return getNotesForDate(rangeStartKey);
    }
    return getNotesForMonth(year, month);
  }, [rangeState.status, rangeStartKey, rangeEndKey, selectedDateInCurrentMonth, getNotesForDate, getNotesForRange, getNotesForMonth, year, month]);

  // Announce range selection to screen readers
  const rangeAnnouncement = useMemo(() => {
    if (rangeState.status === "selected" && rangeStartKey && rangeEndKey) {
      return `Range selected: ${formatRange(rangeStartKey, rangeEndKey)}, ${getDaysBetween(rangeStartKey, rangeEndKey)} days`;
    }
    return "";
  }, [rangeState.status, rangeStartKey, rangeEndKey]);

  // Wrapped addNote that announces to screen readers
  const handleAddNote = useCallback(
    (dateKey: string, content: string, color?: NoteColor): Note => {
      const note = addNote(dateKey, content, color);
      const label = dateKey.includes(":")
        ? `Note added for range`
        : `Note added for ${formatDateKey(dateKey)}`;
      setAnnouncement(label);
      return note;
    },
    [addNote]
  );

  // Determine selected date key for single-click selection (null if not in current month)
  const selectedDateKey = selectedDateInCurrentMonth ? rangeStartKey : null;

  const hasNotesForMonthCheck = useCallback(
    (y: number, m: number) => getNotesForMonth(y, m).length > 0,
    [getNotesForMonth]
  );

  const handlePrint = () => window.print();

  return (
    <div
      className={cn(
        "w-full max-w-[var(--calendar-max-width)] mx-auto",
        "grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-0 lg:gap-6",
      )}
    >
      {/* Main Calendar Section */}
      <div
        className={cn(
          "paper-texture relative",
          "bg-[var(--color-surface-val)]",
          "rounded-lg overflow-hidden",
          "shadow-[0_2px_20px_var(--color-paper-shadow),0_0_0_1px_var(--color-border)]"
        )}
      >
        {/* Spiral Binding */}
        <div className="spiral-binding no-print">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="spiral-hole" />
          ))}
        </div>

        {/* Page-flip wrapper: hero + grid animate together as one page */}
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={`${year}-${month}`}
            custom={direction}
            variants={pageFlipVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 28,
              mass: 0.8,
            }}
            style={{ transformPerspective: 1200, transformOrigin: "center center" }}
          >
            {/* Hero Section */}
            <HeroSection month={month} year={year} />

            {/* Calendar Header + Grid */}
            <div className="p-3 sm:p-5">
              {/* Top toolbar */}
              <div className="flex items-center justify-between mb-2">
                <CalendarHeader
                  year={year}
                  month={month}
                  direction={direction}
                  onPrev={navPrev}
                  onNext={navNext}
                  onToday={navToToday}
                  isCurrentMonth={isCurrentMonth}
                />
              </div>

              {/* Date Range Badge */}
              <div className="flex items-center justify-between mb-3">
                <DateRangeBadge
                  startKey={rangeStartKey}
                  endKey={rangeEndKey}
                  isVisible={rangeState.status === "selected"}
                  onClear={clearRange}
                />
                <div className="flex items-center gap-1 ml-auto no-print">
                  <IconButton onClick={handlePrint} label="Print calendar">
                    <Printer size={16} />
                  </IconButton>
                  <ThemeToggle />
                </div>
              </div>

              {/* The Grid */}
              <CalendarGrid
                grid={monthData.grid}
                year={year}
                month={month}
                isRangeStart={isRangeStart}
                isRangeEnd={isRangeEnd}
                isInRange={isInActiveRange}
                isHoverRange={isInHoverRange}
                hasNotes={hasNotesForDate}
                isPositionFocused={isPositionFocused}
                onDateSelect={handleDateClick}
                onDateHover={handleDateHover}
                onGridLeave={handleGridLeave}
                onKeyDown={handleKeyDown}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Screen reader announcements */}
      <div aria-live="polite" className="sr-only">
        {rangeAnnouncement}
        {announcement}
      </div>

      {/* Sidebar: Notes + Mini Year View — hidden on mobile, shown on lg+ */}
      <div className="hidden lg:flex flex-col gap-4">
        {/* Mini Year View */}
        <div
          className={cn(
            "bg-[var(--color-surface-val)] rounded-lg p-4",
            "border border-[var(--color-border)]"
          )}
        >
          <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wider">
            {year}
          </h3>
          <MiniYearView
            currentYear={year}
            currentMonth={month}
            todayDate={todayDate}
            onSelectMonth={navToMonth}
            hasNotesForMonth={hasNotesForMonthCheck}
          />
        </div>

        {/* Notes Panel — desktop */}
        <div
          className={cn(
            "bg-[var(--color-surface-val)] rounded-lg p-4",
            "border border-[var(--color-border)]",
            "flex-1"
          )}
        >
          <NotesPanel
            notes={currentNotes}
            allNotes={notes}
            selectedDateKey={selectedDateKey}
            rangeStartKey={rangeStartKey}
            rangeEndKey={rangeEndKey}
            isRangeSelected={rangeState.status === "selected"}
            onAddNote={handleAddNote}
            onUpdateNote={updateNote}
            onUpdateNoteColor={updateNoteColor}
            onDeleteNote={deleteNote}
          />
        </div>
      </div>

      {/* Mobile bottom sheet for notes */}
      <div className="lg:hidden">
        {/* Mobile notes trigger button */}
        <motion.button
          onClick={() => setIsNotesSheetOpen(!isNotesSheetOpen)}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "fixed bottom-4 right-4 z-40",
            "w-12 h-12 rounded-full shadow-lg",
            "bg-[var(--color-accent-val)] text-white",
            "flex items-center justify-center",
            "no-print"
          )}
          aria-label={isNotesSheetOpen ? "Close notes" : "Open notes"}
        >
          {isNotesSheetOpen ? <X size={20} /> : <StickyNote size={20} />}
          {currentNotes.length > 0 && !isNotesSheetOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-[10px] font-bold flex items-center justify-center">
              {currentNotes.length}
            </span>
          )}
        </motion.button>

        {/* Backdrop */}
        <AnimatePresence>
          {isNotesSheetOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotesSheetOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 no-print"
            />
          )}
        </AnimatePresence>

        {/* Bottom sheet */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: isNotesSheetOpen ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50",
            "bg-[var(--color-surface-val)]",
            "rounded-t-2xl border-t border-[var(--color-border)]",
            "max-h-[65vh] overflow-y-auto p-4 pb-8",
            "no-print"
          )}
        >
          {/* Drag handle */}
          <div className="w-10 h-1 bg-[var(--color-text-muted)] opacity-30 rounded-full mx-auto mb-4" />
          <NotesPanel
            notes={currentNotes}
            allNotes={notes}
            selectedDateKey={selectedDateKey}
            rangeStartKey={rangeStartKey}
            rangeEndKey={rangeEndKey}
            isRangeSelected={rangeState.status === "selected"}
            onAddNote={handleAddNote}
            onUpdateNote={updateNote}
            onUpdateNoteColor={updateNoteColor}
            onDeleteNote={deleteNote}
          />
        </motion.div>
      </div>
    </div>
  );
}
