"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Users,
  Calculator,
  RotateCcw,
  Navigation,
  Banknote,
  Info,
  ChevronDown,
  ChevronUp,
  UserCheck,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/app/hooks/useI18n";

// --- TIPE DATA ---
interface ShareResult {
  heir_type: string;
  count: number;
  share_fraction: string; // e.g. "1/8"
  share_percentage: number; // e.g. 12.5
  total_amount: number; // Total for this group
  amount_per_person: number; // Amount for individual
}

interface WarisData {
  total_inheritance: number;
  heirs_list: Record<string, number>; // JSON storage: { wife: 1, son: 2 }
  share_per_person: ShareResult[];
  surplus_radd: number; // Sisa harta (jika ada)
}

type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface InheritanceTranslations {
  title: string;
  back: string; // Tambahan untuk tombol back
  inheritanceInfo: string;
  deceasedGender: string;
  male: string;
  female: string;
  totalInheritance: string;
  heirs: string;
  father: string;
  mother: string;
  wife: string;
  husband: string;
  son: string;
  daughter: string;
  calculate: string;
  calculationResult: string;
  total: string;
  people: string;
  share: string;
  remaining: string;
  perPerson: string;
  totalGroup: string;
  remainingInheritance: string;
  remainingDescription: string;
  disclaimer: string;
}

