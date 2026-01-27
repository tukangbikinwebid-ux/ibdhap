"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  MessageCircleQuestion, // Icon Tanya
  User, // Icon Penanya/Syaikh
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/app/hooks/useI18n";

// Import Service & Types
import {
  useGetFatwaSyaikhQuery,
  FatwaItem,
} from "@/services/public/fatwa.service";

// Import komponen detail
import FatwaDetail from "./fatwa-detail";

// --- Types & Helper ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

export interface ProcessedFatwaItem {
  id: number;
  sheikh: string;
  category: string;
  question: string;
  answer: string; // HTML string
}

interface UIText {
  title: string;
  subtitle: string;
  search: string;
  all: string;
  read: string;
  noData: string;
  loading: string;
  error: string;
  retry: string;
}

// Interface Category Names (Mapping jika diperlukan, atau pakai raw category)
interface CategoryNames {
  ibadah: string;
  muamalah: string;
  aqidah: string;
  adab: string;
}

const UI_TEXT: Record<LocaleCode, UIText> = {
  id: {
    title: "Fatwa Ulama",
    subtitle: "Kumpulan Tanya Jawab",
    search: "Cari topik...",
    all: "Semua",
    read: "Lihat Jawaban",
    noData: "Fatwa tidak ditemukan",
    loading: "Memuat data...",
    error: "Gagal memuat data",
    retry: "Coba Lagi",
  },
  en: {
    title: "Scholars' Fatwa",
    subtitle: "Q&A Collection",
    search: "Search topic...",
    all: "All",
    read: "See Answer",
    noData: "No fatwa found",
    loading: "Loading data...",
    error: "Failed to load data",
    retry: "Retry",
  },
  ar: {
    title: "فتاوى العلماء",
    subtitle: "مجموعة أسئلة وأجوبة",
    search: "بحث...",
    all: "الكل",
    read: "انظر الإجابة",
    noData: "لا توجد فتاوى",
    loading: "جار التحميل...",
    error: "فشل تحميل البيانات",
    retry: "أعد المحاولة",
  },
  fr: {
    title: "Fatwas des Savants",
    subtitle: "Collection Q&R",
    search: "Rechercher...",
    all: "Tout",
    read: "Voir la réponse",
    noData: "Aucune fatwa trouvée",
    loading: "Chargement...",
    error: "Échec du chargement",
    retry: "Réessayer",
  },
  kr: {
    title: "학자들의 파트와",
    subtitle: "Q&A 모음",
    search: "검색...",
    all: "전체",
    read: "답변 보기",
    noData: "결과 없음",
    loading: "로딩 중...",
    error: "데이터 로드 실패",
    retry: "재시도",
  },
  jp: {
    title: "学者のファトワ",
    subtitle: "Q&Aコレクション",
    search: "検索...",
    all: "すべて",
    read: "回答を見る",
    noData: "見つかりません",
    loading: "読み込み中...",
    error: "読み込み失敗",
    retry: "再試行",
  },
};

const CATEGORIES: Record<LocaleCode, CategoryNames> = {
  id: {
    ibadah: "Ibadah",
    muamalah: "Muamalah",
    aqidah: "Aqidah",
    adab: "Adab",
  },
  en: {
    ibadah: "Worship",
    muamalah: "Transaction",
    aqidah: "Creed",
    adab: "Etiquette",
  },
  ar: {
    ibadah: "العبادات",
    muamalah: "المعاملات",
    aqidah: "العقيدة",
    adab: "الآداب",
  },
  fr: {
    ibadah: "Culte",
    muamalah: "Transactions",
    aqidah: "Croyance",
    adab: "Éthique",
  },
  kr: { ibadah: "예배", muamalah: "거래", aqidah: "신조", adab: "에티켓" },
  jp: { ibadah: "礼拝", muamalah: "取引", aqidah: "信条", adab: "作法" },
};

