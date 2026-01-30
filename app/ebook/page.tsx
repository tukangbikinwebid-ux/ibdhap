"use client";

import { useState, useEffect } from "react";
import {
  BookMarked,
  Download,
  Star,
  Clock,
  Loader2,
  Library,
  Navigation,
  BookOpen,
  X,
  ArrowLeft, // Tambahkan ArrowLeft
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  useGetEbookCategoriesQuery,
  useGetEbookByCategoryQuery,
} from "@/services/public/e-book.service";
import { useI18n } from "@/app/hooks/useI18n";
import { Ebook, EbookCategory } from "@/types/public/e-book";

// --- TYPES ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface EbookTranslations {
  title: string;
  subtitle: string;
  selectedCategory: string;
  noBooksInCategory: string;
  pages: string;
  freeDownload: string;
  freeDownloadDescription: string;
  rating: string;
  year: string;
  pageCount: string;
  publisher: string;
  synopsis: string;
  downloadBtn: string;
}

// --- TRANSLATION DICTIONARY ---
const EBOOK_TEXT: Record<LocaleCode, EbookTranslations> = {
  id: {
    title: "Perpustakaan E-Book",
    subtitle: "Koleksi buku digital Islami terpercaya",
    selectedCategory: "Kategori Terpilih",
    noBooksInCategory: "Belum ada buku di kategori ini",
    pages: "Halaman",
    freeDownload: "Download Gratis",
    freeDownloadDescription:
      "Semua e-book dapat diunduh dan dibaca secara gratis untuk menyebarkan ilmu yang bermanfaat.",
    rating: "Rating",
    year: "Tahun",
    pageCount: "Halaman",
    publisher: "Penerbit",
    synopsis: "Sinopsis",
    downloadBtn: "Download E-Book",
  },
  en: {
    title: "E-Book Library",
    subtitle: "Trusted Islamic digital book collection",
    selectedCategory: "Selected Category",
    noBooksInCategory: "No books in this category yet",
    pages: "Pages",
    freeDownload: "Free Download",
    freeDownloadDescription:
      "All e-books can be downloaded and read for free to spread beneficial knowledge.",
    rating: "Rating",
    year: "Year",
    pageCount: "Pages",
    publisher: "Publisher",
    synopsis: "Synopsis",
    downloadBtn: "Download E-Book",
  },
  ar: {
    title: "مكتبة الكتب الإلكترونية",
    subtitle: "مجموعة كتب إسلامية رقمية موثوقة",
    selectedCategory: "الفئة المختارة",
    noBooksInCategory: "لا توجد كتب في هذه الفئة بعد",
    pages: "صفحات",
    freeDownload: "تحميل مجاني",
    freeDownloadDescription:
      "يمكن تحميل جميع الكتب الإلكترونية وقراءتها مجانًا لنشر العلم النافع.",
    rating: "تقييم",
    year: "سنة",
    pageCount: "صفحات",
    publisher: "الناشر",
    synopsis: "ملخص",
    downloadBtn: "تحميل الكتاب",
  },
  fr: {
    title: "Bibliothèque E-Book",
    subtitle: "Collection de livres numériques islamiques fiables",
    selectedCategory: "Catégorie sélectionnée",
    noBooksInCategory: "Pas encore de livres dans cette catégorie",
    pages: "Pages",
    freeDownload: "Téléchargement gratuit",
    freeDownloadDescription:
      "Tous les e-books peuvent être téléchargés et lus gratuitement pour diffuser des connaissances utiles.",
    rating: "Évaluation",
    year: "Année",
    pageCount: "Pages",
    publisher: "Éditeur",
    synopsis: "Synopsis",
    downloadBtn: "Télécharger E-Book",
  },
  kr: {
    title: "전자책 도서관",
    subtitle: "신뢰할 수 있는 이슬람 디지털 도서 모음",
    selectedCategory: "선택된 카테고리",
    noBooksInCategory: "이 카테고리에 아직 책이 없습니다",
    pages: "페이지",
    freeDownload: "무료 다운로드",
    freeDownloadDescription:
      "유익한 지식을 전파하기 위해 모든 전자책을 무료로 다운로드하고 읽을 수 있습니다.",
    rating: "평점",
    year: "년도",
    pageCount: "페이지",
    publisher: "출판사",
    synopsis: "개요",
    downloadBtn: "전자책 다운로드",
  },
  jp: {
    title: "電子書籍ライブラリ",
    subtitle: "信頼できるイスラムデジタル書籍コレクション",
    selectedCategory: "選択されたカテゴリ",
    noBooksInCategory: "このカテゴリにはまだ本がありません",
    pages: "ページ",
    freeDownload: "無料ダウンロード",
    freeDownloadDescription:
      "有益な知識を広めるために、すべての電子書籍を無料でダウンロードして読むことができます。",
    rating: "評価",
    year: "年",
    pageCount: "ページ",
    publisher: "出版社",
    synopsis: "あらすじ",
    downloadBtn: "電子書籍をダウンロード",
  },
};

