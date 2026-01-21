"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  X,
  Calendar,
  Clock,
  ArrowLeft,
  BookOpen,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  useGetArticleCategoriesQuery,
  useGetArticlesQuery,
} from "@/services/public/article.service";
import { useI18n } from "@/app/hooks/useI18n";

// Loading Skeleton
const ArticleSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="border-orange-100">
          <CardContent className="p-0">
            <div className="flex gap-4 p-4">
              <div className="w-24 h-24 bg-gray-200 rounded-xl animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default function ArtikelPage() {
  const { t, locale } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined
  );

  // Menggunakan API Categories
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetArticleCategoriesQuery({
      page: 1,
      paginate: 100,
    });

  // Menggunakan API Articles
  const { data: articlesData, isLoading: isLoadingArticles } =
    useGetArticlesQuery({
      page: 1,
      paginate: 50,
      category_id: selectedCategory,
    });

  // Filter local untuk search query
  const filteredArtikelData = useMemo(() => {
    if (!articlesData?.data) return [];

    let filtered = articlesData.data;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (artikel) =>
          artikel.title.toLowerCase().includes(lowerQuery) ||
          artikel.content
            .replace(/<[^>]*>/g, "")
            .toLowerCase()
            .includes(lowerQuery)
      );
    }

    return filtered;
  }, [articlesData, searchQuery]);

  // Format date
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
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Featured Articles logic (2 artikel terbaru)
  const featuredArticles = useMemo(() => {
    if (!articlesData?.data) return [];
    return articlesData.data.slice(0, 2);
  }, [articlesData]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const isLoading = isLoadingArticles || isLoadingCategories;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-orange-100/50 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 rounded-full hover:bg-orange-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-orange-800" />
              </Button>
            </Link>
            <h1 className="text-lg font-bold text-orange-900 font-comfortaa">
              {t("article.title")}
            </h1>
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400" />
          <Input
            type="text"
            placeholder={t("article.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 h-12 rounded-2xl border-2 border-orange-100 focus:border-orange-300 focus:outline-none bg-white shadow-sm text-base font-comfortaa"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-orange-100 hover:bg-orange-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-orange-600" />
            </button>
          )}
        </div>

        {/* Featured Section */}
        {!searchQuery && selectedCategory === undefined && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-orange-900 font-comfortaa">
                {t("article.trendingToday")}
              </h2>
            </div>

            {isLoading ? (
              <div className="grid gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Card
                    key={i}
                    className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-white to-orange-50/30"
                  >
                    <CardContent className="p-0">
                      <div className="h-48 bg-gray-200 animate-pulse" />
                      <div className="p-5 space-y-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                {featuredArticles.map((artikel, idx) => (
                  <Link key={artikel.id} href={`/artikel/${artikel.id}`}>
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-white to-orange-50/30 group cursor-pointer">
                      <CardContent className="p-0">
                        <div className="relative">
                          {/* Featured Badge */}
                          <div className="absolute top-3 left-3 z-10">
                            <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 shadow-lg flex items-center gap-1 px-3">
                              <Sparkles className="w-3 h-3" />
                              #{idx + 1} Trending
                            </Badge>
                          </div>

                          {/* Image */}
                          <div className="h-48 bg-gradient-to-br from-orange-200 to-amber-200 relative overflow-hidden">
                            {artikel.image ? (
                              <Image
                                src={artikel.image}
                                alt={artikel.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <BookOpen className="w-16 h-16 text-orange-400/50" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                            <div className="absolute bottom-3 left-3">
                              <Badge
                                variant="secondary"
                                className="bg-white/90 text-orange-800 border-0"
                              >
                                {artikel.category.name}
                              </Badge>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-700 transition-colors font-comfortaa">
                              {artikel.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3 font-comfortaa">
                              {artikel.content
                                .replace(/<[^>]*>/g, "")
                                .substring(0, 120)}
                              ...
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-xs text-gray-500 font-comfortaa">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {formatDate(artikel.published_at)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  5 {t("article.min")}
                                </div>
                              </div>

                              <div className="flex items-center gap-1 text-orange-600 text-sm font-medium group-hover:gap-2 transition-all font-comfortaa">
                                {t("article.read")}
                                <ChevronRight className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Category Pills */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-orange-900 uppercase tracking-wide font-comfortaa">
            {t("article.category")}
          </h3>
          {isLoadingCategories ? (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 rounded-full px-5 h-9 bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory(undefined)}
                className={`flex-shrink-0 rounded-full px-5 h-9 font-medium transition-all font-comfortaa ${
                  selectedCategory === undefined
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                    : "border-2 border-orange-200 text-orange-700 hover:bg-orange-50 bg-white"
                }`}
              >
                {t("article.all")}
              </button>
              {categoriesData?.data.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-shrink-0 rounded-full px-5 h-9 font-medium transition-all font-comfortaa ${
                    selectedCategory === cat.id
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                      : "border-2 border-orange-200 text-orange-700 hover:bg-orange-50 bg-white"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 font-comfortaa">
            <span className="font-bold text-orange-700">
              {filteredArtikelData.length}
            </span>{" "}
            {t("article.articlesFound")}
          </p>
          {(searchQuery || selectedCategory !== undefined) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(undefined);
              }}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium font-comfortaa"
            >
              {t("article.resetFilter")}
            </button>
          )}
        </div>

        {/* Articles List */}
        <div className="space-y-3">
          {isLoading ? (
            <ArticleSkeleton />
          ) : filteredArtikelData.length > 0 ? (
            filteredArtikelData.map((artikel) => (
              <Link key={artikel.id} href={`/artikel/${artikel.id}`}>
                <Card className="border border-orange-100 hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer bg-white">
                  <CardContent className="p-0">
                    <div className="flex gap-4 p-4">
                      {/* Thumbnail */}
                      <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center flex-shrink-0 overflow-hidden relative group-hover:scale-105 transition-transform">
                        {artikel.image ? (
                          <Image
                            src={artikel.image}
                            alt={artikel.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <BookOpen className="w-8 h-8 text-orange-400" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <Badge
                            variant="secondary"
                            className="mb-2 text-xs bg-orange-100 text-orange-700 border-0"
                          >
                            {artikel.category.name}
                          </Badge>
                          <h3 className="font-bold text-base text-gray-900 line-clamp-2 mb-1 group-hover:text-orange-700 transition-colors font-comfortaa">
                            {artikel.title}
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-2 font-comfortaa">
                            {artikel.content
                              .replace(/<[^>]*>/g, "")
                              .substring(0, 80)}
                            ...
                          </p>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-2 font-comfortaa">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(artikel.published_at)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            5 {t("article.min")}
                          </div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex items-center">
                        <ChevronRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-orange-400" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg font-comfortaa">
                  {t("article.noArticlesFound")}
                </h3>
                <p className="text-sm text-gray-600 mb-4 font-comfortaa">
                  {t("article.tryDifferentKeyword")}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(undefined);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg font-medium font-comfortaa"
                >
                  {t("article.viewAllArticles")}
                </button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
