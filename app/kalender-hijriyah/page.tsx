"use client";

import { useState, useEffect } from "react";
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
  Navigation,
  Info,
  Star,
  Clock,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import {
  hariBesarData,
  namaBulanHijriyah,
  namaHari,
  toHijriyah,
  getHariBesar,
  type HariBesar,
} from "./data-hari-besar";

export default function KalenderHijriyahPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedHariBesar, setSelectedHariBesar] = useState<HariBesar | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hijriDate, setHijriDate] = useState(toHijriyah(new Date()));

  // Update Hijri date when current date changes
  useEffect(() => {
    setHijriDate(toHijriyah(currentDate));
  }, [currentDate]);

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = hijriDate.year;
    const month = hijriDate.month;

    // Get first day of month and number of days
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = 30; // Approximate, Hijri months have 29-30 days

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const hariBesar = getHariBesar(month, day);
      days.push({
        day,
        hijriDate: { year, month, day },
        masehiDate: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          day
        ),
        hariBesar,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Handle hari besar click
  const handleHariBesarClick = (hariBesar: HariBesar) => {
    setSelectedHariBesar(hariBesar);
    setIsModalOpen(true);
  };

  // Get type color and text
  const getTypeInfo = (type: string) => {
    switch (type) {
      case "wajib":
        return { color: "bg-red-100 text-red-800", text: "Wajib" };
      case "sunnah":
        return { color: "bg-green-100 text-green-800", text: "Sunnah" };
      case "sejarah":
        return { color: "bg-blue-100 text-blue-800", text: "Sejarah" };
      case "peringatan":
        return { color: "bg-yellow-100 text-yellow-800", text: "Peringatan" };
      default:
        return { color: "bg-gray-100 text-gray-800", text: "Lainnya" };
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
                  <Navigation className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                Kalender Hijriyah
              </h1>
              <div className="w-10 h-10"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Current Date Info */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5 text-awqaf-primary" />
                <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
                  {namaBulanHijriyah[hijriDate.month - 1]} {hijriDate.year} H
                </h2>
              </div>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                {formatDate(currentDate)}
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
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Sebelumnya
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="flex items-center gap-1"
              >
                <Clock className="w-4 h-4" />
                Hari Ini
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextMonth}
                className="flex items-center gap-1"
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Grid */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {namaHari.map((hari) => (
                <div
                  key={hari}
                  className="text-center text-xs font-medium text-awqaf-foreground-secondary font-comfortaa p-2"
                >
                  {hari.slice(0, 3)}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <div key={index} className="h-12"></div>;
                }

                const { day: dayNumber, hariBesar } = day;
                const isToday =
                  dayNumber === hijriDate.day &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear();

                return (
                  <div
                    key={index}
                    className={`h-12 flex flex-col items-center justify-center text-xs font-comfortaa rounded-lg cursor-pointer transition-all duration-200 ${
                      isToday
                        ? "bg-awqaf-primary text-white"
                        : hariBesar
                        ? "bg-accent-100 hover:bg-accent-200"
                        : "hover:bg-accent-50"
                    }`}
                    onClick={() => hariBesar && handleHariBesarClick(hariBesar)}
                  >
                    <span className="font-medium">{dayNumber}</span>
                    {hariBesar && (
                      <div className="text-xs">{hariBesar.icon}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Hari Besar List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-awqaf-primary" />
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
              Hari Besar Islam
            </h2>
          </div>

          <div className="space-y-3">
            {hariBesarData.map((hari) => {
              const typeInfo = getTypeInfo(hari.type);
              return (
                <Card
                  key={hari.id}
                  className="border-awqaf-border-light hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => handleHariBesarClick(hari)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{hari.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-card-foreground font-comfortaa">
                            {hari.name}
                          </h3>
                          <Badge className={`text-xs ${typeInfo.color}`}>
                            {typeInfo.text}
                          </Badge>
                        </div>
                        <p className="text-sm text-awqaf-foreground-secondary font-comfortaa line-clamp-2">
                          {hari.description}
                        </p>
                        <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mt-1">
                          {namaBulanHijriyah[hari.date.month - 1]}{" "}
                          {hari.date.day}
                        </p>
                      </div>
                      <Info className="w-4 h-4 text-awqaf-foreground-secondary" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      {/* Hari Besar Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-comfortaa">
              <span className="text-2xl">{selectedHariBesar?.icon}</span>
              {selectedHariBesar?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedHariBesar && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  className={`text-xs ${
                    getTypeInfo(selectedHariBesar.type).color
                  }`}
                >
                  {getTypeInfo(selectedHariBesar.type).text}
                </Badge>
                <span className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  {namaBulanHijriyah[selectedHariBesar.date.month - 1]}{" "}
                  {selectedHariBesar.date.day}
                </span>
              </div>

              <div className="bg-accent-50 p-4 rounded-lg">
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa leading-relaxed">
                  {selectedHariBesar.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-awqaf-foreground-secondary font-comfortaa">
                <BookOpen className="w-4 h-4" />
                <span>Klik untuk informasi lebih lanjut</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
