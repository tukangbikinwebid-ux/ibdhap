"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Play,
  Pause,
  Volume2,
  CheckCircle,
  Navigation,
  ArrowLeft,
  Info,
  LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/app/hooks/useI18n";

// --- 1. LOCAL TRANSLATIONS (Updated UI Text) ---
const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  id: {
    title: "Tajwid & Tahsin",
    subtitle: "Pelajari hukum bacaan Al-Quran",
    learningProgress: "Progress Belajar", // Sesuai Gambar
    overallProgress: "Progress Keseluruhan", // Sesuai Gambar
    lessonsCompleted: "Pelajaran Selesai", // Sesuai Gambar
    materialsMastered: "Materi Dikuasai", // Sesuai Gambar
    completed: "Selesai",
    lesson: "Materi",
    start: "Mulai",
    example: "Contoh Bacaan",
    explanation: "Penjelasan",
    listen: "Dengarkan",
    markComplete: "Tandai Selesai",
    completedBadge: "Dikuasai",
    back: "Kembali",
    mastered: "Materi Dikuasai",
    audioPlaying: "Sedang memutar...",
  },
  en: {
    title: "Tajwid & Tahsin",
    subtitle: "Learn Quran recitation rules",
    learningProgress: "Learning Progress",
    overallProgress: "Overall Progress",
    lessonsCompleted: "Lessons Completed",
    materialsMastered: "Topics Mastered",
    completed: "Completed",
    lesson: "Lesson",
    start: "Start",
    example: "Recitation Example",
    explanation: "Explanation",
    listen: "Listen",
    markComplete: "Mark as Complete",
    completedBadge: "Mastered",
    back: "Back",
    mastered: "Topic Mastered",
    audioPlaying: "Playing...",
  },
  ar: {
    title: "التجويد والتحسين",
    subtitle: "تعلم أحكام تلاوة القرآن",
    learningProgress: "تقدم التعلم",
    overallProgress: "التقدم العام",
    lessonsCompleted: "الدروس المكتملة",
    materialsMastered: "المواضيع المتقنة",
    completed: "مكتمل",
    lesson: "درس",
    start: "ابدأ",
    example: "مثال التلاوة",
    explanation: "شرح",
    listen: "استمع",
    markComplete: "تحديد كمكتمل",
    completedBadge: "متقن",
    back: "عودة",
    mastered: "تم إتقان الموضوع",
    audioPlaying: "جاري التشغيل...",
  },
  fr: {
    title: "Tajwid & Tahsin",
    subtitle: "Apprendre les règles de récitation",
    learningProgress: "Progrès d'apprentissage",
    overallProgress: "Progrès Global",
    lessonsCompleted: "Leçons Terminées",
    materialsMastered: "Sujets Maîtrisés",
    completed: "Terminé",
    lesson: "Leçon",
    start: "Commencer",
    example: "Exemple",
    explanation: "Explication",
    listen: "Écouter",
    markComplete: "Marquer comme terminé",
    completedBadge: "Maîtrisé",
    back: "Retour",
    mastered: "Sujet Maîtrisé",
    audioPlaying: "Lecture...",
  },
  kr: {
    title: "타즈위드 & 타신",
    subtitle: "꾸란 암송 규칙 배우기",
    learningProgress: "학습 진도",
    overallProgress: "전체 진행 상황",
    lessonsCompleted: "완료된 레슨",
    materialsMastered: "마스터한 주제",
    completed: "완료됨",
    lesson: "레슨",
    start: "시작",
    example: "암송 예시",
    explanation: "설명",
    listen: "듣기",
    markComplete: "완료로 표시",
    completedBadge: "마스터함",
    back: "뒤로",
    mastered: "주제 마스터함",
    audioPlaying: "재생 중...",
  },
  jp: {
    title: "タジュウィード",
    subtitle: "クルアーン朗読のルールを学ぶ",
    learningProgress: "学習進捗",
    overallProgress: "全体の進捗",
    lessonsCompleted: "完了したレッスン",
    materialsMastered: "習得したトピック",
    completed: "完了",
    lesson: "レッスン",
    start: "開始",
    example: "朗読例",
    explanation: "説明",
    listen: "聞く",
    markComplete: "完了としてマーク",
    completedBadge: "習得済み",
    back: "戻る",
    mastered: "トピック習得済み",
    audioPlaying: "再生中...",
  },
};

