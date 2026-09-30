"use client";

import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Value } from "@/content/types";
import { EASE } from "@/lib/motion";

/** WHY HEIMA — judul sticky, lima value muncul satu per satu saat scroll. */
export function WhyHeima({ values, index = "07" }: { values: Value[]; index?: string }) {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.75", "end 0.6"] });

  return (
    <section aria-labelledby="why-title" className="section-y relative bg-mist">
      <div className="container-x grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionLabel index={index}>Why us</SectionLabel>
            <RevealText
              id="why-title"
              className="display-l mt-8 text-navy"
              lines={[
                "WHY",
                <span key="h">
                  HEIMA<span className="text-signal">.</span>
                </span>,
              ]}
            />
            <Reveal className="mt-8 max-w-sm text-steel" delay={0.2}>
              Lima prinsip yang memandu setiap project — dari baris kode pertama hingga support bertahun-tahun kemudian.
            </Reveal>
            {/* Progress indikator */}
            <div className="mt-12 hidden h-px w-full max-w-sm bg-navy/15 lg:block" aria-hidden>
              <motion.div className="h-px origin-left bg-signal" style={{ scaleX: scrollYProgress }} />
            </div>
          </div>
        </div>

        <ol ref={listRef} className="lg:col-span-7">
          {values.map((v) => (
            <motion.li
              key={v.number}
              className="group relative border-t border-navy/15 py-7 md:py-9"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.55 }}
              transition={{ duration: 1.1, ease: EASE }}
            >
              <motion.span
                aria-hidden
                className="absolute -top-px left-0 h-px w-full origin-left bg-navy"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.55 }}
                transition={{ duration: 1.4, ease: EASE, delay: 0.1 }}
              />
              <div className="grid grid-cols-12 gap-4">
                <span className="meta col-span-2 pt-3 text-signal">{v.number}</span>
                <div className="col-span-10">
                  <h3 className="font-display text-[clamp(2rem,4.4vw,4.25rem)] leading-[0.95] font-bold tracking-[-0.04em] text-navy uppercase transition-colors duration-500 group-hover:text-royal">
                    {v.title}
                  </h3>
                  <p className="mt-5 max-w-md leading-relaxed text-steel">{v.description}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
