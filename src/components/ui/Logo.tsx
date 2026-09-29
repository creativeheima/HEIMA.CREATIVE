import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/motion";

type LogoProps = {
  /** "dark" = teks navy di latar terang, "light" = teks putih di latar gelap */
  tone?: "dark" | "light";
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
  onClick?: () => void;
};

/**
 * Logo resmi HEIMA.CREATIVE. Mark tidak pernah diubah warna/bentuk/proporsinya.
 * Di latar gelap, mark ditempatkan di atas chip putih agar tetap tampil sesuai aslinya.
 */
export function Logo({ tone = "dark", className, markClassName, showWordmark = true, onClick }: LogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="HEIMA.CREATIVE — kembali ke beranda"
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <span
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center",
          tone === "light" && "rounded-lg bg-paper px-1.5 py-1",
        )}
      >
        <Image
          src="/brand/heima-mark.png"
          alt=""
          width={526}
          height={362}
          priority
          className={cn("h-8 w-auto", markClassName)}
        />
      </span>
      {showWordmark && (
        <span
          className={cn(
            "font-display text-[1.05rem] font-bold tracking-[-0.02em] whitespace-nowrap",
            tone === "light" ? "text-paper" : "text-navy",
          )}
        >
          HEIMA<span className="text-signal">.</span>CREATIVE
        </span>
      )}
    </Link>
  );
}
