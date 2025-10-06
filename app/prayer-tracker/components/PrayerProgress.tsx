"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Target } from "lucide-react";

interface PrayerProgressProps {
  completedPrayers: number;
  totalPrayers: number;
  prayerStatus: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  currentPrayer: string | null;
}

export default function PrayerProgress({
  completedPrayers,
  totalPrayers,
  prayerStatus,
  currentPrayer,
}: PrayerProgressProps) {
  const prayers = [
    { key: "fajr", name: "Subuh", arabic: "الفجر" },
    { key: "dhuhr", name: "Dzuhur", arabic: "الظهر" },
    { key: "asr", name: "Ashar", arabic: "العصر" },
    { key: "maghrib", name: "Maghrib", arabic: "المغرب" },
    { key: "isha", name: "Isya", arabic: "العشاء" },
  ];

  const percentage =
    totalPrayers > 0 ? (completedPrayers / totalPrayers) * 100 : 0;

  const getPrayerStatus = (prayerKey: string) => {
    const isCompleted = prayerStatus[prayerKey as keyof typeof prayerStatus];
    const isCurrent = currentPrayer === prayerKey;

    if (isCompleted) return "completed";
    if (isCurrent) return "current";
    return "pending";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "current":
        return <Clock className="w-4 h-4 text-warning" />;
      default:
        return (
          <div className="w-4 h-4 rounded-full border-2 border-awqaf-border-light" />
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success text-white";
      case "current":
        return "bg-warning text-white";
      default:
        return "bg-accent-100 text-awqaf-foreground-secondary";
    }
  };

  return (
    <Card className="border-awqaf-border-light">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
            <Target className="w-4 h-4 text-awqaf-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground text-sm font-comfortaa">
              Progress Sholat Hari Ini
            </h3>
            <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
              {completedPrayers} dari {totalPrayers} sholat
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-card-foreground font-comfortaa">
              Progress
            </span>
            <span className="text-sm text-awqaf-foreground-secondary font-comfortaa">
              {Math.round(percentage)}%
            </span>
          </div>
          <Progress value={percentage} className="h-3 bg-accent-100" />
          <div className="flex justify-between text-xs text-awqaf-foreground-secondary font-comfortaa">
            <span>0%</span>
            <span className="font-medium text-awqaf-primary">
              {Math.round(percentage)}%
            </span>
            <span>100%</span>
          </div>
        </div>

        {/* Prayer List */}
        <div className="space-y-2">
          {prayers.map((prayer) => {
            const status = getPrayerStatus(prayer.key);
            return (
              <div
                key={prayer.key}
                className="flex items-center justify-between p-3 rounded-lg border border-awqaf-border-light hover:bg-accent-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(status)}
                  <div>
                    <p className="font-medium text-card-foreground text-sm font-comfortaa">
                      {prayer.name}
                    </p>
                    <p className="text-xs text-awqaf-foreground-secondary font-tajawal">
                      {prayer.arabic}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={`text-xs px-2 py-1 ${getStatusColor(status)}`}
                >
                  {status === "completed"
                    ? "Selesai"
                    : status === "current"
                    ? "Sekarang"
                    : "Menunggu"}
                </Badge>
              </div>
            );
          })}
        </div>

        {/* Motivational Message */}
        {completedPrayers === totalPrayers ? (
          <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
            <p className="text-xs text-success font-comfortaa text-center">
              🎉 Alhamdulillah! Semua sholat hari ini sudah selesai
            </p>
            <p className="text-xs text-success font-tajawal text-center mt-1">
              "Dan dirikanlah sholat untuk mengingat-Ku"
            </p>
            <p className="text-xs text-success font-comfortaa text-center">
              - QS. Thaha: 14
            </p>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-accent-50 rounded-lg border border-accent-100">
            <p className="text-xs text-awqaf-foreground-secondary font-comfortaa text-center">
              "Sesungguhnya sholat itu adalah kewajiban yang ditentukan waktunya
              atas orang-orang yang beriman"
            </p>
            <p className="text-xs text-awqaf-primary font-tajawal text-center mt-1">
              - QS. An-Nisa: 103
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
