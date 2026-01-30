"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Compass,
  MapPin,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Target,
  Smartphone,
  Info,
  Navigation,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/app/hooks/useI18n";

// --- TYPES ---
interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}

type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

interface QiblaData {
  direction: number;
  distance: number;
}

interface QiblaTranslations {
  title: string;
  detectingLocation: string;
  ensureGpsActive: string;
  failedToGetLocation: string;
  tryAgain: string;
  facingQibla: string;
  rotateDevice: string;
  qiblaDirection: string;
  distanceToKaaba: string;
  enableRealtimeCompass: string;
  compassActive: string;
  accuracyTips: string;
  compassCalibration: string;
  calibrationDescription: string;
  calibrationMovement: string;
  tips: {
    enableGps: string;
    avoidMetal: string;
    calibrateCompass: string;
    holdHorizontal: string;
  };
  accuracy: {
    high: string;
    medium: string;
    low: string;
    detecting: string;
  };
}

// --- TRANSLATION DICTIONARY ---
const QIBLA_TEXT: Record<LocaleCode, QiblaTranslations> = {
  id: {
    title: "Arah Kiblat",
    detectingLocation: "Mendeteksi lokasi...",
    ensureGpsActive: "Pastikan GPS Anda aktif",
    failedToGetLocation: "Gagal mendapatkan lokasi",
    tryAgain: "Coba Lagi",
    facingQibla: "Anda menghadap Kiblat",
    rotateDevice: "Putar perangkat Anda",
    qiblaDirection: "Arah Kiblat",
    distanceToKaaba: "Jarak ke Ka'bah",
    enableRealtimeCompass: "Aktifkan Kompas Real-time",
    compassActive: "Kompas Aktif",
    accuracyTips: "Tips Akurasi",
    compassCalibration: "Kalibrasi Kompas",
    calibrationDescription: "Jika arah tidak akurat, kalibrasi kompas Anda.",
    calibrationMovement: "Gerakkan ponsel membentuk angka 8",
    tips: {
      enableGps: "Aktifkan GPS untuk akurasi terbaik",
      avoidMetal: "Jauhkan dari benda logam/magnet",
      calibrateCompass: "Kalibrasi kompas perangkat Anda",
      holdHorizontal: "Pegang ponsel secara datar (horizontal)",
    },
    accuracy: {
      high: "Akurasi Tinggi",
      medium: "Akurasi Sedang",
      low: "Akurasi Rendah",
      detecting: "Mendeteksi...",
    },
  },
  en: {
    title: "Qibla Direction",
    detectingLocation: "Detecting location...",
    ensureGpsActive: "Ensure your GPS is active",
    failedToGetLocation: "Failed to get location",
    tryAgain: "Try Again",
    facingQibla: "You are facing Qibla",
    rotateDevice: "Rotate your device",
    qiblaDirection: "Qibla Direction",
    distanceToKaaba: "Distance to Kaaba",
    enableRealtimeCompass: "Enable Real-time Compass",
    compassActive: "Compass Active",
    accuracyTips: "Accuracy Tips",
    compassCalibration: "Compass Calibration",
    calibrationDescription: "If inaccurate, calibrate your compass.",
    calibrationMovement: "Move phone in figure 8",
    tips: {
      enableGps: "Enable GPS for best accuracy",
      avoidMetal: "Keep away from metal/magnets",
      calibrateCompass: "Calibrate your device compass",
      holdHorizontal: "Hold phone flat (horizontal)",
    },
    accuracy: {
      high: "High Accuracy",
      medium: "Medium Accuracy",
      low: "Low Accuracy",
      detecting: "Detecting...",
    },
  },
  ar: {
    title: "اتجاه القبلة",
    detectingLocation: "جاري تحديد الموقع...",
    ensureGpsActive: "تأكد من تفعيل GPS",
    failedToGetLocation: "فشل في الحصول على الموقع",
    tryAgain: "حاول مرة أخرى",
    facingQibla: "أنت تواجه القبلة",
    rotateDevice: "قم بتدوير جهازك",
    qiblaDirection: "اتجاه القبلة",
    distanceToKaaba: "المسافة إلى الكعبة",
    enableRealtimeCompass: "تفعيل البوصلة الحية",
    compassActive: "البوصلة نشطة",
    accuracyTips: "نصائح للدقة",
    compassCalibration: "معايرة البوصلة",
    calibrationDescription: "إذا كانت غير دقيقة، قم بمعايرة البوصلة.",
    calibrationMovement: "حرك الهاتف على شكل رقم 8",
    tips: {
      enableGps: "فعل GPS للحصول على أفضل دقة",
      avoidMetal: "ابتعد عن المعادن/المغناطيس",
      calibrateCompass: "عاير بوصلة جهازك",
      holdHorizontal: "أمسك الهاتف بشكل مسطح (أفقي)",
    },
    accuracy: {
      high: "دقة عالية",
      medium: "دقة متوسطة",
      low: "دقة منخفضة",
      detecting: "جاري الكشف...",
    },
  },
  fr: {
    title: "Direction de la Qibla",
    detectingLocation: "Détection de l'emplacement...",
    ensureGpsActive: "Assurez-vous que le GPS est actif",
    failedToGetLocation: "Échec de la localisation",
    tryAgain: "Réessayer",
    facingQibla: "Vous faites face à la Qibla",
    rotateDevice: "Tournez votre appareil",
    qiblaDirection: "Direction Qibla",
    distanceToKaaba: "Distance à la Kaaba",
    enableRealtimeCompass: "Activer la boussole",
    compassActive: "Boussole Active",
    accuracyTips: "Conseils de précision",
    compassCalibration: "Calibrage de la boussole",
    calibrationDescription: "Si inexact, calibrez votre boussole.",
    calibrationMovement: "Faites un 8 avec le téléphone",
    tips: {
      enableGps: "Activez le GPS pour une meilleure précision",
      avoidMetal: "Éloignez-vous du métal/aimants",
      calibrateCompass: "Calibrez la boussole de l'appareil",
      holdHorizontal: "Tenez le téléphone à plat",
    },
    accuracy: {
      high: "Haute Précision",
      medium: "Précision Moyenne",
      low: "Basse Précision",
      detecting: "Détection...",
    },
  },
  kr: {
    title: "키블라 방향",
    detectingLocation: "위치 감지 중...",
    ensureGpsActive: "GPS가 활성화되었는지 확인하세요",
    failedToGetLocation: "위치를 가져오지 못했습니다",
    tryAgain: "다시 시도",
    facingQibla: "키블라를 향하고 있습니다",
    rotateDevice: "기기를 회전하세요",
    qiblaDirection: "키블라 방향",
    distanceToKaaba: "카바까지의 거리",
    enableRealtimeCompass: "실시간 나침반 활성화",
    compassActive: "나침반 활성",
    accuracyTips: "정확도 팁",
    compassCalibration: "나침반 보정",
    calibrationDescription: "정확하지 않다면 나침반을 보정하세요.",
    calibrationMovement: "휴대폰을 8자 모양으로 움직이세요",
    tips: {
      enableGps: "최고의 정확도를 위해 GPS 활성화",
      avoidMetal: "금속/자석에서 멀리 하세요",
      calibrateCompass: "기기 나침반 보정",
      holdHorizontal: "휴대폰을 평평하게 잡으세요",
    },
    accuracy: {
      high: "높은 정확도",
      medium: "중간 정확도",
      low: "낮은 정확도",
      detecting: "감지 중...",
    },
  },
  jp: {
    title: "キブラの方向",
    detectingLocation: "位置を検出中...",
    ensureGpsActive: "GPSが有効になっていることを確認してください",
    failedToGetLocation: "位置情報の取得に失敗しました",
    tryAgain: "再試行",
    facingQibla: "キブラに向いています",
    rotateDevice: "デバイスを回転させてください",
    qiblaDirection: "キブラの方向",
    distanceToKaaba: "カアバまでの距離",
    enableRealtimeCompass: "リアルタイムコンパスを有効化",
    compassActive: "コンパス有効",
    accuracyTips: "精度のヒント",
    compassCalibration: "コンパスの調整",
    calibrationDescription: "不正確な場合は、コンパスを調整してください。",
    calibrationMovement: "携帯電話を8の字に動かしてください",
    tips: {
      enableGps: "最高精度のためGPSを有効化",
      avoidMetal: "金属/磁石から離してください",
      calibrateCompass: "デバイスのコンパスを調整",
      holdHorizontal: "携帯電話を水平に持ってください",
    },
    accuracy: {
      high: "高精度",
      medium: "中精度",
      low: "低精度",
      detecting: "検出中...",
    },
  },
};

