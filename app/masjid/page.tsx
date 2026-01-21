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
// Sesuaikan path import service
import { useGetPublicPlacesQuery } from "@/services/public/masjid-halal.service";
import { Place } from "@/types/public/place";
import { useI18n } from "@/app/hooks/useI18n";

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
  const { t, locale } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<
    "all" | "masjid" | "mushola"
  >("all");
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "name">(
    "distance"
  );

  // Radius state (default 5km)
  const [radius, setRadius] = useState([5]);

  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Hook API Service
  const {
    data: places,
    isLoading: isLoadingPlaces,
    isFetching,
    refetch,
  } = useGetPublicPlacesQuery(
    {
      latitude: userLocation?.latitude || -6.2,
      longitude: userLocation?.longitude || 106.816666,
      radius: radius[0],
    },
    {
      skip: !userLocation,
    }
  );

  const getCurrentLocation = async () => {
    setIsLocating(true);
    setLocationError(null);

    try {
      if (!navigator.geolocation) {
        const errorMessages: Record<string, string> = {
          id: "Geolocation tidak didukung oleh browser ini",
          en: "Geolocation is not supported by this browser",
          ar: "الموقع الجغرافي غير مدعوم في هذا المتصفح",
          fr: "La géolocalisation n'est pas prise en charge par ce navigateur",
          kr: "이 브라우저에서 지리적 위치를 지원하지 않습니다",
          jp: "このブラウザでは位置情報がサポートされていません",
        };
        throw new Error(errorMessages[locale] || errorMessages.id);
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
        const localeMap: Record<string, string> = {
          id: "id",
          en: "en",
          ar: "ar",
          fr: "fr",
          kr: "ko",
          jp: "ja",
        };
        const unknownLocation: Record<string, { city: string; country: string }> = {
          id: { city: "Lokasi Anda", country: "Indonesia" },
          en: { city: "Your Location", country: "Indonesia" },
          ar: { city: "موقعك", country: "إندونيسيا" },
          fr: { city: "Votre localisation", country: "Indonésie" },
          kr: { city: "귀하의 위치", country: "인도네시아" },
          jp: { city: "あなたの場所", country: "インドネシア" },
        };
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${localeMap[locale] || "id"}`
        );
        const data = await response.json();
        const unknown = unknownLocation[locale] || unknownLocation.id;

        setUserLocation({
          latitude,
          longitude,
          city: data.city || data.locality || unknown.city,
          country: data.countryName || unknown.country,
        });
      } catch {
        const unknownLocation: Record<string, { city: string; country: string }> = {
          id: { city: "Lokasi Terkini", country: "Indonesia" },
          en: { city: "Current Location", country: "Indonesia" },
          ar: { city: "الموقع الحالي", country: "إندونيسيا" },
          fr: { city: "Localisation actuelle", country: "Indonésie" },
          kr: { city: "현재 위치", country: "인도네시아" },
          jp: { city: "現在の場所", country: "インド네시아" },
        };
        const unknown = unknownLocation[locale] || unknownLocation.id;
        setUserLocation({
          latitude,
          longitude,
          city: unknown.city,
          country: unknown.country,
        });
      }
    } catch (err: unknown) {
      const errorMessages: Record<string, string> = {
        id: "Terjadi kesalahan saat mendapatkan lokasi",
        en: "An error occurred while getting location",
        ar: "حدث خطأ أثناء الحصول على الموقع",
        fr: "Une erreur s'est produite lors de l'obtention de la localisation",
        kr: "위치를 가져오는 중 오류가 발생했습니다",
        jp: "位置情報の取得中にエラーが発生しました",
      };
      const errorMessage =
        err instanceof Error
          ? err.message
          : errorMessages[locale] || errorMessages.id;
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

    // 1. FILTER TIPE: Hanya ambil yang type-nya mengandung "masjid" atau "mushola"
    // Ini akan membuang tipe "restaurant" atau lainnya
    filtered = filtered.filter((masjid) => {
      const type = masjid.type?.toLowerCase() || "";
      return type.includes("masjid") || type.includes("mushola");
    });

    // 2. Filter Search Query
    if (searchQuery) {
      filtered = filtered.filter(
        (masjid) =>
          masjid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          masjid.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 3. Filter berdasarkan Selected Type (Tab All/Masjid/Mushola)
    if (selectedType !== "all") {
      filtered = filtered.filter((masjid) =>
        masjid.type?.toLowerCase().includes(selectedType)
      );
    }

    // 4. Sorting
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
  }, [masjidData, searchQuery, sortBy, selectedType]);

  // Helpers
  const formatDistance = (distance?: number): string => {
    if (!distance) {
      const unknownMessages: Record<string, string> = {
        id: "Jarak tidak diketahui",
        en: "Distance unknown",
        ar: "المسافة غير معروفة",
        fr: "Distance inconnue",
        kr: "거리 알 수 없음",
        jp: "距離不明",
      };
      return unknownMessages[locale] || unknownMessages.id;
    }
    if (distance < 1) {
      const unit = locale === "id" ? "meter" : locale === "en" ? "meters" : locale === "ar" ? "متر" : locale === "fr" ? "mètres" : locale === "kr" ? "미터" : "メートル";
      return `${Math.round(distance * 1000)} ${unit}`;
    }
    return `${distance.toFixed(1)} ${t("mosque.km")}`;
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
                {t("mosque.title")}
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
                      {t("mosque.locationNotDetected")}
                    </p>
                    <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                      {t("mosque.activateGps")}
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
                  placeholder={locale === "id" ? "Cari masjid atau mushola..." : locale === "en" ? "Search mosque or prayer room..." : locale === "ar" ? "ابحث عن مسجد أو مصلى..." : locale === "fr" ? "Rechercher une mosquée ou une salle de prière..." : locale === "kr" ? "모스크나 기도실 검색..." : "モスクや礼拝室を検索..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 font-comfortaa"
                />
              </div>

              {/* Radius Slider */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700 font-comfortaa flex items-center gap-1">
                    <div className="w-4 h-4 border-2 border-gray-400 rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                    {t("mosque.searchRadius")}
                  </label>
                  <span className="text-xs font-bold text-awqaf-primary bg-accent-50 px-2 py-1 rounded-full">
                    {radius[0]} {t("mosque.km")}
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
                  {t("mosque.dragToExpand")}
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
              {t("mosque.all")}
            </Button>
            <Button
              variant={selectedType === "masjid" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("masjid")}
              className="flex-shrink-0"
            >
              {t("mosque.mosque")}
            </Button>
            <Button
              variant={selectedType === "mushola" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("mushola")}
              className="flex-shrink-0"
            >
              {t("mosque.mushola")}
            </Button>
            <div className="flex-shrink-0 flex items-center gap-1 ml-2">
              <Filter className="w-4 h-4 text-awqaf-foreground-secondary" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-sm bg-transparent border-none outline-none text-awqaf-foreground-secondary"
              >
                <option value="distance">{t("mosque.distance")}</option>
                <option value="rating">{t("mosque.rating")}</option>
                <option value="name">{t("mosque.name")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Masjid List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
              {isLoadingPlaces
                ? t("mosque.loading")
                : `${filteredMasjidData.length} ${t("mosque.placesFound")}`}
            </h2>
          </div>

          <div className="space-y-4">
            {isLoadingPlaces ? (
              <div className="text-center py-10">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-awqaf-primary" />
                <p className="text-sm text-gray-500 mt-2 font-comfortaa">
                  {t("mosque.searchingNearby")} ({radius[0]} {t("mosque.km")})...
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
                              ? t("mosque.mushola")
                              : t("mosque.mosque")}
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
                          {masjid.isOpen ? t("mosque.open24Hours") : t("mosque.closed")}
                        </span>
                      </div>
                    </div>

                    {/* Facilities */}
                    <div>
                      <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mb-2">
                        {t("mosque.facilities")}
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
                        <Car className="w-4 h-4 mr-2" /> {t("mosque.navigate")}
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
                  {t("mosque.noPlacesFound")}
                </h3>
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  {t("mosque.expandRadius")} {Math.min(radius[0] + 5, 50)} {t("mosque.km")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}