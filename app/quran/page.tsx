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
// Import i18n
import { useI18n } from "@/app/hooks/useI18n";

// Mapping Juz untuk setiap surah berdasarkan standar Al-Quran
// Mapping ini menunjukkan juz pertama di mana surah dimulai
// Untuk filter, kita akan menampilkan surah yang dimulai di juz yang dipilih
const getSurahJuz = (surahId: number): number => {
  // Mapping berdasarkan juz di mana surah dimulai
  // Format: [surahId]: juz pertama
  const juzMap: Record<number, number> = {
    1: 1,   // Al-Fatihah - Juz 1
    2: 1,   // Al-Baqarah - Juz 1 (berlanjut ke juz 2-3)
    3: 4,   // Ali 'Imran - Juz 3-4
    4: 4,   // An-Nisa - Juz 4-6
    5: 6,   // Al-Ma'idah - Juz 6-7
    6: 7,   // Al-An'am - Juz 7-8
    7: 8,   // Al-A'raf - Juz 8-9
    8: 9,   // Al-Anfal - Juz 9-10
    9: 10,  // At-Tawbah - Juz 10-11
    10: 11, // Yunus - Juz 11
    11: 12, // Hud - Juz 12
    12: 12, // Yusuf - Juz 12-13
    13: 13, // Ar-Ra'd - Juz 13
    14: 13, // Ibrahim - Juz 13
    15: 14, // Al-Hijr - Juz 14
    16: 14, // An-Nahl - Juz 14
    17: 15, // Al-Isra - Juz 15
    18: 15, // Al-Kahf - Juz 15-16
    19: 16, // Maryam - Juz 16
    20: 16, // Ta-Ha - Juz 16
    21: 17, // Al-Anbiya - Juz 17
    22: 17, // Al-Hajj - Juz 17
    23: 18, // Al-Mu'minun - Juz 18
    24: 18, // An-Nur - Juz 18
    25: 19, // Al-Furqan - Juz 19
    26: 19, // Ash-Shu'ara - Juz 19
    27: 19, // An-Naml - Juz 19-20
    28: 20, // Al-Qasas - Juz 20
    29: 20, // Al-Ankabut - Juz 20-21
    30: 21, // Ar-Rum - Juz 21
    31: 21, // Luqman - Juz 21
    32: 21, // As-Sajdah - Juz 21
    33: 21, // Al-Ahzab - Juz 21-22
    34: 22, // Saba - Juz 22
    35: 22, // Fatir - Juz 22
    36: 22, // Ya-Sin - Juz 22-23
    37: 23, // As-Saffat - Juz 23
    38: 23, // Sad - Juz 23
    39: 23, // Az-Zumar - Juz 23-24
    40: 24, // Ghafir - Juz 24
    41: 24, // Fussilat - Juz 24-25
    42: 25, // Ash-Shura - Juz 25
    43: 25, // Az-Zukhruf - Juz 25
    44: 25, // Ad-Dukhan - Juz 25
    45: 25, // Al-Jathiyah - Juz 25
    46: 26, // Al-Ahqaf - Juz 26
    47: 26, // Muhammad - Juz 26
    48: 26, // Al-Fath - Juz 26
    49: 26, // Al-Hujurat - Juz 26
    50: 26, // Qaf - Juz 26
    51: 26, // Adh-Dhariyat - Juz 26-27
    52: 27, // At-Tur - Juz 27
    53: 27, // An-Najm - Juz 27
    54: 27, // Al-Qamar - Juz 27
    55: 27, // Ar-Rahman - Juz 27
    56: 27, // Al-Waqi'ah - Juz 27
    57: 27, // Al-Hadid - Juz 27
    58: 28, // Al-Mujadila - Juz 28
    59: 28, // Al-Hashr - Juz 28
    60: 28, // Al-Mumtahanah - Juz 28
    61: 28, // As-Saff - Juz 28
    62: 28, // Al-Jumu'ah - Juz 28
    63: 28, // Al-Munafiqun - Juz 28
    64: 28, // At-Taghabun - Juz 28
    65: 28, // At-Talaq - Juz 28
    66: 28, // At-Tahrim - Juz 28
    67: 29, // Al-Mulk - Juz 29
    68: 29, // Al-Qalam - Juz 29
    69: 29, // Al-Haqqah - Juz 29
    70: 29, // Al-Ma'arij - Juz 29
    71: 29, // Nuh - Juz 29
    72: 29, // Al-Jinn - Juz 29
    73: 29, // Al-Muzzammil - Juz 29
    74: 29, // Al-Muddaththir - Juz 29
    75: 29, // Al-Qiyamah - Juz 29
    76: 29, // Al-Insan - Juz 29
    77: 29, // Al-Mursalat - Juz 29
    78: 30, // An-Naba - Juz 30
    79: 30, // An-Nazi'at - Juz 30
    80: 30, // 'Abasa - Juz 30
    81: 30, // At-Takwir - Juz 30
    82: 30, // Al-Infitar - Juz 30
    83: 30, // Al-Mutaffifin - Juz 30
    84: 30, // Al-Inshiqaq - Juz 30
    85: 30, // Al-Buruj - Juz 30
    86: 30, // At-Tariq - Juz 30
    87: 30, // Al-A'la - Juz 30
    88: 30, // Al-Ghashiyah - Juz 30
    89: 30, // Al-Fajr - Juz 30
    90: 30, // Al-Balad - Juz 30
    91: 30, // Ash-Shams - Juz 30
    92: 30, // Al-Layl - Juz 30
    93: 30, // Ad-Duha - Juz 30
    94: 30, // Ash-Sharh - Juz 30
    95: 30, // At-Tin - Juz 30
    96: 30, // Al-'Alaq - Juz 30
    97: 30, // Al-Qadr - Juz 30
    98: 30, // Al-Bayyinah - Juz 30
    99: 30, // Az-Zalzalah - Juz 30
    100: 30, // Al-'Adiyat - Juz 30
    101: 30, // Al-Qari'ah - Juz 30
    102: 30, // At-Takathur - Juz 30
    103: 30, // Al-'Asr - Juz 30
    104: 30, // Al-Humazah - Juz 30
    105: 30, // Al-Fil - Juz 30
    106: 30, // Quraysh - Juz 30
    107: 30, // Al-Ma'un - Juz 30
    108: 30, // Al-Kawthar - Juz 30
    109: 30, // Al-Kafirun - Juz 30
    110: 30, // An-Nasr - Juz 30
    111: 30, // Al-Masad - Juz 30
    112: 30, // Al-Ikhlas - Juz 30
    113: 30, // Al-Falaq - Juz 30
    114: 30, // An-Nas - Juz 30
  };

  return juzMap[surahId] || 1; // Default ke juz 1 jika tidak ditemukan
};

