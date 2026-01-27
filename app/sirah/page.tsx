"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Scroll,
  Star,
  Heart,
  Users,
  BookOpen,
  ChevronRight,
  Library,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/app/hooks/useI18n";

// Import Service & Types
import { useGetSirahQuery, SirahItem } from "@/services/public/sirah.service";

// Import komponen detail
import SirahDetail from "./sirah-detail";

// --- Types & Helper ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

export interface ProcessedSirahItem {
  id: number;
  category: string;
  title: string;
  content: string; // HTML string
  excerpt: string;
}

interface UIText {
  title: string;
  search: string;
  all: string;
  read: string;
  noData: string;
  loading: string;
  error: string;
  retry: string;
}

// Interface untuk Nama Kategori (Mapping dari Backend Category ke Translation UI)
// Asumsi: Backend mengembalikan category key seperti 'nabi', 'muhammad', dll. atau kita mapping manual
interface CategoryNames {
  nabi: string;
  muhammad: string;
  istri: string;
  sahabat: string;
  ulama: string;
}

const UI_TEXT: Record<LocaleCode, UIText> = {
  id: {
    title: "Sirah Nabawiyah",
    search: "Cari kisah...",
    all: "Semua",
    read: "Baca",
    noData: "Tidak ditemukan",
    loading: "Memuat data...",
    error: "Gagal memuat data",
    retry: "Coba Lagi",
  },
  en: {
    title: "Islamic History",
    search: "Search stories...",
    all: "All",
    read: "Read",
    noData: "Not found",
    loading: "Loading data...",
    error: "Failed to load data",
    retry: "Retry",
  },
  ar: {
    title: "السيرة النبوية",
    search: "بحث...",
    all: "الكل",
    read: "اقرأ",
    noData: "غير موجود",
    loading: "جار التحميل...",
    error: "فشل تحميل البيانات",
    retry: "أعد المحاولة",
  },
  fr: {
    title: "Histoire Islamique",
    search: "Rechercher...",
    all: "Tout",
    read: "Lire",
    noData: "Introuvable",
    loading: "Chargement...",
    error: "Échec du chargement",
    retry: "Réessayer",
  },
  kr: {
    title: "이슬람 역사",
    search: "검색...",
    all: "전체",
    read: "읽기",
    noData: "찾을 수 없음",
    loading: "로딩 중...",
    error: "데이터 로드 실패",
    retry: "재시도",
  },
  jp: {
    title: "イスラムの歴史",
    search: "検索...",
    all: "すべて",
    read: "読む",
    noData: "見つかりません",
    loading: "読み込み中...",
    error: "読み込み失敗",
    retry: "再試行",
  },
};

const CATEGORY_NAMES: Record<LocaleCode, CategoryNames> = {
  id: {
    nabi: "Nabi",
    muhammad: "Muhammad SAW",
    istri: "Istri",
    sahabat: "Sahabat",
    ulama: "Ulama",
  },
  en: {
    nabi: "Prophets",
    muhammad: "Muhammad PBUH",
    istri: "Wives",
    sahabat: "Companions",
    ulama: "Scholars",
  },
  ar: {
    nabi: "الأنبياء",
    muhammad: "محمد ﷺ",
    istri: "الزوجات",
    sahabat: "الصحابة",
    ulama: "العلماء",
  },
  fr: {
    nabi: "Prophètes",
    muhammad: "Muhammad PBSL",
    istri: "Épouses",
    sahabat: "Compagnons",
    ulama: "Savants",
  },
  kr: {
    nabi: "선지자",
    muhammad: "무함마드",
    istri: "아내",
    sahabat: "동료",
    ulama: "학자",
  },
  jp: {
    nabi: "預言者",
    muhammad: "ムハンマド",
    istri: "妻",
    sahabat: "教友",
    ulama: "学者",
  },
};

