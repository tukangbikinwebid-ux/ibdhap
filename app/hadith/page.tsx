"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Calendar,
  Heart,
  Share2,
  Copy,
  CheckCircle,
  Navigation,
  RefreshCw,
  User,
  Loader2,
  Filter,
} from "lucide-react";
import Link from "next/link";
// Import Services
import {
  useGetHadithBooksQuery,
  useGetHadithBookDetailQuery,
} from "@/services/public/hadith.service";
import { Hadith as ApiHadith, HadithBook } from "@/types/public/hadith";
// Import i18n
import { useI18n } from "@/app/hooks/useI18n";

// Extend local type for UI state
interface HadithUI extends ApiHadith {
  sourceBookName: string; // Menyimpan nama buku sumber (misal: HR. Bukhari)
}

export default function HadithPage() {
  const { t, locale } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedBookId, setSelectedBookId] = useState<string>("bukhari"); // Default Bukhari
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Pagination State (Simple load more logic)
  const [rangeFrom, setRangeFrom] = useState(1);
  const [rangeTo, setRangeTo] = useState(20);

  // 1. Fetch List of Books
  const { data: booksData, isLoading: isLoadingBooks } =
    useGetHadithBooksQuery();

  // 2. Fetch Hadith Detail (List of Hadiths in a book)
  const {
    data: hadithDetailData,
    isLoading: isLoadingHadiths,
    isFetching,
  } = useGetHadithBookDetailQuery({
    book: selectedBookId,
    from: rangeFrom,
    to: rangeTo,
  });

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Load favorites
  useEffect(() => {
    const savedFavorites = localStorage.getItem("hadith-favorites");
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Save favorites
  useEffect(() => {
    localStorage.setItem("hadith-favorites", JSON.stringify([...favorites]));
  }, [favorites]);

  // Filter Logic (Client-side filtering on fetched data)
  // Note: API only supports pagination by ID range, not search content.
  // Real search would require backend support or fetching ALL hadiths (too heavy).
  // Here we filter only the loaded batch.
  const filteredHadiths = useMemo(() => {
    if (!hadithDetailData?.hadiths) return [];

    let filtered = hadithDetailData.hadiths;

    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      filtered = filtered.filter(
        (hadith) =>
          hadith.arab.toLowerCase().includes(q) ||
          hadith.id.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [hadithDetailData, debouncedQuery]);

  const handleToggleFavorite = (hadithNumber: number) => {
    // Unique ID combining Book + Number to avoid collision
    const uniqueId = `${selectedBookId}-${hadithNumber}`;
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(uniqueId)) {
        newFavorites.delete(uniqueId);
      } else {
        newFavorites.add(uniqueId);
      }
      return newFavorites;
    });
  };

  const handleCopyHadith = async (hadith: ApiHadith) => {
    const text = `${hadith.arab}\n\n${hadith.id}\n\n- ${hadithDetailData?.name} No. ${hadith.number}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(hadith.number);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShareHadith = async (hadith: ApiHadith) => {
    const text = `${hadith.arab}\n\n${hadith.id}\n\n- ${hadithDetailData?.name} No. ${hadith.number}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("hadith.selectedHadith"),
          text: text,
        });
      } catch (err) {
        console.error("Failed to share:", err);
      }
    } else {
      handleCopyHadith(hadith);
    }
  };

  const handleNextPage = () => {
    // Pagination logic: next 20 items
    setRangeFrom((prev) => prev + 20);
    setRangeTo((prev) => prev + 20);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevPage = () => {
    if (rangeFrom <= 1) return;
    setRangeFrom((prev) => Math.max(1, prev - 20));
    setRangeTo((prev) => Math.max(20, prev - 20));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset pagination when book changes
  const handleBookChange = (bookId: string) => {
    setSelectedBookId(bookId);
    setRangeFrom(1);
    setRangeTo(20);
  };

  // Hadith of the Day (Simulasi ambil dari data pertama yang diload)
  const hadithOfTheDay = useMemo(() => {
    if (hadithDetailData?.hadiths && hadithDetailData.hadiths.length > 0) {
      return hadithDetailData.hadiths[0];
    }
    return null;
  }, [hadithDetailData]);

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
                {t("hadith.title")}
              </h1>
              <div className="w-10 h-10"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Hadith of the Day (Dynamically from loaded data) */}
        {!isLoadingHadiths && hadithOfTheDay && (
          <Card className="border-awqaf-border-light bg-gradient-to-r from-accent-100 to-accent-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-comfortaa flex items-center gap-2">
                <Calendar className="w-5 h-5 text-awqaf-primary" />
                {t("hadith.selectedHadith")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white/80 p-4 rounded-lg">
                <p className="text-lg font-tajawal text-awqaf-primary text-center leading-relaxed mb-4 line-clamp-4">
                  {hadithOfTheDay.arab}
                </p>
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa text-center leading-relaxed line-clamp-3">
                  {hadithOfTheDay.id}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-awqaf-foreground-secondary font-comfortaa">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3" />
                  <span>{hadithDetailData?.name}</span>
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
                  className="flex-1"
                >
                  <Heart
                    className={`w-4 h-4 mr-2 ${
                      favorites.has(
                        `${selectedBookId}-${hadithOfTheDay.number}`
                      )
                        ? "fill-red-500 text-red-500"
                        : ""
                    }`}
                  />
                  {t("hadith.favorite")}
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

        {/* Search & Filter Bar */}
        <Card className="border-awqaf-border-light sticky top-[68px] z-20">
          <CardContent className="p-3 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-awqaf-foreground-secondary" />
              <Input
                placeholder={t("hadith.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 font-comfortaa"
              />
            </div>

            {/* Book Filter (Chips) */}
            {isLoadingBooks ? (
              <div className="flex gap-2 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-20 bg-gray-200 animate-pulse rounded-full"
                  />
                ))}
              </div>
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-1 mobile-scroll items-center">
                <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <DrawerTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 gap-1"
                    >
                      <Filter className="w-3 h-3" /> {t("hadith.allBooks")}
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="border-awqaf-border-light max-h-[80vh]">
                    <DrawerHeader>
                      <DrawerTitle className="font-comfortaa">
                        {t("hadith.selectBook")}
                      </DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 grid grid-cols-2 gap-3 overflow-y-auto">
                      {booksData?.map((book) => (
                        <Button
                          key={book.id}
                          variant={
                            selectedBookId === book.id ? "default" : "outline"
                          }
                          className="justify-start h-auto py-2 px-3 text-left"
                          onClick={() => {
                            handleBookChange(book.id);
                            setIsFilterOpen(false);
                          }}
                        >
                          <div className="flex flex-col items-start w-full">
                            <span className="font-bold text-sm">
                              {book.name}
                            </span>
                            <span className="text-[10px] opacity-70">
                              {book.available} {t("hadith.hadiths")}
                            </span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </DrawerContent>
                </Drawer>

                {/* Quick Access Chips */}
                {booksData?.slice(0, 5).map((book) => (
                  <Button
                    key={book.id}
                    variant={selectedBookId === book.id ? "default" : "outline"}
                    size="sm"
                    className="flex-shrink-0"
                    onClick={() => handleBookChange(book.id)}
                  >
                    {book.name.replace("HR. ", "")}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hadith List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
              {hadithDetailData?.name || t("hadith.hadithList")}
            </h2>
            <span className="text-xs text-gray-500">
              {t("hadith.showing")} {rangeFrom}-
              {Math.min(rangeTo, hadithDetailData?.available || 0)}
            </span>
          </div>

          {isLoadingHadiths || isFetching ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-awqaf-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHadiths.map((hadith) => (
                <Card key={hadith.number} className="border-awqaf-border-light">
                  <CardContent className="p-4 space-y-4">
                    {/* Arabic Text */}
                    <div className="bg-accent-50 p-4 rounded-lg">
                      <p className="text-lg font-tajawal text-awqaf-primary text-right leading-loose">
                        {hadith.arab}
                      </p>
                    </div>

                    {/* Translation */}
                    <div>
                      <p className="text-sm text-awqaf-foreground-secondary font-comfortaa leading-relaxed">
                        {hadith.id}
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-awqaf-foreground-secondary font-comfortaa">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{hadithDetailData?.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>No. {hadith.number}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleFavorite(hadith.number)}
                        className="flex-1"
                      >
                        <Heart
                          className={`w-4 h-4 mr-2 ${
                            favorites.has(`${selectedBookId}-${hadith.number}`)
                              ? "fill-red-500 text-red-500"
                              : ""
                          }`}
                        />
                        {t("hadith.favorite")}
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
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoadingHadiths && filteredHadiths.length === 0 && (
            <Card className="border-awqaf-border-light">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-awqaf-foreground-secondary mx-auto mb-4" />
                <h3 className="font-semibold text-card-foreground font-comfortaa mb-2">
                  {t("hadith.noHadithFound")}
                </h3>
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  {t("hadith.tryDifferentKeyword")}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Pagination Controls */}
          {!isLoadingHadiths && filteredHadiths.length > 0 && (
            <div className="flex justify-center gap-4 pt-4">
              <Button
                variant="outline"
                onClick={handlePrevPage}
                disabled={rangeFrom <= 1 || isFetching}
              >
                {t("hadith.previous")}
              </Button>
              <Button
                onClick={handleNextPage}
                disabled={
                  rangeTo >= (hadithDetailData?.available || 0) || isFetching
                }
                className="bg-awqaf-primary"
              >
                {t("hadith.next")}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}