"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { RevealText } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { CircuitLines, GridPattern, Particles } from "@/components/visuals/Patterns";
import { DataCard, GlassPanel, IsoCube, Orbit, Sphere } from "@/components/visuals/TechObjects";
import { useSiteSettings } from "@/components/providers/SiteSettings";
import { useFinePointer, useParallaxIntensity } from "@/hooks/useMotionPrefs";
import { EASE } from "@/lib/motion";

/**
 * HERO — parallax 5 layer:
 * Background (paling lambat) → Abstract graphics → 3D elements → Typography → CTA (paling cepat)
 */
export function Hero() {
  const site = useSiteSettings();
  const ref = useRef<HTMLElement>(null);
  const k = useParallaxIntensity();
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Layer speeds (positif = tertinggal/lambat, negatif = mendahului/cepat)
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", `${45 * k}%`]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1 + 0.15 * k]);
  const graphicsY = useTransform(scrollYProgress, [0, 1], ["0%", `${28 * k}%`]);
  const objectsY = useTransform(scrollYProgress, [0, 1], ["0%", `${8 * k}%`]);
  const objectsScale = useTransform(scrollYProgress, [0, 1], [1, 1 + 0.1 * k]);
  const typeY = useTransform(scrollYProgress, [0, 1], ["0%", `${-18 * k}%`]);
  const ctaY = useTransform(scrollYProgress, [0, 1], ["0%", `${-40 * k}%`]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Parallax mengikuti posisi mouse (desktop)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const depth = (d: number) => ({
    x: useTransform(smx, (v) => v * d),
    y: useTransform(smy, (v) => v * d),
  });
  const d1 = depth(12);
  const d2 = depth(26);
  const d3 = depth(44);

  useEffect(() => {
    if (!fine || reduced) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [fine, reduced, mx, my]);

  const intro = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: 40 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: { duration: 1.6, ease: EASE, delay },
  });

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-mist">
      {/* Layer 1 — Background */}
      <motion.div aria-hidden className="absolute inset-0 will-change-transform" style={{ y: bgY, scale: bgScale }}>
        <motion.div
          className="absolute inset-0"
          initial={reduced ? false : { scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: EASE }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_30%,rgba(41,80,146,0.16),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgba(33,60,109,0.08),transparent_50%)]" />
          <GridPattern size={72} />
        </motion.div>
      </motion.div>

      {/* Layer 2 — Abstract graphics */}
      <motion.div aria-hidden className="absolute inset-0 will-change-transform" style={{ y: graphicsY }}>
        <motion.div className="absolute top-[52%] right-0 left-[38%] hidden h-[22vh] md:block" style={d1}>
          <motion.div
            className="h-full w-full"
            initial={{ opacity: 0, x: reduced ? 0 : "-8%" }}
            animate={{ opacity: 0.85, x: "0%" }}
            transition={{ duration: 2, ease: EASE, delay: 0.6 }}
          >
            <CircuitLines />
          </motion.div>
        </motion.div>
        <Particles className="hidden md:block" />
      </motion.div>

      {/* Layer 3 — 3D elements */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 will-change-transform"
        style={{ y: objectsY, scale: objectsScale }}
      >
        <div className="absolute top-[9%] right-[-30%] aspect-square w-[110vw] opacity-40 sm:right-[-12%] sm:w-[75vw] md:opacity-100 lg:top-[8%] lg:right-[2%] lg:w-[46vw] lg:max-w-[760px]">
          <motion.div className="absolute inset-[18%]" style={d2}>
            <motion.div className="h-full w-full" {...intro(0.4)}>
              <Sphere className="h-full w-full" />
            </motion.div>
          </motion.div>
          <motion.div className="absolute inset-[4%]" style={d1}>
            <motion.div className="h-full w-full" {...intro(0.55)}>
              <Orbit className="h-full w-full" />
            </motion.div>
          </motion.div>
          <motion.div className="absolute inset-[-6%]" style={d1}>
            <motion.div className="h-full w-full" {...intro(0.7)}>
              <Orbit className="h-full w-full opacity-60" tilt={74} rotate={24} reverse />
            </motion.div>
          </motion.div>
          <motion.div className="absolute top-[4%] left-[10%] hidden w-[16%] md:block" style={d3}>
            <motion.div className="h-full w-full" {...intro(0.9)}>
              <IsoCube className="animate-float w-full drop-shadow-[0_20px_30px_rgba(33,60,109,0.35)]" />
            </motion.div>
          </motion.div>
          <motion.div className="absolute bottom-[2%] left-[34%] w-[9%]" style={d3}>
            <motion.div className="h-full w-full" {...intro(1)}>
              <IsoCube className="animate-float w-full [animation-delay:-3s]" />
            </motion.div>
          </motion.div>
          <motion.div className="absolute top-[30%] right-[-2%] w-[12%]" style={d2}>
            <motion.div className="h-full w-full" {...intro(1.05)}>
              <IsoCube wire className="animate-float w-full [animation-delay:-5s]" />
            </motion.div>
          </motion.div>
          <motion.div className="absolute top-[14%] right-[0%] hidden w-[34%] lg:block" style={d3}>
            <motion.div className="h-full w-full" {...intro(1.1)}>
              <GlassPanel className="animate-float [animation-delay:-2s]" />
            </motion.div>
          </motion.div>
          <motion.div className="absolute right-[-4%] bottom-[20%] hidden w-[30%] lg:block" style={d3}>
            <motion.div className="h-full w-full" {...intro(1.2)}>
              <DataCard className="animate-float [animation-delay:-4s]" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Layer 4 & 5 — Typography + CTA */}
      <motion.div className="relative z-10 flex h-full flex-col justify-end" style={{ opacity: fade }}>
        <div className="container-x pb-8 md:pb-10">
          <motion.div style={{ y: typeY }} className="will-change-transform">
            <motion.p
              className="meta mb-6 flex items-center gap-3 text-steel md:mb-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.5 }}
            >
              <span className="h-px w-10 bg-signal" aria-hidden />
              {site.tagline} — Est. Yogyakarta
            </motion.p>
            <RevealText
              as="h1"
              id="hero-title"
              immediate
              delay={0.55}
              stagger={0.11}
              className="display-xl text-navy"
              lines={[
                "WE BUILD",
                <span key="d" className="text-royal">
                  DIGITAL
                </span>,
                <span key="s">
                  SOLUTIONS<span className="text-signal">.</span>
                </span>,
              ]}
            />
          </motion.div>

          <motion.div
            style={{ y: ctaY }}
            className="mt-8 flex flex-col gap-8 will-change-transform md:mt-10 lg:flex-row lg:items-end lg:justify-between"
          >
            <motion.p
              className="max-w-md text-lg leading-relaxed text-ink/75 md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 1 }}
            >
              Technology, design, and innovation that move businesses forward.
            </motion.p>
            <motion.div
              className="flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 1.15 }}
            >
              <Button href="/projects">Explore our work</Button>
              <Button href="/contact" variant="outline" arrow={false}>
                Start a project
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-10 hidden items-center justify-between border-t border-navy/10 pt-5 md:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            <span className="meta text-steel">Software · Web · Mobile · Systems</span>
            <span className="meta flex items-center gap-3 text-navy">
              Scroll to explore
              <span className="relative block h-8 w-px overflow-hidden bg-navy/15">
                <motion.span
                  className="absolute inset-x-0 top-0 h-3 bg-signal"
                  animate={reduced ? undefined : { y: [-12, 32] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>
            </span>
            <span className="meta text-steel">{site.location}</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
