"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Download,
  Search,
  Navigation,
  FileJson,
  FileType,
  ArrowRight,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
// Import Services & Types
import { useGetTemplateLettersQuery } from "@/services/public/template-surat.service";
import { TemplateLetter } from "@/types/public/template-surat";
import Swal from "sweetalert2";
import { useI18n } from "@/app/hooks/useI18n";

// --- TIPE TRANSLASI ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface TemplateTranslations {
  title: string;
  searchPlaceholder: string;
  all: string;
  nikah: string;
  wakaf: string;
  masjid: string;
  umum: string;
  loading: string;
  failedToLoad: string;
  tryAgain: string;
  download: string;
  notFound: string;
  tryDifferentKeyword: string;
  needOtherFormat: string;
  contactAdmin: string;
  downloadFailed: string;
  downloadFailedDesc: string;
}

// --- DICTIONARY TRANSLASI ---
const TEMPLATE_TEXT: Record<LocaleCode, TemplateTranslations> = {
  id: {
    title: "Template Surat",
    searchPlaceholder: "Cari template surat...",
    all: "Semua",
    nikah: "Pernikahan",
    wakaf: "Wakaf",
    masjid: "Masjid",
    umum: "Umum",
    loading: "Memuat template...",
    failedToLoad: "Gagal memuat data template",
    tryAgain: "Coba Lagi",
    download: "Unduh",
    notFound: "Template tidak ditemukan",
    tryDifferentKeyword: "Coba kata kunci atau kategori lain",
    needOtherFormat: "Butuh format surat lain?",
    contactAdmin: "Hubungi admin untuk request template khusus",
    downloadFailed: "Gagal",
    downloadFailedDesc: "Link download tidak tersedia",
  },
  en: {
    title: "Letter Templates",
    searchPlaceholder: "Search letter templates...",
    all: "All",
    nikah: "Marriage",
    wakaf: "Waqf",
    masjid: "Mosque",
    umum: "General",
    loading: "Loading templates...",
    failedToLoad: "Failed to load templates",
    tryAgain: "Try Again",
    download: "Download",
    notFound: "Template not found",
    tryDifferentKeyword: "Try another keyword or category",
    needOtherFormat: "Need another format?",
    contactAdmin: "Contact admin to request a custom template",
    downloadFailed: "Failed",
    downloadFailedDesc: "Download link is not available",
  },
  ar: {
    title: "نماذج الرسائل",
    searchPlaceholder: "ابحث عن نماذج الرسائل...",
    all: "الكل",
    nikah: "زواج",
    wakaf: "وقف",
    masjid: "مسجد",
    umum: "عام",
    loading: "جار تحميل النماذج...",
    failedToLoad: "فشل تحميل النماذج",
    tryAgain: "حاول مرة أخرى",
    download: "تحميل",
    notFound: "لم يتم العثور على النموذج",
    tryDifferentKeyword: "جرب كلمة مفتاحية أو فئة أخرى",
    needOtherFormat: "هل تحتاج إلى تنسيق آخر؟",
    contactAdmin: "اتصل بالمسؤول لطلب نموذج مخصص",
    downloadFailed: "فشل",
    downloadFailedDesc: "رابط التحميل غير متاح",
  },
  fr: {
    title: "Modèles de Lettres",
    searchPlaceholder: "Rechercher des modèles...",
    all: "Tout",
    nikah: "Mariage",
    wakaf: "Waqf",
    masjid: "Mosquée",
    umum: "Général",
    loading: "Chargement des modèles...",
    failedToLoad: "Échec du chargement",
    tryAgain: "Réessayer",
    download: "Télécharger",
    notFound: "Modèle introuvable",
    tryDifferentKeyword: "Essayez un autre mot-clé ou catégorie",
    needOtherFormat: "Besoin d'un autre format ?",
    contactAdmin: "Contactez l'admin pour demander un modèle",
    downloadFailed: "Échec",
    downloadFailedDesc: "Le lien de téléchargement n'est pas disponible",
  },
  kr: {
    title: "편지 서식",
    searchPlaceholder: "서식 검색...",
    all: "전체",
    nikah: "결혼",
    wakaf: "와크프",
    masjid: "모스크",
    umum: "일반",
    loading: "서식 로딩 중...",
    failedToLoad: "서식 로드 실패",
    tryAgain: "다시 시도",
    download: "다운로드",
    notFound: "서식을 찾을 수 없음",
    tryDifferentKeyword: "다른 키워드나 카테고리를 시도해보세요",
    needOtherFormat: "다른 형식이 필요하세요?",
    contactAdmin: "맞춤 서식을 요청하려면 관리자에게 문의하세요",
    downloadFailed: "실패",
    downloadFailedDesc: "다운로드 링크를 사용할 수 없습니다",
  },
  jp: {
    title: "手紙のテンプレート",
    searchPlaceholder: "テンプレートを検索...",
    all: "すべて",
    nikah: "結婚",
    wakaf: "ワクフ",
    masjid: "モスク",
    umum: "一般",
    loading: "テンプレートを読み込み中...",
    failedToLoad: "読み込みに失敗しました",
    tryAgain: "再試行",
    download: "ダウンロード",
    notFound: "テンプレートが見つかりません",
    tryDifferentKeyword: "別のキーワードやカテゴリを試してください",
    needOtherFormat: "他の形式が必要ですか？",
    contactAdmin:
      "カスタムテンプレートをリクエストするには管理者に連絡してください",
    downloadFailed: "失敗",
    downloadFailedDesc: "ダウンロードリンクが利用できません",
  },
};

