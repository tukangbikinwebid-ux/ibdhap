"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Book,
  Feather, // Malaikat
  Users, // Rasul
  CloudSun, // Allah
  Hourglass, // Hari Akhir
  GitCommitHorizontal, // Qada Qadr
  ChevronRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/app/hooks/useI18n";

// Import Service & Types
import {
  useGetRukunImanQuery,
  RukunImanItem,
} from "@/services/public/rukun-iman.service";

// Import komponen detail
import ImanDetail from "./iman-detail";

// --- Types & Helper ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

export interface ProcessedImanItem {
  id: number;
  order: number;
  title: string;
  content: string; // HTML string
  shortDesc: string;
}

interface UIText {
  title: string;
  subtitle: string;
  read: string;
  back: string;
  loading: string;
  error: string;
  retry: string;
}

const UI_TEXT: Record<LocaleCode, UIText> = {
  id: {
    title: "Rukun Iman",
    subtitle: "6 Pilar Keyakinan",
    read: "Pelajari",
    back: "Kembali",
    loading: "Memuat data...",
    error: "Gagal memuat data",
    retry: "Coba Lagi",
  },
  en: {
    title: "Pillars of Faith",
    subtitle: "6 Pillars of Belief",
    read: "Learn",
    back: "Back",
    loading: "Loading data...",
    error: "Failed to load data",
    retry: "Retry",
  },
  ar: {
    title: "أركان الإيمان",
    subtitle: "٦ أركان للعقيدة",
    read: "تعلم",
    back: "رجوع",
    loading: "جار التحميل...",
    error: "فشل تحميل البيانات",
    retry: "أعد المحاولة",
  },
  fr: {
    title: "Piliers de la Foi",
    subtitle: "6 Piliers de Croyance",
    read: "Apprendre",
    back: "Retour",
    loading: "Chargement...",
    error: "Échec du chargement",
    retry: "Réessayer",
  },
  kr: {
    title: "믿음의 기둥",
    subtitle: "6가지 믿음",
    read: "배우기",
    back: "뒤로",
    loading: "로딩 중...",
    error: "데이터 로드 실패",
    retry: "재시도",
  },
  jp: {
    title: "信仰の柱",
    subtitle: "6つの信仰",
    read: "学ぶ",
    back: "戻る",
    loading: "読み込み中...",
    error: "読み込み失敗",
    retry: "再試行",
  },
};

export default function RukunImanPage() {
  const { locale } = useI18n();
  const safeLocale = (
    UI_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = UI_TEXT[safeLocale];

  // --- API HOOK ---
  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useGetRukunImanQuery({ page: 1 });
  const rukunData = apiResponse?.data?.data || [];

  // STATE
  const [selectedItem, setSelectedItem] = useState<RukunImanItem | null>(null);

  // --- HELPER: Get Translation ---
  const getTranslation = (
    item: RukunImanItem,
    field: "title" | "description",
  ) => {
    // 1. Coba cari di translations array sesuai locale aktif
    const trans = item.translations?.find((tr) => tr.locale === safeLocale);
    if (trans && trans[field]) return trans[field];

    // 2. Fallback ke Inggris jika ada
    const enTrans = item.translations?.find((tr) => tr.locale === "en");
    if (enTrans && enTrans[field]) return enTrans[field];

    // 3. Fallback ke data utama (biasanya ID)
    if (field === "title") return item.title;

    return item.description;
  };

  // Helper strip HTML untuk short description di list
  const stripHtml = (html: string) => {
    if (typeof window === "undefined") {
      return html.replace(/<[^>]*>?/gm, ""); // Server-side safe fallback
    }
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // MAPPING ICON
  const getIcon = (order: number) => {
    switch (order) {
      case 1:
        return CloudSun;
      case 2:
        return Feather;
      case 3:
        return Book;
      case 4:
        return Users;
      case 5:
        return Hourglass;
      case 6:
        return GitCommitHorizontal;
      default:
        return ShieldCheck;
    }
  };

  // --- RENDER DETAIL ---
  if (selectedItem) {
    const detailTitle = getTranslation(selectedItem, "title");
    const detailContent = getTranslation(selectedItem, "description");

    const processedItem: ProcessedImanItem = {
      id: selectedItem.id,
      order: selectedItem.order,
      title: detailTitle,
      content: detailContent,
      shortDesc: stripHtml(detailContent).substring(0, 100) + "...",
    };

    return (
      <ImanDetail
        item={processedItem}
        locale={safeLocale}
        onBack={() => setSelectedItem(null)}
        icon={getIcon(selectedItem.order)}
      />
    );
  }

  // --- RENDER LIST ---
  return (
    <div
      className="min-h-screen bg-slate-50 mb-20"
      dir={safeLocale === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-md mx-auto min-h-screen bg-white relative pb-10 shadow-xl overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-br from-awqaf-primary to-awqaf-secondary p-6 pb-12 rounded-b-[40px] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

          <div className="relative z-10">
            <Link href="/bekal-islam">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2 h-auto mb-4 rounded-full"
              >
                <ArrowLeft
                  className={`w-6 h-6 ${safeLocale === "ar" ? "rotate-180" : ""}`}
                />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white font-comfortaa">
                  {t.title}
                </h1>
                <p className="text-white/80 text-xs font-comfortaa">
                  {t.subtitle}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="px-5 -mt-6 relative z-20 space-y-4">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
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
          {!isLoading &&
            !isError &&
            rukunData.map((item) => {
              const Icon = getIcon(item.order);
              const title = getTranslation(item, "title");
              const rawDesc = getTranslation(item, "description");
              // Clean HTML tags for short description
              const shortDesc =
                rawDesc.replace(/<[^>]*>?/gm, "").substring(0, 80) + "...";

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="cursor-pointer group"
                >
                  <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white hover:-translate-y-1">
                    <CardContent className="p-4 flex items-center gap-4">
                      {/* Number Badge with Icon */}
                      <div className="relative w-14 h-14 flex-shrink-0">
                        <div className="absolute inset-0 bg-accent-100 rounded-xl rotate-3 group-hover:rotate-6 transition-transform"></div>
                        <div className="absolute inset-0 bg-white border border-accent-100 rounded-xl flex items-center justify-center shadow-sm z-10">
                          <Icon className="w-6 h-6 text-awqaf-primary" />
                        </div>
                        <Badge className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full bg-awqaf-secondary text-[10px] z-20 border-2 border-white">
                          {item.order}
                        </Badge>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-awqaf-primary font-comfortaa mb-1 group-hover:text-awqaf-secondary transition-colors">
                          {title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {shortDesc}
                        </p>
                      </div>

                      <ChevronRight
                        className={`w-5 h-5 text-slate-300 group-hover:text-awqaf-primary transition-colors ${safeLocale === "ar" ? "rotate-180" : ""}`}
                      />
                    </CardContent>
                  </Card>
                </div>
              );
            })}
        </main>
      </div>
    </div>
  );
}