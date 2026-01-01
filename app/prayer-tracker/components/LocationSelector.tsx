"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { Location } from "../hooks/usePrayerTracker";

interface LocationSelectorProps {
  currentLocation: Location;
  onLocationChange: (location: Location) => void;
}

export default function LocationSelector({
  currentLocation,
  onLocationChange,
}: LocationSelectorProps) {
  const [isLocating, setIsLocating] = useState(false);

  const handleAutoLocate = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Reverse geocode optional, but good for UI
          // For now we set basic info
          const newLocation: Location = {
            id: "auto",
            name: "Lokasi Anda",
            city: "Terdeteksi",
            country: "Indonesia",
            latitude,
            longitude,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          };

          onLocationChange(newLocation);
          setIsLocating(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Gagal mendapatkan lokasi. Pastikan GPS aktif.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Browser tidak mendukung geolocation");
      setIsLocating(false);
    }
  };

  return (
    <Card className="border-awqaf-border-light">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-awqaf-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground text-sm font-comfortaa">
                Lokasi Sholat
              </h3>
              <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                {currentLocation.city}
                <span className="opacity-50 text-[10px] ml-1">
                  ({currentLocation.latitude.toFixed(2)},{" "}
                  {currentLocation.longitude.toFixed(2)})
                </span>
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAutoLocate}
            disabled={isLocating}
            className="text-xs h-8"
          >
            {isLocating ? (
              <Loader2 className="w-3 h-3 animate-spin mr-1" />
            ) : (
              <Navigation className="w-3 h-3 mr-1" />
            )}
            Auto Detect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}