"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import { BrandImage } from "@/components/ui/BrandImage";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Service } from "@/content/types";
import { useFinePointer } from "@/hooks/useMotionPrefs";
import { cn, EASE } from "@/lib/motion";

/**
 * WHAT WE DO — large editorial list.
 * Desktop: fill brand color, nomor bergeser, judul membesar, preview gambar mengikuti kursor.
 */
export function ServicesList({ services, index = "02", showHeader = true }: { services: Service[]; index?: string; showHeader?: boolean }) {
  const listRef = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const [active, setActive] = useState<number | null>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 180, damping: 22, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 180, damping: 22, mass: 0.6 });

  const onMove = (e: React.PointerEvent) => {
    if (!listRef.current) return;
    const r = listRef.current.getBoundingClientRect();
    px.set(e.clientX - r.left);
    py.set(e.clientY - r.top);
  };

  return (
    <section aria-labelledby="services-title" className="section-y relative bg-paper">
      <div className="container-x">
        {showHeader && (
          <div className="mb-10 grid gap-8 md:mb-14 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <SectionLabel index={index}>Services</SectionLabel>
            </div>
            <div className="flex flex-col gap-8 lg:col-span-9 lg:flex-row lg:items-end lg:justify-between">
              <RevealText
                id="services-title"
                className="display-l text-navy"
                lines={[
                  <span key="w">
                    WHAT WE DO<span className="text-signal">.</span>
                  </span>,
                ]}
              />
              <Reveal className="max-w-xs text-steel" delay={0.2}>
                Layanan inti, satu tim engineering — dari strategi hingga support jangka panjang.
              </Reveal>
            </div>
          </div>
        )}

        <div
          ref={listRef}
          onPointerMove={fine ? onMove : undefined}
          onPointerLeave={() => setActive(null)}
          className="relative"
        >
        <ul className="border-t border-navy/15">
          {services.map((s, i) => (
            <li key={s.slug} className="relative border-b border-navy/15">
              <Link
                href={`/services#${s.slug}`}
                data-cursor="view"
                data-cursor-label="EXPLORE →"
                onPointerEnter={() => fine && setActive(i)}
                className="group relative block overflow-hidden"
              >
                {/* Fill brand color */}
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 bg-navy transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-y-100 max-lg:hidden"
                />
                <motion.div
                  className="relative grid grid-cols-12 items-center gap-4 py-7 md:py-9 lg:px-6"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.9, ease: EASE, delay: (i % 4) * 0.05 }}
                >
                  <span className="meta col-span-2 text-steel transition-all duration-700 ease-[var(--ease-expo)] md:col-span-1 lg:group-hover:translate-x-3 lg:group-hover:text-signal">
                    {s.number}
                  </span>
                  <h3 className="col-span-10 origin-left font-display text-[clamp(1.6rem,4.2vw,4rem)] leading-[1] font-semibold tracking-[-0.035em] text-navy uppercase transition-all duration-700 ease-[var(--ease-expo)] md:col-span-7 lg:group-hover:translate-x-4 lg:group-hover:scale-[1.04] lg:group-hover:text-paper">
                    {s.title}
                  </h3>
                  <p className="col-span-10 col-start-3 text-sm leading-relaxed text-steel transition-colors duration-700 md:col-span-3 md:col-start-auto lg:group-hover:text-paper/70">
                    {s.summary}
                  </p>
                  <span
                    aria-hidden
                    className="col-span-1 hidden justify-self-end text-2xl text-navy transition-all duration-700 ease-[var(--ease-expo)] md:block lg:group-hover:-rotate-45 lg:group-hover:text-signal"
                  >
                    →
                  </span>
                </motion.div>
              </Link>
            </li>
          ))}
        </ul>

          {/* Preview visual mengikuti kursor (desktop) */}
          {fine && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute top-0 left-0 z-20 hidden lg:block"
              style={{ x: sx, y: sy }}
            >
              <AnimatePresence>
                {active !== null && (
                  <motion.div
                    key="preview"
                    className="absolute -top-[150px] left-10 h-[300px] w-[240px] overflow-hidden rounded-sm shadow-[0_40px_80px_-30px_rgba(10,19,38,0.6)]"
                    initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.6, rotate: 6 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    {services.map((s, i) => (
                      <motion.div
                        key={s.slug}
                        className="absolute inset-0"
                        initial={false}
                        animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.15 }}
                        transition={{ duration: 0.6, ease: EASE }}
                      >
                        <BrandImage src={s.image} alt="" className="h-full w-full" sizes="240px" />
                        <span className={cn("meta absolute bottom-3 left-3 text-paper")}>{s.category}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
