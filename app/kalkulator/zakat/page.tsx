"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  RotateCcw,
  Navigation,
  History,
  Coins,
  TrendingUp,
  Wallet,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/app/hooks/useI18n";
import { getCurrentLocale } from "@/lib/i18n";

// --- TIPE DATA ---
type ZakatType = "profesi" | "maal";

interface ZakatData {
  user_id: string;
  zakat_type: ZakatType;
  input_values: Record<string, number>; // JSON storage untuk input dinamis
  total_result: number;
  last_calculated: string; // ISO String
}

// --- KONSTANTA & CONFIG ---
const STORAGE_KEY = "zakat-calculator-data";
const DEFAULT_GOLD_PRICE = 1300000; // Harga emas per gram (bisa diupdate user)

// Helper function untuk generate unique ID
const generateUUID = (): string => {
  if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  // Fallback untuk browser yang tidak support crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export default function ZakatCalculatorPage() {
  const { t } = useI18n();
  const locale = getCurrentLocale();

  // State Utama
  const [data, setData] = useState<ZakatData | null>(null);
  const [activeType, setActiveType] = useState<ZakatType>("profesi");
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [goldPrice, setGoldPrice] = useState(DEFAULT_GOLD_PRICE);
  const [isLoaded, setIsLoaded] = useState(false);

  // State Hasil Perhitungan Sementara (sebelum disimpan)
  const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null);
  const [nisabStatus, setNisabStatus] = useState<{
    reached: boolean;
    threshold: number;
  } | null>(null);

  // Definisi Input Field berdasarkan tipe zakat dengan i18n
  const INPUT_FIELDS = useMemo(
    () => ({
      profesi: [
        { key: "income_monthly", label: t("zakatCalculator.monthlyIncome"), icon: Wallet },
        { key: "bonus", label: t("zakatCalculator.bonus"), icon: TrendingUp },
        { key: "debt", label: t("zakatCalculator.debt"), icon: Coins },
      ],
      maal: [
        { key: "savings", label: t("zakatCalculator.savings"), icon: Wallet },
        { key: "gold_silver", label: t("zakatCalculator.goldSilver"), icon: Coins },
        { key: "assets", label: t("zakatCalculator.assets"), icon: TrendingUp },
        { key: "debt", label: t("zakatCalculator.debt"), icon: AlertCircle },
      ],
    }),
    [t]
  );

  // 1. Load Data dari LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setData(parsed);
        // Load state terakhir ke input form jika ada
        if (parsed.zakat_type) setActiveType(parsed.zakat_type);
        if (parsed.input_values) setInputs(parsed.input_values);
      } else {
        // Inisialisasi User ID baru jika kosong
        setData({
          user_id: generateUUID(),
          zakat_type: "profesi",
          input_values: {},
          total_result: 0,
          last_calculated: new Date().toISOString(),
        });
      }
      setIsLoaded(true);
    }
  }, []);

  // 2. Format Currency Helper
  const getLocaleString = () => {
    const localeMap: Record<string, string> = {
      id: "id-ID",
      en: "en-US",
      ar: "ar-SA",
      fr: "fr-FR",
      kr: "ko-KR",
      jp: "ja-JP",
    };
    return localeMap[locale] || "id-ID";
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat(getLocaleString(), {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // 3. Handle Input Change
  const handleInputChange = (key: string, value: string) => {
    // Hapus karakter non-digit untuk parsing
    const numericValue = parseInt(value.replace(/\D/g, "")) || 0;
    setInputs((prev) => ({
      ...prev,
      [key]: numericValue,
    }));
  };

  // 4. Logika Perhitungan Zakat
  const calculateZakat = () => {
    let totalHarta = 0;
    let pengurang = 0;
    let zakat = 0;
    let nisab = 0;
    let isNisabReached = false;

    if (activeType === "profesi") {
      // Zakat Profesi: Nisab setara 85gr emas per tahun atau 653kg gabah (~524kg beras)
      // Pendapat umum: 2.5% dari bruto jika mencapai nisab bulanan.
      // Nisab bulanan (asumsi setara 85gr emas / 12 bulan untuk simplifikasi cash basis,
      // atau menggunakan standar beras. Kita gunakan standar Emas 85gr / 12 bulan).

      const totalIncome = (inputs.income_monthly || 0) + (inputs.bonus || 0);
      pengurang = inputs.debt || 0;
      const bersih = totalIncome - pengurang;

      // Nisab Profesi (Bulanan): (85 gram * Harga Emas) / 12
      nisab = (85 * goldPrice) / 12;

      if (bersih >= nisab) {
        zakat = bersih * 0.025;
        isNisabReached = true;
      }
    } else if (activeType === "maal") {
      // Zakat Maal: Nisab 85gr Emas, Haul 1 tahun.
      totalHarta =
        (inputs.savings || 0) +
        (inputs.gold_silver || 0) +
        (inputs.assets || 0);
      pengurang = inputs.debt || 0;
      const bersih = totalHarta - pengurang;

      nisab = 85 * goldPrice;

      if (bersih >= nisab) {
        zakat = bersih * 0.025;
        isNisabReached = true;
      }
    }

    setCalculatedAmount(zakat);
    setNisabStatus({ reached: isNisabReached, threshold: nisab });

    // Update State Data Utama & Save to LocalStorage
    if (data) {
      const newData: ZakatData = {
        ...data,
        zakat_type: activeType,
        input_values: inputs,
        total_result: zakat,
        last_calculated: new Date().toISOString(),
      };
      setData(newData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    }
  };

  // 5. Reset Form
  const handleReset = () => {
    setInputs({});
    setCalculatedAmount(null);
    setNisabStatus(null);
  };

  if (!isLoaded) return null;

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
                  className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 text-awqaf-primary"
                >
                  <Navigation className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                {t("zakatCalculator.title")}
              </h1>
              <div className="w-10 h-10" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Type Selector */}
        <div className="grid grid-cols-2 gap-2 bg-white p-1 rounded-xl border border-awqaf-border-light shadow-sm">
          <button
            onClick={() => {
              setActiveType("profesi");
              setCalculatedAmount(null);
            }}
            className={`py-2 px-4 rounded-lg text-sm font-bold font-comfortaa transition-all duration-200 ${
              activeType === "profesi"
                ? "bg-awqaf-primary text-white shadow-md"
                : "text-awqaf-foreground-secondary hover:bg-accent-50"
            }`}
          >
            {t("zakatCalculator.zakatProfesi")}
          </button>
          <button
            onClick={() => {
              setActiveType("maal");
              setCalculatedAmount(null);
            }}
            className={`py-2 px-4 rounded-lg text-sm font-bold font-comfortaa transition-all duration-200 ${
              activeType === "maal"
                ? "bg-awqaf-primary text-white shadow-md"
                : "text-awqaf-foreground-secondary hover:bg-accent-50"
            }`}
          >
            {t("zakatCalculator.zakatMaal")}
          </button>
        </div>

        {/* Global Config (Gold Price) */}
        <Card className="border-awqaf-border-light bg-yellow-50/50">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-yellow-700">
              <Coins className="w-4 h-4" />
              <span className="text-xs font-bold font-comfortaa">
                {t("zakatCalculator.goldPricePerGram")}
              </span>
            </div>
            <div className="w-32">
              <Input
                type="text"
                className="h-8 text-right bg-white border-yellow-200 text-xs font-mono"
                value={goldPrice}
                onChange={(e) => setGoldPrice(parseInt(e.target.value) || 0)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Input Form */}
        <Card className="border-awqaf-border-light shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-comfortaa text-awqaf-foreground-secondary flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              {t("zakatCalculator.enterFinancialData")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {INPUT_FIELDS[activeType].map((field) => (
              <div key={field.key} className="space-y-1">
                <Label className="text-xs font-comfortaa text-gray-600">
                  {field.label}
                </Label>
                <div className="relative">
                  <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text" // Use text to allow formatting display if needed, but here simple parsing
                    inputMode="numeric"
                    placeholder="0"
                    className="pl-9 font-mono text-right focus-visible:ring-awqaf-primary"
                    value={
                      inputs[field.key]
                        ? inputs[field.key].toLocaleString(getLocaleString())
                        : ""
                    }
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                    {t("zakatCalculator.currency")}
                  </span>
                </div>
              </div>
            ))}

            <div className="pt-2 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 font-comfortaa"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4 mr-2" /> {t("zakatCalculator.reset")}
              </Button>
              <Button
                className="flex-[2] bg-awqaf-primary hover:bg-awqaf-primary/90 font-comfortaa"
                onClick={calculateZakat}
              >
                {t("zakatCalculator.calculateZakat")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result Display */}
        {calculatedAmount !== null && nisabStatus && (
          <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
            <Card
              className={`border-2 shadow-md ${
                nisabStatus.reached
                  ? "border-awqaf-primary bg-accent-50/50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <CardContent className="p-6 text-center space-y-4">
                {/* Status Header */}
                <div className="flex flex-col items-center gap-2">
                  {nisabStatus.reached ? (
                    <>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="font-bold text-green-700 font-comfortaa">
                        {t("zakatCalculator.zakatObligatory")}
                      </h3>
                      <p className="text-xs text-green-600 font-comfortaa">
                        {t("zakatCalculator.assetsReachedNisab")} (
                        {formatRupiah(nisabStatus.threshold)})
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-gray-500" />
                      </div>
                      <h3 className="font-bold text-gray-700 font-comfortaa">
                        {t("zakatCalculator.zakatNotObligatory")}
                      </h3>
                      <p className="text-xs text-gray-500 font-comfortaa">
                        {t("zakatCalculator.assetsNotReachedNisab")} (
                        {formatRupiah(nisabStatus.threshold)})
                      </p>
                    </>
                  )}
                </div>

                {/* Amount */}
                <div className="bg-white rounded-xl p-4 border border-dashed border-gray-300">
                  <p className="text-xs text-gray-500 font-comfortaa uppercase tracking-wider mb-1">
                    {t("zakatCalculator.totalZakatToPay")}
                  </p>
                  <p
                    className={`text-2xl font-bold font-comfortaa ${
                      nisabStatus.reached
                        ? "text-awqaf-primary"
                        : "text-gray-400"
                    }`}
                  >
                    {formatRupiah(calculatedAmount)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Last History */}
        {data && data.total_result > 0 && !calculatedAmount && (
          <Card className="border-awqaf-border-light bg-white/50">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-accent-100 p-2 rounded-lg">
                  <History className="w-5 h-5 text-awqaf-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-comfortaa">
                    {t("zakatCalculator.lastCalculated")}
                  </p>
                  <p className="text-sm font-bold text-gray-700 font-comfortaa">
                    {new Date(data.last_calculated).toLocaleDateString(
                      getLocaleString(),
                      { day: "numeric", month: "short", year: "numeric" }
                    )}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="mb-1 text-[10px]">
                  {data.zakat_type.toUpperCase()}
                </Badge>
                <p className="font-bold text-awqaf-primary font-comfortaa">
                  {formatRupiah(data.total_result)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}