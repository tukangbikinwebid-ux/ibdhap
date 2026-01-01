"use client";

import { useState, useEffect, useCallback } from "react";

// --- Types ---
export interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface PrayerStatus {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

export interface DailyData {
  date: string;
  completedPrayers: number;
  totalPrayers: number;
  prayers: PrayerStatus;
}

export interface Location {
  id: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

const STORAGE_KEYS = {
  PRAYER_DATA: "prayer-tracker-data",
  SELECTED_LOCATION: "prayer-tracker-location",
};

// Fallback location jika Geolocation ditolak/error (Jakarta)
const FALLBACK_LOCATION: Location = {
  id: "jakarta",
  name: "Jakarta",
  city: "Jakarta",
  country: "Indonesia",
  latitude: -6.2088,
  longitude: 106.8456,
  timezone: "Asia/Jakarta",
};

export function usePrayerTracker() {
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  // Inisialisasi awal null atau fallback sementara loading
  const [selectedLocation, setSelectedLocation] =
    useState<Location>(FALLBACK_LOCATION);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [currentPrayerKey, setCurrentPrayerKey] = useState<
    keyof PrayerStatus | null
  >(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingTimes, setIsFetchingTimes] = useState(false);

  // 1. Initialize Location & Load Data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // A. Load Prayer Data History
        const savedData = localStorage.getItem(STORAGE_KEYS.PRAYER_DATA);
        if (savedData) setDailyData(JSON.parse(savedData));

        // B. Determine Location
        const savedLocation = localStorage.getItem(
          STORAGE_KEYS.SELECTED_LOCATION
        );

        if (savedLocation) {
          // Prioritas 1: Gunakan lokasi yang tersimpan di LocalStorage
          setSelectedLocation(JSON.parse(savedLocation));
          setIsLoading(false);
        } else {
          // Prioritas 2: Gunakan Geolocation Browser
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                  // Optional: Reverse Geocoding untuk dapat nama kota
                  const res = await fetch(
                    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`
                  );
                  const data = await res.json();

                  const userLocation: Location = {
                    id: "user-geo",
                    name: "Lokasi Saya",
                    city: data.city || data.locality || "Terdeteksi",
                    country: data.countryName || "Indonesia",
                    latitude: latitude,
                    longitude: longitude,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                  };

                  setSelectedLocation(userLocation);
                  // Simpan ke storage agar refresh berikutnya tidak tanya izin lagi (opsional)
                  localStorage.setItem(
                    STORAGE_KEYS.SELECTED_LOCATION,
                    JSON.stringify(userLocation)
                  );
                } catch (err) {
                  // Jika reverse geocode gagal, tetap gunakan koordinat
                  const coordLocation: Location = {
                    ...FALLBACK_LOCATION,
                    id: "user-geo-raw",
                    name: "Lokasi Saya",
                    city: "Koordinat GPS",
                    latitude: latitude,
                    longitude: longitude,
                  };
                  setSelectedLocation(coordLocation);
                } finally {
                  setIsLoading(false);
                }
              },
              (error) => {
                console.warn("Geolocation denied/error:", error);
                // Prioritas 3: Fallback ke Default (Jakarta)
                setSelectedLocation(FALLBACK_LOCATION);
                setIsLoading(false);
              }
            );
          } else {
            // Browser tidak support
            setSelectedLocation(FALLBACK_LOCATION);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Initialization error:", error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // 2. Fetch Prayer Times from Aladhan API
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      // Jangan fetch jika lokasi belum siap (masih proses geolocation)
      if (!selectedLocation) return;

      setIsFetchingTimes(true);
      try {
        const date = new Date();
        const method = 20; // Kemenag Indonesia
        const dateStr = `${date.getDate()}-${
          date.getMonth() + 1
        }-${date.getFullYear()}`;

        const response = await fetch(
          `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${selectedLocation.latitude}&longitude=${selectedLocation.longitude}&method=${method}`
        );

        const data = await response.json();
        if (data.code === 200 && data.data) {
          const timings = data.data.timings;
          setPrayerTimes({
            fajr: timings.Fajr,
            dhuhr: timings.Dhuhr,
            asr: timings.Asr,
            maghrib: timings.Maghrib,
            isha: timings.Isha,
          });
        }
      } catch (error) {
        console.error("Error fetching prayer times:", error);
      } finally {
        setIsFetchingTimes(false);
      }
    };

    fetchPrayerTimes();
  }, [selectedLocation]);

  // 3. Update Current Prayer & Check Time logic (Sama seperti sebelumnya)
  useEffect(() => {
    if (!prayerTimes) return;

    const checkCurrentPrayer = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const parse = (t: string) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      };

      const times = {
        fajr: parse(prayerTimes.fajr),
        dhuhr: parse(prayerTimes.dhuhr),
        asr: parse(prayerTimes.asr),
        maghrib: parse(prayerTimes.maghrib),
        isha: parse(prayerTimes.isha),
      };

      let active: keyof PrayerStatus | null = null;

      if (currentMinutes >= times.fajr && currentMinutes < times.dhuhr)
        active = "fajr";
      else if (currentMinutes >= times.dhuhr && currentMinutes < times.asr)
        active = "dhuhr";
      else if (currentMinutes >= times.asr && currentMinutes < times.maghrib)
        active = "asr";
      else if (currentMinutes >= times.maghrib && currentMinutes < times.isha)
        active = "maghrib";
      else if (currentMinutes >= times.isha || currentMinutes < times.fajr)
        active = "isha";

      setCurrentPrayerKey(active);
    };

    checkCurrentPrayer();
    const interval = setInterval(checkCurrentPrayer, 60000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  // 4. Data Persistence Handlers
  const savePrayerData = useCallback((data: DailyData[]) => {
    setDailyData(data);
    localStorage.setItem(STORAGE_KEYS.PRAYER_DATA, JSON.stringify(data));
  }, []);

  const saveLocation = useCallback((loc: Location) => {
    setSelectedLocation(loc);
    localStorage.setItem(STORAGE_KEYS.SELECTED_LOCATION, JSON.stringify(loc));
  }, []);

  // 5. Get Today's Data Helper
  const getTodayData = useCallback((): DailyData => {
    const today = new Date().toISOString().split("T")[0];
    const existing = dailyData.find((d) => d.date === today);

    if (existing) return existing;

    return {
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
  }, [dailyData]);

  // 6. Toggle Action
  const togglePrayer = useCallback(
    (prayer: keyof PrayerStatus) => {
      const currentData = getTodayData();
      const newStatus = !currentData.prayers[prayer];

      const newPrayers = {
        ...currentData.prayers,
        [prayer]: newStatus,
      };

      const completedCount = Object.values(newPrayers).filter(Boolean).length;

      const updatedDay: DailyData = {
        ...currentData,
        prayers: newPrayers,
        completedPrayers: completedCount,
      };

      const newDataList = [...dailyData];
      const index = newDataList.findIndex((d) => d.date === currentData.date);

      if (index >= 0) {
        newDataList[index] = updatedDay;
      } else {
        newDataList.push(updatedDay);
      }

      savePrayerData(newDataList);
    },
    [dailyData, getTodayData, savePrayerData]
  );

  const getMonthlyData = useCallback(
    (year: number, month: number) => {
      return dailyData.filter((d) => {
        const date = new Date(d.date);
        return date.getFullYear() === year && date.getMonth() === month;
      });
    },
    [dailyData]
  );

  return {
    dailyData,
    todayData: getTodayData(),
    prayerTimes,
    currentPrayerKey,
    selectedLocation,
    isLoading: isLoading || isFetchingTimes,
    setSelectedLocation: saveLocation,
    togglePrayer,
    getMonthlyData,
  };
}