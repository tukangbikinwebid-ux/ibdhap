"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Clock,
  MapPin,
  Calendar,
  Navigation,
  AlertCircle,
  CheckCircle,
  Loader2,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Play,
  Square,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Location {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

interface PrayerTime {
  name: string;
  arabic: string;
  time: string;
  status: "completed" | "current" | "upcoming";
}

interface AladhanResponse {
  data: {
    timings: {
      Fajr: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
      [key: string]: string;
    };
  };
}

// Popular Adhan Audio URL - Mishary Rashid Alafasy (most popular reciter worldwide)
// Using multiple fallback URLs for reliability
const ADHAN_URLS = [
  "https://www.islamcan.com/audio/adhan/azan1.mp3", // Full Adhan - Makkah style
  "https://media.sd.ma/assabile/adhan_3435/8bdb88c0b65f.mp3", // Mishary Rashid Alafasy
  "https://cdn.aladhan.com/audio/mishary/adhan.mp3", // Aladhan CDN fallback
];

export default function SholatPage() {
  const [location, setLocation] = useState<Location | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "prompt" | "unknown"
  >("unknown");

  // Adhan Reminder States
  const [isAdhanEnabled, setIsAdhanEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<
    "granted" | "denied" | "default"
  >("default");
  const [isAdhanPlaying, setIsAdhanPlaying] = useState(false);
  const [currentAdhanPrayer, setCurrentAdhanPrayer] = useState<string | null>(
    null
  );

  // Refs
  const adhanAudioRef = useRef<HTMLAudioElement | null>(null);
  const adhanTimersRef = useRef<NodeJS.Timeout[]>([]);

  // Helper to determine status based on current time and prayer time
  const getPrayerStatus = (
    prayerTimeStr: string,
    nextPrayerTimeStr: string | null
  ): "completed" | "current" | "upcoming" => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    if (!prayerTimeStr) return "upcoming";

    // API returns "04:45" or "04:45 (WIB)". We need to clean it just in case.
    const cleanTime = prayerTimeStr.split(" ")[0];
    const [pHeader, pMinute] = cleanTime.split(":").map(Number);
    const prayerTimeMinutes = pHeader * 60 + pMinute;

    if (currentTime < prayerTimeMinutes) {
      return "upcoming";
    }

    if (nextPrayerTimeStr) {
      const cleanNextTime = nextPrayerTimeStr.split(" ")[0];
      const [nHeader, nMinute] = cleanNextTime.split(":").map(Number);
      const nextPrayerTimeMinutes = nHeader * 60 + nMinute;
      if (
        currentTime >= prayerTimeMinutes &&
        currentTime < nextPrayerTimeMinutes
      ) {
        return "current";
      }
    } else {
      // Logic for Isha (last prayer of day)
      if (currentTime >= prayerTimeMinutes) {
        return "current";
      }
    }

    return "completed";
  };

  const fetchPrayerTimes = async (lat: number, lng: number) => {
    try {
      const date = new Date();
      // Ensure DD-MM-YYYY format with leading zeros
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const dateString = `${day}-${month}-${year}`;

      // Using Aladhan API with https protocol
      const apiUrl = `https://api.aladhan.com/v1/timings/${dateString}?latitude=${lat}&longitude=${lng}&method=20`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data: AladhanResponse = await response.json();

      if (!data || !data.data || !data.data.timings) {
        throw new Error("Invalid API response structure");
      }

      const timings = data.data.timings;

      // Map API response to our interface
      const rawPrayers = [
        { name: "Subuh", arabic: "الفجر", time: timings.Fajr },
        { name: "Dzuhur", arabic: "الظهر", time: timings.Dhuhr },
        { name: "Ashar", arabic: "العصر", time: timings.Asr },
        { name: "Maghrib", arabic: "المغرب", time: timings.Maghrib },
        { name: "Isya", arabic: "العشاء", time: timings.Isha },
      ];

      const processedPrayers: PrayerTime[] = rawPrayers.map((p, index) => {
        const nextPrayer = rawPrayers[index + 1];
        const status = getPrayerStatus(
          p.time,
          nextPrayer ? nextPrayer.time : null
        );
        return {
          ...p,
          status,
        };
      });

      setPrayerTimes(processedPrayers);
    } catch (err) {
      console.error("Failed to fetch prayer times:", err);
      setError("Gagal memuat jadwal sholat. Periksa koneksi internet Anda.");
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung oleh browser ini");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geocoding to get city name
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`
          );

          // Only process if response is OK
          let locationData = {
            city: "Lokasi tidak diketahui",
            country: "Indonesia",
          };
          if (response.ok) {
            const data = await response.json();
            locationData = {
              city: data.city || data.locality || "Lokasi tidak diketahui",
              country: data.countryName || "Indonesia",
            };
          }

          const newLocation: Location = {
            latitude,
            longitude,
            city: locationData.city,
            country: locationData.country,
          };

          setLocation(newLocation);
          // Fetch prayer times using real coordinates
          await fetchPrayerTimes(latitude, longitude);
          setPermissionStatus("granted");
        } catch (err) {
          console.error("Location or API Error:", err);
          setError("Gagal mendapatkan data lokasi atau jadwal.");

          // Still try to set location if we have coordinates but geocoding failed
          const newLocation: Location = {
            latitude,
            longitude,
            city: "Lokasi saat ini",
            country: "Indonesia",
          };
          setLocation(newLocation);
          // Still try to fetch prayer times even if city name failed
          await fetchPrayerTimes(latitude, longitude);
        }

        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        setPermissionStatus("denied");
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError(
              "Akses lokasi ditolak. Silakan izinkan akses lokasi untuk melihat jadwal sholat."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setError("Informasi lokasi tidak tersedia.");
            break;
          case error.TIMEOUT:
            setError("Permintaan lokasi timeout.");
            break;
          default:
            setError("Terjadi kesalahan saat mendapatkan lokasi.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  useEffect(() => {
    // Check if geolocation is available
    if (navigator.geolocation) {
      setPermissionStatus("prompt");
    } else {
      setError("Geolocation tidak didukung oleh browser ini");
    }

    // Load adhan preference from localStorage
    const savedAdhanPref = localStorage.getItem("adhan-reminder-enabled");
    if (savedAdhanPref === "true") {
      setIsAdhanEnabled(true);
    }

    // Check notification permission
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }

    // Initialize audio element with fallback
    const initAudio = () => {
      const audio = new Audio(ADHAN_URLS[0]);
      audio.preload = "auto";

      // Add error handler to try fallback URLs
      let currentUrlIndex = 0;
      audio.onerror = () => {
        currentUrlIndex++;
        if (currentUrlIndex < ADHAN_URLS.length) {
          audio.src = ADHAN_URLS[currentUrlIndex];
          audio.load();
        }
      };

      return audio;
    };

    adhanAudioRef.current = initAudio();

    // Cleanup on unmount
    return () => {
      // Clear all timers
      adhanTimersRef.current.forEach((timer) => clearTimeout(timer));
      adhanTimersRef.current = [];

      // Stop and cleanup audio
      if (adhanAudioRef.current) {
        adhanAudioRef.current.pause();
        adhanAudioRef.current = null;
      }
    };
  }, []);

  // Play Adhan function
  const playAdhan = useCallback((prayerName: string) => {
    if (!adhanAudioRef.current) {
      adhanAudioRef.current = new Audio(ADHAN_URLS[0]);
    }

    setCurrentAdhanPrayer(prayerName);
    setIsAdhanPlaying(true);

    // Show notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`Waktu ${prayerName}`, {
        body: `Saatnya menunaikan sholat ${prayerName}`,
        icon: "/icons/icon-192x192.png",
        tag: `adhan-${prayerName}`,
        requireInteraction: true,
      });
    }

    // Play adhan audio
    adhanAudioRef.current.currentTime = 0;
    adhanAudioRef.current
      .play()
      .then(() => {
        console.log(`Playing adhan for ${prayerName}`);
      })
      .catch((err) => {
        console.error("Error playing adhan:", err);
        setIsAdhanPlaying(false);
        setCurrentAdhanPrayer(null);
      });

    // Handle audio end
    adhanAudioRef.current.onended = () => {
      setIsAdhanPlaying(false);
      setCurrentAdhanPrayer(null);
    };
  }, []);

  // Stop Adhan function
  const stopAdhan = useCallback(() => {
    if (adhanAudioRef.current) {
      adhanAudioRef.current.pause();
      adhanAudioRef.current.currentTime = 0;
    }
    setIsAdhanPlaying(false);
    setCurrentAdhanPrayer(null);
  }, []);

  // Schedule Adhan reminders
  const scheduleAdhanReminders = useCallback(() => {
    // Clear existing timers
    adhanTimersRef.current.forEach((timer) => clearTimeout(timer));
    adhanTimersRef.current = [];

    if (!isAdhanEnabled || prayerTimes.length === 0) return;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    prayerTimes.forEach((prayer) => {
      // Parse prayer time
      const cleanTime = prayer.time.split(" ")[0];
      const [hours, minutes] = cleanTime.split(":").map(Number);
      const prayerMinutes = hours * 60 + minutes;

      // Only schedule if prayer time is in the future
      if (prayerMinutes > currentMinutes) {
        const delayMs = (prayerMinutes - currentMinutes) * 60 * 1000;

        const timer = setTimeout(() => {
          playAdhan(prayer.name);
        }, delayMs);

        adhanTimersRef.current.push(timer);
        console.log(
          `Scheduled adhan for ${prayer.name} in ${Math.round(delayMs / 60000)} minutes`
        );
      }
    });
  }, [isAdhanEnabled, prayerTimes, playAdhan]);

  // Effect to schedule adhan when enabled or prayer times change
  useEffect(() => {
    scheduleAdhanReminders();

    // Reschedule every minute to handle edge cases
    const intervalId = setInterval(() => {
      scheduleAdhanReminders();
    }, 60000);

    return () => {
      clearInterval(intervalId);
      adhanTimersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, [scheduleAdhanReminders]);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("Browser tidak mendukung notifikasi");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission === "granted";
    } catch (err) {
      console.error("Error requesting notification permission:", err);
      return false;
    }
  };

  // Toggle Adhan Reminder
  const toggleAdhanReminder = async () => {
    if (!isAdhanEnabled) {
      // Enabling - request notification permission first
      const hasPermission = await requestNotificationPermission();

      if (hasPermission || notificationPermission === "granted") {
        setIsAdhanEnabled(true);
        localStorage.setItem("adhan-reminder-enabled", "true");

        // Test audio can play (browsers require user interaction)
        if (adhanAudioRef.current) {
          adhanAudioRef.current.volume = 0.1;
          adhanAudioRef.current
            .play()
            .then(() => {
              setTimeout(() => {
                if (adhanAudioRef.current) {
                  adhanAudioRef.current.pause();
                  adhanAudioRef.current.currentTime = 0;
                  adhanAudioRef.current.volume = 1;
                }
              }, 500);
            })
            .catch((err) => {
              console.log("Audio autoplay blocked:", err);
            });
        }
      } else {
        alert(
          "Izinkan notifikasi untuk mengaktifkan pengingat adzan. Silakan cek pengaturan browser Anda."
        );
      }
    } else {
      // Disabling
      setIsAdhanEnabled(false);
      localStorage.setItem("adhan-reminder-enabled", "false");
      stopAdhan();

      // Clear all scheduled timers
      adhanTimersRef.current.forEach((timer) => clearTimeout(timer));
      adhanTimersRef.current = [];
    }
  };

  // Test play adhan
  const testPlayAdhan = () => {
    if (isAdhanPlaying) {
      stopAdhan();
    } else {
      playAdhan("Test");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <h1 className="text-xl font-bold text-awqaf-primary font-comfortaa text-center">
              Jadwal Sholat
            </h1>
            <p className="text-sm text-awqaf-foreground-secondary font-comfortaa text-center mt-1">
              Waktu sholat berdasarkan lokasi Anda
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Location Card */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-awqaf-primary" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-card-foreground font-comfortaa">
                  Lokasi Saat Ini
                </h2>
                {location ? (
                  <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                    {location.city}, {location.country}
                  </p>
                ) : (
                  <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                    Lokasi belum ditentukan
                  </p>
                )}
              </div>
              {permissionStatus === "granted" && (
                <CheckCircle className="w-5 h-5 text-success" />
              )}
            </div>

            {!location && (
              <div className="space-y-3">
                <Button
                  onClick={getCurrentLocation}
                  disabled={isLoading}
                  className="w-full bg-awqaf-primary hover:bg-awqaf-primary/90 text-white font-comfortaa"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Mendapatkan lokasi...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 mr-2" />
                      Gunakan Lokasi Saat Ini
                    </>
                  )}
                </Button>

                {/* Error message displayed below the button */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-600 font-comfortaa">
                      {error}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Adhan Reminder Card */}
        {location && prayerTimes.length > 0 && (
          <Card className="border-awqaf-border-light">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isAdhanEnabled
                        ? "bg-awqaf-primary text-white"
                        : "bg-accent-100 text-awqaf-primary"
                    }`}
                  >
                    {isAdhanEnabled ? (
                      <Bell className="w-5 h-5" />
                    ) : (
                      <BellOff className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground font-comfortaa">
                      Pengingat Adzan
                    </h3>
                    <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                      {isAdhanEnabled
                        ? "Adzan otomatis aktif"
                        : "Aktifkan untuk pengingat otomatis"}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={toggleAdhanReminder}
                  variant={isAdhanEnabled ? "default" : "outline"}
                  size="sm"
                  className={`font-comfortaa ${
                    isAdhanEnabled
                      ? "bg-awqaf-primary hover:bg-awqaf-primary/90"
                      : "border-awqaf-border-light"
                  }`}
                >
                  {isAdhanEnabled ? (
                    <>
                      <Volume2 className="w-4 h-4 mr-2" />
                      Aktif
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4 mr-2" />
                      Nonaktif
                    </>
                  )}
                </Button>
              </div>

              {/* Test Play Button & Status */}
              {isAdhanEnabled && (
                <div className="mt-4 pt-4 border-t border-awqaf-border-light">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                        {isAdhanPlaying
                          ? `Memutar adzan ${currentAdhanPrayer}...`
                          : "Test suara adzan"}
                      </span>
                    </div>
                    <Button
                      onClick={testPlayAdhan}
                      variant="outline"
                      size="sm"
                      className="border-awqaf-border-light font-comfortaa"
                    >
                      {isAdhanPlaying ? (
                        <>
                          <Square className="w-4 h-4 mr-2" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Test
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Scheduled Prayers Info */}
                  <div className="mt-3 text-xs text-awqaf-foreground-secondary font-comfortaa">
                    <p>
                      Jadwal adzan yang akan diputar hari ini:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {prayerTimes
                        .filter((p) => p.status === "upcoming" || p.status === "current")
                        .map((prayer) => (
                          <span
                            key={prayer.name}
                            className="px-2 py-1 bg-accent-100 rounded-full text-awqaf-primary"
                          >
                            {prayer.name} ({prayer.time})
                          </span>
                        ))}
                      {prayerTimes.filter(
                        (p) => p.status === "upcoming" || p.status === "current"
                      ).length === 0 && (
                        <span className="text-awqaf-foreground-secondary">
                          Semua waktu sholat hari ini sudah lewat
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Permission Warning */}
              {isAdhanEnabled && notificationPermission !== "granted" && (
                <div className="mt-3 flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                  <p className="text-xs text-yellow-700 font-comfortaa">
                    Izinkan notifikasi browser untuk pengalaman terbaik
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Prayer Times */}
        {location && prayerTimes.length > 0 && (
          <Card className="border-awqaf-border-light">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-awqaf-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground font-comfortaa">
                    Jadwal Sholat Hari Ini
                  </h3>
                  <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                    {new Date().toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {prayerTimes.map((prayer) => (
                  <div
                    key={prayer.name}
                    className={`
                    flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-200
                    ${
                      prayer.status === "current"
                        ? "bg-accent-100 border border-accent-200"
                        : "hover:bg-accent-50"
                    }
                  `}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        ${
                          prayer.status === "current"
                            ? "bg-awqaf-primary text-white"
                            : "bg-accent-100 text-awqaf-primary"
                        }
                      `}
                      >
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-card-foreground font-comfortaa font-semibold text-lg">
                          {prayer.name}
                        </span>
                        <p className="text-sm text-awqaf-primary font-tajawal">
                          {prayer.arabic}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`
                        font-comfortaa font-bold text-xl
                        ${
                          prayer.status === "current"
                            ? "text-awqaf-primary"
                            : "text-awqaf-foreground-secondary"
                        }
                      `}
                      >
                        {prayer.time}
                      </span>
                      {prayer.status === "current" && (
                        <p className="text-xs text-success font-comfortaa mt-1">
                          Sedang berlangsung
                        </p>
                      )}
                      {prayer.status === "completed" && (
                        <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mt-1">
                          Selesai
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Location Message or Error Persistence (if location null but tried) */}
        {!location && !isLoading && !error && (
          <Card className="border-awqaf-border-light">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-awqaf-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground font-comfortaa mb-2">
                Lokasi Diperlukan
              </h3>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa mb-4">
                Untuk menampilkan jadwal sholat yang akurat, aplikasi memerlukan
                akses ke lokasi Anda.
              </p>
              <Button
                onClick={getCurrentLocation}
                className="bg-awqaf-primary hover:bg-awqaf-primary/90 text-white font-comfortaa"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Izinkan Akses Lokasi
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Additional error display if location failed but UI is in "No Location" state */}
        {!location && error && (
          <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg mx-4">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-sm text-red-600 font-comfortaa">{error}</p>
          </div>
        )}
      </main>
    </div>
  );
}