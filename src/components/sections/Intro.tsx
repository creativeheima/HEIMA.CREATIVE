"use client";

import { Parallax } from "@/components/motion/Parallax";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import { ScrollText } from "@/components/motion/ScrollText";
import { TextLink } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CircuitLines } from "@/components/visuals/Patterns";

export function Intro() {
  return (
    <section aria-labelledby="intro-title" className="section-y relative overflow-hidden bg-paper">
      <Parallax speed={0.3} className="pointer-events-none absolute top-[18%] -right-[10%] h-40 w-[60%] opacity-20">
        <CircuitLines flow={false} mirror />
      </Parallax>

      <div className="container-x relative grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <SectionLabel index="01">Introduction</SectionLabel>
        </div>

        <div className="lg:col-span-9">
          <RevealText
            id="intro-title"
            className="display-l text-navy lg:!text-[clamp(3rem,5.6vw,6.25rem)]"
            lines={[
              "WE TURN TECHNOLOGY",
              <span key="b">
                INTO <span className="text-royal">BUSINESS VALUE</span>
                <span className="text-signal">.</span>
              </span>,
            ]}
          />

          <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-9">
            <div className="md:col-span-6">
              <ScrollText
                className="font-display text-[clamp(1.4rem,2.6vw,2.4rem)] leading-[1.2] font-medium tracking-[-0.02em] text-navy"
                text="HEIMA.CREATIVE membantu bisnis memanfaatkan teknologi untuk membangun solusi digital yang efektif, scalable, dan mudah digunakan."
              />
            </div>
            <Reveal className="flex flex-col justify-end gap-8 md:col-span-3" delay={0.2}>
              <p className="leading-relaxed text-steel">
                Dari website perusahaan hingga sistem informasi yang kompleks — kami menggabungkan engineering, desain, dan
                pemahaman bisnis dalam satu tim.
              </p>
              <TextLink href="/about">About HEIMA</TextLink>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
