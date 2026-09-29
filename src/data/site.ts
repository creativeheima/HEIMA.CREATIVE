import type { SiteSettings } from "@/content/types";

/** Konfigurasi statis (tidak diedit lewat CMS). */
export const siteConfig = {
  name: "HEIMA.CREATIVE",
  shortName: "HEIMA",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://heimacreative.com").replace(/\/$/, ""),
  year: 2026,
} as const;

export const navigation = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Technology", href: "/technology" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * Konten fallback — dipakai selama Sanity belum dihubungkan,
 * sekaligus menjadi data awal saat `npm run sanity:seed`.
 * CATATAN: kontak & alamat masih placeholder.
 */
export const fallbackSettings: SiteSettings = {
  tagline: "IT & Digital Solutions",
  description:
    "HEIMA.CREATIVE adalah perusahaan IT di Yogyakarta yang membangun website, aplikasi mobile, custom software, dan sistem informasi untuk membantu bisnis bergerak maju.",
  location: "Yogyakarta — Indonesia",
  contact: {
    email: "hello@heimacreative.com",
    phone: "+62 812 0000 0000",
    phoneHref: "tel:+6281200000000",
    whatsapp: "+62 812 0000 0000",
    whatsappHref: "https://wa.me/6281200000000",
    address: "Jl. Contoh No. 00, Sleman, Daerah Istimewa Yogyakarta 55281",
    hours: "Senin — Jumat, 09.00 — 18.00 WIB",
  },
  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
    { label: "Facebook", href: "https://facebook.com/" },
    { label: "YouTube", href: "https://youtube.com/" },
  ],
  stats: [
    { value: 10, suffix: "+", label: "Projects" },
    { value: 5, suffix: "+", label: "Years Experience" },
    { value: 20, suffix: "+", label: "Clients" },
    { value: 24, suffix: "/7", label: "Support" },
  ],
};
