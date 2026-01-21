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
} from "lucide-react";
import Link from "next/link";
// Import Services & Types
import { useGetTemplateLettersQuery } from "@/services/public/template-surat.service";
import Swal from "sweetalert2"; // Import SweetAlert2
import { useI18n } from "@/app/hooks/useI18n";

// Categories untuk filter UI (Client side filtering)
// Note: Idealnya kategori ini juga didapat dari API atau unique values dari data API
const CATEGORIES = [
  { id: "all", label: "Semua" },
  { id: "Nikah", label: "Pernikahan" },
  { id: "Wakaf", label: "Wakaf" },
  { id: "Masjid", label: "Masjid" },
  { id: "Umum", label: "Umum" },
];

export default function TemplateSuratPage() {
  const { t, locale } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Data from API
  const {
    data: templateData,
    isLoading,
    isError,
  } = useGetTemplateLettersQuery({
    page: 1,
    paginate: 100, // Fetch banyak untuk client-side filtering
  });

  // Logic Filtering
  const filteredTemplates = useMemo(() => {
    if (!templateData?.data) return [];

    return templateData.data.filter((item) => {
      const matchCategory =
        selectedCategory === "all" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase();
      const matchSearch =
        item.title.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });
  }, [templateData, selectedCategory, searchQuery]);

  // Helper untuk warna badge kategori
  const getCategoryColor = (cat: string) => {
    const categoryLower = cat.toLowerCase();
    switch (categoryLower) {
      case "nikah":
        return "bg-pink-100 text-pink-700 hover:bg-pink-200 border-pink-200";
      case "wakaf":
        return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
      case "masjid":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200";
    }
  };

  // Helper untuk icon file berdasarkan ekstensi file attachment
  const getFileIcon = (fileUrl: string) => {
    if (fileUrl.endsWith(".pdf")) {
      return <FileType className="w-8 h-8 text-red-500" />;
    }
    // Default docx/doc icon style
    return <FileText className="w-8 h-8 text-blue-600" />;
  };

  const handleDownload = (url: string) => {
    if (!url) {
      const errorMessages: Record<string, { title: string; text: string }> = {
        id: { title: "Gagal", text: "Link download tidak tersedia" },
        en: { title: "Failed", text: "Download link is not available" },
        ar: { title: "فشل", text: "رابط التحميل غير متاح" },
        fr: { title: "Échec", text: "Le lien de téléchargement n'est pas disponible" },
        kr: { title: "실패", text: "다운로드 링크를 사용할 수 없습니다" },
        jp: { title: "失敗", text: "ダウンロードリンクが利用できません" },
      };
      const error = errorMessages[locale] || errorMessages.id;
      Swal.fire({
        icon: "error",
        title: error.title,
        text: error.text,
        confirmButtonColor: "#d33",
      });
      return;
    }
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
                >
                  <Navigation className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                {t("templateLetter.title")}
              </h1>
              <div className="w-10 h-10" /> {/* Spacer untuk centering */}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-6">
        {/* Search & Filter Section */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={t("templateLetter.searchPlaceholder")}
              className="pl-9 bg-white border-awqaf-border-light font-comfortaa focus-visible:ring-awqaf-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Tabs (Horizontal Scroll) */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.id}
                size="sm"
                variant={selectedCategory === cat.id ? "default" : "outline"}
                className={`rounded-full px-4 font-comfortaa text-xs whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-awqaf-primary hover:bg-awqaf-primary/90"
                    : "bg-white/50 border-awqaf-border-light text-awqaf-foreground-secondary"
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
                {t("templateLetter.loading")}
              </p>
            </div>
          ) : isError ? (
            <div className="text-center py-10">
              <p className="text-red-500 font-comfortaa mb-2">
                {t("templateLetter.failedToLoad")}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                {t("templateLetter.tryAgain")}
              </Button>
            </div>
          ) : filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => (
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
                        <h3 className="font-bold text-gray-800 font-comfortaa line-clamp-2 text-sm leading-tight">
                          {template.title}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 font-comfortaa mt-1 line-clamp-2">
                        {template.description || "Tidak ada deskripsi"}
                      </p>

                      {/* Footer: Category & Action */}
                      <div className="flex items-center justify-between mt-3">
                        <Badge
                          variant="outline"
                          className={`text-[10px] py-0 h-5 border ${getCategoryColor(
                            template.category
                          )}`}
                        >
                          {template.category}
                        </Badge>

                        <Button
                          size="sm"
                          className="h-7 px-3 text-xs bg-accent-50 text-awqaf-primary hover:bg-accent-100 hover:text-awqaf-primary border border-accent-100 font-comfortaa"
                          onClick={() => handleDownload(template.attachment)}
                        >
                          <Download className="w-3 h-3 mr-1.5" />
                          {t("templateLetter.download")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Empty State
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileJson className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-medium font-comfortaa">
                {t("templateLetter.notFound")}
              </p>
              <p className="text-xs text-gray-500 font-comfortaa">
                {t("templateLetter.tryDifferentKeyword")}
              </p>
            </div>
          )}
        </div>

        {/* Promo / Info Banner */}
        <Card className="bg-gradient-to-r from-awqaf-primary to-teal-600 border-none text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10" />
          <CardContent className="p-4 relative z-10">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-sm font-comfortaa">
                  {t("templateLetter.needOtherFormat")}
                </p>
                <p className="text-xs text-white/80 font-comfortaa">
                  {t("templateLetter.contactAdmin")}
                </p>
              </div>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}