export default function TemplateSuratPage() {
  const { locale } = useI18n();
  // Safe Locale Access
  const safeLocale = (
    TEMPLATE_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = TEMPLATE_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Categories untuk filter UI
  const categories = [
    { id: "all", label: t.all },
    { id: "Nikah", label: t.nikah },
    { id: "Wakaf", label: t.wakaf },
    { id: "Masjid", label: t.masjid },
    { id: "Umum", label: t.umum },
  ];

  // Fetch Data from API
  const {
    data: templateData,
    isLoading,
    isError,
  } = useGetTemplateLettersQuery({
    page: 1,
    paginate: 100,
  });

  // --- HELPER TRANSLATION ---
  const getTemplateContent = (item: TemplateLetter) => {
    if (item.translations && item.translations.length > 0) {
      const localized = item.translations.find((t) => t.locale === locale);
      if (localized && localized.title) {
        return {
          title: localized.title,
          description: localized.description ?? "",
        };
      }
      const idFallback = item.translations.find((t) => t.locale === "id");
      if (idFallback && idFallback.title) {
        return {
          title: idFallback.title,
          description: idFallback.description ?? "",
        };
      }
    }
    return {
      title: item.title,
      description: item.description ?? "",
    };
  };

  // Logic Filtering
  const filteredTemplates = useMemo(() => {
    if (!templateData?.data) return [];

    return templateData.data.filter((item) => {
      const content = getTemplateContent(item);
      const matchCategory =
        selectedCategory === "all" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.toLowerCase();
      const cleanDescription = content.description
        .replace(/<[^>]*>?/gm, "")
        .toLowerCase();
      const matchSearch =
        content.title.toLowerCase().includes(q) || cleanDescription.includes(q);

      return matchCategory && matchSearch;
    });
  }, [templateData, selectedCategory, searchQuery, locale]);

  // Helper untuk icon file - SERAGAMKAN WARNA KE AWQAF
  const getFileIcon = (fileUrl: string) => {
    if (fileUrl && fileUrl.endsWith(".pdf")) {
      return <FileType className="w-8 h-8 text-awqaf-primary" />;
    }
    return <FileText className="w-8 h-8 text-awqaf-primary" />;
  };

  const handleDownload = (url: string) => {
    if (!url) {
      Swal.fire({
        icon: "error",
        title: t.downloadFailed,
        text: t.downloadFailedDesc,
        confirmButtonColor: "#0d9488", // awqaf/teal
        customClass: {
          popup: "font-comfortaa",
        },
      });
      return;
    }
    window.open(url, "_blank");
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200 ${
                    isRtl ? "rotate-180" : ""
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>

              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                {t.title}
              </h1>
              <div className="w-10 h-10" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-6">
        {/* Search & Filter Section */}
        <div className="space-y-4">
          <div className="relative">
            <Search
              className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${
                isRtl ? "right-3" : "left-3"
              }`}
            />
            <Input
              placeholder={t.searchPlaceholder}
              className={`bg-white border-awqaf-border-light font-comfortaa focus-visible:ring-awqaf-primary ${
                isRtl ? "pr-9 pl-4" : "pl-9 pr-4"
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mobile-scroll">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                size="sm"
                variant={selectedCategory === cat.id ? "default" : "outline"}
                className={`rounded-full px-4 font-comfortaa text-xs whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-awqaf-primary hover:bg-awqaf-primary/90 text-white"
                    : "bg-white/50 border-awqaf-border-light text-awqaf-foreground-secondary hover:bg-accent-50"
                }`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-awqaf-primary mb-2" />
              <p className="text-sm text-gray-500 font-comfortaa">
                {t.loading}
              </p>
            </div>
          ) : isError ? (
            <div className="text-center py-10">
              <p className="text-red-500 font-comfortaa mb-2">
                {t.failedToLoad}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                {t.tryAgain}
              </Button>
            </div>
          ) : filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => {
              const content = getTemplateContent(template);

              return (
                <Card
                  key={template.id}
                  className="border-awqaf-border-light hover:shadow-md transition-shadow duration-200 group"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon Container */}
                      <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center shadow-sm shrink-0">
                        {getFileIcon(template.attachment)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-gray-800 font-comfortaa line-clamp-2 text-sm leading-tight group-hover:text-awqaf-primary transition-colors">
                            {content.title}
                          </h3>
                        </div>
                        <div
                          className="text-xs text-gray-500 font-comfortaa mt-1 line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: content.description,
                          }}
                        />

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-3">
                          {/* SERAGAMKAN WARNA BADGE KATEGORI */}
                          <Badge
                            variant="outline"
                            className="text-[10px] py-0 h-5 border bg-accent-50 text-awqaf-primary border-awqaf-primary/20"
                          >
                            {categories.find(
                              (c) =>
                                c.id.toLowerCase() ===
                                template.category.toLowerCase(),
                            )?.label || template.category}
                          </Badge>

                          <Button
                            size="sm"
                            className="h-7 px-3 text-xs bg-accent-50 text-awqaf-primary hover:bg-awqaf-primary hover:text-white border border-accent-100 font-comfortaa transition-colors"
                            onClick={() => handleDownload(template.attachment)}
                          >
                            <Download
                              className={`w-3 h-3 ${isRtl ? "ml-1.5" : "mr-1.5"}`}
                            />
                            {t.download}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            // Empty State
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileJson className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-medium font-comfortaa">
                {t.notFound}
              </p>
              <p className="text-xs text-gray-500 font-comfortaa">
                {t.tryDifferentKeyword}
              </p>
            </div>
          )}
        </div>

        {/* Promo / Info Banner */}
        {/* Menggunakan gradien yang senada dengan awqaf-primary saja */}
        <Card className="bg-gradient-to-r from-awqaf-primary to-awqaf-primary/80 border-none text-white overflow-hidden relative shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10" />
          <CardContent className="p-4 relative z-10">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-sm font-comfortaa">
                  {t.needOtherFormat}
                </p>
                <p className="text-xs text-white/80 font-comfortaa">
                  {t.contactAdmin}
                </p>
              </div>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
              >
                <ArrowRight
                  className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`}
                />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}