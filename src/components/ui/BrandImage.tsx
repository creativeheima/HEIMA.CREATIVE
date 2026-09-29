"use client";

import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { useParallaxIntensity } from "@/hooks/useMotionPrefs";
import { cn, EASE } from "@/lib/motion";

type Tone = "brand" | "natural";

/**
 * Foto dengan brand treatment: grayscale + duotone navy/royal sehingga
 * fotografi selalu menyatu dengan palet logo.
 */
function Photo({ src, alt, sizes, priority, tone }: { src: string; alt: string; sizes: string; priority?: boolean; tone: Tone }) {
  return (
    <div className={cn("absolute inset-0", tone === "brand" && "bg-navy")}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "object-cover",
          tone === "brand" && "opacity-90 mix-blend-luminosity grayscale contrast-[1.08]",
        )}
      />
      {tone === "brand" && (
        <div aria-hidden className="absolute inset-0 bg-gradient-to-tr from-abyss/60 via-royal/10 to-transparent" />
      )}
    </div>
  );
}

type ParallaxImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  tone?: Tone;
  /** kekuatan pergerakan gambar di dalam frame */
  speed?: number;
  /** clip-path mask reveal saat masuk viewport */
  reveal?: boolean;
  /** zoom saat hover (butuh parent dengan class `group`) */
  hoverZoom?: boolean;
};

/**
 * Gambar dengan parallax internal + image scale + mask reveal + hover zoom.
 */
export function ParallaxImage({
  src,
  alt,
  className,
  sizes = "100vw",
  priority,
  tone = "brand",
  speed = 1,
  reveal = true,
  hoverZoom = false,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const k = useParallaxIntensity();
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const amt = 9 * speed * k;
  const y = useTransform(scrollYProgress, [0, 1], [`-${amt}%`, `${amt}%`]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1 + 0.12 * k, 1.04 + 0.02 * k, 1 + 0.06 * k]);

  const masked = reveal && !reduced;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div
        className="absolute inset-0 overflow-hidden bg-fog"
        initial={masked ? { clipPath: "inset(100% 0% 0% 0%)" } : false}
        animate={masked ? { clipPath: inView ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" } : undefined}
        transition={{ duration: 1.4, ease: EASE }}
      >
      <motion.div className="absolute -inset-y-[12%] inset-x-0 will-change-transform" style={{ y, scale }}>
        <div
          className={cn(
            "absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-expo)]",
            hoverZoom && "group-hover:scale-[1.07]",
          )}
        >
          <Photo src={src} alt={alt} sizes={sizes} priority={priority} tone={tone} />
        </div>
      </motion.div>
      </motion.div>
    </div>
  );
}

/** Foto statis dengan brand treatment (tanpa parallax), misal untuk preview hover. */
export function BrandImage({ src, alt, className, sizes = "40vw" }: { src: string; alt: string; className?: string; sizes?: string }) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Photo src={src} alt={alt} sizes={sizes} tone="brand" />
    </div>
  );
}
