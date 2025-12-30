"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Navigation,
  RotateCcw,
  Settings,
  ChevronRight,
  Target,
  Hand,
  History,
} from "lucide-react";
import Link from "next/link";

// Tipe Data sesuai permintaan
interface TasbihData {
  user_id: string;
  target_count: number;
  current_count: number;
  dhikr_id: string;
  last_reset: string; // ISO String
}

// Opsi Dzikir
const DHIKR_OPTIONS = [
  { id: "subhanallah", label: "Subhanallah" },
  { id: "alhamdulillah", label: "Alhamdulillah" },
  { id: "allahuakbar", label: "Allahu Akbar" },
  { id: "lailahaillallah", label: "Laa Ilaaha Illallah" },
  { id: "astaghfirullah", label: "Astaghfirullah" },
  { id: "sholawat", label: "Sholawat Nabi" },
];

const TARGET_OPTIONS = [33, 99, 100, 1000];
const LOCAL_STORAGE_KEY = "tasbih-digital-data";

export default function TasbihPage() {
  const [data, setData] = useState<TasbihData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Inisialisasi Data dari LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);

      if (storedData) {
        setData(JSON.parse(storedData));
      } else {
        // Data default jika belum ada
        const initialData: TasbihData = {
          user_id: crypto.randomUUID(),
          target_count: 33,
          current_count: 0,
          dhikr_id: "subhanallah",
          last_reset: new Date().toISOString(),
        };
        setData(initialData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData));
      }
      setIsLoaded(true);
    }
  }, []);

  // Simpan ke LocalStorage setiap kali data berubah
  useEffect(() => {
    if (isLoaded && data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);

  // Handle Klik Hitung
  const handleCount = () => {
    if (!data) return;

    // Efek getar (Haptic Feedback) jika didukung device
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }

    const nextCount = data.current_count + 1;

    // Jika mencapai target, beri getaran lebih panjang
    if (nextCount === data.target_count) {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    }

    // Loop logic: Jika melebihi target, kembali ke 1 (atau bisa diset stop)
    // Di sini kita buat terus bertambah, user mereset manual atau otomatis loop
    // Opsi: Auto loop jika target tercapai
    const newCount =
      data.current_count >= data.target_count ? 1 : data.current_count + 1;

    setData({
      ...data,
      current_count: newCount,
    });
  };

  // Handle Reset
  const handleReset = () => {
    if (!data) return;

    // Haptic feedback
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(100);
    }

    setData({
      ...data,
      current_count: 0,
      last_reset: new Date().toISOString(),
    });
  };

  // Ubah Target
  const changeTarget = (newTarget: number) => {
    if (!data) return;
    setData({ ...data, target_count: newTarget, current_count: 0 }); // Reset saat ganti target
  };

  // Ubah Dzikir
  const changeDhikr = (newDhikrId: string) => {
    if (!data) return;
    setData({ ...data, dhikr_id: newDhikrId });
  };

  // Render Loading State
  if (!isLoaded || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 flex items-center justify-center">
        <div className="animate-pulse text-awqaf-primary font-comfortaa">
          Memuat Tasbih...
        </div>
      </div>
    );
  }

  // Helper untuk mendapatkan label dzikir saat ini
  const currentDhikrLabel =
    DHIKR_OPTIONS.find((d) => d.id === data.dhikr_id)?.label || "Dzikir";

  // Hitung persentase progres untuk visualisasi (opsional)
  const progressPercentage = Math.min(
    (data.current_count / data.target_count) * 100,
    100
  );

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
                Tasbih Digital
              </h1>
              <Button
                variant="ghost"
                size="sm"
                className={`w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200 ${
                  showSettings ? "bg-accent-100 text-awqaf-primary" : ""
                }`}
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Settings Panel (Toggle) */}
        {showSettings && (
          <Card className="border-awqaf-border-light animate-in slide-in-from-top-2 fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-comfortaa text-awqaf-foreground-secondary">
                Pengaturan Tasbih
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pilihan Dzikir */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-awqaf-primary font-comfortaa">
                  JENIS DZIKIR
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {DHIKR_OPTIONS.map((opt) => (
                    <Button
                      key={opt.id}
                      variant={data.dhikr_id === opt.id ? "default" : "outline"}
                      className={`justify-start font-comfortaa text-sm h-9 ${
                        data.dhikr_id === opt.id
                          ? "bg-awqaf-primary hover:bg-awqaf-primary/90"
                          : "hover:bg-accent-50 text-awqaf-foreground-secondary"
                      }`}
                      onClick={() => changeDhikr(opt.id)}
                    >
                      {opt.label}
                      {data.dhikr_id === opt.id && (
                        <ChevronRight className="ml-auto w-4 h-4" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Pilihan Target */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-awqaf-primary font-comfortaa">
                  TARGET HITUNGAN
                </p>
                <div className="flex gap-2">
                  {TARGET_OPTIONS.map((target) => (
                    <Button
                      key={target}
                      variant={
                        data.target_count === target ? "default" : "outline"
                      }
                      size="sm"
                      className={`flex-1 font-comfortaa ${
                        data.target_count === target
                          ? "bg-awqaf-primary"
                          : "text-awqaf-foreground-secondary"
                      }`}
                      onClick={() => changeTarget(target)}
                    >
                      {target}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Counter Display */}
        <Card className="border-awqaf-border-light overflow-hidden relative">
          {/* Background progress bar aesthetic */}
          <div className="absolute bottom-0 left-0 h-1 bg-awqaf-primary/20 w-full">
            <div
              className="h-full bg-awqaf-primary transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <CardContent className="p-8 flex flex-col items-center justify-center space-y-6">
            {/* Header Info */}
            <div className="text-center space-y-1">
              <Badge
                variant="secondary"
                className="mb-2 font-comfortaa bg-accent-100 text-awqaf-primary border-0"
              >
                Target: {data.target_count}
              </Badge>
              <h2 className="text-xl font-medium text-awqaf-foreground-secondary font-comfortaa">
                {currentDhikrLabel}
              </h2>
            </div>

            {/* The Big Counter Button */}
            <button
              onClick={handleCount}
              className="group relative w-64 h-64 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 focus:outline-none"
            >
              {/* Outer Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-accent-100 bg-white shadow-xl group-active:shadow-inner" />

              {/* Inner Ring / Active Area */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-accent-50 to-white flex items-center justify-center border border-accent-100">
                <div className="text-center z-10">
                  <span className="text-7xl font-bold text-awqaf-primary font-comfortaa block tracking-tighter">
                    {data.current_count}
                  </span>
                  <span className="text-xs text-awqaf-foreground-secondary font-comfortaa mt-2 block uppercase tracking-widest">
                    Tekan
                  </span>
                </div>
              </div>
            </button>

            {/* Reset Button */}
            <div className="flex gap-4 w-full justify-center pt-2">
              <Button
                variant="outline"
                size="lg"
                onClick={handleReset}
                className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100 w-full max-w-[200px]"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="font-comfortaa">Reset Hitungan</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Info Card */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                <History className="w-5 h-5 text-awqaf-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-card-foreground font-comfortaa">
                  Terakhir Direset
                </p>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                  {new Date(data.last_reset).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-awqaf-foreground-secondary uppercase tracking-wider mb-1">
                  User ID
                </p>
                <Badge
                  variant="outline"
                  className="text-[10px] font-mono text-gray-400"
                >
                  {data.user_id.slice(0, 8)}...
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="border-awqaf-border-light">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-comfortaa flex items-center gap-2">
              <Target className="w-5 h-5 text-awqaf-primary" />
              Panduan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-awqaf-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                Tekan lingkaran besar di tengah untuk menambahkan hitungan
                dzikir.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-awqaf-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                Gunakan ikon <strong>Gear</strong> di pojok kanan atas untuk
                mengganti jenis dzikir atau target hitungan (33, 99, 100).
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-awqaf-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                Data hitungan tersimpan otomatis di browser Anda.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}