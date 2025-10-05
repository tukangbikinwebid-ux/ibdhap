"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Play,
  Pause,
  Volume2,
  VolumeX,
  CheckCircle,
  Star,
  Navigation,
} from "lucide-react";
import Link from "next/link";

interface TajwidRule {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  example: string;
  audioUrl?: string;
  difficulty: "easy" | "medium" | "hard";
  category: "makharij" | "sifat" | "ahkam" | "wafq";
  progress: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  rules: TajwidRule[];
  completed: boolean;
}

const tajwidLessons: Lesson[] = [
  {
    id: "1",
    title: "Makharijul Huruf",
    description: "Tempat keluarnya huruf-huruf hijaiyah",
    completed: false,
    rules: [
      {
        id: "1-1",
        name: "Huruf Halqiyah",
        arabicName: "الحلقية",
        description: "Huruf yang keluar dari tenggorokan",
        example: "أ، ه، ع، ح، غ، خ",
        difficulty: "easy",
        category: "makharij",
        progress: 0,
      },
      {
        id: "1-2",
        name: "Huruf Lahawiyah",
        arabicName: "اللهاوية",
        description: "Huruf yang keluar dari pangkal lidah",
        example: "ق، ك",
        difficulty: "easy",
        category: "makharij",
        progress: 0,
      },
      {
        id: "1-3",
        name: "Huruf Syajariah",
        arabicName: "الشجرية",
        description: "Huruf yang keluar dari tengah lidah",
        example: "ج، ش، ي",
        difficulty: "medium",
        category: "makharij",
        progress: 0,
      },
    ],
  },
  {
    id: "2",
    title: "Sifatul Huruf",
    description: "Sifat-sifat huruf hijaiyah",
    completed: false,
    rules: [
      {
        id: "2-1",
        name: "Qalqalah",
        arabicName: "القلقلة",
        description: "Gema atau pantulan suara pada huruf tertentu",
        example: "ق، ط، ب، ج، د",
        difficulty: "medium",
        category: "sifat",
        progress: 0,
      },
      {
        id: "2-2",
        name: "Gunnah",
        arabicName: "الغنة",
        description: "Dengung pada huruf nun dan mim",
        example: "ن، م",
        difficulty: "easy",
        category: "sifat",
        progress: 0,
      },
      {
        id: "2-3",
        name: "Idgham",
        arabicName: "الإدغام",
        description: "Menggabungkan dua huruf menjadi satu",
        example: "ن + ب = م",
        difficulty: "hard",
        category: "sifat",
        progress: 0,
      },
    ],
  },
  {
    id: "3",
    title: "Ahkamul Huruf",
    description: "Hukum-hukum bacaan huruf",
    completed: false,
    rules: [
      {
        id: "3-1",
        name: "Izhar",
        arabicName: "الإظهار",
        description: "Membaca huruf nun sukun dengan jelas",
        example: "من آمن",
        difficulty: "easy",
        category: "ahkam",
        progress: 0,
      },
      {
        id: "3-2",
        name: "Ikhfa",
        arabicName: "الإخفاء",
        description: "Menyembunyikan huruf nun sukun",
        example: "من ثمرة",
        difficulty: "medium",
        category: "ahkam",
        progress: 0,
      },
      {
        id: "3-3",
        name: "Iqlab",
        arabicName: "الإقلاب",
        description: "Mengubah huruf nun sukun menjadi mim",
        example: "من بعد",
        difficulty: "medium",
        category: "ahkam",
        progress: 0,
      },
    ],
  },
];

