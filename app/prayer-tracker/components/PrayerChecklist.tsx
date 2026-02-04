"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useI18n } from "@/app/hooks/useI18n";

// 1. Definisikan tipe Locale dan Translation
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface ChecklistTranslations {
  title: string;
  subtitle: string;
  status: {
    completed: string;
    current: string;
    passed: string;
    pending: string;
  };
  instructionTitle: string;
  instruction1: string;
  instruction2: string;
  prayerNames: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
}

// 2. Dictionary Translation
const CHECKLIST_TEXT: Record<LocaleCode, ChecklistTranslations> = {
  id: {
    title: "Checklist Sholat",
    subtitle: "Tandai sholat yang sudah dikerjakan",
    status: {
      completed: "Selesai",
      current: "Waktunya",
      passed: "Terlewat",
      pending: "Belum Waktunya",
    },
    instructionTitle: "Petunjuk:",
    instruction1:
      "Anda bisa menandai sholat yang sudah waktunya atau yang sudah lewat.",
    instruction2: "Klik pada sholat yang sudah dikerjakan untuk menandainya.",
    prayerNames: {
      fajr: "Subuh",
      dhuhr: "Dzuhur",
      asr: "Ashar",
      maghrib: "Maghrib",
      isha: "Isya",
    },
  },
  en: {
    title: "Prayer Checklist",
    subtitle: "Mark completed prayers",
    status: {
      completed: "Completed",
      current: "Time to Pray",
      passed: "Passed",
      pending: "Upcoming",
    },
    instructionTitle: "Hint:",
    instruction1: "You can mark prayers that are current or have passed.",
    instruction2: "Click on a completed prayer to mark it.",
    prayerNames: {
      fajr: "Fajr",
      dhuhr: "Dhuhr",
      asr: "Asr",
      maghrib: "Maghrib",
      isha: "Isha",
    },
  },
  ar: {
    title: "قائمة الصلاة",
    subtitle: "حدد الصلوات المكتملة",
    status: {
      completed: "مكتملة",
      current: "حان الوقت",
      passed: "فائتة",
      pending: "قادم",
    },
    instructionTitle: "تلميح:",
    instruction1: "يمكنك تحديد الصلوات التي حان وقتها أو التي انقضت.",
    instruction2: "اضغط على الصلاة المكتملة لتحديدها.",
    prayerNames: {
      fajr: "الفجر",
      dhuhr: "الظهر",
      asr: "العصر",
      maghrib: "المغرب",
      isha: "العشاء",
    },
  },
  fr: {
    title: "Liste des Prières",
    subtitle: "Marquer les prières terminées",
    status: {
      completed: "Terminé",
      current: "C'est l'heure",
      passed: "Passé",
      pending: "À venir",
    },
    instructionTitle: "Indice :",
    instruction1: "Vous pouvez marquer les prières actuelles ou passées.",
    instruction2: "Cliquez sur une prière terminée pour la marquer.",
    prayerNames: {
      fajr: "Fajr",
      dhuhr: "Dhuhr",
      asr: "Asr",
      maghrib: "Maghrib",
      isha: "Isha",
    },
  },
  kr: {
    title: "기도 체크리스트",
    subtitle: "완료된 기도 표시",
    status: {
      completed: "완료됨",
      current: "기도 시간",
      passed: "지남",
      pending: "대기 중",
    },
    instructionTitle: "힌트:",
    instruction1: "현재 시간 또는 지난 기도를 표시할 수 있습니다.",
    instruction2: "완료된 기도를 클릭하여 표시하세요.",
    prayerNames: {
      fajr: "파즈르",
      dhuhr: "두후르",
      asr: "아스르",
      maghrib: "마그립",
      isha: "이샤",
    },
  },
  jp: {
    title: "礼拝チェックリスト",
    subtitle: "完了した礼拝をマーク",
    status: {
      completed: "完了",
      current: "礼拝の時間",
      passed: "過ぎた",
      pending: "予定",
    },
    instructionTitle: "ヒント:",
    instruction1: "現在または過去の礼拝をマークできます。",
    instruction2: "完了した礼拝をクリックしてマークしてください。",
    prayerNames: {
      fajr: "ファジュル",
      dhuhr: "ズフル",
      asr: "アスル",
      maghrib: "マグリブ",
      isha: "イシャー",
    },
  },
};

export type PrayerKey = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface PrayerChecklistProps {
  prayerTimes: PrayerTimes;
  prayerStatus: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  onPrayerToggle: (prayer: PrayerKey) => void;
  currentPrayer: string | null;
}

