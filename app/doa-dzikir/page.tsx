"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  BookOpen,
  Search,
  Calendar,
  Heart,
  Share2,
  Copy,
  CheckCircle,
  RefreshCw,
  Loader2,
  Filter,
  Play,
  Pause,
  Square,
  Volume2,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useGetDoaCategoriesQuery,
  useGetDoaByCategoryQuery,
} from "@/services/public/doa.service";
import { Doa, DoaCategory } from "@/types/public/doa";
import { useI18n } from "@/app/hooks/useI18n";

// --- 1. DEFINISI TRANSLATION LOKAL (6 BAHASA) ---
const LOCAL_TRANSLATIONS: Record<string, Record<string, string>> = {
  id: {
    title: "Doa & Dzikir",
    subtitle: "Kumpulan Doa & Dzikir Harian",
    searchPlaceholder: "Cari doa...",
    category: "Kategori",
    favorite: "Favorit",
    addFavorite: "Tambah Favorit",
    reset: "Reset",
    dailyDoa: "Doa Pilihan",
    audioGuide: "Audio Panduan",
    playing: "Sedang diputar...",
    noDoa: "Tidak ada doa ditemukan",
    noDoaDesc: "Coba pilih kategori lain atau ubah kata kunci",
    prev: "Sebelumnya",
    next: "Selanjutnya",
    page: "Hal.",
    selectCategory: "Pilih Kategori Doa",
    searchResult: "Cari",
  },
  en: {
    title: "Prayers & Dhikr",
    subtitle: "Daily Prayers & Dhikr Collection",
    searchPlaceholder: "Search prayers...",
    category: "Category",
    favorite: "Favorites",
    addFavorite: "Add to Favorites",
    reset: "Reset",
    dailyDoa: "Selected Prayer",
    audioGuide: "Audio Guide",
    playing: "Playing...",
    noDoa: "No prayers found",
    noDoaDesc: "Try selecting another category or change keywords",
    prev: "Previous",
    next: "Next",
    page: "Pg.",
    selectCategory: "Select Prayer Category",
    searchResult: "Search",
  },
  ar: {
    title: "أدعية وأذكار",
    subtitle: "مجموعة الأدعية والأذكار اليومية",
    searchPlaceholder: "بحث عن دعاء...",
    category: "فئة",
    favorite: "المفضلة",
    addFavorite: "إضافة للمفضلة",
    reset: "إعادة تعيين",
    dailyDoa: "دعاء مختار",
    audioGuide: "الدليل الصوتي",
    playing: "جاري التشغيل...",
    noDoa: "لم يتم العثور على أدعية",
    noDoaDesc: "حاول اختيار فئة أخرى أو تغيير الكلمات الرئيسية",
    prev: "السابق",
    next: "التالي",
    page: "ص.",
    selectCategory: "اختر فئة الدعاء",
    searchResult: "بحث",
  },
  fr: {
    title: "Prières et Invocations",
    subtitle: "Collection quotidienne de prières et d'invocations",
    searchPlaceholder: "Rechercher des prières...",
    category: "Catégorie",
    favorite: "Favoris",
    addFavorite: "Ajouter aux favoris",
    reset: "Réinitialiser",
    dailyDoa: "Prière sélectionnée",
    audioGuide: "Guide audio",
    playing: "Lecture en cours...",
    noDoa: "Aucune prière trouvée",
    noDoaDesc: "Essayez une autre catégorie ou changez de mots-clés",
    prev: "Précédent",
    next: "Suivant",
    page: "Pg.",
    selectCategory: "Sélectionner une catégorie",
    searchResult: "Recherche",
  },
  kr: {
    title: "기도와 지크르",
    subtitle: "매일 기도와 지크르 모음",
    searchPlaceholder: "기도 검색...",
    category: "카테고리",
    favorite: "즐겨찾기",
    addFavorite: "즐겨찾기 추가",
    reset: "초기화",
    dailyDoa: "오늘의 기도",
    audioGuide: "오디오 가이드",
    playing: "재생 중...",
    noDoa: "기도를 찾을 수 없습니다",
    noDoaDesc: "다른 카테고리를 선택하거나 키워드를 변경해 보세요",
    prev: "이전",
    next: "다음",
    page: "쪽",
    selectCategory: "기도 카테고리 선택",
    searchResult: "검색",
  },
  jp: {
    title: "祈りとズィクル",
    subtitle: "毎日の祈りとズィクル集",
    searchPlaceholder: "祈りを検索...",
    category: "カテゴリー",
    favorite: "お気に入り",
    addFavorite: "お気に入りに追加",
    reset: "リセット",
    dailyDoa: "今日の祈り",
    audioGuide: "音声ガイド",
    playing: "再生中...",
    noDoa: "祈りが見つかりません",
    noDoaDesc: "別のカテゴリーを選択するか、キーワードを変更してください",
    prev: "前へ",
    next: "次へ",
    page: "頁",
    selectCategory: "祈りのカテゴリーを選択",
    searchResult: "検索",
  },
};

