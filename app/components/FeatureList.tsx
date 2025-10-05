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
} from "lucide-react";

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  category: string;
  isNew?: boolean;
  isPopular?: boolean;
}

const features: Feature[] = [
  {
    id: "prayer-time",
    name: "Prayer Time + Adzan",
    description: "Jadwal sholat dan notifikasi adzan berdasarkan lokasi",
    icon: Clock,
    href: "/sholat",
    category: "Ibadah",
    isPopular: true,
  },
  {
    id: "prayer-tracker",
    name: "Prayer Tracker",
    description: "Pantau dan catat sholat harian Anda",
    icon: Target,
    href: "/prayer-tracker",
    category: "Ibadah",
  },
  {
    id: "qibla",
    name: "Qibla",
    description: "Arah kiblat yang akurat menggunakan kompas digital",
    icon: Compass,
    href: "/kiblat",
    category: "Ibadah",
    isPopular: true,
  },
  {
    id: "quran",
    name: "Qur'an + Terjemahan",
    description: "Baca Al-Qur'an dengan terjemahan bahasa Indonesia",
    icon: BookOpen,
    href: "/quran",
    category: "Al-Qur'an",
    isPopular: true,
  },
  {
    id: "hadith",
    name: "Hadith + Hadith of the day",
    description: "Kumpulan hadith shahih dan hadith harian",
    icon: BookMarked,
    href: "/hadith",
    category: "Hadith",
  },
  {
    id: "doa-dzikir",
    name: "Doa + Dzikir pagi & petang",
    description: "Kumpulan doa dan dzikir untuk pagi dan petang",
    icon: Heart,
    href: "/doa-dzikir",
    category: "Doa & Dzikir",
  },
  {
    id: "asmaul-husna",
    name: "Asmaul Husna",
    description: "99 nama-nama Allah yang indah dengan maknanya",
    icon: Star,
    href: "/asmaul-husna",
    category: "Doa & Dzikir",
  },
  {
    id: "kajian",
    name: "Kajian (Audio)",
    description: "Kumpulan kajian Islam dalam format audio",
    icon: Volume2,
    href: "/kajian",
    category: "Kajian",
    isPopular: true,
  },
  {
    id: "halal",
    name: "Halal",
    description: "Cek kehalalan produk makanan dan minuman",
    icon: Utensils,
    href: "/halal",
    category: "Kehidupan",
  },
  {
    id: "masjid",
    name: "Masjid & Mushola",
    description: "Temukan masjid dan mushola terdekat",
    icon: MapPin,
    href: "/masjid",
    category: "Kehidupan",
  },
  {
    id: "donasi",
    name: "Donasi (Wakaf, Zakat, Kurban, Infaq)",
    description: "Platform donasi untuk berbagai amal ibadah",
    icon: Gift,
    href: "/donasi",
    category: "Amal",
  },
  {
    id: "artikel",
    name: "Artikel",
    description: "Artikel Islami dan tips kehidupan Muslim",
    icon: FileText,
    href: "/artikel",
    category: "Edukasi",
  },
  {
    id: "tanya-ustadz",
    name: "Tanya Ustaz",
    description: "Konsultasi keagamaan dengan ustaz berpengalaman",
    icon: MessageCircle,
    href: "/tanya-ustadz",
    category: "Konsultasi",
    isPopular: true,
  },
  {
    id: "tajwid",
    name: "Tajwid",
    description: "Belajar tajwid untuk membaca Al-Qur'an dengan benar",
    icon: BookA,
    href: "/tajwid",
    category: "Al-Qur'an",
  },
  {
    id: "kalender-hijriyah",
    name: "Kalender Hijriyah",
    description: "Kalender Islam dengan tanggal hijriyah",
    icon: Calendar,
    href: "/kalender-hijriyah",
    category: "Kalender",
  },
  {
    id: "ebook",
    name: "E-Book",
    description: "Kumpulan e-book Islami dan referensi",
    icon: Book,
    href: "/ebook",
    category: "Edukasi",
  },
];

interface FeatureListProps {
  searchQuery: string;
}

export default function FeatureList({ searchQuery }: FeatureListProps) {
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
  const groupedFeatures = filteredFeatures.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, Feature[]>);

  if (filteredFeatures.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-awqaf-foreground-secondary" />
        </div>
        <h3 className="text-lg font-semibold text-awqaf-foreground-secondary font-comfortaa mb-2">
          Fitur tidak ditemukan
        </h3>
        <p className="text-sm text-awqaf-foreground-tertiary font-comfortaa">
          Coba gunakan kata kunci yang berbeda
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
                                  Baru
                                </Badge>
                              )}
                              {feature.isPopular && (
                                <Badge className="bg-success text-white text-xs px-1.5 py-0.5 group-hover:bg-success/90 transition-colors duration-200">
                                  Populer
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
