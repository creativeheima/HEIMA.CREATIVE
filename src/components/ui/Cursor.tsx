"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useFinePointer } from "@/hooks/useMotionPrefs";

type Mode = "default" | "hover" | "view" | "hidden";

const SCALE: Record<Mode, number> = { default: 0.12, hover: 0.56, view: 1, hidden: 0 };

/**
 * Custom cursor desktop.
 * - default: lingkaran kecil
 * - `a`, `button`, `[data-cursor="hover"]`: membesar
 * - `[data-cursor="view"]`: lingkaran besar dengan label (default "VIEW →")
 * Otomatis nonaktif di perangkat sentuh.
 */
export function Cursor() {
  const fine = useFinePointer();
  const pathname = usePathname();
  const [mode, setMode] = useState<Mode>("default");
  const [label, setLabel] = useState("VIEW →");
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });

  useEffect(() => {
    if (!fine) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);

      const target = e.target as Element | null;
      const el = target?.closest?.("[data-cursor], a, button, input, textarea, select, label");
      if (!el) return setMode("default");
      const kind = el.getAttribute("data-cursor");
      if (kind === "view") {
        setLabel(el.getAttribute("data-cursor-label") ?? "VIEW →");
        setMode("view");
      } else if (kind === "hide" || el.matches("input, textarea, select")) {
        setMode("hidden");
      } else {
        setMode("hover");
      }
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [fine, x, y]);

  // Kembali ke default setelah pindah halaman
  useEffect(() => setMode("default"), [pathname]);

  if (!fine) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[200]"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="absolute -top-12 -left-12 flex h-24 w-24 items-center justify-center rounded-full"
        initial={false}
        animate={{
          scale: visible ? SCALE[mode] : 0,
          backgroundColor: mode === "hover" ? "rgba(235,119,44,0.14)" : "rgba(235,119,44,1)",
          borderColor: "rgba(235,119,44,1)",
        }}
        style={{ borderWidth: mode === "hover" ? 2 : 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      />
      <AnimatePresence>
        {mode === "view" && visible && (
          <motion.span
            key={label}
            className="meta absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-paper"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.25 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
