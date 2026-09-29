import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHero } from "@/components/sections/PageHero";
import { TechMarquee } from "@/components/sections/TechMarquee";
import { ParallaxImage } from "@/components/ui/BrandImage";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getTechCategories } from "@/content";
import { photos } from "@/lib/images";

export const metadata: Metadata = {
  title: "Technology",
  description:
    "Stack teknologi HEIMA.CREATIVE: JavaScript, TypeScript, React, Next.js, Node.js, PHP, Laravel, Python, Flutter, React Native, PostgreSQL, MySQL, Docker, Cloud, dan API.",
  alternates: { canonical: "/technology" },
};

const principles = [
  { title: "Proven, not trendy", body: "Kami memilih teknologi yang matang, terdokumentasi baik, dan mudah dirawat dalam jangka panjang." },
  { title: "Secure by default", body: "Praktik keamanan diterapkan sejak awal: validasi, enkripsi, role-based access, dan audit." },
  { title: "Built to scale", body: "Arsitektur modular dan container-ready agar sistem tumbuh seiring bisnis Anda." },
  { title: "Measured performance", body: "Performa diukur, bukan ditebak — dari Core Web Vitals hingga waktu respons API." },
];

export default async function TechnologyPage() {
  const techCategories = await getTechCategories();
  const technologies = techCategories.flatMap((c) => c.items);
  return (
    <>
      <PageHero
        label="Technology — our stack"
        lines={[
          "POWERED BY",
          <span key="t">
            TECHNOLOGY<span className="text-signal">.</span>
          </span>,
        ]}
        description="Teknologi modern yang terbukti andal — dipilih berdasarkan kebutuhan bisnis, bukan tren."
      />

      <TechMarquee technologies={technologies} showHeader={false} />

      <section aria-labelledby="stack-title" className="section-y bg-mist">
        <div className="container-x">
          <div className="mb-16 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <SectionLabel index="01">Stack</SectionLabel>
            </div>
            <h2 id="stack-title" className="display-l text-navy lg:col-span-9">
              ONE STACK<span className="text-signal">.</span>
              <br />
              <span className="text-royal">EVERY LAYER.</span>
            </h2>
          </div>

          <ul className="border-t border-navy/15">
            {techCategories.map((c, i) => (
              <Reveal as="li" key={c.title} delay={i * 0.05} className="grid gap-6 border-b border-navy/15 py-10 md:grid-cols-12 md:py-14">
                <span className="meta text-signal md:col-span-1">{c.number}</span>
                <div className="md:col-span-4">
                  <h3 className="font-display text-[clamp(2rem,4vw,3.75rem)] leading-none font-bold tracking-[-0.04em] text-navy uppercase">{c.title}</h3>
                  <p className="mt-4 max-w-xs text-steel">{c.description}</p>
                </div>
                <ul className="flex flex-wrap content-start gap-x-8 gap-y-3 md:col-span-7">
                  {c.items.map((t) => (
                    <li key={t} className="font-display text-[clamp(1.4rem,2.4vw,2.25rem)] font-medium tracking-[-0.03em] text-navy/80">
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="section-y bg-paper">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index="02">Principles</SectionLabel>
            <h2 id="principles-title" className="display-m mt-8 text-navy">
              How we choose technology<span className="text-signal">.</span>
            </h2>
            <ParallaxImage src={photos.servers} alt="Infrastruktur server dan cloud" className="mt-12 aspect-[4/5] w-full" sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-40">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05} className="border-t border-navy/15 py-10">
                <p className="meta text-signal">0{i + 1}</p>
                <h3 className="mt-4 font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-semibold tracking-[-0.03em] text-navy uppercase">{p.title}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-steel">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CallToAction />
    </>
  );
}
