import { About } from "@/components/sections/About";
import { BigStatement } from "@/components/sections/BigStatement";
import { CallToAction } from "@/components/sections/CallToAction";
import { Clients } from "@/components/sections/Clients";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { ParallaxServices } from "@/components/sections/ParallaxServices";
import { Process } from "@/components/sections/Process";
import { Projects } from "@/components/sections/Projects";
import { ServicesList } from "@/components/sections/ServicesList";
import { Stats } from "@/components/sections/Stats";
import { TechMarquee } from "@/components/sections/TechMarquee";
import { WhyHeima } from "@/components/sections/WhyHeima";
import { getProcessSteps, getProjects, getProjectTypes, getServices, getTechnologies, getValues } from "@/content";

export default async function HomePage() {
  const [services, projects, technologies, values, steps, projectTypes] = await Promise.all([
    getServices(),
    getProjects(),
    getTechnologies(),
    getValues(),
    getProcessSteps(),
    getProjectTypes(),
  ]);

  return (
    <>
      <Hero />
      <Intro />
      <Stats />
      <ServicesList services={services} />
      <ParallaxServices services={services} />
      <Projects projects={projects} limit={4} />
      <Clients projects={projects} />
      <TechMarquee technologies={technologies} />
      <About />
      <WhyHeima values={values} />
      <Process steps={steps} />
      <BigStatement />
      <CallToAction />
      <Contact projectTypes={projectTypes} />
    </>
  );
}
