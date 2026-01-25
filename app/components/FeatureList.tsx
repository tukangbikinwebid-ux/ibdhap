"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Search,
  Clock,
  Target,
  Compass,
  BookOpen,
  BookMarked,
  Heart,
  Star,
  Volume2,
  Utensils,
  MapPin,
  Gift,
  FileText,
  MessageCircle,
  BookA,
  Calendar,
  Book,
  UserCheck,
  Notebook,
  Scroll,
  ShieldCheck,
  ListOrdered,
  HelpCircle,
  Plane,
  Repeat,
  LifeBuoy,
  Moon,
} from "lucide-react";
import { useI18n } from "@/app/hooks/useI18n";

// Definisi Tipe Data
interface FeatureConfig {
  id: string;
  defaultName: string;
  defaultDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  defaultCategory: string; // Kategori dalam Bahasa Indonesia (untuk fallback & grouping key)
  isNew?: boolean;
  isPopular?: boolean;
}

// Data Fitur Statis (Default Bahasa Indonesia)
const FEATURES_CONFIG: FeatureConfig[] = [
  // --- Ramadhan (Special Category) ---
  {
    id: "ramadhan",
    defaultName: "Ramadhan",
    defaultDescription: "Dashboard khusus Ramadhan dengan khatam Qur'an, tracking ibadah, dan fitur spesial lainnya",
    icon: Moon,
    href: "/ramadhan",
    defaultCategory: "Ramadhan",
    isNew: true,
    isPopular: true,
  },

  // --- Ibadah ---
  {
    id: "prayer-time",
    defaultName: "Waktu Sholat + Adzan",
    defaultDescription: "Jadwal sholat dan notifikasi adzan berdasarkan lokasi",
    icon: Clock,
    href: "/sholat",
    defaultCategory: "Ibadah",
    isPopular: true,
  },
  {
    id: "prayer-tracker",
    defaultName: "Prayer Tracker",
    defaultDescription: "Pantau dan catat sholat harian Anda",
    icon: Target,
    href: "/prayer-tracker",
    defaultCategory: "Ibadah",
  },
  {
    id: "qibla",
    defaultName: "Arah Kiblat",
    defaultDescription: "Arah kiblat yang akurat menggunakan kompas digital",
    icon: Compass,
    href: "/kiblat",
    defaultCategory: "Ibadah",
    isPopular: true,
  },

  // --- Al-Qur'an ---
  {
    id: "quran",
    defaultName: "Al-Qur'an + Terjemahan",
    defaultDescription: "Baca Al-Qur'an dengan terjemahan bahasa Indonesia",
    icon: BookOpen,
    href: "/quran",
    defaultCategory: "Al-Qur'an",
    isPopular: true,
  },
  {
    id: "tajwid",
    defaultName: "Ilmu Tajwid",
    defaultDescription: "Belajar tajwid untuk membaca Al-Qur'an dengan benar",
    icon: BookA,
    href: "/tajwid",
    defaultCategory: "Al-Qur'an",
  },

  // --- Hadits ---
  {
    id: "hadith",
    defaultName: "Hadits",
    defaultDescription: "Kumpulan hadits shahih dan hadits harian",
    icon: BookMarked,
    href: "/hadith",
    defaultCategory: "Hadits",
  },

  // --- Doa & Dzikir ---
  {
    id: "doa-dzikir",
    defaultName: "Doa & Dzikir",
    defaultDescription: "Kumpulan doa dan dzikir untuk pagi dan petang",
    icon: Heart,
    href: "/doa-dzikir",
    defaultCategory: "Doa & Dzikir",
  },
  {
    id: "asmaul-husna",
    defaultName: "Asmaul Husna",
    defaultDescription: "99 nama-nama Allah yang indah dengan maknanya",
    icon: Star,
    href: "/asmaul-husna",
    defaultCategory: "Doa & Dzikir",
  },

  // --- Kajian ---
  {
    id: "kajian",
    defaultName: "Kajian Audio",
    defaultDescription: "Kumpulan kajian Islam dalam format audio",
    icon: Volume2,
    href: "/kajian",
    defaultCategory: "Kajian",
    isPopular: true,
  },

  // --- Kehidupan (Lifestyle) ---
  {
    id: "halal",
    defaultName: "Makanan Halal",
    defaultDescription: "Rekomendasi tempat makan dan restoran yang halal",
    icon: Utensils,
    href: "/halal",
    defaultCategory: "Kehidupan",
  },
  {
    id: "masjid",
    defaultName: "Masjid Terdekat",
    defaultDescription: "Temukan masjid dan mushola terdekat",
    icon: MapPin,
    href: "/masjid",
    defaultCategory: "Kehidupan",
  },
  {
    id: "event",
    defaultName: "Event Islami",
    defaultDescription: "Kumpulan event Islam dan keagamaan",
    icon: Calendar,
    href: "/event",
    defaultCategory: "Kehidupan",
  },

  // --- Amal ---
  {
    id: "donasi",
    defaultName: "Donasi & Zakat",
    defaultDescription: "Platform donasi, wakaf, zakat, kurban, dan infaq",
    icon: Gift,
    href: "/donasi",
    defaultCategory: "Amal",
    isNew: true,
    isPopular: true,
  },
  {
    id: "tasbih",
    defaultName: "Tasbih Digital",
    defaultDescription: "Hitung dzikir harian Anda dengan mudah",
    icon: UserCheck,
    href: "/tasbih-digital",
    defaultCategory: "Amal",
  },

  // --- Edukasi ---
  {
    id: "artikel",
    defaultName: "Artikel Islami",
    defaultDescription: "Artikel Islami dan tips kehidupan Muslim",
    icon: FileText,
    href: "/artikel",
    defaultCategory: "Edukasi",
  },
  {
    id: "kamus-istilah",
    defaultName: "Kamus Istilah",
    defaultDescription: "Kamus istilah Islami dan maknanya",
    icon: BookOpen,
    href: "/kamus-istilah",
    defaultCategory: "Edukasi",
  },
  {
    id: "bahasa-arab",
    defaultName: "Belajar Bahasa Arab",
    defaultDescription: "Materi dasar bahasa Arab untuk Al-Qur'an",
    icon: BookOpen,
    href: "/bahasa-arab",
    defaultCategory: "Edukasi",
  },
  {
    id: "ebook",
    defaultName: "E-Book Islami",
    defaultDescription: "Kumpulan e-book Islami dan referensi",
    icon: Book,
    href: "/ebook",
    defaultCategory: "Edukasi",
  },
  {
    id: "sirah",
    defaultName: "Sirah Nabawiyah",
    defaultDescription: "Kisah para Nabi, Istri Nabi, Sahabat, dan Ulama",
    icon: Scroll,
    href: "/sirah",
    defaultCategory: "Edukasi",
    isNew: true,
  },
  {
    id: "rukun-iman",
    defaultName: "Rukun Iman",
    defaultDescription: "Pelajari 6 pilar keimanan dalam Islam",
    icon: ShieldCheck,
    href: "/rukun-iman",
    defaultCategory: "Edukasi",
  },
  {
    id: "rukun-islam",
    defaultName: "Rukun Islam",
    defaultDescription: "Pelajari 5 pilar utama agama Islam",
    icon: ListOrdered,
    href: "/rukun-islam",
    defaultCategory: "Edukasi",
  },

  // --- Konsultasi ---
  {
    id: "tanya-ustadz",
    defaultName: "Tanya Ustadz",
    defaultDescription: "Konsultasi keagamaan dengan ustadz berpengalaman",
    icon: MessageCircle,
    href: "/tanya-ustadz",
    defaultCategory: "Konsultasi",
    isPopular: true,
  },
  {
    id: "fatwa-syaikh",
    defaultName: "Fatwa Ulama",
    defaultDescription: "Kumpulan tanya jawab dan fatwa dari para Syaikh",
    icon: HelpCircle,
    href: "/fatwa",
    defaultCategory: "Konsultasi",
  },

  // --- Kalender ---
  {
    id: "kalender-hijriyah",
    defaultName: "Kalender Hijriyah",
    defaultDescription: "Kalender Islam dengan tanggal hijriyah",
    icon: Calendar,
    href: "/kalender-hijriyah",
    defaultCategory: "Kalender",
  },

  // --- Template ---
  {
    id: "surat",
    defaultName: "Template Surat",
    defaultDescription: "Buat surat resmi kebutuhan masjid/nikah",
    icon: FileText,
    href: "/template-surat",
    defaultCategory: "Template",
  },

  // --- Kalkulator ---
  {
    id: "kal-zakat",
    defaultName: "Kalkulator Zakat",
    defaultDescription: "Hitung kewajiban zakat mal dan fitrah",
    icon: Notebook,
    href: "/kalkulator/zakat",
    defaultCategory: "Kalkulator",
  },
  {
    id: "kal-waris",
    defaultName: "Kalkulator Waris",
    defaultDescription: "Simulasi pembagian harta waris menurut Islam",
    icon: Notebook,
    href: "/kalkulator/waris",
    defaultCategory: "Kalkulator",
  },

  // --- Haji & Umrah (BARU) ---
  {
    id: "panduan-haji",
    defaultName: "Panduan Haji & Umrah",
    defaultDescription: "Tata cara lengkap ibadah Haji dan Umrah",
    icon: BookOpen,
    href: "/haji-umrah/panduan",
    defaultCategory: "Haji & Umrah",
  },
  {
    id: "perjalanan-haji",
    defaultName: "Perjalanan Haji",
    defaultDescription: "Lacak dan rencanakan perjalanan ibadah Haji",
    icon: Plane,
    href: "/haji-umrah/perjalanan",
    defaultCategory: "Haji & Umrah",
  },
  {
    id: "badal-haji",
    defaultName: "Badal Haji & Umrah",
    defaultDescription: "Layanan amanah untuk badal Haji dan Umrah",
    icon: Repeat,
    href: "/haji-umrah/badal",
    defaultCategory: "Haji & Umrah",
  },

  // --- Lainnya (BARU) ---
  {
    id: "bantuan",
    defaultName: "Pusat Bantuan",
    defaultDescription: "Informasi bantuan dan layanan pengguna",
    icon: LifeBuoy,
    href: "/bantuan",
    defaultCategory: "Lainnya",
  },
];