// --- 2. TAJWID DATA (Simulasi API) ---
interface TranslatableText {
  id: string;
  en: string;
  ar: string;
  fr: string;
  kr: string;
  jp: string;
}

interface TajwidRule {
  id: string;
  title: TranslatableText;
  arabic_title: string;
  description: TranslatableText;
  example_arabic: string;
  example_latin: string;
  audio_url: string;
}

interface TajwidCategory {
  id: string;
  title: TranslatableText;
  description: TranslatableText;
  icon: LucideIcon;
  rules: TajwidRule[];
}

const TAJWID_DATA: TajwidCategory[] = [
  {
    id: "nun_sukun",
    title: {
      id: "Hukum Nun Sukun & Tanwin",
      en: "Rules of Nun Sakinah & Tanween",
      ar: "أحكام النون الساكنة والتنوين",
      fr: "Règles de Nun Sakina et Tanween",
      kr: "눈 사키나와 탄윈의 규칙",
      jp: "ヌーン・サキナとタンウィーンのルール",
    },
    description: {
      id: "Aturan membaca ketika bertemu Nun Sukun (نْ) atau Tanwin (ـً ـٍ ـٌ)",
      en: "Rules when encountering Nun Sakinah (نْ) or Tanween",
      ar: "القواعد عند التقاء النون الساكنة أو التنوين",
      fr: "Règles lors de la rencontre de Nun Sakina ou Tanween",
      kr: "눈 사키나 또는 탄윈을 만날 때의 규칙",
      jp: "ヌーン・サキナまたはタンウィーンに出会ったときのルール",
    },
    icon: BookOpen,
    rules: [
      {
        id: "izhar",
        title: {
          id: "Izhar Halqi",
          en: "Izhar Halqi",
          ar: "الإظهار الحلقي",
          fr: "Izhar Halqi",
          kr: "이즈하르 할키",
          jp: "イズハール・ハルキ",
        },
        arabic_title: "الإظهار",
        description: {
          id: "Membaca Nun Sukun/Tanwin dengan JELAS ketika bertemu huruf tenggorokan (ء هـ ع ح غ خ).",
          en: "Pronouncing Nun/Tanween CLEARLY when followed by throat letters (ء هـ ع ح غ خ).",
          ar: "نطق النون/التنوين بوضوح عند التقائها بأحرف الحلق.",
          fr: "Prononcer Nun/Tanween CLAIREMENT lorsqu'il est suivi de lettres de gorge.",
          kr: "목구멍 글자 뒤에 올 때 눈/탄윈을 명확하게 발음합니다.",
          jp: "喉の文字が続く場合、ヌーン/タンウィーンをはっきりと発音します。",
        },
        example_arabic: "مِنْ خَوْفٍ",
        example_latin: "Min Khaufin",
        audio_url:
          "https://download.quranicaudio.com/verses/Mishari_Rashid_Al_Afasy/mp3/106004.mp3",
      },
      {
        id: "idgham_bigunnah",
        title: {
          id: "Idgham Bighunnah",
          en: "Idgham with Ghunnah",
          ar: "إدغام بغنة",
          fr: "Idgham avec Ghunnah",
          kr: "이드감 비군나",
          jp: "イドゥガム・ビグンナ",
        },
        arabic_title: "إدغام بغنة",
        description: {
          id: "Meleburkan Nun Sukun ke huruf (ي ن م و) dengan dengung.",
          en: "Merging Nun Sakinah into (ي ن م و) with nasal sound (Ghunnah).",
          ar: "إدغام النون الساكنة في (ي ن م و) مع الغنة.",
          fr: "Fusionner Nun Sakina dans (ي ن م و) avec un son nasal.",
          kr: "눈 사키나를 콧소리와 함께 (ي ن م و)에 병합합니다.",
          jp: "鼻音を伴ってヌーン・サキナを (ي ن م و) に融合させます。",
        },
        example_arabic: "مَن يَقُولُ",
        example_latin: "May-yaquulu",
        audio_url: "",
      },
    ],
  },
  {
    id: "makharijul_huruf",
    title: {
      id: "Makharijul Huruf",
      en: "Articulation Points",
      ar: "مخارج الحروف",
      fr: "Points d'articulation",
      kr: "발음 위치",
      jp: "発音点",
    },
    description: {
      id: "Tempat keluarnya huruf-huruf Hijaiyah dari dalam mulut/tenggorokan.",
      en: "Places where Arabic letters are articulated.",
      ar: "أماكن خروج الحروف العربية.",
      fr: "Lieux où les lettres arabes sont articulées.",
      kr: "아랍어 문자가 발음되는 위치.",
      jp: "アラビア文字が発音される場所。",
    },
    icon: Volume2,
    rules: [
      {
        id: "al_jauf",
        title: {
          id: "Al-Jauf (Rongga Mulut)",
          en: "Al-Jauf (Empty Space)",
          ar: "الجوف",
          fr: "Al-Jauf (Cavité)",
          kr: "알-자우프 (구강)",
          jp: "アル・ジャウフ (空洞)",
        },
        arabic_title: "الجوف",
        description: {
          id: "Huruf Mad (Panjang) yang keluar dari rongga mulut & tenggorokan: ا و ي",
          en: "Prolongation letters originating from empty space of mouth & throat: ا و ي",
          ar: "حروف المد التي تخرج من الجوف: ا و ي",
          fr: "Lettres de prolongation provenant de l'espace vide de la bouche et de la gorge : ا و ي",
          kr: "입과 목구멍의 빈 공간에서 나오는 연장 문자: ا و ي",
          jp: "口と喉の空洞から発せられる延長文字：ا و ي",
        },
        example_arabic: "نُوحِيهَا",
        example_latin: "Nuu-hii-haa",
        audio_url: "",
      },
    ],
  },
];