// Helper untuk menghitung jarak manual (Haversine)
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371; // Radius bumi km
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

// Koordinat Ka'bah (Mekah)
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

export default function QiblaPage() {
  const { locale } = useI18n();
  const safeLocale = (
    QIBLA_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = QIBLA_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  const [location, setLocation] = useState<Location | null>(null);
  const [qiblaData, setQiblaData] = useState<QiblaData | null>(null);
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompassSupported, setIsCompassSupported] = useState(false);
  const [isCompassEnabled, setIsCompassEnabled] = useState(false);
  const [accuracy, setAccuracy] = useState<"high" | "medium" | "low" | null>(
    null,
  );
  const [isAligned, setIsAligned] = useState(false);
  const compassRef = useRef<HTMLDivElement>(null);

  // Check support & Auto-detect location
  useEffect(() => {
    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      setIsCompassSupported(true);
    }
    getCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch Qibla Direction
  const fetchQiblaDirection = async (lat: number, lng: number) => {
    try {
      // Menggunakan API Aladhan
      const response = await fetch(
        `https://api.aladhan.com/v1/qibla/${lat}/${lng}`,
      );
      if (!response.ok) throw new Error("Failed to fetch Qibla data");

      const data = await response.json();
      const direction = data.data.direction;

      const distance = calculateDistance(lat, lng, KAABA_LAT, KAABA_LNG);

      return {
        direction: direction,
        distance: distance,
      };
    } catch (err) {
      console.error(err);
      return calculateQiblaManual(lat, lng);
    }
  };

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
    };
  };

  const getCurrentLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported");
      }

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 60000,
          });
        },
      );

      const { latitude, longitude, accuracy: posAccuracy } = position.coords;

      if (posAccuracy < 50) setAccuracy("high");
      else if (posAccuracy < 100) setAccuracy("medium");
      else setAccuracy("low");

      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${locale === "id" ? "id" : "en"}`,
        );
        const data = await response.json();

        setLocation({
          latitude,
          longitude,
          city: data.city || data.locality || "Unknown Location",
          country: data.countryName || "Unknown Country",
        });
      } catch {
        setLocation({
          latitude,
          longitude,
          city: "Unknown Location",
          country: "Unknown Country",
        });
      }

      const qibla = await fetchQiblaDirection(latitude, longitude);
      setQiblaData(qibla);
    } catch (err: unknown) {
      let errorMessage = t.failedToGetLocation;

      // Type safe error handling
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "object" && err !== null && "message" in err) {
        errorMessage = String((err as { message: unknown }).message);
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [locale, t.failedToGetLocation]);

  const enableCompass = async () => {
    try {
      if (typeof DeviceOrientationEvent !== "undefined") {
        const maybe = DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<string>;
        };
        if (typeof maybe.requestPermission === "function") {
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

      // Cast ke interface custom untuk handle webkitCompassHeading tanpa error
      const iosEvent = event as DeviceOrientationEventiOS;

      if (typeof iosEvent.webkitCompassHeading === "number") {
        heading = iosEvent.webkitCompassHeading;
      } else if (event.absolute && typeof event.alpha === "number") {
        heading = (360 - event.alpha) % 360;
      }

      if (heading !== null) {
        setCompassHeading(smoothHeading(heading));
      }
    };

    window.addEventListener(
      "deviceorientationabsolute",
      handleOrientation,
      true,
    );
    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      window.removeEventListener(
        "deviceorientationabsolute",
        handleOrientation,
        true,
      );
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, [isCompassSupported, isCompassEnabled]);

  useEffect(() => {
    if (!compassRef.current || !qiblaData) return;

    const hasLiveHeading = isCompassEnabled && compassHeading !== null;
    const rotation = hasLiveHeading
      ? qiblaData.direction - (compassHeading as number)
      : qiblaData.direction;

    const normalizedRotation = ((rotation % 360) + 360) % 360;

    if (hasLiveHeading) {
      const alignmentThreshold = 5;
      const isNowAligned =
        normalizedRotation < alignmentThreshold ||
        normalizedRotation > 360 - alignmentThreshold;
      setIsAligned(isNowAligned);
    } else {
      setIsAligned(false);
    }

    compassRef.current.style.transform = `translate(-50%, -100%) rotate(${rotation}deg)`;

    const compassDial = document.getElementById("compass-dial");
    if (compassDial && hasLiveHeading) {
      compassDial.style.transform = `rotate(${-compassHeading}deg)`;
    } else if (compassDial) {
      compassDial.style.transform = `rotate(0deg)`;
    }
  }, [isCompassEnabled, compassHeading, qiblaData]);

  const formatDistance = (distance: number): string => {
    if (distance < 1) return `${Math.round(distance * 1000)} m`;
    return `${distance.toFixed(1)} km`;
  };

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

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary ${isRtl ? "rotate-180" : ""}`}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="text-center">
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                  {t.title}
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
                className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary"
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
        {isLoading && !qiblaData && (
          <Card className="border-awqaf-border-light">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Navigation className="w-8 h-8 text-awqaf-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground font-comfortaa mb-2">
                {t.detectingLocation}
              </h3>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                {t.ensureGpsActive}
              </p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-red-800 font-comfortaa mb-1">
                    {t.failedToGetLocation}
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
                    {t.tryAgain}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {qiblaData && (
          <Card
            className={`border-2 transition-all duration-500 ease-in-out ${
              isAligned
                ? "border-green-400 bg-green-50/50 shadow-lg shadow-green-100"
                : "border-awqaf-border-light"
            }`}
          >
            <CardContent className="p-6">
              {isCompassEnabled && (
                <div
                  className={`text-center mb-6 py-2 px-4 rounded-full transition-all duration-300 ${
                    isAligned
                      ? "bg-green-100 text-green-700"
                      : "bg-accent-100 text-awqaf-foreground-secondary"
                  }`}
                >
                  <p className="text-sm font-semibold font-comfortaa flex items-center justify-center gap-2">
                    {isAligned ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        {t.facingQibla}
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4" />
                        {t.rotateDevice}
                      </>
                    )}
                  </p>
                </div>
              )}

              {/* Compass UI */}
              <div className="relative w-64 h-64 mx-auto mb-8">
                {/* Outer Ring */}
                <div
                  className={`absolute inset-0 rounded-full border-4 transition-colors duration-300 ${
                    isAligned ? "border-green-400" : "border-awqaf-border-light"
                  } bg-white shadow-xl flex items-center justify-center`}
                >
                  {/* Compass Dial */}
                  <div
                    id="compass-dial"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-white to-gray-50 transition-transform duration-200 ease-out"
                  >
                    {/* Degree Ticks (Rapi dan Kecil) */}
                    {Array.from({ length: 72 }).map((_, i) => {
                      const angle = i * 5;
                      const isCardinal = angle % 90 === 0; // U, T, S, B
                      const isMajor = angle % 45 === 0;

                      return (
                        <div
                          key={angle}
                          className={`absolute left-1/2 -translate-x-1/2 origin-bottom ${
                            isCardinal
                              ? "h-3 w-1 bg-amber-700/80" // Cardinal sedikit tebal & coklat/emas
                              : isMajor
                                ? "h-2 w-0.5 bg-gray-400"
                                : "h-1 w-px bg-gray-300"
                          }`}
                          style={{
                            top: "4px", // Jarak dari pinggir
                            transformOrigin: "center 120px", // Radius dial ~120px
                            transform: `rotate(${angle}deg)`,
                          }}
                        />
                      );
                    })}

                    {/* Cardinal Points (U, T, S, B) */}
                    {[
                      { label: "U", angle: 0, color: "text-red-500" },
                      { label: "T", angle: 90, color: "text-gray-700" },
                      { label: "S", angle: 180, color: "text-gray-700" },
                      { label: "B", angle: 270, color: "text-gray-700" },
                    ].map(({ label, angle, color }) => (
                      <div
                        key={label}
                        className={`absolute text-lg font-bold font-comfortaa ${color}`}
                        style={{
                          left: "50%",
                          top: "50%",
                          // Translate ke posisi agak dalam dari tick, lalu rotate balik agar huruf tegak
                          transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-90px) rotate(${-angle}deg)`,
                        }}
                      >
                        {label}
                      </div>
                    ))}

                    {/* Center Point */}
                    <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-gray-300 rounded-full -translate-x-1/2 -translate-y-1/2 z-10" />
                  </div>

                  {/* Qibla Needle */}
                  <div
                    ref={compassRef}
                    className="absolute top-1/2 left-1/2 w-1.5 h-[100px] z-20 origin-bottom transition-transform duration-200 ease-out"
                    style={{
                      transform: "translate(-50%, -100%) rotate(0deg)",
                    }}
                  >
                    {/* Jarum */}
                    <div
                      className={`w-full h-full rounded-full ${isAligned ? "bg-gradient-to-t from-green-500 to-green-400" : "bg-gradient-to-t from-awqaf-primary to-awqaf-primary/80"}`}
                    />

                    {/* Kepala Panah */}
                    <div
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[16px] border-l-transparent border-r-transparent ${
                        isAligned
                          ? "border-b-green-500"
                          : "border-b-awqaf-primary"
                      }`}
                    />

                    {/* Ikon Ka'bah */}
                    <div
                      className="absolute -top-12 left-1/2 -translate-x-1/2"
                      style={{
                        transform: `rotate(${-qiblaData.direction}deg)`,
                      }}
                    >
                      <span className="text-3xl filter drop-shadow-md">🕋</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-accent-50 rounded-xl">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Compass className="w-4 h-4 text-awqaf-primary" />
                    <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                      {t.qiblaDirection}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-awqaf-primary font-comfortaa">
                    {qiblaData.direction.toFixed(1)}°
                  </p>
                </div>
                <div className="text-center p-3 bg-accent-50 rounded-xl">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <MapPin className="w-4 h-4 text-awqaf-primary" />
                    <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                      {t.distanceToKaaba}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-awqaf-primary font-comfortaa">
                    {formatDistance(qiblaData.distance)}
                  </p>
                </div>
              </div>

              {isCompassSupported && !isCompassEnabled && (
                <Button
                  onClick={enableCompass}
                  className="w-full bg-awqaf-primary hover:bg-awqaf-primary/90 text-white font-comfortaa"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  {t.enableRealtimeCompass}
                </Button>
              )}

              {isCompassEnabled && (
                <div className="flex items-center justify-center gap-2 text-sm text-green-600 font-comfortaa mt-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{t.compassActive}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
                      {location.latitude.toFixed(5)},{" "}
                      {location.longitude.toFixed(5)}
                    </p>
                  </div>
                </div>
                <Badge className={`${getAccuracyColor()} border`}>
                  {t.accuracy[accuracy || "detecting"] || "Detecting..."}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {isCompassSupported && isCompassEnabled && (
          <Card className="border-awqaf-border-light">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-card-foreground font-comfortaa text-sm mb-1">
                    {t.compassCalibration}
                  </p>
                  <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mb-2">
                    {t.calibrationDescription}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl text-blue-600">∞</div>
                    <span className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                      {t.calibrationMovement}
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