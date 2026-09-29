/**
 * AIR TOUCH — menerjemahkan tangan di depan kamera menjadi "layar sentuh di udara".
 *
 * - Pointer   : titik tengah jempol & telunjuk → kursor (hover)
 * - Touch     : jempol + telunjuk bersentuhan = jari menyentuh layar
 *   · lepas cepat tanpa bergerak      → TAP (klik)
 *   · tahan + gerak naik/turun        → DRAG SCROLL (+ inertia saat dilepas)
 *   · tahan + geser cepat kiri/kanan  → SWIPE pindah tab/halaman
 * - Kepalan tangan ditahan            → keluar
 */

export type Landmark = { x: number; y: number; z: number };

export type AirTouchFrame = {
  /** posisi pointer di viewport (px) */
  cursor: { x: number; y: number } | null;
  touching: boolean;
  /** tap selesai → klik elemen di bawah pointer */
  tap: boolean;
  /** scroll frame ini (px, positif = ke bawah) selama drag */
  drag: number;
  /** kecepatan lempar (px/ms) saat sentuhan dilepas setelah drag */
  fling: number;
  swipe: "next" | "prev" | null;
  /** 0–1 progres kepalan tangan untuk keluar */
  exitProgress: number;
  exit: boolean;
  label: string;
};

const TIP_THUMB = 4;
const TIP_INDEX = 8;
const WRIST = 0;
const MIDDLE_MCP = 9;

const TOUCH_ON = 0.32; // rasio jarak jempol–telunjuk terhadap ukuran tangan
const TOUCH_OFF = 0.48;
const TAP_MAX_MOVE = 28; // px
const TAP_MAX_TIME = 550; // ms
const DRAG_GAIN = 1.8; // 1 px gerak tangan → 1.8 px scroll
const SWIPE_MIN = 0.2; // proporsi lebar layar
const SWIPE_MAX_TIME = 750;
const EXIT_HOLD = 1500;

const dist = (a: Landmark, b: Landmark) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const remap = (v: number, a: number, b: number) => clamp((v - a) / (b - a), 0, 1);

type Touch = { x: number; y: number; t: number; lastY: number; moved: number; mode: "pending" | "drag" | "done"; samples: { y: number; t: number }[] };

export class AirTouchInterpreter {
  private smooth: { x: number; y: number } | null = null;
  private touch: Touch | null = null;
  private fistSince = 0;

  reset() {
    this.smooth = null;
    this.touch = null;
    this.fistSince = 0;
  }

  update(landmarks: Landmark[] | undefined, gesture: string | undefined, now: number, vw: number, vh: number): AirTouchFrame {
    const frame: AirTouchFrame = {
      cursor: null,
      touching: false,
      tap: false,
      drag: 0,
      fling: 0,
      swipe: null,
      exitProgress: 0,
      exit: false,
      label: "Tunjukkan tangan Anda ke kamera",
    };

    if (!landmarks || landmarks.length < 21) {
      // Tangan hilang saat drag → anggap sentuhan dilepas tanpa aksi
      this.reset();
      return frame;
    }

    const thumb = landmarks[TIP_THUMB];
    const index = landmarks[TIP_INDEX];
    const handSize = Math.max(dist(landmarks[WRIST], landmarks[MIDDLE_MCP]), 0.01);

    // ── Pointer: titik tengah jempol & telunjuk (stabil saat "menyentuh"), kamera di-mirror
    const px = 1 - (thumb.x + index.x) / 2;
    const py = (thumb.y + index.y) / 2;
    const target = { x: remap(px, 0.2, 0.8) * vw, y: remap(py, 0.15, 0.75) * vh };
    const k = this.touch ? 0.55 : 0.35; // lebih responsif saat drag
    this.smooth = this.smooth ? { x: this.smooth.x + (target.x - this.smooth.x) * k, y: this.smooth.y + (target.y - this.smooth.y) * k } : target;
    const p = this.smooth;
    frame.cursor = p;
    frame.label = "Arahkan — satukan jempol & telunjuk untuk menyentuh";

    // ── Keluar: kepalan tangan ditahan
    if (gesture === "Closed_Fist" && !this.touch) {
      if (!this.fistSince) this.fistSince = now;
      frame.exitProgress = clamp((now - this.fistSince) / EXIT_HOLD, 0, 1);
      frame.exit = frame.exitProgress >= 1;
      frame.label = "Tahan kepalan untuk keluar…";
      return frame;
    }
    this.fistSince = 0;

    // ── Status sentuhan (hysteresis agar tidak berkedip)
    const ratio = dist(thumb, index) / handSize;
    const wasTouching = !!this.touch;
    const touching = wasTouching ? ratio < TOUCH_OFF : ratio < TOUCH_ON;

    if (touching && !wasTouching) {
      this.touch = { x: p.x, y: p.y, t: now, lastY: p.y, moved: 0, mode: "pending", samples: [{ y: p.y, t: now }] };
    }

    if (touching && this.touch) {
      const t = this.touch;
      frame.touching = true;
      const dx = p.x - t.x;
      const dy = p.y - t.y;
      t.moved = Math.max(t.moved, Math.hypot(dx, dy));
      t.samples.push({ y: p.y, t: now });
      t.samples = t.samples.filter((s) => now - s.t <= 120);

      if (t.mode === "done") {
        frame.label = "Lepaskan sentuhan";
      } else if (Math.abs(dx) > SWIPE_MIN * vw && Math.abs(dx) > Math.abs(dy) * 1.6 && now - t.t < SWIPE_MAX_TIME) {
        // Swipe horizontal cepat → pindah tab/halaman (geser ke kiri = berikutnya, seperti di HP)
        frame.swipe = dx < 0 ? "next" : "prev";
        frame.label = dx < 0 ? "Swipe → berikutnya" : "Swipe → sebelumnya";
        t.mode = "done";
      } else if (t.mode === "drag" || (Math.abs(dy) > TAP_MAX_MOVE && Math.abs(dy) >= Math.abs(dx))) {
        // Drag vertikal: konten mengikuti jari (tangan naik → halaman turun)
        t.mode = "drag";
        frame.drag = -(p.y - t.lastY) * DRAG_GAIN;
        frame.label = "Drag scroll";
      } else {
        frame.label = "Menyentuh";
      }
      t.lastY = p.y;
      return frame;
    }

    if (!touching && this.touch) {
      const t = this.touch;
      this.touch = null;
      if (t.mode === "pending" && t.moved < TAP_MAX_MOVE && now - t.t < TAP_MAX_TIME) {
        frame.tap = true;
        frame.label = "Tap";
      } else if (t.mode === "drag" && t.samples.length > 1) {
        const first = t.samples[0];
        const last = t.samples[t.samples.length - 1];
        const dt = Math.max(last.t - first.t, 1);
        frame.fling = (-(last.y - first.y) / dt) * DRAG_GAIN;
      }
    }

    return frame;
  }
}