export default function DoaDzikirPage() {
  const router = useRouter();
  const { locale } = useI18n(); // Kita gunakan locale dari hook ini

  // Helper untuk ambil teks berdasarkan locale aktif
  const lt = (key: string) => {
    const lang = locale || "id"; // Default ke ID jika null
    // Fallback ke ID jika key tidak ada di bahasa target
    return (
      LOCAL_TRANSLATIONS[lang]?.[key] || LOCAL_TRANSLATIONS["id"][key] || key
    );
  };

  // Deteksi RTL untuk Bahasa Arab (SA/AR)
  const isRtl = locale === "ar";

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [page, setPage] = useState(1);

  // Audio Player States
  const [playingDoaId, setPlayingDoaId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- HELPER FUNCTIONS FOR CONTENT TRANSLATION ---

  const getCategoryContent = (category: DoaCategory | undefined) => {
    if (!category) return { name: lt("category"), description: "" };
    const localized = category.translations.find((t) => t.locale === locale);
    if (localized && localized.name) {
      return { name: localized.name, description: localized.description };
    }
    const idFallback = category.translations.find((t) => t.locale === "id");
    if (idFallback && idFallback.name) {
      return { name: idFallback.name, description: idFallback.description };
    }
    return { name: category.name, description: category.description };
  };

  const getDoaContent = (doa: Doa) => {
    const localized = doa.translations.find((t) => t.locale === locale);
    let translationText = "";
    let titleText = doa.title;

    if (localized) {
      if (localized.translation) translationText = localized.translation;
      if (localized.title) titleText = localized.title;
    } else {
      const idFallback = doa.translations.find((t) => t.locale === "id");
      translationText = idFallback?.translation || "";
    }

    return {
      title: titleText,
      translation: translationText,
      arabic: doa.arabic_text,
      transliteration: doa.transliteration,
    };
  };

  // Fetch Categories
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetDoaCategoriesQuery({
      page: 1,
      paginate: 100,
    });

  useEffect(() => {
    if (
      categoriesData?.data &&
      categoriesData.data.length > 0 &&
      selectedCategoryId === null
    ) {
      setSelectedCategoryId(categoriesData.data[0].id);
    }
  }, [categoriesData, selectedCategoryId]);

  // Fetch Doa List by Category
  const {
    data: doaListData,
    isLoading: isLoadingDoa,
    isFetching,
  } = useGetDoaByCategoryQuery(
    {
      category: selectedCategoryId || 0,
      page: page,
      paginate: 50,
    },
    {
      skip: selectedCategoryId === null,
    },
  );

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("doa-dzikir-favorites");
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "doa-dzikir-favorites",
      JSON.stringify([...favorites]),
    );
  }, [favorites]);

  const filteredDoaDzikir = useMemo(() => {
    if (!doaListData?.data) return [];
    let filtered = doaListData.data;

    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      filtered = filtered.filter((item) => {
        const content = getDoaContent(item);
        return (
          item.title.toLowerCase().includes(q) ||
          item.transliteration.toLowerCase().includes(q) ||
          content.translation.toLowerCase().includes(q)
        );
      });
    }

    if (favoritesOnly) {
      filtered = filtered.filter((item) => favorites.has(item.id));
    }
    return filtered;
  }, [doaListData, debouncedQuery, favoritesOnly, favorites, locale]);

  const clearAllFilters = () => {
    if (categoriesData?.data && categoriesData.data.length > 0) {
      setSelectedCategoryId(categoriesData.data[0].id);
    }
    setFavoritesOnly(false);
    setSearchQuery("");
    setPage(1);
  };

  const handleToggleFavorite = (itemId: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      return newFavorites;
    });
  };

  const handleCopyDoa = async (item: Doa) => {
    const content = getDoaContent(item);
    const cleanArabic = content.arabic.replace(/<[^>]*>?/gm, "");
    const cleanTransliteration = content.transliteration.replace(
      /<[^>]*>?/gm,
      "",
    );
    const cleanTranslation = content.translation.replace(/<[^>]*>?/gm, "");
    const text = `${content.title}\n\n${cleanArabic}\n\n${cleanTransliteration}\n\n${cleanTranslation}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShareDoa = async (item: Doa) => {
    const content = getDoaContent(item);
    const cleanArabic = content.arabic.replace(/<[^>]*>?/gm, "");
    const cleanTranslation = content.translation.replace(/<[^>]*>?/gm, "");
    const text = `${content.title}\n\n${cleanArabic}\n\n${cleanTranslation}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Doa & Dzikir",
          text: text,
        });
      } catch (err) {
        console.error("Failed to share:", err);
      }
    } else {
      handleCopyDoa(item);
    }
  };

  const selectedCategoryData = useMemo(() => {
    const cat = categoriesData?.data.find((c) => c.id === selectedCategoryId);
    return getCategoryContent(cat);
  }, [categoriesData, selectedCategoryId, locale]);

  const doaOfTheDay = useMemo(() => {
    if (doaListData?.data && doaListData.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * doaListData.data.length);
      return doaListData.data[randomIndex];
    }
    return null;
  }, [doaListData]);

  const handlePlayAudio = async (doaId: number, audioUrl: string | null) => {
    if (!audioUrl) {
      alert("URL audio tidak tersedia.");
      return;
    }
    try {
      if (playingDoaId === doaId && audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
        }
        return;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsLoading(true);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.addEventListener("canplay", () => setIsLoading(false));
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setPlayingDoaId(null);
      });
      audio.addEventListener("error", () => {
        setIsLoading(false);
        setIsPlaying(false);
        setPlayingDoaId(null);
        alert("Gagal memutar audio. Pastikan URL audio valid.");
      });
      await audio.play();
      setPlayingDoaId(doaId);
      setIsPlaying(true);
      setIsLoading(false);
    } catch (err) {
      console.error("Error playing audio:", err);
      setIsLoading(false);
      setIsPlaying(false);
      setPlayingDoaId(null);
    }
  };

  const handlePauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setPlayingDoaId(null);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 transition-colors duration-200"
              >
                <ArrowLeft
                  className={`w-5 h-5 text-awqaf-primary ${
                    isRtl ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {/* Menggunakan lt('title') untuk mengganti feature.doa */}
              <h1 className="text-xl font-bold text-awqaf-primary font-comfortaa text-center flex-1">
                {lt("title")}
              </h1>

              <div className="w-10 h-10" />
            </div>

            <p className="text-sm text-awqaf-foreground-secondary font-comfortaa text-center mt-1">
              {lt("subtitle")}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Doa of the Day */}
        {doaOfTheDay && !isLoadingDoa && (
          <Card className="border-awqaf-border-light bg-gradient-to-r from-accent-100 to-accent-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-comfortaa flex items-center gap-2">
                <Calendar className="w-5 h-5 text-awqaf-primary" />
                {lt("dailyDoa")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white/80 p-4 rounded-lg">
                <h3 className="font-bold text-center mb-2 text-awqaf-primary">
                  {doaOfTheDay.title}
                </h3>
                {(() => {
                  const content = getDoaContent(doaOfTheDay);
                  return (
                    <>
                      <div
                        className="text-lg font-tajawal text-awqaf-primary text-center leading-relaxed mb-4"
                        dangerouslySetInnerHTML={{ __html: content.arabic }}
                      />
                      <div
                        className="text-sm text-awqaf-foreground-secondary font-comfortaa text-center leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: content.translation,
                        }}
                      />
                    </>
                  );
                })()}
              </div>

              {doaOfTheDay.audio && (
                <div className="bg-white/90 p-3 rounded-lg border border-awqaf-border-light">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-awqaf-primary" />
                    <span className="text-xs font-semibold text-awqaf-primary font-comfortaa flex-1">
                      {lt("audioGuide")}
                    </span>
                    <div className="flex items-center gap-1">
                      {playingDoaId === doaOfTheDay.id && isPlaying ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePauseAudio}
                          className="h-8 px-3 bg-awqaf-primary text-white hover:bg-awqaf-primary/90"
                        >
                          <Pause className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handlePlayAudio(doaOfTheDay.id, doaOfTheDay.audio)
                          }
                          disabled={
                            isLoading && playingDoaId === doaOfTheDay.id
                          }
                          className="h-8 px-3"
                        >
                          {isLoading && playingDoaId === doaOfTheDay.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                      )}

                      {playingDoaId === doaOfTheDay.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleStopAudio}
                          className="h-8 px-3"
                        >
                          <Square className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {playingDoaId === doaOfTheDay.id && isPlaying && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex gap-1 items-end">
                        <div
                          className="w-1 h-2 bg-awqaf-primary rounded-full animate-pulse"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-1 h-3 bg-awqaf-primary rounded-full animate-pulse"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-1 h-4 bg-awqaf-primary rounded-full animate-pulse"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                        <div
                          className="w-1 h-3 bg-awqaf-primary rounded-full animate-pulse"
                          style={{ animationDelay: "450ms" }}
                        ></div>
                      </div>
                      <span className="text-xs text-awqaf-primary font-comfortaa animate-pulse">
                        {lt("playing")}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleFavorite(doaOfTheDay.id)}
                  className="flex-1"
                >
                  <Heart
                    className={`w-4 h-4 mr-2 ${
                      favorites.has(doaOfTheDay.id)
                        ? "fill-red-500 text-red-500"
                        : ""
                    }`}
                  />
                  {favorites.has(doaOfTheDay.id)
                    ? lt("favorite")
                    : lt("addFavorite")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShareDoa(doaOfTheDay)}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search + Sticky chips */}
        <Card className="border-awqaf-border-light sticky top-[80px] z-20">
          <CardContent className="p-3 space-y-3">
            <div className="relative">
              <Search
                className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-awqaf-foreground-secondary ${
                  isRtl ? "right-3" : "left-3"
                }`}
              />
              <Input
                placeholder={lt("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`font-comfortaa ${isRtl ? "pr-10" : "pl-10"}`}
              />
            </div>

            {isLoadingCategories ? (
              <div className="flex gap-2 overflow-hidden">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-20 bg-gray-200 animate-pulse rounded-full"
                  />
                ))}
              </div>
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-1 mobile-scroll items-center">
                <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <DrawerTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 gap-1 rounded-full"
                    >
                      <Filter className="w-3 h-3" /> {lt("category")}
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="border-awqaf-border-light max-h-[80vh]">
                    <DrawerHeader>
                      <DrawerTitle className="font-comfortaa text-center">
                        {lt("selectCategory")}
                      </DrawerTitle>
                    </DrawerHeader>
                    <div
                      className="p-4 grid grid-cols-2 gap-3 overflow-y-auto"
                      dir={isRtl ? "rtl" : "ltr"}
                    >
                      {categoriesData?.data.map((cat) => {
                        const content = getCategoryContent(cat);
                        return (
                          <Button
                            key={cat.id}
                            variant={
                              selectedCategoryId === cat.id
                                ? "default"
                                : "outline"
                            }
                            className="justify-start h-auto py-2 px-3 text-start"
                            onClick={() => {
                              setSelectedCategoryId(cat.id);
                              setIsFilterOpen(false);
                              setPage(1);
                            }}
                          >
                            <span className="font-bold text-sm">
                              {content.name}
                            </span>
                          </Button>
                        );
                      })}
                    </div>
                  </DrawerContent>
                </Drawer>

                {categoriesData?.data.slice(0, 5).map((cat) => {
                  const content = getCategoryContent(cat);
                  return (
                    <Button
                      key={cat.id}
                      variant={
                        selectedCategoryId === cat.id ? "default" : "outline"
                      }
                      size="sm"
                      className="flex-shrink-0 rounded-full"
                      onClick={() => {
                        setSelectedCategoryId(cat.id);
                        setPage(1);
                      }}
                    >
                      {content.name}
                    </Button>
                  );
                })}

                <Button
                  variant={favoritesOnly ? "default" : "outline"}
                  size="sm"
                  className="flex-shrink-0 rounded-full"
                  onClick={() => setFavoritesOnly((v) => !v)}
                >
                  <Heart className="w-4 h-4 mr-1" /> {lt("favorite")}
                </Button>
              </div>
            )}

            {(selectedCategoryId || favoritesOnly || debouncedQuery) && (
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {debouncedQuery && (
                    <Badge variant="secondary" className="text-xs">
                      {lt("searchResult")}: “{debouncedQuery}”
                    </Badge>
                  )}
                  {selectedCategoryId && (
                    <Badge variant="secondary" className="text-xs">
                      {selectedCategoryData.name}
                    </Badge>
                  )}
                  {favoritesOnly && (
                    <Badge variant="secondary" className="text-xs">
                      {lt("favorite")}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs"
                >
                  <RefreshCw className="w-3 h-3 mr-1" /> {lt("reset")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
              {selectedCategoryData.name}
            </h2>
            {selectedCategoryData.description && (
              <div
                className="text-xs text-awqaf-foreground-secondary"
                dangerouslySetInnerHTML={{
                  __html: selectedCategoryData.description,
                }}
              />
            )}
          </div>

          {isLoadingDoa || isFetching ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-awqaf-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDoaDzikir.map((item) => {
                const content = getDoaContent(item);
                return (
                  <Card key={item.id} className="border-awqaf-border-light">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-card-foreground font-comfortaa">
                          {content.title}
                        </h3>
                      </div>

                      <div className="bg-accent-50 p-4 rounded-lg">
                        <div
                          className="text-lg font-tajawal text-awqaf-primary text-center leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: content.arabic }}
                        />
                      </div>

                      <div className="bg-accent-100/50 p-3 rounded-lg">
                        <div
                          className="text-sm text-awqaf-foreground-secondary font-comfortaa text-center leading-relaxed italic"
                          dangerouslySetInnerHTML={{
                            __html: content.transliteration,
                          }}
                        />
                      </div>

                      <div>
                        <div
                          className="text-sm text-awqaf-foreground-secondary font-comfortaa leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: content.translation,
                          }}
                        />
                      </div>

                      {item.audio && (
                        <div className="bg-gradient-to-r from-accent-50 to-accent-100 p-3 rounded-lg border border-awqaf-border-light">
                          <div className="flex items-center gap-2">
                            <Volume2 className="w-4 h-4 text-awqaf-primary" />
                            <span className="text-xs font-semibold text-awqaf-primary font-comfortaa flex-1">
                              {lt("audioGuide")}
                            </span>
                            <div className="flex items-center gap-1">
                              {playingDoaId === item.id && isPlaying ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handlePauseAudio}
                                  className="h-8 px-3 bg-awqaf-primary text-white hover:bg-awqaf-primary/90"
                                >
                                  <Pause className="w-4 h-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handlePlayAudio(item.id, item.audio)
                                  }
                                  disabled={
                                    isLoading && playingDoaId === item.id
                                  }
                                  className="h-8 px-3"
                                >
                                  {isLoading && playingDoaId === item.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Play className="w-4 h-4" />
                                  )}
                                </Button>
                              )}

                              {playingDoaId === item.id && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleStopAudio}
                                  className="h-8 px-3"
                                >
                                  <Square className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>

                          {playingDoaId === item.id && isPlaying && (
                            <div className="mt-2 flex items-center gap-2">
                              <div className="flex gap-1 items-end">
                                <div
                                  className="w-1 h-2 bg-awqaf-primary rounded-full animate-pulse"
                                  style={{ animationDelay: "0ms" }}
                                ></div>
                                <div
                                  className="w-1 h-3 bg-awqaf-primary rounded-full animate-pulse"
                                  style={{ animationDelay: "150ms" }}
                                ></div>
                                <div
                                  className="w-1 h-4 bg-awqaf-primary rounded-full animate-pulse"
                                  style={{ animationDelay: "300ms" }}
                                ></div>
                                <div
                                  className="w-1 h-3 bg-awqaf-primary rounded-full animate-pulse"
                                  style={{ animationDelay: "450ms" }}
                                ></div>
                              </div>
                              <span className="text-xs text-awqaf-primary font-comfortaa animate-pulse">
                                {lt("playing")}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleFavorite(item.id)}
                          className="flex-1"
                        >
                          <Heart
                            className={`w-4 h-4 mr-2 ${
                              favorites.has(item.id)
                                ? "fill-red-500 text-red-500"
                                : ""
                            }`}
                          />
                          {favorites.has(item.id)
                            ? lt("favorite")
                            : lt("addFavorite")}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyDoa(item)}
                        >
                          {copiedId === item.id ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareDoa(item)}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {!isLoadingDoa && filteredDoaDzikir.length === 0 && (
            <Card className="border-awqaf-border-light">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-awqaf-foreground-secondary mx-auto mb-4" />
                <h3 className="font-semibold text-card-foreground font-comfortaa mb-2">
                  {lt("noDoa")}
                </h3>
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  {lt("noDoaDesc")}
                </p>
              </CardContent>
            </Card>
          )}

          {!isLoadingDoa && filteredDoaDzikir.length > 0 && (
            <div className="flex justify-center gap-4 pt-4">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                {lt("prev")}
              </Button>
              <span className="self-center text-sm font-bold">
                {lt("page")} {page}
              </span>
              <Button
                variant="outline"
                disabled={page === doaListData?.last_page}
                onClick={() => setPage((p) => p + 1)}
              >
                {lt("next")}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}