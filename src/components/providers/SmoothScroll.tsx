"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

/**
 * Smooth scrolling berbasis Lenis yang disinkronkan dengan GSAP ScrollTrigger.
 * Otomatis nonaktif untuk pengguna `prefers-reduced-motion`.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // Reset posisi scroll setiap pindah halaman (atau lompat ke #anchor bila ada)
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) lenis?.scrollTo(0, { immediate: true, force: true });
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
      const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      if (target) {
        if (lenis) lenis.scrollTo(target, { offset: -96, duration: 1.4 });
        else target.scrollIntoView({ behavior: "smooth" });
      }
    }, 450);
    return () => window.clearTimeout(id);
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
