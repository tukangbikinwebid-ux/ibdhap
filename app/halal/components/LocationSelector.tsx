"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, ChevronDown } from "lucide-react";

interface City {
  id: string;
  name: string;
  province: string;
  latitude: number;
  longitude: number;
}

interface LocationSelectorProps {
  onLocationChange: (location: City | null) => void;
  onCurrentLocationChange: (location: City | null) => void;
}

export default function LocationSelector({
  onLocationChange,
  onCurrentLocationChange,
}: LocationSelectorProps) {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Sample cities data
  const cities: City[] = [
    {
      id: "jakarta",
      name: "Jakarta",
      province: "DKI Jakarta",
      latitude: -6.2088,
      longitude: 106.8456,
    },
    {
      id: "bandung",
      name: "Bandung",
      province: "Jawa Barat",
      latitude: -6.9175,
      longitude: 107.6191,
    },
    {
      id: "surabaya",
      name: "Surabaya",
      province: "Jawa Timur",
      latitude: -7.2575,
      longitude: 112.7521,
    },
    {
      id: "medan",
      name: "Medan",
      province: "Sumatera Utara",
      latitude: 3.5952,
      longitude: 98.6722,
    },
    {
      id: "makassar",
      name: "Makassar",
      province: "Sulawesi Selatan",
      latitude: -5.1477,
      longitude: 119.4327,
    },
    {
      id: "yogyakarta",
      name: "Yogyakarta",
      province: "DI Yogyakarta",
      latitude: -7.7956,
      longitude: 110.3695,
    },
    {
      id: "semarang",
      name: "Semarang",
      province: "Jawa Tengah",
      latitude: -6.9667,
      longitude: 110.4167,
    },
    {
      id: "palembang",
      name: "Palembang",
      province: "Sumatera Selatan",
      latitude: -2.9909,
      longitude: 104.7565,
    },
  ];

  useEffect(() => {
    // Set default city to Jakarta
    const defaultCity = cities[0];
    setSelectedCity(defaultCity);
    onLocationChange(defaultCity);
  }, []);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setIsOpen(false);
    onLocationChange(city);
  };

  const handleCurrentLocation = () => {
    setIsLoadingLocation(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Find nearest city based on coordinates
          const nearestCity = findNearestCity(latitude, longitude);

          if (nearestCity) {
            setSelectedCity(nearestCity);
            onCurrentLocationChange(nearestCity);
          }

          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoadingLocation(false);
          // Fallback to Jakarta if location access fails
          const defaultCity = cities[0];
          setSelectedCity(defaultCity);
          onCurrentLocationChange(defaultCity);
        }
      );
    } else {
      setIsLoadingLocation(false);
      // Fallback to Jakarta if geolocation is not supported
      const defaultCity = cities[0];
      setSelectedCity(defaultCity);
      onCurrentLocationChange(defaultCity);
    }
  };

  const findNearestCity = (userLat: number, userLon: number): City | null => {
    let nearestCity: City | null = null;
    let minDistance = Infinity;

    cities.forEach((city) => {
      const distance = calculateDistance(
        userLat,
        userLon,
        city.latitude,
        city.longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = city;
      }
    });

    return nearestCity;
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

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
                  {selectedCity?.name}, {selectedCity?.province}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCurrentLocation}
                disabled={isLoadingLocation}
                className="text-awqaf-foreground-secondary hover:text-awqaf-primary"
              >
                <Navigation className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="text-awqaf-foreground-secondary hover:text-awqaf-primary"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* City Dropdown */}
          {isOpen && (
            <div className="mt-4 space-y-2">
              {cities.map((city) => (
                <Button
                  key={city.id}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-3 hover:bg-accent-50"
                  onClick={() => handleCitySelect(city)}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-awqaf-foreground-secondary" />
                    <div>
                      <p className="font-medium text-card-foreground text-sm font-comfortaa">
                        {city.name}
                      </p>
                      <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                        {city.province}
                      </p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Location Status */}
      {isLoadingLocation && (
        <Card className="border-awqaf-border-light bg-gradient-to-r from-accent-100 to-accent-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Navigation className="w-4 h-4 text-awqaf-primary animate-spin" />
              </div>
              <div>
                <h3 className="font-semibold text-awqaf-primary text-sm font-comfortaa">
                  Mendeteksi Lokasi
                </h3>
                <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                  Mencari restoran halal terdekat...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
