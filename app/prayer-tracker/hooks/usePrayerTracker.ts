"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  useGetUserSholatListQuery,
  useToggleSholatMutation,
} from "@/services/sholat-track.service";

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
  SELECTED_LOCATION: "prayer-tracker-location",
};

// Fallback location (Jakarta)
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
  // --- 1. API Services ---
  // Mengambil data history sholat (default page 1)
  const { data: apiResponse, isLoading: isApiLoading } =
    useGetUserSholatListQuery({ page: 1 });
  const [toggleSholat] = useToggleSholatMutation();

  // --- 2. Local State ---
  const [selectedLocation, setSelectedLocation] =
    useState<Location>(FALLBACK_LOCATION);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [currentPrayerKey, setCurrentPrayerKey] = useState<
    keyof PrayerStatus | null
  >(null);
  const [isLocating, setIsLocating] = useState(true);
  const [isFetchingTimes, setIsFetchingTimes] = useState(false);

  // --- 3. Derived Data (API -> UI Format) ---

  // Tanggal Hari Ini (YYYY-MM-DD)
  const todayDate = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  // Format semua data dari API ke format DailyData yang dipakai UI
  const dailyData: DailyData[] = useMemo(() => {
    if (!apiResponse?.data) return [];

    return apiResponse.data.map((record) => {
      // Hitung jumlah completed berdasarkan boolean true
      let completedCount = 0;
      if (record.fajr) completedCount++;
      if (record.dhuhr) completedCount++;
      if (record.asr) completedCount++;
      if (record.maghrib) completedCount++;
      if (record.isha) completedCount++;

      return {
        date: record.date,
        completedPrayers: completedCount,
        totalPrayers: 5,
        prayers: {
          fajr: record.fajr,
          dhuhr: record.dhuhr,
          asr: record.asr,
          maghrib: record.maghrib,
          isha: record.isha,
        },
      };
    });
  }, [apiResponse]);

  // Ambil Data Hari Ini (atau default false semua jika belum ada record)
  const todayData: DailyData = useMemo(() => {
    const found = dailyData.find((d) => d.date === todayDate);
    if (found) return found;

    return {
      date: todayDate,
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
  }, [dailyData, todayDate]);

  // --- 4. Initialization (Location) ---
  useEffect(() => {
    const initLocation = async () => {
      try {
        const savedLocation = localStorage.getItem(
          STORAGE_KEYS.SELECTED_LOCATION,
        );
        if (savedLocation) {
          setSelectedLocation(JSON.parse(savedLocation));
          setIsLocating(false);
        } else if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                const res = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`,
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
                saveLocation(userLocation);
              } catch (err) {
                const coordLocation: Location = {
                  ...FALLBACK_LOCATION,
                  id: "user-geo-raw",
                  name: "Lokasi Saya",
                  city: "Koordinat GPS",
                  latitude: latitude,
                  longitude: longitude,
                };
                saveLocation(coordLocation);
              } finally {
                setIsLocating(false);
              }
            },
            (error) => {
              console.warn("Geo error:", error);
              setIsLocating(false);
            },
          );
        } else {
          setIsLocating(false);
        }
      } catch (e) {
        setIsLocating(false);
      }
    };
    initLocation();
  }, []);

  // --- 5. Fetch Prayer Times (Aladhan API) ---
  useEffect(() => {
    const fetchTimes = async () => {
      if (!selectedLocation) return;
      setIsFetchingTimes(true);
      try {
        const date = new Date();
        const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        const response = await fetch(
          `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${selectedLocation.latitude}&longitude=${selectedLocation.longitude}&method=20`,
        );
        const data = await response.json();
        if (data.code === 200 && data.data) {
          setPrayerTimes({
            fajr: data.data.timings.Fajr,
            dhuhr: data.data.timings.Dhuhr,
            asr: data.data.timings.Asr,
            maghrib: data.data.timings.Maghrib,
            isha: data.data.timings.Isha,
          });
        }
      } catch (error) {
        console.error("Error prayer times:", error);
      } finally {
        setIsFetchingTimes(false);
      }
    };
    fetchTimes();
  }, [selectedLocation]);

  // --- 6. Time Checker Logic ---
  useEffect(() => {
    if (!prayerTimes) return;
    const checkCurrent = () => {
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
    checkCurrent();
    const interval = setInterval(checkCurrent, 60000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  const saveLocation = useCallback((loc: Location) => {
    setSelectedLocation(loc);
    localStorage.setItem(STORAGE_KEYS.SELECTED_LOCATION, JSON.stringify(loc));
  }, []);

  // --- 7. Toggle Action (Server Mutation) ---
  const togglePrayer = useCallback(
    async (prayerKey: keyof PrayerStatus) => {
      // Siapkan status baru (invert status saat ini)
      const currentStatus = todayData.prayers[prayerKey];
      const newStatus = !currentStatus;

      // Payload harus mengirim SEMUA status sholat hari ini karena backend bersifat replace/update record
      const payload = {
        date: todayDate,
        fajr: todayData.prayers.fajr,
        dhuhr: todayData.prayers.dhuhr,
        asr: todayData.prayers.asr,
        maghrib: todayData.prayers.maghrib,
        isha: todayData.prayers.isha,
        [prayerKey]: newStatus, // Override key yang diklik
      };

      try {
        await toggleSholat(payload).unwrap();
        // RTK Query akan otomatis invalidate cache dan re-fetch list,
        // sehingga `dailyData` dan `todayData` akan update otomatis.
      } catch (error) {
        console.error("Gagal update sholat:", error);
      }
    },
    [todayData, todayDate, toggleSholat],
  );

  return {
    dailyData,
    todayData,
    prayerTimes,
    currentPrayerKey,
    selectedLocation,
    isLoading: isApiLoading || isLocating || isFetchingTimes,
    setSelectedLocation: saveLocation,
    togglePrayer,
  };
}