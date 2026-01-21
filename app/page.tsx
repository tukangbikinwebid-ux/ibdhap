"use client";

import { Search, Clock, BookOpen, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import HijriDate from "./components/HijriDate";
import WidgetCard from "./components/WidgetCard";
import ProgressWidget from "./components/ProgressWidget";
import FeatureNavigation from "./components/FeatureNavigation";
import ArticleCard from "./components/ArticleCard";
import SearchModal from "./components/SearchModal";
import LanguageSwitcher from "./components/LanguageSwitcher";
// Import Services
import { useGetArticlesQuery } from "@/services/public/article.service";
import { usePrayerTracker } from "@/app/prayer-tracker/hooks/usePrayerTracker";
import { useGetSurahsQuery } from "@/services/public/quran.service";
// Import i18n
import { useI18n } from "./hooks/useI18n";
import { getCurrentLocale } from "@/lib/i18n";

export default function Home() {
  const { t, locale } = useI18n();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const currentHour = new Date().getHours();
  
  // Get greeting based on locale
  const getGreeting = () => {
    const hour = currentHour;
    const greetings: Record<string, { morning: string; afternoon: string; evening: string }> = {
      id: { morning: "Pagi", afternoon: "Siang", evening: "Malam" },
      en: { morning: "Morning", afternoon: "Afternoon", evening: "Evening" },
      ar: { morning: "صباح", afternoon: "ظهر", evening: "مساء" },
      fr: { morning: "Matin", afternoon: "Après-midi", evening: "Soir" },
      kr: { morning: "아침", afternoon: "오후", evening: "저녁" },
      jp: { morning: "朝", afternoon: "午後", evening: "夜" },
    };
    const greetingSet = greetings[locale] || greetings.id;
    return hour < 12 ? greetingSet.morning : hour < 18 ? greetingSet.afternoon : greetingSet.evening;
  };
  
  const greeting = getGreeting();

  // 1. Fetch Data
  const { data: articlesData, isLoading: isLoadingArticles } =
    useGetArticlesQuery({ page: 1, paginate: 10 });

  // Fetch Surah List untuk mapping nama (biasanya cached)
  const { data: surahList } = useGetSurahsQuery({ lang: "id" });

  const { currentPrayerKey, prayerTimes } = usePrayerTracker();

  // 2. Local State for Last Quran Activity
  const [lastQuranActivity, setLastQuranActivity] = useState(
    t("home.loading")
  );

  useEffect(() => {
    const lastRead = localStorage.getItem("quran-last-read");

    if (lastRead) {
      const parsed = JSON.parse(lastRead);
      const verseTexts: Record<string, string> = {
        id: "Ayat",
        en: "Verse",
        ar: "آية",
        fr: "Verset",
        kr: "절",
        jp: "節",
      };
      const verseText = verseTexts[locale] || verseTexts.id;
      setLastQuranActivity(`${parsed.surahName} : ${verseText} ${parsed.verse}`);
    } else {
      // Fallback ke recent ID
      const recent = localStorage.getItem("quran-recent");
      if (recent) {
        const arr = JSON.parse(recent);
        if (arr.length > 0) {
          const surahId = arr[0];
          // Cari nama surat
          const surahName = surahList?.find(
            (s) => s.id === surahId
          )?.transliteration;

          // Gunakan nama jika ada, jika tidak fallback sementara ke ID
          const surahTexts: Record<string, string> = {
            id: "Surah",
            en: "Surah",
            ar: "سورة",
            fr: "Sourate",
            kr: "수라",
            jp: "スーラ",
          };
          const surahText = surahTexts[locale] || surahTexts.id;
          const suffix = locale === "id" ? " ke-" : locale === "en" ? " " : locale === "ar" ? " " : locale === "fr" ? " " : locale === "kr" ? " " : " ";
          setLastQuranActivity(
            surahName ? `${surahText} ${surahName}` : `${surahText}${suffix}${surahId}`
          );
        }
      } else {
        const noActivityTexts: Record<string, string> = {
          id: "Belum ada aktivitas",
          en: "No activity yet",
          ar: "لا يوجد نشاط",
          fr: "Aucune activité",
          kr: "활동 없음",
          jp: "活動なし",
        };
        setLastQuranActivity(noActivityTexts[locale] || noActivityTexts.id);
      }
    }
  }, [surahList, locale]); // Re-run ketika surahList atau locale berubah

  // ... (Sisa kode helpers formatDate, latestArticles, prayerWidgetData sama seperti sebelumnya)
  // ... (Tidak ada perubahan pada helpers)

  // Helpers (disertakan kembali agar lengkap)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const localeMap: Record<string, string> = {
      id: "id-ID",
      en: "en-US",
      ar: "ar-SA",
      fr: "fr-FR",
      kr: "ko-KR",
      jp: "ja-JP",
    };
    return date.toLocaleDateString(localeMap[locale] || "id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const latestArticles = useMemo(() => {
    if (!articlesData?.data) return [];
    const sorted = [...articlesData.data].sort(
      (a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );

    return sorted.slice(0, 3).map((artikel) => ({
      id: artikel.id.toString(),
      slug: artikel.id.toString(),
      title: artikel.title,
      excerpt:
        artikel.content.replace(/<[^>]*>?/gm, "").substring(0, 100) + "...",
      category: artikel.category.name,
      readTime: "5 min",
      views: "1.2K",
      publishedAt: formatDate(artikel.published_at),
      image: artikel.image,
    }));
  }, [articlesData, locale]);

  const prayerWidgetData = useMemo(() => {
    if (!prayerTimes) return { title: t("home.loading"), time: "--:--" };

    // Prayer names based on locale - using i18n translations
    const prayerNames: Record<string, Record<string, string>> = {
      id: {
        fajr: t("prayer.prayerNames.fajr"),
        dhuhr: t("prayer.prayerNames.dhuhr"),
        asr: t("prayer.prayerNames.asr"),
        maghrib: t("prayer.prayerNames.maghrib"),
        isha: t("prayer.prayerNames.isha"),
      },
      en: {
        fajr: t("prayer.prayerNames.fajr"),
        dhuhr: t("prayer.prayerNames.dhuhr"),
        asr: t("prayer.prayerNames.asr"),
        maghrib: t("prayer.prayerNames.maghrib"),
        isha: t("prayer.prayerNames.isha"),
      },
      ar: {
        fajr: t("prayer.prayerNames.fajr"),
        dhuhr: t("prayer.prayerNames.dhuhr"),
        asr: t("prayer.prayerNames.asr"),
        maghrib: t("prayer.prayerNames.maghrib"),
        isha: t("prayer.prayerNames.isha"),
      },
      fr: {
        fajr: t("prayer.prayerNames.fajr"),
        dhuhr: t("prayer.prayerNames.dhuhr"),
        asr: t("prayer.prayerNames.asr"),
        maghrib: t("prayer.prayerNames.maghrib"),
        isha: t("prayer.prayerNames.isha"),
      },
      kr: {
        fajr: t("prayer.prayerNames.fajr"),
        dhuhr: t("prayer.prayerNames.dhuhr"),
        asr: t("prayer.prayerNames.asr"),
        maghrib: t("prayer.prayerNames.maghrib"),
        isha: t("prayer.prayerNames.isha"),
      },
      jp: {
        fajr: t("prayer.prayerNames.fajr"),
        dhuhr: t("prayer.prayerNames.dhuhr"),
        asr: t("prayer.prayerNames.asr"),
        maghrib: t("prayer.prayerNames.maghrib"),
        isha: t("prayer.prayerNames.isha"),
      },
    };

    // Fungsi untuk mengkonversi waktu string (HH:MM) ke menit
    const parseTime = (timeStr: string): number => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    // Dapatkan waktu saat ini dalam menit
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Konversi semua waktu sholat ke menit
    const times = {
      fajr: parseTime(prayerTimes.fajr),
      dhuhr: parseTime(prayerTimes.dhuhr),
      asr: parseTime(prayerTimes.asr),
      maghrib: parseTime(prayerTimes.maghrib),
      isha: parseTime(prayerTimes.isha),
    };

    // Tentukan sholat yang sedang aktif berdasarkan waktu saat ini
    type PrayerKey = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
    let activePrayer: PrayerKey | null = null;

    // Logika: cek waktu saat ini berada di rentang waktu sholat mana
    if (currentMinutes >= times.fajr && currentMinutes < times.dhuhr) {
      activePrayer = "fajr";
    } else if (currentMinutes >= times.dhuhr && currentMinutes < times.asr) {
      activePrayer = "dhuhr";
    } else if (currentMinutes >= times.asr && currentMinutes < times.maghrib) {
      activePrayer = "asr";
    } else if (currentMinutes >= times.maghrib && currentMinutes < times.isha) {
      activePrayer = "maghrib";
    } else if (currentMinutes >= times.isha || currentMinutes < times.fajr) {
      // Setelah Isya atau sebelum Subuh (malam hari)
      activePrayer = "isha";
    }

    // Gunakan activePrayer jika ada, jika tidak gunakan currentPrayerKey dari hook, atau fallback ke Subuh
    const prayerKey: PrayerKey = (activePrayer || currentPrayerKey || "fajr") as PrayerKey;

    return {
      title: prayerNames[locale]?.[prayerKey] || prayerNames.id[prayerKey],
      time: prayerTimes[prayerKey],
    };
  }, [prayerTimes, currentPrayerKey, locale]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full shadow-sm border-2 border-accent-100 flex items-center justify-center">
                  <Image
                    src="/ibadahapp-logo.png"
                    alt="IbadahApp Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                    {t("home.title")}
                  </h1>
                  <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                    {t("home.subtitle")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/store">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 p-0 rounded-full bg-accent-100 hover:bg-accent-200 hover:text-awqaf-primary transition-colors duration-200"
                    title={t("widgets.store")}
                  >
                    <ShoppingBag className="w-5 h-5 text-awqaf-primary" />
                  </Button>
                </Link>

                <LanguageSwitcher />

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-full bg-accent-100 hover:bg-accent-200 hover:text-awqaf-primary transition-colors duration-200"
                  onClick={() => setIsSearchOpen(true)}
                  title={t("common.search")}
                >
                  <Search className="w-5 h-5 text-awqaf-primary hover:text-awqaf-primary transition-colors duration-200" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Welcome Banner */}
        <Card className="border-awqaf-border-light bg-gradient-to-r from-accent-100 to-accent-200">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa mb-2">
              {locale === "ar" ? (
                <>
                  {greeting} {t("home.greeting")}
                </>
              ) : (
                <>
                  {t("home.greeting")} {greeting}
                </>
              )}
            </h2>
            <p className="text-sm text-awqaf-foreground-secondary font-comfortaa mb-3">
              <span className="font-tajawal text-awqaf-primary">
                السلام عليكم
              </span>
              <br />
              Assalamu&apos;alaikum
            </p>
            <p className="text-xs text-awqaf-foreground-secondary font-comfortaa italic">
              {(() => {
                const quotes: Record<string, string> = {
                  id: "Dan barangsiapa yang bertakwa kepada Allah, niscaya Dia akan mengadakan baginya jalan keluar.",
                  en: "And whoever fears Allah - He will make for him a way out.",
                  ar: "ومن يتق الله يجعل له مخرجا",
                  fr: "Et quiconque craint Allah, Il lui donnera une issue.",
                  kr: "하나님을 두려워하는 자에게는 그가 길을 열어주실 것이다.",
                  jp: "アッラーを畏れる者には、彼は道を開いてくださる。",
                };
                return quotes[locale] || quotes.id;
              })()}
            </p>
            <p className="text-xs text-awqaf-primary font-tajawal mt-2">
              - QS. At-Talaq: 2
            </p>
          </CardContent>
        </Card>

        {/* Widget Cards - REALTIME DATA */}
        <div className="grid grid-cols-2 gap-4">
          <WidgetCard
            type="prayer"
            title={t("widgets.prayer")}
            subtitle={prayerWidgetData.title}
            time={prayerWidgetData.time}
            status="current"
            icon={<Clock className="w-4 h-4 text-awqaf-primary" />}
          />
          <WidgetCard
            type="activity"
            title={(() => {
              const titles: Record<string, string> = {
                id: "Aktivitas Terakhir",
                en: "Last Activity",
                ar: "النشاط الأخير",
                fr: "Dernière activité",
                kr: "마지막 활동",
                jp: "最後の活動",
              };
              return titles[locale] || titles.id;
            })()}
            subtitle={t("widgets.quran")}
            activity={lastQuranActivity}
            icon={<BookOpen className="w-4 h-4 text-info" />}
          />
        </div>

        {/* Progress Widget - REALTIME DATA */}
        <ProgressWidget />

        {/* Feature Navigation */}
        <FeatureNavigation />

        {/* Articles Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
              {(() => {
                const titles: Record<string, string> = {
                  id: "Artikel Terbaru",
                  en: "Latest Articles",
                  ar: "المقالات الأخيرة",
                  fr: "Derniers articles",
                  kr: "최신 기사",
                  jp: "最新記事",
                };
                return titles[locale] || titles.id;
              })()}
            </h2>
            <Link href="/artikel">
              <Button
                variant="ghost"
                size="sm"
                className="text-awqaf-foreground-secondary hover:text-awqaf-primary hover:bg-accent-100 font-comfortaa transition-colors duration-200"
              >
                {t("home.viewAll")}
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {isLoadingArticles ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-awqaf-primary" />
              </div>
            ) : latestArticles.length > 0 ? (
              latestArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            ) : (
              <p className="text-center text-sm text-gray-500 py-4 font-comfortaa">
                {(() => {
                  const messages: Record<string, string> = {
                    id: "Belum ada artikel terbaru.",
                    en: "No latest articles yet.",
                    ar: "لا توجد مقالات جديدة",
                    fr: "Aucun article récent pour le moment.",
                    kr: "최신 기사가 없습니다.",
                    jp: "最新の記事はまだありません。",
                  };
                  return messages[locale] || messages.id;
                })()}
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}