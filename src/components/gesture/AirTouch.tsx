"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "@/components/providers/SmoothScroll";
import { navigation } from "@/data/site";
import { cn, EASE } from "@/lib/motion";
import type { HandEngine, HandResult } from "./engine";
import { AirTouchInterpreter } from "./interpret";

type Status = "idle" | "intro" | "loading" | "active" | "error";

const INTRO_KEY = "heima-airtouch-intro";
const DETECT_INTERVAL = 33; // ~30 fps deteksi, render tetap 60 fps
const FLING_DECAY = 0.94;

const GUIDE = [
  { title: "Arahkan", body: "Gerakkan tangan — kursor mengikuti jari Anda." },
  { title: "Tap", body: "Satukan jempol & telunjuk lalu lepas — seperti menyentuh layar." },
  { title: "Scroll", body: "Tahan jempol & telunjuk menyatu, lalu gerakkan naik/turun." },
  { title: "Pindah tab", body: "Tahan menyatu, lalu geser cepat ke kiri/kanan." },
  { title: "Keluar", body: "Kepalkan tangan selama 1,5 detik." },
];

function readFlag() {
  try {
    return localStorage.getItem(INTRO_KEY) === "1";
  } catch {
    return false;
  }
}
function writeFlag() {
  try {
    localStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* abaikan */
  }
}

/**
 * AIR TOUCH — kontrol website tanpa sentuh lewat kamera (MediaPipe, on-device).
 */
