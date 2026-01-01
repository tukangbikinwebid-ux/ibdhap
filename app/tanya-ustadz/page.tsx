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
} from "lucide-react";
import Link from "next/link";
import QuestionFilter, { SortOption } from "./components/QuestionFilter";
import QuestionList from "./components/QuestionList";
import PopularQuestions from "./components/PopularQuestions";
// Import Services & Types
import {
  useGetUstadzQnAQuery,
  useGetUstadzListQuery,
} from "@/services/public/kajian.service";
import { QnAUstadz } from "@/types/public/kajian";

export default function TanyaUstadzPage() {
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

  // Popular Questions Logic (Simulasi: Ambil 5 teratas berdasarkan kriteria tertentu, misal yang sudah dijawab)
  // Karena API belum ada field 'views' atau 'likes', kita anggap yang sudah dijawab adalah yang populer/bermanfaat.
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
          item.ustadz.name.toLowerCase().includes(q)
      );
    }

    // Filter Ustadz (Category replacement)
    if (selectedUstadzId) {
      questions = questions.filter(
        (q) => q.ustadz_id === parseInt(selectedUstadzId)
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
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-awqaf-primary to-awqaf-primary/80 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold font-comfortaa mb-4">
              Tanya Ustadz
            </h1>
            <p className="text-lg text-white/90 font-comfortaa mb-6 max-w-2xl mx-auto">
              Ajukan pertanyaan tentang Islam kepada ustadz yang berkompeten.
              Dapatkan jawaban yang tepat dan terpercaya.
            </p>
            <Link href="/tanya-ustadz/form">
              <Button className="bg-white text-awqaf-primary hover:bg-white/90 font-comfortaa">
                <MessageCircle className="w-4 h-4 mr-2" />
                Ajukan Pertanyaan
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-awqaf-border-light">
                <CardContent className="p-4 text-center">
                  <MessageCircle className="w-8 h-8 text-awqaf-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-card-foreground font-comfortaa">
                    {totalQuestions}
                  </p>
                  <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                    Total Pertanyaan
                  </p>
                </CardContent>
              </Card>

              <Card className="border-awqaf-border-light">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-card-foreground font-comfortaa">
                    {answeredCount}
                  </p>
                  <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                    Terjawab
                  </p>
                </CardContent>
              </Card>

              <Card className="border-awqaf-border-light">
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-card-foreground font-comfortaa">
                    {totalCategories}
                  </p>
                  <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                    Ustadz Aktif
                  </p>
                </CardContent>
              </Card>

              <Card className="border-awqaf-border-light">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-card-foreground font-comfortaa">
                    {popularQuestions.length}
                  </p>
                  <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                    Populer
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filter */}
            <QuestionFilter
              searchQuery={searchQuery}
              selectedCategory={selectedUstadzId}
              sortBy={sortBy}
              onSearchChange={setSearchQuery}
              onCategoryChange={setSelectedUstadzId}
              onSortChange={setSortBy}
              onClearFilters={handleClearFilters}
              // Pass list ustadz untuk dropdown filter kategori
              ustadzList={ustadzData?.data || []}
            />

            {/* Questions List */}
            <div id="questions-list">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-card-foreground font-comfortaa">
                  Daftar Pertanyaan
                </h2>
                <Badge className="bg-awqaf-primary/10 text-awqaf-primary border-awqaf-primary/20 font-comfortaa">
                  {isLoadingQnA ? "..." : filteredQuestions.length} pertanyaan
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
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Questions */}
            <PopularQuestions
              questions={popularQuestions}
              onQuestionClick={handleQuestionClick}
              onViewAllClick={handleViewAllQuestions}
            />

            {/* Motivational Quote */}
            <Card className="border-awqaf-border-light bg-gradient-to-r from-accent-100 to-accent-200">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-awqaf-primary font-comfortaa mb-1">
                  &quot;Menuntut ilmu adalah kewajiban bagi setiap muslim&quot;
                </p>
                <p className="text-xs text-awqaf-foreground-secondary font-tajawal">
                  - HR. Ibnu Majah
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}