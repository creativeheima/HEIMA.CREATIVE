"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { RevealText, Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { CircuitLines, GridPattern, Particles } from "@/components/visuals/Patterns";
import { Orbit, Sphere } from "@/components/visuals/TechObjects";
import { useSiteSettings } from "@/components/providers/SiteSettings";
import { useParallaxIntensity } from "@/hooks/useMotionPrefs";

export function CallToAction() {
  const site = useSiteSettings();
  const ref = useRef<HTMLElement>(null);
  const k = useParallaxIntensity();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [`${-8 * k}%`, `${8 * k}%`]);
  const sphereY = useTransform(scrollYProgress, [0, 1], [200 * k, -200 * k]);
  const linesX = useTransform(scrollYProgress, [0, 1], [`${-25 * k}%`, "0%"]);
  const linesX2 = useTransform(scrollYProgress, [0, 1], [`${25 * k}%`, "0%"]);

  return (
    <section ref={ref} aria-labelledby="cta-title" className="relative flex min-h-[100svh] items-center overflow-hidden bg-abyss text-paper">
      {/* Background — abstract technology visual (warna logo) */}
      <motion.div aria-hidden className="absolute -inset-[10%]" style={{ y: bgY }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(41,80,146,0.75),transparent_55%),radial-gradient(ellipse_at_0%_100%,rgba(33,60,109,0.9),transparent_55%)]" />
        <GridPattern light size={64} />
        <Particles light count={30} />
      </motion.div>
      <motion.div aria-hidden className="absolute top-[16%] left-0 h-40 w-[62%] opacity-50" style={{ x: linesX }}>
        <CircuitLines tone="light" />
      </motion.div>
      <motion.div aria-hidden className="absolute right-0 bottom-[14%] h-40 w-[62%] opacity-50" style={{ x: linesX2 }}>
        <CircuitLines tone="light" mirror />
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute top-1/2 right-[-18%] aspect-square w-[70vw] max-w-[820px] -translate-y-1/2 opacity-60 md:right-[-6%] md:w-[48vw] md:opacity-90"
        style={{ y: sphereY }}
      >
        <Orbit className="absolute inset-0" />
        <Orbit className="absolute -inset-[12%] opacity-50" tilt={72} rotate={30} reverse />
        <Sphere className="absolute inset-[20%]" />
      </motion.div>

      <div className="container-x relative z-10 py-32">
        <Reveal>
          <p className="meta flex items-center gap-3 text-paper/60">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
            Start a project
          </p>
        </Reveal>
        <RevealText
          id="cta-title"
          className="display-xl mt-10 text-paper"
          lines={[
            "HAVE A DIGITAL",
            <span key="p">
              PROJECT IN MIND<span className="text-signal">?</span>
            </span>,
          ]}
        />
        <Reveal delay={0.2} className="mt-10 flex flex-col gap-10 md:mt-14 md:flex-row md:items-center md:justify-between">
          <p className="max-w-md text-lg text-paper/70 md:text-xl">Let&apos;s build something meaningful with technology.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Button href="/contact" variant="accent" className="!px-9 !py-5">
              Start a project
            </Button>
            <a href={`mailto:${site.contact.email}`} className="meta text-paper/70 underline-offset-8 hover:text-paper hover:underline">
              {site.contact.email}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
