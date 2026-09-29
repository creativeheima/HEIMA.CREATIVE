"use client";

import { Parallax } from "@/components/motion/Parallax";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/ui/BrandImage";
import { TextLink } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { photos } from "@/lib/images";

export function About({ index = "06", showLink = true }: { index?: string; showLink?: boolean }) {
  return (
    <section aria-labelledby="about-title" className="section-y relative overflow-hidden bg-paper">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel index={index}>About</SectionLabel>
          </div>
          <div className="lg:col-span-9">
            <RevealText
              id="about-title"
              className="display-xl text-navy"
              lines={[
                "WE ARE",
                <span key="h">
                  HEIMA<span className="text-signal">.</span>
                  <span className="text-royal">CREATIVE</span>
                </span>,
              ]}
            />
          </div>
        </div>

        <div className="mt-20 grid grid-cols-12 gap-6 md:mt-28 md:gap-8">
          {/* Kolase gambar dengan kecepatan parallax berbeda */}
          <Parallax speed={0.06} className="col-span-12 md:col-span-7">
            <ParallaxImage src={photos.team} alt="Tim HEIMA.CREATIVE berdiskusi di ruang kerja" className="aspect-[4/3] w-full" sizes="(min-width: 768px) 58vw, 100vw" />
            <p className="meta mt-4 text-steel">Team — Collaboration</p>
          </Parallax>

          <div className="col-span-12 flex flex-col justify-between gap-12 md:col-span-5">
            <Reveal>
              <p className="font-display text-[clamp(1.35rem,2vw,1.85rem)] leading-[1.3] font-medium tracking-[-0.015em] text-navy">
                HEIMA.CREATIVE adalah perusahaan IT yang menggabungkan teknologi, design, dan pemahaman bisnis untuk
                membangun solusi digital yang memberikan dampak nyata.
              </p>
              <p className="mt-6 leading-relaxed text-steel">
                Berbasis di Yogyakarta, kami bekerja bersama perusahaan, institusi, dan startup untuk merancang, membangun,
                dan merawat produk digital yang menjadi tulang punggung operasional mereka.
              </p>
              {showLink && <TextLink href="/about" className="mt-8">More about us</TextLink>}
            </Reveal>
            <Parallax speed={0.3}>
              <ParallaxImage src={photos.workspace} alt="Workspace HEIMA.CREATIVE" className="aspect-[5/4] w-full" sizes="(min-width: 768px) 40vw, 100vw" />
              <p className="meta mt-4 text-steel">Workspace — Yogyakarta</p>
            </Parallax>
          </div>

          <Parallax speed={0.18} className="col-span-7 col-start-2 md:col-span-4 md:col-start-2 md:-mt-10">
            <ParallaxImage src={photos.circuit} alt="Detail teknologi dan perangkat keras" className="aspect-square w-full" sizes="(min-width: 768px) 33vw, 60vw" />
            <p className="meta mt-4 text-steel">Technology</p>
          </Parallax>
          <Parallax speed={0.42} className="col-span-8 col-start-5 md:col-span-4 md:col-start-8 md:mt-24">
            <ParallaxImage src={photos.network} alt="Lingkungan digital dan jaringan global" className="aspect-[4/5] w-full" sizes="(min-width: 768px) 33vw, 66vw" />
            <p className="meta mt-4 text-steel">Digital environment</p>
          </Parallax>
        </div>
      </div>
    </section>
  );
}
