"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Target } from "lucide-react";
// Hapus hook lokal lama
// import { usePrayerTracker } from "@/app/prayer-tracker/hooks/usePrayerTracker";
import { useGetSurahsQuery } from "@/services/public/quran.service";
import { useI18n } from "@/app/hooks/useI18n";
// Import Service Baru
import { useGetUserSholatListQuery } from "@/services/sholat-track.service"; // Sesuaikan path jika berbeda

export default function ProgressWidget() {
  const { locale } = useI18n();

  // 1. Get Prayer Data from API
  const { data: sholatData, isLoading: isPrayerLoading } =
    useGetUserSholatListQuery({ page: 1 });

  // 2. Get Surah Data
  const { data: surahList } = useGetSurahsQuery({ lang: "id" });

  // 3. Calculate Prayer Progress (Logic Baru)
  const prayerStats = useMemo(() => {
    // Default values
    let completed = 0;
    const total = 5;

    // Generate tanggal hari ini YYYY-MM-DD
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const todayDate = `${year}-${month}-${day}`;

    // Cari record hari ini dari data API
    const todayRecord = sholatData?.data?.find(
      (record) => record.date === todayDate,
    );

    // Hitung sholat yang sudah dikerjakan (boolean === true)
    if (todayRecord) {
      if (todayRecord.fajr) completed++;
      if (todayRecord.dhuhr) completed++;
      if (todayRecord.asr) completed++;
      if (todayRecord.maghrib) completed++;
      if (todayRecord.isha) completed++;
    }

    return {
      completed,
      total,
      percentage: Math.round((completed / total) * 100),
    };
  }, [sholatData]);

  // 4. State for Quran Progress
  const [quranProgress, setQuranProgress] = useState({
    completed: 0,
    total: 604,
    percentage: 0,
    lastRead: "",
  });

  // --- Inline Translations ---
  const TEXTS = {
    id: {
      title: "Progress Hari Ini",
      subtitle: "Target ibadah harian",
      prayer: "Sholat Wajib",
      quran: "Al-Qur'an",
      notRead: "Belum membaca",
      page: "Hlm",
      surah: "Surah",
      verse: "Ayat",
    },
    en: {
      title: "Today's Progress",
      subtitle: "Daily worship target",
      prayer: "Obligatory Prayer",
      quran: "Quran",
      notRead: "Not read yet",
      page: "Pg",
      surah: "Surah",
      verse: "Verse",
    },
    ar: {
      title: "تقدم اليوم",
      subtitle: "هدف العبادة اليومي",
      prayer: "الصلوات المفروضة",
      quran: "القرآن",
      notRead: "لم تقرأ بعد",
      page: "ص",
      surah: "سورة",
      verse: "آية",
    },
    fr: {
      title: "Progrès d'aujourd'hui",
      subtitle: "Objectif de culte quotidien",
      prayer: "Prière Obligatoire",
      quran: "Coran",
      notRead: "Pas encore lu",
      page: "P",
      surah: "Sourate",
      verse: "Verset",
    },
    kr: {
      title: "오늘의 진행 상황",
      subtitle: "일일 예배 목표",
      prayer: "의무 기도",
      quran: "꾸란",
      notRead: "아직 읽지 않음",
      page: "쪽",
      surah: "수라",
      verse: "절",
    },
    jp: {
      title: "今日の進捗",
      subtitle: "毎日の礼拝目標",
      prayer: "義務の礼拝",
      quran: "クルアーン",
      notRead: "未読",
      page: "ページ",
      surah: "スーラ",
      verse: "節",
    },
  };

  const t = TEXTS[locale as keyof typeof TEXTS] || TEXTS.id;

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
        lastRead: `${parsed.surahName} : ${t.verse} ${parsed.verse}`,
      });
    } else if (savedRecent) {
      const recent = JSON.parse(savedRecent);
      if (recent.length > 0) {
        const surahId = recent[0];
        const surahName = surahList?.find(
          (s) => s.id === surahId,
        )?.transliteration;

        setQuranProgress((prev) => ({
          ...prev,
          lastRead: surahName
            ? `${t.surah} ${surahName}`
            : `${t.surah} ${surahId}`,
        }));
      } else {
        setQuranProgress((prev) => ({ ...prev, lastRead: t.notRead }));
      }
    } else {
      setQuranProgress((prev) => ({ ...prev, lastRead: t.notRead }));
    }
  }, [surahList, locale, t.verse, t.surah, t.notRead]);

  return (
    <Card className="border-awqaf-border-light hover:shadow-md transition-all duration-200 col-span-2">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
            <Target className="w-4 h-4 text-awqaf-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground text-sm font-comfortaa">
              {t.title}
            </h3>
            <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
              {t.subtitle}
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
                  {t.prayer}
                </span>
              </div>
              <span className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                {isPrayerLoading
                  ? "..."
                  : `${prayerStats.completed}/${prayerStats.total}`}
              </span>
            </div>
            <Progress
              value={prayerStats.percentage}
              className="h-2 bg-accent-100"
            />
            <div className="flex justify-between text-xs text-awqaf-foreground-secondary font-comfortaa">
              <span>0%</span>
              <span className="font-medium text-awqaf-primary">
                {prayerStats.percentage}%
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
                  {t.quran}
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
              <span>{t.page} 1</span>
              <span className="font-medium text-info">
                {t.page} {quranProgress.completed}
              </span>
              <span>{t.page} 604</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}