import type { GestureRecognizer } from "@mediapipe/tasks-vision";

/** Versi harus sama dengan paket @mediapipe/tasks-vision yang terpasang. */
const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";
const MODEL_URL = "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task";

export type HandResult = {
  landmarks: { x: number; y: number; z: number }[] | undefined;
  gesture: string | undefined;
};

export type HandEngine = {
  detect: (video: HTMLVideoElement, now: number) => HandResult;
  connections: { start: number; end: number }[];
  close: () => void;
};

/**
 * Memuat MediaPipe Gesture Recognizer (lazy — hanya saat Gesture Mode diaktifkan).
 * Semua pemrosesan berjalan di perangkat pengguna; video tidak dikirim ke server.
 */
export async function createHandEngine(): Promise<HandEngine> {
  const { FilesetResolver, GestureRecognizer } = await import("@mediapipe/tasks-vision");
  const fileset = await FilesetResolver.forVisionTasks(WASM_URL);

  const create = (delegate: "GPU" | "CPU") =>
    GestureRecognizer.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODEL_URL, delegate },
      runningMode: "VIDEO",
      numHands: 1,
      minHandDetectionConfidence: 0.6,
      minHandPresenceConfidence: 0.6,
      minTrackingConfidence: 0.5,
    });

  let recognizer: GestureRecognizer;
  try {
    recognizer = await create("GPU");
  } catch {
    recognizer = await create("CPU");
  }

  return {
    connections: GestureRecognizer.HAND_CONNECTIONS,
    detect(video, now) {
      const result = recognizer.recognizeForVideo(video, now);
      return { landmarks: result.landmarks[0], gesture: result.gestures[0]?.[0]?.categoryName };
    },
    close: () => recognizer.close(),
  };
}
