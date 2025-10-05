import { Search, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import HijriDate from "./components/HijriDate";
import WidgetCard from "./components/WidgetCard";
import FeatureNavigation from "./components/FeatureNavigation";
import ArticleCard from "./components/ArticleCard";

export default function Home() {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Pagi" : currentHour < 18 ? "Siang" : "Malam";

  // Sample articles data
  const articles = [
    {
      id: "1",
      title: "Keutamaan Sholat Berjamaah di Masjid",
      excerpt:
        "Sholat berjamaah memiliki keutamaan yang sangat besar dalam Islam. Mari kita pelajari bersama...",
      category: "Fiqih",
      readTime: "5 min",
      views: "2.3K",
      publishedAt: "2 jam lalu",
    },
    {
      id: "2",
      title: "Hikmah Puasa Sunnah Senin Kamis",
      excerpt:
        "Puasa sunnah Senin Kamis memiliki banyak hikmah dan keutamaan yang luar biasa...",
      category: "Ibadah",
      readTime: "3 min",
      views: "1.8K",
      publishedAt: "5 jam lalu",
    },
    {
      id: "3",
      title: "Cara Menjaga Lisan dalam Kehidupan Sehari-hari",
      excerpt:
        "Lisan adalah salah satu nikmat Allah yang harus kita jaga dengan baik...",
      category: "Akhlak",
      readTime: "4 min",
      views: "3.1K",
      publishedAt: "1 hari lalu",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-awqaf-border-light">
        <div className="max-w-md mx-auto px-4 py-4">
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
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 p-0 rounded-full bg-accent-100 hover:bg-accent-200 hover:text-awqaf-primary transition-colors duration-200"
            >
              <Search className="w-5 h-5 text-awqaf-primary hover:text-awqaf-primary transition-colors duration-200" />
            </Button>
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
        <div className="widget-grid">
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

        {/* Feature Navigation */}
        <FeatureNavigation />

        {/* Articles Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
              Artikel Terbaru
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-awqaf-foreground-secondary hover:text-awqaf-primary hover:bg-accent-100 font-comfortaa transition-colors duration-200"
            >
              Lihat Semua
            </Button>
          </div>

          <div className="space-y-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

