import type { MonthTheme } from "./types";

/** Visual identity config for each month — gradient, accent hue, SVG scene, season. */

export const MONTH_THEMES: MonthTheme[] = [
  {
    name: "Winter Frost",
    icon: "\u2744\uFE0F",
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #4a8cc7 40%, #7cb9e8 100%)",
    accentHue: 210,
    season: "winter",
    svgScene: "mountains",
  },
  {
    name: "Valentine Rose",
    icon: "\u{1F495}",
    gradient: "linear-gradient(135deg, #831843 0%, #db2777 40%, #f9a8d4 100%)",
    accentHue: 330,
    season: "winter",
    svgScene: "blossoms",
  },
  {
    name: "Holi Splash",
    icon: "\u{1F3A8}",
    gradient: "linear-gradient(135deg, #065f46 0%, #10b981 40%, #6ee7b7 100%)",
    accentHue: 160,
    season: "spring",
    svgScene: "holi",
  },
  {
    name: "April Showers",
    icon: "\u{1F327}\uFE0F",
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #0891b2 40%, #67e8f9 100%)",
    accentHue: 190,
    season: "spring",
    svgScene: "rain",
  },
  {
    name: "Golden Fields",
    icon: "\u2600\uFE0F",
    gradient: "linear-gradient(135deg, #78350f 0%, #d97706 40%, #fde68a 100%)",
    accentHue: 40,
    season: "summer",
    svgScene: "sun",
  },
  {
    name: "Ocean Breeze",
    icon: "\u{1F30A}",
    gradient: "linear-gradient(135deg, #134e4a 0%, #14b8a6 40%, #99f6e4 100%)",
    accentHue: 170,
    season: "summer",
    svgScene: "ocean",
  },
  {
    name: "Monsoon Haze",
    icon: "\u26C8\uFE0F",
    gradient: "linear-gradient(135deg, #312e81 0%, #6366f1 40%, #a5b4fc 100%)",
    accentHue: 240,
    season: "monsoon",
    svgScene: "storm",
  },
  {
    name: "Mountain Tricolor",
    icon: "\u{1F3D4}\uFE0F",
    gradient: "linear-gradient(135deg, #9a3412 0%, #ea580c 40%, #fdba74 100%)",
    accentHue: 25,
    season: "monsoon",
    svgScene: "peaks",
  },
  {
    name: "Autumn Gold",
    icon: "\u{1F342}",
    gradient: "linear-gradient(135deg, #78350f 0%, #b45309 40%, #fbbf24 100%)",
    accentHue: 35,
    season: "autumn",
    svgScene: "leaves",
  },
  {
    name: "Festival Lights",
    icon: "\u{1FA94}",
    gradient: "linear-gradient(135deg, #581c87 0%, #9333ea 40%, #d8b4fe 100%)",
    accentHue: 270,
    season: "festival",
    svgScene: "festival",
  },
  {
    name: "Diwali Glow",
    icon: "\u2728",
    gradient: "linear-gradient(135deg, #78350f 0%, #d97706 40%, #fcd34d 100%)",
    accentHue: 45,
    season: "festival",
    svgScene: "lights",
  },
  {
    name: "Holiday Night",
    icon: "\u{1F384}",
    gradient: "linear-gradient(135deg, #7f1d1d 0%, #dc2626 40%, #fca5a5 100%)",
    accentHue: 0,
    season: "winter",
    svgScene: "stars",
  },
];

export function getMonthTheme(month: number): MonthTheme {
  return MONTH_THEMES[month];
}
