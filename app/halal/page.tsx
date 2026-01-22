"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Star, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import LocationSelector, { LocationData } from "./components/LocationSelector";
import RestaurantCard from "./components/RestaurantCard";
import SearchFilter, { FilterOptions } from "./components/SearchFilter";
import { useGetPlacesQuery } from "@/services/public/places.service";
import { Place } from "@/types/public/places";
import { useI18n } from "@/app/hooks/useI18n";

export default function HalalPage() {
  const { t, locale } = useI18n();

  const [currentLocation, setCurrentLocation] = useState<LocationData>({
    name: "Jakarta",
    latitude: -6.2088,
    longitude: 106.8456,
  });

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: "",
    minRating: 0,
    maxDistance: 10,
    sortBy: "distance",
  });

  const {
    data: placesData,
    isLoading,
    isFetching,
  } = useGetPlacesQuery({
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    radius: filters.maxDistance,
  });

  const getPlaceContent = (place: Place) => {
    const localized = place.translations.find((t) => t.locale === locale);
    if (localized && localized.name) {
      return { name: localized.name, description: localized.description };
    }
    const idFallback = place.translations.find((t) => t.locale === "id");
    if (idFallback && idFallback.name) {
      return { name: idFallback.name, description: idFallback.description };
    }
    return { name: place.name, description: place.description };
  };

  const filteredPlaces = useMemo(() => {
    if (!placesData) return [];

    let result = placesData.filter(
      (place) => place.type.toLowerCase() === "restaurant",
    );

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter((place) => {
        const content = getPlaceContent(place);
        return (
          content.name.toLowerCase().includes(q) ||
          content.description.toLowerCase().includes(q)
        );
      });
    }

    if (filters.minRating > 0) {
      result = result.filter(
        (place) => parseFloat(place.rating) >= filters.minRating,
      );
    }

    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "rating":
          return parseFloat(b.rating) - parseFloat(a.rating);
        case "distance":
          return a.distance - b.distance;
        case "name":
          const nameA = getPlaceContent(a).name;
          const nameB = getPlaceContent(b).name;
          return nameA.localeCompare(nameB);
        default:
          return 0;
      }
    });

    return result;
  }, [placesData, filters, locale]);

  const handleLocationChange = (location: LocationData) => {
    setCurrentLocation(location);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 p-0 rounded-full bg-accent-100 hover:bg-accent-200 hover:text-awqaf-primary transition-colors duration-200"
                  >
                    <ArrowLeft className="w-5 h-5 text-awqaf-primary" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                    {t("halal.title") || "Kuliner Halal"}
                  </h1>
                  <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                    {t("halal.subtitle") || "Temukan makanan halal terdekat"}
                  </p>
                </div>
              </div>
              <Badge className="bg-success text-white text-xs px-2 py-1">
                Halal
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <LocationSelector
          currentLocation={currentLocation}
          onLocationChange={handleLocationChange}
        />

        <SearchFilter
          onFilterChange={setFilters}
          onSearch={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
        />

        <Card className="border-awqaf-border-light bg-gradient-to-r from-accent-100 to-accent-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-awqaf-primary" />
                <span className="text-sm font-medium text-awqaf-primary font-comfortaa">
                  {isLoading || isFetching
                    ? "Memuat..."
                    : `${filteredPlaces.length} Tempat Ditemukan`}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-warning" />
                <span className="text-xs text-awqaf-foreground-secondary font-comfortaa max-w-[150px] truncate">
                  Sekitar {currentLocation.name}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {isLoading || isFetching ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 rounded-xl animate-pulse"
              />
            ))
          ) : filteredPlaces.length > 0 ? (
            filteredPlaces.map((place) => {
              const content = getPlaceContent(place);
              return (
                <RestaurantCard
                  key={place.id}
                  place={place}
                  localizedContent={content}
                />
              );
            })
          ) : (
            <Card className="border-awqaf-border-light">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UtensilsCrossed className="w-8 h-8 text-awqaf-foreground-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-awqaf-foreground-secondary font-comfortaa mb-2">
                  Tidak ada restoran ditemukan
                </h3>
                <p className="text-sm text-awqaf-foreground-tertiary font-comfortaa">
                  Coba ubah filter jarak atau cari lokasi lain.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}