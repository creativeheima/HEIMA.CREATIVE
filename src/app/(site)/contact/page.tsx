import type { Metadata } from "next";
import { Contact } from "@/components/sections/Contact";
import { getProjectTypes } from "@/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Hubungi HEIMA.CREATIVE untuk konsultasi website, aplikasi mobile, custom software, dan sistem informasi. Magelang — Indonesia.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const projectTypes = await getProjectTypes();
  return (
    <div className="pt-16">
      <Contact projectTypes={projectTypes} index="01" headingLevel="h1" />
    </div>
  );
}
