"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { navigation, siteConfig } from "@/data/site";
import { useSiteSettings } from "@/components/providers/SiteSettings";
import { useLenis } from "@/components/providers/SmoothScroll";
import { Logo } from "@/components/ui/Logo";
import { CircuitLines, GridPattern } from "@/components/visuals/Patterns";
import { useParallaxIntensity } from "@/hooks/useMotionPrefs";

export function Footer() {
  const site = useSiteSettings();
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const k = useParallaxIntensity();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const wordY = useTransform(scrollYProgress, [0, 1], [`${40 * k}%`, "0%"]);
  const linesX = useTransform(scrollYProgress, [0, 1], [`${-12 * k}%`, "0%"]);

  const toTop = () => (lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: "smooth" }));

  return (
    <footer ref={ref} className="relative overflow-hidden bg-abyss text-paper">
      <GridPattern light />
      <motion.div aria-hidden style={{ x: linesX }} className="pointer-events-none absolute top-0 right-0 h-24 w-[60%] opacity-20">
        <CircuitLines tone="light" mirror flow={false} />
      </motion.div>

      <div className="container-x relative pt-24 md:pt-32">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo tone="light" />
            <p className="meta mt-6 text-paper/50">{site.tagline}</p>
            <p className="mt-8 max-w-sm text-paper/70">
              Perusahaan IT yang membangun solusi digital — website, aplikasi, software, dan sistem informasi — untuk bisnis
              yang ingin bergerak maju.
            </p>
          </div>

          <nav aria-label="Navigasi footer" className="lg:col-span-2">
            <p className="meta mb-6 text-paper/40">Navigation</p>
            <ul className="space-y-3">
              {navigation.slice(1).map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-paper/80 transition-colors hover:text-signal">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <p className="meta mb-6 text-paper/40">Social</p>
            <ul className="space-y-3">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-paper/80 transition-colors hover:text-signal">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <address className="not-italic lg:col-span-3">
            <p className="meta mb-6 text-paper/40">Contact</p>
            <ul className="space-y-3 text-paper/80">
              <li>
                <a href={`mailto:${site.contact.email}`} className="transition-colors hover:text-signal">
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a href={site.contact.phoneHref} className="transition-colors hover:text-signal">
                  {site.contact.phone}
                </a>
              </li>
              <li className="text-paper/60">{site.location}</li>
            </ul>
          </address>
        </div>

        <div className="relative mt-24 overflow-hidden md:mt-32" aria-hidden>
          <motion.p
            style={{ y: wordY }}
            className="font-display text-[clamp(4rem,21vw,20rem)] leading-[0.78] font-bold tracking-[-0.06em] text-paper/[0.06] select-none"
          >
            HEIMA<span className="text-signal/60">.</span>
          </motion.p>
        </div>

        <div className="flex flex-col gap-4 border-t border-paper/10 py-8 md:flex-row md:items-center md:justify-between">
          <p className="meta text-paper/50">© {siteConfig.year} HEIMA.CREATIVE</p>
          <p className="meta text-paper/50">{site.location}</p>
          <button type="button" onClick={toTop} className="meta group inline-flex items-center gap-2 text-paper/70 hover:text-paper">
            Back to top
            <span className="text-signal transition-transform duration-500 group-hover:-translate-y-1">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
