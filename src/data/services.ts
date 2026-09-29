import type { Service } from "@/content/types";
import { photos } from "@/lib/images";


export const services: Service[] = [
  {
    slug: "website-development",
    number: "01",
    title: "Website Development",
    category: "Web",
    summary:
      "Website perusahaan, portal, dan web app yang cepat, aman, SEO-ready, dan mudah dikelola tim Anda.",
    capabilities: ["Corporate Website", "Web Application", "E-Commerce", "CMS & Headless", "SEO Teknis"],
    image: photos.codeLaptop,
  },
  {
    slug: "mobile-app-development",
    number: "02",
    title: "Mobile App Development",
    category: "Mobile",
    summary:
      "Aplikasi Android & iOS berkinerja tinggi dengan satu codebase, siap rilis ke Play Store dan App Store.",
    capabilities: ["Flutter", "React Native", "Offline-first", "Push Notification", "App Store Release"],
    image: photos.mobile,
  },
  {
    slug: "custom-software",
    number: "03",
    title: "Custom Software",
    category: "Software",
    summary:
      "Software yang dirancang khusus mengikuti alur kerja bisnis Anda — bukan sebaliknya.",
    capabilities: ["ERP & CRM", "Dashboard Internal", "Otomasi Proses", "Integrasi API", "Multi-tenant"],
    image: photos.codeScreen,
  },
  {
    slug: "system-development",
    number: "04",
    title: "System Development",
    category: "Systems",
    summary:
      "Sistem informasi terintegrasi: manajemen data, inventori, keuangan, hingga reservasi dan operasional.",
    capabilities: ["Sistem Informasi", "Arsitektur Backend", "Database Design", "Role & Permission", "Reporting"],
    image: photos.servers,
  },
  {
    slug: "ui-ux-design",
    number: "05",
    title: "UI/UX Design",
    category: "Design",
    summary:
      "Riset, wireframe, dan desain antarmuka yang membuat produk digital mudah dipahami dan nyaman dipakai.",
    capabilities: ["UX Research", "Wireframing", "Design System", "Prototyping", "Usability Testing"],
    image: photos.planning,
  },
  {
    slug: "digital-transformation",
    number: "06",
    title: "Digital Transformation",
    category: "Transformation",
    summary:
      "Mendampingi bisnis beralih dari proses manual ke ekosistem digital yang terukur dan efisien.",
    capabilities: ["Digitalisasi Proses", "Cloud Migration", "Data Strategy", "Change Management", "Training"],
    image: photos.network,
  },
  {
    slug: "it-consulting",
    number: "07",
    title: "IT Consulting",
    category: "Consulting",
    summary:
      "Konsultasi arsitektur, pemilihan teknologi, dan roadmap digital agar investasi IT tepat sasaran.",
    capabilities: ["Tech Audit", "Architecture Review", "Roadmap", "Vendor Assessment", "Security Review"],
    image: photos.consulting,
  },
  {
    slug: "maintenance-support",
    number: "08",
    title: "Maintenance & Support",
    category: "Support",
    summary:
      "Monitoring, update keamanan, backup, dan pengembangan berkelanjutan dengan dukungan 24/7.",
    capabilities: ["24/7 Monitoring", "Security Patch", "Backup & Recovery", "SLA Support", "Continuous Improvement"],
    image: photos.engineer,
  },
];
