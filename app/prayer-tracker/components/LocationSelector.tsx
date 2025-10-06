"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, ChevronDown } from "lucide-react";

interface Location {
  id: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface LocationSelectorProps {
  onLocationChange: (location: Location) => void;
  onPrayerTimesChange: (prayerTimes: PrayerTimes) => void;
}

export default function LocationSelector({
  onLocationChange,
  onPrayerTimesChange,
}: LocationSelectorProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);

  // Sample locations data
  const locations: Location[] = [
    {
      id: "jakarta",
      name: "Jakarta",
      city: "Jakarta",
      country: "Indonesia",
      latitude: -6.2088,
      longitude: 106.8456,
      timezone: "Asia/Jakarta",
    },
    {
      id: "bandung",
      name: "Bandung",
      city: "Bandung",
      country: "Indonesia",
      latitude: -6.9175,
      longitude: 107.6191,
      timezone: "Asia/Jakarta",
    },
    {
      id: "surabaya",
      name: "Surabaya",
      city: "Surabaya",
      country: "Indonesia",
      latitude: -7.2575,
      longitude: 112.7521,
      timezone: "Asia/Jakarta",
    },
    {
      id: "medan",
      name: "Medan",
      city: "Medan",
      country: "Indonesia",
      latitude: 3.5952,
      longitude: 98.6722,
      timezone: "Asia/Jakarta",
    },
    {
      id: "makassar",
      name: "Makassar",
      city: "Makassar",
      country: "Indonesia",
      latitude: -5.1477,
      longitude: 119.4327,
      timezone: "Asia/Makassar",
    },
  ];

  // Sample prayer times calculation (in real app, use proper prayer times API)
  const calculatePrayerTimes = (location: Location): PrayerTimes => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    // Simple calculation based on location and date
    // In real implementation, use proper prayer times calculation
    const baseTimes = {
      jakarta: {
        fajr: "04:45",
        dhuhr: "12:15",
        asr: "15:30",
        maghrib: "18:00",
        isha: "19:15",
      },
      bandung: {
        fajr: "04:47",
        dhuhr: "12:17",
        asr: "15:32",
        maghrib: "18:02",
        isha: "19:17",
      },
      surabaya: {
        fajr: "04:43",
        dhuhr: "12:13",
        asr: "15:28",
        maghrib: "17:58",
        isha: "19:13",
      },
      medan: {
        fajr: "05:15",
        dhuhr: "12:45",
        asr: "16:00",
        maghrib: "18:30",
        isha: "19:45",
      },
      makassar: {
        fajr: "04:30",
        dhuhr: "12:00",
        asr: "15:15",
        maghrib: "17:45",
        isha: "19:00",
      },
    };

    return (
      baseTimes[location.id as keyof typeof baseTimes] || baseTimes.jakarta
    );
  };

  useEffect(() => {
    // Set default location to Jakarta
    const defaultLocation = locations[0];
    setSelectedLocation(defaultLocation);
    onLocationChange(defaultLocation);

    const times = calculatePrayerTimes(defaultLocation);
    setPrayerTimes(times);
    onPrayerTimesChange(times);
  }, []);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setIsOpen(false);
    onLocationChange(location);

    const times = calculatePrayerTimes(location);
    setPrayerTimes(times);
    onPrayerTimesChange(times);
  };

  const getCurrentPrayer = () => {
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
  };

  const parseTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const currentPrayer = getCurrentPrayer();

  return (
    <div className="space-y-4">
      {/* Location Selector */}
      <Card className="border-awqaf-border-light">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-awqaf-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground text-sm font-comfortaa">
                  Lokasi
                </h3>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                  {selectedLocation?.city}, {selectedLocation?.country}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-awqaf-foreground-secondary hover:text-awqaf-primary"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>

          {/* Location Dropdown */}
          {isOpen && (
            <div className="mt-4 space-y-2">
              {locations.map((location) => (
                <Button
                  key={location.id}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-3 hover:bg-accent-50"
                  onClick={() => handleLocationSelect(location)}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-awqaf-foreground-secondary" />
                    <div>
                      <p className="font-medium text-card-foreground text-sm font-comfortaa">
                        {location.name}
                      </p>
                      <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                        {location.city}, {location.country}
                      </p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Prayer Time */}
      {currentPrayer && prayerTimes && (
        <Card className="border-awqaf-border-light bg-gradient-to-r from-accent-100 to-accent-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Clock className="w-5 h-5 text-awqaf-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-awqaf-primary text-sm font-comfortaa">
                    Waktu Sholat {currentPrayer.name}
                  </h3>
                  <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                    {prayerTimes[currentPrayer.key as keyof PrayerTimes]}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-awqaf-primary font-comfortaa">
                  {prayerTimes[currentPrayer.key as keyof PrayerTimes]}
                </div>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                  WIB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
