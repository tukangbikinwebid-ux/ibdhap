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
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/app/hooks/useI18n";

// --- TIPE DATA ---
type ZakatType = "profesi" | "maal";
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface ZakatData {
  user_id: string;
  zakat_type: ZakatType;
  input_values: Record<string, number>;
  total_result: number;
  last_calculated: string;
}

interface ZakatTranslations {
  title: string;
  back: string; // Tambahan untuk tombol back
  monthlyIncome: string;
  bonus: string;
  debt: string;
  savings: string;
  goldSilver: string;
  assets: string;
  zakatProfesi: string;
  zakatMaal: string;
  goldPricePerGram: string;
  enterFinancialData: string;
  currency: string;
  reset: string;
  calculateZakat: string;
  zakatObligatory: string;
  assetsReachedNisab: string;
  zakatNotObligatory: string;
  assetsNotReachedNisab: string;
  totalZakatToPay: string;
  lastCalculated: string;
}

// --- KONSTANTA & TRANSLATION ---
const STORAGE_KEY = "zakat-calculator-data";
const DEFAULT_GOLD_PRICE = 1300000;

const ZAKAT_TEXT: Record<LocaleCode, ZakatTranslations> = {
  id: {
    title: "Kalkulator Zakat",
    back: "Kembali",
    monthlyIncome: "Penghasilan Bulanan",
    bonus: "Bonus / THR",
    debt: "Hutang / Cicilan",
    savings: "Tabungan / Deposito",
    goldSilver: "Emas / Perak (Gram)",
    assets: "Aset Investasi (Saham, dll)",
    zakatProfesi: "Zakat Profesi",
    zakatMaal: "Zakat Maal",
    goldPricePerGram: "Harga Emas / Gram (Rp)",
    enterFinancialData: "Masukkan Data Keuangan",
    currency: "IDR",
    reset: "Reset",
    calculateZakat: "Hitung Zakat",
    zakatObligatory: "Wajib Zakat",
    assetsReachedNisab: "Harta mencapai Nisab",
    zakatNotObligatory: "Tidak Wajib Zakat",
    assetsNotReachedNisab: "Harta belum mencapai Nisab",
    totalZakatToPay: "Total Zakat yang Harus Dikeluarkan",
    lastCalculated: "Terakhir Dihitung",
  },
  en: {
    title: "Zakat Calculator",
    back: "Back",
    monthlyIncome: "Monthly Income",
    bonus: "Bonus / Allowance",
    debt: "Debt / Installments",
    savings: "Savings / Deposits",
    goldSilver: "Gold / Silver (Gram)",
    assets: "Investment Assets (Stocks, etc)",
    zakatProfesi: "Profession Zakat",
    zakatMaal: "Wealth Zakat",
    goldPricePerGram: "Gold Price / Gram (IDR)",
    enterFinancialData: "Enter Financial Data",
    currency: "IDR",
    reset: "Reset",
    calculateZakat: "Calculate Zakat",
    zakatObligatory: "Zakat Obligatory",
    assetsReachedNisab: "Assets reached Nisab",
    zakatNotObligatory: "Zakat Not Obligatory",
    assetsNotReachedNisab: "Assets not reached Nisab",
    totalZakatToPay: "Total Zakat to Pay",
    lastCalculated: "Last Calculated",
  },
  ar: {
    title: "حاسبة الزكاة",
    back: "عودة",
    monthlyIncome: "الدخل الشهري",
    bonus: "مكافأة",
    debt: "ديون / أقساط",
    savings: "مدخرات / ودائع",
    goldSilver: "ذهب / فضة (جرام)",
    assets: "أصول استثمارية",
    zakatProfesi: "زكاة المهنة",
    zakatMaal: "زكاة المال",
    goldPricePerGram: "سعر الذهب / جرام",
    enterFinancialData: "أدخل البيانات المالية",
    currency: "روبية",
    reset: "إعادة ضبط",
    calculateZakat: "حساب الزكاة",
    zakatObligatory: "تجب الزكاة",
    assetsReachedNisab: "المال بلغ النصاب",
    zakatNotObligatory: "لا تجب الزكاة",
    assetsNotReachedNisab: "المال لم يبلغ النصاب",
    totalZakatToPay: "إجمالي الزكاة المستحقة",
    lastCalculated: "آخر حساب",
  },
  fr: {
    title: "Calculateur de Zakat",
    back: "Retour",
    monthlyIncome: "Revenu Mensuel",
    bonus: "Bonus",
    debt: "Dettes / Mensualités",
    savings: "Épargne / Dépôts",
    goldSilver: "Or / Argent (Grammes)",
    assets: "Actifs d'Investissement",
    zakatProfesi: "Zakat Professionnelle",
    zakatMaal: "Zakat sur la Richesse",
    goldPricePerGram: "Prix de l'Or / Gramme",
    enterFinancialData: "Entrer les Données Financières",
    currency: "IDR",
    reset: "Réinitialiser",
    calculateZakat: "Calculer la Zakat",
    zakatObligatory: "Zakat Obligatoire",
    assetsReachedNisab: "Les actifs ont atteint le Nisab",
    zakatNotObligatory: "Zakat Non Obligatoire",
    assetsNotReachedNisab: "Les actifs n'ont pas atteint le Nisab",
    totalZakatToPay: "Total Zakat à Payer",
    lastCalculated: "Dernier Calcul",
  },
  kr: {
    title: "자카트 계산기",
    back: "뒤로",
    monthlyIncome: "월 소득",
    bonus: "보너스",
    debt: "부채 / 할부",
    savings: "저축 / 예금",
    goldSilver: "금 / 은 (그램)",
    assets: "투자 자산",
    zakatProfesi: "직업 자카트",
    zakatMaal: "재산 자카트",
    goldPricePerGram: "금 가격 / 그램",
    enterFinancialData: "재무 데이터 입력",
    currency: "IDR",
    reset: "초기화",
    calculateZakat: "자카트 계산",
    zakatObligatory: "자카트 의무",
    assetsReachedNisab: "자산이 니사브에 도달함",
    zakatNotObligatory: "자카트 의무 없음",
    assetsNotReachedNisab: "자산이 니사브에 도달하지 않음",
    totalZakatToPay: "지불할 총 자카트",
    lastCalculated: "마지막 계산",
  },
  jp: {
    title: "ザカート計算機",
    back: "戻る",
    monthlyIncome: "月収",
    bonus: "ボーナス",
    debt: "借金 / 分割払い",
    savings: "貯蓄 / 預金",
    goldSilver: "金 / 銀 (グラム)",
    assets: "投資資産",
    zakatProfesi: "職業ザカート",
    zakatMaal: "財産ザカート",
    goldPricePerGram: "金価格 / グラム",
    enterFinancialData: "財務データを入力",
    currency: "IDR",
    reset: "リセット",
    calculateZakat: "ザカートを計算",
    zakatObligatory: "ザカート義務あり",
    assetsReachedNisab: "資産がニサーブに達しました",
    zakatNotObligatory: "ザカート義務なし",
    assetsNotReachedNisab: "資産がニサーブに達していません",
    totalZakatToPay: "支払うべきザカート総額",
    lastCalculated: "最終計算",
  },
};

