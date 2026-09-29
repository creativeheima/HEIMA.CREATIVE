"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useParallaxIntensity } from "@/hooks/useMotionPrefs";

type ParallaxProps = {
  children?: ReactNode;
  /** 0 = diam, 0.1 = background lambat, 0.35 = middle, 0.65+ = foreground cepat. Negatif = arah berlawanan */
  speed?: number;
  axis?: "x" | "y";
  className?: string;
};

/** Pergerakan elemen berdasarkan posisi scroll relatif terhadap viewport. */
export function Parallax({ children, speed = 0.2, axis = "y", className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const offset = useParallaxOffset(scrollYProgress, speed);

  return (
    <motion.div ref={ref} className={className} style={axis === "y" ? { y: offset } : { x: offset }}>
      {children}
    </motion.div>
  );
}

/** Mengubah progress 0→1 menjadi offset px sesuai intensitas perangkat. */
export function useParallaxOffset(progress: MotionValue<number>, speed: number, distance = 320) {
  const k = useParallaxIntensity();
  const range = speed * distance * k;
  return useTransform(progress, [0, 1], [range, -range]);
}