export default function TajwidPage() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedRule, setSelectedRule] = useState<TajwidRule | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set()
  );

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("tajwid-progress");
    const savedCompleted = localStorage.getItem("tajwid-completed");

    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }

    if (savedCompleted) {
      setCompletedLessons(new Set(JSON.parse(savedCompleted)));
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem("tajwid-progress", JSON.stringify(userProgress));
    localStorage.setItem(
      "tajwid-completed",
      JSON.stringify([...completedLessons])
    );
  }, [userProgress, completedLessons]);

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setSelectedRule(null);
  };

  const handleRuleSelect = (rule: TajwidRule) => {
    setSelectedRule(rule);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Simulate audio playback
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleRuleComplete = (ruleId: string) => {
    const newProgress = { ...userProgress, [ruleId]: 100 };
    setUserProgress(newProgress);

    // Check if lesson is completed
    if (selectedLesson) {
      const allRulesCompleted = selectedLesson.rules.every(
        (rule) => newProgress[rule.id] === 100
      );

      if (allRulesCompleted) {
        setCompletedLessons((prev) => new Set([...prev, selectedLesson.id]));
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Mudah";
      case "medium":
        return "Sedang";
      case "hard":
        return "Sulit";
      default:
        return "Tidak diketahui";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "makharij":
        return "🗣️";
      case "sifat":
        return "🎵";
      case "ahkam":
        return "📖";
      case "wafq":
        return "🔗";
      default:
        return "📚";
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case "makharij":
        return "Makharijul Huruf";
      case "sifat":
        return "Sifatul Huruf";
      case "ahkam":
        return "Ahkamul Huruf";
      case "wafq":
        return "Wafq";
      default:
        return "Kategori";
    }
  };

  const getOverallProgress = () => {
    const totalRules = tajwidLessons.reduce(
      (acc, lesson) => acc + lesson.rules.length,
      0
    );
    const completedRules = Object.values(userProgress).filter(
      (progress) => progress === 100
    ).length;
    return totalRules > 0 ? (completedRules / totalRules) * 100 : 0;
  };

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
                Belajar Tajwid
              </h1>
              <div className="w-10 h-10"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Progress Overview */}
        <Card className="border-awqaf-border-light">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-comfortaa flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-awqaf-primary" />
              Progress Belajar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-awqaf-foreground-secondary font-comfortaa">
                  Progress Keseluruhan
                </span>
                <span className="text-awqaf-primary font-comfortaa font-medium">
                  {getOverallProgress().toFixed(0)}%
                </span>
              </div>
              <Progress value={getOverallProgress()} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-awqaf-primary font-comfortaa">
                  {completedLessons.size}
                </p>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                  Pelajaran Selesai
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-awqaf-primary font-comfortaa">
                  {Object.values(userProgress).filter((p) => p === 100).length}
                </p>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                  Materi Dikuasai
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lessons List */}
        {!selectedLesson && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
              Pilih Pelajaran
            </h2>

            {tajwidLessons.map((lesson) => (
              <Card
                key={lesson.id}
                className="border-awqaf-border-light hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => handleLessonSelect(lesson)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-awqaf-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground font-comfortaa">
                          {lesson.title}
                        </h3>
                        <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                          {lesson.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {lesson.rules.length} materi
                          </Badge>
                          {completedLessons.has(lesson.id) && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Selesai
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-awqaf-primary font-comfortaa">
                        {
                          lesson.rules.filter(
                            (rule) => userProgress[rule.id] === 100
                          ).length
                        }
                        /{lesson.rules.length}
                      </div>
                      <div className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                        selesai
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Lesson Content */}
        {selectedLesson && !selectedRule && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedLesson(null)}
                className="hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
              >
                ← Kembali
              </Button>
              <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
                {selectedLesson.title}
              </h2>
            </div>

            <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
              {selectedLesson.description}
            </p>

            <div className="space-y-3">
              {selectedLesson.rules.map((rule) => (
                <Card
                  key={rule.id}
                  className="border-awqaf-border-light hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => handleRuleSelect(rule)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {getCategoryIcon(rule.category)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-card-foreground font-comfortaa">
                            {rule.name}
                          </h3>
                          <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                            {rule.arabicName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="secondary"
                              className={`text-xs ${getDifficultyColor(
                                rule.difficulty
                              )}`}
                            >
                              {getDifficultyText(rule.difficulty)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {getCategoryName(rule.category)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {userProgress[rule.id] === 100 ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <div className="w-6 h-6 border-2 border-awqaf-border-light rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Rule Detail */}
        {selectedRule && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedRule(null)}
                className="hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
              >
                ← Kembali
              </Button>
              <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
                {selectedRule.name}
              </h2>
            </div>

            <Card className="border-awqaf-border-light">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-comfortaa flex items-center gap-2">
                  <span className="text-2xl">
                    {getCategoryIcon(selectedRule.category)}
                  </span>
                  {selectedRule.arabicName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-card-foreground font-comfortaa mb-2">
                    Penjelasan
                  </h4>
                  <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                    {selectedRule.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-card-foreground font-comfortaa mb-2">
                    Contoh
                  </h4>
                  <div className="bg-accent-50 p-4 rounded-lg">
                    <p className="text-2xl font-tajawal text-center text-awqaf-primary">
                      {selectedRule.example}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${getDifficultyColor(
                      selectedRule.difficulty
                    )}`}
                  >
                    {getDifficultyText(selectedRule.difficulty)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {getCategoryName(selectedRule.category)}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePlayPause}
                    className="flex-1"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 mr-2" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    {isPlaying ? "Pause" : "Dengarkan"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggleMute}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    onClick={() => handleRuleComplete(selectedRule.id)}
                    className="w-full"
                    disabled={userProgress[selectedRule.id] === 100}
                  >
                    {userProgress[selectedRule.id] === 100 ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Sudah Dikuasai
                      </>
                    ) : (
                      <>
                        <Star className="w-4 h-4 mr-2" />
                        Tandai Selesai
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
