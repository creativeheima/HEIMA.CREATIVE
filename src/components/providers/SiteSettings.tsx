"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteSettings } from "@/content/types";
import { fallbackSettings } from "@/data/site";

const SiteSettingsContext = createContext<SiteSettings>(fallbackSettings);

/** Pengaturan website (kontak, sosial, statistik) dari CMS untuk komponen client. */
export function SiteSettingsProvider({ value, children }: { value: SiteSettings; children: ReactNode }) {
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export const useSiteSettings = () => useContext(SiteSettingsContext);
