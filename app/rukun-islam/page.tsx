"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MessageCircleHeart, // Syahadat
  Timer, // Shalat
  HandCoins, // Zakat
  Moon, // Puasa
  MapPin, // Haji
  ChevronRight,
  LayoutGrid, // Default Icon
  LucideIcon,
  Loader2, // Loading Spinner
  AlertCircle, // Error Icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/app/hooks/useI18n";

// Import Service & Types
import {
  useGetRukunIslamQuery,
  RukunIslamItem,
} from "@/services/public/rukun-islam.service";

// Import komponen detail
import IslamDetail from "./islam-detail";

// --- 1. DEFINISI TIPE & HELPER ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

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
    title: "Rukun Islam",
    subtitle: "5 Pilar Tindakan",
    read: "Pelajari",
    back: "Kembali",
    loading: "Memuat data...",
    error: "Gagal memuat data",
    retry: "Coba Lagi",
  },
  en: {
    title: "Pillars of Islam",
    subtitle: "5 Pillars of Action",
    read: "Learn",
    back: "Back",
    loading: "Loading data...",
    error: "Failed to load data",
    retry: "Retry",
  },
  ar: {
    title: "أركان الإسلام",
    subtitle: "٥ أركان عملية",
    read: "تعلم",
    back: "رجوع",
    loading: "جار التحميل...",
    error: "فشل تحميل البيانات",
    retry: "أعد المحاولة",
  },
  fr: {
    title: "Piliers de l'Islam",
    subtitle: "5 Piliers d'Action",
    read: "Apprendre",
    back: "Retour",
    loading: "Chargement...",
    error: "Échec du chargement",
    retry: "Réessayer",
  },
  kr: {
    title: "이슬람의 기둥",
    subtitle: "5가지 실천",
    read: "배우기",
    back: "뒤로",
    loading: "로딩 중...",
    error: "데이터 로드 실패",
    retry: "재시도",
  },
  jp: {
    title: "イスラムの柱",
    subtitle: "5つの行い",
    read: "学ぶ",
    back: "戻る",
    loading: "読み込み中...",
    error: "読み込み失敗",
    retry: "再試行",
  },
};

// --- 2. COMPONENT UTAMA ---
export default function RukunIslamPage() {
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
  } = useGetRukunIslamQuery({ page: 1 });
  const rukunData = apiResponse?.data?.data || [];

  // STATE
  const [selectedItem, setSelectedItem] = useState<RukunIslamItem | null>(null);

  // --- HELPER: Get Translation ---
  // Fungsi ini mencari terjemahan yang pas. Prioritas: Locale Pilihan -> Inggris -> Default (Indonesia)
  const getTranslation = (
    item: RukunIslamItem,
    field: "title" | "description",
  ) => {
    // 1. Coba cari di translations array
    const trans = item.translations?.find((tr) => tr.locale === safeLocale);
    if (trans && trans[field]) return trans[field];

    // 2. Fallback ke Inggris jika ada
    const enTrans = item.translations?.find((tr) => tr.locale === "en");
    if (enTrans && enTrans[field]) return enTrans[field];

    // 3. Fallback ke data utama (biasanya ID)
    if (field === "title") return item.title;

    // Khusus deskripsi, kita coba bersihkan tag HTML sederhana untuk shortDesc di list view
    return item.description;
  };

  // Helper untuk membersihkan HTML tags untuk tampilan list (shortDesc)
  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // MAPPING ICON (Based on Order or Title keywords if needed)
  const getIcon = (order: number): LucideIcon => {
    switch (order) {
      case 1:
        return MessageCircleHeart; // Syahadat
      case 2:
        return Timer; // Shalat
      case 3:
        return HandCoins; // Zakat
      case 4:
        return Moon; // Puasa
      case 5:
        return MapPin; // Haji
      default:
        return LayoutGrid;
    }
  };

  // --- RENDER DETAIL ---
  if (selectedItem) {
    // Siapkan data yang sudah diterjemahkan untuk detail view
    const detailTitle = getTranslation(selectedItem, "title");
    const detailContent = getTranslation(selectedItem, "description");

    // Kita passing object buatan agar compatible dengan komponen detail yang sudah ada
    // Atau modifikasi komponen detail menerima raw item + helper function
    // Di sini saya passing data yang sudah diproses agar komponen detail lebih bersih
    const processedItem = {
      ...selectedItem,
      title: detailTitle,
      content: detailContent, // HTML String
      shortDesc: stripHtml(detailContent).substring(0, 100) + "...", // Simulasi short desc
    };

    return (
      <IslamDetail
        item={processedItem} // Perlu disesuaikan interfacenya di IslamDetail
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
        <header className="bg-gradient-to-bl from-emerald-600 to-teal-800 p-6 pb-12 rounded-b-[40px] relative overflow-hidden">
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
                <LayoutGrid className="w-8 h-8 text-white" />
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

        {/* CONTENT AREA */}
        <main className="px-5 -mt-6 relative z-20 space-y-4">
          {/* 1. LOADING STATE */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
              <p className="text-sm text-slate-500">{t.loading}</p>
            </div>
          )}

          {/* 2. ERROR STATE */}
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

          {/* 3. DATA LIST */}
          {!isLoading &&
            !isError &&
            rukunData.map((item) => {
              const Icon = getIcon(item.order);
              const title = getTranslation(item, "title");
              const rawDesc = getTranslation(item, "description");
              // Bersihkan HTML tag untuk preview singkat di list (server-side safe strip)
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
                        <div className="absolute inset-0 bg-emerald-50 rounded-full group-hover:bg-emerald-100 transition-colors"></div>
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <Icon className="w-7 h-7 text-emerald-600" />
                        </div>
                        <Badge className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] z-20 border-2 border-white">
                          {item.order}
                        </Badge>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-slate-800 font-comfortaa mb-1 group-hover:text-emerald-700 transition-colors">
                          {title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {shortDesc}
                        </p>
                      </div>

                      <ChevronRight
                        className={`w-5 h-5 text-slate-300 group-hover:text-emerald-600 transition-colors ${safeLocale === "ar" ? "rotate-180" : ""}`}
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