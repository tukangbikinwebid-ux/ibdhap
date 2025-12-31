"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  MapPin,
  Navigation,
  Clock,
  Users,
  Star,
  Globe,
  Car,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// Sesuaikan path import
import { useGetPublicPlacesQuery } from "@/services/public/masjid-halal.service";
import { Place } from "@/types/public/place";

// Mapping Interface
interface Masjid extends Place {
  reviewCount: number;
  capacity: number;
  isOpen: boolean;
  prayerTimes?: {
    subuh: string;
    dzuhur: string;
    ashar: string;
    maghrib: string;
    isya: string;
  };
  contact?: {
    phone?: string;
    website?: string;
  };
  ratingNum: number;
  latNum: number;
  lngNum: number;
}

interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export default function MasjidPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<
    "all" | "masjid" | "mushola"
  >("all");
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "name">(
    "distance"
  );

  // Radius state (default 5km misalnya)
  const [radius, setRadius] = useState([5]);

  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Hook API Service: Params dinamis mengikuti user location dan radius
  const {
    data: places,
    isLoading: isLoadingPlaces,
    isFetching,
    refetch,
  } = useGetPublicPlacesQuery(
    {
      latitude: userLocation?.latitude || -6.2,
      longitude: userLocation?.longitude || 106.816666,
      radius: radius[0], // Ambil nilai radius dari state
    },
    {
      skip: !userLocation, // Tunggu sampai lokasi didapat
    }
  );

  const getCurrentLocation = async () => {
    setIsLocating(true);
    setLocationError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation tidak didukung oleh browser ini");
      }

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000,
          });
        }
      );

      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`
        );
        const data = await response.json();

        setUserLocation({
          latitude,
          longitude,
          city: data.city || data.locality || "Lokasi Anda",
          country: data.countryName || "Indonesia",
        });
      } catch {
        setUserLocation({
          latitude,
          longitude,
          city: "Lokasi Terkini",
          country: "Indonesia",
        });
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mendapatkan lokasi";
      setLocationError(errorMessage);
    } finally {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const masjidData: Masjid[] = useMemo(() => {
    if (!places) return [];

    return places.map((place) => {
      const ratingVal = parseFloat(place.rating) || 0;
      const latVal = parseFloat(place.latitude) || 0;
      const lngVal = parseFloat(place.longitude) || 0;

      return {
        ...place,
        ratingNum: ratingVal,
        latNum: latVal,
        lngNum: lngVal,
        reviewCount: Math.floor(Math.random() * 500) + 50,
        capacity: Math.floor(Math.random() * 2000) + 100,
        isOpen: true,
        prayerTimes: {
          subuh: "04:30",
          dzuhur: "12:00",
          ashar: "15:15",
          maghrib: "18:00",
          isya: "19:15",
        },
      };
    });
  }, [places]);

  const filteredMasjidData = useMemo(() => {
    let filtered = masjidData;

    if (searchQuery) {
      filtered = filtered.filter(
        (masjid) =>
          masjid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          masjid.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return (a.distance || 0) - (b.distance || 0);
        case "rating":
          return (b.ratingNum || 0) - (a.ratingNum || 0);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [masjidData, searchQuery, sortBy]); // selectedType removed temporarily as per logic

  // Helpers
  const formatDistance = (distance?: number): string => {
    if (!distance) return "Jarak tidak diketahui";
    if (distance < 1) {
      return `${Math.round(distance * 1000)} meter`;
    }
    return `${distance.toFixed(1)} km`;
  };

  const formatCapacity = (capacity: number): string => {
    if (capacity >= 1000) {
      return `${(capacity / 1000).toFixed(1)}K jamaah`;
    }
    return `${capacity} jamaah`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isLoading = isLocating || isLoadingPlaces || isFetching;

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary"
                >
                  <Navigation className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                Masjid & Mushola
              </h1>
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary"
                onClick={() => {
                  getCurrentLocation();
                  if (userLocation) refetch();
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Location Status */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-awqaf-primary" />
              </div>
              <div className="flex-1">
                {userLocation ? (
                  <div>
                    <p className="font-medium text-card-foreground font-comfortaa">
                      {userLocation.city}, {userLocation.country}
                    </p>
                    <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                      {getCurrentTime()} • Lokasi terdeteksi
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-card-foreground font-comfortaa">
                      Lokasi belum terdeteksi
                    </p>
                    <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                      Aktifkan GPS
                    </p>
                  </div>
                )}
              </div>
              {userLocation ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              )}
            </div>
          </CardContent>
        </Card>

        {locationError && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800 font-comfortaa">Error</p>
                <p className="text-sm text-red-700 font-comfortaa">
                  {locationError}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* --- SEARCH & RADIUS CONTROL --- */}
        <div className="space-y-4">
          <Card className="border-awqaf-border-light">
            <CardContent className="p-4 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-awqaf-foreground-secondary" />
                <Input
                  placeholder="Cari masjid atau mushola..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 font-comfortaa"
                />
              </div>

              {/* Radius Slider */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700 font-comfortaa flex items-center gap-1">
                    {/* Icon Radius (opsional, bisa pakai MapPin/Circle) */}
                    <div className="w-4 h-4 border-2 border-gray-400 rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                    Radius Pencarian
                  </label>
                  <span className="text-xs font-bold text-awqaf-primary bg-accent-50 px-2 py-1 rounded-full">
                    {radius[0]} km
                  </span>
                </div>
                <Slider
                  defaultValue={[5]}
                  max={50}
                  min={1}
                  step={1}
                  value={radius}
                  onValueChange={(val) => setRadius(val)}
                  className="w-full"
                />
                <p className="text-[10px] text-gray-400 text-center font-comfortaa">
                  Geser untuk memperluas jangkauan area
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Filters Types & Sorting */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("all")}
              className="flex-shrink-0"
            >
              Semua
            </Button>
            <Button
              variant={selectedType === "masjid" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("masjid")}
              className="flex-shrink-0"
            >
              Masjid
            </Button>
            <Button
              variant={selectedType === "mushola" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("mushola")}
              className="flex-shrink-0"
            >
              Mushola
            </Button>
            <div className="flex-shrink-0 flex items-center gap-1 ml-2">
              <Filter className="w-4 h-4 text-awqaf-foreground-secondary" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-sm bg-transparent border-none outline-none text-awqaf-foreground-secondary"
              >
                <option value="distance">Jarak</option>
                <option value="rating">Rating</option>
                <option value="name">Nama</option>
              </select>
            </div>
          </div>
        </div>

        {/* Masjid List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
              {isLoadingPlaces
                ? "Memuat..."
                : `${filteredMasjidData.length} Tempat Ibadah Ditemukan`}
            </h2>
          </div>

          <div className="space-y-4">
            {isLoadingPlaces ? (
              <div className="text-center py-10">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-awqaf-primary" />
                <p className="text-sm text-gray-500 mt-2 font-comfortaa">
                  Mencari tempat ibadah terdekat ({radius[0]} km)...
                </p>
              </div>
            ) : (
              filteredMasjidData.map((masjid) => (
                <Card
                  key={masjid.id}
                  className="border-awqaf-border-light hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4 space-y-4">
                    {/* Image */}
                    <div>
                      <Image
                        unoptimized
                        src={
                          masjid.image ||
                          "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=627&auto=format&fit=crop"
                        }
                        alt={masjid.name}
                        width={400}
                        height={200}
                        className="w-full h-40 object-cover rounded-lg bg-gray-100"
                      />
                    </div>

                    {/* Title & Rating */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-card-foreground font-comfortaa">
                            {masjid.name}
                          </h3>
                          <Badge
                            variant={
                              masjid.type?.toLowerCase().includes("masjid")
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {masjid.type?.toLowerCase().includes("mushola")
                              ? "Mushola"
                              : "Masjid"}
                          </Badge>
                        </div>
                        <div
                          className="text-sm text-awqaf-foreground-secondary font-comfortaa line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: masjid.address }}
                        />
                      </div>
                      <div className="text-right pl-2">
                        <div className="flex items-center justify-end gap-1 mb-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium text-card-foreground font-comfortaa">
                            {masjid.rating}
                          </span>
                          <span className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                            ({masjid.reviewCount})
                          </span>
                        </div>
                        <p className="text-xs text-awqaf-foreground-secondary font-comfortaa font-bold text-awqaf-primary">
                          {formatDistance(masjid.distance)}
                        </p>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-awqaf-foreground-secondary" />
                        <span className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                          {formatCapacity(masjid.capacity)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-awqaf-foreground-secondary" />
                        <span className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                          {masjid.isOpen ? "Buka 24 Jam" : "Tutup"}
                        </span>
                      </div>
                    </div>

                    {/* Facilities */}
                    <div>
                      <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mb-2">
                        Fasilitas:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {masjid.facilities.slice(0, 4).map((facility, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {facility}
                          </Badge>
                        ))}
                        {masjid.facilities.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{masjid.facilities.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          const url = `https://www.google.com/maps/dir/?api=1&destination=$${masjid.latitude},${masjid.longitude}`;
                          window.open(url, "_blank");
                        }}
                      >
                        <Car className="w-4 h-4 mr-2" /> Navigasi
                      </Button>
                      {masjid.contact?.website && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(masjid.contact?.website, "_blank")
                          }
                        >
                          <Globe className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {!isLoadingPlaces && filteredMasjidData.length === 0 && (
            <Card className="border-awqaf-border-light">
              <CardContent className="p-8 text-center">
                <MapPin className="w-12 h-12 text-awqaf-foreground-secondary mx-auto mb-4" />
                <h3 className="font-semibold text-card-foreground font-comfortaa mb-2">
                  Tidak ada tempat ibadah ditemukan
                </h3>
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  Coba perluas radius pencarian menjadi{" "}
                  {Math.min(radius[0] + 5, 50)} km
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}