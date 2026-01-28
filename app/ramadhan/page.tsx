"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Moon,
  Sun,
  Sunrise,
  BookOpen,
  Check,
  Target,
  Bell,
  Edit,
  Navigation,
  Loader2,
  Lock,
  LogIn,
  Plus,
  Minus,
  BarChart3,
  TrendingUp,
  Heart,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/app/hooks/useI18n";

// Import Services
import {
  useGetPublicDailyTargetsQuery,
  useGetUserDailyTargetsQuery,
  useToggleDailyTargetMutation,
} from "@/services/daily-target.service";

// Import Komponen
import RamadhanDoaCard from "./components/RamadhanDoaCard";

// --- TYPES ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface RamadhanReminder {
  id: string;
  name: string;
  enabled: boolean;
  time?: string;
}

interface DailyProgress {
  date: string;
  tilawah: number;
  dzikir: boolean;
  doa: boolean;
  tarawih: boolean;
  qiyam: boolean;
  reflection: string;
}

// --- TRANSLATION DICTIONARY (LENGKAP) ---
const RAMADHAN_TEXT: Record<
  LocaleCode,
  {
    title: string;
    targetTitle: string;
    dailyProgress: string;
    loginTitle: string;
    loginDesc: string;
    loginBtn: string;
    reflectionBtn: string;
    reflectionTitle: string;
    save: string;
    cancel: string;
    khatamTitle: string;
    statsTitle: string;
    iftar: string;
    sahur: string;
    reminderBtn: string;
    // New Translations
    totalAchieved: string;
    decrease: string;
    increase: string;
    quranQuote: string;
    juzRead: string;
    tarawihCount: string;
    dzikirCount: string;
    consistency: string;
    statusAchieved: string;
    statusToday: string;
    statusNotYet: string;
    reflectionHistory: string;
    noReflection: string;
  }
