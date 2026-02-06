"use client";

import {
  Search,
  ShoppingBag,
  Loader2,
  LogOut,
  ChevronDown,
  User,
  Clock,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Components
import WidgetCard from "./components/WidgetCard";
import ProgressWidget from "./components/ProgressWidget";
import FeatureNavigation from "./components/FeatureNavigation";
import ArticleCard from "./components/ArticleCard";
import SearchModal from "./components/SearchModal";
import LanguageSwitcher from "./components/LanguageSwitcher";

// Services
import { useGetArticlesQuery } from "@/services/public/article.service";
import { usePrayerTracker } from "@/app/prayer-tracker/hooks/usePrayerTracker";
import { useGetSurahsQuery } from "@/services/public/quran.service";
import { useLogoutMutation } from "@/services/auth.service";

// I18n & Types
import { useI18n } from "./hooks/useI18n";
import { Article } from "@/types/public/article";
import { signOut } from "next-auth/react";

// --- TIPE & DICTIONARY ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";
type PrayerKey = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

interface HomeTranslations {
  latestArticles: string;
  viewAll: string;
  noArticles: string;
  loading: string;
  quran: {
    verse: string;
    surah: string;
    notRead: string;
  };
  menu: {
    logout: string;
  };
}

const HOME_TEXT: Record<LocaleCode, HomeTranslations> = {
  id: {
    latestArticles: "Artikel Terbaru",
    viewAll: "Lihat Semua",
    noArticles: "Belum ada artikel terbaru.",
    loading: "Memuat...",
    quran: { verse: "Ayat", surah: "Surah", notRead: "Belum ada aktivitas" },
    menu: { logout: "Keluar" },
  },
  en: {
    latestArticles: "Latest Articles",
    viewAll: "View All",
    noArticles: "No latest articles yet.",
    loading: "Loading...",
    quran: { verse: "Verse", surah: "Surah", notRead: "No activity yet" },
    menu: { logout: "Log Out" },
  },
  ar: {
    latestArticles: "أحدث المقالات",
    viewAll: "عرض الكل",
    noArticles: "لا توجد مقالات جديدة.",
    loading: "جار التحميل...",
    quran: { verse: "آية", surah: "سورة", notRead: "لا يوجد نشاط" },
    menu: { logout: "تسجيل خروج" },
  },
  fr: {
    latestArticles: "Derniers articles",
    viewAll: "Voir tout",
    noArticles: "Aucun article récent.",
    loading: "Chargement...",
    quran: { verse: "Verset", surah: "Sourate", notRead: "Aucune activité" },
    menu: { logout: "Se déconnecter" },
  },
  kr: {
    latestArticles: "최신 기사",
    viewAll: "모두 보기",
    noArticles: "최신 기사가 없습니다.",
    loading: "로딩 중...",
    quran: { verse: "절", surah: "수라", notRead: "활동 없음" },
    menu: { logout: "로그아웃" },
  },
  jp: {
    latestArticles: "最新記事",
    viewAll: "すべて見る",
    noArticles: "最新の記事はありません。",
    loading: "読み込み中...",
    quran: { verse: "節", surah: "スーラ", notRead: "活動なし" },
    menu: { logout: "ログアウト" },
  },
};

export default function Home() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // --- STATE DROPDOWN & LOGOUT ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const currentHour = new Date().getHours();

  // Safe Locale Access
  const safeLocale = (
    HOME_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const uiText = HOME_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  // --- Logic Click Outside Dropdown ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Logic Logout ---
  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error(
        "Logout backend gagal, melanjutkan logout frontend...",
        error,
      );
    } finally {
      await signOut({
        callbackUrl: "/auth/login",
        redirect: true,
      });
    }
  };

  // --- 1. Sapaan Berdasarkan Waktu ---
  const getGreeting = () => {
    const greetings: Record<
      string,
      { morning: string; afternoon: string; evening: string }
    > = {
      id: {
        morning: "Selamat Pagi",
        afternoon: "Selamat Siang",
        evening: "Selamat Malam",
      },
      en: {
        morning: "Good Morning",
        afternoon: "Good Afternoon",
        evening: "Good Evening",
      },
      ar: {
        morning: "صباح الخير",
        afternoon: "مساء الخير",
        evening: "مساء الخير",
      },
      fr: {
        morning: "Bonjour",
        afternoon: "Bon après-midi",
        evening: "Bonsoir",
      },
      kr: {
        morning: "좋은 아침",
        afternoon: "좋은 오후",
        evening: "좋은 저녁",
      },
      jp: {
        morning: "おはよう",
        afternoon: "こんにちは",
        evening: "こんばんは",
      },
    };
    const set = greetings[locale] || greetings.id;
    return currentHour < 12
      ? set.morning
      : currentHour < 18
        ? set.afternoon
        : set.evening;
  };

  const greeting = getGreeting();

  // --- API HOOKS ---
  const { data: articlesData, isLoading: isLoadingArticles } =
    useGetArticlesQuery({
      page: 1,
      paginate: 5,
    });

  const { data: surahList } = useGetSurahsQuery({ lang: "id" });
  const { currentPrayerKey, prayerTimes } = usePrayerTracker();

  const [lastQuranActivity, setLastQuranActivity] = useState(uiText.loading);

  useEffect(() => {
    const lastRead = localStorage.getItem("quran-last-read");
    if (lastRead) {
      const parsed = JSON.parse(lastRead);
      setLastQuranActivity(
        `${parsed.surahName} : ${uiText.quran.verse} ${parsed.verse}`,
      );
    } else {
      const recent = localStorage.getItem("quran-recent");
      if (recent) {
        const arr = JSON.parse(recent);
        if (arr.length > 0) {
          const surahId = arr[0];
          const surahName = surahList?.find(
            (s) => s.id === surahId,
          )?.transliteration;
          setLastQuranActivity(
            surahName
              ? `${uiText.quran.surah} ${surahName}`
              : `${uiText.quran.surah} ${surahId}`,
          );
        }
      } else {
        setLastQuranActivity(uiText.quran.notRead);
      }
    }
  }, [surahList, locale, uiText]);

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
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
    );

    return sorted.map((article: Article) => {
      let title = article.title;
      let content = article.content;
      let categoryName = article.category?.name || "Umum";

      const articleTranslations = article.translations || [];
      const localized = articleTranslations.find((t) => t.locale === locale);

      if (localized) {
        if (localized.title) title = localized.title;
        if (localized.content) content = localized.content;
      } else {
        const idFallback = articleTranslations.find((t) => t.locale === "id");
        if (idFallback) {
          if (idFallback.title) title = idFallback.title;
          if (idFallback.content) content = idFallback.content;
        }
      }

      const catTranslations = article.category?.translations || [];
      const catTrans =
        catTranslations.find((t) => t.locale === locale) ||
        catTranslations.find((t) => t.locale === "id");
      if (catTrans && catTrans.name) categoryName = catTrans.name;

      const cleanContent = content ? content.replace(/<[^>]*>?/gm, "") : "";

      return {
        id: article.id.toString(),
        slug: article.id.toString(),
        title: title,
        excerpt: cleanContent.substring(0, 100) + "...",
        category: categoryName,
        readTime: "5 min",
        views: "1.2K",
        publishedAt: formatDate(article.published_at),
        image: article.image,
      };
    });
  }, [articlesData, locale]);

  const prayerWidgetData = useMemo(() => {
    if (!prayerTimes) return { title: uiText.loading, time: "--:--" };
    const prayerNames: Record<string, Record<PrayerKey, string>> = {
      id: {
        fajr: "Subuh",
        dhuhr: "Dzuhur",
        asr: "Ashar",
        maghrib: "Maghrib",
        isha: "Isya",
      },
      en: {
        fajr: "Fajr",
        dhuhr: "Dhuhr",
        asr: "Asr",
        maghrib: "Maghrib",
        isha: "Isha",
      },
      ar: {
        fajr: "الفجر",
        dhuhr: "الظهر",
        asr: "العصر",
        maghrib: "المغرب",
        isha: "العشاء",
      },
      fr: {
        fajr: "Fajr",
        dhuhr: "Dhuhr",
        asr: "Asr",
        maghrib: "Maghrib",
        isha: "Isha",
      },
      kr: {
        fajr: "파즈르",
        dhuhr: "두후르",
        asr: "아스르",
        maghrib: "마그립",
        isha: "이샤",
      },
      jp: {
        fajr: "ファジュル",
        dhuhr: "ズフル",
        asr: "アスル",
        maghrib: "マグリブ",
        isha: "イシャー",
      },
    };

    const activeNames = prayerNames[locale] || prayerNames.id;
    const key = (currentPrayerKey || "fajr") as PrayerKey;
    const times = prayerTimes as unknown as Record<string, string>;

    return {
      title: activeNames[key] || key,
      time: times[key] || "--:--",
    };
  }, [prayerTimes, currentPrayerKey, locale, uiText]);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Profile / Menu Dropdown Area */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 hover:bg-accent-50/50 p-1.5 rounded-xl transition-all duration-200 group outline-none"
                >
                  <div className="w-10 h-10 bg-white rounded-full shadow-sm border-2 border-accent-100 flex items-center justify-center overflow-hidden relative group-hover:border-awqaf-primary transition-colors">
                    <Image
                      src="/ibadahapp-logo.png"
                      alt="Logo"
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div
                    className={`hidden sm:block text-left transition-transform duration-200 ${isDropdownOpen ? "translate-y-0.5" : ""}`}
                  >
                    <h1 className="text-sm font-bold text-awqaf-primary font-comfortaa leading-none mb-0.5">
                      {t("home.title")}
                    </h1>
                    <p className="text-[10px] text-awqaf-foreground-secondary font-comfortaa">
                      {t("home.subtitle")}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-awqaf-foreground-secondary/50 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Menu (Hanya Logout) */}
                {isDropdownOpen && (
                  <div
                    className={`absolute top-full mt-2 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-awqaf-border-light overflow-hidden animate-in fade-in slide-in-from-top-2 z-50 ${isRtl ? "right-0" : "left-0"}`}
                  >
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors cursor-pointer group"
                      >
                        <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center group-hover:bg-white transition-colors border border-red-100">
                          {isLoggingOut ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <LogOut className="w-4 h-4" />
                          )}
                        </div>
                        <span className="text-sm font-bold font-comfortaa">
                          {uiText.menu.logout}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Link href="/store">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 p-0 rounded-full bg-accent-100 hover:bg-accent-200 text-awqaf-primary"
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </Button>
                </Link>
                <LanguageSwitcher />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-full bg-accent-100 hover:bg-accent-200 text-awqaf-primary"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="w-5 h-5" />
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
              {greeting}
            </h2>
            <p className="text-sm text-awqaf-foreground-secondary font-comfortaa mb-3">
              <span className="font-tajawal text-awqaf-primary text-lg">
                السلام عليكم
              </span>
              <br />
              Assalamu&apos;alaikum
            </p>
            <p className="text-xs text-awqaf-foreground-secondary font-comfortaa italic">
              {(() => {
                const quotes: Record<string, string> = {
                  id: '"Dan barangsiapa yang bertakwa kepada Allah, niscaya Dia akan mengadakan baginya jalan keluar."',
                  en: '"And whoever fears Allah - He will make for him a way out."',
                  ar: '"ومن يتق الله يجعل له مخرجا"',
                  fr: '"Et quiconque craint Allah, Il lui donnera une issue."',
                  kr: '"하나님을 두려워하는 자에게는 그가 길을 열어주실 것이다."',
                  jp: '"アッラーを畏れる者には、彼は道を開いてくださる。"',
                };
                return quotes[locale] || quotes.id;
              })()}
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

        <ProgressWidget />
        <FeatureNavigation />

        {/* Articles Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
              {uiText.latestArticles}
            </h2>
            <Link href="/artikel">
              <Button
                variant="ghost"
                size="sm"
                className="text-awqaf-foreground-secondary hover:text-awqaf-primary hover:bg-accent-100 font-comfortaa"
              >
                {uiText.viewAll}
                <ChevronRight
                  className={`w-4 h-4 ${locale === "ar" ? "mr-1 rotate-180" : "ml-1"}`}
                />
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
              <p className="text-center text-sm text-gray-500 py-4 font-comfortaa bg-white/50 rounded-xl border border-dashed border-gray-200">
                {uiText.noArticles}
              </p>
            )}
          </div>
        </div>
      </main>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
