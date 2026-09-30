"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Fragment, useRef } from "react";
import { RevealText } from "@/components/motion/Reveal";
import { TextLink } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useParallaxIntensity } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/motion";

/**
 * POWERED BY TECHNOLOGY — daftar teknologi berbentuk tipografi besar yang
 * bergerak horizontal mengikuti scroll vertikal (baris berlawanan arah).
 */
export function TechMarquee({
  technologies,
  index = "05",
  showHeader = true,
}: {
  technologies: string[];
  index?: string;
  showHeader?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const k = Math.max(useParallaxIntensity(), 0.35);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Bagi rata ke 3 baris, berapa pun jumlah teknologi dari CMS
  const per = Math.max(1, Math.ceil(technologies.length / 3));
  const rows = [0, 1, 2].map((r) => technologies.slice(r * per, (r + 1) * per)).filter((r) => r.length > 0);
  const x0 = useTransform(scrollYProgress, [0, 1], [`${5 * k}%`, `${-35 * k}%`]);
  const x1 = useTransform(scrollYProgress, [0, 1], [`${-40 * k}%`, `${0 * k}%`]);
  const x2 = useTransform(scrollYProgress, [0, 1], [`${0}%`, `${-30 * k}%`]);
  const xs = [x0, x1, x2];

  return (
    <section ref={ref} aria-labelledby="tech-title" className="section-y relative overflow-hidden bg-paper">
      {showHeader && (
        <div className="container-x mb-10 grid gap-8 md:mb-14 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel index={index}>Technology</SectionLabel>
          </div>
          <div className="flex flex-col gap-8 lg:col-span-9 lg:flex-row lg:items-end lg:justify-between">
            <RevealText
              id="tech-title"
              className="display-l text-navy"
              lines={[
                "POWERED BY",
                <span key="t">
                  TECHNOLOGY<span className="text-signal">.</span>
                </span>,
              ]}
            />
            <TextLink href="/technology">Our stack</TextLink>
          </div>
        </div>
      )}

      <ul aria-label="Teknologi yang kami gunakan" className="sr-only">
        {technologies.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      <div aria-hidden className="space-y-2 md:space-y-4">
        {rows.map((row, r) => (
          <motion.div key={r} style={{ x: xs[r] }} className="flex w-max items-center whitespace-nowrap will-change-transform">
            {[...row, ...row, ...row].map((t, i) => (
              <Fragment key={i}>
                <span
                  className={cn(
                    "font-display text-[clamp(3rem,9vw,9.5rem)] leading-[1.05] font-bold tracking-[-0.045em] uppercase transition-colors duration-500 hover:text-royal",
                    (i + r) % 2 === 0 ? "text-navy" : "text-outline text-navy/35",
                  )}
                >
                  {t}
                </span>
                <span className="mx-[3vw] inline-block h-3 w-3 shrink-0 rounded-full bg-signal md:h-4 md:w-4" />
              </Fragment>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
