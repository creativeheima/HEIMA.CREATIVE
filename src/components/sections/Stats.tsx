"use client";

import { motion } from "framer-motion";
import { Counter } from "@/components/motion/Counter";
import { useSiteSettings } from "@/components/providers/SiteSettings";
import { cn, EASE } from "@/lib/motion";

/** Statistik perusahaan — dikelola di CMS (Pengaturan Website → Statistik). */
export function Stats({ dark }: { dark?: boolean }) {
  const { stats } = useSiteSettings();
  return (
    <section aria-label="Statistik perusahaan" className={cn(dark ? "bg-abyss text-paper" : "bg-paper text-navy")}>
      <div className="container-x">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className={cn(
                "relative flex flex-col border-t py-10 pr-6 md:py-14",
                dark ? "border-paper/15" : "border-navy/15",
                i % 2 === 1 && "pl-6 lg:pl-0",
                i > 0 && "lg:pl-8",
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
    </section>
  );
}
