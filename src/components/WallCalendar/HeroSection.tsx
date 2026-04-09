"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { getMonthTheme } from "@/lib/month-themes";
import { MONTH_NAMES } from "@/lib/constants";

interface HeroSectionProps {
  month: number;
  year: number;
}

/* ─────────────────────────────────────────────────────────
 * 12 Layered SVG Scenes — 5-layer architecture per scene:
 *   Layer 1: Sky gradient
 *   Layer 2: Distant elements (mountains, clouds)
 *   Layer 3: Mid-ground (trees, buildings, hills)
 *   Layer 4: Foreground (grass, snow, water)
 *   Layer 5: Animated particles
 * ───────────────────────────────────────────────────────── */

/* January — Snow-capped mountains with falling snowflakes */
function MountainsScene() {
  return (
    <svg viewBox="0 0 800 320" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky-jan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <filter id="blur-soft"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      {/* L1: Sky */}
      <rect width="800" height="320" fill="url(#sky-jan)" />
      {/* L2: Moon + distant clouds */}
      <circle cx="650" cy="60" r="30" fill="#e0e7ff" opacity="0.85" />
      <circle cx="645" cy="55" r="28" fill="url(#sky-jan)" />
      <ellipse cx="200" cy="70" rx="120" ry="30" fill="#475569" opacity="0.3" filter="url(#blur-soft)" />
      {/* L3: Mountains */}
      <polygon points="0,320 120,80 240,320" fill="#1e293b" opacity="0.9" />
      <polygon points="150,320 320,50 490,320" fill="#0f172a" />
      <polygon points="400,320 560,100 720,320" fill="#1e293b" opacity="0.85" />
      <polygon points="600,320 750,130 800,320" fill="#334155" opacity="0.7" />
      {/* Snow caps */}
      <polygon points="320,50 300,90 340,90" fill="white" opacity="0.7" />
      <polygon points="120,80 105,110 135,110" fill="white" opacity="0.6" />
      <polygon points="560,100 542,130 578,130" fill="white" opacity="0.65" />
      {/* L4: Foreground snow */}
      <path d="M0 280 Q100 260 200 275 Q350 295 500 270 Q650 250 800 280 L800 320 L0 320Z" fill="#cbd5e1" opacity="0.25" />
      <path d="M0 300 Q200 285 400 300 Q600 315 800 295 L800 320 L0 320Z" fill="#e2e8f0" opacity="0.3" />
      {/* L5: Snowflakes */}
      {Array.from({ length: 35 }).map((_, i) => {
        const cx = (i * 23.7) % 800;
        const cy = (i * 17.3) % 320;
        const r = 1 + (i % 3);
        const dur = 4 + (i % 5);
        const dx = (i % 7) - 3;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="white" opacity={0.4 + (i % 4) * 0.15}>
            <animateTransform attributeName="transform" type="translate" values={`0,0;${dx},320`} dur={`${dur}s`} repeatCount="indefinite" />
          </circle>
        );
      })}
    </svg>
  );
}