export default function SirahPage() {
  const { locale } = useI18n();
  const safeLocale = (
    UI_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = UI_TEXT[safeLocale];
  const cats = CATEGORY_NAMES[safeLocale];

  // --- API HOOK ---
  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useGetSirahQuery({ page: 1 });
  const sirahData = apiResponse?.data?.data || [];

  // STATE
  const [selectedStory, setSelectedStory] = useState<ProcessedSirahItem | null>(
    null,
  );
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // --- HELPER: Get Translation ---
  const getTranslation = (item: SirahItem, field: "title" | "content") => {
    const trans = item.translations?.find((tr) => tr.locale === safeLocale);
    if (trans && trans[field]) return trans[field];

    const enTrans = item.translations?.find((tr) => tr.locale === "en");
    if (enTrans && enTrans[field]) return enTrans[field];

    if (field === "title") return item.title;
    return item.content;
  };

  const stripHtml = (html: string) => {
    if (typeof window === "undefined") {
      return html.replace(/<[^>]*>?/gm, "");
    }
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // FILTER DATA
  const displayedData = useMemo(() => {
    return sirahData
      .filter((item) => {
        // Normalisasi kategori dari backend jika perlu.
        // Misal backend kirim "Kisah Nabi", kita perlu mapping ke 'nabi' atau 'muhammad'
        // Untuk sederhananya, kita asumsikan backend kirim kategori yang konsisten atau kita filter by string
        // Di sini kita pakai simple string matching dulu.

        // Jika mau strict category mapping:
        // const normalizedCat = item.category.toLowerCase().includes('muhammad') ? 'muhammad' : ...

        const itemTitle = getTranslation(item, "title").toLowerCase();
        const matchSearch = itemTitle.includes(searchQuery.toLowerCase());

        // Category filter logic (Simplified)
        // Jika activeCategory 'all', lolos. Jika tidak, cek apakah kategori item mengandung kata kunci kategori aktif
        const matchCat =
          activeCategory === "all" ||
          item.category.toLowerCase().includes(activeCategory);

        return matchCat && matchSearch;
      })
      .map((item) => ({
        id: item.id,
        category: item.category, // Raw category from backend
        title: getTranslation(item, "title"),
        content: getTranslation(item, "content"),
        excerpt:
          stripHtml(getTranslation(item, "content")).substring(0, 100) + "...",
      }));
  }, [sirahData, safeLocale, activeCategory, searchQuery]);

  // JIKA DETAIL STORY DIPILIH
  if (selectedStory) {
    return (
      <SirahDetail
        story={selectedStory}
        locale={safeLocale}
        onBack={() => setSelectedStory(null)}
        // Kirim raw category atau mapping jika ada
        categoryLabel={selectedStory.category}
      />
    );
  }

  // TAMPILAN LIST UTAMA
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
      dir={safeLocale === "ar" ? "rtl" : "ltr"}
    >
      {/* Container MAX-W-MD */}
      <div className="max-w-md mx-auto min-h-screen bg-transparent relative">
        {/* Header List */}
        <header className="bg-background/80 backdrop-blur-md shadow-sm border-b border-awqaf-border-light sticky top-0 z-30">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-accent-100 text-awqaf-primary"
                >
                  <ArrowLeft
                    className={`w-5 h-5 ${safeLocale === "ar" ? "rotate-180" : ""}`}
                  />
                </Button>
              </Link>
              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa flex-1">
                {t.title}
              </h1>
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                className={`absolute ${safeLocale === "ar" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`}
              />
              <Input
                placeholder={t.search}
                className={`${safeLocale === "ar" ? "pr-9 pl-4" : "pl-9 pr-4"} bg-white border-awqaf-border-light rounded-xl`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Categories Tabs */}
          <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
            {[
              { id: "all", label: t.all, icon: Library },
              { id: "nabi", label: cats.nabi, icon: Scroll }, // filter keyword: 'nabi'
              { id: "muhammad", label: cats.muhammad, icon: Star }, // filter keyword: 'muhammad'
              { id: "istri", label: cats.istri, icon: Heart },
              { id: "sahabat", label: cats.sahabat, icon: Users },
              { id: "ulama", label: cats.ulama, icon: BookOpen },
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold font-comfortaa whitespace-nowrap transition-all duration-200
                    ${
                      isActive
                        ? "bg-awqaf-primary text-white shadow-md"
                        : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-50"
                    }
                  `}
                >
                  <Icon className="w-3 h-3" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* List Content */}
        <main className="px-4 py-4 space-y-3">
          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm">
              <Loader2 className="w-8 h-8 text-awqaf-primary animate-spin mb-2" />
              <p className="text-sm text-slate-500">{t.loading}</p>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="flex flex-col items-center justify-center py-10 bg-white rounded-2xl shadow-sm border border-red-100 p-6 text-center">
              <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
              <p className="text-sm text-slate-600 mb-4">{t.error}</p>
              <Button
                onClick={() => refetch()}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                {t.retry}
              </Button>
            </div>
          )}

          {/* Data List */}
          {!isLoading && !isError && displayedData.length > 0
            ? displayedData.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedStory(item)}
                  className="cursor-pointer"
                >
                  <Card className="border-awqaf-border-light hover:shadow-md hover:bg-white/80 transition-all active:scale-[0.99] bg-white group rounded-xl">
                    <CardContent className="p-4 flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-200 transition-colors">
                        {item.category.toLowerCase().includes("nabi") && (
                          <Scroll className="w-6 h-6 text-awqaf-primary" />
                        )}
                        {item.category.toLowerCase().includes("muhammad") && (
                          <Star className="w-6 h-6 text-awqaf-primary" />
                        )}
                        {item.category.toLowerCase().includes("istri") && (
                          <Heart className="w-6 h-6 text-awqaf-primary" />
                        )}
                        {/* Default Icon */}
                        {!item.category
                          .toLowerCase()
                          .match(/nabi|muhammad|istri/) && (
                          <BookOpen className="w-6 h-6 text-awqaf-primary" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <Badge
                            variant="outline"
                            className="text-[10px] h-5 px-1.5 border-awqaf-primary/30 text-awqaf-primary bg-accent-50 capitalize"
                          >
                            {item.category}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-awqaf-primary font-comfortaa mb-1 line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2 font-comfortaa">
                          {item.excerpt}
                        </p>

                        <div className="mt-3 flex items-center text-[10px] font-bold text-awqaf-primary/80 group-hover:text-awqaf-primary">
                          {t.read}
                          <ChevronRight
                            className={`w-3 h-3 ${safeLocale === "ar" ? "mr-1 rotate-180" : "ml-1"}`}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            : !isLoading &&
              !isError && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 font-comfortaa">
                    {t.noData}
                  </p>
                </div>
              )}
        </main>
      </div>
    </div>
  );
}