export default function TajwidPage() {
  const router = useRouter();
  const { locale } = useI18n();

  // RTL Detection
  const isRtl = locale === "ar";

  // States
  const [activeCategory, setActiveCategory] = useState<TajwidCategory | null>(
    null,
  );
  const [activeRule, setActiveRule] = useState<TajwidRule | null>(null);
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- Helpers for Translation ---
  const lt = (key: string) => {
    const lang = locale || "id";
    return UI_TRANSLATIONS[lang]?.[key] || UI_TRANSLATIONS["id"][key] || key;
  };

  const getDataText = (obj: TranslatableText) => {
    const lang = (locale as keyof TranslatableText) || "id";
    return obj[lang] || obj["id"];
  };

  // Load Progress
  useEffect(() => {
    const saved = localStorage.getItem("tajwid_progress");
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  // Calculate Overall Progress
  const totalRules = TAJWID_DATA.reduce(
    (acc, cat) => acc + cat.rules.length,
    0,
  );
  const completedRules = Object.values(progress).filter(Boolean).length;
  const progressPercentage =
    totalRules > 0 ? (completedRules / totalRules) * 100 : 0;

  // Calculate Completed Lessons (Categories where all rules are done)
  const completedLessonsCount = TAJWID_DATA.filter((cat) =>
    cat.rules.every((rule) => progress[rule.id]),
  ).length;

  const handleToggleComplete = (ruleId: string) => {
    const newProgress = { ...progress, [ruleId]: !progress[ruleId] };
    setProgress(newProgress);
    localStorage.setItem("tajwid_progress", JSON.stringify(newProgress));
  };

  // Audio Handler
  const toggleAudio = (url: string) => {
    if (!url) return;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => setIsPlaying(false);

      audio.play().catch((e) => console.error("Audio error", e));
      setIsPlaying(true);
    }
  };

  // Cleanup audio
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Back Handlers
  const goBackToCategories = () => {
    setActiveCategory(null);
    setActiveRule(null);
  };

  const goBackToRules = () => {
    setActiveRule(null);
  };

  // --- VIEWS ---

  // 1. RULE DETAIL VIEW
  if (activeRule && activeCategory) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <Header
          title={lt("title")}
          subtitle={getDataText(activeCategory.title)}
          onBack={goBackToRules}
          isRtl={isRtl}
        />

        <main className="max-w-md mx-auto px-4 py-6 space-y-6">
          <Card className="border-awqaf-border-light shadow-md">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {getDataText(activeCategory.title)}
                  </Badge>
                  <CardTitle className="text-xl font-bold font-comfortaa text-awqaf-primary">
                    {getDataText(activeRule.title)}
                  </CardTitle>
                </div>
                <h2 className="text-2xl font-tajawal text-awqaf-secondary">
                  {activeRule.arabic_title}
                </h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Explanation */}
              <div className="bg-accent-50 p-4 rounded-lg border border-accent-100">
                <h3 className="text-sm font-semibold text-awqaf-primary mb-1 flex items-center gap-2">
                  <Info className="w-4 h-4" /> {lt("explanation")}
                </h3>
                <p className="text-sm text-awqaf-foreground-secondary leading-relaxed">
                  {getDataText(activeRule.description)}
                </p>
              </div>

              {/* Example */}
              <div>
                <h3 className="text-sm font-semibold text-awqaf-primary mb-3">
                  {lt("example")}
                </h3>
                <div className="flex flex-col items-center justify-center bg-white p-6 rounded-xl border border-dashed border-awqaf-border-light">
                  <p
                    className="text-4xl font-tajawal mb-2 text-center leading-relaxed"
                    dir="rtl"
                  >
                    {activeRule.example_arabic}
                  </p>
                  <p className="text-sm text-awqaf-foreground-secondary italic">
                    {activeRule.example_latin}
                  </p>
                </div>
              </div>

              {/* Audio Player */}
              <Button
                variant={isPlaying ? "default" : "outline"}
                className={`w-full h-12 rounded-full transition-all duration-300 ${isPlaying ? "animate-pulse" : ""}`}
                onClick={() => toggleAudio(activeRule.audio_url)}
                disabled={!activeRule.audio_url}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 mr-2" />
                ) : (
                  <Play className="w-5 h-5 mr-2" />
                )}
                {isPlaying ? lt("audioPlaying") : lt("listen")}
              </Button>

              {/* Completion Toggle */}
              <div
                className={`p-4 rounded-xl border transition-colors cursor-pointer flex items-center gap-3 ${
                  progress[activeRule.id]
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                }`}
                onClick={() => handleToggleComplete(activeRule.id)}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    progress[activeRule.id]
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300"
                  }`}
                >
                  {progress[activeRule.id] && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </div>
                <div>
                  <p
                    className={`font-semibold text-sm ${progress[activeRule.id] ? "text-green-700" : "text-gray-700"}`}
                  >
                    {progress[activeRule.id]
                      ? lt("mastered")
                      : lt("markComplete")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // 2. CATEGORY DETAIL VIEW (List of Rules)
  if (activeCategory) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <Header
          title={lt("title")}
          subtitle={lt("lesson")}
          onBack={goBackToCategories}
          isRtl={isRtl}
        />

        <main className="max-w-md mx-auto px-4 py-6 space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-awqaf-primary">
              <activeCategory.icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-awqaf-primary">
                {getDataText(activeCategory.title)}
              </h2>
              <p className="text-xs text-awqaf-foreground-secondary line-clamp-1">
                {getDataText(activeCategory.description)}
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {activeCategory.rules.map((rule, index) => (
              <Card
                key={rule.id}
                className="border-awqaf-border-light hover:shadow-md transition-all cursor-pointer group"
                onClick={() => setActiveRule(rule)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-accent-100 text-awqaf-primary text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-sm text-card-foreground group-hover:text-awqaf-primary transition-colors">
                        {getDataText(rule.title)}
                      </h3>
                      <p className="text-xs text-awqaf-foreground-secondary font-tajawal">
                        {rule.arabic_title}
                      </p>
                    </div>
                  </div>
                  {progress[rule.id] ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <div
                      className={`w-5 h-5 rounded-full border-2 border-gray-200 ${isRtl ? "rotate-180" : ""}`}
                    >
                      {/* Arrow placeholder */}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // 3. DASHBOARD VIEW (List of Categories)
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <Header title={lt("title")} subtitle={lt("subtitle")} isRtl={isRtl} />

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* --- UI PROGRESS BELAJAR (SESUAI GAMBAR) --- */}
        <Card className="border-awqaf-border-light bg-white shadow-sm">
          <CardContent className="p-6">
            {/* Header: Icon Buku + Text */}
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-5 h-5 text-awqaf-primary" />{" "}
              {/* Warna icon disesuaikan tema */}
              <h3 className="font-bold text-lg font-comfortaa text-card-foreground">
                {lt("learningProgress")}
              </h3>
            </div>

            {/* Progress Bar Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  {lt("overallProgress")}
                </span>
                <span className="text-sm font-bold text-awqaf-primary font-comfortaa">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <Progress
                value={progressPercentage}
                className="h-2 bg-accent-100"
              />
            </div>

            {/* Stats Section (2 Kolom) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-awqaf-primary font-comfortaa mb-1">
                  {completedLessonsCount}
                </p>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                  {lt("lessonsCompleted")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-awqaf-primary font-comfortaa mb-1">
                  {completedRules}
                </p>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                  {lt("materialsMastered")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* ------------------------------------------- */}

        {/* Categories Grid */}
        <div className="grid gap-4">
          {TAJWID_DATA.map((category) => (
            <Card
              key={category.id}
              className="border-awqaf-border-light hover:border-awqaf-primary/50 transition-all cursor-pointer group"
              onClick={() => setActiveCategory(category)}
            >
              <CardContent className="p-4 flex gap-4 items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-100 to-white border border-accent-200 flex items-center justify-center text-awqaf-primary shadow-sm group-hover:scale-105 transition-transform">
                  <category.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-card-foreground text-lg group-hover:text-awqaf-primary transition-colors">
                    {getDataText(category.title)}
                  </h3>
                  <p className="text-xs text-awqaf-foreground-secondary line-clamp-2 mt-1">
                    {getDataText(category.description)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] h-5">
                      {category.rules.length} {lt("lesson")}
                    </Badge>
                  </div>
                </div>
                <div
                  className={`text-gray-300 group-hover:text-awqaf-primary transition-colors ${isRtl ? "rotate-180" : ""}`}
                >
                  <Navigation
                    className="w-5 h-5 rotate-90"
                    fill="currentColor"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

// --- SUB COMPONENTS ---

function Header({
  title,
  subtitle,
  onBack,
  isRtl,
}: {
  title: string;
  subtitle: string;
  onBack?: () => void;
  isRtl: boolean;
}) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack || (() => router.push("/"))}
              className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 transition-colors duration-200"
            >
              <ArrowLeft
                className={`w-5 h-5 text-awqaf-primary ${isRtl ? "rotate-180" : ""}`}
              />
            </Button>

            <div className="text-center flex-1">
              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                {title}
              </h1>
            </div>

            <div className="w-10 h-10" />
          </div>

          <p className="text-xs text-awqaf-foreground-secondary font-comfortaa text-center mt-1 truncate px-4">
            {subtitle}
          </p>
        </div>
      </div>
    </header>
  );
}