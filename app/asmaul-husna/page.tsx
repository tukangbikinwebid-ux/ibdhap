"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Heart,
  Share2,
  Copy,
  CheckCircle,
  ArrowLeft,
  Crown,
  Sparkles,
  BookOpen,
  Star,
  X,
  ChevronRight,
  Filter,
  Gift,
  Quote,
} from "lucide-react";
import Link from "next/link";
import {
  asmaulHusnaData,
  categoryLabels,
  categoryColors,
  type AsmaulHusna,
  type AsmaulHusnaCategory,
} from "./data";

export default function AsmaulHusnaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedAsma, setSelectedAsma] = useState<AsmaulHusna | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AsmaulHusnaCategory | "all">("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("asmaul-husna-favorites");
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem(
      "asmaul-husna-favorites",
      JSON.stringify([...favorites])
    );
  }, [favorites]);

  // Filter asmaul husna based on search and category
  const filteredAsmaulHusna = useMemo(() => {
    let result = asmaulHusnaData;

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
      (item) =>
        item.arabic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchQuery.toLowerCase())
    );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Filter by favorites
    if (showFavoritesOnly) {
      result = result.filter((item) => favorites.has(item.id));
    }

    return result;
  }, [searchQuery, selectedCategory, showFavoritesOnly, favorites]);

  const handleToggleFavorite = (itemId: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
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

  const handleCopyAsma = async (item: AsmaulHusna, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const text = `${item.id}. ${item.arabic}\n${item.latin}\n${item.meaning}\n\n${item.explanation}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShareAsma = async (item: AsmaulHusna, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const text = `${item.id}. ${item.arabic}\n${item.latin}\n${item.meaning}\n\n${item.explanation}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Asmaul Husna - ${item.latin}`,
          text: text,
        });
      } catch (err) {
        console.error("Failed to share:", err);
      }
    } else {
      handleCopyAsma(item, e);
    }
  };

  const handleOpenDetail = (item: AsmaulHusna) => {
    setSelectedAsma(item);
    setIsDetailOpen(true);
  };

  const categories = Object.keys(categoryLabels) as AsmaulHusnaCategory[];

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
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="text-center">
              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                Asmaul Husna
              </h1>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                  99 Nama Allah Yang Indah
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`w-10 h-10 p-0 rounded-full transition-colors duration-200 ${
                  showFavoritesOnly
                    ? "bg-red-100 text-red-600"
                    : "hover:bg-accent-100 hover:text-awqaf-primary"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${showFavoritesOnly ? "fill-red-600" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Hero Card */}
        <Card className="border-awqaf-border-light bg-gradient-to-br from-awqaf-primary to-awqaf-primary/80 text-white overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 opacity-10">
              <Crown className="w-32 h-32 -mt-4 -mr-4" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5" />
                <span className="text-sm font-comfortaa">99 Nama Allah</span>
              </div>
              <h2 className="text-2xl font-bold font-arabic mb-2">
                الأسماء الحسنى
              </h2>
              <p className="text-sm opacity-90 font-comfortaa">
                Pelajari dan amalkan nama-nama Allah yang indah untuk
                mendekatkan diri kepada-Nya.
              </p>
              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{favorites.size} favorit</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Klik untuk detail</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
          <Card className="border-awqaf-border-light">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-awqaf-foreground-secondary" />
                <Input
                  placeholder="Cari nama Allah..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 font-comfortaa"
                />
              </div>
            </CardContent>
          </Card>

        {/* Category Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-awqaf-primary" />
            <span className="text-sm font-medium text-awqaf-primary font-comfortaa">
              Kategori
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === "all" ? "default" : "outline"}
              className={`cursor-pointer font-comfortaa ${
                selectedCategory === "all"
                  ? "bg-awqaf-primary text-white"
                  : "hover:bg-accent-100"
              }`}
              onClick={() => setSelectedCategory("all")}
            >
              Semua
            </Badge>
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className={`cursor-pointer font-comfortaa ${
                  selectedCategory === cat
                    ? categoryColors[cat]
                    : "hover:bg-accent-100"
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {categoryLabels[cat]}
              </Badge>
            ))}
          </div>
        </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
            <span className="text-sm text-awqaf-foreground-secondary font-comfortaa">
              {filteredAsmaulHusna.length} nama ditemukan
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              className="text-xs font-comfortaa"
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              className="text-xs font-comfortaa"
              >
                List
              </Button>
          </div>
        </div>

        {/* Asmaul Husna List */}
        <div className="space-y-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredAsmaulHusna.map((item) => (
                <Card
                  key={item.id}
                  className="border-awqaf-border-light hover:shadow-lg hover:border-awqaf-primary/30 transition-all duration-200 cursor-pointer group"
                  onClick={() => handleOpenDetail(item)}
                >
                  <CardContent className="p-4 space-y-3">
                    {/* Number and Actions */}
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="text-xs font-bold bg-awqaf-primary text-white"
                      >
                        {item.id}
                      </Badge>
                      <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                          onClick={(e) => handleToggleFavorite(item.id, e)}
                        className="p-1 h-6 w-6"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            favorites.has(item.id)
                              ? "fill-red-500 text-red-500"
                                : "text-awqaf-foreground-secondary group-hover:text-awqaf-primary"
                          }`}
                        />
                      </Button>
                      </div>
                    </div>

                    {/* Arabic Text */}
                    <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-3 rounded-xl">
                      <p className="text-lg font-arabic text-awqaf-primary text-center leading-relaxed">
                        {item.arabic}
                      </p>
                    </div>

                    {/* Latin and Meaning */}
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-card-foreground font-comfortaa text-center">
                        {item.latin}
                      </p>
                      <p className="text-xs text-awqaf-foreground-secondary font-comfortaa text-center leading-relaxed line-clamp-2">
                        {item.meaning}
                      </p>
                    </div>

                    {/* Category Badge */}
                    <div className="flex justify-center">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${categoryColors[item.category]}`}
                      >
                        {categoryLabels[item.category]}
                      </Badge>
                    </div>

                    {/* View Detail Indicator */}
                    <div className="flex items-center justify-center gap-1 text-xs text-awqaf-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <BookOpen className="w-3 h-3" />
                      <span className="font-comfortaa">Lihat Detail</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAsmaulHusna.map((item) => (
                <Card
                  key={item.id}
                  className="border-awqaf-border-light hover:shadow-lg hover:border-awqaf-primary/30 transition-all duration-200 cursor-pointer group"
                  onClick={() => handleOpenDetail(item)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Number */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-awqaf-primary to-awqaf-primary/80 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold font-comfortaa">
                          {item.id}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-card-foreground font-comfortaa">
                            {item.latin}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${categoryColors[item.category]}`}
                          >
                            {categoryLabels[item.category]}
                          </Badge>
                        </div>
                        <p className="text-lg font-arabic text-awqaf-primary mb-1">
                            {item.arabic}
                          </p>
                        <p className="text-sm text-awqaf-foreground-secondary font-comfortaa line-clamp-1">
                          {item.meaning}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleToggleFavorite(item.id, e)}
                          className="p-2"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              favorites.has(item.id)
                                ? "fill-red-500 text-red-500"
                                : "text-awqaf-foreground-secondary"
                            }`}
                          />
                        </Button>
                        <ChevronRight className="w-5 h-5 text-awqaf-foreground-secondary group-hover:text-awqaf-primary transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredAsmaulHusna.length === 0 && (
          <Card className="border-awqaf-border-light">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-12 h-12 text-awqaf-foreground-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-card-foreground font-comfortaa mb-2">
                {showFavoritesOnly
                  ? "Belum ada favorit"
                  : "Tidak ada nama Allah ditemukan"}
              </h3>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                {showFavoritesOnly
                  ? "Tandai nama yang Anda sukai dengan ikon hati"
                  : "Coba ubah kata kunci pencarian atau kategori"}
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-0">
          {selectedAsma && (
            <>
              <DialogHeader className="sticky top-0 bg-gradient-to-br from-awqaf-primary to-awqaf-primary/90 text-white p-6 pb-8">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-white/20 text-white border-none">
                    #{selectedAsma.id}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) =>
                        handleToggleFavorite(selectedAsma.id, e)
                      }
                      className="text-white hover:bg-white/20"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.has(selectedAsma.id) ? "fill-white" : ""
                        }`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleCopyAsma(selectedAsma, e)}
                      className="text-white hover:bg-white/20"
                    >
                      {copiedId === selectedAsma.id ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleShareAsma(selectedAsma, e)}
                      className="text-white hover:bg-white/20"
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-arabic mb-3">{selectedAsma.arabic}</p>
                  <DialogTitle className="text-2xl font-comfortaa mb-1">
                    {selectedAsma.latin}
                  </DialogTitle>
                  <p className="text-white/90 font-comfortaa">
                    {selectedAsma.meaning}
                  </p>
                  <Badge
                    className={`mt-3 ${categoryColors[selectedAsma.category]}`}
                  >
                    {categoryLabels[selectedAsma.category]}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="p-6 space-y-6">
                {/* Explanation */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-awqaf-primary" />
                    <h4 className="font-semibold text-card-foreground font-comfortaa">
                      Penjelasan
                    </h4>
                  </div>
                  <p className="text-sm text-awqaf-foreground-secondary font-comfortaa leading-relaxed">
                    {selectedAsma.explanation}
                  </p>
                </div>

                {/* Benefits */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-awqaf-primary" />
                    <h4 className="font-semibold text-card-foreground font-comfortaa">
                      Keutamaan Mengamalkan
                    </h4>
                  </div>
                  <Card className="border-awqaf-border-light bg-accent-50">
                    <CardContent className="p-4">
                      <p className="text-sm text-awqaf-foreground-secondary font-comfortaa leading-relaxed">
                        {selectedAsma.benefits}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Dalil */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Quote className="w-5 h-5 text-awqaf-primary" />
                    <h4 className="font-semibold text-card-foreground font-comfortaa">
                      Dalil
                    </h4>
                  </div>
                  <Card className="border-awqaf-primary/30 bg-gradient-to-br from-awqaf-primary/5 to-awqaf-primary/10">
                    <CardContent className="p-4">
                      <p className="text-sm text-awqaf-primary font-comfortaa leading-relaxed italic">
                        {selectedAsma.dalil}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Close Button */}
                <Button
                  onClick={() => setIsDetailOpen(false)}
                  className="w-full bg-awqaf-primary hover:bg-awqaf-primary/90 text-white font-comfortaa"
                >
                  Tutup
                </Button>
              </div>
            </>
        )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
