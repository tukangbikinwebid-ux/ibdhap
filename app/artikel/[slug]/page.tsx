"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  User,
  Share2,
  Bookmark,
  Heart,
  Navigation,
  BookOpen,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { artikelData, type Artikel } from "../data-artikel";

interface ArtikelDetailPageProps {
  params: {
    slug: string;
  };
}

export default function ArtikelDetailPage({ params }: ArtikelDetailPageProps) {
  const [artikel, setArtikel] = useState<Artikel | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<Artikel[]>([]);

  useEffect(() => {
    // Find artikel by slug
    const foundArtikel = artikelData.find((a) => a.slug === params.slug);
    if (foundArtikel) {
      setArtikel(foundArtikel);

      // Find related articles (same category, excluding current article)
      const related = artikelData
        .filter(
          (a) =>
            a.category === foundArtikel.category && a.id !== foundArtikel.id
        )
        .slice(0, 3);
      setRelatedArticles(related);

      // Load bookmark and like status from localStorage
      const bookmarks = JSON.parse(
        localStorage.getItem("artikel-bookmarks") || "[]"
      );
      const likes = JSON.parse(localStorage.getItem("artikel-likes") || "[]");

      setIsBookmarked(bookmarks.includes(foundArtikel.id));
      setIsLiked(likes.includes(foundArtikel.id));
    }
  }, [params.slug]);

  const handleBookmark = () => {
    if (!artikel) return;

    const bookmarks = JSON.parse(
      localStorage.getItem("artikel-bookmarks") || "[]"
    );
    const newBookmarks = isBookmarked
      ? bookmarks.filter((id: string) => id !== artikel.id)
      : [...bookmarks, artikel.id];

    localStorage.setItem("artikel-bookmarks", JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  const handleLike = () => {
    if (!artikel) return;

    const likes = JSON.parse(localStorage.getItem("artikel-likes") || "[]");
    const newLikes = isLiked
      ? likes.filter((id: string) => id !== artikel.id)
      : [...likes, artikel.id];

    localStorage.setItem("artikel-likes", JSON.stringify(newLikes));
    setIsLiked(!isLiked);
  };

  const handleShare = async () => {
    if (!artikel) return;

    const shareData = {
      title: artikel.title,
      text: artikel.excerpt,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // You could show a toast notification here
      } catch (err) {
        console.error("Error copying to clipboard:", err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!artikel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
        {/* Header */}
        <header className="sticky top-0 z-30">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
              <div className="flex items-center justify-between">
                <Link href="/artikel">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                  Artikel
                </h1>
                <div className="w-10 h-10"></div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-6">
          <Card className="border-awqaf-border-light">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-awqaf-foreground-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-card-foreground font-comfortaa mb-2">
                Artikel tidak ditemukan
              </h3>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa mb-4">
                Artikel yang Anda cari tidak ditemukan atau telah dihapus.
              </p>
              <Link href="/artikel">
                <Button variant="outline" size="sm">
                  Kembali ke Daftar Artikel
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/artikel">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                Artikel
              </h1>
              <div className="w-10 h-10"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Article Header */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4 space-y-4">
            {/* Category and Featured Badge */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {artikel.category}
              </Badge>
              {artikel.featured && (
                <Badge variant="default" className="text-xs">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Artikel Pilihan
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-xl font-bold text-card-foreground font-comfortaa leading-tight">
              {artikel.title}
            </h1>

            {/* Excerpt */}
            <p className="text-sm text-awqaf-foreground-secondary font-comfortaa leading-relaxed">
              {artikel.excerpt}
            </p>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-xs text-awqaf-foreground-secondary font-comfortaa">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {artikel.author}
                </div>
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

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {artikel.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBookmark}
                className="flex-1"
              >
                <Bookmark
                  className={`w-4 h-4 mr-2 ${
                    isBookmarked ? "fill-awqaf-primary text-awqaf-primary" : ""
                  }`}
                />
                {isBookmarked ? "Tersimpan" : "Simpan"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className="flex-1"
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                {isLiked ? "Disukai" : "Suka"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Article Content */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4">
            <div
              className="prose prose-sm max-w-none font-comfortaa"
              dangerouslySetInnerHTML={{ __html: artikel.content }}
            />
          </CardContent>
        </Card>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
              Artikel Terkait
            </h2>

            <div className="space-y-3">
              {relatedArticles.map((relatedArtikel) => (
                <Link
                  key={relatedArtikel.id}
                  href={`/artikel/${relatedArtikel.slug}`}
                >
                  <Card className="border-awqaf-border-light hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-5 h-5 text-awqaf-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs">
                              {relatedArtikel.category}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-card-foreground font-comfortaa line-clamp-2 mb-2">
                            {relatedArtikel.title}
                          </h3>
                          <p className="text-sm text-awqaf-foreground-secondary font-comfortaa line-clamp-2 mb-2">
                            {relatedArtikel.excerpt}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-awqaf-foreground-secondary font-comfortaa">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(relatedArtikel.publishedAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {relatedArtikel.readTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {relatedArtikel.views.toLocaleString()}
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

        {/* Back to Articles */}
        <div className="text-center">
          <Link href="/artikel">
            <Button variant="outline" size="sm">
              <Navigation className="w-4 h-4 mr-2" />
              Lihat Semua Artikel
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
