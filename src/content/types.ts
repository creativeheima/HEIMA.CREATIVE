/** Bentuk data konten — sama untuk sumber lokal (src/data) maupun Sanity CMS. */

export type Stat = { value: number; prefix?: string; suffix?: string; label: string };

export type SocialLink = { label: string; href: string };

export type SiteSettings = {
  tagline: string;
  description: string;
  location: string;
  contact: {
    email: string;
    phone: string;
    phoneHref: string;
    whatsapp: string;
    whatsappHref: string;
    address: string;
    hours: string;
  };
  socials: SocialLink[];
  stats: Stat[];
};

export type Service = {
  slug: string;
  number: string;
  title: string;
  category: string;
  summary: string;
  capabilities: string[];
  image: string;
};

export type Project = {
  slug: string;
  number: string;
  title: string;
  category: string;
  /** opsional — kosongkan bila belum ingin ditampilkan */
  year?: number;
  client: string;
  industry: string;
  services: string[];
  technology: string[];
  excerpt: string;
  overview: string;
  problem: string;
  solution: string;
  implementation: string[];
  results: { value: string; label: string }[];
  cover: string;
  gallery: string[];
  size: "large" | "medium";
};

export type TechCategory = { number: string; title: string; description: string; items: string[] };
export type Value = { number: string; title: string; description: string };
export type ProcessStep = { number: string; title: string; description: string; detail: string };