export default function QuranPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null);
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
      // Filter berdasarkan pencarian
      const matchesSearch =
        searchQuery === "" ||
        surah.transliteration
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        surah.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.name.includes(searchQuery);

      // Filter berdasarkan Juz
      const matchesJuz =
        selectedJuz === null || getSurahJuz(surah.id) === selectedJuz;

      // Filter berdasarkan tempat turun (revelation type)
      // Normalisasi untuk case-insensitive matching
      const surahType = surah.type?.toLowerCase() || "";
      let matchesRevelation = true;

      if (selectedRevelation !== "all") {
        const filterType = selectedRevelation.toLowerCase();
        // Handle berbagai variasi penulisan: meccan/makkiyah, medinan/madaniyah
        if (filterType === "meccan") {
          matchesRevelation = surahType === "meccan" || surahType === "makkiyah";
        } else if (filterType === "medinan") {
          matchesRevelation =
            surahType === "medinan" || surahType === "madaniyah";
        }
      }

      return matchesSearch && matchesJuz && matchesRevelation;
    });
  }, [searchQuery, selectedJuz, selectedRevelation, allSurahs]);

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
              {t("quran.title")}
            </h1>
            <p className="text-sm text-awqaf-foreground-secondary font-comfortaa text-center mt-1">
              {t("quran.subtitle")}
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
                placeholder={t("quran.searchPlaceholder")}
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
                {t("quran.readQuran")}
              </h3>
              <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                {t("quran.startFromFatihah")}
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
                {t("quran.bookmark")}
              </h3>
              <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                {bookmarkedSurahs.length} {t("quran.surahSaved")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bookmarked Surahs Dialog */}
        <Dialog open={isBookmarkOpen} onOpenChange={setIsBookmarkOpen}>
          <DialogContent className="border-awqaf-border-light p-0">
            <DialogHeader className="p-4">
              <DialogTitle className="font-comfortaa">
                {t("quran.savedSurahs")}
              </DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4">
              {bookmarkedSurahsWithDetails.length === 0 ? (
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa text-center py-6">
                  {t("quran.noBookmarks")}
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
                          {surah.name} • {surah.total_verses} {t("quran.verses")}
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
                  {t("quran.recentlyRead")}
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
                {t("quran.allSurahs")}
              </h3>
              <span className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                {isLoading ? t("quran.loading") : `${filteredSurahs.length} ${t("quran.surah")}`}
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