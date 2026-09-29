import { cn } from "@/lib/motion";

/** Label metadata section, mis. "(03) — What we do". */
export function SectionLabel({ index, children, light, className }: { index?: string; children: React.ReactNode; light?: boolean; className?: string }) {
  return (
    <p className={cn("meta flex items-center gap-3", light ? "text-paper/60" : "text-steel", className)}>
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
      {index && <span className={light ? "text-paper" : "text-navy"}>({index})</span>}
      <span>{children}</span>
    </p>
  );
}
