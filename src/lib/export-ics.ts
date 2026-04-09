import type { Note } from "./types";
import { keyToDate } from "./calendar-engine";

/**
 * Generate an .ics (iCalendar) file from notes.
 * Compatible with Google Calendar, Apple Calendar, and Outlook.
 */
export function generateICS(notes: Note[]): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TUF Wall Calendar//EN",
    "CALSCALE:GREGORIAN",
  ];

  for (const note of notes) {
    const isRange = note.dateKey.includes(":");
    const [startKey, endKey] = isRange
      ? note.dateKey.split(":")
      : [note.dateKey, note.dateKey];

    const start = keyToDate(startKey);
    const end = keyToDate(endKey);
    // ICS uses next day for all-day event end
    end.setDate(end.getDate() + 1);

    const formatICSDate = (d: Date) =>
      `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;

    lines.push(
      "BEGIN:VEVENT",
      `DTSTART;VALUE=DATE:${formatICSDate(start)}`,
      `DTEND;VALUE=DATE:${formatICSDate(end)}`,
      `SUMMARY:${note.content.slice(0, 75)}`,
      `DESCRIPTION:${note.content}`,
      `UID:${note.id}@tuf-calendar`,
      `DTSTAMP:${formatICSDate(new Date())}T000000Z`,
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

/** Trigger download of .ics file */
export function downloadICS(notes: Note[], filename = "tuf-calendar-export"): void {
  const ics = generateICS(notes);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
