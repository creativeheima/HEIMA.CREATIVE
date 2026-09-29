"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation } from "@/data/site";
import { useSiteSettings } from "@/components/providers/SiteSettings";
import { useLenis } from "@/components/providers/SmoothScroll";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { cn, EASE } from "@/lib/motion";

export function Navbar() {
  const pathname = usePathname();
  const lenis = useLenis();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  // Kunci scroll saat menu mobile terbuka
  useEffect(() => {
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
  }, [open, lenis]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter,padding] duration-500 ease-[var(--ease-expo)]",
          scrolled && !open
            ? "border-b border-navy/10 bg-paper/75 py-3 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent py-5 md:py-7",
        )}
      >
        <div className="container-x flex items-center justify-between gap-6">
          <Logo tone={open ? "light" : "dark"} className="relative z-10" onClick={() => setOpen(false)} />

          <nav aria-label="Navigasi utama" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="group meta relative block px-3.5 py-2 text-navy"
                  >
                    <span className="relative block overflow-hidden">
                      <span className="block transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-full">
                        {item.label}
                      </span>
                      <span className="absolute inset-0 translate-y-full text-royal transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0">
                        {item.label}
                      </span>
                    </span>
                    {isActive(item.href) && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-signal"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <Button href="/contact" variant="primary" className="!px-6 !py-3">
                Let&apos;s Talk
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Tutup menu" : "Buka menu"}
              className={cn(
                "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border transition-colors duration-500 lg:hidden",
                open ? "border-paper/30" : "border-navy/20",
              )}
            >
              <span className="relative block h-3 w-5">
                <span
                  className={cn(
                    "absolute left-0 h-[1.5px] w-full transition-all duration-500 ease-[var(--ease-expo)]",
                    open ? "top-1/2 rotate-45 bg-paper" : "top-0 bg-navy",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 h-[1.5px] w-full transition-all duration-500 ease-[var(--ease-expo)]",
                    open ? "top-1/2 -rotate-45 bg-paper" : "top-full bg-navy",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>{open && <MobileMenu isActive={isActive} onNavigate={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}

function MobileMenu({ isActive, onNavigate }: { isActive: (href: string) => boolean; onNavigate: () => void }) {
  const site = useSiteSettings();
  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu navigasi"
      className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-abyss text-paper lg:hidden"
      initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{ duration: 0.8, ease: EASE }}
      data-lenis-prevent
    >
      <div className="container-x flex flex-1 flex-col justify-between pt-32 pb-10">
        <nav aria-label="Navigasi mobile">
          <ul className="space-y-1">
            {navigation.map((item, i) => (
              <li key={item.href} className="overflow-hidden">
                <motion.div
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "110%" }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.06 }}
                >
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className="flex items-baseline gap-4 py-1 font-display text-[clamp(2.5rem,11vw,4.5rem)] leading-none font-bold tracking-[-0.04em]"
                  >
                    <span className="meta text-paper/40">0{i + 1}</span>
                    <span className={isActive(item.href) ? "text-signal" : "text-paper"}>{item.label}</span>
                  </Link>
                </motion.div>
              </li>
            ))}
          </ul>
        </nav>

        <motion.div
          className="mt-12 space-y-6 border-t border-paper/15 pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <a href={`mailto:${site.contact.email}`} className="block font-display text-xl">
            {site.contact.email}
          </a>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="meta text-paper/60 hover:text-paper">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <Button href="/contact" variant="accent" magnetic={false}>
            Let&apos;s Talk
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
