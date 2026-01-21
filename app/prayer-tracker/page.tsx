"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import LocationSelector from "./components/LocationSelector";
import PrayerProgress from "./components/PrayerProgress";
import PrayerChecklist from "./components/PrayerChecklist";
import MonthlyProgress from "./components/MonthlyProgress";
import { usePrayerTracker } from "./hooks/usePrayerTracker";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/app/hooks/useI18n";

export default function PrayerTrackerPage() {
  const { t } = useI18n();
  const {
    todayData,
    dailyData,
    prayerTimes,
    currentPrayerKey,
    selectedLocation,
    isLoading,
    setSelectedLocation,
    togglePrayer,
  } = usePrayerTracker();

  const [activeTab, setActiveTab] = useState<"today" | "monthly">("today");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-awqaf-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-awqaf-foreground-secondary font-comfortaa">
            {t("prayerTracker.loading")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 p-0 rounded-full bg-accent-100 hover:bg-accent-200 hover:text-awqaf-primary transition-colors duration-200"
                  >
                    <ArrowLeft className="w-5 h-5 text-awqaf-primary" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                    {t("prayerTracker.title")}
                  </h1>
                  <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                    {t("prayerTracker.subtitle")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Location Selector (Auto API) */}
        <LocationSelector
          currentLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
        />

        {/* Tab Navigation */}
        <div className="flex bg-accent-100 rounded-lg p-1">
          <Button
            variant={activeTab === "today" ? "default" : "ghost"}
            size="sm"
            className={`flex-1 font-comfortaa ${
              activeTab === "today"
                ? "bg-awqaf-primary text-white"
                : "text-awqaf-foreground-secondary hover:text-awqaf-primary"
            }`}
            onClick={() => setActiveTab("today")}
          >
            {t("prayerTracker.today")}
          </Button>
          <Button
            variant={activeTab === "monthly" ? "default" : "ghost"}
            size="sm"
            className={`flex-1 font-comfortaa ${
              activeTab === "monthly"
                ? "bg-awqaf-primary text-white"
                : "text-awqaf-foreground-secondary hover:text-awqaf-primary"
            }`}
            onClick={() => setActiveTab("monthly")}
          >
            {t("prayerTracker.monthly")}
          </Button>
        </div>

        {/* Today Tab */}
        {activeTab === "today" && (
          <div className="space-y-6">
            {/* Prayer Progress */}
            <PrayerProgress
              completedPrayers={todayData.completedPrayers}
              totalPrayers={todayData.totalPrayers}
              prayerStatus={todayData.prayers}
              currentPrayer={currentPrayerKey}
            />

            {/* Prayer Checklist */}
            {prayerTimes ? (
              <PrayerChecklist
                prayerTimes={prayerTimes}
                prayerStatus={todayData.prayers}
                onPrayerToggle={togglePrayer}
                currentPrayer={currentPrayerKey}
              />
            ) : (
              <div className="text-center py-4 text-sm text-gray-500">
                {t("prayerTracker.failedToLoad")}
              </div>
            )}
          </div>
        )}

        {/* Monthly Tab */}
        {activeTab === "monthly" && (
          <div className="space-y-6">
            <MonthlyProgress
              monthlyData={dailyData}
              onDateSelect={(date) => console.log("Selected date:", date)}
            />
          </div>
        )}

        {/* Motivational Quote */}
        <Card className="border-awqaf-border-light bg-gradient-to-r from-accent-100 to-accent-200">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-awqaf-foreground-secondary font-comfortaa mb-2">
              &quot;{t("prayerTracker.motivationalQuote")}&quot;
            </p>
            <p className="text-xs text-awqaf-primary font-tajawal">
              - QS. Thaha: 14
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}