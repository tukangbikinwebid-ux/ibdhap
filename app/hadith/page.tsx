"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  BookOpen,
  Search,
  Heart,
  Share2,
  Copy,
  CheckCircle,
  Navigation,
  User,
  Loader2,
  Filter,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import {
  useGetHadithBooksQuery,
  useGetHadithListByBookQuery,
  HadithBook,
  Hadith,
} from "@/services/public/hadith.service";
import { useI18n } from "@/app/hooks/useI18n";

// --- TYPES ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface HadithPageTranslations {
  title: string;
  subtitle: string;
  selectBook: string;
  allBooks: string;
  hadiths: string;
  hadithList: string;
  searchPlaceholder: string;
  selectedHadith: string;
  favorite: string;
  noHadithFound: string;
  tryDifferentKeyword: string;
  resetFilter: string;
  showing: string;
  previous: string;
  next: string;
}

// --- TRANSLATION DICTIONARY ---
const HADITH_TEXT: Record<LocaleCode, HadithPageTranslations> = {
  id: {
    title: "Hadits Shahih",
    subtitle: "Kumpulan hadits dari kitab-kitab terpercaya",
    selectBook: "Pilih Kitab",
    allBooks: "Semua Kitab",
    hadiths: "Hadits",
    hadithList: "Daftar Hadits",
    searchPlaceholder: "Cari hadits...",
    selectedHadith: "Hadits Pilihan",
    favorite: "Favorit",
    noHadithFound: "Tidak ada hadits ditemukan",
    tryDifferentKeyword: "Coba kata kunci lain",
    resetFilter: "Reset Filter",
    showing: "Menampilkan",
    previous: "Sebelumnya",
    next: "Selanjutnya",
  },
  en: {
    title: "Sahih Hadith",
    subtitle: "Collection of hadiths from authentic books",
    selectBook: "Select Book",
    allBooks: "All Books",
    hadiths: "Hadiths",
    hadithList: "Hadith List",
    searchPlaceholder: "Search hadith...",
    selectedHadith: "Selected Hadith",
    favorite: "Favorite",
    noHadithFound: "No hadith found",
    tryDifferentKeyword: "Try another keyword",
    resetFilter: "Reset Filter",
    showing: "Showing",
    previous: "Previous",
    next: "Next",
  },
  ar: {
    title: "الحديث الصحيح",
    subtitle: "مجموعة من الأحاديث من الكتب المعتبرة",
    selectBook: "اختر الكتاب",
    allBooks: "كل الكتب",
    hadiths: "أحاديث",
    hadithList: "قائمة الحديث",
    searchPlaceholder: "ابحث عن حديث...",
    selectedHadith: "حديث مختار",
    favorite: "مفضل",
    noHadithFound: "لم يتم العثور على حديث",
    tryDifferentKeyword: "جرب كلمة مفتاحية أخرى",
    resetFilter: "إعادة تعيين المرشح",
    showing: "عرض",
    previous: "السابق",
    next: "التالي",
  },
  fr: {
    title: "Hadith Sahih",
    subtitle: "Collection de hadiths de livres authentiques",
    selectBook: "Choisir un Livre",
    allBooks: "Tous les Livres",
    hadiths: "Hadiths",
    hadithList: "Liste des Hadiths",
    searchPlaceholder: "Rechercher un hadith...",
    selectedHadith: "Hadith Sélectionné",
    favorite: "Favori",
    noHadithFound: "Aucun hadith trouvé",
    tryDifferentKeyword: "Essayez un autre mot-clé",
    resetFilter: "Réinitialiser",
    showing: "Affichage",
    previous: "Précédent",
    next: "Suivant",
  },
  kr: {
    title: "사히 하디스",
    subtitle: "정통 서적의 하디스 모음",
    selectBook: "책 선택",
    allBooks: "모든 책",
    hadiths: "하디스",
    hadithList: "하디스 목록",
    searchPlaceholder: "하디스 검색...",
    selectedHadith: "선택된 하디스",
    favorite: "즐겨찾기",
    noHadithFound: "하디스를 찾을 수 없습니다",
    tryDifferentKeyword: "다른 키워드로 시도해 보세요",
    resetFilter: "필터 초기화",
    showing: "표시 중",
    previous: "이전",
    next: "다음",
  },
  jp: {
    title: "サヒーフ・ハディース",
    subtitle: "真正な書物からのハディース集",
    selectBook: "本を選択",
    allBooks: "すべての本",
    hadiths: "ハディース",
    hadithList: "ハディース一覧",
    searchPlaceholder: "ハディースを検索...",
    selectedHadith: "選択されたハディース",
    favorite: "お気に入り",
    noHadithFound: "ハディースが見つかりません",
    tryDifferentKeyword: "別のキーワードを試してください",
    resetFilter: "フィルターをリセット",
    showing: "表示中",
    previous: "前へ",
    next: "次へ",
  },
};

