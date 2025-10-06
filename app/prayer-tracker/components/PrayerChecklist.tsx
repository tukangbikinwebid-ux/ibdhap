"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

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
  onPrayerToggle: (prayer: string) => void;
  currentPrayer: string | null;
}

export default function PrayerChecklist({
  prayerTimes,
  prayerStatus,
  onPrayerToggle,
  currentPrayer,
}: PrayerChecklistProps) {
  const prayers = [
    { key: "fajr", name: "Subuh", arabic: "الفجر", time: prayerTimes.fajr },
    { key: "dhuhr", name: "Dzuhur", arabic: "الظهر", time: prayerTimes.dhuhr },
    { key: "asr", name: "Ashar", arabic: "العصر", time: prayerTimes.asr },
    {
      key: "maghrib",
      name: "Maghrib",
      arabic: "المغرب",
      time: prayerTimes.maghrib,
    },
    { key: "isha", name: "Isya", arabic: "العشاء", time: prayerTimes.isha },
  ];

  const getPrayerStatus = (prayerKey: string) => {
    const isCompleted = prayerStatus[prayerKey as keyof typeof prayerStatus];
    const isCurrent = currentPrayer === prayerKey;

    if (isCompleted) return "completed";
    if (isCurrent) return "current";
    return "pending";
  };

  const canCheckPrayer = (prayerKey: string) => {
    const isCompleted = prayerStatus[prayerKey as keyof typeof prayerStatus];
    const isCurrent = currentPrayer === prayerKey;

    // Can check if it's the current prayer time or if it's already completed (to uncheck)
    return isCurrent || isCompleted;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "current":
        return <Clock className="w-5 h-5 text-warning" />;
      default:
        return (
          <AlertCircle className="w-5 h-5 text-awqaf-foreground-secondary" />
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Selesai";
      case "current":
        return "Waktunya";
      default:
        return "Belum Waktunya";
    }
  };

  return (
    <Card className="border-awqaf-border-light">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-awqaf-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground text-sm font-comfortaa">
              Checklist Sholat
            </h3>
            <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
              Tandai sholat yang sudah dikerjakan
            </p>
          </div>
        </div>

        {/* Prayer List */}
        <div className="space-y-3">
          {prayers.map((prayer) => {
            const status = getPrayerStatus(prayer.key);
            const canCheck = canCheckPrayer(prayer.key);
            const isCompleted =
              prayerStatus[prayer.key as keyof typeof prayerStatus];

            return (
              <div
                key={prayer.key}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                  canCheck
                    ? "border-awqaf-border-light hover:bg-accent-50 cursor-pointer"
                    : "border-awqaf-border-light bg-accent-50/50 cursor-not-allowed"
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
                      {prayer.time} WIB
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

                  {canCheck && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-8 h-8 p-0 rounded-full ${
                        isCompleted
                          ? "bg-success text-white hover:bg-success/80"
                          : "bg-accent-100 text-awqaf-primary hover:bg-accent-200"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-current" />
                      )}
                    </Button>
                  )}
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
                <strong>Petunjuk:</strong> Anda hanya bisa menandai sholat yang
                sudah waktunya atau yang sudah selesai dikerjakan.
              </p>
              <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mt-1">
                Klik pada sholat yang sudah dikerjakan untuk menandainya.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
