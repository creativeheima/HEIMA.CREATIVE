import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { About } from "@/components/sections/About";
import { BigStatement } from "@/components/sections/BigStatement";
import { CallToAction } from "@/components/sections/CallToAction";
import { Clients } from "@/components/sections/Clients";
import { PageHero } from "@/components/sections/PageHero";
import { Process } from "@/components/sections/Process";
import { Stats } from "@/components/sections/Stats";
import { WhyHeima } from "@/components/sections/WhyHeima";
import { ParallaxImage } from "@/components/ui/BrandImage";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getProcessSteps, getProjects, getValues } from "@/content";
import { photos } from "@/lib/images";

export const metadata: Metadata = {
  title: "About",
  description:
    "HEIMA.CREATIVE adalah perusahaan IT di Yogyakarta yang menggabungkan teknologi, design, dan pemahaman bisnis untuk membangun solusi digital berdampak nyata.",
  alternates: { canonical: "/about" },
};

const pillars = [
  { title: "Technology", body: "Engineering yang solid: arsitektur bersih, kode teruji, dan infrastruktur yang andal." },
  { title: "Business", body: "Setiap keputusan teknis dikaitkan dengan tujuan bisnis dan indikator keberhasilan yang jelas." },
  { title: "Design", body: "Pengalaman pengguna yang sederhana, intuitif, dan konsisten dengan identitas brand Anda." },
];

export default async function AboutPage() {
  const [values, steps, projects] = await Promise.all([getValues(), getProcessSteps(), getProjects()]);
  return (
    <>
      <PageHero
        label="About — HEIMA.CREATIVE"
        lines={[
          "WE ARE",
          <span key="h">
            HEIMA<span className="text-signal">.</span>
          </span>,
        ]}
        description="Perusahaan IT yang menggabungkan teknologi, design, dan pemahaman bisnis untuk membangun solusi digital yang memberikan dampak nyata."
      />

      <section aria-label="Foto tim" className="bg-mist">
        <ParallaxImage src={photos.teamMeeting} alt="Tim HEIMA.CREATIVE dalam sesi perencanaan project" className="h-[70svh] w-full md:h-[90svh]" priority speed={1.3} />
      </section>

      <section aria-labelledby="mission-title" className="section-y bg-paper">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel index="01">Our mission</SectionLabel>
          </div>
          <div className="lg:col-span-9">
            <Reveal>
              <h2 id="mission-title" className="font-display text-[clamp(1.8rem,3.6vw,3.4rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-navy">
                Membantu bisnis di Indonesia bergerak lebih cepat dengan teknologi yang{" "}
                <span className="text-royal">tepat guna</span>, <span className="text-royal">scalable</span>, dan{" "}
                <span className="text-royal">mudah digunakan</span>
                <span className="text-signal">.</span>
              </h2>
            </Reveal>
            <div className="mt-20 grid gap-10 md:grid-cols-3">
              {pillars.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.1} className="border-t border-navy/15 pt-6">
                  <p className="meta text-signal">0{i + 1}</p>
                  <h3 className="mt-4 font-display text-2xl font-semibold tracking-[-0.02em] text-navy uppercase">{p.title}</h3>
                  <p className="mt-3 leading-relaxed text-steel">{p.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Stats dark />
      <About index="02" showLink={false} />
      <Clients projects={projects} />
      <WhyHeima values={values} index="03" />
      <Process steps={steps} index="04" />
      <BigStatement />
      <CallToAction />
    </>
  );
}