export default function HadithPage() {
  const { locale } = useI18n();
  // Safe Locale Access
  const safeLocale = (
    HADITH_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = HADITH_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedBookId, setSelectedBookId] = useState<number>(1); // Default to first book
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Fetch Books
  const { data: booksData, isLoading: isLoadingBooks } =
    useGetHadithBooksQuery();

  // 2. Fetch Hadiths (This hook re-runs when selectedBookId or currentPage changes)
  const {
    data: hadithData,
    isLoading: isLoadingHadiths,
    isFetching,
  } = useGetHadithListByBookQuery({
    bookId: selectedBookId,
    page: currentPage,
  });

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Load/Save Favorites
  useEffect(() => {
    const savedFavorites = localStorage.getItem("hadith-favorites");
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("hadith-favorites", JSON.stringify([...favorites]));
  }, [favorites]);

  // Helper: Strip HTML
  const stripHtml = (html: string) => {
    if (typeof window === "undefined") return html;
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Helper: Get Translated Book Content
  const getBookContent = (book: HadithBook) => {
    const localized = book.translations.find((tr) => tr.locale === locale);
    const idFallback = book.translations.find((tr) => tr.locale === "id");
    const name = localized?.name || idFallback?.name || book.name;
    return { name };
  };

  // Helper: Get Translated Hadith Content
  const getHadithContent = (hadith: Hadith) => {
    const localized = hadith.translations.find((tr) => tr.locale === locale);
    const idFallback = hadith.translations.find((tr) => tr.locale === "id");
    const translation =
      localized?.translation || idFallback?.translation || hadith.latin_text; // Fallback jika translasi kosong

    return {
      translation: stripHtml(translation),
      arabic: stripHtml(hadith.arabic_text),
      latin: stripHtml(hadith.latin_text), // Menambahkan latin_text
    };
  };

  // Filter Logic (Client-side search)
  const filteredHadiths = useMemo(() => {
    if (!hadithData?.hadiths) return [];
    let filtered = hadithData.hadiths;
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      filtered = filtered.filter((hadith) => {
        const content = getHadithContent(hadith);
        return (
          content.translation.toLowerCase().includes(q) ||
          content.arabic.includes(q) ||
          content.latin.toLowerCase().includes(q) ||
          hadith.number.toString().includes(q)
        );
      });
    }
    return filtered;
  }, [hadithData, debouncedQuery, locale]);

  // Handlers
  const handleToggleFavorite = (hadithNumber: number) => {
    const uniqueId = `${selectedBookId}-${hadithNumber}`;
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(uniqueId)) newFavorites.delete(uniqueId);
      else newFavorites.add(uniqueId);
      return newFavorites;
    });
  };

  const getCurrentBookName = () => {
    const book = booksData?.find((b) => b.id === selectedBookId);
    if (!book) return "Hadith Book";
    return getBookContent(book).name;
  };

  const handleCopyHadith = async (hadith: Hadith) => {
    const content = getHadithContent(hadith);
    const bookName = getCurrentBookName();
    const text = `${content.arabic}\n\n${content.latin}\n\n${content.translation}\n\n- ${bookName} No. ${hadith.number}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(hadith.number);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShareHadith = async (hadith: Hadith) => {
    const content = getHadithContent(hadith);
    const bookName = getCurrentBookName();
    const text = `${content.arabic}\n\n${content.latin}\n\n${content.translation}\n\n- ${bookName} No. ${hadith.number}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: t.selectedHadith,
          text: text,
        });
      } catch (err) {
        console.error("Failed to share:", err);
      }
    } else {
      handleCopyHadith(hadith);
    }
  };

  // CHANGE BOOK HANDLER
  const handleBookChange = (bookId: number) => {
    setSelectedBookId(bookId);
    setCurrentPage(1);
  };

  const hadithOfTheDay = useMemo(() => {
    if (hadithData?.hadiths && hadithData.hadiths.length > 0) {
      return hadithData.hadiths[0];
    }
    return null;
  }, [hadithData]);

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
                  <ArrowLeft className="w-10 h-10" />
                </Button>
              </Link>
              <div className="text-center">
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                  {t.title}
                </h1>
                <p className="text-[10px] text-awqaf-foreground-secondary font-comfortaa">
                  {t.subtitle}
                </p>
              </div>
              <div className="w-10 h-10"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Hadith of the Day */}
        {!isLoadingHadiths && hadithOfTheDay && (
          <Card className="border-awqaf-border-light bg-gradient-to-r from-accent-100 to-accent-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-comfortaa flex items-center gap-2">
                <Calendar className="w-5 h-5 text-awqaf-primary" />
                {t.selectedHadith}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white/80 p-4 rounded-lg">
                <p className="text-lg font-tajawal text-awqaf-primary text-center leading-relaxed mb-4 line-clamp-4">
                  {getHadithContent(hadithOfTheDay).arabic}
                </p>
                {/* Latin Text */}
                {getHadithContent(hadithOfTheDay).latin && (
                  <p className="text-sm font-comfortaa text-awqaf-primary/80 italic text-center mb-2">
                    {getHadithContent(hadithOfTheDay).latin}
                  </p>
                )}
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa text-center leading-relaxed line-clamp-3">
                  {getHadithContent(hadithOfTheDay).translation}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-awqaf-foreground-secondary font-comfortaa">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3" />
                  <span>{getCurrentBookName()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3 h-3" />
                  <span>No. {hadithOfTheDay.number}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleFavorite(hadithOfTheDay.number)}
                  className="flex-1 font-comfortaa"
                >
                  <Heart
                    className={`w-4 h-4 mr-2 ${
                      favorites.has(
                        `${selectedBookId}-${hadithOfTheDay.number}`,
                      )
                        ? "fill-red-500 text-red-500"
                        : ""
                    }`}
                  />
                  {t.favorite}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShareHadith(hadithOfTheDay)}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filter Bar (Book Selection) */}
        <Card className="border-awqaf-border-light sticky top-[80px] z-20">
          <CardContent className="p-3 space-y-3">
            <div className="relative">
              <Search
                className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-awqaf-foreground-secondary ${
                  isRtl ? "right-3" : "left-3"
                }`}
              />
              <Input
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`font-comfortaa ${isRtl ? "pr-10" : "pl-10"}`}
              />
            </div>

            {/* Book Filter */}
            {isLoadingBooks ? (
              <div className="flex gap-2 overflow-hidden">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-20 bg-gray-200 animate-pulse rounded-full"
                  />
                ))}
              </div>
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-1 items-center">
                <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <DrawerTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 gap-1 font-comfortaa"
                    >
                      <Filter className="w-3 h-3" /> {t.allBooks}
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="border-awqaf-border-light max-h-[80vh]">
                    <DrawerHeader>
                      <DrawerTitle className="font-comfortaa">
                        {t.selectBook}
                      </DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 grid grid-cols-2 gap-3 overflow-y-auto">
                      {booksData?.map((book) => {
                        const content = getBookContent(book);
                        return (
                          <Button
                            key={book.id}
                            variant={
                              selectedBookId === book.id ? "default" : "outline"
                            }
                            className="justify-start h-auto py-2 px-3 text-left bg-awqaf-primary/5 hover:bg-awqaf-primary/10"
                            onClick={() => {
                              handleBookChange(book.id);
                              setIsFilterOpen(false);
                            }}
                          >
                            <div className="flex flex-col items-start w-full">
                              <span className="font-bold text-sm text-awqaf-primary font-comfortaa">
                                {content.name}
                              </span>
                              <span className="text-[10px] opacity-70 font-comfortaa text-awqaf-foreground-secondary">
                                {book.available} {t.hadiths}
                              </span>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </DrawerContent>
                </Drawer>

                {/* Quick Access Chips */}
                {booksData?.slice(0, 5).map((book) => {
                  const content = getBookContent(book);
                  return (
                    <Button
                      key={book.id}
                      variant={
                        selectedBookId === book.id ? "default" : "outline"
                      }
                      size="sm"
                      className="flex-shrink-0 font-comfortaa"
                      onClick={() => handleBookChange(book.id)}
                    >
                      {content.name}
                    </Button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* List of Hadiths */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
              {getCurrentBookName()}
            </h2>
            <span className="text-xs text-gray-500 font-comfortaa">
              {t.showing} {filteredHadiths.length} {t.hadiths}
            </span>
          </div>

          {isLoadingHadiths || isFetching ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-awqaf-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHadiths.map((hadith) => {
                const content = getHadithContent(hadith);
                return (
                  <Card
                    key={hadith.id}
                    className="border-awqaf-border-light hover:shadow-md transition-shadow duration-200"
                  >
                    <CardContent className="p-4 space-y-4">
                      <div className="bg-accent-50 p-4 rounded-lg">
                        <div
                          className="text-lg font-tajawal text-awqaf-primary text-right leading-loose"
                          dangerouslySetInnerHTML={{
                            __html: content.arabic,
                          }}
                        />
                      </div>

                      {/* Latin Text */}
                      {content.latin && (
                        <div className="text-sm font-comfortaa text-awqaf-primary/80 italic leading-relaxed">
                          {content.latin}
                        </div>
                      )}

                      <div>
                        <div
                          className="text-sm text-awqaf-foreground-secondary font-comfortaa leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: content.translation,
                          }}
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleFavorite(hadith.number)}
                          className="flex-1 font-comfortaa"
                        >
                          <Heart
                            className={`w-4 h-4 mr-2 ${
                              favorites.has(
                                `${selectedBookId}-${hadith.number}`,
                              )
                                ? "fill-red-500 text-red-500"
                                : ""
                            }`}
                          />
                          {t.favorite}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyHadith(hadith)}
                        >
                          {copiedId === hadith.number ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareHadith(hadith)}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!isLoadingHadiths && filteredHadiths.length === 0 && (
            <Card className="border-awqaf-border-light">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-awqaf-foreground-secondary mx-auto mb-4" />
                <h3 className="font-semibold text-card-foreground font-comfortaa mb-2">
                  {t.noHadithFound}
                </h3>
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  {t.tryDifferentKeyword}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Pagination Controls */}
          {!isLoadingHadiths && filteredHadiths.length > 0 && (
            <div className="flex justify-center gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={currentPage <= 1 || isFetching}
                className="font-comfortaa"
              >
                {t.previous}
              </Button>
              <span className="flex items-center text-sm font-comfortaa">
                {t.showing} {currentPage}
              </span>
              <Button
                onClick={() => {
                  setCurrentPage((p) => p + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={isFetching}
                className="bg-awqaf-primary font-comfortaa"
              >
                {t.next}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}