export default function FatwaPage() {
  const { locale } = useI18n();
  const safeLocale = (
    UI_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = UI_TEXT[safeLocale];
  const cats = CATEGORIES[safeLocale];

  // --- API HOOK ---
  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useGetFatwaSyaikhQuery({ page: 1 });
  const fatwaData = apiResponse?.data?.data || [];

  // STATE
  const [selectedFatwa, setSelectedFatwa] = useState<ProcessedFatwaItem | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // --- HELPER: Get Translation ---
  const getTranslation = (item: FatwaItem, field: "question" | "answer") => {
    // 1. Coba cari di translations array sesuai locale aktif
    const trans = item.translations?.find((tr) => tr.locale === safeLocale);
    if (trans && trans[field]) return trans[field];

    // 2. Fallback ke Inggris jika ada
    const enTrans = item.translations?.find((tr) => tr.locale === "en");
    if (enTrans && enTrans[field]) return enTrans[field];

    // 3. Fallback ke data utama (biasanya ID atau default)
    if (field === "question") return item.question;
    return item.answer;
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
    return fatwaData
      .filter((item) => {
        const itemQuestion = getTranslation(item, "question").toLowerCase();
        const matchSearch = itemQuestion.includes(searchQuery.toLowerCase());

        // Simple category matching
        const matchCat =
          activeCategory === "all" ||
          item.category.toLowerCase().includes(activeCategory);

        return matchCat && matchSearch;
      })
      .map((item) => ({
        id: item.id,
        sheikh: item.name,
        category: item.category,
        question: stripHtml(getTranslation(item, "question")), // Clean HTML for list view if needed, or raw
        answer: getTranslation(item, "answer"),
      }));
  }, [fatwaData, safeLocale, activeCategory, searchQuery]);

  // JIKA DETAIL DIPILIH
  if (selectedFatwa) {
    return (
      <FatwaDetail
        item={selectedFatwa}
        locale={safeLocale}
        onBack={() => setSelectedFatwa(null)}
        // Mapping category label jika ada di dictionary, kalau tidak pakai raw category
        catLabel={
          cats[selectedFatwa.category.toLowerCase() as keyof CategoryNames] ||
          selectedFatwa.category
        }
      />
    );
  }

  // TAMPILAN LIST UTAMA
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100"
      dir={safeLocale === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-md mx-auto min-h-screen bg-transparent relative pb-20">
        {/* Header */}
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
              <div className="flex-1">
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa leading-none">
                  {t.title}
                </h1>
                <p className="text-[10px] text-gray-500 font-comfortaa mt-1">
                  {t.subtitle}
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                className={`absolute ${safeLocale === "ar" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`}
              />
              <Input
                placeholder={t.search}
                className={`${safeLocale === "ar" ? "pr-9 pl-4" : "pl-9 pr-4"} bg-white border-awqaf-border-light rounded-xl h-10 text-sm`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Categories Tabs */}
          <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
            {[
              { id: "all", label: t.all },
              { id: "aqidah", label: cats.aqidah },
              { id: "ibadah", label: cats.ibadah },
              { id: "muamalah", label: cats.muamalah },
              { id: "adab", label: cats.adab },
            ].map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    px-4 py-1.5 rounded-full text-xs font-bold font-comfortaa whitespace-nowrap transition-all duration-200 border
                    ${
                      isActive
                        ? "bg-awqaf-primary text-white border-awqaf-primary shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }
                  `}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* List Content */}
        <main className="px-4 py-4 space-y-3">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm">
              <Loader2 className="w-8 h-8 text-awqaf-primary animate-spin mb-2" />
              <p className="text-sm text-slate-500">{t.loading}</p>
            </div>
          )}

          {/* Error State */}
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
                  onClick={() => setSelectedFatwa(item)}
                  className="cursor-pointer"
                >
                  <Card className="border-awqaf-border-light hover:shadow-md hover:bg-white/80 transition-all active:scale-[0.99] bg-white group rounded-xl">
                    <CardContent className="p-4">
                      {/* Tags */}
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5 px-1.5 border-awqaf-primary/30 text-awqaf-primary bg-accent-50 font-normal capitalize"
                        >
                          {cats[
                            item.category.toLowerCase() as keyof CategoryNames
                          ] || item.category}
                        </Badge>
                      </div>

                      {/* Question */}
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <MessageCircleQuestion className="w-5 h-5 text-awqaf-secondary" />
                        </div>
                        <h3 className="font-bold text-awqaf-primary font-comfortaa text-sm leading-relaxed line-clamp-2">
                          {item.question}
                        </h3>
                      </div>

                      {/* Footer Card */}
                      <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <User className="w-3 h-3" />
                          <span className="truncate max-w-[120px]">
                            {item.sheikh}
                          </span>
                        </div>
                        <div className="flex items-center text-[10px] font-bold text-awqaf-primary group-hover:underline">
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
                  <div className="w-16 h-16 bg-white border border-dashed border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-gray-300" />
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