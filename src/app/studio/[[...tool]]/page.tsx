import { isSanityConfigured } from "@/sanity/env";
import { Studio } from "./Studio";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

/** Sanity Studio — panel admin CMS di /studio. */
export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main style={{ minHeight: "100vh", background: "#F4F6F9", color: "#0F1B31", fontFamily: "system-ui, sans-serif", lineHeight: 1.6, padding: "15vh 24px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <h1 style={{ color: "#213C6D" }}>CMS belum terhubung</h1>
        <p>
          Isi <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> dan <code>NEXT_PUBLIC_SANITY_DATASET</code> di <code>.env.local</code> (lokal) atau di
          Environment Variables Vercel, lalu jalankan ulang/redeploy. Panduan lengkap ada di <code>README.md</code>.
        </p>
        <p>Selama CMS belum terhubung, website memakai konten bawaan dari folder <code>src/data</code>.</p>
        </div>
      </main>
    );
  }
  return <Studio />;
}
