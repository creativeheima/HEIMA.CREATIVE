import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHero } from "@/components/sections/PageHero";
import { Process } from "@/components/sections/Process";
import { ServicesList } from "@/components/sections/ServicesList";
import { ParallaxImage } from "@/components/ui/BrandImage";
import { Button } from "@/components/ui/Button";
import { getProcessSteps, getServices } from "@/content";
import { cn } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Website development, mobile app, custom software, system development, UI/UX design, digital transformation, IT consulting, serta maintenance & support.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const [services, steps] = await Promise.all([getServices(), getProcessSteps()]);
  return (
    <>
      <PageHero
        label={`Services — ${String(services.length).padStart(2, "0")} disciplines`}
        lines={[
          "WHAT",
          <span key="w">
            WE DO<span className="text-signal">.</span>
          </span>,
        ]}
        description="Layanan end-to-end untuk membangun, mengembangkan, dan merawat solusi digital bisnis Anda — dikerjakan oleh satu tim yang memahami teknologi sekaligus bisnis."
        aside={<Button href="/contact">Discuss your project</Button>}
      />

      <ServicesList services={services} showHeader={false} />

      <section aria-label="Detail layanan" className="bg-paper pb-[clamp(6rem,14vw,13rem)]">
        <div className="container-x space-y-28 md:space-y-40">
          {services.map((s, i) => (
            <article key={s.slug} id={s.slug} className="grid scroll-mt-28 items-center gap-10 md:grid-cols-12 md:gap-12">
              <div className={cn("md:col-span-6", i % 2 === 1 && "md:order-2 md:col-start-7")}>
                <ParallaxImage src={s.image} alt={`${s.title} oleh HEIMA.CREATIVE`} className="aspect-[4/3] w-full" sizes="(min-width: 768px) 50vw, 100vw" />
              </div>
              <Reveal className={cn("md:col-span-5", i % 2 === 1 ? "md:order-1 md:col-start-1" : "md:col-start-8")}>
                <p className="meta text-signal">
                  {s.number} — {s.category}
                </p>
                <h2 className="display-m mt-5 text-navy uppercase">{s.title}</h2>
                <p className="mt-6 text-lg leading-relaxed text-steel">{s.summary}</p>
                <ul className="mt-8 border-t border-navy/10">
                  {s.capabilities.map((c) => (
                    <li key={c} className="flex items-center justify-between border-b border-navy/10 py-3.5 text-navy">
                      {c}
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-royal/50" />
                    </li>
                  ))}
                </ul>
              </Reveal>
            </article>
          ))}
        </div>
      </section>

      <Process steps={steps} index="02" />
      <CallToAction />
    </>
  );
}
