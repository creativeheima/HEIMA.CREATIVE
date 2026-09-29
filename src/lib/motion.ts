/** Motion language HEIMA.CREATIVE — lihat DESIGN-SYSTEM.md §5 */
export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

/** Kecepatan layer parallax: background lambat → foreground cepat */
export const DEPTH = {
  background: 0.12,
  middle: 0.35,
  foreground: 0.65,
} as const;

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
