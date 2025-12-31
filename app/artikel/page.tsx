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
  Navigation,
  BookOpen,
  Star,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  useGetArticleCategoriesQuery,
  useGetArticlesQuery,
} from "@/services/public/article.service";

export default function ArtikelPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined
  );

  // Menggunakan API Categories
  const { data: categoriesData } = useGetArticleCategoriesQuery({
    page: 1,
    paginate: 100, // Ambil banyak kategori sekaligus
  });

  // Menggunakan API Articles
  // Catatan: Sorting biasanya dilakukan di backend via params tambahan.
  // Di sini kita filter/sort client-side sederhana atau fetch ulang jika backend mendukung sort.
  // Untuk demo ini, kita fetch basic list.
  const { data: articlesData, isLoading } = useGetArticlesQuery({
    page: 1,
    paginate: 50,
    category_id: selectedCategory,
  });

  // Filter local untuk search query (karena API contoh belum ada endpoint search khusus)
  const filteredArtikelData = useMemo(() => {
    if (!articlesData) return [];

    let filtered = articlesData.data;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((artikel) =>
        artikel.title.toLowerCase().includes(lowerQuery)
      );
    }

    return filtered;
  }, [articlesData, searchQuery]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Featured Articles logic (misal 2 artikel terbaru dianggap featured)
  const featuredArticles = useMemo(() => {
    if (!articlesData) return [];
    return articlesData.data.slice(0, 2);
  }, [articlesData]);

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
        {!searchQuery &&
          !selectedCategory &&
          !isLoading &&
          featuredArticles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-awqaf-primary" />
                <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
                  Artikel Terbaru
                </h2>
              </div>

              <div className="space-y-3">
                {featuredArticles.map((artikel) => (
                  <Link
                    className="block"
                    key={artikel.id}
                    href={`/artikel/${artikel.id}`} // Menggunakan ID sesuai API
                  >
                    <Card className="border-awqaf-border-light hover:shadow-md transition-all duration-200 overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex h-28">
                          {/* Image */}
                          <div className="w-28 relative flex-shrink-0 bg-gray-100">
                            {artikel.image ? (
                              <Image
                                src={artikel.image}
                                alt={artikel.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-8 h-8 text-awqaf-primary" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 p-3 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge
                                  variant="default"
                                  className="text-[10px] h-5"
                                >
                                  {artikel.category.name}
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] h-5 bg-yellow-100 text-yellow-700"
                                >
                                  <Star className="w-3 h-3 mr-1" />
                                  Baru
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-sm text-card-foreground font-comfortaa line-clamp-2 mb-1">
                                {artikel.title}
                              </h3>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-awqaf-foreground-secondary font-comfortaa">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(artikel.published_at)}
                              </div>
                              {/* Read time simulasi karena tidak ada di API */}
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />5 min
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
              Kategori
            </h2>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Button
                variant={selectedCategory === undefined ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(undefined)}
                className="flex-shrink-0"
              >
                Semua
              </Button>
              {categoriesData?.data.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="flex-shrink-0"
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
              {isLoading
                ? "Memuat..."
                : `${filteredArtikelData.length} Artikel Ditemukan`}
            </h2>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-awqaf-primary" />
              </div>
            ) : (
              filteredArtikelData.map((artikel) => (
                <Link
                  className="block"
                  key={artikel.id}
                  href={`/artikel/${artikel.id}`} // Gunakan ID
                >
                  <Card className="border-awqaf-border-light hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                          {artikel.image ? (
                            <Image
                              src={artikel.image}
                              alt={artikel.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <BookOpen className="w-6 h-6 text-awqaf-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs">
                              {artikel.category.name}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-card-foreground font-comfortaa line-clamp-2 mb-1">
                            {artikel.title}
                          </h3>
                          {/* Content Preview (Strip HTML tags simple) */}
                          <p className="text-sm text-awqaf-foreground-secondary font-comfortaa line-clamp-2 mb-2">
                            {artikel.content
                              .replace(/<[^>]*>?/gm, "")
                              .substring(0, 100)}
                            ...
                          </p>

                          <div className="flex items-center justify-between text-xs text-awqaf-foreground-secondary font-comfortaa">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(artikel.published_at)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>

          {!isLoading && filteredArtikelData.length === 0 && (
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