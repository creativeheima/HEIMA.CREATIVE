import type { Project } from "@/content/types";
import { photos } from "@/lib/images";

/**
 * Project klien HEIMA.CREATIVE.
 * Teks deskripsi masih DRAFT — sesuaikan dengan detail sistem yang sebenarnya.
 * `year`, `technology`, dan `results` sengaja dikosongkan (tidak ditampilkan) sampai diisi data asli.
 * Menambah project = menambah satu objek; halaman detail, sitemap, dan metadata dibuat otomatis.
 */
export const projects: Project[] = [
  {
    slug: "pt-akp-batching-plant-system",
    number: "01",
    title: "Batching Plant System",
    category: "Industrial",
    client: "PT AKP",
    industry: "Konstruksi & Beton",
    services: ["System Development", "Custom Software", "Maintenance & Support"],
    technology: [],
    excerpt: "Sistem informasi batching plant untuk PT AKP — mendukung pencatatan dan pemantauan operasional produksi beton.",
    overview:
      "HEIMA.CREATIVE membangun sistem batching plant untuk PT AKP, membantu tim operasional mencatat, memantau, dan melaporkan proses produksi beton secara terstruktur dalam satu sistem.",
    problem:
      "Operasional batching plant melibatkan banyak data — order, material, produksi, dan pengiriman. Tanpa sistem terpusat, data sulit dipantau dan laporan membutuhkan waktu untuk disusun.",
    solution:
      "Sistem batching plant yang dirancang mengikuti alur kerja PT AKP, sehingga data operasional tercatat rapi dan dapat diakses oleh tim operasional maupun manajemen.",
    implementation: [
      "Analisis kebutuhan bersama tim operasional PT AKP",
      "Perancangan alur sistem dan struktur database",
      "Pengembangan dan pengujian sistem",
      "Implementasi, pelatihan pengguna, dan pendampingan",
    ],
    results: [],
    cover: photos.construction,
    gallery: [photos.constructionCrew, photos.engineeringPlan, photos.codeScreen],
    size: "large",
  },
  {
    slug: "grand-artos-hotel-inventory-asset-invoice",
    number: "02",
    title: "Hotel Inventory, Asset & Invoice System",
    category: "Hospitality",
    client: "Grand Artos Hotel",
    industry: "Hospitality",
    services: ["System Development", "Custom Software", "UI/UX Design"],
    technology: [],
    excerpt: "Sistem inventaris, manajemen aset, dan invoice untuk Grand Artos Hotel dalam satu platform terintegrasi.",
    overview:
      "Untuk Grand Artos Hotel, HEIMA.CREATIVE mengembangkan sistem yang menyatukan pengelolaan inventaris, aset, dan penagihan (invoice) hotel sehingga operasional back-office lebih tertata.",
    problem:
      "Pengelolaan stok barang, aset hotel, dan dokumen tagihan yang terpisah-pisah membuat pelacakan data dan penyusunan laporan menjadi lebih sulit.",
    solution:
      "Sistem terintegrasi dengan tiga modul utama — inventory, aset, dan invoice — yang saling terhubung dan dapat diakses sesuai peran pengguna di hotel.",
    implementation: [
      "Pemetaan proses inventaris, aset, dan penagihan hotel",
      "Perancangan modul dan hak akses pengguna",
      "Pengembangan dan pengujian per modul",
      "Implementasi, pelatihan staf, dan pendampingan",
    ],
    results: [],
    cover: photos.hotelNight,
    gallery: [photos.inventory, photos.invoice, photos.hotelResort],
    size: "medium",
  },
  {
    slug: "kedai-teduh-cafe-application",
    number: "03",
    title: "Cafe Application",
    category: "Food & Beverage",
    client: "Kedai Teduh",
    industry: "Food & Beverage",
    services: ["Custom Software", "UI/UX Design"],
    technology: [],
    excerpt: "Aplikasi cafe untuk Kedai Teduh — membantu pengelolaan pesanan dan operasional harian kedai.",
    overview:
      "HEIMA.CREATIVE membangun aplikasi cafe untuk Kedai Teduh yang dirancang sederhana dan cepat digunakan oleh tim di jam operasional yang sibuk.",
    problem:
      "Operasional cafe membutuhkan pencatatan pesanan yang cepat dan akurat, serta data penjualan yang mudah dipantau oleh pemilik usaha.",
    solution:
      "Aplikasi cafe dengan antarmuka yang ringkas dan mudah dipelajari, disesuaikan dengan alur kerja Kedai Teduh.",
    implementation: [
      "Observasi alur kerja dan kebutuhan kedai",
      "Desain antarmuka yang cepat dan mudah digunakan",
      "Pengembangan dan pengujian aplikasi",
      "Implementasi dan pelatihan tim kedai",
    ],
    results: [],
    cover: photos.cafe,
    gallery: [photos.coffee, photos.latte, photos.cafeSign],
    size: "large",
  },
  {
    slug: "cv-sanjaya-ac-help-desk",
    number: "04",
    title: "AC Service Help Desk",
    category: "Service",
    client: "CV Sanjaya",
    industry: "Jasa Servis AC",
    services: ["System Development", "Custom Software"],
    technology: [],
    excerpt: "Sistem help desk untuk CV Sanjaya — mengelola permintaan layanan servis AC dan memantau status penanganannya.",
    overview:
      "Untuk CV Sanjaya, HEIMA.CREATIVE mengembangkan sistem help desk yang membantu tim mengelola permintaan layanan servis AC dari pelanggan secara terorganisir.",
    problem:
      "Permintaan servis yang masuk dari berbagai saluran sulit dilacak, sehingga status penanganan dan riwayat layanan pelanggan tidak mudah dipantau.",
    solution:
      "Sistem help desk berbasis tiket untuk mencatat setiap permintaan servis AC dan memantau status penanganannya hingga selesai.",
    implementation: [
      "Pemetaan alur layanan servis AC",
      "Perancangan sistem tiket dan status pekerjaan",
      "Pengembangan dan pengujian sistem",
      "Implementasi dan pelatihan tim",
    ],
    results: [],
    cover: photos.acTechnician,
    gallery: [photos.supportTeam, photos.contactUs, photos.codeLaptop],
    size: "medium",
  },
];