/* February — Cherry blossoms with floating petals */
function BlossomsScene() {
  return (
    <svg viewBox="0 0 800 320" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky-feb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fce7f3" />
          <stop offset="100%" stopColor="#fbcfe8" />
        </linearGradient>
      </defs>
      {/* L1: Sky */}
      <rect width="800" height="320" fill="url(#sky-feb)" />
      {/* L2: Distant hills */}
      <path d="M0 240 Q200 180 400 220 Q600 260 800 200 L800 320 L0 320Z" fill="#86efac" opacity="0.2" />
      <path d="M0 260 Q300 220 500 250 Q700 280 800 240 L800 320 L0 320Z" fill="#4ade80" opacity="0.15" />
      {/* L3: Trees with blossoms */}
      {[80, 220, 400, 560, 720].map((x, i) => (
        <g key={i}>
          <rect x={x - 4} y={140 + i * 8} width="8" height={180 - i * 8} fill="#92400e" rx="3" />
          {[0, 72, 144, 216, 288].map((angle, j) => (
            <ellipse
              key={j}
              cx={x + Math.cos((angle * Math.PI) / 180) * 22}
              cy={130 + i * 8 + Math.sin((angle * Math.PI) / 180) * 18}
              rx="16" ry="10"
              fill={j % 2 === 0 ? "#f9a8d4" : "#fbcfe8"}
              opacity="0.85"
              transform={`rotate(${angle}, ${x + Math.cos((angle * Math.PI) / 180) * 22}, ${130 + i * 8 + Math.sin((angle * Math.PI) / 180) * 18})`}
            >
              <animate attributeName="opacity" values="0.6;1;0.6" dur={`${3 + j * 0.4}s`} repeatCount="indefinite" />
            </ellipse>
          ))}
          <circle cx={x} cy={130 + i * 8} r="6" fill="#fbbf24" opacity="0.9" />
        </g>
      ))}
      {/* L4: Ground */}
      <path d="M0 290 Q200 275 400 290 Q600 305 800 285 L800 320 L0 320Z" fill="#86efac" opacity="0.3" />
      {/* L5: Floating petals rising */}
      {Array.from({ length: 18 }).map((_, i) => {
        const cx = (i * 47) % 800;
        const dur = 5 + (i % 4) * 1.5;
        return (
          <ellipse key={i} cx={cx} cy={300} rx="4" ry="2" fill={i % 2 === 0 ? "#f9a8d4" : "#fda4af"} opacity="0.7"
            transform={`rotate(${i * 20}, ${cx}, 300)`}>
            <animateTransform attributeName="transform" type="translate" values={`0,0;${(i % 5) - 2},-320`} dur={`${dur}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0.3;0" dur={`${dur}s`} repeatCount="indefinite" />
          </ellipse>
        );
      })}
    </svg>
  );
}

/* March — Holi colors (color splashes blooming) */
function HoliScene() {
  return (
    <svg viewBox="0 0 800 320" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky-mar" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#dbeafe" />
        </linearGradient>
        <filter id="blur-color"><feGaussianBlur stdDeviation="12" /></filter>
      </defs>
      {/* L1: Sky */}
      <rect width="800" height="320" fill="url(#sky-mar)" />
      {/* L2-3: Color splashes */}
      {[
        { cx: 150, cy: 120, color: "#f472b6", r: 70 },
        { cx: 350, cy: 160, color: "#a78bfa", r: 80 },
        { cx: 550, cy: 100, color: "#34d399", r: 65 },
        { cx: 700, cy: 180, color: "#fbbf24", r: 60 },
        { cx: 250, cy: 250, color: "#fb923c", r: 55 },
        { cx: 500, cy: 240, color: "#60a5fa", r: 70 },
      ].map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={s.color} opacity="0.25" filter="url(#blur-color)">
          <animate attributeName="r" values={`${s.r - 10};${s.r + 15};${s.r - 10}`} dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.35;0.15" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* L5: Small color particles */}
      {Array.from({ length: 25 }).map((_, i) => {
        const colors = ["#f472b6", "#a78bfa", "#34d399", "#fbbf24", "#fb923c", "#60a5fa"];
        const cx = (i * 33) % 800;
        const cy = (i * 19) % 320;
        return (
          <circle key={i} cx={cx} cy={cy} r={2 + (i % 3)} fill={colors[i % 6]} opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${1.5 + (i % 4) * 0.5}s`} repeatCount="indefinite" />
            <animate attributeName="r" values={`${2 + (i % 3)};${5 + (i % 3)};${2 + (i % 3)}`} dur={`${2 + (i % 3)}s`} repeatCount="indefinite" />
          </circle>
        );
      })}
    </svg>
  );
}

/* April — Rain showers with rolling hills */
function RainScene() {
  return (
    <svg viewBox="0 0 800 320" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky-apr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#4a8cc7" />
        </linearGradient>
        <filter id="cloud-blur"><feGaussianBlur stdDeviation="8" /></filter>
      </defs>
      {/* L1: Sky */}
      <rect width="800" height="320" fill="url(#sky-apr)" />
      {/* L2: Clouds */}
      <ellipse cx="200" cy="80" rx="120" ry="40" fill="#fff" opacity="0.15" filter="url(#cloud-blur)" />
      <ellipse cx="500" cy="55" rx="100" ry="35" fill="#fff" opacity="0.12" filter="url(#cloud-blur)" />
      <ellipse cx="700" cy="90" rx="80" ry="28" fill="#fff" opacity="0.1" filter="url(#cloud-blur)" />
      {/* L3: Rolling hills */}
      <path d="M0 220 Q200 160 400 200 Q600 240 800 190 L800 320 L0 320Z" fill="#1a5c3a" opacity="0.5" />
      <path d="M0 250 Q300 200 500 240 Q700 280 800 230 L800 320 L0 320Z" fill="#15803d" opacity="0.6" />
      {/* L4: Foreground hill */}
      <path d="M0 280 Q200 260 400 280 Q600 300 800 270 L800 320 L0 320Z" fill="#166534" opacity="0.7" />
      {/* L5: Rain drops */}
      {Array.from({ length: 25 }).map((_, i) => {
        const x1 = (i * 33) % 800;
        const dur = 0.7 + (i % 5) * 0.15;
        return (
          <line key={i} x1={x1} y1={0} x2={x1 - 8} y2={25} stroke="#93c5fd" strokeWidth="1.5" opacity="0.35">
            <animateTransform attributeName="transform" type="translate" values="0,0;-12,330" dur={`${dur}s`} repeatCount="indefinite" />
          </line>
        );
      })}
    </svg>
  );
}

