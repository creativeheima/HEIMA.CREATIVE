"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Project } from "@/content/types";
import { EASE } from "@/lib/motion";

/**
 * CLIENTS — perusahaan yang telah membangun sistem bersama HEIMA.CREATIVE.
 * Otomatis diambil dari data project (field "Klien").
 */
export function Clients({ projects, index }: { projects: Project[]; index?: string }) {
  const clients = projects.filter((p) => p.client);
  if (clients.length === 0) return null;

  return (
    <section aria-labelledby="clients-title" className="section-y relative bg-paper">
      <div className="container-x">
        <div className="mb-10 grid gap-8 md:mb-14 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel index={index}>Clients</SectionLabel>
          </div>
          <div className="flex flex-col gap-8 lg:col-span-9 lg:flex-row lg:items-end lg:justify-between">
            <RevealText
              id="clients-title"
              className="display-l text-navy"
              lines={[
                "TRUSTED BY",
                <span key="b">
                  <span className="text-royal">GROWING</span> BUSINESSES<span className="text-signal">.</span>
                </span>,
              ]}
            />
            <Reveal className="max-w-xs text-steel" delay={0.2}>
              Perusahaan yang telah membangun sistem bersama HEIMA.CREATIVE.
            </Reveal>
          </div>
        </div>

        <ul className="border-t border-navy/15">
          {clients.map((p, i) => (
            <motion.li
              key={p.slug}
              className="border-b border-navy/15"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.9, ease: EASE, delay: i * 0.06 }}
            >
              <Link
                href={`/projects/${p.slug}`}
                data-cursor="view"
                data-cursor-label="VIEW →"
                className="group grid grid-cols-12 items-center gap-4 py-6 md:py-8"
              >
                <span className="meta col-span-2 text-steel transition-colors duration-500 group-hover:text-signal md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="col-span-10 font-display text-[clamp(1.75rem,4.6vw,4.5rem)] leading-none font-bold tracking-[-0.04em] text-navy uppercase transition-all duration-700 ease-[var(--ease-expo)] group-hover:translate-x-3 group-hover:text-royal md:col-span-6">
                  {p.client}
                </h3>
                <div className="col-span-10 col-start-3 md:col-span-4 md:col-start-auto">
                  <p className="font-display text-lg font-medium text-navy">{p.title}</p>
                  <p className="meta mt-2 text-steel">{p.industry || p.category}</p>
                </div>
                <span
                  aria-hidden
                  className="col-span-1 hidden justify-self-end text-2xl text-navy transition-all duration-700 ease-[var(--ease-expo)] group-hover:-rotate-45 group-hover:text-signal md:block"
                >
                  →
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
