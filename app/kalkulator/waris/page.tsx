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
} from "lucide-react";
import Link from "next/link";

// --- TIPE DATA ---
interface HeirInput {
  type: "husband" | "wife" | "son" | "daughter" | "father" | "mother";
  label: string;
  count: number;
}

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

const STORAGE_KEY = "kalkulator-waris-data";

export default function WarisCalculatorPage() {
  const [totalHarta, setTotalHarta] = useState<string>("");
  // Default: Meninggal Laki-laki (ada Istri), Meninggal Perempuan (ada Suami)
  const [deceasedGender, setDeceasedGender] = useState<"male" | "female">(
    "male"
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
        heir_type: "Istri",
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
        heir_type: "Suami",
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
      // Simplifikasi: Ibu dapat 1/6 jika ada anak atau saudara jamak (disini asumsi anak saja)
      // Jika tidak ada anak, Ibu dapat 1/3 (atau 1/3 sisa pada kasus Umariyatain - diskip untuk simplifikasi)
      const fraction = hasChildren ? 1 / 6 : 1 / 3;
      const label = hasChildren ? "1/6" : "1/3";
      shares.push({
        heir_type: "Ibu",
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
      // Ayah dapat 1/6 jika ada keturunan laki-laki
      // Ayah dapat 1/6 + Sisa jika hanya ada keturunan perempuan
      // Ayah dapat Sisa (Asabah) jika tidak ada keturunan
      if (hasMaleDescendant) {
        const fraction = 1 / 6;
        shares.push({
          heir_type: "Ayah",
          count: 1,
          share_fraction: "1/6",
          share_percentage: fraction * 100,
          total_amount: harta * fraction,
          amount_per_person: harta * fraction,
        });
        currentShareUsed += fraction;
      } else if (!hasChildren) {
        // Akan dihandle di Asabah (Sisa) nanti
        // Placeholder agar urutan render bagus
      } else {
        // Ada anak perempuan saja -> 1/6 dulu, nanti tambah sisa
        const fraction = 1 / 6;
        shares.push({
          heir_type: "Ayah",
          count: 1,
          share_fraction: "1/6 + Asabah",
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
        heir_type: "Anak Perempuan",
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
    const sisaHarta = remainingAmount;

    // Kasus Asabah Bil Ghair (Anak Laki + Anak Perempuan) atau Asabah Binafsihi (Anak Laki, atau Ayah jika tak ada anak)

    if (heirs.son > 0) {
      // Sisa dibagi: Anak Laki 2 bagian, Anak Perempuan 1 bagian
      const totalParts = heirs.son * 2 + heirs.daughter;
      const onePartValue = remainingAmount / totalParts;

      shares.push({
        heir_type: "Anak Laki-laki (Asabah)",
        count: heirs.son,
        share_fraction: "Sisa 2:1",
        share_percentage: 0, // Dinamis
        total_amount: onePartValue * 2 * heirs.son,
        amount_per_person: onePartValue * 2,
      });

      if (heirs.daughter > 0) {
        shares.push({
          heir_type: "Anak Perempuan (Asabah)",
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
      // Jika tadi sudah dapat 1/6 (karena ada anak pr), ini tambahan. Jika belum, ini semua sisa.
      const existingFatherIndex = shares.findIndex(
        (s) => s.heir_type === "Ayah"
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
          heir_type: "Ayah (Asabah)",
          count: 1,
          share_fraction: "Sisa",
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
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
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
                Kalkulator Waris
              </h1>
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
              <Banknote className="w-4 h-4" /> Informasi Harta & Pewaris
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs mb-1 block">
                Jenis Kelamin Pewaris (Yang Meninggal)
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={deceasedGender === "male" ? "default" : "outline"}
                  className={
                    deceasedGender === "male" ? "bg-awqaf-primary" : ""
                  }
                  onClick={() => handleGenderSwitch("male")}
                >
                  Laki-laki
                </Button>
                <Button
                  variant={deceasedGender === "female" ? "default" : "outline"}
                  className={
                    deceasedGender === "female" ? "bg-awqaf-primary" : ""
                  }
                  onClick={() => handleGenderSwitch("female")}
                >
                  Perempuan
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-xs mb-1 block">
                Total Harta Warisan (Rp)
              </Label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Contoh: 100.000.000"
                className="font-mono text-lg"
                value={
                  totalHarta
                    ? parseInt(totalHarta.replace(/\D/g, "")).toLocaleString(
                        "id-ID"
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
              <Users className="w-4 h-4" /> Ahli Waris
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { id: "father", label: "Ayah", max: 1 },
              { id: "mother", label: "Ibu", max: 1 },
              {
                id: deceasedGender === "male" ? "wife" : "husband",
                label: deceasedGender === "male" ? "Istri" : "Suami",
                max: deceasedGender === "male" ? 4 : 1,
              },
              { id: "son", label: "Anak Laki-laki", max: 20 },
              { id: "daughter", label: "Anak Perempuan", max: 20 },
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
              <Calculator className="w-4 h-4 mr-2" /> Hitung Pembagian
            </Button>
          </CardContent>
        </Card>

        {/* Step 3: Result */}
        {result && (
          <div className="animate-in slide-in-from-bottom-4 fade-in">
            <div className="flex items-center justify-between mb-2 px-1">
              <h3 className="font-bold text-awqaf-primary font-comfortaa">
                Hasil Perhitungan
              </h3>
              <Badge variant="outline" className="text-xs">
                Total: {formatRupiah(result.total_inheritance)}
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
                              {item.count} Orang
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="secondary"
                            className="text-[10px] h-5"
                          >
                            Bagian: {item.share_fraction}
                          </Badge>
                          {item.heir_type.includes("Asabah") && (
                            <Badge
                              variant="outline"
                              className="text-[10px] h-5 border-yellow-500 text-yellow-600 bg-yellow-50"
                            >
                              Sisa Harta
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 font-comfortaa">
                          Per orang
                        </p>
                        <p className="font-bold text-awqaf-primary font-comfortaa text-lg">
                          {formatRupiah(item.amount_per_person)}
                        </p>
                      </div>
                    </div>
                    {item.count > 1 && (
                      <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                        <span>Total Golongan:</span>
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
                        Sisa Harta (Radd)
                      </p>
                      <p className="text-xs text-teal-600">
                        Terdapat sisa harta yang tidak habis dibagi oleh Ashabul
                        Furud. Sisa ini {formatRupiah(result.surplus_radd)}{" "}
                        biasanya dikembalikan ke ahli waris nasab sebanding
                        bagian mereka.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Disclaimer */}
              <p className="text-[10px] text-center text-gray-400 mt-4 px-4 leading-tight">
                *Perhitungan ini menggunakan simulasi dasar untuk keluarga inti.
                Untuk kasus kompleks (Kakek, Nenek, Saudara, Kalalah), mohon
                konsultasikan dengan Ulama atau ahli waris terpercaya.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}