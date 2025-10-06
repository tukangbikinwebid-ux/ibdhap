"use client";

import { useState, useEffect, useCallback } from "react";

interface PrayerStatus {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

interface DailyData {
  date: string;
  completedPrayers: number;
  totalPrayers: number;
  prayers: PrayerStatus;
}

interface Location {
  id: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

const STORAGE_KEYS = {
  PRAYER_DATA: "prayer-tracker-data",
  SELECTED_LOCATION: "prayer-tracker-location",
};

export function usePrayerTracker() {
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEYS.PRAYER_DATA);
      const savedLocation = localStorage.getItem(
        STORAGE_KEYS.SELECTED_LOCATION
      );

      if (savedData) {
        setDailyData(JSON.parse(savedData));
      }

      if (savedLocation) {
        setSelectedLocation(JSON.parse(savedLocation));
      }
    } catch (error) {
      console.error("Error loading prayer tracker data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(
          STORAGE_KEYS.PRAYER_DATA,
          JSON.stringify(dailyData)
        );
      } catch (error) {
        console.error("Error saving prayer tracker data:", error);
      }
    }
  }, [dailyData, isLoading]);

  // Save location to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading && selectedLocation) {
      try {
        localStorage.setItem(
          STORAGE_KEYS.SELECTED_LOCATION,
          JSON.stringify(selectedLocation)
        );
      } catch (error) {
        console.error("Error saving location:", error);
      }
    }
  }, [selectedLocation, isLoading]);

  const getTodayData = useCallback((): DailyData => {
    const today = new Date().toISOString().split("T")[0];
    const existingData = dailyData.find((data) => data.date === today);

    if (existingData) {
      return existingData;
    }

    // Create new data for today
    const newData: DailyData = {
      date: today,
      completedPrayers: 0,
      totalPrayers: 5,
      prayers: {
        fajr: false,
        dhuhr: false,
        asr: false,
        maghrib: false,
        isha: false,
      },
    };

    return newData;
  }, [dailyData]);

  const updateTodayData = useCallback((updatedData: DailyData) => {
    const today = new Date().toISOString().split("T")[0];

    setDailyData((prevData) => {
      const existingIndex = prevData.findIndex((data) => data.date === today);

      if (existingIndex >= 0) {
        // Update existing data
        const newData = [...prevData];
        newData[existingIndex] = updatedData;
        return newData;
      } else {
        // Add new data
        return [...prevData, updatedData];
      }
    });
  }, []);

  const togglePrayer = useCallback(
    (prayer: keyof PrayerStatus) => {
      const todayData = getTodayData();
      const newPrayerStatus = {
        ...todayData.prayers,
        [prayer]: !todayData.prayers[prayer],
      };

      const completedCount =
        Object.values(newPrayerStatus).filter(Boolean).length;

      const updatedData: DailyData = {
        ...todayData,
        prayers: newPrayerStatus,
        completedPrayers: completedCount,
      };

      updateTodayData(updatedData);
    },
    [getTodayData, updateTodayData]
  );

  const getCurrentPrayer = useCallback((prayerTimes: any) => {
    if (!prayerTimes) return null;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayerTimesInMinutes = {
      fajr: parseTimeToMinutes(prayerTimes.fajr),
      dhuhr: parseTimeToMinutes(prayerTimes.dhuhr),
      asr: parseTimeToMinutes(prayerTimes.asr),
      maghrib: parseTimeToMinutes(prayerTimes.maghrib),
      isha: parseTimeToMinutes(prayerTimes.isha),
    };

    const prayers = [
      { name: "Subuh", time: prayerTimesInMinutes.fajr, key: "fajr" },
      { name: "Dzuhur", time: prayerTimesInMinutes.dhuhr, key: "dhuhr" },
      { name: "Ashar", time: prayerTimesInMinutes.asr, key: "asr" },
      { name: "Maghrib", time: prayerTimesInMinutes.maghrib, key: "maghrib" },
      { name: "Isya", time: prayerTimesInMinutes.isha, key: "isha" },
    ];

    // Find current prayer
    for (let i = 0; i < prayers.length; i++) {
      const nextPrayer = prayers[(i + 1) % prayers.length];
      if (currentTime >= prayers[i].time && currentTime < nextPrayer.time) {
        return prayers[i];
      }
    }

    // If current time is before Fajr, return Isya from previous day
    return prayers[prayers.length - 1];
  }, []);

  const canCheckPrayer = useCallback(
    (prayer: keyof PrayerStatus, currentPrayer: string | null) => {
      const todayData = getTodayData();
      const isCompleted = todayData.prayers[prayer];
      const isCurrent = currentPrayer === prayer;

      // Can check if it's the current prayer time or if it's already completed (to uncheck)
      return isCurrent || isCompleted;
    },
    [getTodayData]
  );

  const getMonthlyData = useCallback(
    (year: number, month: number): DailyData[] => {
      return dailyData.filter((data) => {
        const dataDate = new Date(data.date);
        return dataDate.getFullYear() === year && dataDate.getMonth() === month;
      });
    },
    [dailyData]
  );

  const getMonthlyStats = useCallback(
    (year: number, month: number) => {
      const monthData = getMonthlyData(year, month);
      const totalDays = monthData.length;
      const totalPrayers = monthData.reduce(
        (sum, day) => sum + day.completedPrayers,
        0
      );
      const maxPossiblePrayers = totalDays * 5; // 5 prayers per day
      const averagePercentage =
        maxPossiblePrayers > 0 ? (totalPrayers / maxPossiblePrayers) * 100 : 0;
      const perfectDays = monthData.filter(
        (day) => day.completedPrayers === 5
      ).length;

      return {
        totalDays,
        totalPrayers,
        maxPossiblePrayers,
        averagePercentage,
        perfectDays,
      };
    },
    [getMonthlyData]
  );

  const clearAllData = useCallback(() => {
    setDailyData([]);
    localStorage.removeItem(STORAGE_KEYS.PRAYER_DATA);
  }, []);

  const exportData = useCallback(() => {
    const dataToExport = {
      dailyData,
      selectedLocation,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prayer-tracker-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [dailyData, selectedLocation]);

  return {
    // State
    dailyData,
    selectedLocation,
    isLoading,

    // Actions
    setSelectedLocation,
    togglePrayer,
    clearAllData,
    exportData,

    // Computed values
    todayData: getTodayData(),
    currentPrayer: selectedLocation ? getCurrentPrayer : null,
    canCheckPrayer,
    getMonthlyData,
    getMonthlyStats,
  };
}

// Helper function
function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
