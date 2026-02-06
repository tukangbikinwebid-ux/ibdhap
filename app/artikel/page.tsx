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
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  useGetArticleCategoriesQuery,
  useGetArticlesQuery,
} from "@/services/public/article.service";
import { useI18n } from "@/app/hooks/useI18n";
import { Article, ArticleCategory } from "@/types/public/article";

// --- SKELETON LOADER ---
const ArticleSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border-awqaf-border-light bg-white/80">
          <CardContent className="p-0">
            <div className="flex gap-4 p-4">
              <div className="w-24 h-24 bg-accent-50 rounded-xl animate-pulse" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-accent-50 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-accent-50/50 rounded animate-pulse w-full" />
                <div className="h-3 bg-accent-50/50 rounded animate-pulse w-1/2" />
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
    undefined,
  );

  // --- HELPER CONTENT ---
  const getCategoryContent = (cat: ArticleCategory) => {
    const translations = cat.translations || [];
    if (translations.length > 0) {
      const localized = translations.find((t) => t.locale === locale);
      if (localized?.name) return { name: localized.name };
      const idFallback = translations.find((t) => t.locale === "id");
      if (idFallback?.name) return { name: idFallback.name };
    }
    return { name: cat.name };
  };

  const getArticleContent = (art: Article) => {
    const translations = art.translations || [];
    if (translations.length > 0) {
      const localized = translations.find((t) => t.locale === locale);
      if (localized?.title) {
        return { title: localized.title, content: localized.content ?? "" };
      }
      const idFallback = translations.find((t) => t.locale === "id");
      if (idFallback?.title) {
        return { title: idFallback.title, content: idFallback.content ?? "" };
      }
    }
    return { title: art.title, content: art.content ?? "" };
  };

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

  // --- API HOOKS ---
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetArticleCategoriesQuery({ page: 1, paginate: 100 });

  const { data: articlesData, isLoading: isLoadingArticles } =
    useGetArticlesQuery({
      page: 1,
      paginate: 50,
      category_id: selectedCategory,
    });

  // --- FILTERING ---
  const filteredArtikelData = useMemo(() => {
    if (!articlesData?.data) return [];
    let filtered = articlesData.data;
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((artikel) => {
        const content = getArticleContent(artikel);
        return (
          content.title.toLowerCase().includes(lowerQuery) ||
          content.content
            .replace(/<[^>]*>/g, "")
            .toLowerCase()
            .includes(lowerQuery)
        );
      });
    }
    return filtered;
  }, [articlesData, searchQuery, locale]);

  const featuredArticles = useMemo(() => {
    if (!articlesData?.data) return [];
    return articlesData.data.slice(0, 2);
  }, [articlesData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* HEADER: Floating Glass */}
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
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="text-center">
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                  {t("article.title")}
                </h1>
              </div>
              <div className="w-10 h-10" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-2 space-y-6">
        {/* Search Bar Widget */}
        <div className="relative">
          <div className="relative bg-white/80 backdrop-blur rounded-xl shadow-sm border border-awqaf-border-light/50 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-awqaf-primary/20 focus-within:border-awqaf-primary">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-awqaf-foreground-secondary" />
            <Input
              placeholder={t("article.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 h-12 focus-visible:ring-0 pl-10 pr-10 placeholder:text-awqaf-foreground-secondary/70 text-awqaf-primary font-comfortaa text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-accent-100 hover:bg-accent-200 flex items-center justify-center transition-colors"
              >
                <X className="w-3 h-3 text-awqaf-primary" />
              </button>
            )}
          </div>
        </div>

        {/* Featured Section (Only when no search/filter) */}
        {!searchQuery &&
          selectedCategory === undefined &&
          !isLoadingArticles && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <TrendingUp className="w-4 h-4 text-awqaf-secondary" />
                <h2 className="text-sm font-bold text-awqaf-primary uppercase tracking-wide font-comfortaa">
                  {t("article.trendingToday")}
                </h2>
              </div>

              <div className="grid gap-4">
                {featuredArticles.map((artikel, idx) => {
                  const content = getArticleContent(artikel);
                  const categoryContent = getCategoryContent(artikel.category);
                  return (
                    <Link key={artikel.id} href={`/artikel/${artikel.id}`}>
                      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden bg-white group cursor-pointer rounded-2xl relative h-48">
                        {/* Background Image */}
                        <div className="absolute inset-0">
                          {artikel.image ? (
                            <Image
                              src={artikel.image}
                              alt={content.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-awqaf-primary to-awqaf-secondary flex items-center justify-center">
                              <BookOpen className="w-12 h-12 text-white/30" />
                            </div>
                          )}
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        </div>

                        <CardContent className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="bg-awqaf-secondary text-awqaf-primary hover:bg-awqaf-secondary/90 border-0 font-bold px-2 h-5 text-[10px]">
                              {categoryContent.name}
                            </Badge>
                            <span className="flex items-center gap-1 text-[10px] bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                              <Sparkles className="w-3 h-3 text-yellow-300" />
                              Trending #{idx + 1}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg leading-tight line-clamp-2 font-comfortaa mb-1 group-hover:text-awqaf-secondary transition-colors">
                            {content.title}
                          </h3>
                          <div className="flex items-center gap-3 text-[10px] text-white/80 font-comfortaa">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />{" "}
                              {formatDate(artikel.published_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> 5 {t("article.min")}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

        {/* Category Pills */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <LayoutGrid className="w-4 h-4 text-awqaf-secondary" />
            <h3 className="text-sm font-bold text-awqaf-primary uppercase tracking-wide font-comfortaa">
              {t("article.category")}
            </h3>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(undefined)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold font-comfortaa transition-all border
                ${
                  selectedCategory === undefined
                    ? "bg-awqaf-primary text-white border-awqaf-primary shadow-md"
                    : "bg-white text-awqaf-foreground-secondary border-awqaf-border-light hover:bg-accent-50"
                }`}
            >
              {t("article.all")}
            </button>

            {isLoadingCategories
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-20 bg-accent-50 rounded-full animate-pulse flex-shrink-0"
                  />
                ))
              : categoriesData?.data.map((cat) => {
                  const categoryContent = getCategoryContent(cat);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold font-comfortaa transition-all border
                      ${
                        selectedCategory === cat.id
                          ? "bg-awqaf-primary text-white border-awqaf-primary shadow-md"
                          : "bg-white text-awqaf-foreground-secondary border-awqaf-border-light hover:bg-accent-50"
                      }`}
                    >
                      {categoryContent.name}
                    </button>
                  );
                })}
          </div>
        </div>

        {/* Article List */}
        <div className="flex flex-col gap-y-3">
          {isLoadingArticles ? (
            <ArticleSkeleton />
          ) : filteredArtikelData.length > 0 ? (
            filteredArtikelData.map((artikel) => {
              const content = getArticleContent(artikel);
              const categoryContent = getCategoryContent(artikel.category);

              return (
                <Link key={artikel.id} href={`/artikel/${artikel.id}`}>
                  <Card className="border-awqaf-border-light hover:border-awqaf-primary/30 shadow-sm hover:shadow-md transition-all duration-300 bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden group h-42">
                    <CardContent className="p-0 h-full">
                      <div className="flex gap-4 p-4 h-full">
                        {/* Thumbnail */}
                        <div className="w-24 h-24 rounded-xl bg-accent-50 flex items-center justify-center flex-shrink-0 overflow-hidden relative border border-accent-100">
                          {artikel.image ? (
                            <Image
                              src={artikel.image}
                              alt={content.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <BookOpen className="w-8 h-8 text-awqaf-primary/30" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 h-full">
                          <div>
                            <div className="flex justify-between items-start">
                              <Badge
                                variant="secondary"
                                className="mb-1.5 text-[10px] bg-accent-50 text-awqaf-primary border border-accent-100 px-2 h-5"
                              >
                                {categoryContent.name}
                              </Badge>
                            </div>
                            <h3 className="font-bold text-sm text-awqaf-primary line-clamp-2 mb-1 font-comfortaa leading-snug min-h-[2.5rem] flex items-center">
                              {content.title}
                            </h3>
                            <p className="text-[10px] text-awqaf-foreground-secondary line-clamp-1 font-comfortaa leading-relaxed">
                              {content.content
                                .replace(/<[^>]*>/g, "")
                                .substring(0, 80)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-3 text-[10px] text-awqaf-foreground-secondary/70 font-comfortaa">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />{" "}
                                {formatDate(artikel.published_at)}
                              </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-awqaf-secondary group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-awqaf-border-light">
                <Search className="w-6 h-6 text-awqaf-foreground-secondary/50" />
              </div>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                {t("article.noArticlesFound")}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(undefined);
                }}
                className="mt-4 text-xs font-bold text-awqaf-primary hover:underline"
              >
                {t("article.resetFilter")}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}