// Helper function untuk generate unique ID
const generateUUID = (): string => {
  if (
    typeof window !== "undefined" &&
    window.crypto &&
    window.crypto.randomUUID
  ) {
    return window.crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export default function ZakatCalculatorPage() {
  const { locale } = useI18n();
  // Safe Locale Access
  const safeLocale = (
    ZAKAT_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = ZAKAT_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  // State Utama
  const [data, setData] = useState<ZakatData | null>(null);
  const [activeType, setActiveType] = useState<ZakatType>("profesi");
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [goldPrice, setGoldPrice] = useState(DEFAULT_GOLD_PRICE);
  const [isLoaded, setIsLoaded] = useState(false);

  // State Hasil Perhitungan Sementara
  const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null);
  const [nisabStatus, setNisabStatus] = useState<{
    reached: boolean;
    threshold: number;
  } | null>(null);

  // Definisi Input Field berdasarkan tipe zakat
  const INPUT_FIELDS = useMemo(
    () => ({
      profesi: [
        { key: "income_monthly", label: t.monthlyIncome, icon: Wallet },
        { key: "bonus", label: t.bonus, icon: TrendingUp },
        { key: "debt", label: t.debt, icon: Coins },
      ],
      maal: [
        { key: "savings", label: t.savings, icon: Wallet },
        { key: "gold_silver", label: t.goldSilver, icon: Coins },
        { key: "assets", label: t.assets, icon: TrendingUp },
        { key: "debt", label: t.debt, icon: AlertCircle },
      ],
    }),
    [t],
  );

  // 1. Load Data dari LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setData(parsed);
        if (parsed.zakat_type) setActiveType(parsed.zakat_type);
        if (parsed.input_values) setInputs(parsed.input_values);
      } else {
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
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // 3. Handle Input Change
  const handleInputChange = (key: string, value: string) => {
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
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              {/* TOMBOL BACK */}
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-10 h-10 p-0 rounded-full hover:bg-accent-100 text-awqaf-primary ${
                    isRtl ? "rotate-180" : ""
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>

              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                {t.title}
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
            {t.zakatProfesi}
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
            {t.zakatMaal}
          </button>
        </div>

        {/* Global Config (Gold Price) */}
        <Card className="border-awqaf-border-light bg-yellow-50/50">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-yellow-700">
              <Coins className="w-4 h-4" />
              <span className="text-xs font-bold font-comfortaa">
                {t.goldPricePerGram}
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
              {t.enterFinancialData}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {INPUT_FIELDS[activeType].map((field) => (
              <div key={field.key} className="space-y-1">
                <Label className="text-xs font-comfortaa text-gray-600">
                  {field.label}
                </Label>
                <div className="relative">
                  <field.icon
                    className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${
                      isRtl ? "right-3" : "left-3"
                    }`}
                  />
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    className={`font-mono text-right focus-visible:ring-awqaf-primary ${
                      isRtl ? "pr-9 pl-9" : "pl-9 pr-9"
                    }`}
                    value={
                      inputs[field.key]
                        ? inputs[field.key].toLocaleString("id-ID")
                        : ""
                    }
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                  />
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none ${
                      isRtl ? "left-3" : "right-3"
                    }`}
                  >
                    {t.currency}
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
                <RotateCcw className={`w-4 h-4 ${isRtl ? "ml-2" : "mr-2"}`} />{" "}
                {t.reset}
              </Button>
              <Button
                className="flex-[2] bg-awqaf-primary hover:bg-awqaf-primary/90 font-comfortaa"
                onClick={calculateZakat}
              >
                {t.calculateZakat}
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
                        {t.zakatObligatory}
                      </h3>
                      <p className="text-xs text-green-600 font-comfortaa">
                        {t.assetsReachedNisab} (
                        {formatRupiah(nisabStatus.threshold)})
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-gray-500" />
                      </div>
                      <h3 className="font-bold text-gray-700 font-comfortaa">
                        {t.zakatNotObligatory}
                      </h3>
                      <p className="text-xs text-gray-500 font-comfortaa">
                        {t.assetsNotReachedNisab} (
                        {formatRupiah(nisabStatus.threshold)})
                      </p>
                    </>
                  )}
                </div>

                {/* Amount */}
                <div className="bg-white rounded-xl p-4 border border-dashed border-gray-300">
                  <p className="text-xs text-gray-500 font-comfortaa uppercase tracking-wider mb-1">
                    {t.totalZakatToPay}
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
                    {t.lastCalculated}
                  </p>
                  <p className="text-sm font-bold text-gray-700 font-comfortaa">
                    {new Date(data.last_calculated).toLocaleDateString(
                      "id-ID",
                      { day: "numeric", month: "short", year: "numeric" },
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