interface FeatureListProps {
  searchQuery: string;
}

export default function FeatureList({ searchQuery }: FeatureListProps) {
  // Ambil fungsi 't' dari hook.
  // Karena hook useI18n men-trigger event window, state 'locale' di dalam hook
  // akan berubah, memicu re-render pada komponen ini.
  const { t } = useI18n();

  // PROSES TRANSLASI
  // Kita melakukan mapping langsung setiap render agar reaktif terhadap perubahan bahasa.
  const features = FEATURES_CONFIG.map((f) => {
    // 1. Generate Key yang aman untuk kategori
    // Contoh: "Doa & Dzikir" -> "doa_dzikir"
    const categoryKeyRaw = f.defaultCategory
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

    const nameKey = `features.${f.id}.name`;
    const descKey = `features.${f.id}.description`;
    const categoryKey = `categories.${categoryKeyRaw}`;

    // 2. Ambil terjemahan dengan Fallback
    // Hook t() yang baru sudah support fallback value sebagai parameter kedua
    // Contoh: t("features.sholat.name", "Waktu Sholat")
    const transName = t(nameKey, f.defaultName);
    const transDesc = t(descKey, f.defaultDescription);
    const transCategory = t(categoryKey, f.defaultCategory);

    return {
      ...f,
      name: transName,
      description: transDesc,
      category: transCategory,
    };
  });

  // Filter features based on search query
  const filteredFeatures = features.filter((feature) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      feature.name.toLowerCase().includes(query) ||
      feature.description.toLowerCase().includes(query) ||
      feature.category.toLowerCase().includes(query)
    );
  });

  // Group features by category
  const groupedFeatures = filteredFeatures.reduce(
    (acc, feature) => {
      if (!acc[feature.category]) {
        acc[feature.category] = [];
      }
      acc[feature.category].push(feature);
      return acc;
    },
    {} as Record<string, typeof features>,
  );

  if (filteredFeatures.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-awqaf-foreground-secondary" />
        </div>
        <h3 className="text-lg font-semibold text-awqaf-foreground-secondary font-comfortaa mb-2">
          {t("features.notFoundTitle", "Fitur tidak ditemukan")}
        </h3>
        <p className="text-sm text-awqaf-foreground-tertiary font-comfortaa">
          {t("features.notFoundDesc", "Coba gunakan kata kunci yang berbeda")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
        <div key={category} className="space-y-3">
          <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
            {category}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {categoryFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.id} href={feature.href}>
                  <Card className="border-awqaf-border-light hover:shadow-md hover:bg-accent-50 hover:border-awqaf-primary/30 transition-all duration-200 active:scale-95 h-full group">
                    <CardContent className="p-3 flex flex-col h-full">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-10 h-10 bg-accent-100 group-hover:bg-accent-200 rounded-full flex items-center justify-center mb-2 transition-colors duration-200">
                          <Icon className="w-5 h-5 text-awqaf-primary group-hover:text-awqaf-primary" />
                        </div>
                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex flex-col items-center gap-1 mb-2">
                            <h3 className="font-semibold text-card-foreground group-hover:text-awqaf-primary text-xs font-comfortaa leading-tight transition-colors duration-200">
                              {feature.name}
                            </h3>
                            <div className="flex gap-1">
                              {feature.isNew && (
                                <Badge className="bg-info text-white text-xs px-1.5 py-0.5 group-hover:bg-info/90 transition-colors duration-200">
                                  {t("common.new", "Baru")}
                                </Badge>
                              )}
                              {feature.isPopular && (
                                <Badge className="bg-success text-white text-xs px-1.5 py-0.5 group-hover:bg-success/90 transition-colors duration-200">
                                  {t("common.popular", "Populer")}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-awqaf-foreground-secondary group-hover:text-awqaf-foreground-primary font-comfortaa leading-tight line-clamp-3 transition-colors duration-200">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}