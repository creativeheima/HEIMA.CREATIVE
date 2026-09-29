# HEIMA.CREATIVE — Design System

Logo resmi (`public/brand/heima-logo-original.png`) adalah **single source of truth**.
Semua keputusan visual di bawah diturunkan dari logo tersebut.

## 1. Analisis Logo

| Elemen logo | Makna | Turunan di website |
| --- | --- | --- |
| Kepala kuda (navy solid) | Kekuatan, kecepatan, keandalan | Warna primer, tipografi berat, motion yang tegas |
| Surai bergradasi navy → royal blue | Pergerakan ke depan, dinamika | Gradasi pada visual abstrak & layer parallax |
| 3 jalur sirkuit dengan node lingkaran | Teknologi, data, konektivitas | Motif garis data (`CircuitLines`), node, grid |
| Satu jalur oranye | Titik fokus / energi | Warna aksen — hanya untuk CTA & highlight |
| Latar putih bersih | Profesional, jernih | Latar netral, whitespace besar |

## 2. Color System (diambil dari piksel logo)

| Token | Hex | Sumber | Penggunaan |
| --- | --- | --- | --- |
| `navy` (Primary) | `#213C6D` | Kepala kuda | Heading, tombol utama, section gelap |
| `royal` (Secondary) | `#295092` | Gradasi surai & jalur data | Garis, grid, gradasi, hover |
| `signal` (Accent) | `#EB772C` | Jalur sirkuit oranye | CTA, titik aksen, kursor, highlight |
| `paper` (Background) | `#FFFFFF` | Latar logo | Latar utama |
| `ink` (Text) | `#0F1B31` | Shade terdalam navy | Teks body |

Shade turunan navy (bukan warna baru): `abyss #0A1326`, `deep #111F3B`.
Netral: white, `mist #F4F6F9`, gray (`#6B7385`), transparansi dari token di atas.

Prinsip: **latar netral + aksen brand yang kuat.** Oranye maksimal ±5% luas layar.

## 3. Typography

- **Display — Space Grotesk** (600/700): geometris & teknis, selaras dengan bentuk logo yang tajam.
- **Body — Inter** (400/500): netral dan sangat mudah dibaca.
- **Metadata — JetBrains Mono** (500): kecil, uppercase, letter-spacing lebar; memberi nuansa "engineering".

Skala: `display-xl clamp(3.5rem, 11vw, 11.5rem)` → `display-l clamp(2.75rem, 7vw, 7rem)` →
`display-m clamp(2rem, 4.5vw, 4.25rem)` → `h3 1.5–2rem` → `body 1–1.125rem` → `meta 0.6875rem`.
Line-height heading 0.9–0.95, tracking −0.04em.

## 4. Spacing System

Basis 4px. Container maks 1440px, gutter `clamp(1.25rem, 4vw, 3rem)`.
Section vertikal `clamp(6rem, 14vw, 13rem)`. Grid 12 kolom untuk layout editorial asimetris.

## 5. Motion Language

- Easing utama: `cubic-bezier(0.22, 1, 0.36, 1)` (expo-out), terasa cepat di awal, mendarat halus.
- Durasi reveal 0.9–1.2s, stagger 0.06–0.1s.
- Hierarki parallax: **Background = lambat (0.1–0.2)**, **Middle = sedang (0.3–0.45)**, **Foreground = cepat (0.6+)**.
- Intensitas: desktop 100%, tablet 55%, mobile 30%, `prefers-reduced-motion` = 0.
- Hanya `transform` + `opacity` (+ `clip-path` untuk mask reveal).

## 6. Visual Hierarchy

1. Tipografi display berukuran sangat besar (pesan utama)
2. Aksen oranye (satu per viewport: CTA/titik)
3. Visual abstrak navy/royal (konteks teknologi)
4. Metadata mono (navigasi mata)

Semua edit konten ada di `src/data/*`.
