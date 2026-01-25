"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Moon,
  Sun,
  Sunrise,
  Clock,
  BookOpen,
  Heart,
  CheckCircle2,
  Target,
  Calendar,
  Star,
  Bell,
  BellOff,
  TrendingUp,
  Edit,
  Save,
  X,
  ChevronRight,
  Award,
  Sparkles,
  Play,
  Pause,
  BarChart3,
  Book,
  Navigation,
  Plus,
  Minus,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/app/hooks/useI18n";

// Types
interface KhatamTarget {
  type: "30-days" | "15-days" | "custom";
  juzPerDay: number;
  label: string;
}

interface DailyTarget {
  tilawah: number; // in juz
  dzikir: boolean;
  doa: boolean;
  tarawih: boolean;
  qiyam: boolean;
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

interface RamadhanReminder {
  id: string;
  name: string;
  enabled: boolean;
  time?: string;
}

export default function RamadhanPage() {
  const { t, locale } = useI18n();

  // Ramadhan Info
  const RAMADHAN_START_DATE = new Date(2025, 2, 1); // 1 Maret 2025 (example)
  const RAMADHAN_END_DATE = new Date(2025, 2, 30); // 30 Maret 2025
  
  const [currentRamadhanDay, setCurrentRamadhanDay] = useState(1);
  const [isRamadhanActive, setIsRamadhanActive] = useState(false);
  const [isLastTenNights, setIsLastTenNights] = useState(false);

  // Countdown States
  const [timeToIftar, setTimeToIftar] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [timeToSahur, setTimeToSahur] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [nextEvent, setNextEvent] = useState<"sahur" | "iftar">("iftar");

  // Khatam Al-Quran
  const [khatamTarget, setKhatamTarget] = useState<KhatamTarget>({
    type: "30-days",
    juzPerDay: 1,
    label: "Khatam 30 Hari (1 Juz/Hari)",
  });
  const [khatamProgress, setKhatamProgress] = useState(0); // in juz
  const [showKhatamSettings, setShowKhatamSettings] = useState(false);

  // Daily Targets
  const [dailyTarget, setDailyTarget] = useState<DailyTarget>({
    tilawah: 1,
    dzikir: true,
    doa: true,
    tarawih: true,
    qiyam: false,
  });

  // Daily Progress (Today)
  const [todayProgress, setTodayProgress] = useState<DailyProgress>({
    date: new Date().toDateString(),
    tilawah: 0,
    dzikir: false,
    doa: false,
    tarawih: false,
    qiyam: false,
    reflection: "",
  });

  // Reminders
  const [reminders, setReminders] = useState<RamadhanReminder[]>([
    { id: "niat-puasa", name: "Niat Puasa (Malam)", enabled: true, time: "22:00" },
    { id: "sahur", name: "Sahur", enabled: true, time: "04:00" },
    { id: "imsak", name: "Imsak", enabled: true, time: "04:30" },
    { id: "iftar", name: "Berbuka Puasa", enabled: true, time: "18:00" },
    { id: "tarawih", name: "Tarawih", enabled: true, time: "19:30" },
    { id: "qiyam", name: "Qiyamul Lail (10 malam terakhir)", enabled: false, time: "02:00" },
  ]);

  // Monthly Progress (All days)
  const [monthlyProgress, setMonthlyProgress] = useState<DailyProgress[]>([]);

  // UI States
  const [showReflectionDialog, setShowReflectionDialog] = useState(false);
  const [showReminderDrawer, setShowReminderDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Calculate Ramadhan Status
  useEffect(() => {
    const today = new Date();
    
    if (today >= RAMADHAN_START_DATE && today <= RAMADHAN_END_DATE) {
      setIsRamadhanActive(true);
      const daysDiff = Math.floor((today.getTime() - RAMADHAN_START_DATE.getTime()) / (1000 * 60 * 60 * 24));
      setCurrentRamadhanDay(daysDiff + 1);
      
      // Check if last 10 nights (day 21+)
      if (daysDiff + 1 >= 21) {
        setIsLastTenNights(true);
      }
    } else {
      setIsRamadhanActive(false);
    }
  }, []);

  // Countdown Timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const currentHour = now.getHours();
      
      // Assuming Iftar at 18:00 and Sahur at 04:00 (should be dynamic based on prayer times)
      const iftarTime = new Date(now);
      iftarTime.setHours(18, 0, 0, 0);
      
      const sahurTime = new Date(now);
      sahurTime.setHours(4, 0, 0, 0);
      
      // If past iftar today, set for tomorrow
      if (now > iftarTime) {
        iftarTime.setDate(iftarTime.getDate() + 1);
      }
      
      // If past sahur today, set for tomorrow
      if (now > sahurTime) {
        sahurTime.setDate(sahurTime.getDate() + 1);
      }

      // Determine next event
      const timeToIftarMs = iftarTime.getTime() - now.getTime();
      const timeToSahurMs = sahurTime.getTime() - now.getTime();
      
      if (timeToIftarMs < timeToSahurMs) {
        setNextEvent("iftar");
        const hours = Math.floor(timeToIftarMs / (1000 * 60 * 60));
        const minutes = Math.floor((timeToIftarMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeToIftarMs % (1000 * 60)) / 1000);
        setTimeToIftar({ hours, minutes, seconds });
      } else {
        setNextEvent("sahur");
        const hours = Math.floor(timeToSahurMs / (1000 * 60 * 60));
        const minutes = Math.floor((timeToSahurMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeToSahurMs % (1000 * 60)) / 1000);
        setTimeToSahur({ hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Load Progress from localStorage
  useEffect(() => {
    try {
      const savedKhatam = localStorage.getItem("ramadhan-khatam-progress");
      if (savedKhatam) setKhatamProgress(parseFloat(savedKhatam));

      const savedTarget = localStorage.getItem("ramadhan-daily-target");
      if (savedTarget) setDailyTarget(JSON.parse(savedTarget));

      const today = new Date().toDateString();
      const savedToday = localStorage.getItem(`ramadhan-progress-${today}`);
      if (savedToday) {
        setTodayProgress(JSON.parse(savedToday));
      }

      const savedMonthly = localStorage.getItem("ramadhan-monthly-progress");
      if (savedMonthly) setMonthlyProgress(JSON.parse(savedMonthly));

      const savedReminders = localStorage.getItem("ramadhan-reminders");
      if (savedReminders) setReminders(JSON.parse(savedReminders));
    } catch (error) {
      console.error("Error loading Ramadhan data:", error);
    }
  }, []);

  // Save Progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("ramadhan-khatam-progress", khatamProgress.toString());
      localStorage.setItem("ramadhan-daily-target", JSON.stringify(dailyTarget));
      
      const today = new Date().toDateString();
      localStorage.setItem(`ramadhan-progress-${today}`, JSON.stringify(todayProgress));
      
      // Update monthly progress
      const updatedMonthly = [...monthlyProgress];
      const todayIndex = updatedMonthly.findIndex(p => p.date === today);
      if (todayIndex >= 0) {
        updatedMonthly[todayIndex] = todayProgress;
      } else {
        updatedMonthly.push(todayProgress);
      }
      setMonthlyProgress(updatedMonthly);
      localStorage.setItem("ramadhan-monthly-progress", JSON.stringify(updatedMonthly));

      localStorage.setItem("ramadhan-reminders", JSON.stringify(reminders));
    } catch (error) {
      console.error("Error saving Ramadhan data:", error);
    }
  }, [khatamProgress, dailyTarget, todayProgress, reminders]);

  // Khatam Targets
  const khatamTargets: KhatamTarget[] = [
    { type: "30-days", juzPerDay: 1, label: "Khatam 30 Hari (1 Juz/Hari)" },
    { type: "15-days", juzPerDay: 2, label: "Khatam 15 Hari (2 Juz/Hari)" },
    { type: "custom", juzPerDay: 0.5, label: "Custom (½ Juz/Hari)" },
  ];

  // Calculate Progress Percentages
  const khatamPercentage = Math.min((khatamProgress / 30) * 100, 100);
  const dailyProgressPercentage = useMemo(() => {
    let completed = 0;
    let total = 0;
    
    if (dailyTarget.tilawah > 0) {
      total++;
      if (todayProgress.tilawah >= dailyTarget.tilawah) completed++;
    }
    if (dailyTarget.dzikir) {
      total++;
      if (todayProgress.dzikir) completed++;
    }
    if (dailyTarget.doa) {
      total++;
      if (todayProgress.doa) completed++;
    }
    if (dailyTarget.tarawih) {
      total++;
      if (todayProgress.tarawih) completed++;
    }
    if (dailyTarget.qiyam) {
      total++;
      if (todayProgress.qiyam) completed++;
    }
    
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [dailyTarget, todayProgress]);

  // Handlers
  const handleKhatamProgress = (increment: number) => {
    const newProgress = Math.max(0, Math.min(30, khatamProgress + increment));
    setKhatamProgress(newProgress);
  };

  const handleTilawahProgress = (increment: number) => {
    const newTilawah = Math.max(0, todayProgress.tilawah + increment);
    setTodayProgress({ ...todayProgress, tilawah: newTilawah });
    
    // Auto update khatam
    if (increment > 0) {
      handleKhatamProgress(increment);
    }
  };

  const toggleDailyProgress = (key: keyof Omit<DailyProgress, "date" | "tilawah" | "reflection">) => {
    setTodayProgress({ ...todayProgress, [key]: !todayProgress[key] });
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const saveReflection = (text: string) => {
    setTodayProgress({ ...todayProgress, reflection: text });
    setShowReflectionDialog(false);
  };

  // Doa & Dzikir Data
  const ramadhanDoas = [
    {
      title: "Doa Niat Puasa",
      arabic: "وَبِصَوْمِ غَدٍ نَوَيْتُ مِنْ شَهْرِ رَمَضَانَ",
      latin: "Wa bishaumi ghadin nawaitu min shahri ramadhan",
      translation: "Aku berniat berpuasa esok hari untuk bulan Ramadhan",
      moment: "Malam (sebelum tidur)",
    },
    {
      title: "Doa Berbuka Puasa",
      arabic: "اَللّٰهُمَّ لَكَ صُمْتُ وَبِكَ اٰمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلٰى رِزْقِكَ اَفْطَرْتُ",
      latin: "Allahumma laka shumtu wa bika aamantu wa 'alaika tawakkaltu wa 'ala rizqika afthartu",
      translation: "Ya Allah, untuk-Mu aku berpuasa, kepada-Mu aku beriman, kepada-Mu aku bertawakal, dan dengan rezeki-Mu aku berbuka",
      moment: "Saat Berbuka",
    },
    {
      title: "Doa Setelah Tarawih",
      arabic: "سُبْحَانَ الْمَلِكِ الْقُدُّوسِ",
      latin: "Subhanal malikil quddus (3x)",
      translation: "Maha Suci Raja Yang Maha Suci",
      moment: "Setelah Tarawih",
    },
    {
      title: "Doa Lailatul Qadar",
      arabic: "اَللّٰهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
      latin: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni",
      translation: "Ya Allah, sesungguhnya Engkau Maha Pemaaf, Engkau menyukai pemaafan, maka maafkanlah aku",
      moment: "10 Malam Terakhir",
    },
  ];

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-500 ${
      isLastTenNights 
        ? "bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900" 
        : "bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50"
    }`}>
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className={`relative backdrop-blur-md rounded-2xl border shadow-lg px-4 py-3 ${
            isLastTenNights
              ? "bg-purple-900/90 border-purple-700/50"
              : "bg-background/90 border-awqaf-border-light/50"
          }`}>
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-10 h-10 p-0 rounded-full transition-colors duration-200 ${
                    isLastTenNights
                      ? "hover:bg-purple-800 text-purple-200"
                      : "hover:bg-accent-100 hover:text-awqaf-primary"
                  }`}
                >
                  <Navigation className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Moon className={`w-5 h-5 ${isLastTenNights ? "text-yellow-300" : "text-awqaf-primary"}`} />
                <h1 className={`text-xl font-bold font-comfortaa ${
                  isLastTenNights ? "text-white" : "text-awqaf-primary"
                }`}>
                  Ramadhan 1446H
                </h1>
              </div>
              <div className="w-10 h-10"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Ramadhan Status Badge */}
        {isRamadhanActive && (
          <Card className={`border-2 ${
            isLastTenNights
              ? "bg-gradient-to-r from-purple-900 to-indigo-900 border-yellow-400"
              : "bg-gradient-to-r from-purple-100 to-blue-100 border-awqaf-primary"
          }`}>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-3">
                {isLastTenNights && <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />}
                <div>
                  <h2 className={`text-2xl font-bold font-comfortaa ${
                    isLastTenNights ? "text-yellow-300" : "text-awqaf-primary"
                  }`}>
                    {isLastTenNights ? "🌟 10 Malam Terakhir 🌟" : `Hari ke-${currentRamadhanDay}`}
                  </h2>
                  <p className={`text-sm font-comfortaa ${
                    isLastTenNights ? "text-purple-200" : "text-awqaf-foreground-secondary"
                  }`}>
                    {isLastTenNights 
                      ? "Perbanyak Ibadah & Cari Lailatul Qadar" 
                      : `${30 - currentRamadhanDay} hari lagi menuju Idul Fitri`
                    }
                  </p>
                </div>
                {isLastTenNights && <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Countdown */}
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
                      Waktu Berbuka dalam
                    </h3>
                    <div className="flex gap-2 mt-2">
                      <div className="bg-awqaf-primary text-white px-3 py-2 rounded-lg">
                        <span className="text-2xl font-bold">{String(timeToIftar.hours).padStart(2, '0')}</span>
                        <p className="text-xs">Jam</p>
                      </div>
                      <div className="bg-awqaf-primary text-white px-3 py-2 rounded-lg">
                        <span className="text-2xl font-bold">{String(timeToIftar.minutes).padStart(2, '0')}</span>
                        <p className="text-xs">Menit</p>
                      </div>
                      <div className="bg-awqaf-primary text-white px-3 py-2 rounded-lg">
                        <span className="text-2xl font-bold">{String(timeToIftar.seconds).padStart(2, '0')}</span>
                        <p className="text-xs">Detik</p>
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
                      Waktu Sahur dalam
                    </h3>
                    <div className="flex gap-2 mt-2">
                      <div className="bg-blue-600 text-white px-3 py-2 rounded-lg">
                        <span className="text-2xl font-bold">{String(timeToSahur.hours).padStart(2, '0')}</span>
                        <p className="text-xs">Jam</p>
                      </div>
                      <div className="bg-blue-600 text-white px-3 py-2 rounded-lg">
                        <span className="text-2xl font-bold">{String(timeToSahur.minutes).padStart(2, '0')}</span>
                        <p className="text-xs">Menit</p>
                      </div>
                      <div className="bg-blue-600 text-white px-3 py-2 rounded-lg">
                        <span className="text-2xl font-bold">{String(timeToSahur.seconds).padStart(2, '0')}</span>
                        <p className="text-xs">Detik</p>
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
              <Bell className="w-4 h-4 mr-2" />
              Atur Pengingat Waktu Ibadah
            </Button>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="khatam">Khatam</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4 mt-4">
            {/* Daily Progress Summary */}
            <Card className="border-awqaf-border-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-comfortaa">
                  <Target className="w-5 h-5 text-awqaf-primary" />
                  Target Ibadah Hari Ini
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-comfortaa font-semibold">Progress Hari Ini</span>
                  <span className="text-2xl font-bold text-awqaf-primary">{dailyProgressPercentage}%</span>
                </div>
                <Progress value={dailyProgressPercentage} className="h-3" />
                
                {/* Tilawah */}
                <div className="flex items-center justify-between p-3 bg-accent-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-awqaf-primary" />
                    <div>
                      <p className="font-semibold font-comfortaa">Tilawah Al-Qur&lsquo;an</p>
                      <p className="text-sm text-awqaf-foreground-secondary">
                        {todayProgress.tilawah} / {dailyTarget.tilawah} Juz
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTilawahProgress(-0.5)}
                      disabled={todayProgress.tilawah <= 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleTilawahProgress(0.5)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Dzikir */}
                <div 
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    todayProgress.dzikir ? "bg-success/10 border-2 border-success/30" : "bg-accent-50"
                  }`}
                  onClick={() => toggleDailyProgress("dzikir")}
                >
                  <div className="flex items-center gap-3">
                    <Heart className={`w-5 h-5 ${todayProgress.dzikir ? "text-success" : "text-awqaf-primary"}`} />
                    <p className="font-semibold font-comfortaa">Dzikir Pagi & Petang</p>
                  </div>
                  {todayProgress.dzikir && <CheckCircle2 className="w-6 h-6 text-success" />}
                </div>

                {/* Doa */}
                <div 
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    todayProgress.doa ? "bg-success/10 border-2 border-success/30" : "bg-accent-50"
                  }`}
                  onClick={() => toggleDailyProgress("doa")}
                >
                  <div className="flex items-center gap-3">
                    <Heart className={`w-5 h-5 ${todayProgress.doa ? "text-success" : "text-awqaf-primary"}`} />
                    <p className="font-semibold font-comfortaa">Doa-doa Ramadhan</p>
                  </div>
                  {todayProgress.doa && <CheckCircle2 className="w-6 h-6 text-success" />}
                </div>

                {/* Tarawih */}
                <div 
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    todayProgress.tarawih ? "bg-success/10 border-2 border-success/30" : "bg-accent-50"
                  }`}
                  onClick={() => toggleDailyProgress("tarawih")}
                >
                  <div className="flex items-center gap-3">
                    <Moon className={`w-5 h-5 ${todayProgress.tarawih ? "text-success" : "text-awqaf-primary"}`} />
                    <p className="font-semibold font-comfortaa">Sholat Tarawih</p>
                  </div>
                  {todayProgress.tarawih && <CheckCircle2 className="w-6 h-6 text-success" />}
                </div>

                {/* Qiyamul Lail (only in last 10 nights) */}
                {isLastTenNights && (
                  <div 
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors border-2 ${
                      todayProgress.qiyam 
                        ? "bg-purple-100 border-purple-400" 
                        : "bg-purple-50 border-purple-200"
                    }`}
                    onClick={() => toggleDailyProgress("qiyam")}
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className={`w-5 h-5 ${todayProgress.qiyam ? "text-purple-600" : "text-purple-400"}`} />
                      <p className="font-semibold font-comfortaa text-purple-900">Qiyamul Lail</p>
                    </div>
                    {todayProgress.qiyam && <CheckCircle2 className="w-6 h-6 text-purple-600" />}
                  </div>
                )}

                {/* Reflection */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowReflectionDialog(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {todayProgress.reflection ? "Edit Catatan Refleksi" : "Tambah Catatan Refleksi"}
                </Button>
              </CardContent>
            </Card>

            {/* Doa & Dzikir Ramadhan */}
            <Card className="border-awqaf-border-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-comfortaa">
                  <Heart className="w-5 h-5 text-awqaf-primary" />
                  Doa & Dzikir Ramadhan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ramadhanDoas.map((doa, index) => (
                  <div key={index} className="p-4 bg-accent-50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-awqaf-primary font-comfortaa">{doa.title}</h4>
                      <Badge variant="secondary" className="text-xs">{doa.moment}</Badge>
                    </div>
                    <p className="text-xl font-tajawal text-awqaf-primary text-center leading-relaxed">
                      {doa.arabic}
                    </p>
                    <p className="text-sm italic text-center text-awqaf-foreground-secondary font-comfortaa">
                      {doa.latin}
                    </p>
                    <p className="text-sm text-center text-awqaf-foreground font-comfortaa">
                      &quot;{doa.translation}&quot;
                    </p>
                  </div>
                ))}
                
                <Link href="/doa-dzikir">
                  <Button variant="outline" className="w-full">
                    Lihat Semua Doa & Dzikir
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Khatam Tab */}
          <TabsContent value="khatam" className="space-y-4 mt-4">
            <Card className="border-awqaf-border-light">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg font-comfortaa">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-awqaf-primary" />
                    Program Khatam Al-Qur&lsquo;an
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowKhatamSettings(true)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Target Info */}
                <div className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                  <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">Target Anda:</p>
                  <p className="text-lg font-bold text-awqaf-primary font-comfortaa">{khatamTarget.label}</p>
                  <p className="text-sm text-awqaf-foreground-secondary font-comfortaa mt-1">
                    {khatamTarget.juzPerDay} Juz per hari
                  </p>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-comfortaa font-semibold">Progress Khatam</span>
                    <span className="text-2xl font-bold text-awqaf-primary">{khatamPercentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={khatamPercentage} className="h-4 mb-2" />
                  <p className="text-sm text-center text-awqaf-foreground-secondary font-comfortaa">
                    {khatamProgress.toFixed(1)} / 30 Juz
                  </p>
                </div>

                {/* Quick Add */}
                <div className="space-y-3">
                  <p className="font-semibold font-comfortaa">Update Progress:</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleKhatamProgress(0.5)}
                    >
                      + ½ Juz
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleKhatamProgress(1)}
                    >
                      + 1 Juz
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleKhatamProgress(2)}
                    >
                      + 2 Juz
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => handleKhatamProgress(-0.5)}
                    disabled={khatamProgress <= 0}
                  >
                    Koreksi (-½ Juz)
                  </Button>
                </div>

                {/* Quick Link to Quran */}
                <Link href="/quran">
                  <Button className="w-full bg-awqaf-primary hover:bg-awqaf-primary/90">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Buka Al-Qur&lsquo;an
                  </Button>
                </Link>

                {/* Milestone Achievement */}
                {khatamPercentage >= 100 && (
                  <div className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border-2 border-yellow-400 text-center">
                    <Award className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
                    <p className="font-bold text-lg text-yellow-900 font-comfortaa">
                      🎉 Alhamdulillah! Anda telah Khatam! 🎉
                    </p>
                    <p className="text-sm text-yellow-800 font-comfortaa mt-1">
                      Masha Allah, semoga berkah dan bermanfaat
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tarawih & Tadarus Mode */}
            <Card className="border-awqaf-border-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-comfortaa">
                  <Book className="w-5 h-5 text-awqaf-primary" />
                  Mode Tarawih & Tadarus
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  Fitur khusus untuk membantu Anda dalam ibadah tarawih dan tadarus
                </p>
                
                <div className="space-y-2">
                  <Link href="/quran">
                    <Button variant="outline" className="w-full justify-between">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        <span>Mode Tarawih (Surat Pendek)</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  
                  <Link href="/quran">
                    <Button variant="outline" className="w-full justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>Mode Tadarus Bergantian</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tracking Tab */}
          <TabsContent value="tracking" className="space-y-4 mt-4">
            <Card className="border-awqaf-border-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-comfortaa">
                  <BarChart3 className="w-5 h-5 text-awqaf-primary" />
                  Statistik Ramadhan Anda
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-900">{khatamProgress.toFixed(1)}</p>
                    <p className="text-xs text-blue-700 font-comfortaa">Juz Dibaca</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-900">
                      {monthlyProgress.filter(p => p.tarawih).length}
                    </p>
                    <p className="text-xs text-green-700 font-comfortaa">Tarawih</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-900">
                      {monthlyProgress.filter(p => p.dzikir).length}
                    </p>
                    <p className="text-xs text-purple-700 font-comfortaa">Dzikir</p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg text-center">
                    <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-900">
                      {dailyProgressPercentage}%
                    </p>
                    <p className="text-xs text-orange-700 font-comfortaa">Hari Ini</p>
                  </div>
                </div>

                {/* Consistency Tracker */}
                <div>
                  <h4 className="font-semibold font-comfortaa mb-3">Konsistensi Ibadah</h4>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 30 }, (_, i) => {
                      const dayProgress = monthlyProgress[i];
                      const hasProgress = dayProgress && (
                        dayProgress.tilawah > 0 || 
                        dayProgress.dzikir || 
                        dayProgress.doa || 
                        dayProgress.tarawih
                      );
                      
                      return (
                        <div
                          key={i}
                          className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold ${
                            i < currentRamadhanDay - 1
                              ? hasProgress
                                ? "bg-success text-white"
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
                      <div className="w-3 h-3 bg-success rounded"></div>
                      <span>Tercapai</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-awqaf-primary rounded ring-2 ring-awqaf-primary ring-offset-1"></div>
                      <span>Hari Ini</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-200 rounded"></div>
                      <span>Belum</span>
                    </div>
                  </div>
                </div>

                {/* Reflection History */}
                {monthlyProgress.filter(p => p.reflection).length > 0 && (
                  <div>
                    <h4 className="font-semibold font-comfortaa mb-3">Catatan Refleksi</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {monthlyProgress
                        .filter(p => p.reflection)
                        .reverse()
                        .slice(0, 10)
                        .map((p, index) => (
                          <div key={index} className="p-3 bg-accent-50 rounded-lg">
                            <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mb-1">
                              {new Date(p.date).toLocaleDateString('id-ID', { 
                                weekday: 'long', 
                                day: 'numeric', 
                                month: 'long' 
                              })}
                            </p>
                            <p className="text-sm text-awqaf-foreground font-comfortaa">
                              {p.reflection}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Khatam Settings Dialog */}
      <Dialog open={showKhatamSettings} onOpenChange={setShowKhatamSettings}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-comfortaa">Pengaturan Target Khatam</DialogTitle>
            <DialogDescription className="font-comfortaa">
              Pilih target khatam Al-Qur&lsquo;an Anda
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {khatamTargets.map((target) => (
              <Button
                key={target.type}
                variant={khatamTarget.type === target.type ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => {
                  setKhatamTarget(target);
                  setShowKhatamSettings(false);
                }}
              >
                <div className="text-left">
                  <p className="font-semibold">{target.label}</p>
                  <p className="text-xs opacity-80">{target.juzPerDay} Juz per hari</p>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Reflection Dialog */}
      <Dialog open={showReflectionDialog} onOpenChange={setShowReflectionDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-comfortaa">Catatan Refleksi Hari Ini</DialogTitle>
            <DialogDescription className="font-comfortaa">
              Tulis refleksi ibadah dan pembelajaran Anda hari ini
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Alhamdulillah hari ini saya..."
            value={todayProgress.reflection}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTodayProgress({ ...todayProgress, reflection: e.target.value })}
            className="min-h-32 font-comfortaa"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowReflectionDialog(false)}>
              Batal
            </Button>
            <Button onClick={() => saveReflection(todayProgress.reflection)}>
              <Save className="w-4 h-4 mr-2" />
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reminders Drawer */}
      <Drawer open={showReminderDrawer} onOpenChange={setShowReminderDrawer}>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader>
            <DrawerTitle className="font-comfortaa">Pengingat Waktu Ibadah</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-3 overflow-y-auto">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                  reminder.enabled
                    ? "bg-accent-50 border-awqaf-primary"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bell className={`w-5 h-5 ${reminder.enabled ? "text-awqaf-primary" : "text-gray-400"}`} />
                  <div>
                    <p className="font-semibold font-comfortaa">{reminder.name}</p>
                    {reminder.time && (
                      <p className="text-sm text-awqaf-foreground-secondary">{reminder.time}</p>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={reminder.enabled ? "default" : "outline"}
                  onClick={() => toggleReminder(reminder.id)}
                >
                  {reminder.enabled ? "Aktif" : "Nonaktif"}
                </Button>
              </div>
            ))}
            
            <p className="text-xs text-center text-awqaf-foreground-secondary font-comfortaa mt-4">
              💡 Pastikan notifikasi browser diizinkan untuk menerima pengingat
            </p>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
