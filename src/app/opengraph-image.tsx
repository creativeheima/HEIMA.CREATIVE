import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "HEIMA.CREATIVE — We Build Digital Solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/heima-mark.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#FFFFFF",
          color: "#213C6D",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} width={116} height={80} alt="" />
          <div style={{ fontSize: 34, fontWeight: 700, display: "flex" }}>
            HEIMA<span style={{ color: "#EB772C" }}>.</span>CREATIVE
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 110, fontWeight: 800, lineHeight: 0.92, letterSpacing: -4 }}>
          <span>WE BUILD</span>
          <span style={{ color: "#295092" }}>DIGITAL</span>
          <span style={{ display: "flex" }}>
            SOLUTIONS<span style={{ color: "#EB772C" }}>.</span>
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4, color: "#6B7385" }}>
          <span>IT &amp; DIGITAL SOLUTIONS</span>
          <span>MAGELANG — INDONESIA</span>
        </div>
      </div>
    ),
    size,
  );
}
