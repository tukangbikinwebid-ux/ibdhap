"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  ArrowLeft,
  Info,
  Star,
  Clock,
  BookOpen,
  Sparkles,
  Gift,
  Moon,
  Sun,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  hariBesarData,
  namaBulanHijriyah,
  namaHari,
  getHariBesar,
  toHijriyah,
  getHijriMonthDays,
  getHijriDayOfWeek,
  type HariBesar,
} from "./data-hari-besar";
import { useI18n } from "@/app/hooks/useI18n";

interface CalendarDay {
  day: number;
  hijriDate: { year: number; month: number; day: number };
  hariBesar: HariBesar | null;
  isToday: boolean;
}

export default function KalenderHijriyahPage() {
  const { t, locale } = useI18n();
  const [currentHijriDate, setCurrentHijriDate] = useState(toHijriyah(new Date()));
  const [selectedHariBesar, setSelectedHariBesar] = useState<HariBesar | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const hariBesarSectionRef = useRef<HTMLDivElement>(null);

  // Update current hijri date
  useEffect(() => {
    setCurrentHijriDate(toHijriyah(new Date()));
  }, []);

  // Generate calendar days
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentHijriDate.year;
    const month = currentHijriDate.month;
    const daysInMonth = getHijriMonthDays(year, month);
    const firstDayOfWeek = getHijriDayOfWeek(year, month, 1);
    
    const todayHijri = toHijriyah(new Date());
    const isCurrentMonth = year === todayHijri.year && month === todayHijri.month;

    const days: CalendarDay[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({
        day: 0,
        hijriDate: { year, month, day: 0 },
        hariBesar: null,
        isToday: false,
      });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const hariBesar = getHariBesar(month, day);
      const isToday = isCurrentMonth && day === todayHijri.day;
      
      days.push({
        day,
        hijriDate: { year, month, day },
        hariBesar,
        isToday,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentHijriDate((prev) => {
      if (prev.month === 1) {
        return { year: prev.year - 1, month: 12, day: 1 };
      }
      return { ...prev, month: prev.month - 1, day: 1 };
    });
  };

  const goToNextMonth = () => {
    setCurrentHijriDate((prev) => {
      if (prev.month === 12) {
        return { year: prev.year + 1, month: 1, day: 1 };
      }
      return { ...prev, month: prev.month + 1, day: 1 };
    });
  };

  const goToToday = () => {
    const today = toHijriyah(new Date());
    setCurrentHijriDate(today);
  };

  // Handle day click
  const handleDayClick = (day: CalendarDay) => {
    if (day.day === 0) return; // Empty cell
    
    setSelectedDay(day);
    
    if (day.hariBesar) {
      setSelectedHariBesar(day.hariBesar);
      setIsModalOpen(true);
    } else {
      // Scroll to hari besar section
      if (hariBesarSectionRef.current) {
        hariBesarSectionRef.current.scrollIntoView({ 
          behavior: "smooth", 
          block: "start" 
        });
      }
    }
  };

  // Get type color and text
  const getTypeInfo = (type: string) => {
    switch (type) {
      case "wajib":
        return { 
          color: "bg-red-100 text-red-700 border-red-200", 
          text: "Wajib",
          bgColor: "bg-red-50"
        };
      case "sunnah":
        return { 
          color: "bg-green-100 text-green-700 border-green-200", 
          text: "Sunnah",
          bgColor: "bg-green-50"
        };
      case "sejarah":
        return { 
          color: "bg-blue-100 text-blue-700 border-blue-200", 
          text: "Sejarah",
          bgColor: "bg-blue-50"
        };
      case "peringatan":
        return { 
          color: "bg-yellow-100 text-yellow-700 border-yellow-200", 
          text: "Peringatan",
          bgColor: "bg-yellow-50"
        };
      default:
        return { 
          color: "bg-gray-100 text-gray-700 border-gray-200", 
          text: "Lainnya",
          bgColor: "bg-gray-50"
        };
    }
  };

  // Get hari besar for current month
  const getHariBesarThisMonth = () => {
    return hariBesarData.filter(
      (hari) => hari.date.month === currentHijriDate.month
    );
  };

  const hariBesarThisMonth = getHariBesarThisMonth();

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
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="text-center">
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                  {t("hijriCalendar.title")}
                </h1>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                  {currentHijriDate.year} H
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToToday}
                className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
                title={t("hijriCalendar.today")}
              >
                <Clock className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Current Date Info */}
        <Card className="border-awqaf-border-light bg-gradient-to-br from-awqaf-primary to-awqaf-primary/80 text-white overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 opacity-10">
              <Moon className="w-32 h-32 -mt-4 -mr-4" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-comfortaa opacity-90">
                  {namaBulanHijriyah[currentHijriDate.month - 1]} {currentHijriDate.year} H
                </span>
              </div>
              <h2 className="text-3xl font-bold font-arabic text-center mb-2">
                {currentHijriDate.day} {namaBulanHijriyah[currentHijriDate.month - 1]}
              </h2>
              <p className="text-sm text-center font-comfortaa opacity-90">
                {new Date().toLocaleDateString(locale === "id" ? "id-ID" : locale === "en" ? "en-US" : locale === "ar" ? "ar-SA" : locale === "fr" ? "fr-FR" : locale === "kr" ? "ko-KR" : "ja-JP", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Navigation */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousMonth}
                className="flex items-center gap-2 font-comfortaa"
              >
                <ChevronLeft className="w-4 h-4" />
                {t("hijriCalendar.previous")}
              </Button>

              <div className="text-center">
                <p className="text-sm font-semibold text-awqaf-primary font-comfortaa">
                  {namaBulanHijriyah[currentHijriDate.month - 1]}
                </p>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                  {currentHijriDate.year} H
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextMonth}
                className="flex items-center gap-2 font-comfortaa"
              >
                {t("hijriCalendar.next")}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Grid */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-3">
              {namaHari.map((hari) => (
                <div
                  key={hari}
                  className="text-center text-xs font-semibold text-awqaf-foreground-secondary font-comfortaa p-2"
                >
                  {hari.slice(0, 3)}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (day.day === 0) {
                  return <div key={index} className="h-14"></div>;
                }

                const { day: dayNumber, hariBesar, isToday } = day;
                const typeInfo = hariBesar ? getTypeInfo(hariBesar.type) : null;

                return (
                  <button
                    key={index}
                    onClick={() => handleDayClick(day)}
                    className={`h-14 flex flex-col items-center justify-center text-xs font-comfortaa rounded-lg cursor-pointer transition-all duration-200 relative group ${
                      isToday
                        ? "bg-gradient-to-br from-awqaf-primary to-awqaf-primary/80 text-white shadow-lg scale-105"
                        : hariBesar
                        ? `${typeInfo?.bgColor} hover:shadow-md border-2 ${typeInfo?.color.split(' ')[2]}`
                        : "hover:bg-accent-100 border border-transparent hover:border-awqaf-border-light"
                    }`}
                  >
                    <span className={`font-semibold ${isToday ? "text-white" : "text-card-foreground"}`}>
                      {dayNumber}
                    </span>
                    {hariBesar && (
                      <div className="text-xs mt-0.5">
                        {hariBesar.icon}
                      </div>
                    )}
                    {isToday && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></div>
                    )}
                    {hariBesar && !isToday && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-awqaf-primary"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-awqaf-border-light">
              <div className="flex flex-wrap gap-3 text-xs font-comfortaa">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-awqaf-primary"></div>
                  <span className="text-awqaf-foreground-secondary">{t("hijriCalendar.importantDay")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <span className="text-awqaf-foreground-secondary">{t("hijriCalendar.todayMarker")}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hari Besar List */}
        <div ref={hariBesarSectionRef} className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-awqaf-primary" />
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
              {t("hijriCalendar.importantDays")} {namaBulanHijriyah[currentHijriDate.month - 1]}
            </h2>
            {hariBesarThisMonth.length > 0 && (
              <Badge variant="secondary" className="bg-awqaf-primary text-white">
                {hariBesarThisMonth.length}
              </Badge>
            )}
          </div>

          {hariBesarThisMonth.length > 0 ? (
            <div className="space-y-3">
              {hariBesarThisMonth.map((hari) => {
                const typeInfo = getTypeInfo(hari.type);
                return (
                  <Card
                    key={hari.id}
                    className={`border-2 hover:shadow-lg transition-all duration-200 cursor-pointer ${typeInfo.color.split(' ')[2]}`}
                    onClick={() => {
                      setSelectedHariBesar(hari);
                      setIsModalOpen(true);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{hari.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-card-foreground font-comfortaa">
                              {hari.name}
                            </h3>
                            <Badge className={`text-xs ${typeInfo.color}`}>
                              {typeInfo.text}
                            </Badge>
                          </div>
                          <p className="text-sm text-awqaf-foreground-secondary font-comfortaa line-clamp-2 mb-1">
                            {hari.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-awqaf-foreground-secondary font-comfortaa">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {hari.date.day} {namaBulanHijriyah[hari.date.month - 1]}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-awqaf-foreground-secondary" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border-awqaf-border-light">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-12 h-12 text-awqaf-foreground-secondary mx-auto mb-4" />
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  {t("hijriCalendar.noImportantDays")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* All Hari Besar Reference */}
        <Card className="border-awqaf-border-light bg-accent-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-awqaf-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-card-foreground font-comfortaa mb-1">
                  {t("hijriCalendar.information")}
                </h4>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa leading-relaxed">
                  {t("hijriCalendar.infoDescription")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Hari Besar Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          {selectedHariBesar && (
            <>
              <DialogHeader className="pb-4 border-b border-awqaf-border-light">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-4xl">{selectedHariBesar.icon}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsModalOpen(false)}
                    className="w-8 h-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <DialogTitle className="text-xl font-comfortaa">
                  {selectedHariBesar.name}
                </DialogTitle>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className={`text-xs ${getTypeInfo(selectedHariBesar.type).color}`}>
                    {getTypeInfo(selectedHariBesar.type).text}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-awqaf-foreground-secondary font-comfortaa">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {selectedHariBesar.date.day} {namaBulanHijriyah[selectedHariBesar.date.month - 1]}
                    </span>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-awqaf-primary" />
                    <h4 className="font-semibold text-card-foreground font-comfortaa">
                      {t("hijriCalendar.explanation")}
                    </h4>
                  </div>
                  <p className="text-sm text-awqaf-foreground-secondary font-comfortaa leading-relaxed">
                    {selectedHariBesar.description}
                  </p>
                </div>

                {selectedDay && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900 font-comfortaa">
                        {t("hijriCalendar.selectedDate")}
                      </h4>
                    </div>
                    <p className="text-sm text-blue-800 font-comfortaa">
                      {selectedDay.hijriDate.day} {namaBulanHijriyah[selectedDay.hijriDate.month - 1]} {selectedDay.hijriDate.year} H
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
