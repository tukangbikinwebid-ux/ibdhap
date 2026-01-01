"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  Bookmark,
  BookmarkCheck,
  Share2,
  Settings,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
// Import Service
import { useGetSurahDetailQuery } from "@/services/public/quran.service";

export default function SurahDetailPage() {
  const params = useParams();
  const router = useRouter();
  const surahId = params.id as string;

  // Fetch Detail Surah
  const {
    data: surah,
    isLoading,
    isError,
  } = useGetSurahDetailQuery({
    surat: surahId,
    lang: "id",
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );

  const [bookmarkedVerses, setBookmarkedVerses] = useState<number[]>([]);
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");
  const [showTranslation, setShowTranslation] = useState(true);

  // Load bookmarked verses
  useEffect(() => {
    const savedBookmarks = localStorage.getItem(
      `quran-verse-bookmarks-${surahId}`
    );
    if (savedBookmarks) {
      setBookmarkedVerses(JSON.parse(savedBookmarks));
    }
  }, [surahId]);

  useEffect(() => {
    if (surah) {
      const data = {
        surahName: surah.transliteration,
        verse: 1, 
        page: 1,
      };
      localStorage.setItem("quran-last-read", JSON.stringify(data));
    }
  }, [surah]);

  // Handle audio playback (Simple implementation using HTMLAudioElement)
  useEffect(() => {
    return () => {
      // Cleanup audio saat unmount
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, [currentAudio]);

  const handlePlayPause = () => {
    if (!surah) return;

    if (isPlaying && currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
    } else {
      // Menggunakan audio reciter pertama (misal Mishary Rashid - key "1")
      // Sesuaikan key jika API mengembalikan key lain
      const audioUrl = surah.audio["1"]?.url;

      if (audioUrl) {
        const audio = new Audio(audioUrl);
        setCurrentAudio(audio);
        audio.play();
        setIsPlaying(true);

        audio.onended = () => setIsPlaying(false);
      } else {
        alert("Audio tidak tersedia untuk surah ini.");
      }
    }
  };

  // Handle verse bookmark
  const handleVerseBookmark = (verseId: number) => {
    const newBookmarks = bookmarkedVerses.includes(verseId)
      ? bookmarkedVerses.filter((num) => num !== verseId)
      : [...bookmarkedVerses, verseId];

    setBookmarkedVerses(newBookmarks);
    localStorage.setItem(
      `quran-verse-bookmarks-${surahId}`,
      JSON.stringify(newBookmarks)
    );
  };

  // Handle share
  const handleShare = async () => {
    if (!surah) return;
    const shareText = `Baca Surah ${surah.transliteration} (${surah.translation}) di IbadahApp`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Surah ${surah.transliteration}`,
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link disalin!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Volume2 className="w-8 h-8 text-awqaf-primary animate-pulse" />
          </div>
          <p className="text-awqaf-foreground-secondary font-comfortaa">
            Memuat surah...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !surah) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Gagal memuat surah. Silakan coba lagi.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-awqaf-primary" />
              </Button>

              <div className="text-center flex-1">
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                  {surah.transliteration}
                </h1>
                <p className="text-sm text-awqaf-primary font-tajawal">
                  {surah.name}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 transition-colors duration-200"
                >
                  <Share2 className="w-5 h-5 text-awqaf-primary" />
                </Button>
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 transition-colors duration-200"
                    >
                      <Settings className="w-5 h-5 text-awqaf-primary" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="border-awqaf-border-light">
                    <DrawerHeader>
                      <DrawerTitle className="font-comfortaa">
                        Pengaturan
                      </DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 space-y-4">
                      <div>
                        <p className="text-sm text-awqaf-foreground-secondary font-comfortaa mb-2">
                          Ukuran Font
                        </p>
                        <div className="flex gap-2">
                          {(["sm", "md", "lg"] as const).map((size) => (
                            <Button
                              key={size}
                              variant={
                                fontSize === size ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setFontSize(size)}
                              className="font-comfortaa"
                            >
                              {size === "sm"
                                ? "Kecil"
                                : size === "md"
                                ? "Sedang"
                                : "Besar"}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-awqaf-foreground-secondary font-comfortaa mb-2">
                          Terjemahan
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant={showTranslation ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowTranslation(true)}
                            className="font-comfortaa"
                          >
                            Tampilkan
                          </Button>
                          <Button
                            variant={!showTranslation ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowTranslation(false)}
                            className="font-comfortaa"
                          >
                            Sembunyikan
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Surah Info */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                  <span className="text-awqaf-primary font-bold font-comfortaa text-lg">
                    {surah.id}
                  </span>
                </div>
                <div>
                  <h2 className="font-semibold text-card-foreground font-comfortaa text-lg">
                    {surah.transliteration}
                  </h2>
                  <p className="text-xs text-awqaf-foreground-secondary">
                    {surah.translation}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayPause}
                className="border-awqaf-border-light hover:bg-accent-100 font-comfortaa"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {isPlaying ? "Pause" : "Play Audio"}
              </Button>
            </div>

            <div className="flex items-center gap-4 text-sm text-awqaf-foreground-secondary font-comfortaa">
              <span>{surah.total_verses} ayat</span>
              <Badge
                variant="secondary"
                className={
                  surah.type === "meccan"
                    ? "bg-accent-100 text-awqaf-primary"
                    : "bg-info/20 text-info"
                }
              >
                {surah.type === "meccan" ? "Makkiyah" : "Madaniyah"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Verses */}
        <div className="space-y-4">
          {/* Bismillah (Kecuali At-Taubah / Surah 9) */}
          {surah.id !== 9 && (
            <div className="text-center py-4">
              <p className="text-2xl font-arabic text-awqaf-primary">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </div>
          )}

          {surah.verses.map((verse) => (
            <Card key={verse.id} className="border-awqaf-border-light">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Verse Number */}
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-awqaf-primary font-bold font-comfortaa text-sm">
                      {verse.id}
                    </span>
                  </div>

                  {/* Verse Content */}
                  <div className="flex-1 min-w-0">
                    {/* Arabic Text */}
                    <div className="mb-3 text-right">
                      <p
                        className={`text-awqaf-primary font-arabic leading-loose ${
                          fontSize === "sm"
                            ? "text-xl"
                            : fontSize === "md"
                            ? "text-2xl"
                            : "text-3xl"
                        }`}
                      >
                        {verse.text}
                      </p>
                    </div>

                    {/* Translation */}
                    {showTranslation && (
                      <div className="mb-3">
                        <p
                          className={`text-awqaf-foreground-secondary font-comfortaa leading-relaxed ${
                            fontSize === "sm"
                              ? "text-sm"
                              : fontSize === "md"
                              ? "text-base"
                              : "text-lg"
                          }`}
                        >
                          {verse.translation}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVerseBookmark(verse.id)}
                        className="h-8 px-2 text-awqaf-foreground-secondary hover:text-awqaf-primary hover:bg-accent-100 transition-colors duration-200"
                      >
                        {bookmarkedVerses.includes(verse.id) ? (
                          <BookmarkCheck className="w-4 h-4 text-awqaf-primary" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}