const INHERITANCE_TEXT: Record<LocaleCode, InheritanceTranslations> = {
  id: {
    title: "Kalkulator Waris",
    back: "Kembali",
    inheritanceInfo: "Informasi Harta Warisan",
    deceasedGender: "Jenis Kelamin Almarhum/ah",
    male: "Laki-laki",
    female: "Perempuan",
    totalInheritance: "Total Harta Bersih (Rp)",
    heirs: "Ahli Waris",
    father: "Ayah",
    mother: "Ibu",
    wife: "Istri",
    husband: "Suami",
    son: "Anak Laki-laki",
    daughter: "Anak Perempuan",
    calculate: "Hitung Pembagian",
    calculationResult: "Hasil Perhitungan",
    total: "Total",
    people: "Orang",
    share: "Bagian",
    remaining: "Sisa (Asabah)",
    perPerson: "Per Orang",
    totalGroup: "Total Kelompok",
    remainingInheritance: "Sisa Harta / Radd",
    remainingDescription:
      "Harta ini dikembalikan kepada ahli waris nasab (selain suami/istri) secara proporsional.",
    disclaimer:
      "*Perhitungan ini adalah simulasi awal berdasarkan hukum faraid umum. Untuk kasus kompleks, silakan konsultasi dengan ulama/ahli waris.",
  },
  en: {
    title: "Inheritance Calculator",
    back: "Back",
    inheritanceInfo: "Inheritance Information",
    deceasedGender: "Gender of Deceased",
    male: "Male",
    female: "Female",
    totalInheritance: "Total Net Assets",
    heirs: "Heirs",
    father: "Father",
    mother: "Mother",
    wife: "Wife",
    husband: "Husband",
    son: "Son",
    daughter: "Daughter",
    calculate: "Calculate Share",
    calculationResult: "Calculation Result",
    total: "Total",
    people: "People",
    share: "Share",
    remaining: "Residuary (Asabah)",
    perPerson: "Per Person",
    totalGroup: "Group Total",
    remainingInheritance: "Remaining / Radd",
    remainingDescription:
      "This remainder is returned to blood relatives (excluding spouse) proportionally.",
    disclaimer:
      "*This calculation is a preliminary simulation based on general faraid laws. For complex cases, please consult a scholar.",
  },
  ar: {
    title: "حاسبة المواريث",
    back: "عودة",
    inheritanceInfo: "معلومات التركة",
    deceasedGender: "جنس المتوفى",
    male: "ذكر",
    female: "أنثى",
    totalInheritance: "إجمالي التركة الصافية",
    heirs: "الورثة",
    father: "أب",
    mother: "أم",
    wife: "زوجة",
    husband: "زوج",
    son: "ابن",
    daughter: "بنت",
    calculate: "احسب القسمة",
    calculationResult: "نتيجة الحساب",
    total: "المجموع",
    people: "أشخاص",
    share: "الحصة",
    remaining: "العصبة",
    perPerson: "للشخص الواحد",
    totalGroup: "مجموع المجموعة",
    remainingInheritance: "الباقي / الرد",
    remainingDescription:
      "يُرد هذا الباقي إلى ذوي الأرحام (غير الزوجين) نسبيًا.",
    disclaimer:
      "*هذا الحساب هو محاكاة أولية بناءً على قوانين الفرائض العامة. للحالات المعقدة، يرجى استشارة عالم.",
  },
  fr: {
    title: "Calculateur d'Héritage",
    back: "Retour",
    inheritanceInfo: "Informations sur l'Héritage",
    deceasedGender: "Sexe du Défunt",
    male: "Homme",
    female: "Femme",
    totalInheritance: "Total des Actifs Nets",
    heirs: "Héritiers",
    father: "Père",
    mother: "Mère",
    wife: "Épouse",
    husband: "Mari",
    son: "Fils",
    daughter: "Fille",
    calculate: "Calculer le Partage",
    calculationResult: "Résultat du Calcul",
    total: "Total",
    people: "Personnes",
    share: "Part",
    remaining: "Résiduaire (Asabah)",
    perPerson: "Par Personne",
    totalGroup: "Total du Groupe",
    remainingInheritance: "Restant / Radd",
    remainingDescription:
      "Ce reste est restitué aux parents par le sang (hors conjoint) proportionnellement.",
    disclaimer:
      "*Ce calcul est une simulation préliminaire basée sur les lois générales du faraid. Pour les cas complexes, veuillez consulter un érudit.",
  },
  kr: {
    title: "상속 계산기",
    back: "뒤로",
    inheritanceInfo: "상속 정보",
    deceasedGender: "고인의 성별",
    male: "남성",
    female: "여성",
    totalInheritance: "총 순자산",
    heirs: "상속인",
    father: "아버지",
    mother: "어머니",
    wife: "아내",
    husband: "남편",
    son: "아들",
    daughter: "딸",
    calculate: "분배 계산",
    calculationResult: "계산 결과",
    total: "합계",
    people: "명",
    share: "지분",
    remaining: "나머지 (아사바)",
    perPerson: "1인당",
    totalGroup: "그룹 합계",
    remainingInheritance: "잔여 / 라드",
    remainingDescription:
      "이 잔여금은 배우자를 제외한 혈족에게 비례적으로 반환됩니다.",
    disclaimer:
      "*이 계산은 일반적인 파라이다 법에 근거한 예비 시뮬레이션입니다. 복잡한 경우에는 학자와 상담하십시오.",
  },
  jp: {
    title: "相続計算機",
    back: "戻る",
    inheritanceInfo: "相続情報",
    deceasedGender: "故人の性別",
    male: "男性",
    female: "女性",
    totalInheritance: "純資産合計",
    heirs: "相続人",
    father: "父",
    mother: "母",
    wife: "妻",
    husband: "夫",
    son: "息子",
    daughter: "娘",
    calculate: "分配を計算",
    calculationResult: "計算結果",
    total: "合計",
    people: "人",
    share: "取り分",
    remaining: "残余 (アサバ)",
    perPerson: "一人当たり",
    totalGroup: "グループ合計",
    remainingInheritance: "残り / ラッド",
    remainingDescription:
      "この残りは配偶者を除く血縁者に比例して返還されます。",
    disclaimer:
      "*この計算は一般的なファライド法に基づく予備的なシミュレーションです。複雑なケースについては、学者にご相談ください。",
  },
};

const STORAGE_KEY = "kalkulator-waris-data";

