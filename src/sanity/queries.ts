import { defineQuery } from "next-sanity";

export const settingsQuery = defineQuery(`*[_id == "siteSettings"][0]{
  tagline, description, location,
  contact{ email, phone, whatsapp, address, hours },
  socials[]{ label, href },
  stats[]{ value, prefix, suffix, label }
}`);

export const servicesQuery = defineQuery(`*[_type == "service" && defined(slug.current)] | order(number asc){
  "slug": slug.current, number, title, category, summary, capabilities, image
}`);

export const projectsQuery = defineQuery(`*[_type == "project" && defined(slug.current)] | order(number asc){
  "slug": slug.current, number, title, category, year, client, industry, services, technology,
  excerpt, overview, problem, solution, implementation, results[]{ value, label }, cover, gallery, size
}`);

export const techCategoriesQuery = defineQuery(`*[_type == "techCategory"] | order(number asc){ number, title, description, items }`);
export const valuesQuery = defineQuery(`*[_type == "companyValue"] | order(number asc){ number, title, description }`);
export const processQuery = defineQuery(`*[_type == "processStep"] | order(number asc){ number, title, description, detail }`);
