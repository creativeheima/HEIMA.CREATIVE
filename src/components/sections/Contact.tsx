"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useSiteSettings } from "@/components/providers/SiteSettings";
import { cn, EASE } from "@/lib/motion";

type Status = "idle" | "sending" | "success" | "error";

export function Contact({
  projectTypes,
  index = "09",
  headingLevel = "h2",
}: {
  projectTypes: string[];
  index?: string;
  headingLevel?: "h1" | "h2";
}) {
  const site = useSiteSettings();
  const channels = [
    { label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}` },
    { label: "Phone", value: site.contact.phone, href: site.contact.phoneHref },
    { label: "WhatsApp", value: site.contact.whatsapp, href: site.contact.whatsappHref, external: true },
    { label: "Address", value: site.contact.address },
  ];
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Gagal mengirim pesan.");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Gagal mengirim pesan.");
    }
  }

  return (
    <section aria-labelledby="contact-title" className="section-y relative bg-paper">
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <SectionLabel index={index}>Contact</SectionLabel>
          <RevealText
            as={headingLevel}
            id="contact-title"
            className="display-xl mt-8 text-navy"
            lines={[
              <span key="l">
                LET&apos;S TALK<span className="text-signal">.</span>
              </span>,
            ]}
          />
          <Reveal className="mt-8 max-w-sm text-steel" delay={0.1}>
            Ceritakan kebutuhan Anda. Tim kami akan merespons dalam 1×24 jam kerja.
          </Reveal>

          <Reveal delay={0.2} className="mt-14">
            <dl className="divide-y divide-navy/10 border-y border-navy/10">
              {channels.map((c) => (
                <div key={c.label} className="grid grid-cols-3 gap-4 py-5">
                  <dt className="meta pt-1 text-steel">{c.label}</dt>
                  <dd className="col-span-2 text-navy">
                    {c.href ? (
                      <a
                        href={c.href}
                        {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="font-medium transition-colors hover:text-signal"
                      >
                        {c.value}
                      </a>
                    ) : (
                      <address className="not-italic">{c.value}</address>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3" aria-label="Social media">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="meta group inline-flex items-center gap-1.5 text-navy">
                    {s.label}
                    <span aria-hidden className="text-signal transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.15}>
          <div className="relative border border-navy/10 bg-mist p-6 sm:p-10 md:p-12">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="ok"
                  className="flex min-h-[520px] flex-col items-start justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  role="status"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-signal text-2xl text-paper">✓</span>
                  <p className="display-m mt-8 text-navy">Pesan terkirim.</p>
                  <p className="mt-4 max-w-sm text-steel">Terima kasih! Tim HEIMA.CREATIVE akan segera menghubungi Anda.</p>
                  <button type="button" onClick={() => setStatus("idle")} className="meta mt-10 text-navy underline underline-offset-8">
                    Kirim pesan lain
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} noValidate={false}>
                  <p className="meta mb-8 text-steel">Project inquiry</p>
                  <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
                    <Field name="name" label="Name" required autoComplete="name" />
                    <Field name="company" label="Company" autoComplete="organization" />
                    <Field name="email" label="Email" type="email" required autoComplete="email" />
                    <Field name="phone" label="Phone" type="tel" autoComplete="tel" />
                  </div>

                  <fieldset className="mt-8">
                    <legend className="meta mb-4 text-steel">Project type</legend>
                    <div className="flex flex-wrap gap-2">
                      {projectTypes.map((t, i) => (
                        <label key={t} className="cursor-pointer">
                          <input type="radio" name="projectType" value={t} defaultChecked={i === 0} className="peer sr-only" />
                          <span className="inline-block rounded-full border border-navy/20 px-4 py-2 text-sm text-navy transition-colors duration-300 peer-checked:border-navy peer-checked:bg-navy peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-signal hover:border-navy">
                            {t}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <Field name="message" label="Message" textarea required className="mt-6" />

                  {/* Honeypot anti-spam */}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

                  <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Button type="submit" disabled={status === "sending"} magnetic={false}>
                      {status === "sending" ? "Sending…" : "Send message"}
                    </Button>
                    <p className="text-xs text-steel">Data Anda hanya digunakan untuk menindaklanjuti pesan ini.</p>
                  </div>
                  {status === "error" && (
                    <p role="alert" className="mt-6 text-sm text-signal">
                      {error} Silakan coba lagi atau email kami di {site.contact.email}.
                    </p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  textarea,
  className,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  className?: string;
  autoComplete?: string;
}) {
  const id = `field-${name}`;
  const common =
    "peer block w-full border-0 border-b border-navy/20 bg-transparent px-0 pt-7 pb-3 text-navy placeholder-transparent transition-colors duration-300 focus:border-navy focus:ring-0 focus:outline-none";
  return (
    <div className={cn("group relative", className)}>
      {textarea ? (
        <textarea id={id} name={name} required={required} rows={4} placeholder={label} className={cn(common, "resize-none")} />
      ) : (
        <input id={id} name={name} type={type} required={required} placeholder={label} autoComplete={autoComplete} className={common} />
      )}
      <label
        htmlFor={id}
        className="meta pointer-events-none absolute top-8 left-0 origin-left text-steel transition-all duration-300 peer-focus:top-1 peer-focus:scale-90 peer-focus:text-signal peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:scale-90"
      >
        {label}
        {required && <span className="text-signal"> *</span>}
      </label>
      <span aria-hidden className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-signal transition-transform duration-500 ease-[var(--ease-expo)] peer-focus:scale-x-100" />
    </div>
  );
}