export default function WarisCalculatorPage() {
  const { locale } = useI18n();
  // Safe Locale Access
  const safeLocale = (
    INHERITANCE_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = INHERITANCE_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  const [totalHarta, setTotalHarta] = useState<string>("");
  // Default: Meninggal Laki-laki (ada Istri), Meninggal Perempuan (ada Suami)
  const [deceasedGender, setDeceasedGender] = useState<"male" | "female">(
    "male",
  );

  const [heirs, setHeirs] = useState<Record<string, number>>({
    husband: 0,
    wife: 0,
    father: 0,
    mother: 0,
    son: 0,
    daughter: 0,
  });

  const [result, setResult] = useState<WarisData | null>(null);

  // Load Data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Restore basic state for UI
      setTotalHarta(parsed.total_inheritance.toString());
      setHeirs(parsed.heirs_list);
      setResult(parsed);

      // Auto detect gender based on history
      if (parsed.heirs_list.husband > 0) setDeceasedGender("female");
      else if (parsed.heirs_list.wife > 0) setDeceasedGender("male");
    }
  }, []);

  // Update Heirs Count
  const updateHeirCount = (type: string, delta: number) => {
    setHeirs((prev) => {
      const current = prev[type] || 0;
      const newVal = Math.max(0, current + delta);

      // Constraint: Hanya boleh 1 Ayah, 1 Ibu, 1 Suami
      if (["father", "mother", "husband"].includes(type) && newVal > 1)
        return prev;
      // Constraint: Max 4 Istri
      if (type === "wife" && newVal > 4) return prev;

      return { ...prev, [type]: newVal };
    });
  };

  // Switch Gender may reset Spouse
  const handleGenderSwitch = (gender: "male" | "female") => {
    setDeceasedGender(gender);
    setHeirs((prev) => ({
      ...prev,
      husband: 0,
      wife: 0,
    }));
    setResult(null);
  };

  // --- CORE LOGIC FARAID (SIMPLIFIED) ---
  const calculateWaris = () => {
    const harta = parseFloat(totalHarta.replace(/\D/g, "")) || 0;
    const hasChildren = heirs.son > 0 || heirs.daughter > 0;
    const hasMaleDescendant = heirs.son > 0;

    const shares: ShareResult[] = [];
    let currentShareUsed = 0; // Dalam bentuk desimal (0.0 - 1.0)

    // 1. Hitung Ashabul Furud (Bagian Pasti)

    // Pasangan
    if (deceasedGender === "male" && heirs.wife > 0) {
      const fraction = hasChildren ? 1 / 8 : 1 / 4;
      const label = hasChildren ? "1/8" : "1/4";
      shares.push({
        heir_type: t.wife, // Use translation
        count: heirs.wife,
        share_fraction: label,
        share_percentage: fraction * 100,
        total_amount: harta * fraction,
        amount_per_person: (harta * fraction) / heirs.wife,
      });
      currentShareUsed += fraction;
    } else if (deceasedGender === "female" && heirs.husband > 0) {
      const fraction = hasChildren ? 1 / 4 : 1 / 2;
      const label = hasChildren ? "1/4" : "1/2";
      shares.push({
        heir_type: t.husband, // Use translation
        count: 1,
        share_fraction: label,
        share_percentage: fraction * 100,
        total_amount: harta * fraction,
        amount_per_person: harta * fraction,
      });
      currentShareUsed += fraction;
    }

    // Ibu
    if (heirs.mother > 0) {
      const fraction = hasChildren ? 1 / 6 : 1 / 3;
      const label = hasChildren ? "1/6" : "1/3";
      shares.push({
        heir_type: t.mother, // Use translation
        count: 1,
        share_fraction: label,
        share_percentage: fraction * 100,
        total_amount: harta * fraction,
        amount_per_person: harta * fraction,
      });
      currentShareUsed += fraction;
    }

    // Ayah
    if (heirs.father > 0) {
      if (hasMaleDescendant) {
        const fraction = 1 / 6;
        shares.push({
          heir_type: t.father, // Use translation
          count: 1,
          share_fraction: "1/6",
          share_percentage: fraction * 100,
          total_amount: harta * fraction,
          amount_per_person: harta * fraction,
        });
        currentShareUsed += fraction;
      } else if (!hasChildren) {
        // Akan dihandle di Asabah (Sisa) nanti
      } else {
        // Ada anak perempuan saja -> 1/6 dulu, nanti tambah sisa
        const fraction = 1 / 6;
        shares.push({
          heir_type: t.father, // Use translation
          count: 1,
          share_fraction: "1/6 + " + t.remaining,
          share_percentage: fraction * 100,
          total_amount: harta * fraction,
          amount_per_person: harta * fraction,
        });
        currentShareUsed += fraction;
      }
    }

    // Anak Perempuan (Jika tunggal & tidak ada anak laki)
    if (heirs.daughter > 0 && heirs.son === 0) {
      const fraction = heirs.daughter === 1 ? 1 / 2 : 2 / 3;
      const label = heirs.daughter === 1 ? "1/2" : "2/3";
      shares.push({
        heir_type: t.daughter, // Use translation
        count: heirs.daughter,
        share_fraction: label,
        share_percentage: fraction * 100,
        total_amount: harta * fraction,
        amount_per_person: (harta * fraction) / heirs.daughter,
      });
      currentShareUsed += fraction;
    }

    // 2. Hitung Sisa (Asabah)
    let remainingAmount = Math.max(0, harta - harta * currentShareUsed);

    // Kasus Asabah Bil Ghair (Anak Laki + Anak Perempuan) atau Asabah Binafsihi (Anak Laki, atau Ayah jika tak ada anak)

    if (heirs.son > 0) {
      // Sisa dibagi: Anak Laki 2 bagian, Anak Perempuan 1 bagian
      const totalParts = heirs.son * 2 + heirs.daughter;
      const onePartValue = remainingAmount / totalParts;

      shares.push({
        heir_type: `${t.son} (${t.remaining})`,
        count: heirs.son,
        share_fraction: "Sisa 2:1",
        share_percentage: 0, // Dinamis
        total_amount: onePartValue * 2 * heirs.son,
        amount_per_person: onePartValue * 2,
      });

      if (heirs.daughter > 0) {
        shares.push({
          heir_type: `${t.daughter} (${t.remaining})`,
          count: heirs.daughter,
          share_fraction: "Sisa 2:1",
          share_percentage: 0,
          total_amount: onePartValue * heirs.daughter,
          amount_per_person: onePartValue,
        });
      }
      remainingAmount = 0; // Habis dibagi asabah
    } else if (heirs.father > 0 && !hasMaleDescendant) {
      // Ayah mengambil sisa (Asabah)
      const existingFatherIndex = shares.findIndex(
        (s) => s.heir_type === t.father,
      );

      if (existingFatherIndex >= 0) {
        // Update Ayah (1/6 + Sisa)
        const currentAyah = shares[existingFatherIndex];
        shares[existingFatherIndex] = {
          ...currentAyah,
          total_amount: currentAyah.total_amount + remainingAmount,
          amount_per_person: currentAyah.amount_per_person + remainingAmount,
        };
      } else {
        // Ayah Full Asabah
        shares.push({
          heir_type: `${t.father} (${t.remaining})`,
          count: 1,
          share_fraction: t.remaining,
          share_percentage: (remainingAmount / harta) * 100,
          total_amount: remainingAmount,
          amount_per_person: remainingAmount,
        });
      }
      remainingAmount = 0;
    }

    // 3. Finalisasi Data
    const resultData: WarisData = {
      total_inheritance: harta,
      heirs_list: heirs,
      share_per_person: shares,
      surplus_radd: remainingAmount, // Harta yang benar-benar tidak terbagi (Radd)
    };

    setResult(resultData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resultData));
  };

  // UI Helpers
  const formatRupiah = (val: string | number) => {
    const num = typeof val === "string" ? parseInt(val) : val;
    // Format mata uang bisa disesuaikan dengan locale jika perlu,
    // tapi IDR adalah standar di Indonesia.
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
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

              {/* Tombol Reset */}
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 text-awqaf-primary"
                onClick={() => {
                  setHeirs({
                    wife: 0,
                    husband: 0,
                    son: 0,
                    daughter: 0,
                    father: 0,
                    mother: 0,
                  });
                  setResult(null);
                  setTotalHarta("");
                }}
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Step 1: Input Harta & Gender */}
        <Card className="border-awqaf-border-light">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-comfortaa text-awqaf-foreground-secondary flex items-center gap-2">
              <Banknote className="w-4 h-4" /> {t.inheritanceInfo}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs mb-1 block">{t.deceasedGender}</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={deceasedGender === "male" ? "default" : "outline"}
                  className={
                    deceasedGender === "male" ? "bg-awqaf-primary" : ""
                  }
                  onClick={() => handleGenderSwitch("male")}
                >
                  {t.male}
                </Button>
                <Button
                  variant={deceasedGender === "female" ? "default" : "outline"}
                  className={
                    deceasedGender === "female" ? "bg-awqaf-primary" : ""
                  }
                  onClick={() => handleGenderSwitch("female")}
                >
                  {t.female}
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-xs mb-1 block">{t.totalInheritance}</Label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Contoh: 100.000.000"
                className="font-mono text-lg"
                value={
                  totalHarta
                    ? parseInt(totalHarta.replace(/\D/g, "")).toLocaleString(
                        "id-ID",
                      )
                    : ""
                }
                onChange={(e) =>
                  setTotalHarta(e.target.value.replace(/\D/g, ""))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Ahli Waris */}
        <Card className="border-awqaf-border-light">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-comfortaa text-awqaf-foreground-secondary flex items-center gap-2">
              <Users className="w-4 h-4" /> {t.heirs}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { id: "father", label: t.father, max: 1 },
              { id: "mother", label: t.mother, max: 1 },
              {
                id: deceasedGender === "male" ? "wife" : "husband",
                label: deceasedGender === "male" ? t.wife : t.husband,
                max: deceasedGender === "male" ? 4 : 1,
              },
              { id: "son", label: t.son, max: 20 },
              { id: "daughter", label: t.daughter, max: 20 },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100"
              >
                <span className="text-sm font-medium font-comfortaa text-gray-700">
                  {item.label}
                </span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateHeirCount(item.id, -1)}
                    disabled={heirs[item.id] === 0}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <span className="w-4 text-center font-mono font-bold">
                    {heirs[item.id]}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateHeirCount(item.id, 1)}
                    disabled={heirs[item.id] >= item.max}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button
              className="w-full mt-4 bg-awqaf-primary font-comfortaa"
              onClick={calculateWaris}
            >
              <Calculator className="w-4 h-4 mr-2" /> {t.calculate}
            </Button>
          </CardContent>
        </Card>

        {/* Step 3: Result */}
        {result && (
          <div className="animate-in slide-in-from-bottom-4 fade-in">
            <div className="flex items-center justify-between mb-2 px-1">
              <h3 className="font-bold text-awqaf-primary font-comfortaa">
                {t.calculationResult}
              </h3>
              <Badge variant="outline" className="text-xs">
                {t.total} {formatRupiah(result.total_inheritance)}
              </Badge>
            </div>

            <div className="space-y-3">
              {result.share_per_person.map((item, idx) => (
                <Card
                  key={idx}
                  className="border-l-4 border-l-awqaf-primary border-y-awqaf-border-light border-r-awqaf-border-light shadow-sm overflow-hidden"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-800 font-comfortaa">
                            {item.heir_type}
                          </h4>
                          {item.count > 1 && (
                            <Badge className="bg-accent-100 text-awqaf-primary hover:bg-accent-200 border-0 text-[10px]">
                              {item.count} {t.people}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="secondary"
                            className="text-[10px] h-5"
                          >
                            {t.share} {item.share_fraction}
                          </Badge>
                          {item.heir_type.includes("Asabah") && (
                            <Badge
                              variant="outline"
                              className="text-[10px] h-5 border-yellow-500 text-yellow-600 bg-yellow-50"
                            >
                              {t.remaining}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 font-comfortaa">
                          {t.perPerson}
                        </p>
                        <p className="font-bold text-awqaf-primary font-comfortaa text-lg">
                          {formatRupiah(item.amount_per_person)}
                        </p>
                      </div>
                    </div>
                    {item.count > 1 && (
                      <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                        <span>{t.totalGroup}</span>
                        <span className="font-mono font-medium">
                          {formatRupiah(item.total_amount)}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Radd / Surplus Display */}
              {result.surplus_radd > 100 && (
                <Card className="bg-teal-50 border-teal-200">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="bg-teal-100 p-2 rounded-full">
                      <Info className="w-5 h-5 text-teal-700" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-teal-800 font-comfortaa">
                        {t.remainingInheritance}
                      </p>
                      <p className="text-xs text-teal-600">
                        {t.remainingDescription}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Disclaimer */}
              <p className="text-[10px] text-center text-gray-400 mt-4 px-4 leading-tight">
                {t.disclaimer}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}