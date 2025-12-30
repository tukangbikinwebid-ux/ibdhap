"use client";

import { Search, Clock, BookOpen, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { artikelData } from "./artikel/data-artikel";
import HijriDate from "./components/HijriDate";
import WidgetCard from "./components/WidgetCard";
import ProgressWidget from "./components/ProgressWidget";
import FeatureNavigation from "./components/FeatureNavigation";
import ArticleCard from "./components/ArticleCard";
import SearchModal from "./components/SearchModal";
import NotificationButton from "./components/NotificationButton";

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Pagi" : currentHour < 18 ? "Siang" : "Malam";

  // Format tanggal ke lokal Indonesia
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Ambil artikel terbaru dari sumber data yang sama dengan halaman /artikel
  const latestArticles = artikelData
    .slice()
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 3)
    .map((artikel) => ({
      id: artikel.id,
      slug: artikel.slug,
      title: artikel.title,
      excerpt: artikel.excerpt,
      category: artikel.category,
      readTime: artikel.readTime,
      views: artikel.views.toLocaleString(),
      publishedAt: formatDate(artikel.publishedAt),
      image: artikel.image,
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          {/* Background only for header content */}
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

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
                {/* DIRECT LINK TO STORE */}
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

        {/* Widget Cards */}
        <div className="grid grid-cols-2 gap-4">
          <WidgetCard
            type="prayer"
            title="Waktu Sholat"
            subtitle="Dzuhur"
            time="12:15"
            status="current"
            icon={<Clock className="w-4 h-4 text-awqaf-primary" />}
          />
          <WidgetCard
            type="activity"
            title="Aktivitas Terakhir"
            subtitle="Baca Al-Qur'an"
            activity="Surah Al-Fatihah"
            icon={<BookOpen className="w-4 h-4 text-info" />}
          />
        </div>

        {/* Progress Widget */}
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
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
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