"use client";

import Link from "next/link";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/ui/BrandImage";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Project } from "@/content/types";
import { cn } from "@/lib/motion";

/** Layout editorial asimetris — posisi tiap item di grid 12 kolom. */
const LAYOUT = [
  { wrap: "lg:col-span-8", aspect: "aspect-[16/11]", speed: 0.08 },
  { wrap: "lg:col-span-4 lg:mt-[28vh]", aspect: "aspect-[4/5]", speed: 0.3 },
  { wrap: "lg:col-span-7 lg:col-start-1 lg:mt-16", aspect: "aspect-[16/10]", speed: 0.12 },
  { wrap: "lg:col-span-4 lg:col-start-9 lg:mt-[32vh]", aspect: "aspect-[4/5]", speed: 0.26 },
];

export function ProjectCard({ project, layoutIndex, headingLevel = "h3" }: { project: Project; layoutIndex: number; headingLevel?: "h2" | "h3" }) {
  const l = LAYOUT[layoutIndex % LAYOUT.length];
  const Heading = headingLevel;
  return (
    <Parallax speed={l.speed} className={cn("col-span-12", l.wrap)}>
      <article>
        <Link
          href={`/projects/${project.slug}`}
          data-cursor="view"
          data-cursor-label="VIEW →"
          className="group block"
          aria-label={`${project.title} — lihat detail project`}
        >
          <div className="relative">
            <ParallaxImage
              src={project.cover}
              alt={`${project.title} — ${project.category}`}
              className={cn("w-full", l.aspect)}
              sizes="(min-width: 1024px) 60vw, 100vw"
              hoverZoom
            />
            <span className="meta absolute top-5 left-5 rounded-full bg-paper/90 px-3 py-1.5 text-navy backdrop-blur">
              {project.category}
            </span>
            {/* Label hover untuk perangkat tanpa custom cursor */}
            <span className="meta absolute right-5 bottom-5 flex translate-y-3 items-center gap-2 rounded-full bg-signal px-4 py-2 text-paper opacity-0 transition-all duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0 group-hover:opacity-100">
              View project →
            </span>
          </div>
          <div className="mt-6 flex items-start justify-between gap-6 border-t border-navy/15 pt-5">
            <div className="flex gap-5">
              <span className="meta pt-2 text-signal">{project.number}</span>
              <div>
                <Heading className="font-display text-[clamp(1.5rem,2.6vw,2.5rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-navy uppercase transition-colors duration-500 group-hover:text-royal">
                  {project.title}
                </Heading>
                <p className="meta mt-3 text-steel">
                  {[project.client, project.category, project.year].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
            <span aria-hidden className="mt-1 text-xl text-navy transition-transform duration-500 group-hover:translate-x-1 group-hover:-rotate-45">
              →
            </span>
          </div>
        </Link>
      </article>
    </Parallax>
  );
}

export function Projects({
  projects,
  index = "04",
  limit,
  showCta = true,
}: {
  projects: Project[];
  index?: string;
  limit?: number;
  showCta?: boolean;
}) {
  const list = limit ? projects.slice(0, limit) : projects;
  return (
    <section aria-labelledby="projects-title" className="section-y relative overflow-hidden bg-mist">
      <div className="container-x">
        <div className="mb-20 grid gap-10 md:mb-28 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel index={index}>Projects</SectionLabel>
          </div>
          <div className="flex flex-col gap-8 lg:col-span-9 lg:flex-row lg:items-end lg:justify-between">
            <RevealText
              id="projects-title"
              className="display-l text-navy"
              lines={[
                "SELECTED",
                <span key="p">
                  PROJECTS <sup className="meta align-top text-[0.9rem] text-signal">({String(list.length).padStart(2, "0")})</sup>
                </span>,
              ]}
            />
            <Reveal className="max-w-xs text-steel" delay={0.2}>
              Solusi digital yang kami bangun untuk bisnis di berbagai industri.
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-x-8 gap-y-20 lg:gap-x-12 lg:gap-y-10">
          {list.map((p, i) => (
            <ProjectCard key={p.slug} project={p} layoutIndex={i} />
          ))}
        </div>

        {showCta && (
          <Reveal className="mt-24 flex flex-col items-start justify-between gap-8 border-t border-navy/15 pt-10 md:mt-32 md:flex-row md:items-center">
            <p className="display-m max-w-xl text-navy">
              Punya project serupa<span className="text-signal">?</span>
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/projects" variant="outline">
                All projects
              </Button>
              <Button href="/contact">Start a project</Button>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
