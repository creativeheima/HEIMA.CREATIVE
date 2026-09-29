"use client";

import { useId } from "react";
import { cn } from "@/lib/motion";

/** Grid teknis dengan fade radial. */
export function GridPattern({ className, light, size = 64 }: { className?: string; light?: boolean; size?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg aria-hidden className={cn("absolute inset-0 h-full w-full", className)}>
      <defs>
        <pattern id={`grid-${id}`} width={size} height={size} patternUnits="userSpaceOnUse">
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke={light ? "rgba(255,255,255,0.07)" : "rgba(33,60,109,0.08)"}
            strokeWidth="1"
          />
        </pattern>
        <radialGradient id={`fade-${id}`} cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id={`mask-${id}`}>
          <rect width="100%" height="100%" fill={`url(#fade-${id})`} />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill={`url(#grid-${id})`} mask={`url(#mask-${id})`} />
    </svg>
  );
}

type Trace = { d: string; node: [number, number]; color: "navy" | "royal" | "signal"; width?: number };

/** Tiga jalur utama — diturunkan langsung dari motif sirkuit di logo. */
const LOGO_TRACES: Trace[] = [
  { d: "M 56 110 H 520 L 590 170 H 1400", node: [40, 110], color: "navy" },
  { d: "M 136 210 H 600 L 660 262 H 1400", node: [120, 210], color: "royal" },
  { d: "M 216 310 H 660 L 700 346 H 1400", node: [200, 310], color: "signal" },
];

const COLORS = {
  dark: { navy: "#213C6D", royal: "#295092", signal: "#EB772C" },
  light: { navy: "rgba(255,255,255,0.75)", royal: "#5f83c4", signal: "#EB772C" },
};

/**
 * Garis data bergaya sirkuit dengan node lingkaran dan aliran data animasi.
 * `tone="light"` untuk latar gelap.
 */
export function CircuitLines({
  className,
  tone = "dark",
  flow = true,
  mirror = false,
}: {
  className?: string;
  tone?: "dark" | "light";
  flow?: boolean;
  mirror?: boolean;
}) {
  const palette = COLORS[tone];
  return (
    <svg
      aria-hidden
      viewBox="0 0 1400 400"
      fill="none"
      preserveAspectRatio="xMinYMid slice"
      className={cn("h-full w-full", mirror && "-scale-x-100", className)}
    >
      {LOGO_TRACES.map((t, i) => {
        const c = palette[t.color];
        return (
          <g key={i}>
            <path d={t.d} stroke={c} strokeOpacity={t.color === "signal" ? 0.9 : 0.35} strokeWidth={t.width ?? 10} strokeLinecap="round" strokeLinejoin="round" />
            {flow && (
              <path
                d={t.d}
                stroke={t.color === "signal" ? "#ffffff" : c}
                strokeOpacity={t.color === "signal" ? 0.55 : 0.9}
                strokeWidth={t.width ?? 10}
                strokeLinecap="round"
                strokeDasharray="40 160"
                className="animate-dash"
                style={{ animationDelay: `${-i * 1.6}s`, animationDuration: `${5 + i}s` }}
              />
            )}
            <circle cx={t.node[0]} cy={t.node[1]} r="16" stroke={c} strokeWidth="9" fill="none" />
          </g>
        );
      })}
    </svg>
  );
}

/** Pseudo-random deterministik (aman untuk SSR/hydration). */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Partikel halus yang melayang. */
export function Particles({ count = 26, light, className }: { count?: number; light?: boolean; className?: string }) {
  const rand = seeded(7);
  const dots = Array.from({ length: count }, (_, i) => ({
    left: rand() * 100,
    top: rand() * 100,
    size: 2 + rand() * 4,
    delay: -rand() * 7,
    duration: 6 + rand() * 6,
    accent: i % 9 === 0,
  }));
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      {dots.map((d, i) => (
        <span
          key={i}
          className={cn(
            "animate-float absolute rounded-full",
            d.accent ? "bg-signal" : light ? "bg-paper/40" : "bg-royal/35",
          )}
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
