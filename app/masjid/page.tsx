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
  ArrowLeft, // Import ArrowLeft
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// Import Service
import { useGetPlacesQuery } from "@/services/public/places.service";
import { Place } from "@/types/public/places";
import { useI18n } from "@/app/hooks/useI18n";
import ImageWithFallback from "../donasi/components/ImageWithFallback";

// --- TYPES ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

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
}

interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

interface MosqueTranslations {
  title: string;
  searchPlaceholder: string;
  searchRadius: string;
  loading: string;
  placesFound: string;
  noPlacesFound: string;
  tryDifferent: string;
  currentLoc: string;
  detecting: string;
  detected: string;
  error: string;
  all: string;
  mosque: string;
  mushola: string;
  distance: string;
  rating: string;
  name: string;
  open24: string;
  closed: string;
  facilities: string;
  navigate: string;
  capacity: string;
}

// --- TRANSLATION DICTIONARY ---
const MOSQUE_TEXT: Record<LocaleCode, MosqueTranslations> = {
  id: {
    title: "Masjid & Mushola",
    searchPlaceholder: "Cari masjid atau mushola...",
    searchRadius: "Radius Pencarian",
    loading: "Memuat...",
    placesFound: "Tempat Ditemukan",
    noPlacesFound: "Tidak ada masjid/mushola ditemukan",
    tryDifferent: "Coba perluas radius pencarian atau ubah lokasi.",
    currentLoc: "Lokasi Saat Ini",
    detecting: "Mencari...",
    detected: "Lokasi terdeteksi",
    error: "Gagal mengambil lokasi",
    all: "Semua",
    mosque: "Masjid",
    mushola: "Mushola",
    distance: "Jarak",
    rating: "Rating",
    name: "Nama",
    open24: "Buka 24 Jam",
    closed: "Tutup",
    facilities: "Fasilitas",
    navigate: "Navigasi",
    capacity: "jamaah",
  },
  en: {
    title: "Mosque & Prayer Room",
    searchPlaceholder: "Search mosque or prayer room...",
    searchRadius: "Search Radius",
    loading: "Loading...",
    placesFound: "Places Found",
    noPlacesFound: "No mosques found",
    tryDifferent: "Try expanding search radius or change location.",
    currentLoc: "Current Location",
    detecting: "Detecting...",
    detected: "Location detected",
    error: "Failed to get location",
    all: "All",
    mosque: "Mosque",
    mushola: "Mushola",
    distance: "Distance",
    rating: "Rating",
    name: "Name",
    open24: "Open 24 Hours",
    closed: "Closed",
    facilities: "Facilities",
    navigate: "Navigate",
    capacity: "worshipers",
  },
  ar: {
    title: "المساجد والمصليات",
    searchPlaceholder: "ابحث عن مسجد أو مصلى...",
    searchRadius: "نطاق البحث",
    loading: "جار التحميل...",
    placesFound: "أماكن تم العثور عليها",
    noPlacesFound: "لم يتم العثور على مساجد",
    tryDifferent: "حاول توسيع نطاق البحث أو تغيير الموقع.",
    currentLoc: "الموقع الحالي",
    detecting: "جاري الكشف...",
    detected: "تم تحديد الموقع",
    error: "فشل الحصول على الموقع",
    all: "الكل",
    mosque: "مسجد",
    mushola: "مصلى",
    distance: "المسافة",
    rating: "التقييم",
    name: "الاسم",
    open24: "مفتوح ٢٤ ساعة",
    closed: "مغلق",
    facilities: "مرافق",
    navigate: "توجيه",
    capacity: "مصلين",
  },
  fr: {
    title: "Mosquée & Salle de Prière",
    searchPlaceholder: "Rechercher mosquée...",
    searchRadius: "Rayon de recherche",
    loading: "Chargement...",
    placesFound: "Lieux Trouvés",
    noPlacesFound: "Aucune mosquée trouvée",
    tryDifferent: "Essayez d'étendre le rayon ou changez de lieu.",
    currentLoc: "Position Actuelle",
    detecting: "Détection...",
    detected: "Position détectée",
    error: "Échec de localisation",
    all: "Tout",
    mosque: "Mosquée",
    mushola: "Mushola",
    distance: "Distance",
    rating: "Note",
    name: "Nom",
    open24: "Ouvert 24h/24",
    closed: "Fermé",
    facilities: "Installations",
    navigate: "Naviguer",
    capacity: "fidèles",
  },
  kr: {
    title: "모스크 & 기도실",
    searchPlaceholder: "모스크 검색...",
    searchRadius: "검색 반경",
    loading: "로딩 중...",
    placesFound: "발견된 장소",
    noPlacesFound: "모스크를 찾을 수 없습니다",
    tryDifferent: "검색 반경을 넓히거나 위치를 변경해 보세요.",
    currentLoc: "현재 위치",
    detecting: "탐색 중...",
    detected: "위치 감지됨",
    error: "위치 가져오기 실패",
    all: "전체",
    mosque: "모스크",
    mushola: "무숄라",
    distance: "거리",
    rating: "평점",
    name: "이름",
    open24: "24시간 개방",
    closed: "닫힘",
    facilities: "시설",
    navigate: "길찾기",
    capacity: "명 수용",
  },
  jp: {
    title: "モスク & 礼拝室",
    searchPlaceholder: "モスクを検索...",
    searchRadius: "検索範囲",
    loading: "読み込み中...",
    placesFound: "見つかった場所",
    noPlacesFound: "モスクが見つかりません",
    tryDifferent: "検索範囲を広げるか、場所を変更してください。",
    currentLoc: "現在の位置",
    detecting: "検出中...",
    detected: "位置検出済み",
    error: "位置情報の取得に失敗しました",
    all: "すべて",
    mosque: "モスク",
    mushola: "ムショラ",
    distance: "距離",
    rating: "評価",
    name: "名前",
    open24: "24時間営業",
    closed: "閉店",
    facilities: "施設",
    navigate: "ナビ開始",
    capacity: "人収容",
  },
};

