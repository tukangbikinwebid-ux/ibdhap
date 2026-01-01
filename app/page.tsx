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
import NotificationButton from "./components/NotificationButton";
// Import Services
import { useGetArticlesQuery } from "@/services/public/article.service";
import { usePrayerTracker } from "@/app/prayer-tracker/hooks/usePrayerTracker";
import { useGetSurahsQuery } from "@/services/public/quran.service"; // Tambahkan import ini

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Pagi" : currentHour < 18 ? "Siang" : "Malam";

  // 1. Fetch Data
  const { data: articlesData, isLoading: isLoadingArticles } =
    useGetArticlesQuery({ page: 1, paginate: 10 });

  // Fetch Surah List untuk mapping nama (biasanya cached)
  const { data: surahList } = useGetSurahsQuery({ lang: "id" });

  const { currentPrayerKey, prayerTimes } = usePrayerTracker();

  // 2. Local State for Last Quran Activity
  const [lastQuranActivity, setLastQuranActivity] = useState(
    "Belum ada aktivitas"
  );

  useEffect(() => {
    const lastRead = localStorage.getItem("quran-last-read");

    if (lastRead) {
      const parsed = JSON.parse(lastRead);
      setLastQuranActivity(`${parsed.surahName} : Ayat ${parsed.verse}`);
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
          setLastQuranActivity(
            surahName ? `Surah ${surahName}` : `Surah ke-${surahId}`
          );
        }
      }
    }
  }, [surahList]); // Re-run ketika surahList tersedia

  // ... (Sisa kode helpers formatDate, latestArticles, prayerWidgetData sama seperti sebelumnya)
  // ... (Tidak ada perubahan pada helpers)

  // Helpers (disertakan kembali agar lengkap)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
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
  }, [articlesData]);

  const prayerWidgetData = useMemo(() => {
    if (!prayerTimes) return { title: "Memuat...", time: "--:--" };

    const prayerNames: Record<string, string> = {
      fajr: "Subuh",
      dhuhr: "Dzuhur",
      asr: "Ashar",
      maghrib: "Maghrib",
      isha: "Isya",
    };

    if (currentPrayerKey) {
      return {
        title: prayerNames[currentPrayerKey],
        time: prayerTimes[currentPrayerKey],
      };
    }

    return {
      title: "Subuh",
      time: prayerTimes.fajr,
    };
  }, [prayerTimes, currentPrayerKey]);

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
                    IbadahApp
                  </h1>
                  <HijriDate />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/store">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 p-0 rounded-full bg-accent-100 hover:bg-accent-200 hover:text-awqaf-primary transition-colors duration-200"
                    title="Store"
                  >
                    <ShoppingBag className="w-5 h-5 text-awqaf-primary" />
                  </Button>
                </Link>

                <NotificationButton />

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-full bg-accent-100 hover:bg-accent-200 hover:text-awqaf-primary transition-colors duration-200"
                  onClick={() => setIsSearchOpen(true)}
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
              Selamat {greeting}
            </h2>
            <p className="text-sm text-awqaf-foreground-secondary font-comfortaa mb-3">
              <span className="font-tajawal text-awqaf-primary">
                السلام عليكم
              </span>
              <br />
              Assalamu&apos;alaikum
            </p>
            <p className="text-xs text-awqaf-foreground-secondary font-comfortaa italic">
              &quot;Dan barangsiapa yang bertakwa kepada Allah, niscaya Dia akan
              mengadakan baginya jalan keluar.&quot;
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
            title="Waktu Sholat"
            subtitle={prayerWidgetData.title}
            time={prayerWidgetData.time}
            status="current"
            icon={<Clock className="w-4 h-4 text-awqaf-primary" />}
          />
          <WidgetCard
            type="activity"
            title="Aktivitas Terakhir"
            subtitle="Baca Al-Qur'an"
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
              Artikel Terbaru
            </h2>
            <Link href="/artikel">
              <Button
                variant="ghost"
                size="sm"
                className="text-awqaf-foreground-secondary hover:text-awqaf-primary hover:bg-accent-100 font-comfortaa transition-colors duration-200"
              >
                Lihat Semua
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
                Belum ada artikel terbaru.
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