/* May — Bright sun with rotating rays */
function SunScene() {
  return (
    <svg viewBox="0 0 800 320" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="sun-glow" cx="50%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="50%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
        <linearGradient id="sky-may" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
      </defs>
      {/* L1: Sky */}
      <rect width="800" height="320" fill="url(#sky-may)" />
      {/* L2: Sun with glow */}
      <circle cx="400" cy="110" r="65" fill="url(#sun-glow)">
        <animate attributeName="r" values="62;68;62" dur="4s" repeatCount="indefinite" />
      </circle>
      {/* L3: Sun rays — rotating */}
      <g opacity="0.5">
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 22.5 * Math.PI) / 180;
          return (
            <line key={i}
              x1={400 + Math.cos(angle) * 75} y1={110 + Math.sin(angle) * 75}
              x2={400 + Math.cos(angle) * 110} y2={110 + Math.sin(angle) * 110}
              stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" opacity="0.6">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur={`${2.5 + i * 0.15}s`} repeatCount="indefinite" />
            </line>
          );
        })}
        <animateTransform attributeName="transform" type="rotate" from="0 400 110" to="360 400 110" dur="60s" repeatCount="indefinite" />
      </g>
      {/* L4: Desert/ground */}
      <path d="M0 260 Q200 240 400 255 Q600 270 800 250 L800 320 L0 320Z" fill="#d97706" opacity="0.15" />
      <path d="M0 280 Q300 270 500 285 Q700 300 800 275 L800 320 L0 320Z" fill="#92400e" opacity="0.1" />
      {/* Heat shimmer particles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <circle key={i} cx={(i * 80) + 40} cy={270 + (i % 3) * 10} r="1.5" fill="#f59e0b" opacity="0.4">
          <animate attributeName="cy" values={`${270 + (i % 3) * 10};${260 + (i % 3) * 10};${270 + (i % 3) * 10}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.5;0.2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

/* June — Ocean waves with sine motion */
function OceanScene() {
  return (
    <svg viewBox="0 0 800 320" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky-jun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
      </defs>
      {/* L1: Sky */}
      <rect width="800" height="320" fill="url(#sky-jun)" />
      {/* L2: Sunset/moon */}
      <circle cx="650" cy="60" r="35" fill="#fef3c7" opacity="0.8" />
      {/* L3-4: Layered waves */}
      {[
        { y: 140, fill: "rgba(153,246,228,0.12)", dur: "4s", dx: 15 },
        { y: 170, fill: "rgba(94,234,212,0.15)", dur: "3.5s", dx: -10 },
        { y: 195, fill: "rgba(45,212,191,0.18)", dur: "3s", dx: 12 },
        { y: 220, fill: "rgba(20,184,166,0.22)", dur: "2.8s", dx: -8 },
        { y: 245, fill: "rgba(13,148,136,0.28)", dur: "2.5s", dx: 10 },
      ].map((w, i) => (
        <path key={i}
          d={`M0,${w.y} Q100,${w.y - 20} 200,${w.y} T400,${w.y} T600,${w.y} T800,${w.y} V320 H0 Z`}
          fill={w.fill}>
          <animateTransform attributeName="transform" type="translate" values={`0,0;${w.dx},0;0,0`} dur={w.dur} repeatCount="indefinite" />
        </path>
      ))}
      {/* L5: Foam/sparkles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <circle key={i} cx={(i * 70) + 20} cy={145 + (i % 4) * 25} r="2" fill="white" opacity="0.5">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur={`${1.5 + (i % 3) * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

/* July — Monsoon storm with lightning */
function StormScene() {
  return (
    <svg viewBox="0 0 800 320" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky-jul" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#312e81" />
        </linearGradient>
        <filter id="storm-blur"><feGaussianBlur stdDeviation="10" /></filter>
      </defs>
      {/* L1: Sky */}
      <rect width="800" height="320" fill="url(#sky-jul)" />
      {/* L2: Storm clouds */}
      <ellipse cx="200" cy="70" rx="160" ry="55" fill="#4338ca" opacity="0.5" filter="url(#storm-blur)" />
      <ellipse cx="500" cy="55" rx="180" ry="60" fill="#3730a3" opacity="0.6" filter="url(#storm-blur)" />
      <ellipse cx="700" cy="80" rx="120" ry="45" fill="#4338ca" opacity="0.4" filter="url(#storm-blur)" />
      {/* L3: Lightning bolt */}
      <polygon points="380,50 395,120 375,120 390,200 360,120 380,120 365,50" fill="#fbbf24" opacity="0">
        <animate attributeName="opacity" values="0;0;0;0.9;0;0;0;0;0.8;0" dur="4s" repeatCount="indefinite" />
      </polygon>
      {/* L4: Ground */}
      <path d="M0 270 Q200 255 400 270 Q600 285 800 265 L800 320 L0 320Z" fill="#1e1b4b" opacity="0.5" />
      {/* L5: Heavy rain */}
      {Array.from({ length: 30 }).map((_, i) => {
        const x1 = (i * 27) % 800;
        const dur = 0.5 + (i % 4) * 0.1;
        return (
          <line key={i} x1={x1} y1={0} x2={x1 - 10} y2={30} stroke="#a5b4fc" strokeWidth="1" opacity="0.3">
            <animateTransform attributeName="transform" type="translate" values="0,0;-15,330" dur={`${dur}s`} repeatCount="indefinite" />
          </line>
        );
      })}
    </svg>
  );
}

/* August — Independence (mountain peaks with flag ribbon) */
function PeaksScene() {
  return (
    <svg viewBox="0 0 800 320" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky-aug" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#fdba74" />
        </linearGradient>
      </defs>
      {/* L1: Sky */}
      <rect width="800" height="320" fill="url(#sky-aug)" />
      {/* L2: Sun */}
      <circle cx="650" cy="70" r="40" fill="#fef3c7" opacity="0.7" />
      {/* L3: Mountain range */}
      <polygon points="0,320 100,80 200,320" fill="#c2410c" opacity="0.5" />
      <polygon points="120,320 280,40 440,320" fill="#9a3412" opacity="0.8" />
      <polygon points="350,320 520,90 690,320" fill="#ea580c" opacity="0.65" />
      <polygon points="580,320 720,120 800,320" fill="#c2410c" opacity="0.55" />
      {/* Snow caps */}
      <polygon points="280,40 260,80 300,80" fill="white" opacity="0.6" />
      <polygon points="520,90 500,125 540,125" fill="white" opacity="0.5" />
      {/* L4: Flag-colored ribbon (saffron-white-green) */}
      <g opacity="0.7">
        <path d="M0 260 Q200 250 400 260 Q600 270 800 255" stroke="#f97316" strokeWidth="4" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0,0;0,3;0,0" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M0 265 Q200 255 400 265 Q600 275 800 260" stroke="white" strokeWidth="4" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0,0;0,3;0,0" dur="2.2s" repeatCount="indefinite" />
        </path>
        <path d="M0 270 Q200 260 400 270 Q600 280 800 265" stroke="#16a34a" strokeWidth="4" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0,0;0,3;0,0" dur="2.4s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  );
}

/* September — Autumn leaves drifting */
function LeavesScene() {
  return (
    <svg viewBox="0 0 800 320" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky-sep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>
      {/* L1: Sky */}
      <rect width="800" height="320" fill="url(#sky-sep)" />
      {/* L2: Bare trees */}
      {[100, 300, 550, 720].map((x, i) => (
        <g key={i}>
          <rect x={x - 5} y={120 + i * 15} width="10" height={200 - i * 15} fill="#92400e" rx="4" />
          <line x1={x} y1={160 + i * 10} x2={x - 30 - i * 5} y2={130 + i * 10} stroke="#92400e" strokeWidth="3" />
          <line x1={x} y1={150 + i * 10} x2={x + 25 + i * 5} y2={120 + i * 10} stroke="#92400e" strokeWidth="3" />
          <line x1={x} y1={180 + i * 10} x2={x - 20} y2={160 + i * 10} stroke="#92400e" strokeWidth="2" />
        </g>
      ))}
      {/* L3: Ground with fallen leaves */}
      <path d="M0 290 Q200 280 400 290 Q600 300 800 285 L800 320 L0 320Z" fill="#92400e" opacity="0.3" />
      {/* L5: Falling leaves */}
      {Array.from({ length: 15 }).map((_, i) => {
        const colors = ["#f59e0b", "#ef4444", "#d97706", "#dc2626", "#b45309"];
        const cx = (i * 55) % 800;
        const dur = 4 + (i % 4) * 1.5;
        return (
          <ellipse key={i} cx={cx} cy={20 + (i % 5) * 30} rx="6" ry="3"
            fill={colors[i % 5]} opacity="0.7"
            transform={`rotate(${i * 25}, ${cx}, ${20 + (i % 5) * 30})`}>
            <animateTransform attributeName="transform" type="translate" values={`0,0;${(i % 7) * 5 - 15},300`} dur={`${dur}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0.5;0" dur={`${dur}s`} repeatCount="indefinite" />
          </ellipse>
        );
      })}
    </svg>
  );
}

/* October — Diwali festival (floating diyas/lamps) */
function FestivalScene() {
  return (
    <svg viewBox="0 0 800 320" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky-oct" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#581c87" />
        </linearGradient>
        <radialGradient id="lamp-glow" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fcd34d" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* L1: Night sky */}
      <rect width="800" height="320" fill="url(#sky-oct)" />
      {/* L2: Stars */}
      {Array.from({ length: 25 }).map((_, i) => (
        <circle key={`star-${i}`} cx={(i * 31) % 800} cy={(i * 17) % 150} r={0.8 + (i % 3) * 0.5}
          fill="white" opacity={0.3 + (i % 4) * 0.15}>
          <animate attributeName="opacity" values={`${0.2 + (i % 3) * 0.1};${0.6 + (i % 3) * 0.1};${0.2 + (i % 3) * 0.1}`} dur={`${1.5 + (i % 4)}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* L3: Distant buildings/temple silhouette */}
      <rect x="300" y="200" width="40" height="120" fill="#2e1065" opacity="0.6" />
      <polygon points="300,200 320,170 340,200" fill="#2e1065" opacity="0.6" />
      <rect x="360" y="220" width="30" height="100" fill="#2e1065" opacity="0.5" />
      <rect x="150" y="240" width="50" height="80" fill="#2e1065" opacity="0.4" />
      <rect x="600" y="230" width="45" height="90" fill="#2e1065" opacity="0.5" />
      {/* L4: Floating diyas */}
      {Array.from({ length: 12 }).map((_, i) => {
        const x = 40 + i * 65;
        const baseY = 260 + (i % 3) * 15;
        return (
          <g key={`diya-${i}`}>
            <circle cx={x} cy={baseY} r="18" fill="url(#lamp-glow)" />
            <ellipse cx={x} cy={baseY} rx="8" ry="5" fill="#92400e" opacity="0.9" />
            <ellipse cx={x} cy={baseY - 6} rx="3" ry="8" fill="#fcd34d" opacity="0.8">
              <animate attributeName="opacity" values="0.5;1;0.5" dur={`${1 + i * 0.25}s`} repeatCount="indefinite" />
              <animate attributeName="ry" values="7;9;7" dur={`${1 + i * 0.25}s`} repeatCount="indefinite" />
            </ellipse>
            <g>
              <animateTransform attributeName="transform" type="translate" values={`0,0;0,-4;0,0`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </g>
          </g>
        );
      })}
      {/* L5: Firework sparkles */}
      {Array.from({ length: 20 }).map((_, i) => {
        const colors = ["#fbbf24", "#f472b6", "#a78bfa", "#34d399", "#fb923c"];
        return (
          <circle key={`spark-${i}`} cx={(i * 41) % 800} cy={30 + (i * 13) % 180} r={1.5 + (i % 3)}
            fill={colors[i % 5]} opacity="0.6">
            <animate attributeName="opacity" values="0;0.8;0" dur={`${1.5 + (i % 4) * 0.5}s`} repeatCount="indefinite" />
            <animate attributeName="r" values={`${1 + (i % 2)};${4 + (i % 3)};${1 + (i % 2)}`} dur={`${1.5 + (i % 4) * 0.5}s`} repeatCount="indefinite" />
          </circle>
        );
      })}
    </svg>
  );
}

/* November — Firework bursts */
function LightsScene() {
  return (
    <svg viewBox="0 0 800 320" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky-nov" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a0a" />
          <stop offset="100%" stopColor="#1c1917" />
        </linearGradient>
      </defs>
      {/* L1: Night sky */}
      <rect width="800" height="320" fill="url(#sky-nov)" />
      {/* L2: City skyline */}
      <rect x="50" y="250" width="35" height="70" fill="#292524" />
      <rect x="100" y="230" width="25" height="90" fill="#1c1917" />
      <rect x="200" y="240" width="40" height="80" fill="#292524" />
      <rect x="350" y="220" width="30" height="100" fill="#1c1917" />
      <rect x="500" y="235" width="45" height="85" fill="#292524" />
      <rect x="600" y="245" width="35" height="75" fill="#1c1917" />
      <rect x="700" y="225" width="40" height="95" fill="#292524" />
      {/* L3-5: Firework bursts */}
      {[
        { cx: 200, cy: 100, color: "#fbbf24", delay: 0 },
        { cx: 450, cy: 80, color: "#f472b6", delay: 1.5 },
        { cx: 650, cy: 120, color: "#a78bfa", delay: 3 },
        { cx: 300, cy: 140, color: "#34d399", delay: 2 },
      ].map((fw, fi) => (
        <g key={fi}>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const r = 30 + (i % 3) * 10;
            return (
              <line key={i}
                x1={fw.cx} y1={fw.cy}
                x2={fw.cx + Math.cos(angle) * r} y2={fw.cy + Math.sin(angle) * r}
                stroke={fw.color} strokeWidth="2" strokeLinecap="round" opacity="0">
                <animate attributeName="opacity" values="0;0.8;0" dur="2s" begin={`${fw.delay}s`} repeatCount="indefinite" />
              </line>
            );
          })}
          <circle cx={fw.cx} cy={fw.cy} r="3" fill={fw.color} opacity="0">
            <animate attributeName="opacity" values="0;1;0" dur="2s" begin={`${fw.delay}s`} repeatCount="indefinite" />
            <animate attributeName="r" values="2;6;2" dur="2s" begin={`${fw.delay}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      {/* Small sparkle particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <circle key={`sp-${i}`} cx={(i * 53) % 800} cy={50 + (i * 19) % 200} r="1" fill="white" opacity="0">
          <animate attributeName="opacity" values="0;0.7;0" dur={`${1 + (i % 3)}s`} begin={`${(i % 5) * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

/* December — Winter night with twinkling stars */
function SnowScene() {
  return (
    <svg viewBox="0 0 800 320" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky-dec" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e3a5f" />
        </linearGradient>
      </defs>
      {/* L1: Sky */}
      <rect width="800" height="320" fill="url(#sky-dec)" />
      {/* L2: Stars */}
      {Array.from({ length: 40 }).map((_, i) => (
        <circle key={i} cx={(i * 19.7) % 800} cy={(i * 11.3) % 180} r={0.5 + (i % 3) * 0.5}
          fill={i % 5 === 0 ? "#fca5a5" : "white"} opacity={0.3 + (i % 4) * 0.15}>
          <animate attributeName="opacity" values={`${0.2 + (i % 3) * 0.1};${0.7 + (i % 2) * 0.2};${0.2 + (i % 3) * 0.1}`} dur={`${1 + (i % 4) * 0.8}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* L3: Pine trees */}
      {[100, 250, 450, 600, 730].map((x, i) => {
        const h = 60 + i * 10;
        return (
          <g key={i}>
            <polygon points={`${x},${280 - h} ${x - 25 - i * 3},${280} ${x + 25 + i * 3},${280}`} fill="#134e4a" opacity="0.8" />
            <polygon points={`${x},${280 - h - 20} ${x - 18},${280 - h + 15} ${x + 18},${280 - h + 15}`} fill="#115e59" opacity="0.7" />
          </g>
        );
      })}
      {/* L4: Snow ground */}
      <path d="M0 280 Q100 270 200 278 Q350 290 500 275 Q650 265 800 280 L800 320 L0 320Z" fill="white" opacity="0.25" />
      <path d="M0 295 Q200 288 400 295 Q600 302 800 292 L800 320 L0 320Z" fill="white" opacity="0.3" />
      {/* L5: Gentle snowfall */}
      {Array.from({ length: 30 }).map((_, i) => {
        const cx = (i * 27.3) % 800;
        const cy = (i * 13.7) % 320;
        const dur = 5 + (i % 5) * 1.5;
        const dx = (i % 5) - 2;
        return (
          <circle key={i} cx={cx} cy={cy} r={1 + (i % 3) * 0.5} fill="white" opacity={0.3 + (i % 4) * 0.1}>
            <animateTransform attributeName="transform" type="translate" values={`0,0;${dx},320`} dur={`${dur}s`} repeatCount="indefinite" />
          </circle>
        );
      })}
    </svg>
  );
}

/* December alt — used for stars scene key */
function StarsScene() {
  return (
    <svg viewBox="0 0 800 320" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky-stars" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#450a0a" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
      </defs>
      {/* L1: Deep sky */}
      <rect width="800" height="320" fill="url(#sky-stars)" />
      {/* L2: Bright star */}
      <polygon points="400,30 406,50 426,50 410,62 416,82 400,70 384,82 390,62 374,50 394,50" fill="#fcd34d" opacity="0.9">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
      </polygon>
      {/* L3: Northern lights effect */}
      <path d="M0 100 Q200 60 400 90 Q600 120 800 80" stroke="#34d399" strokeWidth="30" fill="none" opacity="0.08">
        <animate attributeName="opacity" values="0.05;0.12;0.05" dur="5s" repeatCount="indefinite" />
      </path>
      <path d="M0 130 Q200 90 400 120 Q600 150 800 110" stroke="#a78bfa" strokeWidth="20" fill="none" opacity="0.06">
        <animate attributeName="opacity" values="0.03;0.1;0.03" dur="6s" repeatCount="indefinite" />
      </path>
      {/* L4: Silhouette landscape */}
      <path d="M0 270 Q100 240 200 260 Q300 280 400 255 Q500 230 600 260 Q700 290 800 265 L800 320 L0 320Z" fill="#450a0a" opacity="0.8" />
      {/* L5: Twinkling stars */}
      {Array.from({ length: 45 }).map((_, i) => (
        <circle key={i} cx={(i * 17.3) % 800} cy={(i * 11.7) % 230} r={0.5 + (i % 3) * 0.6}
          fill={i % 4 === 0 ? "#fca5a5" : "white"} opacity={0.3 + (i % 4) * 0.12}>
          <animate attributeName="opacity" values={`${0.15 + (i % 3) * 0.1};${0.65 + (i % 2) * 0.2};${0.15 + (i % 3) * 0.1}`} dur={`${1 + (i % 5) * 0.7}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

const sceneComponents: Record<string, React.FC> = {
  mountains: MountainsScene,
  blossoms: BlossomsScene,
  holi: HoliScene,
  rain: RainScene,
  sun: SunScene,
  ocean: OceanScene,
  storm: StormScene,
  peaks: PeaksScene,
  leaves: LeavesScene,
  festival: FestivalScene,
  lights: LightsScene,
  snow: SnowScene,
  stars: StarsScene,
};

export const HeroSection = memo(function HeroSection({ month, year }: HeroSectionProps) {
  const theme = getMonthTheme(month);
  const SceneComponent = sceneComponents[theme.svgScene] ?? MountainsScene;

  return (
    <div className="relative overflow-hidden rounded-t-lg h-[160px] sm:h-[200px] md:h-[240px]">
      {/* Scene background — no AnimatePresence, outer page-flip handles transition */}
      <div className="absolute inset-0">
        <SceneComponent />
      </div>

      {/* Overlay with month info */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
          className="text-center"
        >
          <p className="text-white/80 text-sm font-medium tracking-widest uppercase mb-1">
            {theme.icon} {theme.name}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
            {MONTH_NAMES[month]}
          </h1>
          <p className="text-white/60 text-sm mt-1 font-body">{year}</p>
        </motion.div>
      </div>
    </div>
  );
});
