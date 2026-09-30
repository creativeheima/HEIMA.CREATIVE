"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue, type MotionValue } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/ui/BrandImage";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useParallaxIntensity } from "@/hooks/useMotionPrefs";
import { photos } from "@/lib/images";
import { EASE } from "@/lib/motion";

const ABOUT_ITEMS = [
  {
    category: "TEAM",
    title: "ENGINEERING & COLLABORATION",
    subtitle: "Talenta berdedikasi membangun solusi tangguh & scalable.",
    image: photos.team,
    alt: "Tim HEIMA.CREATIVE berdiskusi di ruang kerja",
    tags: ["TEAM", "COLLABORATION", "CULTURE"],
  },
  {
    category: "WORKSPACE",
    title: "MAGELANG HQ & STUDIO",
    subtitle: "Pusat inovasi digital, riset arsitektur & pengembangan.",
    image: photos.workspace,
    alt: "Workspace HEIMA.CREATIVE di Magelang",
    tags: ["MAGELANG", "HQ", "WORKSPACE"],
  },
  {
    category: "TECHNOLOGY",
    title: "SYSTEM & INFRASTRUCTURE",
    subtitle: "Standar kode modern, teruji, andal dan berperforma tinggi.",
    image: photos.circuit,
    alt: "Detail teknologi dan arsitektur perangkat lunak",
    tags: ["ARCHITECTURE", "MODERN TECH", "PERFORMANCE"],
  },
  {
    category: "ECOSYSTEM",
    title: "DIGITAL TRANSFORMATION",
    subtitle: "Menghubungkan ekosistem digital bisnis secara menyeluruh.",
    image: photos.network,
    alt: "Lingkungan digital dan integrasi jaringan",
    tags: ["ECOSYSTEM", "TRANSFORMATION", "SUPPORT"],
  },
];

function AboutCard({
  item,
  layoutIndex = 0,
  progress,
}: {
  item: (typeof ABOUT_ITEMS)[number];
  layoutIndex?: number;
  progress?: MotionValue<number>;
}) {
  const k = useParallaxIntensity();

  // Pola pergeseran parallax dinamis saat scroll (staggered per kolom)
  const parallaxSpeeds = [
    [50, -50],
    [-40, 40],
    [60, -60],
    [-35, 35],
  ];
  const [startOffset, endOffset] = parallaxSpeeds[layoutIndex % 4];

  const fallbackProgress = useMotionValue(0.5);
  const activeProgress = progress || fallbackProgress;

  const rawY = useTransform(
    activeProgress,
    [0, 1],
    [startOffset * k, endOffset * k]
  );
  const smoothY = useSpring(rawY, { stiffness: 90, damping: 22, mass: 0.5 });
  const y = progress ? smoothY : undefined;

  return (
    <motion.article
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.85, ease: EASE, delay: (layoutIndex % 4) * 0.08 }}
      style={{ y }}
      className="h-full flex flex-col will-change-transform"
    >
      <div
        className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-3xl border border-navy/10 bg-paper p-5 sm:p-6 shadow-[0_6px_30px_rgba(33,60,109,0.06)] transition-all duration-500 ease-[var(--ease-expo)] hover:-translate-y-2 hover:border-navy/25 hover:shadow-[0_24px_50px_rgba(33,60,109,0.15)]"
      >
        {/* Bagian Atas: Cover Foto Square Besar */}
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-mist shadow-inner">
            <ParallaxImage
              src={item.image}
              alt={item.alt}
              className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-105"
              sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
              hoverZoom
            />
            {/* Badge Kategori */}
            <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
              <span className="meta rounded-full bg-paper/95 px-3 py-1 text-[11px] font-bold text-navy shadow-sm backdrop-blur">
                {item.category}
              </span>
            </div>
          </div>

          {/* Judul & Subtitle */}
          <div className="mt-5">
            <h3 className="font-display text-xl md:text-2xl font-bold uppercase leading-snug tracking-[-0.02em] text-navy transition-colors duration-300 group-hover:text-royal line-clamp-2">
              {item.title}
            </h3>
            <p className="mt-1.5 text-sm sm:text-base font-medium text-steel">
              {item.subtitle}
            </p>
          </div>
        </div>

        {/* Bagian Bawah: Tag Pills Kapsul */}
        <div className="mt-6 pt-2 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="meta rounded-full border border-navy/12 bg-mist/60 px-3.5 py-1.5 text-xs font-medium text-navy/80 transition-colors group-hover:border-navy/25 group-hover:bg-paper"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export function About({
  index = "06",
  showLink = true,
}: {
  index?: string;
  showLink?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-title"
      className="section-y relative overflow-hidden bg-paper"
    >
      {/* Container Luas (Full Width Spanning) */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10">
        {/* Header Section */}
        <div className="mb-8 grid gap-6 md:mb-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel index={index}>About</SectionLabel>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-9 lg:flex-row lg:items-end lg:justify-between">
            <RevealText
              id="about-title"
              className="display-m font-bold text-navy"
              lines={[
                "WE ARE",
                <span key="h">
                  HEIMA<span className="text-signal">.</span>
                  <span className="text-royal">CREATIVE</span>
                </span>,
              ]}
            />
            <Reveal className="max-w-md text-base text-steel" delay={0.2}>
              HEIMA.CREATIVE adalah perusahaan IT yang menggabungkan teknologi, design, dan pemahaman bisnis untuk membangun solusi digital yang memberikan dampak nyata.
            </Reveal>
          </div>
        </div>

        {/* 4-Column Card Grid dengan Scroll Parallax Shifting */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-6 xl:gap-8 pt-4 pb-10">
          {ABOUT_ITEMS.map((item, i) => (
            <AboutCard
              key={item.category}
              item={item}
              layoutIndex={i}
              progress={scrollYProgress}
            />
          ))}
        </div>

        {/* Bottom Link — More About Us */}
        {showLink && (
          <div className="mt-12 flex items-center justify-center md:mt-16">
            <Reveal delay={0.2}>
              <Link
                href="/about"
                className="group inline-flex items-center gap-3.5 font-display text-2xl md:text-3xl lg:text-4xl font-bold tracking-[-0.03em] text-navy transition-colors duration-300 hover:text-royal"
              >
                <span>More About Us</span>
                <span className="text-signal text-3xl md:text-4xl lg:text-5xl transition-transform duration-300 group-hover:translate-x-3">
                  →
                </span>
              </Link>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
