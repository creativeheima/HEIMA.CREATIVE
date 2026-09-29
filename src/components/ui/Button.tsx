import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/motion";
import { Magnetic } from "./Magnetic";

type Variant = "primary" | "accent" | "outline" | "outline-light" | "light";

const base =
  "group relative isolate inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-4 font-mono text-[0.72rem] font-medium tracking-[0.16em] uppercase transition-colors duration-500 ease-[var(--ease-expo)]";

const variants: Record<Variant, { root: string; fill: string }> = {
  primary: { root: "bg-navy text-paper hover:text-paper", fill: "bg-signal" },
  accent: { root: "bg-signal text-paper hover:text-navy", fill: "bg-paper" },
  outline: { root: "border border-navy/25 text-navy hover:text-paper hover:border-navy", fill: "bg-navy" },
  "outline-light": { root: "border border-paper/30 text-paper hover:text-navy hover:border-paper", fill: "bg-paper" },
  light: { root: "bg-paper text-navy hover:text-paper", fill: "bg-signal" },
};

type ButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  magnetic?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  external?: boolean;
};

/** Tombol premium dengan fill sweep & panah; otomatis magnetic di desktop. */
export function Button({
  href,
  children,
  variant = "primary",
  arrow = true,
  className,
  magnetic = true,
  type = "button",
  disabled,
  external,
}: ButtonProps) {
  const v = variants[variant];
  const inner = (
    <>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 translate-y-[101%] rounded-full transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0",
          v.fill,
        )}
      />
      <span>{children}</span>
      {arrow && (
        <span aria-hidden className="relative inline-flex h-3 w-4 overflow-hidden">
          <span className="absolute inset-0 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-full">→</span>
          <span className="absolute inset-0 -translate-x-full transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-0">→</span>
        </span>
      )}
    </>
  );

  const classes = cn(base, v.root, disabled && "pointer-events-none opacity-60", className);

  const el = href ? (
    external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {inner}
      </a>
    ) : (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    )
  ) : (
    <button type={type} disabled={disabled} className={classes}>
      {inner}
    </button>
  );

  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

/** Link teks dengan underline animasi. */
export function TextLink({ href, children, className, light }: { href: string; children: ReactNode; className?: string; light?: boolean }) {
  return (
    <Link
      href={href}
      className={cn("group meta inline-flex items-center gap-2", light ? "text-paper" : "text-navy", className)}
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-signal transition-transform duration-500 ease-[var(--ease-expo)] group-hover:origin-left group-hover:scale-x-100" />
      </span>
      <span aria-hidden className="text-signal transition-transform duration-500 group-hover:translate-x-1">→</span>
    </Link>
  );
}
