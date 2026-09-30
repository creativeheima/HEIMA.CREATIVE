"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CircuitLines, GridPattern, Particles } from "@/components/visuals/Patterns";
import { IsoCube, Orbit, Sphere } from "@/components/visuals/TechObjects";
import type { Service } from "@/content/types";
import { useParallaxIntensity } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/motion";

/** Posisi & kecepatan kategori layanan (layer middle). */
const CHIPS = [
  { top: "16%", left: "8%", speed: 0.9 },
  { top: "12%", left: "58%", speed: 1.4 },
  { top: "30%", left: "30%", speed: 1.1 },
  { top: "26%", left: "78%", speed: 0.8 },
  { top: "52%", left: "6%", speed: 1.3 },
  { top: "44%", left: "52%", speed: 1 },
  { top: "72%", left: "26%", speed: 1.5 },
  { top: "86%", left: "6%", speed: 0.9 },
];

/**
 * Section kedalaman: background environment (lambat) → kategori layanan (sedang)
 * → tipografi HEIMA.CREATIVE (cepat).
 */
export function ParallaxServices({ services }: { services: Service[] }) {
  const ref = useRef<HTMLElement>(null);
  const k = useParallaxIntensity();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Background = slow
  const bgY = useTransform(scrollYProgress, [0, 1], [`${-10 * k}%`, `${10 * k}%`]);
  const bgRotate = useTransform(scrollYProgress, [0, 1], [0, 25 * k]);
  // Middle = medium
  const midY = useTransform(scrollYProgress, [0, 1], [100 * k, -100 * k]);
  // Foreground = fast
  const fgX = useTransform(scrollYProgress, [0, 1], [`${18 * k}%`, `${-32 * k}%`]);
  const fgY = useTransform(scrollYProgress, [0, 1], [140 * k, -140 * k]);
  const fgX2 = useTransform(scrollYProgress, [0, 1], [`${-30 * k}%`, `${14 * k}%`]);

  return (
    <section
      ref={ref}
      aria-labelledby="depth-title"
      className="relative min-h-[100svh] overflow-hidden bg-abyss text-paper"
    >
      {/* BACKGROUND — abstract technology environment */}
      <motion.div aria-hidden className="absolute -inset-[10%]" style={{ y: bgY }}>
        <GridPattern light size={80} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(41,80,146,0.45),transparent_45%),radial-gradient(circle_at_80%_75%,rgba(33,60,109,0.6),transparent_50%)]" />
        <motion.div className="absolute top-1/2 left-1/2 aspect-square w-[80vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2" style={{ rotate: bgRotate }}>
          <Orbit className="absolute inset-0 opacity-50" tilt={0} rotate={0} />
          <Orbit className="absolute inset-[16%] opacity-40" tilt={0} rotate={0} reverse />
          <Orbit className="absolute inset-[32%] opacity-30" tilt={0} rotate={0} />
        </motion.div>
        <div className="absolute top-[42%] left-1/2 aspect-square w-[22vw] max-w-[320px] -translate-x-1/2 -translate-y-1/2 opacity-90">
          <Sphere className="h-full w-full" />
        </div>
        <div className="absolute top-[10%] left-0 h-44 w-[55%] opacity-40">
          <CircuitLines tone="light" />
        </div>
        <div className="absolute right-0 bottom-[12%] h-44 w-[55%] opacity-40">
          <CircuitLines tone="light" mirror />
        </div>
        <Particles light count={34} />
      </motion.div>

      {/* MIDDLE — service categories */}
      <motion.div aria-hidden className="absolute inset-0 hidden sm:block" style={{ y: midY }}>
        {services.slice(0, CHIPS.length).map((s, i) => (
          <Chip key={s.slug} label={s.category} number={s.number} {...CHIPS[i]} progress={scrollYProgress} k={k} />
        ))}
        <div className="absolute top-[30%] left-[44%] w-16 opacity-80">
          <IsoCube className="animate-float" />
        </div>
      </motion.div>

      {/* FOREGROUND — HEIMA.CREATIVE typography */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[28%] z-10 whitespace-nowrap will-change-transform"
        style={{ y: fgY }}
      >
        <motion.p
          style={{ x: fgX }}
          className="font-display text-[clamp(5rem,19vw,19rem)] leading-[0.85] font-bold tracking-[-0.06em] text-paper"
        >
          HEIMA<span className="text-signal">.</span>CREATIVE
        </motion.p>
        <motion.p
          style={{ x: fgX2 }}
          className="text-outline font-display text-[clamp(5rem,19vw,19rem)] leading-[0.85] font-bold tracking-[-0.06em] text-paper/40"
        >
          DIGITAL·SOLUTIONS
        </motion.p>
      </motion.div>

      {/* Konten yang dapat dibaca */}
      <div className="container-x relative z-20 flex min-h-[100svh] flex-col justify-between py-16 md:py-20">
        <SectionLabel index="03" light>
          Eight disciplines · One team
        </SectionLabel>
        <div className="grid gap-8 md:grid-cols-12">
          <Reveal className="md:col-span-5 md:col-start-8">
            <h2 id="depth-title" className="display-m text-paper">
              Engineering depth<span className="text-signal">.</span>
              <br />
              <span className="text-paper/50">Business focus.</span>
            </h2>
            <p className="mt-6 max-w-md text-paper/65">
              Web, mobile, software, sistem, desain, transformasi digital, konsultasi, dan support — terhubung dalam satu
              arsitektur solusi untuk bisnis Anda.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Chip({
  label,
  number,
  top,
  left,
  speed,
  progress,
  k,
}: {
  label: string;
  number: string;
  top: string;
  left: string;
  speed: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  k: number;
}) {
  const y = useTransform(progress, [0, 1], [120 * speed * k, -120 * speed * k]);
  return (
    <motion.div className="absolute" style={{ top, left, y }}>
      <div
        className={cn(
          "flex items-center gap-3 rounded-full border border-paper/15 bg-paper/[0.06] px-5 py-3 backdrop-blur-md",
          "shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]",
        )}
      >
        <span className="meta text-signal">{number}</span>
        <span className="font-display text-lg font-medium tracking-[-0.01em] text-paper md:text-xl">{label}</span>
      </div>
    </motion.div>
  );
}
