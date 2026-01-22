"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, ChevronDown, Loader2 } from "lucide-react";

export interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
}

interface LocationSelectorProps {
  currentLocation: LocationData;
  onLocationChange: (location: LocationData) => void;
}

export default function LocationSelector({
  currentLocation,
  onLocationChange,
}: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const cities: LocationData[] = [
    { name: "Jakarta Pusat", latitude: -6.1805, longitude: 106.8284 },
    { name: "Bandung", latitude: -6.9175, longitude: 107.6191 },
    { name: "Surabaya", latitude: -7.2575, longitude: 112.7521 },
    { name: "Yogyakarta", latitude: -7.7956, longitude: 110.3695 },
    { name: "Semarang", latitude: -6.9667, longitude: 110.4167 },
    { name: "Wonosobo", latitude: -7.3632, longitude: 109.9001 },
  ];

  const handleCitySelect = (city: LocationData) => {
    onLocationChange(city);
    setIsOpen(false);
  };

  const handleCurrentLocation = () => {
    setIsLoadingLocation(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          let locationName = "Lokasi Saya";

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            );
            const data = await res.json();
            if (data && data.address) {
              locationName =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                "Lokasi Terkini";
            }
          } catch (e) {
            console.error("Geocoding failed", e);
          }

          onLocationChange({
            name: locationName,
            latitude,
            longitude,
          });

          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Gagal mengambil lokasi. Pastikan GPS aktif.");
          setIsLoadingLocation(false);
        },
      );
    } else {
      alert("Browser anda tidak mendukung Geolocation.");
      setIsLoadingLocation(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-awqaf-border-light">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-awqaf-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-card-foreground text-sm font-comfortaa">
                  Lokasi Saat Ini
                </h3>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa truncate">
                  {currentLocation.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCurrentLocation}
                disabled={isLoadingLocation}
                className="text-awqaf-foreground-secondary hover:text-awqaf-primary"
                title="Gunakan GPS"
              >
                {isLoadingLocation ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="text-awqaf-foreground-secondary hover:text-awqaf-primary"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </Button>
            </div>
          </div>

          {isOpen && (
            <div className="mt-4 space-y-2 border-t pt-2">
              <p className="text-xs text-gray-500 mb-2">Pilih Kota Populer:</p>
              {cities.map((city) => (
                <Button
                  key={city.name}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-2 hover:bg-accent-50"
                  onClick={() => handleCitySelect(city)}
                >
                  <MapPin className="w-4 h-4 text-awqaf-foreground-secondary mr-2" />
                  <span className="text-sm font-comfortaa">{city.name}</span>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}