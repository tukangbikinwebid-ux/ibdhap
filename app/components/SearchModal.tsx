"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Compass,
  BookOpen,
  GraduationCap,
  MessageCircle,
  Calendar,
  BookMarked,
  Handshake,
  Building2,
  ScrollText,
  HeartHandshake,
  BookText,
  Palette,
  Target,
  BellRing,
  ListTodo,
  Search,
  FileText,
  Settings,
} from "lucide-react";

interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  type: "feature" | "article" | "page";
}

const searchItems: SearchItem[] = [
  // Features
  {
    id: "prayer-time",
    title: "Prayer Time + Adzan",
    description: "Jadwal sholat akurat dan notifikasi adzan",
    category: "Ibadah",
    href: "/sholat",
    icon: BellRing,
    type: "feature",
  },
  {
    id: "prayer-tracker",
    title: "Prayer Tracker",
    description: "Catat dan lacak sholat harian Anda",
    category: "Ibadah",
    href: "/prayer-tracker",
    icon: ListTodo,
    type: "feature",
  },
  {
    id: "qibla",
    title: "Qibla",
    description: "Temukan arah kiblat yang tepat",
    category: "Ibadah",
    href: "/kiblat",
    icon: Compass,
    type: "feature",
  },
  {
    id: "quran",
    title: "Qur'an + Terjemahan",
    description: "Baca Al-Qur'an dengan terjemahan",
    category: "Al-Qur'an",
    href: "/quran",
    icon: BookOpen,
    type: "feature",
  },
  {
    id: "hadith",
    title: "Hadith + Hadith of the day",
    description: "Kumpulan hadits dan hadits harian",
    category: "Al-Qur'an",
    href: "/hadith",
    icon: BookText,
    type: "feature",
  },
  {
    id: "doa-dzikir",
    title: "Doa + Dzikir pagi & petang",
    description: "Kumpulan doa dan dzikir harian",
    category: "Ibadah",
    href: "/doa-dzikir",
    icon: ScrollText,
    type: "feature",
  },
  {
    id: "asmaul-husna",
    title: "Asmaul Husna",
    description: "Pelajari 99 nama Allah yang indah",
    category: "Pengetahuan",
    href: "/asmaul-husna",
    icon: Target,
    type: "feature",
  },
  {
    id: "kajian",
    title: "Kajian (Audio)",
    description: "Dengarkan kajian Islam dari ustadz terkemuka",
    category: "Pengetahuan",
    href: "/kajian",
    icon: GraduationCap,
    type: "feature",
  },
  {
    id: "halal",
    title: "Halal",
    description: "Panduan produk dan gaya hidup halal",
    category: "Kehidupan",
    href: "/halal",
    icon: Handshake,
    type: "feature",
  },
  {
    id: "masjid-mushola",
    title: "Masjid & Mushola",
    description: "Temukan masjid dan mushola terdekat",
    category: "Kehidupan",
    href: "/masjid",
    icon: Building2,
    type: "feature",
  },
  {
    id: "donasi",
    title: "Donasi (Wakaf, Zakat, Kurban, Infaq)",
    description: "Salurkan donasi Anda dengan mudah",
    category: "Sosial",
    href: "/donasi",
    icon: HeartHandshake,
    type: "feature",
  },
  {
    id: "artikel",
    title: "Artikel",
    description: "Baca artikel Islam terbaru dan informatif",
    category: "Pengetahuan",
    href: "/artikel",
    icon: FileText,
    type: "feature",
  },
  {
    id: "tanya-ustadz",
    title: "Tanya Ustaz",
    description: "Ajukan pertanyaan kepada ustadz",
    category: "Konsultasi",
    href: "/tanya-ustadz",
    icon: MessageCircle,
    type: "feature",
  },
  {
    id: "tajwid",
    title: "Tajwid",
    description: "Pelajari ilmu tajwid untuk membaca Al-Qur'an",
    category: "Al-Qur'an",
    href: "/tajwid",
    icon: Palette,
    type: "feature",
  },
  {
    id: "kalender-hijriyah",
    title: "Kalender Hijriyah",
    description: "Lihat kalender Hijriyah dan tanggal penting",
    category: "Pengetahuan",
    href: "/kalender",
    icon: Calendar,
    type: "feature",
  },
  {
    id: "ebook",
    title: "E-Book",
    description: "Koleksi e-book Islam gratis",
    category: "Pengetahuan",
    href: "/ebook",
    icon: BookMarked,
    type: "feature",
  },
  // Sample Articles
  {
    id: "artikel-1",
    title: "Keutamaan Sholat Berjamaah di Masjid",
    description:
      "Sholat berjamaah memiliki keutamaan yang sangat besar dalam Islam",
    category: "Fiqih",
    href: "/artikel/keutamaan-sholat-berjamaah",
    icon: FileText,
    type: "article",
  },
  {
    id: "artikel-2",
    title: "Hikmah Puasa Sunnah Senin Kamis",
    description:
      "Puasa sunnah Senin Kamis memiliki banyak hikmah dan keutamaan",
    category: "Ibadah",
    href: "/artikel/hikmah-puasa-sunnah",
    icon: FileText,
    type: "article",
  },
  {
    id: "artikel-3",
    title: "Cara Menjaga Lisan dalam Kehidupan Sehari-hari",
    description:
      "Lisan adalah salah satu nikmat Allah yang harus kita jaga dengan baik",
    category: "Akhlak",
    href: "/artikel/cara-menjaga-lisan",
    icon: FileText,
    type: "article",
  },
  // Pages
  {
    id: "beranda",
    title: "Beranda",
    description: "Halaman utama aplikasi IbadahApp",
    category: "Navigasi",
    href: "/",
    icon: Search,
    type: "page",
  },
  {
    id: "semua-fitur",
    title: "Semua Fitur",
    description: "Lihat semua fitur yang tersedia di IbadahApp",
    category: "Navigasi",
    href: "/features",
    icon: Settings,
    type: "page",
  },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredItems = searchItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedItems = filteredItems.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, SearchItem[]>);

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
    setSearchQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto p-0 bg-background/95 backdrop-blur-md border-awqaf-border-lightss">
        <DialogHeader className="px-4 py-3 border-b border-awqaf-border-light">
          <DialogTitle className="text-lg font-semibold text-awqaf-primary font-comfortaa">
            Cari di IbadahApp
          </DialogTitle>
        </DialogHeader>

        <Command className="rounded-none border-0">
          <CommandInput
            placeholder="Cari fitur, artikel, atau halaman..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            onKeyDown={handleKeyDown}
            className="border-0 focus:ring-0 font-comfortaa"
          />
          <CommandList className="max-h-96">
            {filteredItems.length === 0 ? (
              <CommandEmpty className="py-6 text-center text-awqaf-foreground-secondary font-comfortaa">
                Tidak ada hasil ditemukan.
              </CommandEmpty>
            ) : (
              Object.entries(groupedItems).map(([category, items]) => (
                <CommandGroup
                  key={category}
                  heading={
                    <span className="text-sm font-semibold text-awqaf-primary font-comfortaa">
                      {category}
                    </span>
                  }
                >
                  {items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <CommandItem
                        key={item.id}
                        value={`${item.title} ${item.description} ${item.category}`}
                        onSelect={() => handleSelect(item.href)}
                        className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-accent-50 hover:text-awqaf-primary transition-colors duration-200"
                      >
                        <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-awqaf-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-card-foreground text-sm font-comfortaa">
                            {item.title}
                          </div>
                          <div className="text-xs text-awqaf-foreground-secondary font-comfortaa line-clamp-1">
                            {item.description}
                          </div>
                        </div>
                        <div className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                          {item.type === "feature" && "Fitur"}
                          {item.type === "article" && "Artikel"}
                          {item.type === "page" && "Halaman"}
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ))
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
