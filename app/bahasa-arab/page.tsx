"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Search,
  BookOpen,
  Languages,
  Plane,
  MessageCircle,
  Volume2,
} from "lucide-react";
import Link from "next/link";

// --- 1. TIPE DATA ---
interface ArabicWord {
  word_id: string;
  arabic: string;
  indonesian: string;
  category: "daily" | "travel";
  example_sentence: string;
  transliteration?: string; // Opsional: Membantu cara baca
}

// --- 2. DATA DUMMY ---
const VOCABULARY: ArabicWord[] = [
  {
    word_id: "ARB-001",
    arabic: "شُكْرًا",
    indonesian: "Terima Kasih",
    category: "daily",
    example_sentence: "Syukran 'ala musa'adatik (Terima kasih atas bantuanmu)",
    transliteration: "Syukran",
  },
  {
    word_id: "ARB-002",
    arabic: "كَيْفَ حَالُكَ؟",
    indonesian: "Apa Kabar? (Laki-laki)",
    category: "daily",
    example_sentence: "Kaifa haluka ya akhi? (Apa kabar wahai saudaraku?)",
    transliteration: "Kaifa Haluka",
  },
  {
    word_id: "ARB-003",
    arabic: "فُنْدُق",
    indonesian: "Hotel",
    category: "travel",
    example_sentence: "Aina aqrabu funduq? (Di mana hotel terdekat?)",
    transliteration: "Funduq",
  },
  {
    word_id: "ARB-004",
    arabic: "مَطَار",
    indonesian: "Bandara",
    category: "travel",
    example_sentence: "Ana adzhabu ilal mathar (Saya pergi ke bandara)",
    transliteration: "Mathar",
  },
  {
    word_id: "ARB-005",
    arabic: "بِكَمْ هَذَا؟",
    indonesian: "Berapa harganya?",
    category: "travel",
    example_sentence: "Bikam hadza al-qamis? (Berapa harga kemeja ini?)",
    transliteration: "Bikam hadza",
  },
  {
    word_id: "ARB-006",
    arabic: "صَبَاحُ الْخَيْر",
    indonesian: "Selamat Pagi",
    category: "daily",
    example_sentence: "Sabahul khair ya ummi (Selamat pagi wahai ibuku)",
    transliteration: "Sabahul Khair",
  },
  {
    word_id: "ARB-007",
    arabic: "جَوَازُ السَّفَر",
    indonesian: "Paspor",
    category: "travel",
    example_sentence: "Hadza jawazu safari (Ini paspor saya)",
    transliteration: "Jawazus Safar",
  },
  {
    word_id: "ARB-008",
    arabic: "أَنَا آسِف",
    indonesian: "Saya Minta Maaf",
    category: "daily",
    example_sentence:
      "Ana asif 'ala hadza al-khata (Saya minta maaf atas kesalahan ini)",
    transliteration: "Ana Asif",
  },
];

type FilterCategory = "all" | "daily" | "travel";

export default function ArabicPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<FilterCategory>("all");

  // Helper untuk Play Audio (Simulasi)
  const handlePlayAudio = (text: string) => {
    // Di real app, ini bisa menggunakan SpeechSynthesis API atau file audio
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA"; // Set bahasa Arab
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Audio: " + text);
    }
  };

  // Filter Logic
  const filteredWords = VOCABULARY.filter((item) => {
    const matchesSearch =
      item.indonesian.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.transliteration?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 pb-20">
      {/* Header Sticky */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-awqaf-border-light shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full -ml-2 hover:bg-emerald-100 text-emerald-700"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-emerald-800 font-comfortaa flex items-center gap-2">
                <Languages className="w-5 h-5" /> Belajar Bahasa Arab
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari kata (Indonesia/Latin)..."
              className="pl-9 h-10 bg-white border-emerald-200 rounded-full font-comfortaa focus-visible:ring-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center">
          <Button
            size="sm"
            variant={selectedCategory === "all" ? "default" : "outline"}
            className={`rounded-full px-6 font-comfortaa text-xs h-8 ${
              selectedCategory === "all"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-white border-emerald-200 text-emerald-700"
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            Semua
          </Button>
          <Button
            size="sm"
            variant={selectedCategory === "daily" ? "default" : "outline"}
            className={`rounded-full px-6 font-comfortaa text-xs h-8 gap-2 ${
              selectedCategory === "daily"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-white border-emerald-200 text-emerald-700"
            }`}
            onClick={() => setSelectedCategory("daily")}
          >
            <MessageCircle className="w-3 h-3" /> Sehari-hari
          </Button>
          <Button
            size="sm"
            variant={selectedCategory === "travel" ? "default" : "outline"}
            className={`rounded-full px-6 font-comfortaa text-xs h-8 gap-2 ${
              selectedCategory === "travel"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-white border-emerald-200 text-emerald-700"
            }`}
            onClick={() => setSelectedCategory("travel")}
          >
            <Plane className="w-3 h-3" /> Travel
          </Button>
        </div>

        {/* Word Cards List */}
        <div className="space-y-4">
          {filteredWords.length > 0 ? (
            filteredWords.map((item) => (
              <Card
                key={item.word_id}
                className="border-emerald-100 hover:shadow-md transition-shadow overflow-hidden group"
              >
                <CardContent className="p-0">
                  {/* Top Section: Arabic & Meaning */}
                  <div className="bg-white p-5 text-center relative">
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-mono px-2 py-0.5 border ${
                          item.category === "travel"
                            ? "bg-sky-50 text-sky-700 border-sky-100"
                            : "bg-orange-50 text-orange-700 border-orange-100"
                        }`}
                      >
                        {item.category === "travel" ? "TRAVEL" : "DAILY"}
                      </Badge>
                    </div>

                    {/* Audio Button */}
                    <button
                      onClick={() => handlePlayAudio(item.arabic)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 hover:scale-110 transition-all"
                      title="Dengarkan"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    {/* Arabic Text */}
                    <h2
                      className="text-4xl font-bold text-gray-800 font-serif mb-2 mt-4 leading-relaxed"
                      dir="rtl"
                    >
                      {item.arabic}
                    </h2>

                    {/* Transliteration */}
                    {item.transliteration && (
                      <p className="text-sm text-emerald-600 font-medium italic mb-1">
                        {`"${item.transliteration}"`}
                      </p>
                    )}

                    {/* Indonesian Meaning */}
                    <h3 className="text-lg font-bold text-gray-700 font-comfortaa">
                      {item.indonesian}
                    </h3>
                  </div>

                  {/* Bottom Section: Example */}
                  <div className="bg-emerald-50/50 p-4 border-t border-emerald-100">
                    <div className="flex gap-2 items-start">
                      <BookOpen className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-emerald-700 font-bold mb-0.5 uppercase tracking-wide">
                          Contoh Penggunaan:
                        </p>
                        <p className="text-sm text-gray-600 font-comfortaa italic">
                          {`"${item.example_sentence}"`}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 opacity-60">
              <BookOpen className="w-12 h-12 mx-auto mb-2 text-emerald-300" />
              <p className="font-comfortaa text-emerald-800">
                Kata tidak ditemukan
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}