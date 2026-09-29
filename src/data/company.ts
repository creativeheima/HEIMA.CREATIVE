import type { ProcessStep, TechCategory, Value } from "@/content/types";

export const techCategories: TechCategory[] = [
  {
    number: "01",
    title: "Frontend",
    description: "Antarmuka yang cepat, aksesibel, dan konsisten di semua perangkat.",
    items: ["JavaScript", "TypeScript", "React", "Next.js"],
  },
  {
    number: "02",
    title: "Backend",
    description: "API dan logika bisnis yang aman, terstruktur, dan siap berkembang.",
    items: ["Node.js", "PHP", "Laravel", "Python"],
  },
  {
    number: "03",
    title: "Mobile",
    description: "Aplikasi Android & iOS dengan performa native dari satu codebase.",
    items: ["Flutter", "React Native"],
  },
  {
    number: "04",
    title: "Data",
    description: "Desain database relasional yang andal untuk data bisnis kritikal.",
    items: ["PostgreSQL", "MySQL"],
  },
  {
    number: "05",
    title: "Infrastructure",
    description: "Deployment terotomasi, container, dan cloud yang skalabel.",
    items: ["Docker", "Cloud", "API"],
  },
];

export const values: Value[] = [
  {
    number: "01",
    title: "Business First",
    description: "Setiap baris kode berawal dari tujuan bisnis. Teknologi adalah alat, hasil bisnis adalah ukurannya.",
  },
  {
    number: "02",
    title: "Custom Solutions",
    description: "Tidak ada template yang dipaksakan. Solusi dirancang mengikuti alur kerja dan kebutuhan Anda.",
  },
  {
    number: "03",
    title: "Modern Technology",
    description: "Stack teknologi modern yang terbukti, aman, dan didukung ekosistem yang kuat.",
  },
  {
    number: "04",
    title: "Scalable Systems",
    description: "Arsitektur yang siap tumbuh bersama bisnis — dari 10 pengguna hingga 10.000.",
  },
  {
    number: "05",
    title: "Long-term Support",
    description: "Kami tetap ada setelah peluncuran: monitoring, maintenance, dan pengembangan berkelanjutan.",
  },
];

export const processSteps: ProcessStep[] = [
  { number: "01", title: "Discover", description: "Memahami kebutuhan bisnis.", detail: "Workshop, wawancara stakeholder, dan analisis proses untuk menemukan masalah yang sebenarnya." },
  { number: "02", title: "Strategy", description: "Menyusun solusi.", detail: "Scope, arsitektur, timeline, dan estimasi biaya yang jelas dan transparan." },
  { number: "03", title: "Design", description: "Membangun user experience.", detail: "Wireframe, prototipe interaktif, dan design system yang konsisten." },
  { number: "04", title: "Develop", description: "Mengembangkan sistem.", detail: "Sprint dua mingguan dengan demo rutin agar progres selalu terlihat." },
  { number: "05", title: "Test", description: "Quality assurance.", detail: "Pengujian fungsional, performa, keamanan, dan User Acceptance Test." },
  { number: "06", title: "Launch", description: "Deployment.", detail: "Rilis terkontrol, migrasi data, dan pelatihan tim Anda." },
  { number: "07", title: "Support", description: "Maintenance dan improvement.", detail: "Monitoring 24/7, update keamanan, dan iterasi berkelanjutan." },
];
