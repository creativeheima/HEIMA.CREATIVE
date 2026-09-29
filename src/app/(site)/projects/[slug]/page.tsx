import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import { CallToAction } from "@/components/sections/CallToAction";
import { ProjectCard } from "@/components/sections/Projects";
import { ParallaxImage } from "@/components/ui/BrandImage";
import { TextLink } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { GridPattern } from "@/components/visuals/Patterns";
import { getProject, getProjects, getRelatedProjects } from "@/content";
import { siteConfig as site } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  const title = `${project.title} — ${project.client || project.category}`;
  return {
    title,
    description: project.excerpt,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${title} | ${site.name}`,
      description: project.excerpt,
      url: `${site.url}/projects/${project.slug}`,
      images: [{ url: project.cover, width: 2000, height: 1333, alt: project.title }],
    },
    twitter: { card: "summary_large_image", title, description: project.excerpt, images: [project.cover] },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  const related = await getRelatedProjects(project.slug);
  const gallery = project.gallery.filter(Boolean);

  // Hanya tampilkan data yang terisi
  const facts = [
    { label: "Client", value: project.client },
    { label: "Industry", value: project.industry },
    { label: "Year", value: project.year ? String(project.year) : "" },
    { label: "Services", value: project.services.join(", ") },
    { label: "Technology", value: project.technology.join(", ") },
  ].filter((f) => f.value);
  const stack = project.technology.length
    ? { label: "Technology", items: project.technology }
    : { label: "Services", items: project.services };

  const story = [
    { label: "Problem", body: project.problem },
    { label: "Solution", body: project.solution },
  ];

  const ld = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.excerpt,
    ...(project.year ? { dateCreated: String(project.year) } : {}),
    ...(project.client ? { sourceOrganization: { "@type": "Organization", name: project.client } } : {}),
    creator: { "@type": "Organization", name: site.name, url: site.url },
    image: project.cover,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      {/* Header */}
      <section className="relative overflow-hidden bg-mist pt-40 pb-16 md:pb-24">
        <GridPattern size={72} />
        <div className="container-x relative">
          <TextLink href="/projects" className="mb-10 [&>span:last-child]:rotate-180">
            All projects
          </TextLink>
          <p className="meta mb-6 flex items-center gap-3 text-steel">
            <span className="text-signal">{project.number}</span>
            {[project.client, project.category, project.year].filter(Boolean).join(" · ")}
          </p>
          <RevealText
            as="h1"
            immediate
            delay={0.5}
            className="display-xl text-navy uppercase"
            lines={project.title.split(" ").reduce<string[]>((acc, w, i, arr) => {
              // dua kata per baris untuk ritme tipografi
              if (i % 2 === 0) acc.push(arr.slice(i, i + 2).join(" "));
              return acc;
            }, [])}
          />
          <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-navy/15 pt-8 md:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="meta text-steel">{f.label}</dt>
                <dd className="mt-2 text-navy">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Large hero image */}
      <section aria-label="Gambar utama project" className="bg-mist">
        <ParallaxImage
          src={project.cover}
          alt={`${project.title} — tampilan utama`}
          className="h-[70svh] w-full md:h-[92svh]"
          priority
          speed={1.4}
        />
      </section>

      {/* Overview */}
      <section aria-labelledby="overview-title" className="section-y bg-paper">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel index="01">Project overview</SectionLabel>
          </div>
          <div className="lg:col-span-9">
            <h2 id="overview-title" className="sr-only">
              Project overview
            </h2>
            <Reveal>
              <p className="font-display text-[clamp(1.6rem,3vw,2.75rem)] leading-[1.18] font-medium tracking-[-0.025em] text-navy">
                {project.overview}
              </p>
            </Reveal>

            <div className="mt-20 grid gap-12 md:grid-cols-2">
              {story.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.1} className="border-t border-navy/15 pt-6">
                  <h3 className="meta text-signal">{s.label}</h3>
                  <p className="mt-5 text-lg leading-relaxed text-ink/80">{s.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technology + Implementation */}
      <section aria-labelledby="impl-title" className="section-y bg-mist">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel index="02">{stack.label}</SectionLabel>
            <ul className="mt-8 flex flex-wrap gap-2">
              {stack.items.map((t) => (
                <li key={t} className="rounded-full border border-navy/20 bg-paper px-4 py-2 font-display text-navy">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-8">
            <SectionLabel index="03">Implementation</SectionLabel>
            <h2 id="impl-title" className="display-m mt-8 text-navy">
              How we built it<span className="text-signal">.</span>
            </h2>
            <ol className="mt-12">
              {project.implementation.map((step, i) => (
                <Reveal as="li" key={step} delay={i * 0.06} className="grid grid-cols-12 gap-4 border-t border-navy/15 py-6">
                  <span className="meta col-span-2 pt-1 text-signal">{String(i + 1).padStart(2, "0")}</span>
                  <span className="col-span-10 text-lg text-navy">{step}</span>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Results */}
      {project.results.length > 0 && (
        <section aria-labelledby="results-title" className="relative overflow-hidden bg-navy py-[clamp(5rem,12vw,10rem)] text-paper">
          <GridPattern light size={80} />
          <div className="container-x relative">
            <SectionLabel index="04" light>
              Results
            </SectionLabel>
            <h2 id="results-title" className="sr-only">
              Hasil project
            </h2>
            <dl className="mt-14 grid gap-10 md:grid-cols-3">
              {project.results.map((r, i) => (
                <Reveal key={r.label} delay={i * 0.1} className="flex flex-col border-t border-paper/20 pt-6">
                  <dt className="meta order-2 mt-4 text-paper/60">{r.label}</dt>
                  <dd className="font-display text-[clamp(3rem,6.5vw,6rem)] leading-none font-bold tracking-[-0.05em]">{r.value}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* Gallery (tampil sesuai jumlah gambar yang tersedia) */}
      {gallery.length > 0 && (
        <section aria-label="Galeri project" className="section-y bg-paper">
          <div className="container-x">
            <SectionLabel index="05">Gallery</SectionLabel>
            <div className="mt-14 grid grid-cols-12 gap-6 md:gap-8">
              <div className="col-span-12">
                <ParallaxImage src={gallery[0]} alt={`${project.title} — galeri 1`} className="aspect-[21/9] w-full" />
              </div>
              {gallery[1] && (
                <Parallax speed={0.1} className="col-span-12 md:col-span-7">
                  <ParallaxImage src={gallery[1]} alt={`${project.title} — galeri 2`} className="aspect-[4/3] w-full" sizes="(min-width: 768px) 58vw, 100vw" />
                </Parallax>
              )}
              {gallery[2] && (
                <Parallax speed={0.3} className="col-span-12 md:col-span-5 md:mt-32">
                  <ParallaxImage src={gallery[2]} alt={`${project.title} — galeri 3`} className="aspect-[4/5] w-full" sizes="(min-width: 768px) 40vw, 100vw" />
                </Parallax>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      <section aria-labelledby="related-title" className="section-y bg-mist">
        <div className="container-x">
          <div className="mb-16 flex items-end justify-between gap-6">
            <h2 id="related-title" className="display-m text-navy">
              Related projects<span className="text-signal">.</span>
            </h2>
            <TextLink href="/projects">All projects</TextLink>
          </div>
          <div className="grid grid-cols-12 gap-x-8 gap-y-20 lg:gap-x-12 lg:gap-y-10">
            {related.map((p, i) => (
              <ProjectCard key={p.slug} project={p} layoutIndex={i} />
            ))}
          </div>
        </div>
      </section>

      <CallToAction />
    </>
  );
}
