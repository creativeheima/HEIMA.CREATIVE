import { AirTouch } from "@/components/gesture/AirTouch";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SiteSettingsProvider } from "@/components/providers/SiteSettings";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { getSettings } from "@/content";
import { siteConfig } from "@/data/site";
import "../globals.css";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/brand/heima-logo-original.png`,
    description: settings.description,
    email: settings.contact.email,
    telephone: settings.contact.phone,
    address: { "@type": "PostalAddress", addressLocality: "Yogyakarta", addressCountry: "ID" },
    sameAs: settings.socials.map((s) => s.href),
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-paper text-ink">
      <a
        href="#main"
        className="meta fixed top-4 left-4 z-[300] -translate-y-24 rounded-full bg-navy px-5 py-3 text-paper focus:translate-y-0"
      >
        Skip to content
      </a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />
      <SiteSettingsProvider value={settings}>
        <SmoothScroll>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <Cursor />
          <AirTouch />
        </SmoothScroll>
      </SiteSettingsProvider>
    </div>
  );
}
