"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { RevealText } from "@/components/motion/Reveal";
import { CircuitLines, GridPattern } from "@/components/visuals/Patterns";
import { IsoCube, Orbit, Sphere } from "@/components/visuals/TechObjects";
import { useParallaxIntensity } from "@/hooks/useMotionPrefs";
import { EASE } from "@/lib/motion";

type PageHeroProps = {
  label: string;
  lines: ReactNode[];
  description?: ReactNode;
  aside?: ReactNode;
  /** tampilkan objek 3D kecil di kanan atas */
  objects?: boolean;
};

/** Hero untuk halaman dalam — parallax 3 layer yang konsisten dengan homepage. */
export function PageHero({ label, lines, description, aside, objects = true }: PageHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const k = useParallaxIntensity();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", `${40 * k}%`]);
  const midY = useTransform(scrollYProgress, [0, 1], ["0%", `${15 * k}%`]);
  const typeY = useTransform(scrollYProgress, [0, 1], ["0%", `${-20 * k}%`]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-[88svh] items-end overflow-hidden bg-mist pt-40 pb-16 md:pb-20">
      <motion.div aria-hidden className="absolute inset-0" style={{ y: bgY }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_20%,rgba(41,80,146,0.14),transparent_55%)]" />
        <GridPattern size={72} />
      </motion.div>

      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ y: midY }}>
        <motion.div
          className="absolute top-[34%] right-0 h-36 w-[70%] md:w-[48%]"
          initial={{ opacity: 0, x: "10%" }}
          animate={{ opacity: 0.8, x: "0%" }}
          transition={{ duration: 1.8, ease: EASE, delay: 0.5 }}
        >
          <CircuitLines mirror />
        </motion.div>
        {objects && (
          <motion.div
            className="absolute top-[14%] right-[6%] hidden aspect-square w-[20vw] max-w-[300px] md:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: EASE, delay: 0.4 }}
          >
            <Orbit className="absolute -inset-[20%]" />
            <Sphere className="absolute inset-[12%]" />
            <IsoCube className="animate-float absolute -bottom-[10%] -left-[18%] w-[34%]" />
          </motion.div>
        )}
      </motion.div>

      <motion.div className="container-x relative z-10 w-full" style={{ y: typeY, opacity: fade }}>
        <motion.p
          className="meta mb-8 flex items-center gap-3 text-steel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.5 }}
        >
          <span className="h-px w-10 bg-signal" aria-hidden />
          {label}
        </motion.p>
        <RevealText as="h1" immediate delay={0.55} className="display-xl text-navy" lines={lines} />
        {(description || aside) && (
          <motion.div
            className="mt-12 flex flex-col gap-8 border-t border-navy/10 pt-8 md:flex-row md:items-end md:justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 1 }}
          >
            {description && <div className="max-w-xl text-lg leading-relaxed text-ink/75">{description}</div>}
            {aside}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
