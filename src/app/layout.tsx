import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { getSettings } from "@/content";
import { siteConfig } from "@/data/site";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-space", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-jetbrains", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const { description } = await getSettings();
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: "HEIMA.CREATIVE — IT & Digital Solutions",
      template: "%s — HEIMA.CREATIVE",
    },
    description,
    applicationName: siteConfig.name,
    keywords: [
      "perusahaan IT Magelang",
      "jasa pembuatan website",
      "jasa pembuatan aplikasi",
      "custom software",
      "sistem informasi",
      "UI/UX design",
      "digital transformation",
      "HEIMA.CREATIVE",
    ],
    authors: [{ name: siteConfig.name }],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: "HEIMA.CREATIVE — We Build Digital Solutions",
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: "HEIMA.CREATIVE — We Build Digital Solutions",
      description,
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#213C6D",
  width: "device-width",
  initialScale: 1,
};

/** Root layout minimal — dipakai website `(site)` dan Sanity Studio `/studio`. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
