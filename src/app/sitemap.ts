import type { MetadataRoute } from "next";
import { getProjects } from "@/content";
import { siteConfig as site } from "@/data/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const now = new Date();
  const pages = ["", "/services", "/projects", "/about", "/technology", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const projectPages = projects.map((p) => ({
    url: `${site.url}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));
  return [...pages, ...projectPages];
}
