"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, BookOpen, Bookmark, Clock, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SurahCard from "../components/SurahCard";
import SurahFilter from "../components/SurahFilter";
import { useRouter } from "next/navigation";
// Import service API
import { useGetSurahsQuery } from "@/services/public/quran.service";
import { Surah } from "@/types/public/quran";

export default function QuranPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null); // Note: API contoh mungkin belum support filter Juz
  const [selectedRevelation, setSelectedRevelation] = useState<
    "all" | "Meccan" | "Medinan"
  >("all");
  const [bookmarkedSurahs, setBookmarkedSurahs] = useState<number[]>([]);
  const [recentSurahs, setRecentSurahs] = useState<number[]>([]);
  const [isBookmarkOpen, setIsBookmarkOpen] = useState(false);

  // Fetch API
  const { data: apiSurahs, isLoading } = useGetSurahsQuery({ lang: "id" });

  // Mapping data API ke struktur internal jika perlu, atau gunakan langsung
  const allSurahs = useMemo(() => {
    return apiSurahs || [];
  }, [apiSurahs]);

  // Load bookmarked surahs from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("quran-bookmarks");
    if (savedBookmarks) {
      setBookmarkedSurahs(JSON.parse(savedBookmarks));
    }
  }, []);

  // Load recent surahs from localStorage
  useEffect(() => {
    const savedRecent = localStorage.getItem("quran-recent");
    if (savedRecent) {
      setRecentSurahs(JSON.parse(savedRecent));
    }
  }, []);

  // Filter surahs based on search and filters
  const filteredSurahs = useMemo(() => {
    return allSurahs.filter((surah) => {
      const matchesSearch =
        searchQuery === "" ||
        surah.transliteration
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        surah.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.name.includes(searchQuery);

      // Filter Juz dilewati dulu karena API contoh list surah tidak return Juz
      // const matchesJuz = selectedJuz === null || surah.juz === selectedJuz;

      const typeLower = surah.type.toLowerCase(); // meccan / medinan
      const filterLower = selectedRevelation.toLowerCase();

      const matchesRevelation =
        selectedRevelation === "all" || typeLower === filterLower;

      return matchesSearch && matchesRevelation;
    });
  }, [searchQuery, selectedRevelation, allSurahs]);

  // Get recent surahs with details
  const recentSurahsWithDetails = useMemo(() => {
    return recentSurahs
      .map((surahId) => allSurahs.find((s) => s.id === surahId))
      .filter(Boolean)
      .slice(0, 5) as Surah[];
  }, [recentSurahs, allSurahs]);

  // Get bookmarked surahs with details
  const bookmarkedSurahsWithDetails = useMemo(() => {
    return bookmarkedSurahs
      .map((surahId) => allSurahs.find((s) => s.id === surahId))
      .filter(Boolean) as Surah[];
  }, [bookmarkedSurahs, allSurahs]);

  // Handle bookmark toggle
  const handleBookmark = (surahNumber: number) => {
    const newBookmarks = bookmarkedSurahs.includes(surahNumber)
      ? bookmarkedSurahs.filter((num) => num !== surahNumber)
      : [...bookmarkedSurahs, surahNumber];

    setBookmarkedSurahs(newBookmarks);
    localStorage.setItem("quran-bookmarks", JSON.stringify(newBookmarks));
  };

  // Handle surah click (for recent tracking)
  const handleSurahClick = (surahNumber: number) => {
    const newRecent = [
      surahNumber,
      ...recentSurahs.filter((num) => num !== surahNumber),
    ].slice(0, 10);
    setRecentSurahs(newRecent);
    localStorage.setItem("quran-recent", JSON.stringify(newRecent));
    router.push(`/quran/${surahNumber}`);
  };

  // Open bookmarked surah
  const openBookmarkedSurah = (surahNumber: number) => {
    handleSurahClick(surahNumber);
    setIsBookmarkOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <h1 className="text-xl font-bold text-awqaf-primary font-comfortaa text-center">
              Al-Qur&apos;an
            </h1>
            <p className="text-sm text-awqaf-foreground-secondary font-comfortaa text-center mt-1">
              Kitab suci umat Islam
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Search Bar & Filter */}
        <Card className="border-awqaf-border-light">
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-5 h-5 text-awqaf-foreground-secondary" />
              <Input
                type="text"
                placeholder="Cari surah (Latin, Arti, Arab)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-0 bg-transparent text-awqaf-foreground placeholder-awqaf-foreground-secondary font-comfortaa focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <SurahFilter
              selectedJuz={selectedJuz}
              onJuzChange={setSelectedJuz}
              selectedRevelation={selectedRevelation}
              onRevelationChange={setSelectedRevelation}
            />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card
            className="border-awqaf-border-light hover:shadow-md transition-all duration-200 cursor-pointer group"
            onClick={() => handleSurahClick(1)}
          >
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-accent-200 transition-colors duration-200">
                <BookOpen className="w-6 h-6 text-awqaf-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground text-sm font-comfortaa mb-1">
                Baca Al-Qur&apos;an
              </h3>
              <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                Mulai dari Al-Fatihah
              </p>
            </CardContent>
          </Card>

          <Card
            onClick={() => setIsBookmarkOpen(true)}
            className="border-awqaf-border-light hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-accent-200 transition-colors duration-200">
                <Bookmark className="w-6 h-6 text-info" />
              </div>
              <h3 className="font-semibold text-card-foreground text-sm font-comfortaa mb-1">
                Bookmark
              </h3>
              <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                {bookmarkedSurahs.length} surah tersimpan
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bookmarked Surahs Dialog */}
        <Dialog open={isBookmarkOpen} onOpenChange={setIsBookmarkOpen}>
          <DialogContent className="border-awqaf-border-light p-0">
            <DialogHeader className="p-4">
              <DialogTitle className="font-comfortaa">
                Surah Tersimpan
              </DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4">
              {bookmarkedSurahsWithDetails.length === 0 ? (
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa text-center py-6">
                  Belum ada surah yang dibookmark
                </p>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto mobile-scroll">
                  {bookmarkedSurahsWithDetails.map((surah) => (
                    <div
                      key={surah.id}
                      onClick={() => openBookmarkedSurah(surah.id)}
                      className="flex items-center justify-between p-3 rounded-md border border-awqaf-border-light hover:bg-accent-50 cursor-pointer"
                    >
                      <div>
                        <p className="font-semibold font-comfortaa text-card-foreground">
                          {surah.id}. {surah.transliteration}
                        </p>
                        <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                          {surah.name} • {surah.total_verses} ayat
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Recent Surahs */}
        {recentSurahsWithDetails.length > 0 && (
          <Card className="border-awqaf-border-light">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-awqaf-primary" />
                <h3 className="font-semibold text-card-foreground font-comfortaa">
                  Baru Dibaca
                </h3>
              </div>

              <div className="space-y-3">
                {recentSurahsWithDetails.map((surah) => (
                  <div
                    key={surah.id}
                    onClick={() => handleSurahClick(surah.id)}
                  >
                    <SurahCard
                      surah={surah}
                      onBookmark={handleBookmark}
                      isBookmarked={bookmarkedSurahs.includes(surah.id)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Surahs */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-card-foreground font-comfortaa">
                Semua Surah
              </h3>
              <span className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                {isLoading ? "Memuat..." : `${filteredSurahs.length} surah`}
              </span>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-awqaf-primary" />
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto mobile-scroll">
                {filteredSurahs.map((surah) => (
                  <div
                    key={surah.id}
                    onClick={() => handleSurahClick(surah.id)}
                  >
                    <SurahCard
                      surah={surah}
                      onBookmark={handleBookmark}
                      isBookmarked={bookmarkedSurahs.includes(surah.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}