export default function MasjidPage() {
  const { locale } = useI18n();
  const safeLocale = (
    MOSQUE_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = MOSQUE_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<
    "all" | "masjid" | "mushola"
  >("all");
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "name">(
    "distance",
  );

  const [radius, setRadius] = useState([5]);

  const [userLocation, setUserLocation] = useState<Location>({
    latitude: -6.2088,
    longitude: 106.8456,
    city: "Jakarta",
    country: "Indonesia",
  });

  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Hook API Service
  const {
    data: placesData,
    isLoading: isLoadingPlaces,
    isFetching,
  } = useGetPlacesQuery({
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    radius: radius[0],
  });

  const getPlaceContent = (place: Place) => {
    const localized = place.translations.find((t) => t.locale === locale);
    const idFallback = place.translations.find((t) => t.locale === "id");

    const name = localized?.name || idFallback?.name || place.name;
    const description =
      localized?.description || idFallback?.description || place.description;
    const address = place.address;

    return { name, description, address };
  };

  const getCurrentLocation = async () => {
    setIsLocating(true);
    setLocationError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser.");
      }

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000,
          });
        },
      );

      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${locale}`,
        );
        const data = await response.json();

        setUserLocation({
          latitude,
          longitude,
          city: data.city || data.locality || t.currentLoc,
          country: data.countryName || "Indonesia",
        });
      } catch {
        setUserLocation({
          latitude,
          longitude,
          city: t.currentLoc,
          country: "Indonesia",
        });
      }
    } catch (err: unknown) {
      let errorMessage = t.error;

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "object" && err !== null && "message" in err) {
        errorMessage = String((err as { message: unknown }).message);
      }

      setLocationError(errorMessage);
    } finally {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const processedData = useMemo(() => {
    if (!placesData) return [];

    const baseList = placesData
      .filter((p) => {
        const type = p.type.toLowerCase();
        return type.includes("masjid") || type.includes("mushola");
      })
      .map((place) => {
        return {
          ...place,
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
        } as Masjid;
      });

    let filtered = baseList;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((masjid) => {
        const content = getPlaceContent(masjid);
        return (
          content.name.toLowerCase().includes(q) ||
          content.address.toLowerCase().includes(q)
        );
      });
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((masjid) =>
        masjid.type?.toLowerCase().includes(selectedType),
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return a.distance - b.distance;
        case "rating":
          return parseFloat(b.rating) - parseFloat(a.rating);
        case "name":
          const nameA = getPlaceContent(a).name;
          const nameB = getPlaceContent(b).name;
          return nameA.localeCompare(nameB);
        default:
          return 0;
      }
    });

    return filtered;
  }, [placesData, searchQuery, sortBy, selectedType, locale]);

  const formatDistance = (distance?: number): string => {
    if (!distance) return "-";
    if (distance < 1) return `${Math.round(distance * 1000)} m`;
    return `${distance.toFixed(1)} km`;
  };

  const formatCapacity = (capacity: number): string => {
    if (capacity >= 1000) {
      return `${(capacity / 1000).toFixed(1)}K ${t.capacity}`;
    }
    return `${capacity} ${t.capacity}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    return new Intl.DateTimeFormat(safeLocale === "id" ? "id-ID" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(now);
  };

  const isLoading = isLocating || isLoadingPlaces || isFetching;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              {/* TOMBOL BACK (ARROW LEFT) */}
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200 ${
                    isRtl ? "rotate-180" : ""
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>

              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                {t.title}
              </h1>

              {/* Refresh Button */}
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary"
                onClick={() => {
                  getCurrentLocation();
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
              <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-awqaf-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div>
                  <p className="font-medium text-card-foreground font-comfortaa truncate">
                    {userLocation.city}, {userLocation.country}
                  </p>
                  <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                    {getCurrentTime()} • {isLocating ? t.detecting : t.detected}
                  </p>
                </div>
              </div>
              {!locationError ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
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
                <Search
                  className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-awqaf-foreground-secondary ${
                    isRtl ? "right-3" : "left-3"
                  }`}
                />
                <Input
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`font-comfortaa ${isRtl ? "pr-10" : "pl-10"}`}
                />
              </div>

              {/* Radius Slider */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-700 font-comfortaa flex items-center gap-1">
                    <div className="w-4 h-4 border-2 border-gray-400 rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                    {t.searchRadius}
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
                  className="w-full accent-awqaf-primary"
                />
              </div>
            </CardContent>
          </Card>

          {/* Filters Types & Sorting */}
          <div className="flex gap-2 overflow-x-auto pb-2 items-center mobile-scroll">
            <Button
              variant={selectedType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("all")}
              className={`flex-shrink-0 font-comfortaa ${
                selectedType === "all" ? "bg-awqaf-primary text-white" : ""
              }`}
            >
              {t.all}
            </Button>
            <Button
              variant={selectedType === "masjid" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("masjid")}
              className={`flex-shrink-0 font-comfortaa ${
                selectedType === "masjid" ? "bg-awqaf-primary text-white" : ""
              }`}
            >
              {t.mosque}
            </Button>
            <Button
              variant={selectedType === "mushola" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("mushola")}
              className={`flex-shrink-0 font-comfortaa ${
                selectedType === "mushola" ? "bg-awqaf-primary text-white" : ""
              }`}
            >
              {t.mushola}
            </Button>

            <div className="flex-shrink-0 flex items-center gap-1 ml-2 bg-white px-2 py-1 rounded-md border border-awqaf-border-light">
              <Filter className="w-3 h-3 text-awqaf-foreground-secondary" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-xs bg-transparent border-none outline-none text-awqaf-foreground-secondary font-comfortaa"
                dir={isRtl ? "rtl" : "ltr"}
              >
                <option value="distance">{t.distance}</option>
                <option value="rating">{t.rating}</option>
                <option value="name">{t.name}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Masjid List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-awqaf-primary font-comfortaa">
              {isLoadingPlaces
                ? t.loading
                : `${processedData.length} ${t.placesFound}`}
            </h2>
          </div>

          <div className="space-y-4">
            {isLoadingPlaces ? (
              <div className="text-center py-10">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-awqaf-primary" />
                <p className="text-sm text-gray-500 mt-2 font-comfortaa">
                  {t.loading}
                </p>
              </div>
            ) : (
              processedData.map((masjid) => {
                const content = getPlaceContent(masjid);
                return (
                  <Card
                    key={masjid.id}
                    className="border-awqaf-border-light hover:shadow-md transition-shadow duration-200 overflow-hidden"
                  >
                    <CardContent className="p-4 space-y-4">
                      {/* Image */}
                      <div className="relative">
                        <ImageWithFallback
                          src={
                            masjid.image ||
                            "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=627&auto=format&fit=crop"
                          }
                          alt={content.name}
                          width={400}
                          height={200}
                          className="w-full h-40 object-cover rounded-lg bg-gray-100"
                        />
                      </div>

                      {/* Title & Rating */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-card-foreground font-comfortaa line-clamp-1">
                              {content.name}
                            </h3>
                            <Badge
                              variant={
                                masjid.type?.toLowerCase().includes("masjid")
                                  ? "default"
                                  : "secondary"
                              }
                              className={`text-[10px] ${
                                masjid.type?.toLowerCase().includes("masjid")
                                  ? "bg-awqaf-primary hover:bg-awqaf-primary/90"
                                  : "bg-accent-100 text-awqaf-primary hover:bg-accent-200"
                              }`}
                            >
                              {masjid.type?.toLowerCase().includes("mushola")
                                ? t.mushola
                                : t.mosque}
                            </Badge>
                          </div>

                          <div
                            className="text-sm text-awqaf-foreground-secondary font-comfortaa line-clamp-2"
                            dangerouslySetInnerHTML={{
                              __html: content.address,
                            }}
                          />
                        </div>

                        <div
                          className={`text-right ${isRtl ? "pr-2" : "pl-2"}`}
                        >
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
                      <div className="grid grid-cols-2 gap-4 border-t border-awqaf-border-light pt-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-awqaf-foreground-secondary" />
                          <span className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                            {formatCapacity(masjid.capacity)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-awqaf-foreground-secondary" />
                          <span className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                            {masjid.isOpen ? t.open24 : t.closed}
                          </span>
                        </div>
                      </div>

                      {/* Facilities */}
                      {masjid.facilities && masjid.facilities.length > 0 && (
                        <div>
                          <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mb-2 font-semibold">
                            {t.facilities}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {masjid.facilities
                              .slice(0, 4)
                              .map((facility, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-[10px] border-awqaf-border-light text-gray-600"
                                >
                                  {facility}
                                </Badge>
                              ))}
                            {masjid.facilities.length > 4 && (
                              <Badge
                                variant="outline"
                                className="text-[10px] border-awqaf-border-light"
                              >
                                +{masjid.facilities.length - 4}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 font-comfortaa border-awqaf-primary/20 text-awqaf-primary hover:bg-awqaf-primary/5"
                          onClick={() => {
                            const url = `https://www.google.com/maps/dir/?api=1&destination=${masjid.latitude},${masjid.longitude}`;
                            window.open(url, "_blank");
                          }}
                        >
                          <Car
                            className={`w-4 h-4 ${isRtl ? "ml-2" : "mr-2"}`}
                          />{" "}
                          {t.navigate}
                        </Button>
                        {masjid.contact?.website && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-awqaf-border-light hover:bg-accent-50"
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
                );
              })
            )}
          </div>

          {!isLoadingPlaces && processedData.length === 0 && (
            <Card className="border-awqaf-border-light">
              <CardContent className="p-8 text-center">
                <MapPin className="w-12 h-12 text-awqaf-foreground-secondary mx-auto mb-4" />
                <h3 className="font-semibold text-card-foreground font-comfortaa mb-2">
                  {t.noPlacesFound}
                </h3>
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  {t.tryDifferent}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}