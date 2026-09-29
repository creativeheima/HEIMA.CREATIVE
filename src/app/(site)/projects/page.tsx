import type { Metadata } from "next";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHero } from "@/components/sections/PageHero";
import { ProjectCard } from "@/components/sections/Projects";
import { getProjects } from "@/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Project HEIMA.CREATIVE: sistem batching plant PT AKP, sistem inventory, aset & invoice Grand Artos Hotel, aplikasi cafe Kedai Teduh, dan help desk AC CV Sanjaya.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  const industries = Array.from(new Set(projects.map((p) => p.industry).filter(Boolean)));
  return (
    <>
      <PageHero
        label={`Projects — ${String(projects.length).padStart(2, "0")} case studies`}
        lines={[
          "SELECTED",
          <span key="p">
            PROJECTS<span className="text-signal">.</span>
          </span>,
        ]}
        description="Setiap project berawal dari masalah bisnis yang nyata. Berikut beberapa solusi digital yang telah kami bangun."
        aside={
          <ul className="flex flex-wrap gap-2" aria-label="Industri">
            {industries.map((i) => (
              <li key={i} className="meta rounded-full border border-navy/20 px-4 py-2 text-navy">
                {i}
              </li>
            ))}
          </ul>
        }
      />

      <section aria-label="Daftar project" className="section-y bg-paper">
        <div className="container-x">
          <div className="grid grid-cols-12 gap-x-8 gap-y-20 lg:gap-x-12 lg:gap-y-10">
            {projects.map((p, i) => (
              <ProjectCard key={p.slug} project={p} layoutIndex={i} headingLevel="h2" />
            ))}
          </div>
        </div>
      </section>

      <CallToAction />
    </>
  );
}
