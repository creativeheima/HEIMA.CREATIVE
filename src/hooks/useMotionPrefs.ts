"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export type Device = "mobile" | "tablet" | "desktop";

function readDevice(): Device {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

export function useDevice(): Device {
  const [device, setDevice] = useState<Device>("desktop");
  useEffect(() => {
    const update = () => setDevice(readDevice());
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);
  return device;
}

/**
 * Faktor intensitas parallax: desktop 1, tablet 0.55, mobile 0.3, reduced-motion 0.
 */
export function useParallaxIntensity() {
  const reduced = useReducedMotion();
  const device = useDevice();
  if (reduced) return 0;
  return device === "desktop" ? 1 : device === "tablet" ? 0.55 : 0.3;
}

/** true bila perangkat punya pointer halus (mouse) — untuk cursor & magnetic. */
export function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine;
}