export function AirTouch() {
  const [supported, setSupported] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [label, setLabel] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const exitBarRef = useRef<HTMLDivElement>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const engineRef = useRef<HandEngine | null>(null);
  const rafRef = useRef(0);
  const interpreter = useRef(new AirTouchInterpreter());
  const labelRef = useRef("");
  const flingRef = useRef(0);
  const lastDetectRef = useRef(0);
  const toastTimer = useRef<number | undefined>(undefined);

  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;
  const router = useRouter();
  const pathname = usePathname();
  const pathRef = useRef(pathname);
  pathRef.current = pathname;

  useEffect(() => {
    setSupported(typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia);
  }, []);

  const showToast = useCallback((text: string) => {
    setToast(text);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1600);
  }, []);

  const release = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    engineRef.current?.close();
    engineRef.current = null;
    interpreter.current.reset();
    flingRef.current = 0;
    labelRef.current = "";
  }, []);

  const stop = useCallback(() => {
    release();
    setStatus("idle");
    setLabel("");
  }, [release]);

  useEffect(() => release, [release]);

  // ── Aksi ──────────────────────────────────────────────
  const scrollBy = (px: number) => {
    const l = lenisRef.current;
    if (l) l.scrollTo(l.animatedScroll + px, { immediate: true, force: true });
    else window.scrollBy(0, px);
  };

  const navigate = useCallback(
    (dir: "next" | "prev") => {
      const current = navigation.findIndex((n) => (n.href === "/" ? pathRef.current === "/" : pathRef.current.startsWith(n.href)));
      const target = navigation[Math.min(Math.max((current < 0 ? 0 : current) + (dir === "next" ? 1 : -1), 0), navigation.length - 1)];
      if (!target || target.href === navigation[current]?.href) {
        showToast(dir === "next" ? "Sudah di tab terakhir" : "Sudah di tab pertama");
        return;
      }
      showToast(`${dir === "next" ? "→" : "←"} ${target.label}`);
      router.push(target.href);
    },
    [router, showToast],
  );

  const tapAt = (x: number, y: number) => {
    const el = document.elementFromPoint(x, y)?.closest<HTMLElement>("a, button, label, input, textarea, select, [data-cursor]");
    ringRef.current?.animate(
      [{ transform: "scale(1)", opacity: 1 }, { transform: "scale(2.2)", opacity: 0 }],
      { duration: 450, easing: "cubic-bezier(0.22,1,0.36,1)" },
    );
    if (!el) return;
    if (el.matches("input, textarea, select")) el.focus();
    else el.click();
  };

  // ── Visualisasi tangan di preview kamera ─────────────
  const draw = (hand: HandResult, touching: boolean) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const engine = engineRef.current;
    if (!canvas || !video || !engine) return;
    if (canvas.width !== video.videoWidth) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const pts = hand.landmarks;
    if (!pts) return;
    const W = canvas.width;
    const H = canvas.height;
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    for (const { start, end } of engine.connections) {
      ctx.beginPath();
      ctx.moveTo(pts[start].x * W, pts[start].y * H);
      ctx.lineTo(pts[end].x * W, pts[end].y * H);
      ctx.stroke();
    }
    pts.forEach((p, i) => {
      const tip = i === 4 || i === 8;
      ctx.beginPath();
      ctx.arc(p.x * W, p.y * H, tip ? 7 : 4, 0, Math.PI * 2);
      ctx.fillStyle = tip ? (touching ? "#EB772C" : "#ffffff") : "#295092";
      ctx.fill();
    });
  };

  // ── Loop utama ────────────────────────────────────────
  const loop = useCallback(() => {
    const video = videoRef.current;
    const engine = engineRef.current;
    if (!video || !engine) return;
    const now = performance.now();

    if (video.readyState >= 2 && !document.hidden && now - lastDetectRef.current >= DETECT_INTERVAL) {
      lastDetectRef.current = now;
      const hand = engine.detect(video, now);
      const f = interpreter.current.update(hand.landmarks, hand.gesture, now, window.innerWidth, window.innerHeight);
      draw(hand, f.touching);

      const pointer = pointerRef.current;
      if (pointer) {
        if (f.cursor) {
          pointer.style.opacity = "1";
          pointer.style.transform = `translate3d(${f.cursor.x}px, ${f.cursor.y}px, 0)`;
          const hover = document.elementFromPoint(f.cursor.x, f.cursor.y)?.closest("a, button, label, input, textarea, select, [data-cursor]");
          pointer.dataset.state = f.touching ? "touch" : hover ? "hover" : "idle";
        } else {
          pointer.style.opacity = "0";
        }
      }
      if (exitBarRef.current) exitBarRef.current.style.transform = `scaleX(${f.exitProgress})`;

      if (f.touching) flingRef.current = 0;
      if (f.drag) scrollBy(f.drag);
      if (f.fling) flingRef.current = f.fling * 16; // px/ms → px/frame
      if (f.tap && f.cursor) tapAt(f.cursor.x, f.cursor.y);
      if (f.swipe) navigate(f.swipe);
      if (f.label !== labelRef.current) {
        labelRef.current = f.label;
        setLabel(f.label);
      }
      if (f.exit) {
        stop();
        showToast("Air Touch dimatikan");
        return;
      }
    }

    // Inertia setelah drag dilepas
    if (Math.abs(flingRef.current) > 0.5) {
      scrollBy(flingRef.current);
      flingRef.current *= FLING_DECAY;
    }

    rafRef.current = requestAnimationFrame(loop);
  }, [navigate, showToast, stop]);

  const start = useCallback(async () => {
    writeFlag();
    setError("");
    setStatus("loading");
    setLabel("Memuat model AI…");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();
      const { createHandEngine } = await import("./engine");
      const engine = await createHandEngine();
      if (!streamRef.current) {
        engine.close(); // dibatalkan saat memuat
        return;
      }
      engineRef.current = engine;
      setStatus("active");
      setLabel("Tunjukkan tangan Anda ke kamera");
      rafRef.current = requestAnimationFrame(loop);
    } catch (err) {
      release();
      const name = err instanceof DOMException ? err.name : "";
      setError(
        name === "NotAllowedError"
          ? "Akses kamera ditolak. Izinkan kamera di pengaturan browser, lalu coba lagi."
          : name === "NotFoundError" || name === "OverconstrainedError"
            ? "Kamera tidak ditemukan di perangkat ini."
            : name === "NotReadableError"
              ? "Kamera sedang dipakai aplikasi lain."
              : "Gagal memuat Air Touch. Periksa koneksi internet, lalu coba lagi.",
      );
      setStatus("error");
    }
  }, [loop, release]);

  const open = () => (readFlag() ? start() : setStatus("intro"));

  useEffect(() => {
    if (status !== "active" && status !== "loading" && status !== "intro") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && stop();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status, stop]);

  if (!supported) return null;
  const running = status === "loading" || status === "active";

  return (
    <>
      {/* Tombol aktivasi */}
      <AnimatePresence>
        {(status === "idle" || status === "error") && (
          <motion.div
            className="fixed right-4 bottom-4 z-[120] flex flex-col items-end gap-3 md:right-6 md:bottom-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
          >
            {status === "error" && (
              <div role="alert" className="max-w-[280px] rounded-2xl border border-signal/40 bg-paper p-4 text-sm text-ink shadow-xl">
                {error}
              </div>
            )}
            <button
              type="button"
              onClick={open}
              aria-label="Aktifkan Air Touch — kontrol website dengan tangan"
              className="group flex items-center gap-2.5 rounded-full border border-paper/20 bg-navy py-2.5 pr-5 pl-3 text-paper shadow-[0_20px_50px_-15px_rgba(10,19,38,0.7)] transition-colors duration-500 hover:bg-royal"
            >
              <HandIcon className="h-7 w-7 rounded-full bg-signal p-1.5" />
              <span className="meta">{status === "error" ? "Coba lagi" : "Air Touch"}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panduan pertama kali */}
      <AnimatePresence>
        {status === "intro" && (
          <motion.div
            className="fixed inset-0 z-[180] flex items-end justify-center bg-abyss/60 p-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setStatus("idle")}
            data-lenis-prevent
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="airtouch-title"
              className="max-h-[90svh] w-full max-w-lg overflow-y-auto rounded-3xl bg-paper p-7 text-ink shadow-2xl sm:p-9"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="meta flex items-center gap-3 text-steel">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
                Touchless experience
              </p>
              <h2 id="airtouch-title" className="mt-4 font-display text-4xl leading-none font-bold tracking-[-0.04em] text-navy">
                AIR TOUCH<span className="text-signal">.</span>
              </h2>
              <p className="mt-4 text-steel">Jelajahi website tanpa menyentuh apa pun — cukup gerakkan tangan di depan kamera.</p>

              <ol className="mt-7 border-t border-navy/10">
                {GUIDE.map((g, i) => (
                  <li key={g.title} className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-navy/10 py-3.5">
                    <span className="meta pt-0.5 text-signal">0{i + 1}</span>
                    <p>
                      <span className="font-display font-semibold text-navy">{g.title}</span>
                      <span className="text-steel"> — {g.body}</span>
                    </p>
                  </li>
                ))}
              </ol>

              <p className="mt-6 rounded-xl bg-mist p-4 text-sm text-steel">
                🔒 Video diproses langsung di perangkat Anda dan <strong className="text-navy">tidak dikirim ke server</strong> mana pun.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={start}
                  className="meta rounded-full bg-navy px-7 py-4 text-paper transition-colors duration-500 hover:bg-signal"
                >
                  Aktifkan kamera →
                </button>
                <button type="button" onClick={() => setStatus("idle")} className="meta px-4 py-4 text-steel hover:text-navy">
                  Nanti saja
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel kamera */}
      <AnimatePresence>
        {running && (
          <motion.aside
            aria-label="Air Touch aktif"
            className="fixed right-4 bottom-4 z-[120] w-[210px] overflow-hidden rounded-2xl border border-paper/10 bg-abyss text-paper shadow-[0_30px_80px_-20px_rgba(10,19,38,0.8)] md:right-6 md:bottom-6 md:w-[250px]"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="relative aspect-[4/3] -scale-x-100 bg-deep">
              <video ref={videoRef} playsInline muted className="absolute inset-0 h-full w-full object-cover opacity-70" />
              <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover" />
            </div>
            {status === "loading" && (
              <div className="absolute inset-x-0 top-0 flex aspect-[4/3] flex-col items-center justify-center gap-3 bg-abyss/80">
                <span className="h-7 w-7 animate-spin rounded-full border-2 border-paper/20 border-t-signal" />
                <span className="meta text-paper/70">Memuat model AI…</span>
              </div>
            )}
            <div className="flex items-center justify-between gap-2 px-4 pt-3">
              <span className="meta flex items-center gap-2 text-paper/60">
                <span className={cn("h-1.5 w-1.5 rounded-full", status === "active" ? "animate-pulse bg-signal" : "bg-paper/30")} />
                Air Touch
              </span>
              <button type="button" onClick={stop} aria-label="Matikan Air Touch" className="meta rounded-full px-2 py-1 text-paper/60 hover:bg-paper/10 hover:text-paper">
                ✕
              </button>
            </div>
            <p aria-live="polite" className="min-h-[2.75rem] px-4 pt-1 pb-3 text-[0.8rem] leading-snug text-paper/85">
              {label}
            </p>
            <div className="h-0.5 w-full bg-paper/10">
              <div ref={exitBarRef} className="h-full origin-left scale-x-0 bg-signal" />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Pointer tangan */}
      {status === "active" && (
        <div
          ref={pointerRef}
          aria-hidden
          data-state="idle"
          className="group/pt pointer-events-none fixed top-0 left-0 z-[190] opacity-0 transition-opacity duration-300"
        >
          <div
            ref={ringRef}
            className="absolute -top-6 -left-6 h-12 w-12 rounded-full border-2 border-signal transition-[transform,background-color] duration-200 group-data-[state=hover]/pt:scale-125 group-data-[state=hover]/pt:bg-signal/15 group-data-[state=touch]/pt:scale-75 group-data-[state=touch]/pt:bg-signal/40"
          />
          <div className="absolute -top-1 -left-1 h-2 w-2 rounded-full bg-signal shadow-[0_0_16px_rgba(235,119,44,0.9)]" />
        </div>
      )}

      {/* Notifikasi */}
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            className="meta fixed top-24 left-1/2 z-[190] -translate-x-1/2 rounded-full bg-navy px-5 py-3 text-paper shadow-xl"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function HandIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M18 11V6a2 2 0 0 0-4 0v5" />
      <path d="M14 10V4a2 2 0 0 0-4 0v6" />
      <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}
