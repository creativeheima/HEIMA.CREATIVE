"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_IN_OUT } from "@/lib/motion";

/**
 * Page transition: tirai navy menyingkap halaman baru setiap navigasi.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <>
      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[150] flex items-center justify-center bg-navy"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.9, ease: EASE_IN_OUT, delay: 0.15 }}
        >
          <motion.span
            className="font-display text-2xl font-bold tracking-[-0.02em] text-paper"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            HEIMA<span className="text-signal">.</span>CREATIVE
          </motion.span>
        </motion.div>
      )}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
      >
        {children}
      </motion.div>
    </>
  );
}
