"use client";

import { useState, useEffect, useMemo } from "react";
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
  Navigation,
  RefreshCw,
  Loader2,
  Filter,
} from "lucide-react";
import Link from "next/link";
// Import Services & Types
import {
  useGetDoaCategoriesQuery,
  useGetDoaByCategoryQuery,
} from "@/services/public/doa.service";
import { Doa } from "@/types/public/doa";

export default function DoaDzikirPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);

  // 1. Fetch Categories
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetDoaCategoriesQuery({
      page: 1,
      paginate: 100, // Ambil semua kategori
    });

  // Set default category saat data kategori dimuat (jika belum ada yang dipilih)
  useEffect(() => {
    if (
      categoriesData?.data &&
      categoriesData.data.length > 0 &&
      selectedCategoryId === null
    ) {
      // Pilih kategori pertama sebagai default agar list langsung muncul
      setSelectedCategoryId(categoriesData.data[0].id);
    }
  }, [categoriesData, selectedCategoryId]);

  // 2. Fetch Doa List by Category
  const {
    data: doaListData,
    isLoading: isLoadingDoa,
    isFetching,
  } = useGetDoaByCategoryQuery(
    {
      category: selectedCategoryId || 0, // Fallback 0 jika belum ada kategori
      page: page,
      paginate: 50,
    },
    {
      skip: selectedCategoryId === null, // Skip query jika belum ada kategori terpilih
    }
  );

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Load favorites
  useEffect(() => {
    const savedFavorites = localStorage.getItem("doa-dzikir-favorites");
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Save favorites
  useEffect(() => {
    localStorage.setItem(
      "doa-dzikir-favorites",
      JSON.stringify([...favorites])
    );
  }, [favorites]);

  // Filter Logic (Client-side filtering pada batch yang di-load)
  const filteredDoaDzikir = useMemo(() => {
    if (!doaListData?.data) return [];

    let filtered = doaListData.data;

    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.transliteration.toLowerCase().includes(q) ||
          item.translation_id.toLowerCase().includes(q)
      );
    }

    if (favoritesOnly) {
      filtered = filtered.filter((item) => favorites.has(item.id));
    }

    return filtered;
  }, [doaListData, debouncedQuery, favoritesOnly, favorites]);

  const clearAllFilters = () => {
    // Reset ke kategori pertama jika ada
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
    // Strip HTML tags for clean copy
    const cleanArabic = item.arabic_text.replace(/<[^>]*>?/gm, "");
    const cleanTransliteration = item.transliteration.replace(/<[^>]*>?/gm, "");
    const cleanTranslation = item.translation_id.replace(/<[^>]*>?/gm, "");

    const text = `${item.title}\n\n${cleanArabic}\n\n${cleanTransliteration}\n\n${cleanTranslation}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShareDoa = async (item: Doa) => {
    const cleanArabic = item.arabic_text.replace(/<[^>]*>?/gm, "");
    const cleanTranslation = item.translation_id.replace(/<[^>]*>?/gm, "");
    const text = `${item.title}\n\n${cleanArabic}\n\n${cleanTranslation}`;

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

  const getCategoryName = (id: number | null) => {
    return (
      categoriesData?.data.find((cat) => cat.id === id)?.name || "Kategori"
    );
  };

  // Doa Harian (Simulasi ambil doa random/pertama dari list)
  const doaOfTheDay = useMemo(() => {
    if (doaListData?.data && doaListData.data.length > 0) {
      // Ambil doa acak dari list yang ada untuk variasi
      const randomIndex = Math.floor(Math.random() * doaListData.data.length);
      return doaListData.data[randomIndex];
    }
    return null;
  }, [doaListData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
                >
                  <Navigation className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                Doa & Dzikir
              </h1>
              <div className="w-10 h-10"></div>
            </div>
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
                Doa Pilihan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white/80 p-4 rounded-lg">
                <h3 className="font-bold text-center mb-2 text-awqaf-primary">
                  {doaOfTheDay.title}
                </h3>
                <div
                  className="text-lg font-tajawal text-awqaf-primary text-center leading-relaxed mb-4"
                  dangerouslySetInnerHTML={{ __html: doaOfTheDay.arabic_text }}
                />
                <div
                  className="text-sm text-awqaf-foreground-secondary font-comfortaa text-center leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: doaOfTheDay.translation_id,
                  }}
                />
              </div>

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
                  {favorites.has(doaOfTheDay.id) ? "Favorit" : "Tambah Favorit"}
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
        <Card className="border-awqaf-border-light sticky top-[68px] z-20">
          <CardContent className="p-3 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-awqaf-foreground-secondary" />
              <Input
                placeholder="Cari doa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 font-comfortaa"
              />
            </div>

            {/* Category Chips */}
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
                {/* Drawer for all categories if many */}
                <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <DrawerTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0 gap-1"
                    >
                      <Filter className="w-3 h-3" /> Kategori
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="border-awqaf-border-light max-h-[80vh]">
                    <DrawerHeader>
                      <DrawerTitle className="font-comfortaa">
                        Pilih Kategori Doa
                      </DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 grid grid-cols-2 gap-3 overflow-y-auto">
                      {categoriesData?.data.map((cat) => (
                        <Button
                          key={cat.id}
                          variant={
                            selectedCategoryId === cat.id
                              ? "default"
                              : "outline"
                          }
                          className="justify-start h-auto py-2 px-3 text-left"
                          onClick={() => {
                            setSelectedCategoryId(cat.id);
                            setIsFilterOpen(false);
                            setPage(1); // Reset pagination
                          }}
                        >
                          <span className="font-bold text-sm">{cat.name}</span>
                        </Button>
                      ))}
                    </div>
                  </DrawerContent>
                </Drawer>

                {/* Quick Access Categories */}
                {categoriesData?.data.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={
                      selectedCategoryId === cat.id ? "default" : "outline"
                    }
                    size="sm"
                    className="flex-shrink-0"
                    onClick={() => {
                      setSelectedCategoryId(cat.id);
                      setPage(1);
                    }}
                  >
                    {cat.name}
                  </Button>
                ))}

                {/* Favorites Toggle */}
                <Button
                  variant={favoritesOnly ? "default" : "outline"}
                  size="sm"
                  className="flex-shrink-0"
                  onClick={() => setFavoritesOnly((v) => !v)}
                >
                  <Heart className="w-4 h-4 mr-1" /> Favorit
                </Button>
              </div>
            )}

            {/* Active filter summary */}
            {(selectedCategoryId || favoritesOnly || debouncedQuery) && (
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {debouncedQuery && (
                    <Badge variant="secondary" className="text-xs">
                      Cari: “{debouncedQuery}”
                    </Badge>
                  )}
                  {selectedCategoryId && (
                    <Badge variant="secondary" className="text-xs">
                      {getCategoryName(selectedCategoryId)}
                    </Badge>
                  )}
                  {favoritesOnly && (
                    <Badge variant="secondary" className="text-xs">
                      Favorit
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  <RefreshCw className="w-4 h-4 mr-1" /> Reset
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Doa List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
              {getCategoryName(selectedCategoryId)}
            </h2>
          </div>

          {isLoadingDoa || isFetching ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-awqaf-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDoaDzikir.map((item) => (
                <Card key={item.id} className="border-awqaf-border-light">
                  <CardContent className="p-4 space-y-4">
                    {/* Title */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-card-foreground font-comfortaa">
                        {item.title}
                      </h3>
                    </div>

                    {/* Arabic Text (HTML) */}
                    <div className="bg-accent-50 p-4 rounded-lg">
                      <div
                        className="text-lg font-tajawal text-awqaf-primary text-center leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: item.arabic_text }}
                      />
                    </div>

                    {/* Latin (HTML) */}
                    <div className="bg-accent-100/50 p-3 rounded-lg">
                      <div
                        className="text-sm text-awqaf-foreground-secondary font-comfortaa text-center leading-relaxed italic"
                        dangerouslySetInnerHTML={{
                          __html: item.transliteration,
                        }}
                      />
                    </div>

                    {/* Translation (HTML) */}
                    <div>
                      <div
                        className="text-sm text-awqaf-foreground-secondary font-comfortaa leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: item.translation_id,
                        }}
                      />
                    </div>

                    {/* Actions */}
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
                        {favorites.has(item.id) ? "Favorit" : "Favorit"}
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
              ))}
            </div>
          )}

          {!isLoadingDoa && filteredDoaDzikir.length === 0 && (
            <Card className="border-awqaf-border-light">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-awqaf-foreground-secondary mx-auto mb-4" />
                <h3 className="font-semibold text-card-foreground font-comfortaa mb-2">
                  Tidak ada doa ditemukan
                </h3>
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  Coba pilih kategori lain atau ubah kata kunci
                </p>
              </CardContent>
            </Card>
          )}

          {/* Simple Pagination */}
          {!isLoadingDoa && filteredDoaDzikir.length > 0 && (
            <div className="flex justify-center gap-4 pt-4">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Sebelumnya
              </Button>
              <span className="self-center text-sm font-bold">Hal. {page}</span>
              <Button
                variant="outline"
                disabled={page === doaListData?.last_page}
                onClick={() => setPage((p) => p + 1)}
              >
                Selanjutnya
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}