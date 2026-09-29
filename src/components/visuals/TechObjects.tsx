import { cn } from "@/lib/motion";

/** Bola 3D dengan shading navy → royal (warna logo) + highlight putih. */
export function Sphere({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("rounded-full", className)}
      style={{
        background:
          "radial-gradient(circle at 30% 26%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 32%), radial-gradient(circle at 70% 80%, rgba(10,19,38,0.65) 0%, rgba(10,19,38,0) 55%), linear-gradient(140deg, #295092 0%, #213C6D 55%, #111F3B 100%)",
        boxShadow: "0 60px 120px -40px rgba(33,60,109,0.55), inset -20px -30px 60px rgba(10,19,38,0.35)",
      }}
    />
  );
}

/** Cincin orbit yang miring (ilusi 3D) dengan node oranye. */
export function Orbit({ className, tilt = 68, rotate = -18, reverse }: { className?: string; tilt?: number; rotate?: number; reverse?: boolean }) {
  return (
    <div aria-hidden className={cn("pointer-events-none", className)} style={{ perspective: 1200 }}>
      <div className="h-full w-full" style={{ transform: `rotateZ(${rotate}deg) rotateX(${tilt}deg)` }}>
        <div className={cn("animate-spin-slow relative h-full w-full rounded-full border border-royal/35")} style={reverse ? { animationDirection: "reverse" } : undefined}>
          <span className="absolute top-1/2 -left-[7px] h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_24px_rgba(235,119,44,0.8)]" />
          <span className="absolute -top-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-royal" />
        </div>
      </div>
    </div>
  );
}

/** Kubus isometrik (3 sisi: top terang, kiri royal, kanan navy). */
export function IsoCube({ className, wire }: { className?: string; wire?: boolean }) {
  if (wire) {
    return (
      <svg aria-hidden viewBox="0 0 100 100" className={className} fill="none" stroke="#295092" strokeWidth="1.5" strokeOpacity="0.6">
        <path d="M50 8 L90 30 L90 72 L50 94 L10 72 L10 30 Z" />
        <path d="M10 30 L50 52 L90 30 M50 52 L50 94" />
      </svg>
    );
  }
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={className}>
      <path d="M50 8 L90 30 L50 52 L10 30 Z" fill="#ffffff" />
      <path d="M50 8 L90 30 L50 52 L10 30 Z" fill="#295092" fillOpacity="0.14" />
      <path d="M10 30 L50 52 L50 94 L10 72 Z" fill="#295092" />
      <path d="M90 30 L50 52 L50 94 L90 72 Z" fill="#213C6D" />
    </svg>
  );
}

/** Panel kaca dengan baris "kode" — representasi software. */
export function GlassPanel({ className }: { className?: string }) {
  const rows = [
    ["w-10 bg-signal", "w-20 bg-navy/70", "w-8 bg-royal/40"],
    ["w-6 bg-royal/40", "w-24 bg-navy/60"],
    ["w-6 bg-royal/40", "w-12 bg-royal/70", "w-16 bg-navy/40"],
    ["w-14 bg-navy/60", "w-10 bg-royal/40"],
    ["w-6 bg-royal/40", "w-20 bg-navy/50", "w-6 bg-signal/80"],
  ];
  return (
    <div
      aria-hidden
      className={cn(
        "rounded-2xl border border-paper/70 bg-paper/55 p-5 shadow-[0_30px_80px_-30px_rgba(33,60,109,0.45)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="mb-4 flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-navy/25" />
        <span className="h-2 w-2 rounded-full bg-navy/25" />
        <span className="h-2 w-2 rounded-full bg-signal" />
      </div>
      <div className="space-y-2.5">
        {rows.map((r, i) => (
          <div key={i} className="flex gap-2">
            {r.map((c, j) => (
              <span key={j} className={cn("h-1.5 rounded-full", c)} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Mini chart batang — representasi data/sistem. */
export function DataCard({ className }: { className?: string }) {
  const bars = [38, 62, 45, 80, 58, 92, 70];
  return (
    <div
      aria-hidden
      className={cn(
        "rounded-2xl border border-paper/70 bg-paper/60 p-4 shadow-[0_30px_80px_-30px_rgba(33,60,109,0.45)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="meta mb-3 text-[0.55rem] text-steel">Uptime · 99.9%</div>
      <div className="flex h-16 items-end gap-1.5">
        {bars.map((h, i) => (
          <span key={i} className={cn("w-2.5 rounded-sm", i === 5 ? "bg-signal" : "bg-royal/70")} style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}