> = {
  id: {
    title: "Ramadhan 1446H",
    targetTitle: "Target Ibadah Hari Ini",
    dailyProgress: "Capaian Harian",
    loginTitle: "Login Diperlukan",
    loginDesc: "Login untuk mencatat dan menyimpan progres ibadah harian Anda.",
    loginBtn: "Login Sekarang",
    reflectionBtn: "Catatan Refleksi Hari Ini",
    reflectionTitle: "Refleksi Harian",
    save: "Simpan",
    cancel: "Batal",
    khatamTitle: "Progress Khatam Qur'an",
    statsTitle: "Statistik Ramadhan Anda",
    iftar: "Waktu Berbuka",
    sahur: "Waktu Sahur",
    reminderBtn: "Atur Pengingat",
    totalAchieved: "Total Capaian",
    decrease: "Kurangi",
    increase: "Tambah",
    quranQuote:
      "Bacalah Al-Quran, karena ia akan datang pada hari kiamat sebagai pemberi syafaat bagi pembacanya.",
    juzRead: "Juz Dibaca",
    tarawihCount: "Tarawih",
    dzikirCount: "Dzikir",
    consistency: "Konsistensi Ibadah",
    statusAchieved: "Tercapai",
    statusToday: "Hari Ini",
    statusNotYet: "Belum",
    reflectionHistory: "Riwayat Refleksi",
    noReflection: "Belum ada catatan refleksi.",
  },
  en: {
    title: "Ramadan 1446H",
    targetTitle: "Today's Worship Targets",
    dailyProgress: "Daily Progress",
    loginTitle: "Login Required",
    loginDesc: "Login to track and save your daily worship progress.",
    loginBtn: "Login Now",
    reflectionBtn: "Daily Reflection Note",
    reflectionTitle: "Daily Reflection",
    save: "Save",
    cancel: "Cancel",
    khatamTitle: "Quran Khatam Progress",
    statsTitle: "Your Ramadan Statistics",
    iftar: "Iftar Time",
    sahur: "Suhoor Time",
    reminderBtn: "Set Reminders",
    totalAchieved: "Total Achieved",
    decrease: "Decrease",
    increase: "Increase",
    quranQuote:
      "Read the Quran, for it will come as an intercessor for its reciters on the Day of Resurrection.",
    juzRead: "Juz Read",
    tarawihCount: "Taraweeh",
    dzikirCount: "Dhikr",
    consistency: "Worship Consistency",
    statusAchieved: "Achieved",
    statusToday: "Today",
    statusNotYet: "Missed",
    reflectionHistory: "Reflection History",
    noReflection: "No reflection notes yet.",
  },
  ar: {
    title: "رمضان ١٤٤٦هـ",
    targetTitle: "أهداف العبادة اليومية",
    dailyProgress: "التقدم اليومي",
    loginTitle: "تسجيل الدخول مطلوب",
    loginDesc: "قم بتسجيل الدخول لتتبع وحفظ تقدم عبادتك اليومية.",
    loginBtn: "سجل الدخول الآن",
    reflectionBtn: "مذكرة التأمل اليومي",
    reflectionTitle: "تأملات يومية",
    save: "حفظ",
    cancel: "إلغاء",
    khatamTitle: "تقدم ختم القرآن",
    statsTitle: "إحصائيات رمضان الخاصة بك",
    iftar: "وقت الإفطار",
    sahur: "وقت السحور",
    reminderBtn: "ضبط التذكيرات",
    totalAchieved: "إجمالي المنجز",
    decrease: "إنقاص",
    increase: "زيادة",
    quranQuote: "اقرؤوا القرآن فإنه يأتي يوم القيامة شفيعاً لأصحابه.",
    juzRead: "جزء مقروء",
    tarawihCount: "تراويح",
    dzikirCount: "أذكار",
    consistency: "الاستمرارية",
    statusAchieved: "منجز",
    statusToday: "اليوم",
    statusNotYet: "لم ينجز",
    reflectionHistory: "سجل التأملات",
    noReflection: "لا توجد ملاحظات تأمل بعد.",
  },
  fr: {
    title: "Ramadan 1446H",
    targetTitle: "Objectifs de Culte d'Aujourd'hui",
    dailyProgress: "Progrès Quotidien",
    loginTitle: "Connexion Requise",
    loginDesc: "Connectez-vous pour suivre et enregistrer vos progrès.",
    loginBtn: "Se Connecter",
    reflectionBtn: "Note de Réflexion",
    reflectionTitle: "Réflexion Quotidienne",
    save: "Enregistrer",
    cancel: "Annuler",
    khatamTitle: "Progrès Khatam Coran",
    statsTitle: "Vos Statistiques du Ramadan",
    iftar: "Heure de l'Iftar",
    sahur: "Heure du Suhoor",
    reminderBtn: "Définir des Rappels",
    totalAchieved: "Total Atteint",
    decrease: "Diminuer",
    increase: "Augmenter",
    quranQuote:
      "Lisez le Coran, car il viendra le Jour de la Résurrection comme intercesseur pour les siens.",
    juzRead: "Juz Lu",
    tarawihCount: "Tarawih",
    dzikirCount: "Dhikr",
    consistency: "Cohérence",
    statusAchieved: "Atteint",
    statusToday: "Aujourd'hui",
    statusNotYet: "Manqué",
    reflectionHistory: "Historique de Réflexion",
    noReflection: "Pas encore de notes.",
  },
  kr: {
    title: "라마단 1446H",
    targetTitle: "오늘의 예배 목표",
    dailyProgress: "일일 진행 상황",
    loginTitle: "로그인 필요",
    loginDesc: "일일 예배 진행 상황을 기록하고 저장하려면 로그인하세요.",
    loginBtn: "지금 로그인",
    reflectionBtn: "일일 성찰 노트",
    reflectionTitle: "일일 성찰",
    save: "저장",
    cancel: "취소",
    khatamTitle: "꾸란 완독 진행 상황",
    statsTitle: "당신의 라마단 통계",
    iftar: "이프타르 시간",
    sahur: "수후르 시간",
    reminderBtn: "알림 설정",
    totalAchieved: "총 달성",
    decrease: "감소",
    increase: "증가",
    quranQuote:
      "꾸란을 읽으십시오. 꾸란은 부활의 날에 독자를 위해 중재자로 올 것입니다.",
    juzRead: "읽은 Juz",
    tarawihCount: "타라위",
    dzikirCount: "지키르",
    consistency: "일관성",
    statusAchieved: "달성됨",
    statusToday: "오늘",
    statusNotYet: "미달성",
    reflectionHistory: "성찰 기록",
    noReflection: "아직 성찰 노트가 없습니다.",
  },
  jp: {
    title: "ラマダン 1446H",
    targetTitle: "今日の礼拝目標",
    dailyProgress: "日々の進捗",
    loginTitle: "ログインが必要です",
    loginDesc: "日々の礼拝の進捗を記録・保存するにはログインしてください。",
    loginBtn: "今すぐログイン",
    reflectionBtn: "日々の振り返りノート",
    reflectionTitle: "日々の振り返り",
    save: "保存",
    cancel: "キャンセル",
    khatamTitle: "コーラン完読の進捗",
    statsTitle: "あなたのラマダン統計",
    iftar: "イフタールの時間",
    sahur: "スフールの時間",
    reminderBtn: "リマインダー設定",
    totalAchieved: "達成合計",
    decrease: "減らす",
    increase: "増やす",
    quranQuote:
      "コーランを読みなさい。それは復活の日に読者のための仲裁者として来るでしょう。",
    juzRead: "読んだJuz",
    tarawihCount: "タラウィー",
    dzikirCount: "ズィクル",
    consistency: "一貫性",
    statusAchieved: "達成",
    statusToday: "今日",
    statusNotYet: "未達成",
    reflectionHistory: "振り返り履歴",
    noReflection: "振り返りのメモはまだありません。",
  },
};

