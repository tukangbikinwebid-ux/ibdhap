"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Users,
  BookOpen,
  TrendingUp,
  Loader2,
  ArrowLeft,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Added for back button
import QuestionFilter, { SortOption } from "./components/QuestionFilter";
import QuestionList from "./components/QuestionList";
import PopularQuestions from "./components/PopularQuestions";
// Import Services & Types
import {
  useGetUstadzQnAQuery,
  useGetUstadzListQuery,
} from "@/services/public/kajian.service";
import { QnAUstadz } from "@/types/public/kajian";
import { useI18n } from "@/app/hooks/useI18n";
import { LocaleCode } from "@/lib/i18n"; // Ensure type import

export default function TanyaUstadzPage() {
  const router = useRouter();
  const { t, locale } = useI18n();
  const isRtl = locale === "ar"; // Determine direction

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUstadzId, setSelectedUstadzId] = useState<string>(""); // Filter by Ustadz
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // 1. Fetch Ustadz List (untuk filter dan stats)
  const { data: ustadzData } = useGetUstadzListQuery({
    page: 1,
    paginate: 100,
  });

  // 2. Fetch QnA List
  const { data: qnaData, isLoading: isLoadingQnA } = useGetUstadzQnAQuery({
    page: 1,
    paginate: 50, // Ambil cukup banyak untuk client-side filtering/sorting
    is_public: 1,
    ustadz_id: selectedUstadzId ? parseInt(selectedUstadzId) : undefined,
  });

  // Derived Stats
  const totalQuestions = qnaData?.total || 0;
  const answeredCount =
    qnaData?.data.filter((q) => q.status === 1 || q.answer).length || 0;
  // Kategori di sini diasumsikan sebagai Ustadz karena API belum punya endpoint kategori khusus QnA
  const totalCategories = ustadzData?.data.length || 0;

  // Popular Questions Logic
  const popularQuestions = useMemo(() => {
    if (!qnaData?.data) return [];
    return qnaData.data.filter((q) => q.answer !== null).slice(0, 5);
  }, [qnaData]);

  // Filter and Sort Logic
  const filteredQuestions = useMemo(() => {
    if (!qnaData?.data) return [];

    let questions = [...qnaData.data];

    // Filter Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      questions = questions.filter(
        (item) =>
          item.question.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          item.ustadz.name.toLowerCase().includes(q),
      );
    }

    // Filter Ustadz (Category replacement)
    if (selectedUstadzId) {
      questions = questions.filter(
        (q) => q.ustadz_id === parseInt(selectedUstadzId),
      );
    }

    // Sorting
    questions.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();

      switch (sortBy) {
        case "newest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        // Popular & Most Liked sementara fallback ke newest karena data views/likes belum ada di API
        default:
          return dateB - dateA;
      }
    });

    return questions;
  }, [qnaData, searchQuery, selectedUstadzId, sortBy]);

  const handleQuestionClick = (question: QnAUstadz) => {
    console.log("Question clicked:", question);
    // TODO: Navigate to detail
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedUstadzId("");
    setSortBy("newest");
  };

  const handleViewAllQuestions = () => {
    handleClearFilters();
    document
      .getElementById("questions-list")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header (Adapted from SholatPage) */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative flex gap-2 items-center bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-awqaf-primary" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-awqaf-primary font-comfortaa text-center">
                {t("askUstadz.title")}
              </h1>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa text-center mt-1">
                {t("askUstadz.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content (Max-w-md) */}
      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Call to Action: Ask Question */}
        <Link href="/tanya-ustadz/form">
          <Button className="w-full bg-awqaf-primary hover:bg-awqaf-primary/90 text-white font-comfortaa h-12 rounded-xl shadow-md">
            <PlusCircle className="w-5 h-5 mr-2" />
            {t("askUstadz.askQuestion")}
          </Button>
        </Link>

        {/* Stats Grid (2x2 Layout) */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Card className="border-awqaf-border-light bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center mb-2">
                <MessageCircle className="w-5 h-5 text-awqaf-primary" />
              </div>
              <p className="text-xl font-bold text-card-foreground font-comfortaa">
                {totalQuestions}
              </p>
              <p className="text-[10px] text-awqaf-foreground-secondary font-comfortaa uppercase tracking-wider">
                {t("askUstadz.totalQuestions")}
              </p>
            </CardContent>
          </Card>

          <Card className="border-awqaf-border-light bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xl font-bold text-card-foreground font-comfortaa">
                {answeredCount}
              </p>
              <p className="text-[10px] text-awqaf-foreground-secondary font-comfortaa uppercase tracking-wider">
                {t("askUstadz.answered")}
              </p>
            </CardContent>
          </Card>

          <Card className="border-awqaf-border-light bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xl font-bold text-card-foreground font-comfortaa">
                {totalCategories}
              </p>
              <p className="text-[10px] text-awqaf-foreground-secondary font-comfortaa uppercase tracking-wider">
                {t("askUstadz.activeUstadz")}
              </p>
            </CardContent>
          </Card>

          <Card className="border-awqaf-border-light bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-xl font-bold text-card-foreground font-comfortaa">
                {popularQuestions.length}
              </p>
              <p className="text-[10px] text-awqaf-foreground-secondary font-comfortaa uppercase tracking-wider">
                {t("askUstadz.popular")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Popular Questions (Stacked) */}
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <h3 className="font-semibold text-card-foreground text-sm font-comfortaa">
              {t("askUstadz.popular")}
            </h3>
          </div>
          <PopularQuestions
            questions={popularQuestions}
            onQuestionClick={handleQuestionClick}
            onViewAllClick={handleViewAllQuestions}
          />
        </section>

        {/* Filters & List */}
        <section id="questions-list" className="space-y-4">
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-awqaf-border-light shadow-sm">
            <QuestionFilter
              searchQuery={searchQuery}
              selectedCategory={selectedUstadzId}
              sortBy={sortBy}
              onSearchChange={setSearchQuery}
              onCategoryChange={setSelectedUstadzId}
              onSortChange={setSortBy}
              onClearFilters={handleClearFilters}
              ustadzList={ustadzData?.data || []}
            />
          </div>

          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-semibold text-card-foreground font-comfortaa">
              {t("askUstadz.questionList")}
            </h2>
            <Badge className="bg-awqaf-primary/10 text-awqaf-primary border-awqaf-primary/20 font-comfortaa">
              {isLoadingQnA ? "..." : filteredQuestions.length}
            </Badge>
          </div>

          {isLoadingQnA ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-awqaf-primary" />
            </div>
          ) : (
            <QuestionList
              questions={filteredQuestions}
              onQuestionClick={handleQuestionClick}
            />
          )}
        </section>

        {/* Motivational Quote (Stacked at bottom) */}
        <Card className="border-awqaf-border-light bg-gradient-to-r from-accent-100 to-accent-200">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-awqaf-primary font-comfortaa mb-2 italic">
              &quot;{t("askUstadz.motivationalQuote")}&quot;
            </p>
            <p className="text-xs text-awqaf-foreground-secondary font-tajawal">
              - HR. Ibnu Majah
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}