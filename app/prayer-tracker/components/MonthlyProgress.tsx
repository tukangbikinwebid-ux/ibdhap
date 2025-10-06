"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar, TrendingUp } from "lucide-react";

interface MonthlyData {
  date: string;
  completedPrayers: number;
  totalPrayers: number;
  prayers: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
}

interface MonthlyProgressProps {
  monthlyData: MonthlyData[];
  onDateSelect?: (date: string) => void;
}

export default function MonthlyProgress({
  monthlyData,
  onDateSelect,
}: MonthlyProgressProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getDateString = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    return `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
  };

  const getDayData = (day: number) => {
    const dateString = getDateString(day);
    return monthlyData.find((data) => data.date === dateString);
  };

  const getProgressPercentage = (day: number) => {
    const dayData = getDayData(day);
    if (!dayData) return 0;
    return dayData.totalPrayers > 0
      ? (dayData.completedPrayers / dayData.totalPrayers) * 100
      : 0;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return "bg-success";
    if (percentage >= 80) return "bg-success/80";
    if (percentage >= 60) return "bg-warning";
    if (percentage >= 40) return "bg-warning/60";
    if (percentage > 0) return "bg-error/60";
    return "bg-awqaf-border-light";
  };

  const getMonthlyStats = () => {
    const currentMonthData = monthlyData.filter((data) => {
      const dataDate = new Date(data.date);
      return (
        dataDate.getMonth() === currentMonth.getMonth() &&
        dataDate.getFullYear() === currentMonth.getFullYear()
      );
    });

    const totalDays = currentMonthData.length;
    const totalPrayers = currentMonthData.reduce(
      (sum, day) => sum + day.completedPrayers,
      0
    );
    const maxPossiblePrayers = totalDays * 5; // 5 prayers per day
    const averagePercentage =
      maxPossiblePrayers > 0 ? (totalPrayers / maxPossiblePrayers) * 100 : 0;
    const perfectDays = currentMonthData.filter(
      (day) => day.completedPrayers === 5
    ).length;

    return {
      totalDays,
      totalPrayers,
      maxPossiblePrayers,
      averagePercentage,
      perfectDays,
    };
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleDayClick = (day: number) => {
    const dateString = getDateString(day);
    setSelectedDate(dateString);
    onDateSelect?.(dateString);
  };

  const stats = getMonthlyStats();
  const days = getDaysInMonth(currentMonth);

  return (
    <Card className="border-awqaf-border-light">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-awqaf-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground text-sm font-comfortaa">
                Progress Bulanan
              </h3>
              <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                {monthNames[currentMonth.getMonth()]}{" "}
                {currentMonth.getFullYear()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousMonth}
              className="w-8 h-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              className="w-8 h-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Monthly Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-accent-50 rounded-lg border border-accent-100">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                Rata-rata
              </span>
            </div>
            <p className="text-lg font-bold text-success font-comfortaa">
              {Math.round(stats.averagePercentage)}%
            </p>
          </div>
          <div className="p-3 bg-accent-50 rounded-lg border border-accent-100">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-awqaf-primary" />
              <span className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                Hari Sempurna
              </span>
            </div>
            <p className="text-lg font-bold text-awqaf-primary font-comfortaa">
              {stats.perfectDays}
            </p>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-2">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-xs text-awqaf-foreground-secondary font-comfortaa py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={index} className="h-8" />;
              }

              const progress = getProgressPercentage(day);
              const isSelected = selectedDate === getDateString(day);
              const isToday =
                getDateString(day) === new Date().toISOString().split("T")[0];

              return (
                <Button
                  key={day}
                  variant="ghost"
                  size="sm"
                  className={`h-8 p-0 relative ${
                    isSelected
                      ? "bg-awqaf-primary text-white"
                      : isToday
                      ? "bg-accent-200 text-awqaf-primary"
                      : "hover:bg-accent-50"
                  }`}
                  onClick={() => handleDayClick(day)}
                >
                  <span className="text-xs font-comfortaa">{day}</span>
                  {progress > 0 && (
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-1 ${getProgressColor(
                        progress
                      )}`}
                    />
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 p-3 bg-accent-50 rounded-lg border border-accent-100">
          <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mb-2">
            <strong>Keterangan:</strong>
          </p>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span className="text-awqaf-foreground-secondary font-comfortaa">
                100%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-warning rounded"></div>
              <span className="text-awqaf-foreground-secondary font-comfortaa">
                60-99%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-error/60 rounded"></div>
              <span className="text-awqaf-foreground-secondary font-comfortaa">
                1-59%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-awqaf-border-light rounded"></div>
              <span className="text-awqaf-foreground-secondary font-comfortaa">
                0%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