export default function RamadhanPage() {
  const { locale } = useI18n();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Safe Locale Access
  const safeLocale = (
    RAMADHAN_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t_ramadhan = RAMADHAN_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  // --- API HOOKS ---
  const { data: publicTargets, isLoading: isLoadingPublic } =
    useGetPublicDailyTargetsQuery({
      type: "ramadhan",
    });

  const todayDate = new Date().toISOString().split("T")[0];
  const { data: userProgressData } = useGetUserDailyTargetsQuery(
    { date: todayDate, paginate: 50 },
    { skip: !isAuthenticated },
  );

  const [toggleTarget] = useToggleDailyTargetMutation();

  // --- LOCAL STATE ---
  const [currentRamadhanDay, setCurrentRamadhanDay] = useState(1);
  const [isRamadhanActive, setIsRamadhanActive] = useState(false);
  const [isLastTenNights, setIsLastTenNights] = useState(false);

  // States for Countdown & UI
  const [timeToIftar, setTimeToIftar] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [timeToSahur, setTimeToSahur] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [nextEvent, setNextEvent] = useState<"sahur" | "iftar">("iftar");
  const [khatamProgress, setKhatamProgress] = useState(0);
  const [monthlyProgress, setMonthlyProgress] = useState<DailyProgress[]>([]);

  const [showReflectionDialog, setShowReflectionDialog] = useState(false);
  const [showReminderDrawer, setShowReminderDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [reflectionText, setReflectionText] = useState("");

  // State untuk Loading indikator per item
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());

  const [reminders, setReminders] = useState<RamadhanReminder[]>([
    {
      id: "niat-puasa",
      name: "Niat Puasa (Malam)",
      enabled: true,
      time: "22:00",
    },
    { id: "sahur", name: "Sahur", enabled: true, time: "04:00" },
    { id: "iftar", name: "Berbuka Puasa", enabled: true, time: "18:00" },
  ]);

  // --- EFFECTS ---
  useEffect(() => {
    const RAMADHAN_START_DATE = new Date(2025, 2, 1);
    const RAMADHAN_END_DATE = new Date(2025, 2, 30);
    const today = new Date();

    if (today >= RAMADHAN_START_DATE && today <= RAMADHAN_END_DATE) {
      setIsRamadhanActive(true);
      const daysDiff = Math.floor(
        (today.getTime() - RAMADHAN_START_DATE.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      setCurrentRamadhanDay(daysDiff + 1);
      if (daysDiff + 1 >= 21) setIsLastTenNights(true);
    }
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const iftarTime = new Date(now);
      iftarTime.setHours(18, 0, 0, 0);
      const sahurTime = new Date(now);
      sahurTime.setHours(4, 0, 0, 0);
      if (now > iftarTime) iftarTime.setDate(iftarTime.getDate() + 1);
      if (now > sahurTime) sahurTime.setDate(sahurTime.getDate() + 1);
      const timeToIftarMs = iftarTime.getTime() - now.getTime();
      const timeToSahurMs = sahurTime.getTime() - now.getTime();

      if (timeToIftarMs < timeToSahurMs) {
        setNextEvent("iftar");
        setTimeToIftar(formatMs(timeToIftarMs));
      } else {
        setNextEvent("sahur");
        setTimeToSahur(formatMs(timeToSahurMs));
      }
    };
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatMs = (ms: number) => ({
    hours: Math.floor(ms / (1000 * 60 * 60)),
    minutes: Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((ms % (1000 * 60)) / 1000),
  });

  useEffect(() => {
    const savedKhatam = localStorage.getItem("ramadhan-khatam-progress");
    if (savedKhatam) setKhatamProgress(parseFloat(savedKhatam));
    const savedReminders = localStorage.getItem("ramadhan-reminders");
    if (savedReminders) setReminders(JSON.parse(savedReminders));
    const savedMonthly = localStorage.getItem("ramadhan-monthly-progress");
    if (savedMonthly) setMonthlyProgress(JSON.parse(savedMonthly));
  }, []);

  // --- HANDLERS ---
  const handleToggleTarget = async (targetId: number) => {
    if (!isAuthenticated) return;

    setTogglingIds((prev) => new Set(prev).add(targetId));

    const userRecord = userProgressData?.data.find(
      (u) => u.daily_target_id === targetId && u.date.startsWith(todayDate),
    );
    const currentStatus = userRecord?.status || false;

    try {
      await toggleTarget({
        daily_target_id: targetId,
        date: todayDate,
        status: !currentStatus,
      }).unwrap();
    } catch (error) {
      console.error("Gagal update target:", error);
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(targetId);
        return next;
      });
    }
  };

  const handleKhatamProgress = (increment: number) => {
    const newProgress = Math.max(0, Math.min(30, khatamProgress + increment));
    setKhatamProgress(newProgress);
    localStorage.setItem("ramadhan-khatam-progress", newProgress.toString());
  };

  const toggleReminder = (id: string) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, enabled: !r.enabled } : r,
    );
    setReminders(updated);
    localStorage.setItem("ramadhan-reminders", JSON.stringify(updated));
  };

  // --- CALCULATIONS ---
  const khatamPercentage = Math.min((khatamProgress / 30) * 100, 100);

  const dailyProgressPercentage = useMemo(() => {
    if (!publicTargets || publicTargets.length === 0) return 0;
    if (!isAuthenticated || !userProgressData) return 0;
    const completedCount = userProgressData.data.filter((u) => u.status).length;
    return Math.round((completedCount / publicTargets.length) * 100);
  }, [publicTargets, userProgressData, isAuthenticated]);

  return (
    <div
      className={`min-h-screen pb-20 transition-colors duration-500 ${
        isLastTenNights
          ? "bg-gradient-to-br from-purple-900 to-indigo-900"
          : "bg-gradient-to-br from-purple-50 to-indigo-50"
      }`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div
            className={`relative backdrop-blur-md rounded-2xl border shadow-lg px-4 py-3 ${
              isLastTenNights
                ? "bg-purple-900/90 border-purple-700/50"
                : "bg-background/90 border-awqaf-border-light/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-10 h-10 p-0 rounded-full ${isLastTenNights ? "text-purple-200" : "text-awqaf-primary"}`}
                >
                  <Navigation
                    className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`}
                  />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Moon
                  className={`w-5 h-5 ${isLastTenNights ? "text-yellow-300" : "text-awqaf-primary"}`}
                />
                <h1
                  className={`text-xl font-bold font-comfortaa ${isLastTenNights ? "text-white" : "text-awqaf-primary"}`}
                >
                  {t_ramadhan.title}
                </h1>
              </div>
              <div className="w-10 h-10"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Countdown Card */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-4 mb-6">
              {nextEvent === "iftar" ? (
                <>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Sun className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-comfortaa text-awqaf-foreground-secondary">
                      {t_ramadhan.iftar}
                    </h3>
                    <div className="flex gap-2 mt-2" dir="ltr">
                      <div className="bg-awqaf-primary text-white px-3 py-2 rounded-lg">
                        <span className="text-2xl font-bold">
                          {String(timeToIftar.hours).padStart(2, "0")}
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-awqaf-primary">
                        :
                      </span>
                      <div className="bg-awqaf-primary text-white px-3 py-2 rounded-lg">
                        <span className="text-2xl font-bold">
                          {String(timeToIftar.minutes).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Sunrise className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-comfortaa text-awqaf-foreground-secondary">
                      {t_ramadhan.sahur}
                    </h3>
                    <div className="flex gap-2 mt-2" dir="ltr">
                      <div className="bg-blue-600 text-white px-3 py-2 rounded-lg">
                        <span className="text-2xl font-bold">
                          {String(timeToSahur.hours).padStart(2, "0")}
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">
                        :
                      </span>
                      <div className="bg-blue-600 text-white px-3 py-2 rounded-lg">
                        <span className="text-2xl font-bold">
                          {String(timeToSahur.minutes).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowReminderDrawer(true)}
            >
              <Bell className={`w-4 h-4 ${isRtl ? "ml-2" : "mr-2"}`} />{" "}
              {t_ramadhan.reminderBtn}
            </Button>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="khatam">Khatam</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
          </TabsList>

          {/* DASHBOARD TAB */}
          <TabsContent value="dashboard" className="space-y-4 mt-4">
            <Card className="border-awqaf-border-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-comfortaa">
                  <Target className="w-5 h-5 text-awqaf-primary" />
                  {t_ramadhan.targetTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="flex items-center justify-between">
                  <span className="font-comfortaa font-semibold">
                    {t_ramadhan.dailyProgress}
                  </span>
                  <span className="text-2xl font-bold text-awqaf-primary">
                    {isAuthenticated ? `${dailyProgressPercentage}%` : "0%"}
                  </span>
                </div>
                <Progress
                  value={isAuthenticated ? dailyProgressPercentage : 0}
                  className="h-3"
                />

                {/* Login Prompt */}
                {!isAuthenticated && (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex flex-col items-center text-center gap-2">
                    <Lock className="w-8 h-8 text-yellow-600" />
                    <h4 className="font-bold text-yellow-900">
                      {t_ramadhan.loginTitle}
                    </h4>
                    <p className="text-sm text-yellow-800 font-medium">
                      {t_ramadhan.loginDesc}
                    </p>
                    <Link href="/login" className="w-full">
                      <Button
                        size="sm"
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white mt-2"
                      >
                        <LogIn
                          className={`w-4 h-4 ${isRtl ? "ml-2" : "mr-2"}`}
                        />{" "}
                        {t_ramadhan.loginBtn}
                      </Button>
                    </Link>
                  </div>
                )}

                {/* TARGET LIST CHECKLIST */}
                {isLoadingPublic ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-awqaf-primary" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {publicTargets?.map((target) => {
                      const userRecord = userProgressData?.data.find(
                        (u) =>
                          u.daily_target_id === target.id &&
                          u.date.startsWith(todayDate),
                      );
                      const isDone = userRecord?.status || false;
                      const isToggling = togglingIds.has(target.id);

                      return (
                        <div
                          key={target.id}
                          className={`
                            group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 select-none
                            ${
                              isDone
                                ? "bg-green-50 border-green-200 shadow-sm"
                                : "bg-white border-slate-100 hover:border-awqaf-primary/30 hover:shadow-sm"
                            } 
                            ${!isAuthenticated ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
                          `}
                          onClick={() => handleToggleTarget(target.id)}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            {/* Improved Visual Toggle */}
                            <div
                              className={`
                              flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                              ${
                                isDone
                                  ? "bg-green-500 text-white scale-105 shadow-md shadow-green-200"
                                  : "bg-white border-2 border-slate-200 text-transparent group-hover:border-awqaf-primary"
                              }
                            `}
                            >
                              {isToggling ? (
                                <Loader2 className="w-4 h-4 animate-spin text-current" />
                              ) : isDone ? (
                                <Check className="w-5 h-5" strokeWidth={3} />
                              ) : (
                                <div className="w-full h-full rounded-full" />
                              )}
                            </div>

                            {/* Text Content */}
                            <div className="flex-1">
                              <p
                                className={`font-bold font-comfortaa text-sm transition-colors ${
                                  isDone
                                    ? "text-green-800 line-through decoration-green-800/30"
                                    : "text-slate-800"
                                }`}
                              >
                                {target.name}
                              </p>
                              {target.description && (
                                <div
                                  className="text-xs text-slate-500 line-clamp-1 mt-0.5"
                                  dangerouslySetInnerHTML={{
                                    __html: target.description,
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setShowReflectionDialog(true)}
                  disabled={!isAuthenticated}
                >
                  <Edit className={`w-4 h-4 ${isRtl ? "ml-2" : "mr-2"}`} />
                  {isAuthenticated
                    ? t_ramadhan.reflectionBtn
                    : t_ramadhan.loginTitle}
                </Button>
              </CardContent>
            </Card>

            <RamadhanDoaCard />
          </TabsContent>

          {/* KHATAM TAB (Translated) */}
          <TabsContent value="khatam" className="space-y-4 mt-4">
            <Card className="border-awqaf-border-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-comfortaa">
                  <BookOpen className="w-5 h-5 text-awqaf-primary" />
                  {t_ramadhan.khatamTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-comfortaa font-semibold">
                      {t_ramadhan.totalAchieved}
                    </span>
                    <span className="text-2xl font-bold text-awqaf-primary">
                      {khatamPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={khatamPercentage} className="h-4 mb-2" />
                  <p className="text-sm text-center text-awqaf-foreground-secondary font-comfortaa">
                    {khatamProgress.toFixed(1)} / 30 Juz
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3" dir="ltr">
                  <Button
                    variant="outline"
                    onClick={() => handleKhatamProgress(-0.5)}
                    disabled={khatamProgress <= 0}
                  >
                    <Minus className="w-4 h-4 mr-2" /> {t_ramadhan.decrease} 0.5
                    Juz
                  </Button>
                  <Button
                    onClick={() => handleKhatamProgress(0.5)}
                    disabled={khatamProgress >= 30}
                  >
                    <Plus className="w-4 h-4 mr-2" /> {t_ramadhan.increase} 0.5
                    Juz
                  </Button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
                  <p className="text-sm text-blue-800 font-medium italic">
                    &quot;{t_ramadhan.quranQuote}&quot;
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TRACKING TAB (Translated) */}
          <TabsContent value="tracking" className="space-y-4 mt-4">
            <Card className="border-awqaf-border-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-comfortaa">
                  <BarChart3 className="w-5 h-5 text-awqaf-primary" />
                  {t_ramadhan.statsTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-900">
                      {khatamProgress.toFixed(1)}
                    </p>
                    <p className="text-xs text-blue-700 font-comfortaa">
                      {t_ramadhan.juzRead}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-900">
                      {monthlyProgress.filter((p) => p.tarawih).length}
                    </p>
                    <p className="text-xs text-green-700 font-comfortaa">
                      {t_ramadhan.tarawihCount}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-900">
                      {monthlyProgress.filter((p) => p.dzikir).length}
                    </p>
                    <p className="text-xs text-purple-700 font-comfortaa">
                      {t_ramadhan.dzikirCount}
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg text-center">
                    <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-900">
                      {dailyProgressPercentage}%
                    </p>
                    <p className="text-xs text-orange-700 font-comfortaa">
                      {t_ramadhan.statusToday}
                    </p>
                  </div>
                </div>

                {/* Grid Visual */}
                <div>
                  <h4 className="font-semibold font-comfortaa mb-3">
                    {t_ramadhan.consistency}
                  </h4>
                  <div className="grid grid-cols-7 gap-2" dir="ltr">
                    {Array.from({ length: 30 }, (_, i) => {
                      const hasProgress =
                        monthlyProgress[i] &&
                        (monthlyProgress[i].tilawah > 0 ||
                          monthlyProgress[i].tarawih);
                      return (
                        <div
                          key={i}
                          className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold ${
                            i < currentRamadhanDay - 1
                              ? hasProgress
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-400"
                              : i === currentRamadhanDay - 1
                                ? "bg-awqaf-primary text-white ring-2 ring-awqaf-primary ring-offset-2"
                                : "bg-gray-100 text-gray-300"
                          }`}
                        >
                          {i + 1}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-awqaf-foreground-secondary">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>{t_ramadhan.statusAchieved}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-awqaf-primary rounded ring-2 ring-awqaf-primary ring-offset-1"></div>
                      <span>{t_ramadhan.statusToday}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-200 rounded"></div>
                      <span>{t_ramadhan.statusNotYet}</span>
                    </div>
                  </div>
                </div>

                {/* Reflection History */}
                <div>
                  <h4 className="font-semibold font-comfortaa mb-3">
                    {t_ramadhan.reflectionHistory}
                  </h4>
                  {monthlyProgress.filter((p) => p.reflection).length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {monthlyProgress
                        .filter((p) => p.reflection)
                        .reverse()
                        .slice(0, 10)
                        .map((p, index) => (
                          <div
                            key={index}
                            className="p-3 bg-accent-50 rounded-lg"
                          >
                            <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mb-1">
                              {new Date(p.date).toLocaleDateString(safeLocale, {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                              })}
                            </p>
                            <p className="text-sm text-awqaf-foreground font-comfortaa">
                              {p.reflection}
                            </p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-center text-gray-400 italic py-4">
                      {t_ramadhan.noReflection}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialog Refleksi */}
      <Dialog
        open={showReflectionDialog}
        onOpenChange={setShowReflectionDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t_ramadhan.reflectionTitle}</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="..."
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button
              onClick={() => setShowReflectionDialog(false)}
              variant="outline"
            >
              {t_ramadhan.cancel}
            </Button>
            <Button onClick={() => setShowReflectionDialog(false)}>
              {t_ramadhan.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Drawer Reminder */}
      <Drawer open={showReminderDrawer} onOpenChange={setShowReminderDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{t_ramadhan.reminderBtn}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className="flex items-center justify-between border p-3 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Bell
                    className={`w-5 h-5 ${rem.enabled ? "text-awqaf-primary" : "text-gray-300"}`}
                  />
                  <div>
                    <p className="font-semibold text-sm">{rem.name}</p>
                    <p className="text-xs text-gray-500">{rem.time}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={rem.enabled ? "default" : "outline"}
                  onClick={() => toggleReminder(rem.id)}
                >
                  {rem.enabled ? "ON" : "OFF"}
                </Button>
              </div>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}