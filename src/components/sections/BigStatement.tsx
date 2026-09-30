"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { CircuitLines, GridPattern } from "@/components/visuals/Patterns";
import { useParallaxIntensity } from "@/hooks/useMotionPrefs";
import { EASE } from "@/lib/motion";

/**
 * BIG STATEMENT — tipografi sangat besar dengan text reveal, mask animation
 * (teks "terisi" mengikuti scroll), parallax per baris, dan background bergerak.
 */
export function BigStatement() {
  const ref = useRef<HTMLElement>(null);
  const k = useParallaxIntensity();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [`${-12 * k}%`, `${12 * k}%`]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  const linesX = useTransform(scrollYProgress, [0, 1], [`${-20 * k}%`, `${10 * k}%`]);

  return (
    <section ref={ref} aria-labelledby="statement-title" className="relative overflow-hidden bg-navy text-paper">
      <motion.div aria-hidden className="absolute -inset-[12%]" style={{ y: bgY, scale: bgScale }}>
        <GridPattern light size={96} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(41,80,146,0.9),transparent_55%),radial-gradient(ellipse_at_90%_90%,rgba(10,19,38,0.9),transparent_60%)]" />
      </motion.div>
      <motion.div aria-hidden className="absolute bottom-[8%] left-0 h-48 w-[90%] opacity-30" style={{ x: linesX }}>
        <CircuitLines tone="light" />
      </motion.div>

      <div className="container-x relative py-16 md:py-24">
        <p className="meta mb-6 flex items-center gap-3 text-paper/60 md:mb-8">
          <span className="h-px w-10 bg-signal" aria-hidden />
          Our belief
        </p>
        <h2 id="statement-title" className="font-display text-[clamp(2.75rem,8vw,8rem)] leading-[0.9] font-bold tracking-[-0.045em] uppercase">
          <StatementLine progress={scrollYProgress} range={[0.15, 0.4]} shift={-6 * k}>
            Technology
          </StatementLine>
          <StatementLine progress={scrollYProgress} range={[0.22, 0.47]} shift={4 * k} indent>
            Should move
          </StatementLine>
          <StatementLine progress={scrollYProgress} range={[0.29, 0.54]} shift={-4 * k}>
            Business
          </StatementLine>
          <StatementLine progress={scrollYProgress} range={[0.36, 0.6]} shift={6 * k} indent>
            Forward<span className="text-signal">.</span>
          </StatementLine>
        </h2>
      </div>
    </section>
  );
}

function StatementLine({
  children,
  progress,
  range,
  shift,
  indent,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  shift: number;
  indent?: boolean;
}) {
  const reduced = useReducedMotion();
  const x = useTransform(progress, [0, 1], [`${-shift}%`, `${shift}%`]);
  // Mask: lapisan solid tersingkap dari kiri ke kanan mengikuti scroll
  const clip = useTransform(progress, range, ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"]);

  return (
    <motion.span
      className={"block overflow-hidden " + (indent ? "md:pl-[8vw]" : "")}
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
    >
      <motion.span
        className="relative block w-max will-change-transform"
        style={{ x }}
        variants={{ hidden: { y: "100%" }, show: { y: "0%" } }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <span className="text-outline block text-paper/30">{children}</span>
        <motion.span aria-hidden className="absolute inset-0 block text-paper" style={{ clipPath: reduced ? "none" : clip }}>
          {children}
        </motion.span>
      </motion.span>
    </motion.span>
  );
}
