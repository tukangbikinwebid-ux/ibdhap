"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Compass,
  MapPin,
  Navigation,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
  Info,
  ArrowLeft,
  Target,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/app/hooks/useI18n";

interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

interface QiblaData {
  direction: number;
  distance: number;
  bearing?: number; // Optional, API might give precise direction
}

// Extend the standard DeviceOrientationEvent interface to include iOS properties
interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}

// Helper to calculate distance manually if needed (Haversine)
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Kaaba coordinates (Mecca) for distance calc fallback
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

export default function QiblaPage() {
  const { t, locale } = useI18n();
  const [location, setLocation] = useState<Location | null>(null);
  const [qiblaData, setQiblaData] = useState<QiblaData | null>(null);
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "prompt" | "unknown"
  >("unknown");
  const [isCompassSupported, setIsCompassSupported] = useState(false);
  const [isCompassEnabled, setIsCompassEnabled] = useState(false);
  const [accuracy, setAccuracy] = useState<"high" | "medium" | "low" | null>(null);
  const [isAligned, setIsAligned] = useState(false);
  const compassRef = useRef<HTMLDivElement>(null);

  // Check if device supports device orientation and auto-get location
  useEffect(() => {
    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      setIsCompassSupported(true);
    }

    // Auto-detect location on page load
    getCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch Qibla Direction from API
  const fetchQiblaDirection = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/qibla/${lat}/${lng}`
      );
      const errorMessages: Record<string, string> = {
        id: "Gagal mengambil data arah kiblat",
        en: "Failed to fetch Qibla direction data",
        ar: "فشل في جلب بيانات اتجاه القبلة",
        fr: "Échec de la récupération des données de direction de la Qibla",
        kr: "키블라 방향 데이터를 가져오지 못했습니다",
        jp: "キブラの方向データの取得に失敗しました",
      };
      if (!response.ok) throw new Error(errorMessages[locale] || errorMessages.id);

      const data = await response.json();
      const direction = data.data.direction; // Direction relative to North

      // Calculate distance manually since this specific endpoint might not return it directly
      const distance = calculateDistance(lat, lng, KAABA_LAT, KAABA_LNG);

      return {
        direction: direction,
        distance: distance,
        bearing: direction,
      };
    } catch (err) {
      console.error(err);
      // Fallback to manual calculation if API fails
      // (This ensures the app still works offline or on API failure)
      return calculateQiblaManual(lat, lng);
    }
  };

  // Manual Calculation (Fallback)
  const calculateQiblaManual = (lat: number, lng: number): QiblaData => {
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);
    const toDegrees = (radians: number) => radians * (180 / Math.PI);

    const lat1 = toRadians(lat);
    const lng1 = toRadians(lng);
    const lat2 = toRadians(KAABA_LAT);
    const lng2 = toRadians(KAABA_LNG);

    const dLng = lng2 - lng1;

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

    let bearing = toDegrees(Math.atan2(y, x));
    bearing = (bearing + 360) % 360;

    const distance = calculateDistance(lat, lng, KAABA_LAT, KAABA_LNG);

    return {
      direction: bearing,
      distance: distance,
      bearing: bearing,
    };
  };

  // Get user location
  const getCurrentLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

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
            timeout: 15000,
            maximumAge: 60000, // 1 minute for fresher data
          });
        }
      );

      const { latitude, longitude, accuracy: posAccuracy } = position.coords;

      // Set accuracy level based on GPS accuracy
      if (posAccuracy && posAccuracy < 50) {
        setAccuracy("high");
      } else if (posAccuracy && posAccuracy < 100) {
        setAccuracy("medium");
      } else {
        setAccuracy("low");
      }

      // Reverse geocoding to get city name
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
          id: { city: "Lokasi tidak diketahui", country: "Negara tidak diketahui" },
          en: { city: "Unknown location", country: "Unknown country" },
          ar: { city: "موقع غير معروف", country: "دولة غير معروفة" },
          fr: { city: "Emplacement inconnu", country: "Pays inconnu" },
          kr: { city: "알 수 없는 위치", country: "알 수 없는 국가" },
          jp: { city: "不明な場所", country: "不明な国" },
        };
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${localeMap[locale] || "id"}`
        );
        const data = await response.json();
        const unknown = unknownLocation[locale] || unknownLocation.id;

        setLocation({
          latitude,
          longitude,
          city: data.city || data.locality || unknown.city,
          country: data.countryName || unknown.country,
        });
      } catch {
        const unknownLocation: Record<string, { city: string; country: string }> = {
          id: { city: "Lokasi tidak diketahui", country: "Negara tidak diketahui" },
          en: { city: "Unknown location", country: "Unknown country" },
          ar: { city: "موقع غير معروف", country: "دولة غير معروفة" },
          fr: { city: "Emplacement inconnu", country: "Pays inconnu" },
          kr: { city: "알 수 없는 위치", country: "알 수 없는 국가" },
          jp: { city: "不明な場所", country: "不明な国" },
        };
        const unknown = unknownLocation[locale] || unknownLocation.id;
        setLocation({
          latitude,
          longitude,
          city: unknown.city,
          country: unknown.country,
        });
      }

      // Get Qibla Data (Async API Call)
      const qibla = await fetchQiblaDirection(latitude, longitude);
      setQiblaData(qibla);

      setPermissionStatus("granted");
    } catch (err: unknown) {
      const geoError = err as GeolocationPositionError;
      const errorMessages: Record<string, Record<number, string>> = {
        id: {
          1: "Akses lokasi ditolak. Silakan izinkan akses lokasi di pengaturan browser.",
          2: "Lokasi tidak tersedia. Pastikan GPS aktif.",
          3: "Timeout mendapatkan lokasi. Silakan coba lagi.",
          0: "Terjadi kesalahan saat mendapatkan lokasi",
        },
        en: {
          1: "Location access denied. Please allow location access in browser settings.",
          2: "Location unavailable. Make sure GPS is active.",
          3: "Timeout getting location. Please try again.",
          0: "An error occurred while getting location",
        },
        ar: {
          1: "تم رفض الوصول إلى الموقع. يرجى السماح بالوصول إلى الموقع في إعدادات المتصفح.",
          2: "الموقع غير متاح. تأكد من تفعيل GPS.",
          3: "انتهت مهلة الحصول على الموقع. يرجى المحاولة مرة أخرى.",
          0: "حدث خطأ أثناء الحصول على الموقع",
        },
        fr: {
          1: "Accès à la localisation refusé. Veuillez autoriser l'accès à la localisation dans les paramètres du navigateur.",
          2: "Localisation indisponible. Assurez-vous que le GPS est actif.",
          3: "Délai d'attente de la localisation expiré. Veuillez réessayer.",
          0: "Une erreur s'est produite lors de l'obtention de la localisation",
        },
        kr: {
          1: "위치 액세스가 거부되었습니다. 브라우저 설정에서 위치 액세스를 허용하세요.",
          2: "위치를 사용할 수 없습니다. GPS가 활성화되어 있는지 확인하세요.",
          3: "위치 가져오기 시간 초과. 다시 시도하세요.",
          0: "위치를 가져오는 중 오류가 발생했습니다",
        },
        jp: {
          1: "位置情報へのアクセスが拒否されました。ブラウザの設定で位置情報へのアクセスを許可してください。",
          2: "位置情報が利用できません。GPSが有効になっていることを確認してください。",
          3: "位置情報の取得がタイムアウトしました。もう一度お試しください。",
          0: "位置情報の取得中にエラーが発生しました",
        },
      };
      const messages = errorMessages[locale] || errorMessages.id;
      let errorMessage = messages[0];
      
      if (geoError.code === 1) {
        errorMessage = messages[1];
      } else if (geoError.code === 2) {
        errorMessage = messages[2];
      } else if (geoError.code === 3) {
        errorMessage = messages[3];
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setPermissionStatus("denied");
    } finally {
      setIsLoading(false);
    }
  }, [locale]);

  // Request permission (iOS) and enable compass
  const enableCompass = async () => {
    try {
      if (typeof DeviceOrientationEvent !== "undefined") {
        const maybe = DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<string>;
        };
        if (typeof maybe.requestPermission === "function") {
          // iOS 13+
          const response = await maybe.requestPermission();
          if (response !== "granted") {
            setIsCompassEnabled(false);
            return;
          }
        }
      }

      setIsCompassEnabled(true);
    } catch {
      setIsCompassEnabled(false);
    }
  };

  // Handle compass orientation
  useEffect(() => {
    if (!isCompassSupported || !isCompassEnabled) return;

    let lastHeading: number | null = null;

    const smoothHeading = (value: number) => {
      if (lastHeading === null) {
        lastHeading = value;
        return value;
      }

      const diff = ((value - lastHeading + 540) % 360) - 180;
      lastHeading = (lastHeading + diff * 0.2 + 360) % 360;
      return lastHeading;
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      let heading: number | null = null;

      // ✅ iOS (Safari)
      if (typeof event.webkitCompassHeading === "number") {
        heading = event.webkitCompassHeading;
      }
      // ✅ Android / Chrome
      else if (event.absolute && typeof event.alpha === "number") {
        heading = (360 - event.alpha) % 360;
      }

      if (heading !== null) {
        setCompassHeading(smoothHeading(heading));
      }
    };

    window.addEventListener(
      "deviceorientationabsolute",
      handleOrientation,
      true
    );

    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      window.removeEventListener(
        "deviceorientationabsolute",
        handleOrientation,
        true
      );
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, [isCompassSupported, isCompassEnabled]);

  // Update needle rotation towards Qibla and check alignment
  useEffect(() => {
    if (!compassRef.current || !qiblaData) return;

    const hasLiveHeading = isCompassEnabled && compassHeading !== null;

    // If live compass: needle rotates relative to device heading
    // If no live compass: needle points to fixed Qibla direction (static north-up map style)
    const rotation = hasLiveHeading
      ? qiblaData.direction - (compassHeading as number)
      : qiblaData.direction;

    // Normalize rotation to 0-360
    const normalizedRotation = ((rotation % 360) + 360) % 360;

    // Check if device is aligned with Qibla (within 5 degrees)
    if (hasLiveHeading) {
      const alignmentThreshold = 10;
      const isNowAligned =
        normalizedRotation < alignmentThreshold ||
        normalizedRotation > 360 - alignmentThreshold;
      setIsAligned(isNowAligned);
    } else {
      setIsAligned(false);
    }

    // Use CSS transition for smooth movement
    compassRef.current.style.transform = `translate(-50%, -100%) rotate(${rotation}deg)`;

    // Also rotate the compass background to show North relative to device if live
    const compassDial = document.getElementById("compass-dial");
    if (compassDial && hasLiveHeading) {
      compassDial.style.transform = `rotate(${-compassHeading}deg)`;
    } else if (compassDial) {
      compassDial.style.transform = `rotate(0deg)`;
    }
  }, [isCompassEnabled, compassHeading, qiblaData]);

  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      const unit = locale === "id" ? "meter" : locale === "en" ? "meters" : locale === "ar" ? "متر" : locale === "fr" ? "mètres" : locale === "kr" ? "미터" : "メートル";
      return `${Math.round(distance * 1000)} ${unit}`;
    }
    return `${distance.toFixed(1)} km`;
  };

  const getDirectionText = (direction: number): string => {
    const directions: Record<string, string[]> = {
      id: ["Utara", "Timur Laut", "Timur", "Tenggara", "Selatan", "Barat Daya", "Barat", "Barat Laut"],
      en: ["North", "Northeast", "East", "Southeast", "South", "Southwest", "West", "Northwest"],
      ar: ["الشمال", "الشمال الشرقي", "الشرق", "الجنوب الشرقي", "الجنوب", "الجنوب الغربي", "الغرب", "الشمال الغربي"],
      fr: ["Nord", "Nord-est", "Est", "Sud-est", "Sud", "Sud-ouest", "Ouest", "Nord-ouest"],
      kr: ["북", "북동", "동", "남동", "남", "남서", "서", "북서"],
      jp: ["北", "北東", "東", "南東", "南", "南西", "西", "北西"],
    };
    const dirs = directions[locale] || directions.id;
    const index = Math.round(direction / 45) % 8;
    return dirs[index];
  };

  // Get accuracy badge color
  const getAccuracyColor = () => {
    switch (accuracy) {
      case "high":
        return "bg-green-100 text-green-700 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getAccuracyText = () => {
    return t(`qibla.accuracy.${accuracy || "detecting"}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="text-center">
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                  {t("qibla.title")}
                </h1>
                {location && (
                  <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                    {location.city}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
                onClick={getCurrentLocation}
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
        {/* Loading State */}
        {isLoading && !qiblaData && (
          <Card className="border-awqaf-border-light">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Navigation className="w-8 h-8 text-awqaf-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground font-comfortaa mb-2">
                {t("qibla.detectingLocation")}
              </h3>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                {t("qibla.ensureGpsActive")}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-red-800 font-comfortaa mb-1">
                    {t("qibla.failedToGetLocation")}
                  </p>
                  <p className="text-sm text-red-700 font-comfortaa mb-3">
                    {error}
                  </p>
                  <Button
                    size="sm"
                    onClick={getCurrentLocation}
                    className="bg-red-600 hover:bg-red-700 text-white font-comfortaa"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t("qibla.tryAgain")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Compass Card */}
        {qiblaData && (
          <Card
            className={`border-2 transition-all duration-300 ${
              isAligned
                ? "border-green-400 bg-green-50/50 shadow-lg shadow-green-100"
                : "border-awqaf-border-light"
            }`}
          >
            <CardContent className="p-6">
              {/* Alignment Status */}
              {isCompassEnabled && (
                <div
                  className={`text-center mb-4 py-2 px-4 rounded-full transition-all duration-300 ${
                    isAligned
                      ? "bg-green-100 text-green-700"
                      : "bg-accent-100 text-awqaf-foreground-secondary"
                  }`}
                >
                  <p className="text-sm font-semibold font-comfortaa flex items-center justify-center gap-2">
                    {isAligned ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        {t("qibla.facingQibla")}
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4" />
                        {t("qibla.rotateDevice")}
                      </>
                    )}
                  </p>
                </div>
              )}

              {/* Compass */}
              <div className="relative w-64 h-64 mx-auto mb-6">
                {/* Outer ring with degree markers */}
                <div
                  className={`absolute inset-0 rounded-full border-4 transition-colors duration-300 ${
                    isAligned ? "border-green-400" : "border-awqaf-border-light"
                  } bg-white shadow-xl`}
                >
                  {/* Compass background (Rotates with phone heading) */}
                  <div
                    id="compass-dial"
                    className="absolute inset-2 rounded-full bg-gradient-to-br from-white to-accent-50 transition-transform duration-200 ease-out"
                  >
                    {/* Degree tick marks */}
                    {Array.from({ length: 72 }).map((_, i) => {
                      const angle = i * 5;
                      const isMajor = angle % 45 === 0;
                      const isCardinal = angle % 90 === 0;
                      return (
                        <div
                          key={angle}
                          className={`absolute left-1/2 ${
                            isCardinal
                              ? "h-3 w-0.5 bg-awqaf-primary"
                              : isMajor
                              ? "h-2 w-0.5 bg-awqaf-foreground-secondary"
                              : "h-1 w-px bg-gray-300"
                          }`}
                          style={{
                            top: "4px",
                            transformOrigin: "center 122px",
                            transform: `translateX(-50%) rotate(${angle}deg)`,
                          }}
                        />
                      );
                    })}

                    {/* Direction labels */}
                    {[
                      { angle: 0, label: "U", color: "text-red-500" },
                      { angle: 90, label: "T", color: "text-awqaf-primary" },
                      { angle: 180, label: "S", color: "text-awqaf-primary" },
                      { angle: 270, label: "B", color: "text-awqaf-primary" },
                    ].map(({ angle, label, color }) => {
                      const x = 50 + 35 * Math.cos(((angle - 90) * Math.PI) / 180);
                      const y = 50 + 35 * Math.sin(((angle - 90) * Math.PI) / 180);
                      return (
                        <div
                          key={angle}
                          className={`absolute text-sm font-bold ${color}`}
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          {label}
                        </div>
                      );
                    })}

                    {/* Center circle */}
                    <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-inner" />
                  </div>

                  {/* Qibla Needle */}
                  <div
                    ref={compassRef}
                    className={`absolute top-1/2 left-1/2 w-1.5 h-24 rounded-full origin-bottom transition-transform duration-200 ease-out z-20 ${
                      isAligned
                        ? "bg-gradient-to-t from-green-500 to-green-400"
                        : "bg-gradient-to-t from-awqaf-primary to-awqaf-primary/80"
                    }`}
                    style={{
                      transformOrigin: "bottom center",
                      transform: "translate(-50%, -100%) rotate(0deg)",
                    }}
                  >
                    {/* Arrow Head */}
                    <div
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[12px] border-l-transparent border-r-transparent ${
                        isAligned ? "border-b-green-500" : "border-b-awqaf-primary"
                      }`}
                    />
                    {/* Kaaba Icon */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-2xl leading-none select-none drop-shadow-md">
                      🕋
                    </div>
                  </div>

                  {/* Device Direction Indicator (shows where device is pointing) */}
                  {isCompassEnabled && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full z-30 shadow-md">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-blue-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Qibla Information */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-accent-50 rounded-xl">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Compass className="w-4 h-4 text-awqaf-primary" />
                    <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                      {t("qibla.qiblaDirection")}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-awqaf-primary font-comfortaa">
                    {qiblaData.direction.toFixed(1)}°
                  </p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {getDirectionText(qiblaData.direction)}
                  </Badge>
                </div>
                <div className="text-center p-3 bg-accent-50 rounded-xl">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <MapPin className="w-4 h-4 text-awqaf-primary" />
                    <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                      {t("qibla.distanceToKaaba")}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-awqaf-primary font-comfortaa">
                    {formatDistance(qiblaData.distance)}
                  </p>
                </div>
              </div>

              {/* Enable Compass Button */}
              {isCompassSupported && !isCompassEnabled && (
                <Button
                  onClick={enableCompass}
                  className="w-full bg-awqaf-primary hover:bg-awqaf-primary/90 text-white font-comfortaa"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  {t("qibla.enableRealtimeCompass")}
                </Button>
              )}

              {/* Compass Status */}
              {isCompassEnabled && (
                <div className="flex items-center justify-center gap-2 text-sm text-awqaf-foreground-secondary font-comfortaa">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{t("qibla.compassActive")}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Location & Accuracy Info */}
        {location && (
          <Card className="border-awqaf-border-light">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-awqaf-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground font-comfortaa">
                      {location.city}, {location.country}
                    </p>
                    <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                      {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
                <Badge className={`${getAccuracyColor()} border`}>
                  {getAccuracyText()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Tips */}
        <Card className="border-awqaf-border-light bg-gradient-to-br from-accent-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-awqaf-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-awqaf-primary" />
              </div>
              <div>
                <p className="font-semibold text-card-foreground font-comfortaa text-sm mb-2">
                  {t("qibla.accuracyTips")}
                </p>
                <ul className="text-xs text-awqaf-foreground-secondary font-comfortaa space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-awqaf-primary">•</span>
                    {t("qibla.tips.enableGps")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-awqaf-primary">•</span>
                    {t("qibla.tips.avoidMetal")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-awqaf-primary">•</span>
                    {t("qibla.tips.calibrateCompass")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-awqaf-primary">•</span>
                    {t("qibla.tips.holdHorizontal")}
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calibration Guide */}
        {isCompassSupported && isCompassEnabled && (
          <Card className="border-awqaf-border-light">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-card-foreground font-comfortaa text-sm mb-1">
                    {t("qibla.compassCalibration")}
                  </p>
                  <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mb-2">
                    {t("qibla.calibrationDescription")}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">∞</div>
                    <span className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                      {t("qibla.calibrationMovement")}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