export default function PrayerChecklist({
  prayerTimes,
  prayerStatus,
  onPrayerToggle,
  currentPrayer,
}: PrayerChecklistProps) {
  const { locale } = useI18n();

  const safeLocale = (
    CHECKLIST_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = CHECKLIST_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  const prayers: {
    key: PrayerKey;
    name: string;
    arabic: string;
    time: string;
  }[] = [
    {
      key: "fajr",
      name: t.prayerNames.fajr,
      arabic: "الفجر",
      time: prayerTimes.fajr,
    },
    {
      key: "dhuhr",
      name: t.prayerNames.dhuhr,
      arabic: "الظهر",
      time: prayerTimes.dhuhr,
    },
    {
      key: "asr",
      name: t.prayerNames.asr,
      arabic: "العصر",
      time: prayerTimes.asr,
    },
    {
      key: "maghrib",
      name: t.prayerNames.maghrib,
      arabic: "المغرب",
      time: prayerTimes.maghrib,
    },
    {
      key: "isha",
      name: t.prayerNames.isha,
      arabic: "العشاء",
      time: prayerTimes.isha,
    },
  ];

  // Helper untuk cek apakah waktu sholat sudah lewat
  const isTimePassed = (prayerTimeStr: string) => {
    const now = new Date();
    const [hours, minutes] = prayerTimeStr.split(":").map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0, 0);

    return now > prayerDate;
  };

  const getPrayerStatus = (prayerKey: string, timeStr: string) => {
    const isCompleted = prayerStatus[prayerKey as PrayerKey];
    const isCurrent = currentPrayer === prayerKey;
    const hasPassed = isTimePassed(timeStr);

    if (isCompleted) return "completed";
    if (isCurrent) return "current";
    if (hasPassed) return "passed";
    return "pending";
  };

  const canCheckPrayer = (prayerKey: string, timeStr: string) => {
    const isCompleted = prayerStatus[prayerKey as PrayerKey];
    const isCurrent = currentPrayer === prayerKey;
    const hasPassed = isTimePassed(timeStr);

    // IZINKAN JIKA: Sudah lewat waktu (termasuk current) ATAU sudah selesai (buat uncheck)
    return hasPassed || isCurrent || isCompleted;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "current":
        return <Clock className="w-5 h-5 text-warning" />;
      case "passed":
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success text-white";
      case "current":
        return "bg-warning text-white";
      case "passed":
        return "bg-red-100 text-red-600";
      default:
        return "bg-accent-100 text-awqaf-foreground-secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return t.status.completed;
      case "current":
        return t.status.current;
      case "passed":
        return t.status.passed || "Lewat";
      default:
        return t.status.pending;
    }
  };

  return (
    <Card className="border-awqaf-border-light" dir={isRtl ? "rtl" : "ltr"}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-awqaf-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground text-sm font-comfortaa">
              {t.title}
            </h3>
            <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Prayer List */}
        <div className="space-y-3">
          {prayers.map((prayer) => {
            const status = getPrayerStatus(prayer.key, prayer.time);
            const canCheck = canCheckPrayer(prayer.key, prayer.time);
            const isCompleted = prayerStatus[prayer.key];

            return (
              <div
                key={prayer.key}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                  canCheck
                    ? "border-awqaf-border-light hover:bg-accent-50 cursor-pointer"
                    : "border-awqaf-border-light bg-accent-50/50 cursor-not-allowed opacity-60"
                } ${
                  status === "current"
                    ? "ring-2 ring-warning/20 bg-warning/5"
                    : ""
                }`}
                onClick={() => canCheck && onPrayerToggle(prayer.key)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">{getStatusIcon(status)}</div>
                  <div>
                    <p className="font-medium text-card-foreground text-sm font-comfortaa">
                      {prayer.name}
                    </p>
                    <p className="text-xs text-awqaf-foreground-secondary font-tajawal">
                      {prayer.arabic}
                    </p>
                    <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mt-1">
                      {prayer.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={`text-xs px-2 py-1 ${getStatusColor(status)}`}
                  >
                    {getStatusText(status)}
                  </Badge>

                  {/* Render Checkbox visual jika bisa dicek */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-8 h-8 p-0 rounded-full ${
                      isCompleted
                        ? "bg-success text-white hover:bg-success/80"
                        : canCheck
                          ? "bg-accent-100 text-awqaf-primary hover:bg-accent-200"
                          : "bg-gray-100 text-gray-300"
                    }`}
                    disabled={!canCheck}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          canCheck ? "border-current" : "border-gray-300"
                        }`}
                      />
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="mt-4 p-3 bg-accent-50 rounded-lg border border-accent-100">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-awqaf-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                <strong>{t.instructionTitle}</strong> {t.instruction1}
              </p>
              <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mt-1">
                {t.instruction2}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}