
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RotateCcw,
  Settings,
  X,
  Info,
  Check,
} from "lucide-react";

const DHIKR_OPTIONS = [
  { id: "subhanallah", label: "Subhanallah", arabic: "سُبْحَانَ اللّٰهِ" },
  { id: "alhamdulillah", label: "Alhamdulillah", arabic: "اَلْحَمْدُ لِلّٰهِ" },
  { id: "allahuakbar", label: "Allahu Akbar", arabic: "اَللّٰهُ أَكْبَرُ" },
  { id: "lailahaillallah", label: "Laa Ilaaha Illallah", arabic: "لَا إِلٰهَ إِلَّا اللّٰهُ" },
  { id: "astaghfirullah", label: "Astaghfirullah", arabic: "أَسْتَغْفِرُ اللّٰهَ" },
  { id: "sholawat", label: "Sholawat Nabi", arabic: "صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ" },
];

const TARGET_OPTIONS = [33, 99, 100, 1000];

export default function TasbihPage() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [dhikrId, setDhikrId] = useState("subhanallah");
  const [lastReset, setLastReset] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [rippleEffect, setRippleEffect] = useState(false);

  const handleCount = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(30);
    }

    setRippleEffect(true);
    setTimeout(() => setRippleEffect(false), 300);

    const newCount = count >= target ? 1 : count + 1;

    if (newCount === target && typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    setCount(newCount);
  };

  const handleReset = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }
    setCount(0);
    setLastReset(new Date());
  };

  const changeTarget = (newTarget: number) => {
    setTarget(newTarget);
    setCount(0);
  };

  const changeDhikr = (newDhikrId: string) => {
    setDhikrId(newDhikrId);
    setCount(0);
    setShowSettings(false);
  };

  const currentDhikr = DHIKR_OPTIONS.find((d) => d.id === dhikrId) || DHIKR_OPTIONS[0];
  const progressPercentage = Math.min((count / target) * 100, 100);
  const isComplete = count === target;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-emerald-100/50">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-emerald-800">Tasbih Digital</h1>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInfo(!showInfo)}
              className="w-9 h-9 p-0 rounded-full hover:bg-emerald-100"
            >
              <Info className="w-5 h-5 text-emerald-700" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className={`w-9 h-9 p-0 rounded-full hover:bg-emerald-100 ${showSettings ? 'bg-emerald-100' : ''}`}
            >
              <Settings className="w-5 h-5 text-emerald-700" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
                <h2 className="text-lg font-bold text-gray-900">Pengaturan</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                  className="w-8 h-8 p-0 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6 space-y-6">
                {/* Pilihan Dzikir */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wide">
                    Pilih Dzikir
                  </h3>
                  <div className="space-y-2">
                    {DHIKR_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => changeDhikr(opt.id)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          dhikrId === opt.id
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-emerald-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`font-medium ${dhikrId === opt.id ? 'text-emerald-900' : 'text-gray-700'}`}>
                              {opt.label}
                            </p>
                            <p className="text-2xl mt-1 text-emerald-600">{opt.arabic}</p>
                          </div>
                          {dhikrId === opt.id && (
                            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pilihan Target */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wide">
                    Target Hitungan
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {TARGET_OPTIONS.map((t) => (
                      <button
                        key={t}
                        onClick={() => changeTarget(t)}
                        className={`py-3 px-2 rounded-xl font-bold transition-all ${
                          target === t
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Modal */}
        {showInfo && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md animate-in slide-in-from-bottom duration-300">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
                <h2 className="text-lg font-bold text-gray-900">Panduan</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInfo(false)}
                  className="w-8 h-8 p-0 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 text-emerald-700 font-bold">
                    1
                  </div>
                  <p className="text-gray-600 text-sm pt-1">
                    Tekan lingkaran besar untuk menambah hitungan dzikir
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 text-emerald-700 font-bold">
                    2
                  </div>
                  <p className="text-gray-600 text-sm pt-1">
                    Klik ikon pengaturan untuk mengubah jenis dzikir dan target
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 text-emerald-700 font-bold">
                    3
                  </div>
                  <p className="text-gray-600 text-sm pt-1">
                    Gunakan tombol reset untuk memulai hitungan dari awal
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Counter */}
        <div className="space-y-6">
          {/* Dzikir Info Card */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="p-6 text-center">
              <p className="text-4xl mb-2 text-emerald-600">{currentDhikr.arabic}</p>
              <p className="text-lg font-medium text-gray-700">{currentDhikr.label}</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-0 px-3 py-1">
                  Target: {target}
                </Badge>
                {isComplete && (
                  <Badge className="bg-green-500 text-white border-0 px-3 py-1">
                    ✓ Selesai
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Counter Circle */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              {/* Progress Ring */}
              <svg className="transform -rotate-90 w-80 h-80">
                <circle
                  cx="160"
                  cy="160"
                  r="140"
                  stroke="#d1fae5"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="160"
                  cy="160"
                  r="140"
                  stroke="#10b981"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 140}`}
                  strokeDashoffset={`${2 * Math.PI * 140 * (1 - progressPercentage / 100)}`}
                  className="transition-all duration-300"
                  strokeLinecap="round"
                />
              </svg>

              {/* Counter Button */}
              <button
                onClick={handleCount}
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-2xl flex items-center justify-center transition-all duration-200 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-300 ${
                  rippleEffect ? 'scale-95' : ''
                }`}
              >
                <div className="text-center">
                  <span className="text-8xl font-bold text-white drop-shadow-lg">
                    {count}
                  </span>
                  <p className="text-white/90 text-sm mt-2 uppercase tracking-widest">
                    Tekan
                  </p>
                </div>
              </button>
            </div>

            {/* Reset Button */}
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="gap-2 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-8 py-6 rounded-2xl font-medium"
            >
              <RotateCcw className="w-5 h-5" />
              Reset Hitungan
            </Button>
          </div>

          {/* Stats Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-emerald-600">
                    {count}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Hitungan Saat Ini</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-teal-600">
                    {Math.round(progressPercentage)}%
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Progress</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-emerald-200">
                <p className="text-xs text-gray-500">
                  Terakhir direset: {lastReset.toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}