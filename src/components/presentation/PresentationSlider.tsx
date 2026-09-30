"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn, EASE } from "@/lib/motion";

export type SlideItem = {
  id: string;
  label: string;
  title: string;
  component: ReactNode;
  dark?: boolean;
};

interface PresentationSliderProps {
  slides: SlideItem[];
}

export function PresentationSlider({ slides }: PresentationSliderProps) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  const total = slides.length;

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimatingRef.current) return;
      const target = Math.max(0, Math.min(index, total - 1));
      if (target === current) return;

      isAnimatingRef.current = true;
      setAnimating(true);
      setCurrent(target);

      // Update URL hash jika sesuai slide
      if (slides[target]?.id && typeof window !== "undefined") {
        window.history.replaceState(null, "", `#${slides[target].id}`);
      }

      window.setTimeout(() => {
        isAnimatingRef.current = false;
        setAnimating(false);
      }, 750);
    },
    [current, total, slides]
  );

  const nextSlide = useCallback(() => {
    if (current < total - 1) {
      goToSlide(current + 1);
    }
  }, [current, total, goToSlide]);

  const prevSlide = useCallback(() => {
    if (current > 0) {
      goToSlide(current - 1);
    }
  }, [current, goToSlide]);

  // Cek anchor hash awal saat pertama dibuka
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const idx = slides.findIndex((s) => s.id === hash);
    if (idx !== -1) {
      setCurrent(idx);
    }
  }, [slides]);

  // Handle Wheel Scroll (1 scroll = 1 slide)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Abaikan jika sedang animasi
      if (isAnimatingRef.current) {
        e.preventDefault();
        return;
      }

      // Cek apakah scroll di dalam element internal yang punya overflow scroll
      const target = e.target as HTMLElement;
      const scrollableParent = target.closest(".slide-scrollable");
      if (scrollableParent) {
        const { scrollTop, scrollHeight, clientHeight } = scrollableParent;
        const atTop = scrollTop <= 0;
        const atBottom = scrollTop + clientHeight >= scrollHeight - 2;

        if (e.deltaY > 0 && !atBottom) return; // biarkan scroll isi dalam ke bawah
        if (e.deltaY < 0 && !atTop) return; // biarkan scroll isi dalam ke atas
      }

      if (Math.abs(e.deltaY) > 20) {
        e.preventDefault();
        if (e.deltaY > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    };

    const node = sliderRef.current;
    if (node) {
      node.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (node) {
        node.removeEventListener("wheel", handleWheel);
      }
    };
  }, [nextSlide, prevSlide]);

  // Handle Touch Gestures (Mobile Swipe)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null || isAnimatingRef.current) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartY.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Jangan ganggu jika user mengetik di input/textarea
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "Home") {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goToSlide(total - 1);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextSlide, prevSlide, goToSlide, total]);

  const activeSlide = slides[current];
  const isDark = activeSlide?.dark;

  return (
    <div
      ref={sliderRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      data-lenis-prevent
      className="relative h-[100svh] w-full overflow-hidden bg-paper select-none"
    >
      {/* Container Slide Tracks */}
      <div
        className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
        style={{ transform: `translateY(-${current * 100}%)` }}
      >
        {slides.map((slide, idx) => {
          return (
            <div
              key={slide.id}
              id={slide.id}
              className={cn(
                "relative h-[100svh] w-full shrink-0 overflow-hidden flex flex-col",
                slide.dark ? "bg-abyss text-paper" : "bg-paper text-navy"
              )}
            >
              {/* Konten Slide dengan padding atas untuk memberi ruang Navbar */}
              <div className="slide-scrollable h-full w-full overflow-y-auto overflow-x-hidden pt-20 sm:pt-24 pb-12 sm:pb-16 flex flex-col">
                <div className="w-full my-auto">{slide.component}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Side Page Indicator (Panel Halaman Kanan) */}
      <aside
        aria-label="Navigasi Halaman Slide"
        className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-[100] flex flex-col items-end gap-3 pointer-events-auto"
      >
        {/* Nomor Halaman & Judul Slide Aktif */}
        <div
          className={cn(
            "flex flex-col items-end transition-colors duration-500",
            isDark ? "text-paper" : "text-navy"
          )}
        >
          <div className="flex items-baseline gap-1 font-mono text-xs sm:text-sm font-semibold tracking-wider">
            <span className="text-signal font-bold text-sm sm:text-base">
              {String(current + 1).padStart(2, "0")}
            </span>
            <span className="opacity-40">/</span>
            <span className="opacity-60">{String(total).padStart(2, "0")}</span>
          </div>
          <span className="hidden md:block font-mono text-[10px] tracking-widest uppercase opacity-70 mt-0.5">
            {activeSlide?.title}
          </span>
        </div>

        {/* Dots Navigation (Klik untuk lompat langsung ke slide tertentu) */}
        <div className="flex flex-col items-center gap-1.5 py-2">
          {slides.map((s, i) => {
            const isDotActive = i === current;
            return (
              <button
                key={s.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(i);
                }}
                aria-label={`Buka slide ${i + 1}: ${s.title}`}
                title={`${String(i + 1).padStart(2, "0")} — ${s.title}`}
                className="group relative flex items-center justify-center p-1 cursor-pointer focus:outline-none"
              >
                {/* Tooltip Judul Slide di Hover */}
                <span className="pointer-events-none absolute right-full mr-3 hidden rounded bg-navy/90 px-2.5 py-1 text-[11px] font-medium tracking-wide text-paper opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:opacity-100 md:block whitespace-nowrap">
                  {String(i + 1).padStart(2, "0")} · {s.title}
                </span>

                {/* Indikator Dot */}
                <span
                  className={cn(
                    "block rounded-full transition-all duration-500",
                    isDotActive
                      ? "h-6 w-2 bg-signal shadow-[0_0_12px_rgba(235,119,44,0.6)]"
                      : cn(
                          "h-2 w-2 group-hover:scale-125",
                          isDark ? "bg-paper/30 group-hover:bg-paper" : "bg-navy/20 group-hover:bg-navy/60"
                        )
                  )}
                />
              </button>
            );
          })}
        </div>
      </aside>

      {/* Floating Bottom Next / Prev Controls */}
      <div
        className={cn(
          "fixed bottom-5 right-3 sm:right-6 z-[100] flex items-center gap-2",
          isDark ? "text-paper" : "text-navy"
        )}
      >
        <button
          type="button"
          onClick={prevSlide}
          disabled={current === 0}
          aria-label="Slide sebelumnya"
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold transition-all duration-300 backdrop-blur-md cursor-pointer",
            current === 0
              ? "opacity-20 cursor-not-allowed border-transparent"
              : cn(
                  "hover:scale-110 active:scale-95 shadow-md",
                  isDark
                    ? "border-paper/20 bg-abyss/60 hover:bg-paper hover:text-abyss"
                    : "border-navy/15 bg-paper/80 hover:bg-navy hover:text-paper"
                )
          )}
        >
          ▲
        </button>
        <button
          type="button"
          onClick={nextSlide}
          disabled={current === total - 1}
          aria-label="Slide berikutnya"
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold transition-all duration-300 backdrop-blur-md cursor-pointer",
            current === total - 1
              ? "opacity-20 cursor-not-allowed border-transparent"
              : cn(
                  "hover:scale-110 active:scale-95 shadow-md",
                  isDark
                    ? "border-paper/20 bg-abyss/60 hover:bg-paper hover:text-abyss"
                    : "border-navy/15 bg-paper/80 hover:bg-navy hover:text-paper"
                )
          )}
        >
          ▼
        </button>
      </div>

      {/* Bottom Left Status Bar (Glass Pill) */}
      <div className="fixed bottom-4 left-4 sm:left-8 z-[100] hidden sm:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-paper/80 dark:bg-abyss/80 backdrop-blur-md border border-navy/10 dark:border-paper/10 shadow-sm pointer-events-none">
        <span className={cn("meta text-[10px] tracking-widest uppercase transition-colors duration-500", isDark ? "text-paper/70" : "text-navy")}>
          Slide <span className="text-signal font-bold">{String(current + 1).padStart(2, "0")}</span> / {String(total).padStart(2, "0")} · {activeSlide?.title}
        </span>
        <span className="h-1 w-1 rounded-full bg-signal" />
        <span className={cn("meta text-[10px] opacity-50 transition-colors duration-500", isDark ? "text-paper" : "text-navy")}>
          Scroll / Panah
        </span>
      </div>
    </div>
  );
}
