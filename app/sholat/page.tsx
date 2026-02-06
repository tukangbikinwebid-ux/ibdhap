"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Clock,
  MapPin,
  Calendar,
  Navigation,
  AlertCircle,
  CheckCircle,
  Loader2,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Play,
  Square,
  Check,
  Circle,
  CheckCircle2,
  Award,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useI18n } from "@/app/hooks/useI18n";
import { LocaleCode } from "@/lib/i18n";
import { useRouter } from "next/navigation";

// --- SERVICES IMPORT ---
import {
  useGetUserSholatListQuery,
  useToggleSholatMutation,
} from "@/services/sholat-track.service";
import Link from "next/link";

// --- TYPES ---
interface Location {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

interface PrayerTime {
  originalKey: string; // Add stable key for backend mapping (e.g., "Fajr")
  name: string; // Translated name for UI
  arabic: string;
  time: string;
  status: "completed" | "current" | "upcoming";
}

interface AladhanResponse {
  data: {
    timings: {
      Fajr: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
      [key: string]: string;
    };
  };
}

// Popular Adhan Audio URL
const ADHAN_URLS = [
  "https://www.islamcan.com/audio/adhan/azan1.mp3",
  "https://media.sd.ma/assabile/adhan_3435/8bdb88c0b65f.mp3",
  "https://cdn.aladhan.com/audio/mishary/adhan.mp3",
];

// Definisi Tipe Spesifik untuk Dictionary
interface SholatTranslations {
  title: string;
  subtitle: string;
  currentLocation: string;
  locationNotSet: string;
  useCurrentLocation: string;
  gettingLocation: string;
  adhanReminder: string;
  adhanActive: string;
  activateReminder: string;
  active: string;
  inactive: string;
  playingAdhan: string;
  testAdhan: string;
  stop: string;
  test: string;
  scheduledPrayers: string;
  allPrayersPassed: string;
  allowNotification: string;
  todaySchedule: string;
  prayerProgress: string;
  alhamdulillah: string;
  keepSpirit: string;
  markInstruction: string;
  alreadyPrayed: string;
  currentlyOngoing: string;
  completed: string;
  locationRequired: string;
  locationRequiredDesc: string;
  allowLocationAccess: string;
  motivationTitle: string;
  motivationDesc: string;
  quranQuote: string;
  quranSource: string;
  motivationFooter: string;
  alhamdulillahBtn: string;
  errors: {
    geoNotSupported: string;
    fetchFailed: string;
    locDenied: string;
    locUnavailable: string;
    locTimeout: string;
    locError: string;
    locUnknown: string;
    notificationBlocked: string;
  };
  notification: {
    title: string;
    body: string;
  };
}

const SHOLAT_TEXT: Record<LocaleCode, SholatTranslations> = {
  id: {
    title: "Jadwal Sholat",
    subtitle: "Waktu sholat akurat sesuai lokasi Anda",
    currentLocation: "Lokasi Saat Ini",
    locationNotSet: "Lokasi belum ditentukan",
    useCurrentLocation: "Gunakan Lokasi Saat Ini",
    gettingLocation: "Mendapatkan lokasi...",
    adhanReminder: "Pengingat Adzan",
    adhanActive: "Notifikasi suara adzan aktif",
    activateReminder: "Aktifkan notifikasi adzan",
    active: "Aktif",
    inactive: "Nonaktif",
    playingAdhan: "Memutar Adzan",
    testAdhan: "Coba Suara Adzan",
    stop: "Stop",
    test: "Test",
    scheduledPrayers: "Sholat Terjadwal:",
    allPrayersPassed: "Semua sholat hari ini telah berlalu",
    allowNotification: "Izinkan notifikasi browser agar pengingat berfungsi",
    todaySchedule: "Jadwal Hari Ini",
    prayerProgress: "Progress Sholat Hari Ini",
    alhamdulillah: "Alhamdulillah, lengkap!",
    keepSpirit: "Tetap semangat! 💪",
    markInstruction:
      "Klik lingkaran untuk menandai sholat yang sudah dikerjakan",
    alreadyPrayed: "✓ Sudah Sholat",
    currentlyOngoing: "• Sedang Berlangsung",
    completed: "• Selesai",
    locationRequired: "Akses Lokasi Diperlukan",
    locationRequiredDesc:
      "Mohon izinkan akses lokasi untuk menampilkan jadwal sholat yang akurat di daerah Anda.",
    allowLocationAccess: "Izinkan Akses Lokasi",
    motivationTitle: "Alhamdulillah! 🎉",
    motivationDesc: "Anda telah menyelesaikan sholat",
    quranQuote:
      '"Sesungguhnya sholat itu mencegah dari perbuatan keji dan mungkar"',
    quranSource: "- QS. Al-Ankabut: 45",
    motivationFooter:
      "Terus jaga sholat 5 waktu untuk kebaikan dunia dan akhirat! 💪",
    alhamdulillahBtn: "Alhamdulillah",
    errors: {
      geoNotSupported: "Geolocation tidak didukung oleh browser ini",
      fetchFailed: "Gagal memuat jadwal sholat. Periksa koneksi internet Anda.",
      locDenied:
        "Akses lokasi ditolak. Silakan izinkan akses lokasi untuk melihat jadwal sholat.",
      locUnavailable: "Informasi lokasi tidak tersedia.",
      locTimeout: "Permintaan lokasi timeout.",
      locError: "Terjadi kesalahan saat mendapatkan lokasi.",
      locUnknown: "Lokasi tidak diketahui",
      notificationBlocked:
        "Izinkan notifikasi untuk mengaktifkan pengingat adzan. Silakan cek pengaturan browser Anda.",
    },
    notification: {
      title: "Waktu",
      body: "Saatnya menunaikan sholat",
    },
  },
  en: {
    title: "Prayer Times",
    subtitle: "Accurate prayer times based on your location",
    currentLocation: "Current Location",
    locationNotSet: "Location not set",
    useCurrentLocation: "Use Current Location",
    gettingLocation: "Getting location...",
    adhanReminder: "Adhan Reminder",
    adhanActive: "Adhan voice notification active",
    activateReminder: "Enable adhan notification",
    active: "Active",
    inactive: "Inactive",
    playingAdhan: "Playing Adhan",
    testAdhan: "Test Adhan Sound",
    stop: "Stop",
    test: "Test",
    scheduledPrayers: "Scheduled Prayers:",
    allPrayersPassed: "All prayers for today have passed",
    allowNotification: "Allow browser notifications for reminders to work",
    todaySchedule: "Today's Schedule",
    prayerProgress: "Today's Prayer Progress",
    alhamdulillah: "Alhamdulillah, complete!",
    keepSpirit: "Keep it up! 💪",
    markInstruction: "Click the circle to mark completed prayers",
    alreadyPrayed: "✓ Prayed",
    currentlyOngoing: "• Ongoing",
    completed: "• Completed",
    locationRequired: "Location Access Required",
    locationRequiredDesc:
      "Please allow location access to show accurate prayer times in your area.",
    allowLocationAccess: "Allow Location Access",
    motivationTitle: "Alhamdulillah! 🎉",
    motivationDesc: "You have completed the prayer",
    quranQuote: '"Indeed, prayer prohibits immorality and wrongdoing"',
    quranSource: "- QS. Al-Ankabut: 45",
    motivationFooter:
      "Keep up the 5 daily prayers for goodness in this world and the hereafter! 💪",
    alhamdulillahBtn: "Alhamdulillah",
    errors: {
      geoNotSupported: "Geolocation is not supported by this browser",
      fetchFailed:
        "Failed to load prayer times. Check your internet connection.",
      locDenied:
        "Location access denied. Please allow location access to view prayer times.",
      locUnavailable: "Location information unavailable.",
      locTimeout: "Location request timeout.",
      locError: "An error occurred while getting location.",
      locUnknown: "Unknown location",
      notificationBlocked:
        "Allow notifications to enable adhan reminder. Please check your browser settings.",
    },
    notification: {
      title: "Time for",
      body: "It is time to perform prayer",
    },
  },
  ar: {
    title: "أوقات الصلاة",
    subtitle: "أوقات صلاة دقيقة بناءً على موقعك",
    currentLocation: "الموقع الحالي",
    locationNotSet: "لم يتم تحديد الموقع",
    useCurrentLocation: "استخدام الموقع الحالي",
    gettingLocation: "جاري تحديد الموقع...",
    adhanReminder: "تذكير الأذان",
    adhanActive: "إشعار صوت الأذان نشط",
    activateReminder: "تفعيل إشعار الأذان",
    active: "نشط",
    inactive: "غير نشط",
    playingAdhan: "تشغيل الأذان",
    testAdhan: "تجربة صوت الأذان",
    stop: "إيقاف",
    test: "تجربة",
    scheduledPrayers: "الصلوات المجدولة:",
    allPrayersPassed: "انقضت جميع صلوات اليوم",
    allowNotification: "اسمح بإشعارات المتصفح لعمل التذكيرات",
    todaySchedule: "جدول اليوم",
    prayerProgress: "تقدم الصلاة اليوم",
    alhamdulillah: "الحمد لله، اكتملت!",
    keepSpirit: "استمر في ذلك! 💪",
    markInstruction: "انقر على الدائرة لتحديد الصلوات المكتملة",
    alreadyPrayed: "✓ صليت",
    currentlyOngoing: "• جارية الآن",
    completed: "• اكتملت",
    locationRequired: "مطلوب الوصول إلى الموقع",
    locationRequiredDesc:
      "يرجى السماح بالوصول إلى الموقع لإظهار أوقات الصلاة الدقيقة في منطقتك.",
    allowLocationAccess: "السماح بالوصول إلى الموقع",
    motivationTitle: "الحمد لله! 🎉",
    motivationDesc: "لقد أتممت صلاة",
    quranQuote: '"إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ"',
    quranSource: "- سورة العنكبوت: ٤٥",
    motivationFooter: "حافظ على الصلوات الخمس لخير الدنيا والآخرة! 💪",
    alhamdulillahBtn: "الحمد لله",
    errors: {
      geoNotSupported: "الموقع الجغرافي غير مدعوم في هذا المتصفح",
      fetchFailed: "فشل تحميل أوقات الصلاة. تحقق من اتصالك بالإنترنت.",
      locDenied: "تم رفض الوصول إلى الموقع. يرجى السماح بالوصول لعرض الأوقات.",
      locUnavailable: "معلومات الموقع غير متاحة.",
      locTimeout: "انتهت مهلة طلب الموقع.",
      locError: "حدث خطأ أثناء الحصول على الموقع.",
      locUnknown: "موقع غير معروف",
      notificationBlocked:
        "اسمح بالإشعارات لتفعيل تذكير الأذان. تحقق من إعدادات المتصفح.",
    },
    notification: {
      title: "وقت",
      body: "حان وقت أداء صلاة",
    },
  },
  fr: {
    title: "Horaires de Prière",
    subtitle: "Horaires précis basés sur votre position",
    currentLocation: "Position Actuelle",
    locationNotSet: "Position non définie",
    useCurrentLocation: "Utiliser la position actuelle",
    gettingLocation: "Obtention de la position...",
    adhanReminder: "Rappel Adhan",
    adhanActive: "Notification vocale Adhan active",
    activateReminder: "Activer la notification Adhan",
    active: "Actif",
    inactive: "Inactif",
    playingAdhan: "Lecture de l'Adhan",
    testAdhan: "Tester le son Adhan",
    stop: "Arrêter",
    test: "Test",
    scheduledPrayers: "Prières programmées:",
    allPrayersPassed: "Toutes les prières d'aujourd'hui sont passées",
    allowNotification: "Autoriser les notifications du navigateur",
    todaySchedule: "Programme d'aujourd'hui",
    prayerProgress: "Progrès des prières",
    alhamdulillah: "Alhamdulillah, complet !",
    keepSpirit: "Continuez comme ça ! 💪",
    markInstruction:
      "Cliquez sur le cercle pour marquer les prières effectuées",
    alreadyPrayed: "✓ Prié",
    currentlyOngoing: "• En cours",
    completed: "• Terminé",
    locationRequired: "Accès à la localisation requis",
    locationRequiredDesc:
      "Veuillez autoriser l'accès à la localisation pour afficher les horaires précis.",
    allowLocationAccess: "Autoriser l'accès",
    motivationTitle: "Alhamdulillah ! 🎉",
    motivationDesc: "Vous avez terminé la prière de",
    quranQuote:
      '"En vérité, la prière préserve de la turpitude et du blâmable"',
    quranSource: "- Sourate Al-Ankabut: 45",
    motivationFooter:
      "Maintenez les 5 prières quotidiennes pour le bien ici-bas et dans l'au-delà ! 💪",
    alhamdulillahBtn: "Alhamdulillah",
    errors: {
      geoNotSupported: "La géolocalisation n'est pas supportée",
      fetchFailed: "Échec du chargement. Vérifiez votre connexion.",
      locDenied: "Accès refusé. Veuillez autoriser la localisation.",
      locUnavailable: "Position indisponible.",
      locTimeout: "Délai d'attente dépassé.",
      locError: "Erreur lors de l'obtention de la position.",
      locUnknown: "Position inconnue",
      notificationBlocked:
        "Autorisez les notifications pour activer le rappel.",
    },
    notification: {
      title: "Heure de",
      body: "Il est temps d'effectuer la prière de",
    },
  },
  kr: {
    title: "기도 시간",
    subtitle: "위치 기반 정확한 기도 시간",
    currentLocation: "현재 위치",
    locationNotSet: "위치 설정되지 않음",
    useCurrentLocation: "현재 위치 사용",
    gettingLocation: "위치 확인 중...",
    adhanReminder: "아잔 알림",
    adhanActive: "아잔 음성 알림 활성화됨",
    activateReminder: "아잔 알림 켜기",
    active: "활성",
    inactive: "비활성",
    playingAdhan: "아잔 재생 중",
    testAdhan: "아잔 소리 테스트",
    stop: "정지",
    test: "테스트",
    scheduledPrayers: "예정된 기도:",
    allPrayersPassed: "오늘의 모든 기도가 지났습니다",
    allowNotification: "알림이 작동하도록 브라우저 알림 허용",
    todaySchedule: "오늘의 일정",
    prayerProgress: "오늘의 기도 진행상황",
    alhamdulillah: "알함둘릴라, 완료!",
    keepSpirit: "계속 힘내세요! 💪",
    markInstruction: "완료된 기도를 표시하려면 원을 클릭하세요",
    alreadyPrayed: "✓ 기도함",
    currentlyOngoing: "• 진행 중",
    completed: "• 완료됨",
    locationRequired: "위치 액세스 필요",
    locationRequiredDesc: "정확한 기도 시간을 위해 위치 액세스를 허용해주세요.",
    allowLocationAccess: "위치 액세스 허용",
    motivationTitle: "알함둘릴라! 🎉",
    motivationDesc: "기도를 마쳤습니다:",
    quranQuote: '"실로 예배는 죄악과 사악함을 방지하느니라"',
    quranSource: "- 수라 알-안카붓: 45",
    motivationFooter:
      "현세와 내세의 선함을 위해 하루 5번의 기도를 지키세요! 💪",
    alhamdulillahBtn: "알함둘릴라",
    errors: {
      geoNotSupported: "지리적 위치가 지원되지 않음",
      fetchFailed: "기도 시간을 불러오지 못했습니다. 인터넷을 확인하세요.",
      locDenied: "위치 액세스가 거부되었습니다. 허용해주세요.",
      locUnavailable: "위치 정보 사용 불가.",
      locTimeout: "위치 요청 시간 초과.",
      locError: "위치를 가져오는 중 오류 발생.",
      locUnknown: "알 수 없는 위치",
      notificationBlocked: "아잔 알림을 위해 알림을 허용해주세요.",
    },
    notification: {
      title: "시간",
      body: "기도할 시간입니다:",
    },
  },
  jp: {
    title: "礼拝時間",
    subtitle: "現在地に基づいた正確な礼拝時間",
    currentLocation: "現在地",
    locationNotSet: "位置情報未設定",
    useCurrentLocation: "現在地を使用",
    gettingLocation: "位置情報を取得中...",
    adhanReminder: "アザーンリマインダー",
    adhanActive: "アザーン音声通知有効",
    activateReminder: "アザーン通知を有効にする",
    active: "有効",
    inactive: "無効",
    playingAdhan: "アザーン再生中",
    testAdhan: "アザーン音テスト",
    stop: "停止",
    test: "テスト",
    scheduledPrayers: "予定された礼拝:",
    allPrayersPassed: "本日の礼拝はすべて終了しました",
    allowNotification: "リマインダーのためにブラウザ通知を許可してください",
    todaySchedule: "今日のスケジュール",
    prayerProgress: "今日の礼拝進捗",
    alhamdulillah: "アルハムドゥリッラー、完了！",
    keepSpirit: "その調子で！ 💪",
    markInstruction: "完了した礼拝をマークするには円をクリック",
    alreadyPrayed: "✓ 礼拝済み",
    currentlyOngoing: "• 進行中",
    completed: "• 完了",
    locationRequired: "位置情報へのアクセスが必要",
    locationRequiredDesc:
      "正確な礼拝時間を表示するために位置情報のアクセスを許可してください。",
    allowLocationAccess: "位置情報アクセスを許可",
    motivationTitle: "アルハムドゥリッラー！ 🎉",
    motivationDesc: "あなたは礼拝を完了しました:",
    quranQuote: '"誠に礼拝は、人を醜行と邪悪から遠ざける。"',
    quranSource: "- スーラ アル・アンカブート: 45",
    motivationFooter: "現世と来世の善のために1日5回の礼拝を守りましょう！ 💪",
    alhamdulillahBtn: "アルハムドゥリッラー",
    errors: {
      geoNotSupported: "位置情報はサポートされていません",
      fetchFailed:
        "読み込みに失敗しました。インターネット接続を確認してください。",
      locDenied: "アクセスが拒否されました。位置情報を許可してください。",
      locUnavailable: "位置情報が利用できません。",
      locTimeout: "リクエストがタイムアウトしました。",
      locError: "位置情報の取得中にエラーが発生しました。",
      locUnknown: "不明な場所",
      notificationBlocked:
        "リマインダーを有効にするには通知を許可してください。",
    },
    notification: {
      title: "時間",
      body: "礼拝を行う時間です:",
    },
  },
};

type PrayerStatusKey = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

export default function SholatPage() {
  const router = useRouter();
  const { locale } = useI18n();
  // Safe Locale Access with correct type
  const safeLocale = (
    SHOLAT_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t_sholat = SHOLAT_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  // --- API INTEGRATION (New) ---
  // 1. Get Today's Date in YYYY-MM-DD
  const todayDate = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  // 2. Fetch User History
  const { data: sholatData } = useGetUserSholatListQuery({ page: 1 });
  const [toggleSholat] = useToggleSholatMutation();

  // 3. Find Today's Record from Backend
  const todayRecord = useMemo(() => {
    if (!sholatData?.data) return null;
    return sholatData.data.find((record) => record.date === todayDate);
  }, [sholatData, todayDate]);

  // State
  const [location, setLocation] = useState<Location | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "prompt" | "unknown"
  >("unknown");

  // Adhan States
  const [isAdhanEnabled, setIsAdhanEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<
    "granted" | "denied" | "default"
  >("default");
  const [isAdhanPlaying, setIsAdhanPlaying] = useState(false);
  const [currentAdhanPrayer, setCurrentAdhanPrayer] = useState<string | null>(
    null,
  );

  // Prayer Checklist (DERIVED from Backend Data now, not local state)
  const prayerChecklist = useMemo<Record<string, boolean>>(() => {
    const checklist: Record<string, boolean> = {};
    if (prayerTimes.length > 0) {
      prayerTimes.forEach((p) => {
        // Casting string ke tipe union PrayerStatusKey
        const backendKey = p.originalKey.toLowerCase() as PrayerStatusKey;

        // TypeScript sekarang tahu bahwa todayRecord[backendKey] adalah boolean
        const isChecked = todayRecord ? todayRecord[backendKey] : false;

        checklist[p.name] = isChecked;
      });
    }
    return checklist;
  }, [prayerTimes, todayRecord]);

  const [showMotivationDialog, setShowMotivationDialog] = useState(false);
  const [completedPrayerName, setCompletedPrayerName] = useState<string>("");

  // Refs
  const adhanAudioRef = useRef<HTMLAudioElement | null>(null);
  const adhanTimersRef = useRef<NodeJS.Timeout[]>([]);

  // --- Helper: Get Prayer Status ---
  const getPrayerStatus = (
    prayerTimeStr: string,
    nextPrayerTimeStr: string | null,
  ): "completed" | "current" | "upcoming" => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    if (!prayerTimeStr) return "upcoming";

    const cleanTime = prayerTimeStr.split(" ")[0];
    const [pHeader, pMinute] = cleanTime.split(":").map(Number);
    const prayerTimeMinutes = pHeader * 60 + pMinute;

    if (currentTime < prayerTimeMinutes) return "upcoming";

    if (nextPrayerTimeStr) {
      const cleanNextTime = nextPrayerTimeStr.split(" ")[0];
      const [nHeader, nMinute] = cleanNextTime.split(":").map(Number);
      const nextPrayerTimeMinutes = nHeader * 60 + nMinute;
      if (
        currentTime >= prayerTimeMinutes &&
        currentTime < nextPrayerTimeMinutes
      )
        return "current";
    } else {
      if (currentTime >= prayerTimeMinutes) return "current";
    }
    return "completed";
  };

  // --- Helper: Fetch Prayer Times ---
  const fetchPrayerTimes = async (lat: number, lng: number) => {
    try {
      const date = new Date();
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const dateString = `${day}-${month}-${year}`;
      const apiUrl = `https://api.aladhan.com/v1/timings/${dateString}?latitude=${lat}&longitude=${lng}&method=20`;

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data: AladhanResponse = await response.json();
      if (!data?.data?.timings) throw new Error("Invalid API response");

      const timings = data.data.timings;

      // Use raw names first, map later for translation
      // Added 'originalKey' for backend mapping
      const rawPrayers = [
        { name: "Fajr", arabic: "الفجر", time: timings.Fajr },
        { name: "Dhuhr", arabic: "الظهر", time: timings.Dhuhr },
        { name: "Asr", arabic: "العصر", time: timings.Asr },
        { name: "Maghrib", arabic: "المغرب", time: timings.Maghrib },
        { name: "Isha", arabic: "العشاء", time: timings.Isha },
      ];

      const processedPrayers: PrayerTime[] = rawPrayers.map((p, index) => {
        const nextPrayer = rawPrayers[index + 1];
        const status = getPrayerStatus(
          p.time,
          nextPrayer ? nextPrayer.time : null,
        );

        // Translate name immediately based on current locale
        const translatedName = getPrayerName(p.name, safeLocale);

        return { ...p, originalKey: p.name, name: translatedName, status };
      });

      setPrayerTimes(processedPrayers);
    } catch (err) {
      console.error("Failed to fetch prayer times:", err);
      setError(t_sholat.errors.fetchFailed);
    }
  };

  // Helper to translate prayer names (Manual Mapping)
  const getPrayerName = (key: string, loc: LocaleCode) => {
    const maps: Record<string, Record<LocaleCode, string>> = {
      Fajr: {
        id: "Subuh",
        en: "Fajr",
        ar: "الفجر",
        fr: "Fajr",
        kr: "파즈르",
        jp: "ファジュル",
      },
      Dhuhr: {
        id: "Dzuhur",
        en: "Dhuhr",
        ar: "الظهر",
        fr: "Dhuhr",
        kr: "두후르",
        jp: "ズフル",
      },
      Asr: {
        id: "Ashar",
        en: "Asr",
        ar: "العصر",
        fr: "Asr",
        kr: "아스르",
        jp: "アスル",
      },
      Maghrib: {
        id: "Maghrib",
        en: "Maghrib",
        ar: "المغرب",
        fr: "Maghrib",
        kr: "마그립",
        jp: "マグリブ",
      },
      Isha: {
        id: "Isya",
        en: "Isha",
        ar: "العشاء",
        fr: "Isha",
        kr: "이샤",
        jp: "イシャー",
      },
    };
    return maps[key]?.[loc] || key;
  };

  // REMOVED: Load Checklist useEffect
  // REMOVED: Save Checklist useEffect

  // Update prayer names on locale change
  useEffect(() => {
    if (prayerTimes.length > 0) {
      if (location) fetchPrayerTimes(location.latitude, location.longitude);
    }
  }, [locale]);

  // Prayer Progress
  const prayerProgress = useMemo(() => {
    if (!prayerTimes.length) return 0;
    const checkedCount = Object.values(prayerChecklist).filter(Boolean).length;
    return Math.round((checkedCount / prayerTimes.length) * 100);
  }, [prayerChecklist, prayerTimes]);

  // Toggle Check (UPDATED: Uses Mutation)
  const togglePrayerCheck = async (prayerTranslatedName: string) => {
    // 1. Find the original English key (e.g., "Fajr")
    const prayerObj = prayerTimes.find((p) => p.name === prayerTranslatedName);
    if (!prayerObj) return;

    // Casting ke tipe union PrayerStatusKey
    const backendKey = prayerObj.originalKey.toLowerCase() as PrayerStatusKey; // "fajr"

    // 2. Determine new state
    // Tidak perlu 'as any', TypeScript tahu backendKey adalah key yang valid
    const currentStatus = todayRecord ? todayRecord[backendKey] : false;
    const newStatus = !currentStatus;

    // 3. Construct Payload
    const payload = {
      date: todayDate,
      fajr: todayRecord?.fajr || false,
      dhuhr: todayRecord?.dhuhr || false,
      asr: todayRecord?.asr || false,
      maghrib: todayRecord?.maghrib || false,
      isha: todayRecord?.isha || false,
      [backendKey]: newStatus, // Update dynamic key aman
    };

    try {
      await toggleSholat(payload).unwrap();

      if (newStatus) {
        setCompletedPrayerName(prayerTranslatedName);
        setShowMotivationDialog(true);
      }
    } catch (error) {
      console.error("Failed to toggle prayer:", error);
    }
  };

  // Geolocation
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(t_sholat.errors.geoNotSupported);
      return;
    }
    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${locale}`,
          );
          let locData = {
            city: t_sholat.errors.locUnknown,
            country: "Indonesia",
          };
          if (response.ok) {
            const data = await response.json();
            locData = {
              city: data.city || data.locality || locData.city,
              country: data.countryName || locData.country,
            };
          }
          setLocation({ latitude, longitude, ...locData });
          await fetchPrayerTimes(latitude, longitude);
          setPermissionStatus("granted");
        } catch (e) {
          setError(t_sholat.errors.locError);
          setLocation({
            latitude,
            longitude,
            city: t_sholat.currentLocation,
            country: "Indonesia",
          });
          await fetchPrayerTimes(latitude, longitude);
        }
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
        setPermissionStatus("denied");
        // Map error codes
        const msgs = t_sholat.errors;
        if (err.code === 1) setError(msgs.locDenied);
        else if (err.code === 2) setError(msgs.locUnavailable);
        else if (err.code === 3) setError(msgs.locTimeout);
        else setError(msgs.locError);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  };

  // Init Audio & Permissions
  useEffect(() => {
    if (navigator.geolocation) setPermissionStatus("prompt");
    else setError(t_sholat.errors.geoNotSupported);

    if (localStorage.getItem("adhan-reminder-enabled") === "true")
      setIsAdhanEnabled(true);
    if ("Notification" in window)
      setNotificationPermission(Notification.permission);

    const audio = new Audio(ADHAN_URLS[0]);
    audio.preload = "auto";
    let urlIdx = 0;
    audio.onerror = () => {
      urlIdx++;
      if (urlIdx < ADHAN_URLS.length) {
        audio.src = ADHAN_URLS[urlIdx];
        audio.load();
      }
    };
    adhanAudioRef.current = audio;

    return () => {
      adhanTimersRef.current.forEach(clearTimeout);
      if (adhanAudioRef.current) {
        adhanAudioRef.current.pause();
        adhanAudioRef.current = null;
      }
    };
  }, []);

  // Play Adhan
  const playAdhan = useCallback(
    (prayerName: string) => {
      if (!adhanAudioRef.current)
        adhanAudioRef.current = new Audio(ADHAN_URLS[0]);
      setCurrentAdhanPrayer(prayerName);
      setIsAdhanPlaying(true);

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`${t_sholat.notification.title} ${prayerName}`, {
          body: `${t_sholat.notification.body} ${prayerName}`,
          icon: "/icons/icon-192x192.png",
          tag: `adhan-${prayerName}`,
          requireInteraction: true,
        });
      }

      adhanAudioRef.current.currentTime = 0;
      adhanAudioRef.current.play().catch((e) => {
        console.error(e);
        setIsAdhanPlaying(false);
      });
      adhanAudioRef.current.onended = () => setIsAdhanPlaying(false);
    },
    [t_sholat],
  );

  const stopAdhan = useCallback(() => {
    if (adhanAudioRef.current) {
      adhanAudioRef.current.pause();
      adhanAudioRef.current.currentTime = 0;
    }
    setIsAdhanPlaying(false);
  }, []);

  // Schedule Adhan
  const scheduleAdhanReminders = useCallback(() => {
    adhanTimersRef.current.forEach(clearTimeout);
    adhanTimersRef.current = [];
    if (!isAdhanEnabled || !prayerTimes.length) return;

    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    prayerTimes.forEach((p) => {
      const [h, m] = p.time.split(" ")[0].split(":").map(Number);
      const pMins = h * 60 + m;
      if (pMins > currentMins) {
        const delay = (pMins - currentMins) * 60 * 1000;
        const timer = setTimeout(() => playAdhan(p.name), delay);
        adhanTimersRef.current.push(timer);
      }
    });
  }, [isAdhanEnabled, prayerTimes, playAdhan]);

  useEffect(() => {
    scheduleAdhanReminders();
    const id = setInterval(scheduleAdhanReminders, 60000);
    return () => clearInterval(id);
  }, [scheduleAdhanReminders]);

  // Toggle Adhan
  const toggleAdhanReminder = async () => {
    if (!isAdhanEnabled) {
      if (!("Notification" in window))
        return alert(t_sholat.errors.geoNotSupported);
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);

      if (perm === "granted") {
        setIsAdhanEnabled(true);
        localStorage.setItem("adhan-reminder-enabled", "true");
        // Test play silent
        if (adhanAudioRef.current) {
          adhanAudioRef.current.volume = 0;
          adhanAudioRef.current
            .play()
            .then(() => {
              setTimeout(() => {
                if (adhanAudioRef.current) {
                  adhanAudioRef.current.pause();
                  adhanAudioRef.current.volume = 1;
                }
              }, 500);
            })
            .catch(console.log);
        }
      } else {
        alert(t_sholat.errors.notificationBlocked);
      }
    } else {
      setIsAdhanEnabled(false);
      localStorage.setItem("adhan-reminder-enabled", "false");
      stopAdhan();
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative flex gap-2 items-center bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className={`w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200 ${
                  isRtl ? "rotate-180" : ""
                }`}
              >
                <ArrowLeft className="w-10 h-10" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-awqaf-primary font-comfortaa text-center">
                {t_sholat.title}
              </h1>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa text-center mt-1">
                {t_sholat.subtitle}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Location Card */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-awqaf-primary" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-card-foreground font-comfortaa">
                  {t_sholat.currentLocation}
                </h2>
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  {location
                    ? `${location.city}, ${location.country}`
                    : t_sholat.locationNotSet}
                </p>
              </div>
              {permissionStatus === "granted" && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>

            {!location && (
              <div className="space-y-3">
                <Button
                  onClick={getCurrentLocation}
                  disabled={isLoading}
                  className="w-full bg-awqaf-primary hover:bg-awqaf-primary/90 text-white font-comfortaa"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      {t_sholat.gettingLocation}
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 mr-2" />{" "}
                      {t_sholat.useCurrentLocation}
                    </>
                  )}
                </Button>
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-600 font-comfortaa">
                      {error}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Adhan Reminder Card */}
        {location && prayerTimes.length > 0 && (
          <Card className="border-awqaf-border-light">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isAdhanEnabled ? "bg-awqaf-primary text-white" : "bg-accent-100 text-awqaf-primary"}`}
                  >
                    {isAdhanEnabled ? (
                      <Bell className="w-5 h-5" />
                    ) : (
                      <BellOff className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground font-comfortaa">
                      {t_sholat.adhanReminder}
                    </h3>
                    <p className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                      {isAdhanEnabled
                        ? t_sholat.adhanActive
                        : t_sholat.activateReminder}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={toggleAdhanReminder}
                  variant={isAdhanEnabled ? "default" : "outline"}
                  size="sm"
                  className={`font-comfortaa ${isAdhanEnabled ? "bg-awqaf-primary hover:bg-awqaf-primary/90" : "border-awqaf-border-light"}`}
                >
                  {isAdhanEnabled ? (
                    <>
                      <Volume2 className="w-4 h-4 mr-2" /> {t_sholat.active}
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4 mr-2" /> {t_sholat.inactive}
                    </>
                  )}
                </Button>
              </div>

              {isAdhanEnabled && (
                <div className="mt-4 pt-4 border-t border-awqaf-border-light">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                      {isAdhanPlaying
                        ? `${t_sholat.playingAdhan} ${currentAdhanPrayer}...`
                        : t_sholat.testAdhan}
                    </span>
                    <Button
                      onClick={() =>
                        isAdhanPlaying ? stopAdhan() : playAdhan("Test")
                      }
                      variant="outline"
                      size="sm"
                      className="border-awqaf-border-light font-comfortaa"
                    >
                      {isAdhanPlaying ? (
                        <>
                          <Square className="w-4 h-4 mr-2" /> {t_sholat.stop}
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" /> {t_sholat.test}
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="mt-3 text-xs text-awqaf-foreground-secondary font-comfortaa">
                    <p>{t_sholat.scheduledPrayers}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {prayerTimes
                        .filter(
                          (p) =>
                            p.status === "upcoming" || p.status === "current",
                        )
                        .map((p) => (
                          <span
                            key={p.name}
                            className="px-2 py-1 bg-accent-100 rounded-full text-awqaf-primary"
                          >
                            {p.name} ({p.time})
                          </span>
                        ))}
                      {prayerTimes.every((p) => p.status === "completed") && (
                        <span>{t_sholat.allPrayersPassed}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Prayer Times */}
        {location && prayerTimes.length > 0 && (
          <Card className="border-awqaf-border-light">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-awqaf-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground font-comfortaa">
                    {t_sholat.todaySchedule}
                  </h3>
                  <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                    {new Date().toLocaleDateString(
                      locale === "id" ? "id-ID" : "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-6 p-4 bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl border border-awqaf-border-light">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-awqaf-primary" />
                    <span className="font-semibold text-card-foreground font-comfortaa">
                      {t_sholat.prayerProgress}
                    </span>
                  </div>
                  <span
                    className={`text-2xl font-bold font-comfortaa ${prayerProgress === 100 ? "text-green-600" : "text-awqaf-primary"}`}
                  >
                    {prayerProgress}%
                  </span>
                </div>
                <Progress
                  value={prayerProgress}
                  className="h-3 bg-accent-200"
                />
                <div className="flex items-center justify-between mt-2 text-xs font-comfortaa">
                  <span className="text-awqaf-foreground-secondary">
                    {Object.values(prayerChecklist).filter(Boolean).length} /{" "}
                    {prayerTimes.length} Sholat
                  </span>
                  {prayerProgress === 100 ? (
                    <span className="text-green-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />{" "}
                      {t_sholat.alhamdulillah}
                    </span>
                  ) : (
                    <span className="text-awqaf-primary font-semibold">
                      {t_sholat.keepSpirit}
                    </span>
                  )}
                </div>
                <p className="text-xs text-center text-awqaf-foreground-secondary font-comfortaa mt-3 italic">
                  {t_sholat.markInstruction}
                </p>
              </div>

              {/* List */}
              <div className="space-y-3">
                {prayerTimes.map((prayer) => {
                  const isChecked = prayerChecklist[prayer.name] || false;

                  // LOGIC BARU: Cek apakah sholat belum masuk waktunya
                  const isUpcoming = prayer.status === "upcoming";

                  return (
                    <div
                      key={prayer.name}
                      className={`flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-200 ${
                        isChecked
                          ? "bg-green-50/50 border-2 border-green-200"
                          : prayer.status === "current"
                            ? "bg-accent-100 border border-accent-200"
                            : "hover:bg-accent-50 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <button
                          onClick={() => togglePrayerCheck(prayer.name)}
                          // 1. DISABLE tombol jika statusnya "upcoming"
                          disabled={isUpcoming}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all 
            ${
              // 2. STYLING: Ubah warna jika upcoming (abu-abu) vs active
              isUpcoming
                ? "bg-gray-200 text-gray-400 cursor-not-allowed" // Style saat belum waktunya
                : isChecked
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : prayer.status === "current"
                    ? "bg-awqaf-primary text-white hover:bg-awqaf-primary/90"
                    : "bg-accent-100 text-awqaf-primary hover:bg-accent-200"
            }`}
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-6 h-6" />
                          ) : (
                            <Circle className="w-6 h-6" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-card-foreground font-comfortaa font-semibold text-lg ${
                                isChecked ? "line-through opacity-70" : ""
                              } ${isUpcoming ? "opacity-50" : ""}`} // Opsional: Memudarkan teks jika belum waktunya
                            >
                              {prayer.name}
                            </span>
                            {isChecked && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <p
                            className={`text-sm font-tajawal ${isUpcoming ? "text-gray-400" : "text-awqaf-primary"}`}
                          >
                            {prayer.arabic}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-comfortaa font-bold text-xl ${
                            isUpcoming
                              ? "text-gray-400"
                              : isChecked
                                ? "text-green-600"
                                : prayer.status === "current"
                                  ? "text-awqaf-primary"
                                  : "text-awqaf-foreground-secondary"
                          }`}
                        >
                          {prayer.time}
                        </span>

                        {/* Pesan Status Tambahan */}
                        {isUpcoming && (
                          <p className="text-xs text-gray-400 font-comfortaa mt-1">
                            Belum Waktunya
                          </p>
                        )}

                        {isChecked && (
                          <p className="text-xs text-green-600 font-comfortaa mt-1 font-semibold">
                            {t_sholat.alreadyPrayed}
                          </p>
                        )}
                        {!isChecked && prayer.status === "current" && (
                          <p className="text-xs text-green-600 font-comfortaa mt-1">
                            {t_sholat.currentlyOngoing}
                          </p>
                        )}
                        {!isChecked && prayer.status === "completed" && (
                          <p className="text-xs text-awqaf-foreground-secondary font-comfortaa mt-1">
                            {t_sholat.completed}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Location State */}
        {!location && !isLoading && !error && (
          <Card className="border-awqaf-border-light">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-awqaf-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground font-comfortaa mb-2">
                {t_sholat.locationRequired}
              </h3>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa mb-4">
                {t_sholat.locationRequiredDesc}
              </p>
              <Button
                onClick={getCurrentLocation}
                className="bg-awqaf-primary hover:bg-awqaf-primary/90 text-white font-comfortaa"
              >
                <Navigation className="w-4 h-4 mr-2" />{" "}
                {t_sholat.allowLocationAccess}
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Motivation Dialog */}
      <Dialog
        open={showMotivationDialog}
        onOpenChange={setShowMotivationDialog}
      >
        <DialogContent className="border-awqaf-border-light p-0 max-w-sm">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <DialogTitle className="font-comfortaa text-center text-xl">
              {t_sholat.motivationTitle}
            </DialogTitle>
            <DialogDescription className="text-center font-comfortaa text-sm text-awqaf-foreground-secondary">
              {t_sholat.motivationDesc}{" "}
              <span className="font-semibold text-awqaf-primary">
                {completedPrayerName}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6 space-y-4">
            <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-4 rounded-lg border border-awqaf-border-light">
              <p className="text-sm text-center text-awqaf-foreground font-comfortaa leading-relaxed">
                {t_sholat.quranQuote}
              </p>
              <p className="text-xs text-center text-awqaf-foreground-secondary font-comfortaa mt-2">
                {t_sholat.quranSource}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                {t_sholat.motivationFooter}
              </p>
            </div>
            <Button
              onClick={() => setShowMotivationDialog(false)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-comfortaa"
            >
              <Check className="w-4 h-4 mr-2" /> {t_sholat.alhamdulillahBtn}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
