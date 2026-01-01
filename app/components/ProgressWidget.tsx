"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Target } from "lucide-react";
import { usePrayerTracker } from "@/app/prayer-tracker/hooks/usePrayerTracker";
// Import service untuk mendapatkan nama surat
import { useGetSurahsQuery } from "@/services/public/quran.service";

interface QuranProgress {
  lastReadSurah: string;
  lastReadVerse: number;
  totalVersesRead: number;
}

export default function ProgressWidget() {
  // 1. Get Prayer Progress
  const { todayData, isLoading: isPrayerLoading } = usePrayerTracker();

  // 2. Get Surah Data untuk mapping ID ke Nama
  const { data: surahList } = useGetSurahsQuery({ lang: "id" });

  // 3. State for Quran Progress
  const [quranProgress, setQuranProgress] = useState({
    completed: 0,
    total: 604,
    percentage: 0,
    lastRead: "Belum membaca",
  });

  // Load Quran progress from localStorage
  useEffect(() => {
    const lastReadData = localStorage.getItem("quran-last-read");
    const savedRecent = localStorage.getItem("quran-recent");

    if (lastReadData) {
      const parsed = JSON.parse(lastReadData);
      setQuranProgress({
        completed: parsed.page || 1,
        total: 604,
        percentage: Math.round(((parsed.page || 1) / 604) * 100),
        lastRead: `${parsed.surahName} : Ayat ${parsed.verse}`,
      });
    } else if (savedRecent) {
      // Fallback ke recent (array of IDs)
      const recent = JSON.parse(savedRecent);
      if (recent.length > 0) {
        const surahId = recent[0];
        // Cari nama surat berdasarkan ID dari data API
        const surahName = surahList?.find(
          (s) => s.id === surahId
        )?.transliteration;

        setQuranProgress((prev) => ({
          ...prev,
          // Gunakan nama surat jika ada, jika belum load gunakan ID sementara
          lastRead: surahName ? `Surah ${surahName}` : `Surah ke-${surahId}`,
        }));
      } else {
        setQuranProgress((prev) => ({ ...prev, lastRead: "Belum membaca" }));
      }
    }
  }, [surahList]); // Tambahkan surahList ke dependency agar update saat data API masuk

  // Calculate Prayer Progress
  const prayerCompleted = todayData?.completedPrayers || 0;
  const prayerTotal = 5;
  const prayerPercentage = Math.round((prayerCompleted / prayerTotal) * 100);

  return (
    <Card className="border-awqaf-border-light hover:shadow-md transition-all duration-200 col-span-2">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
            <Target className="w-4 h-4 text-awqaf-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground text-sm font-comfortaa">
              Progress Hari Ini
            </h3>
            <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
              Target ibadah harian
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Prayer Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-awqaf-primary" />
                <span className="text-sm font-medium text-card-foreground font-comfortaa">
                  Sholat Wajib
                </span>
              </div>
              <span className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                {isPrayerLoading ? "..." : `${prayerCompleted}/${prayerTotal}`}
              </span>
            </div>
            <Progress value={prayerPercentage} className="h-2 bg-accent-100" />
            <div className="flex justify-between text-xs text-awqaf-foreground-secondary font-comfortaa">
              <span>0%</span>
              <span className="font-medium text-awqaf-primary">
                {prayerPercentage}%
              </span>
              <span>100%</span>
            </div>
          </div>

          {/* Quran Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-info" />
                <span className="text-sm font-medium text-card-foreground font-comfortaa">
                  Al-Qur&apos;an
                </span>
              </div>
              <span className="text-xs text-awqaf-foreground-secondary font-comfortaa max-w-[120px] truncate text-right">
                {quranProgress.lastRead}
              </span>
            </div>
            <Progress
              value={quranProgress.percentage}
              className="h-2 bg-accent-100"
            />
            <div className="flex justify-between text-xs text-awqaf-foreground-secondary font-comfortaa">
              <span>Hlm 1</span>
              <span className="font-medium text-info">
                Hlm {quranProgress.completed}
              </span>
              <span>Hlm 604</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}