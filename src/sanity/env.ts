export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-10-01";

/** false → website memakai konten lokal di `src/data` (fallback). */
export const isSanityConfigured = /^[a-z0-9-]+$/.test(projectId);
