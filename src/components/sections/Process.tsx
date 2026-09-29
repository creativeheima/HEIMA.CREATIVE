"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { ProcessStep } from "@/content/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * HOW WE WORK — storytelling timeline.
 * Desktop (≥1024px, motion aktif): section di-pin, timeline bergerak horizontal mengikuti scroll vertikal.
 * Mobile / reduced motion: timeline vertikal.
 */
export function Process({ steps: processSteps, index = "08" }: { steps: ProcessStep[]; index?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current!;
        const distance = () => track.scrollWidth - window.innerWidth + 96;

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        gsap.fromTo(
          barRef.current,
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top top", end: () => `+=${distance()}`, scrub: true } },
        );
        // Setiap step "menyala" ketika mendekati tengah layar
        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
          gsap.fromTo(
            step,
            { opacity: 0.3 },
            {
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: step, containerAnimation: tween, start: "left 85%", end: "left 45%", scrub: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} aria-labelledby="process-title" className="relative overflow-hidden bg-paper lg:motion-safe:h-screen">
      <div className="flex h-full flex-col py-24 md:py-32 lg:motion-safe:py-0">
        <div className="container-x grid gap-8 lg:motion-safe:pt-28 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel index={index}>Process</SectionLabel>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-9 lg:flex-row lg:items-end lg:justify-between">
            <RevealText
              id="process-title"
              className="display-l text-navy"
              lines={[
                <span key="h">
                  HOW WE WORK<span className="text-signal">.</span>
                </span>,
              ]}
            />
            <Reveal className="max-w-xs text-steel" delay={0.15}>
              Tahapan yang transparan — Anda selalu tahu apa yang sedang dikerjakan dan apa yang berikutnya.
            </Reveal>
          </div>
        </div>

        <div className="relative mt-16 flex-1 lg:motion-safe:mt-0 lg:motion-safe:flex lg:motion-safe:items-center">
          <ol
            ref={trackRef}
            className="container-x relative flex flex-col gap-0 lg:motion-safe:mx-0 lg:motion-safe:w-max lg:motion-safe:max-w-none lg:motion-safe:flex-row lg:motion-safe:gap-6 lg:motion-safe:pl-[max(3rem,calc((100vw-1440px)/2+3rem))] lg:motion-safe:will-change-transform"
          >
            {/* Garis timeline vertikal (mobile) */}
            <span aria-hidden className="absolute top-2 bottom-2 left-[calc(clamp(1.25rem,4vw,3rem)+7px)] w-px bg-navy/15 lg:motion-safe:hidden" />
            {processSteps.map((step, i) => (
              <li
                key={step.number}
                data-step
                className="relative pb-12 pl-10 last:pb-0 lg:motion-safe:w-[min(30vw,440px)] lg:motion-safe:shrink-0 lg:motion-safe:pb-0 lg:motion-safe:pl-0"
              >
                <span
                  aria-hidden
                  className="absolute top-1.5 left-0 h-[15px] w-[15px] rounded-full border-2 border-signal bg-paper lg:motion-safe:hidden"
                />
                <Reveal
                  className="h-full lg:motion-safe:flex lg:motion-safe:min-h-[48vh] lg:motion-safe:flex-col lg:motion-safe:justify-between lg:motion-safe:border lg:motion-safe:border-navy/12 lg:motion-safe:bg-mist lg:motion-safe:p-10"
                  amount={0.4}
                >
                  <div className="flex items-center justify-between">
                    <span className="meta text-signal">Step {step.number}</span>
                    <span className="meta hidden text-steel lg:motion-safe:block">
                      {String(i + 1).padStart(2, "0")} / {String(processSteps.length).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="lg:motion-safe:mt-auto">
                    <span
                      aria-hidden
                      className="hidden font-display text-[7rem] leading-none font-bold tracking-[-0.06em] text-navy/[0.07] lg:motion-safe:block"
                    >
                      {step.number}
                    </span>
                    <h3 className="mt-3 font-display text-[clamp(2rem,3.4vw,3.25rem)] leading-none font-bold tracking-[-0.04em] text-navy uppercase">
                      {step.title}
                    </h3>
                    <p className="mt-4 font-medium text-navy">{step.description}</p>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-steel">{step.detail}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <div className="container-x hidden pb-12 lg:motion-safe:block">
          <div className="h-px w-full bg-navy/12">
            <div ref={barRef} className="h-px origin-left bg-signal" />
          </div>
        </div>
      </div>
    </section>
  );
}
