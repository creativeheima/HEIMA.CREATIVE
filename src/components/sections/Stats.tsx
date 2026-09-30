"use client";

import { motion } from "framer-motion";
import { Counter } from "@/components/motion/Counter";
import { useSiteSettings } from "@/components/providers/SiteSettings";
import { cn, EASE } from "@/lib/motion";

/** Statistik perusahaan — dikelola di CMS (Pengaturan Website → Statistik). */
export function Stats({ dark }: { dark?: boolean }) {
  const { stats } = useSiteSettings();

  // Duplikasi data untuk continuous seamless marquee di mobile/tablet
  const marqueeStats = [...stats, ...stats, ...stats, ...stats];

  return (
    <section aria-label="Statistik perusahaan" className={cn("overflow-hidden pb-16 md:pb-24", dark ? "bg-abyss text-paper" : "bg-paper text-navy")}>
      {/* 1. Tampilan Desktop (>= lg) — Grid 4 Kolom Statis & Elegan */}
      <div className="container-x hidden lg:block">
        <dl className="grid grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={`${s.label}-${i}`}
              className={cn(
                "relative flex flex-col border-t py-8 pr-6 md:py-10",
                dark ? "border-paper/15" : "border-navy/15",
                i > 0 && "pl-8",
              )}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1, ease: EASE, delay: i * 0.1 }}
            >
              <motion.span
                aria-hidden
                className="absolute -top-px left-0 h-px w-full origin-left bg-signal"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 0.25 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.3 + i * 0.1 }}
              />
              <dt className={cn("meta order-2 mt-4", dark ? "text-paper/60" : "text-steel")}>{s.label}</dt>
              <dd className="font-display text-[clamp(3rem,7vw,6.5rem)] leading-none font-bold tracking-[-0.05em]">
                {s.prefix}
                <Counter value={s.value} />
                <span className="text-signal">{s.suffix}</span>
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>

      {/* 2. Tampilan Mobile & Tablet (< lg) — Tetap Horizontal & Animasi Berjalan Pelan (Marquee) */}
      <div className="relative block lg:hidden py-3 sm:py-5">
        {/* Efek gradient fade di sisi kiri dan kanan */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-10 w-8 sm:w-16 bg-gradient-to-r",
            dark ? "from-abyss to-transparent" : "from-paper to-transparent"
          )}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 z-10 w-8 sm:w-16 bg-gradient-to-l",
            dark ? "from-abyss to-transparent" : "from-paper to-transparent"
          )}
        />

        {/* Marquee Track */}
        <div className="flex overflow-hidden">
          <motion.div
            className="flex shrink-0 items-center will-change-transform"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 25,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {marqueeStats.map((s, i) => (
              <div
                key={`${s.label}-m-${i}`}
                className={cn(
                  "relative flex flex-col justify-center shrink-0 w-[220px] sm:w-[260px] border-t py-8 px-6 mr-4",
                  dark ? "border-paper/15" : "border-navy/15",
                  "border-r",
                  dark ? "border-r-paper/10" : "border-r-navy/10"
                )}
              >
                <span
                  aria-hidden
                  className="absolute -top-px left-0 h-px w-16 bg-signal"
                />
                <dt className={cn("meta order-2 mt-3 text-xs tracking-wider uppercase", dark ? "text-paper/60" : "text-steel")}>
                  {s.label}
                </dt>
                <dd className="font-display text-[2.75rem] sm:text-5xl leading-none font-bold tracking-[-0.05em]">
                  {s.prefix}
                  <span>{s.value}</span>
                  <span className="text-signal">{s.suffix}</span>
                </dd>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
