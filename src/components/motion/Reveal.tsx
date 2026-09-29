"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { EASE } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "p" | "li" | "span" | "section" | "article";
  amount?: number;
};

/** Fade + slide up saat masuk viewport. */
export function Reveal({ children, delay = 0, y = 40, className, as = "div", amount = 0.3 }: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = motion[as] as ElementType;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: reduced ? 0.3 : 1, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

type RevealTextProps = {
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** animasi langsung saat mount (untuk hero), bukan saat masuk viewport */
  immediate?: boolean;
  id?: string;
};

/** Text mask reveal: setiap baris naik dari balik mask. */
export function RevealText({
  lines,
  as = "h2",
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  immediate = false,
  id,
}: RevealTextProps) {
  const reduced = useReducedMotion();
  const Tag = as as ElementType;
  const trigger = immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, amount: 0.4 } };

  return (
    <Tag className={className} id={id}>
      <motion.span className="block" initial="hidden" {...trigger}>
        {lines.map((line, i) => (
          <span key={i} className={"block overflow-hidden pb-[0.08em] -mb-[0.08em] " + (lineClassName ?? "")}>
            <motion.span
              className="block will-change-transform"
              variants={{
                hidden: reduced ? { opacity: 0 } : { y: "110%", rotate: 2 },
                show: reduced ? { opacity: 1 } : { y: "0%", rotate: 0 },
              }}
              transition={{ duration: 1.15, ease: EASE, delay: delay + i * stagger }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
