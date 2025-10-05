"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  Eye,
  Navigation,
  BookOpen,
  TrendingUp,
  Star,
} from "lucide-react";
import Link from "next/link";
import {
  artikelData,
  categories,
  sortOptions,
  type Artikel,
} from "./data-artikel";

export default function ArtikelPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("newest");

  // Filter and sort artikel data
  const filteredArtikelData = useMemo(() => {
    let filtered = artikelData;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (artikel) =>
          artikel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          artikel.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          artikel.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Filter by category
    if (selectedCategory !== "Semua") {
      filtered = filtered.filter(
        (artikel) => artikel.category === selectedCategory
      );
    }

    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.publishedAt).getTime() -
            new Date(b.publishedAt).getTime()
          );
        case "popular":
          return b.views - a.views;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get featured articles
  const featuredArticles = artikelData.filter((artikel) => artikel.featured);

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
                Artikel Islami
              </h1>
              <div className="w-10 h-10"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Search */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-awqaf-foreground-secondary" />
              <Input
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 font-comfortaa"
              />
            </div>
          </CardContent>
        </Card>

        {/* Featured Articles */}
        {!searchQuery && selectedCategory === "Semua" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-awqaf-primary" />
              <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
                Artikel Pilihan
              </h2>
            </div>

            <div className="space-y-3">
              {featuredArticles.slice(0, 2).map((artikel) => (
                <Link key={artikel.id} href={`/artikel/${artikel.slug}`}>
                  <Card className="border-awqaf-border-light hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-8 h-8 text-awqaf-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="default" className="text-xs">
                              {artikel.category}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Pilihan
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-card-foreground font-comfortaa line-clamp-2 mb-2">
                            {artikel.title}
                          </h3>
                          <p className="text-sm text-awqaf-foreground-secondary font-comfortaa line-clamp-2 mb-2">
                            {artikel.excerpt}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-awqaf-foreground-secondary font-comfortaa">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(artikel.publishedAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {artikel.readTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {artikel.views.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-awqaf-primary" />
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
              Filter & Urutkan
            </h2>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-card-foreground font-comfortaa">
              Kategori:
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="flex-shrink-0"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-card-foreground font-comfortaa">
              Urutkan berdasarkan:
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {sortOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={sortBy === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy(option.value)}
                  className="flex-shrink-0"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
              {filteredArtikelData.length} Artikel Ditemukan
            </h2>
            {sortBy === "popular" && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-awqaf-primary" />
                <span className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                  Terpopuler
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {filteredArtikelData.map((artikel) => (
              <Link key={artikel.id} href={`/artikel/${artikel.slug}`}>
                <Card className="border-awqaf-border-light hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-awqaf-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">
                            {artikel.category}
                          </Badge>
                          {artikel.featured && (
                            <Badge variant="default" className="text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Pilihan
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-card-foreground font-comfortaa line-clamp-2 mb-2">
                          {artikel.title}
                        </h3>
                        <p className="text-sm text-awqaf-foreground-secondary font-comfortaa line-clamp-2 mb-3">
                          {artikel.excerpt}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {artikel.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {artikel.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{artikel.tags.length - 3}
                            </Badge>
                          )}
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-xs text-awqaf-foreground-secondary font-comfortaa">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(artikel.publishedAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {artikel.readTime}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {artikel.views.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredArtikelData.length === 0 && (
            <Card className="border-awqaf-border-light">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-awqaf-foreground-secondary mx-auto mb-4" />
                <h3 className="font-semibold text-card-foreground font-comfortaa mb-2">
                  Tidak ada artikel ditemukan
                </h3>
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  Coba ubah kata kunci pencarian atau filter
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