export default function EBookPage() {
  const { locale } = useI18n();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  // Safe Locale Access
  const safeLocale = (
    EBOOK_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t_ebook = EBOOK_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  // State untuk modal
  const [selectedBook, setSelectedBook] = useState<Ebook | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- HELPER TRANSLATION ---
  const getCategoryContent = (cat: EbookCategory) => {
    const localized = cat.translations?.find((t) => t.locale === locale);

    if (localized) {
      return {
        name: localized.name || cat.name,
        description: localized.description || cat.description,
      };
    }

    const idFallback = cat.translations?.find((t) => t.locale === "id");
    if (idFallback) {
      return {
        name: idFallback.name || cat.name,
        description: idFallback.description || cat.description,
      };
    }

    return { name: cat.name, description: cat.description };
  };

  const getEbookContent = (book: Ebook) => {
    const localized = book.translations?.find((t) => t.locale === locale);
    if (localized) {
      return {
        title: localized.title || book.title,
        description: localized.description || book.description || "",
      };
    }

    const idFallback = book.translations?.find((t) => t.locale === "id");
    if (idFallback) {
      return {
        title: idFallback.title || book.title,
        description: idFallback.description || book.description || "",
      };
    }

    return {
      title: book.title,
      description: book.description || "",
    };
  };

  // 1. Fetch Categories
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetEbookCategoriesQuery({
      page: 1,
      paginate: 10,
    });

  // Set default category
  useEffect(() => {
    if (
      categoriesData?.data &&
      categoriesData.data.length > 0 &&
      selectedCategoryId === null
    ) {
      setSelectedCategoryId(categoriesData.data[0].id);
    }
  }, [categoriesData, selectedCategoryId]);

  // 2. Fetch Books by Category
  const {
    data: booksData,
    isLoading: isLoadingBooks,
    isFetching: isFetchingBooks,
  } = useGetEbookByCategoryQuery(
    {
      category: selectedCategoryId || 0,
      page: 1,
      paginate: 10,
    },
    {
      skip: selectedCategoryId === null,
    },
  );

  // Helper untuk mendapatkan nama kategori
  const getCategoryName = (id: number | null) => {
    if (!id || !categoriesData?.data) return t_ebook.selectedCategory;
    const cat = categoriesData.data.find((c) => c.id === id);
    if (!cat) return t_ebook.selectedCategory;

    return getCategoryContent(cat).name;
  };

  const handleOpenPdf = (url: string) => {
    window.open(url, "_blank");
  };

  // Helper untuk simulasi rating & downloads
  const getBookMeta = (id: number) => {
    const rating = (4 + (id % 10) / 10).toFixed(1);
    const downloads = `${(10 + (id % 50)).toFixed(1)}K`;
    const pages = 100 + ((id * 10) % 500);
    return { rating, downloads, pages };
  };

  const openBookDetail = (book: Ebook) => {
    setSelectedBook(book);
    setIsModalOpen(true);
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
              {/* TOMBOL BACK */}
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-10 h-10 p-0 rounded-full hover:bg-accent-100 text-awqaf-primary ${
                    isRtl ? "rotate-180" : ""
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="text-center">
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                  {t_ebook.title}
                </h1>
                <p className="text-[10px] text-awqaf-foreground-secondary font-comfortaa">
                  {t_ebook.subtitle}
                </p>
              </div>
              <div className="w-10 h-10" /> {/* Spacer untuk centering */}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Categories Grid */}
        {isLoadingCategories ? (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-4 h-24 animate-pulse bg-gray-200"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {categoriesData?.data.map((category) => {
              const content = getCategoryContent(category);

              return (
                <div
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`bg-card rounded-2xl shadow-sm p-4 text-center hover:shadow-md transition-all duration-200 border cursor-pointer active:scale-95 ${
                    selectedCategoryId === category.id
                      ? "border-awqaf-primary ring-1 ring-awqaf-primary bg-accent-50"
                      : "border-awqaf-border-light"
                  }`}
                >
                  {category.id % 2 !== 0 ? (
                    <BookMarked className="w-8 h-8 text-awqaf-primary mx-auto mb-2" />
                  ) : (
                    <Star className="w-8 h-8 text-warning mx-auto mb-2" />
                  )}
                  <h3 className="font-semibold text-card-foreground text-sm font-comfortaa line-clamp-1">
                    {content.name}
                  </h3>
                  <div
                    className="text-xs text-awqaf-foreground-secondary mt-1 font-comfortaa line-clamp-1"
                    dangerouslySetInnerHTML={{
                      __html: content.description || "",
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Books List Section */}
        <div className="bg-card rounded-2xl shadow-sm p-6 border border-awqaf-border-light mb-6 min-h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-card-foreground font-comfortaa">
              {getCategoryName(selectedCategoryId)}
            </h3>
            {isLoadingBooks || isFetchingBooks ? (
              <Loader2 className="w-4 h-4 animate-spin text-awqaf-primary" />
            ) : null}
          </div>

          {isLoadingBooks ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-xl border border-gray-100 animate-pulse"
                >
                  <div className="w-16 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                    <div className="h-3 w-1/2 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : booksData?.data.length === 0 ? (
            <div className="text-center py-10">
              <Library className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-comfortaa">
                {t_ebook.noBooksInCategory}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {booksData?.data.map((book) => {
                const meta = getBookMeta(book.id);
                const content = getEbookContent(book);

                return (
                  <div
                    key={book.id}
                    onClick={() => openBookDetail(book)}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-accent-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-accent-100"
                  >
                    <div className="w-16 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden relative border border-gray-200">
                      {book.cover ? (
                        <Image
                          src={book.cover}
                          alt={content.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-accent-100">
                          <BookMarked className="w-6 h-6 text-awqaf-primary" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-card-foreground font-comfortaa text-sm line-clamp-2 leading-snug">
                        {content.title}
                      </h4>
                      <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mt-1 truncate">
                        {book.author}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-warning fill-current" />
                          <span className="text-[10px] text-awqaf-foreground-secondary font-comfortaa">
                            {meta.rating}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3 text-awqaf-foreground-secondary" />
                          <span className="text-[10px] text-awqaf-foreground-secondary font-comfortaa">
                            {meta.downloads}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Download Status */}
        <div className="bg-gradient-to-r from-accent-100 to-accent-200 rounded-2xl p-6 border border-accent-200">
          <div className="text-center">
            <h4 className="font-semibold text-awqaf-primary font-comfortaa mb-2">
              {t_ebook.freeDownload}
            </h4>
            <p className="text-awqaf-foreground-secondary text-sm font-comfortaa">
              {t_ebook.freeDownloadDescription}
            </p>
          </div>
        </div>
      </main>

      {/* --- EBOOK DETAIL MODAL --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto border-awqaf-border-light p-0">
          {selectedBook &&
            (() => {
              const content = getEbookContent(selectedBook);
              const meta = getBookMeta(selectedBook.id);

              return (
                <>
                  <div className="relative h-64 bg-gradient-to-b from-accent-100 to-white flex items-center justify-center p-6">
                    <div
                      className="absolute top-4 right-4 z-10 p-1 bg-white/50 rounded-full cursor-pointer hover:bg-white transition-colors"
                      onClick={() => setIsModalOpen(false)}
                    >
                      <X className="w-5 h-5 text-gray-700" />
                    </div>

                    <div className="relative w-32 h-48 rounded-lg shadow-xl overflow-hidden border-2 border-white transform hover:scale-105 transition-transform duration-300">
                      {selectedBook.cover ? (
                        <Image
                          src={selectedBook.cover}
                          alt={content.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 pb-6 space-y-5">
                    {/* Title & Author */}
                    <div className="text-center space-y-1">
                      <h2 className="text-xl font-bold text-gray-900 font-comfortaa leading-tight">
                        {content.title}
                      </h2>
                      <p className="text-sm text-gray-500 font-comfortaa">
                        {selectedBook.author}
                      </p>
                    </div>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100">
                      <div className="flex flex-col items-center justify-center gap-1 p-2">
                        <div className="flex items-center gap-1 text-warning">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-bold text-sm">
                            {meta.rating}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                          {t_ebook.rating}
                        </span>
                      </div>
                      <div className="flex flex-col items-center justify-center gap-1 p-2 border-x border-gray-100">
                        <span className="font-bold text-sm text-gray-800">
                          {selectedBook.publication_year}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                          {t_ebook.year}
                        </span>
                      </div>
                      <div className="flex flex-col items-center justify-center gap-1 p-2">
                        <span className="font-bold text-sm text-gray-800">
                          {meta.pages}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                          {t_ebook.pageCount}
                        </span>
                      </div>
                    </div>

                    {/* Publisher */}
                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <Library className="w-5 h-5 text-awqaf-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase mb-0.5">
                          {t_ebook.publisher}
                        </p>
                        <p className="text-sm text-gray-700 font-medium leading-snug">
                          {selectedBook.publisher}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                        {t_ebook.synopsis}
                      </h3>
                      <div
                        className="text-sm text-gray-600 leading-relaxed font-comfortaa text-justify"
                        dangerouslySetInnerHTML={{
                          __html: content.description ?? "",
                        }}
                      />
                    </div>

                    {/* ISBN if available */}
                    {selectedBook.isbn && (
                      <div className="text-xs text-gray-400 font-mono text-center">
                        ISBN: {selectedBook.isbn}
                      </div>
                    )}
                  </div>

                  <DialogFooter className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <Button
                      className="w-full h-12 bg-awqaf-primary hover:bg-awqaf-primary/90 text-white font-bold text-base shadow-lg shadow-awqaf-primary/20"
                      onClick={() => handleOpenPdf(selectedBook.pdf)}
                    >
                      <Download className="w-5 h-5 mr-2" />
                      {t_ebook.downloadBtn}
                    </Button>
                  </DialogFooter>
                </>
              );
            })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}