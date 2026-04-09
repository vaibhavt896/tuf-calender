# TUF Wall Calendar

An interactive, wall-calendar-inspired React component built entirely from scratch for the **TakeUforward Frontend Engineering Challenge**.

No calendar libraries. No date utility dependencies. Pure TypeScript calendar math. Every animation, every interaction, every pixel -- intentional.

**Live Demo:** [tuf-calendar.vercel.app](https://tuf-calender-one.vercel.app/)
**Demo Recording:** https://drive.google.com/file/d/1OQxAAj7o5ErLh35wESTOuvj6V8697HUs/view?usp=sharing

---

## Why a Wall Calendar?

Most calendar UIs are flat data grids. Functional, but forgettable.

I wanted to build something that captures the tactile, emotional quality of a physical wall calendar -- the kind you'd actually hang in your room. The spiral binding along the top. The large seasonal artwork that changes every month. The satisfying act of flipping a page. The feeling of writing a note directly onto a date.

That's the design language this component speaks. Every technical decision supports it.

---

## Core Features

### Date Range Selection
Two-click selection with a state machine (`idle` -> `selecting` -> `selected`) implemented via `useReducer`. Click a start date, hover to see a live preview of the range, click again to confirm. The selection renders as a continuous visual strip -- amber pill endpoints with rounded edges, flat connectors between them. A floating badge displays the range summary with day count and a clear button.

### Notes System
Full CRUD, tied to specific dates or date ranges. Notes persist in `localStorage` across sessions. Six color categories with left-border indicators. Notes attached to a range automatically appear when that range is reselected. The panel context updates as you interact -- click a date to see its notes, select a range to see range-scoped notes, or view all notes for the month at a glance. Export all notes as a `.ics` file compatible with Google Calendar, Apple Calendar, and Outlook.

### Generative SVG Art
Each of the 12 months has a unique, procedurally generated SVG scene rendered in the hero section -- snow-capped mountains for January, cherry blossoms for February, Holi color splashes for March, monsoon rain for April, and so on through December's starfield. All positions are deterministic (no `Math.random()`) to ensure hydration safety with server-side rendering. The scenes use a 5-layer depth architecture: sky gradient, distant elements, mid-ground, foreground, and animated particles.

### Page-Flip Animation
Month transitions use a 3D perspective transform (`rotateX` with `transformPerspective: 1200px`) animated through Framer Motion's spring physics. The hero section and grid animate as a single unit, creating the physical sensation of flipping a calendar page. Direction-aware: flipping forward rotates differently than flipping backward.

### Theme System
Three modes -- Light, Dark, and System -- with dark mode as the primary design surface (matching TUF's aesthetic). Built on CSS custom properties as a single source of truth, consumed by both Tailwind utility classes and Framer Motion. Theme transitions are smooth with a 300ms ease. The system mode listens for `prefers-color-scheme` changes in real time.

---

## Architecture

### Zero External Calendar Logic

The calendar engine (`src/lib/calendar-engine.ts`) is written from scratch. No `date-fns`. No `moment`. No `dayjs`. It handles:

- Leap year detection via the 400-year Gregorian rule
- Monday-indexed day-of-week calculation (ISO week standard)
- 6x7 grid generation with overflow days from adjacent months
- Date key formatting, parsing, range normalization, and comparison
- Display formatting for dates and ranges

This was a deliberate choice. The challenge specifically asks for an interactive calendar -- demonstrating command over the underlying date math is the point.

### State Machine for Range Selection

Date range selection is a multi-phase interaction that's easy to get wrong with simple `useState` flags. I used `useReducer` to model it as an explicit state machine:

```
idle ----[CLICK_DATE]----> selecting
selecting --[CLICK_DATE]--> selected
selecting --[HOVER_DATE]--> selecting (updates hover preview)
selected ---[CLICK_DATE]--> selecting (starts new selection)
any --------[CLEAR]-------> idle
```

This makes impossible states unrepresentable. The hover preview can only activate during `selecting`. The range badge only renders during `selected`. Edge cases like clicking the same date twice or clicking dates in reverse order are handled by `normalizeRange`.

### Custom Hooks with Single Responsibility

| Hook | Responsibility |
|---|---|
| `useCalendar` | Month/year state, memoized grid generation, directional navigation |
| `useDateRange` | Selection state machine via `useReducer`, computed range predicates |
| `useNotes` | CRUD operations, localStorage sync with hydration guard |
| `useTheme` | Three-mode switching, system preference detection, DOM class toggling |
| `useKeyboardNav` | Arrow key grid traversal, Enter/Space/Escape handlers, focus tracking |

Each hook owns one concern. `WallCalendar.tsx` composes them together. This isn't over-abstraction -- each hook has genuinely different lifecycle needs (e.g., `useNotes` needs hydration-safe `useEffect` loading; `useDateRange` needs `useReducer`).

### Component Memoization Strategy

`DayCell` is rendered 42 times per grid (6 weeks x 7 days). It receives callback props from the parent and boolean flags computed per-cell. Wrapping it in `React.memo` prevents re-renders when only unrelated state changes (e.g., opening the notes panel). The same treatment is applied to `CalendarGrid`, `MiniYearView`, `NoteEditor`, `NotesPanel`, and `DateRangeBadge`.

### Hydration Safety

Two SSR hydration pitfalls were identified and solved:

1. **localStorage reads**: `useNotes` and `useTheme` initialize with static defaults and load persisted state inside `useEffect` with a `hydrated` guard -- preventing the empty-array-on-first-render flash and the incorrect state persistence on mount.

2. **SVG scene randomness**: All procedural SVG positions use deterministic formulas (e.g., `(i * 73.7) % viewBoxWidth`) instead of `Math.random()`, ensuring server and client render identical markup.

---

## Design Tokens

The entire visual system is driven by CSS custom properties, making the calendar fully themeable by changing a single set of variables:

```
--color-surface-val        Base panel/card background
--color-accent-val         Primary interactive color (amber)
--color-range-fill         Range strip background (10-12% opacity)
--color-range-fill-hover   Hover preview strip (18-22% opacity)
--color-today              Today indicator ring
--color-weekend            Weekend text color
--color-holiday            Holiday text/dot color
--color-spiral             Spiral binding ring color
--color-paper-shadow       Card elevation shadow
```

Both light and dark palettes define every token. Tailwind v4's `@theme inline` directive bridges these properties into utility classes.

---

## Accessibility

This is not a decorative calendar. It's a fully navigable, screen-reader-compatible interactive widget.

- **ARIA grid pattern**: `role="grid"` on the container, `role="gridcell"` on each day, `role="columnheader"` on day-of-week labels
- **Keyboard navigation**: Arrow keys move focus through the grid. Enter/Space selects a date. Escape clears focus. Tab reaches all interactive controls.
- **Screen reader announcements**: Range selections are announced via `aria-live="polite"`. Each cell has a descriptive `aria-label` including day name, holiday status, range position, and "today" indicator.
- **Focus management**: Visible `outline` rings on all interactive elements. Focus tracking via `useKeyboardNav` ensures only one cell is tabbable at a time (`tabIndex={0}` on focused cell, `-1` on rest).
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` disables all animations and transitions globally.
- **Touch targets**: Every interactive element meets the 44px minimum recommended by WCAG 2.1.

---

## Responsive Design

Three breakpoints, no compromises:

**Desktop (1024px+)**: Two-column layout. Calendar on the left, sidebar with mini year view and notes panel on the right. Full hero artwork. Hover interactions enabled.

**Tablet (768-1023px)**: Single column. Calendar takes full width. Sidebar stacks below.

**Mobile (<768px)**: Full-width calendar with compact typography. Notes panel becomes a spring-animated bottom sheet triggered by a floating action button. The sheet slides up from the bottom with a drag handle, 65vh max height, and a backdrop overlay.

---

## Micro-interactions

Every interaction has spring-based physics (not CSS easing):

| Interaction | Animation |
|---|---|
| Day cell hover | `scale: 1.08`, spring stiffness 400, damping 17 |
| Day cell press | `scale: 0.93`, spring stiffness 400, damping 10 |
| Grid entrance | Staggered cascade, 12ms delay per cell, custom bezier |
| Page flip | `rotateX: 40deg`, spring stiffness 280, damping 28, mass 0.8 |
| Range badge appear | `scale: 0.95 -> 1`, `y: 10 -> 0`, spring damping 20 |
| Note card enter | `x: 20 -> 0`, `scale: 0.95 -> 1`, 50ms stagger per card |
| Add Note button | `whileHover: scale 1.02`, `whileTap: scale 0.98` |
| Mobile FAB | `whileTap: scale 0.97` |
| Bottom sheet | Spring stiffness 300, damping 30 |
| Today cell | Pulsing box-shadow ring, 3s infinite cycle |

---

## Project Structure

```
src/
  app/
    layout.tsx               Root layout, fonts, metadata, ThemeProvider
    page.tsx                 Single page -- renders <WallCalendar />
    globals.css              Design tokens, animations, paper texture, spiral binding
  components/
    WallCalendar/
      WallCalendar.tsx       Orchestrator -- composes all hooks and child components
      CalendarHeader.tsx     Month name, year display, prev/next/today navigation
      CalendarGrid.tsx       7x6 grid with day headers and staggered cell entrance
      DayCell.tsx            Individual day -- all visual states, range pill shapes
      HeroSection.tsx        Seasonal SVG art + month label (12 unique scenes)
      MiniYearView.tsx       12-month thumbnail grid for quick navigation
      DateRangeBadge.tsx     Floating range summary pill with clear button
    Notes/
      NotesPanel.tsx         Notes sidebar with date label, add button, ICS export
      NoteEditor.tsx         Single note card with textarea, color picker, delete
      NotesList.tsx          Animated list with empty state
    UI/
      ThemeToggle.tsx        Light / Dark / System cycle button
      IconButton.tsx         Reusable button with consistent styling
      Tooltip.tsx            Hover tooltip for holidays with emoji and type badge
      Modal.tsx              Accessible modal overlay
    Providers/
      ThemeProvider.tsx       React context for theme state
  hooks/
    useCalendar.ts           Month/year navigation, memoized grid generation
    useDateRange.ts          Range selection state machine (useReducer)
    useNotes.ts              CRUD + localStorage persistence with hydration guard
    useTheme.ts              Theme mode switching + system preference listener
    useKeyboardNav.ts        Grid keyboard navigation with focus tracking
  lib/
    calendar-engine.ts       Pure functions: grid math, date keys, range logic
    holidays.ts              Indian national + festival + international holidays
    month-themes.ts          12 month theme configs (gradient, scene, season, hue)
    constants.ts             Labels, grid dimensions, note color configs
    types.ts                 All TypeScript interfaces and type definitions
    utils.ts                 cn(), generateId(), clamp(), buildRangeKey()
    export-ics.ts            Generate .ics calendar files from notes
  styles/
    print.css                @media print stylesheet
```

32 source files. ~3,400 lines of TypeScript, CSS, and TSX.

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 16 (App Router) | Matches TUF's production stack. SSR + static generation. |
| Language | TypeScript (strict) | Type safety across all hooks, components, and engine functions. |
| Styling | Tailwind CSS v4 | Utility-first, design-token integration via `@theme inline`. |
| Animation | Framer Motion | Spring physics, `AnimatePresence` exit animations, layout transitions. |
| Icons | Lucide React | Tree-shakable, consistent stroke width, lightweight. |
| Persistence | localStorage | As specified. Hydration-safe load pattern. |
| Calendar Logic | From scratch | Zero date libraries. The entire grid engine is hand-written. |
| Fonts | Playfair Display + DM Sans | Editorial display type + clean body text. |

**Runtime dependencies: 2** -- `framer-motion` and `lucide-react`. That's it.

---

## Getting Started

```bash
git clone <repo-url>
cd tuf-calendar
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build    # Production build (zero errors, zero warnings)
npm run lint     # ESLint check
```

---

## Key Technical Decisions

**Why `useReducer` over `useState` for range selection?**
Range selection has three distinct phases with constrained transitions. A state machine makes impossible states unrepresentable -- you can't have a hover preview without first clicking a start date, and you can't have end without start. With multiple `useState` calls, these invariants would need manual enforcement.

**Why CSS custom properties instead of Tailwind's built-in dark mode?**
Custom properties serve as a single source of truth consumed by Tailwind utilities, inline styles, Framer Motion animations, and raw CSS (paper texture, spiral binding). Tailwind's `dark:` variant can't reach all of those contexts.

**Why hand-written calendar math?**
The challenge asks you to build an interactive calendar component. Using `react-calendar` or `date-fns` to generate the grid would skip the core problem. The engine is ~230 lines. It handles leap years, month boundaries, week alignment, and range logic. It's the kind of code that demonstrates you understand what a calendar actually is, not just how to import one.

**Why memoize `DayCell`?**
42 cells render per month. Without `React.memo`, opening the notes panel, hovering a cell, or typing in a note would re-render all 42 cells. With memo and stable callback refs via `useCallback`, only cells whose boolean flags actually change will re-render.

**Why deterministic SVG positions instead of `Math.random()`?**
Next.js pre-renders on the server. `Math.random()` produces different values on server vs. client, causing a hydration mismatch that manifests as a visible error badge in development and a DOM tree diff in production. Deterministic formulas like `(i * 73.7) % width` produce the same visual variety without the mismatch.

---

## Indian Holiday Context

The calendar includes 20+ Indian holidays -- Republic Day, Independence Day, Gandhi Jayanti, Holi, Diwali, Navratri, Janmashtami, Eid, and more. Each holiday has an emoji indicator, a type badge (national / festival / international), and a hover tooltip. This grounds the calendar in real-world Indian culture rather than treating it as a generic date grid -- relevant for a TUF submission where the evaluator and audience are primarily Indian developers.

---

Built for the TakeUforward Frontend Engineering Challenge, April 2026.
