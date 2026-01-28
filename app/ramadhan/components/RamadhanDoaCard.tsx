"use client";

import Link from "next/link";
import { Heart, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/app/hooks/useI18n";

// --- 1. TIPE DATA ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface DoaItem {
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  moment: string;
}

interface UIText {
  cardTitle: string;
  viewAll: string;
}

// --- 2. DATA TRANSLATION (6 BAHASA) ---
const UI_TEXT: Record<LocaleCode, UIText> = {
  id: {
    cardTitle: "Doa & Dzikir Ramadhan",
    viewAll: "Lihat Semua Doa & Dzikir",
  },
  en: { cardTitle: "Ramadan Prayers & Dhikr", viewAll: "View All Prayers" },
  ar: { cardTitle: "أدعية وأذكار رمضان", viewAll: "عرض جميع الأدعية" },
  fr: {
    cardTitle: "Prières et Dhikr du Ramadan",
    viewAll: "Voir toutes les prières",
  },
  kr: { cardTitle: "라마단 기도와 지키르", viewAll: "모든 기도 보기" },
  jp: { cardTitle: "ラマダンの祈りとズィクル", viewAll: "すべての祈りを見る" },
};

const DOA_DATA: Record<LocaleCode, DoaItem[]> = {
  id: [
    {
      title: "Doa Niat Puasa",
      arabic: "وَبِصَوْمِ غَدٍ نَوَيْتُ مِنْ شَهْرِ رَمَضَانَ",
      latin: "Wa bishaumi ghadin nawaitu min shahri ramadhan",
      translation: "Aku berniat berpuasa esok hari untuk bulan Ramadhan",
      moment: "Malam (sebelum tidur)",
    },
    {
      title: "Doa Berbuka Puasa",
      arabic:
        "اَللّٰهُمَّ لَكَ صُمْتُ وَبِكَ اٰمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلٰى رِزْقِكَ اَفْطَرْتُ",
      latin:
        "Allahumma laka shumtu wa bika aamantu wa 'alaika tawakkaltu wa 'ala rizqika afthartu",
      translation:
        "Ya Allah, untuk-Mu aku berpuasa, kepada-Mu aku beriman, kepada-Mu aku bertawakal, dan dengan rezeki-Mu aku berbuka",
      moment: "Saat Berbuka",
    },
    {
      title: "Doa Setelah Tarawih",
      arabic: "سُبْحَانَ الْمَلِكِ الْقُدُّوسِ",
      latin: "Subhanal malikil quddus (3x)",
      translation: "Maha Suci Raja Yang Maha Suci",
      moment: "Setelah Tarawih",
    },
    {
      title: "Doa Lailatul Qadar",
      arabic: "اَللّٰهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
      latin: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni",
      translation:
        "Ya Allah, sesungguhnya Engkau Maha Pemaaf, Engkau menyukai pemaafan, maka maafkanlah aku",
      moment: "10 Malam Terakhir",
    },
  ],
  en: [
    {
      title: "Fasting Intention",
      arabic: "وَبِصَوْمِ غَدٍ نَوَيْتُ مِنْ شَهْرِ رَمَضَانَ",
      latin: "Wa bishaumi ghadin nawaitu min shahri ramadhan",
      translation:
        "I intend to keep the fast for tomorrow in the month of Ramadan",
      moment: "Night (Before sleep)",
    },
    {
      title: "Iftar Prayer",
      arabic:
        "اَللّٰهُمَّ لَكَ صُمْتُ وَبِكَ اٰمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلٰى رِزْقِكَ اَفْطَرْتُ",
      latin:
        "Allahumma laka shumtu wa bika aamantu wa 'alaika tawakkaltu wa 'ala rizqika afthartu",
      translation:
        "O Allah! I fasted for You and I believe in You and I put my trust in You and I break my fast with Your sustenance",
      moment: "At Iftar",
    },
    {
      title: "After Taraweeh",
      arabic: "سُبْحَانَ الْمَلِكِ الْقُدُّوسِ",
      latin: "Subhanal malikil quddus (3x)",
      translation: "Glory be to the King, the Holy",
      moment: "After Taraweeh",
    },
    {
      title: "Laylatul Qadr Prayer",
      arabic: "اَللّٰهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
      latin: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni",
      translation:
        "O Allah, You are Forgiving and love forgiveness, so forgive me",
      moment: "Last 10 Nights",
    },
  ],
  ar: [
    {
      title: "دعاء نية الصيام",
      arabic: "وَبِصَوْمِ غَدٍ نَوَيْتُ مِنْ شَهْرِ رَمَضَانَ",
      latin: "Wa bishaumi ghadin nawaitu min shahri ramadhan",
      translation: "نويت صيام غد من شهر رمضان",
      moment: "ليلاً",
    },
    {
      title: "دعاء الإفطار",
      arabic:
        "اَللّٰهُمَّ لَكَ صُمْتُ وَبِكَ اٰمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلٰى رِزْقِكَ اَفْطَرْتُ",
      latin:
        "Allahumma laka shumtu wa bika aamantu wa 'alaika tawakkaltu wa 'ala rizqika afthartu",
      translation: "اللهم لك صمت وبك آمنت وعليك توكلت وعلى رزقك أفطرت",
      moment: "عند الإفطار",
    },
    {
      title: "دعاء بعد التراويح",
      arabic: "سُبْحَانَ الْمَلِكِ الْقُدُّوسِ",
      latin: "Subhanal malikil quddus (3x)",
      translation: "سبحان الملك القدوس",
      moment: "بعد التراويح",
    },
    {
      title: "دعاء ليلة القدر",
      arabic: "اَللّٰهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
      latin: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni",
      translation: "اللهم إنك عفو تحب العفو فاعف عني",
      moment: "العشر الأواخر",
    },
  ],
  fr: [
    {
      title: "Intention de jeûne",
      arabic: "وَبِصَوْمِ غَدٍ نَوَيْتُ مِنْ شَهْرِ رَمَضَانَ",
      latin: "Wa bishaumi ghadin nawaitu min shahri ramadhan",
      translation: "J'ai l'intention de jeûner demain pour le mois de Ramadan",
      moment: "Nuit (Avant de dormir)",
    },
    {
      title: "Prière de rupture (Iftar)",
      arabic:
        "اَللّٰهُمَّ لَكَ صُمْتُ وَبِكَ اٰمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلٰى رِزْقِكَ اَفْطَرْتُ",
      latin:
        "Allahumma laka shumtu wa bika aamantu wa 'alaika tawakkaltu wa 'ala rizqika afthartu",
      translation:
        "Ô Allah ! J'ai jeûné pour Toi, je crois en Toi, je place ma confiance en Toi et je romps mon jeûne avec Ta subsistance",
      moment: "À l'Iftar",
    },
    {
      title: "Après Tarawih",
      arabic: "سُبْحَانَ الْمَلِكِ الْقُدُّوسِ",
      latin: "Subhanal malikil quddus (3x)",
      translation: "Gloire au Roi, le Saint",
      moment: "Après Tarawih",
    },
    {
      title: "Nuit du Destin",
      arabic: "اَللّٰهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
      latin: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni",
      translation:
        "Ô Allah, Tu es Pardonneur et Tu aimes le pardon, alors pardonne-moi",
      moment: "10 Dernières Nuits",
    },
  ],
  kr: [
    {
      title: "단식 의도 (니야트)",
      arabic: "وَبِصَوْمِ غَدٍ نَوَيْتُ مِنْ شَهْرِ رَمَضَانَ",
      latin: "Wa bishaumi ghadin nawaitu min shahri ramadhan",
      translation: "나는 내일 라마단 단식을 할 것을 맹세합니다",
      moment: "밤 (잠들기 전)",
    },
    {
      title: "이프타르 기도",
      arabic:
        "اَللّٰهُمَّ لَكَ صُمْتُ وَبِكَ اٰمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلٰى رِزْقِكَ اَفْطَرْتُ",
      latin:
        "Allahumma laka shumtu wa bika aamantu wa 'alaika tawakkaltu wa 'ala rizqika afthartu",
      translation:
        "오 알라시여, 당신을 위해 단식했고, 당신을 믿으며, 당신께 의지하고, 당신이 주신 양식으로 단식을 깹니다",
      moment: "이프타르 때",
    },
    {
      title: "타라위 후 기도",
      arabic: "سُبْحَانَ الْمَلِكِ الْقُدُّوسِ",
      latin: "Subhanal malikil quddus (3x)",
      translation: "거룩하신 왕에게 영광을",
      moment: "타라위 후",
    },
    {
      title: "권능의 밤 기도",
      arabic: "اَللّٰهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
      latin: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni",
      translation:
        "오 알라시여, 당신은 용서하시는 분이며 용서를 사랑하시니 저를 용서해 주소서",
      moment: "마지막 10일 밤",
    },
  ],
  jp: [
    {
      title: "断食の意図（ニヤ）",
      arabic: "وَبِصَوْمِ غَدٍ نَوَيْتُ مِنْ شَهْرِ رَمَضَانَ",
      latin: "Wa bishaumi ghadin nawaitu min shahri ramadhan",
      translation: "私は明日、ラマダンの断食をすることを意図します",
      moment: "夜（寝る前）",
    },
    {
      title: "断食明けの祈り（イフタール）",
      arabic:
        "اَللّٰهُمَّ لَكَ صُمْتُ وَبِكَ اٰمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلٰى رِزْقِكَ اَفْطَرْتُ",
      latin:
        "Allahumma laka shumtu wa bika aamantu wa 'alaika tawakkaltu wa 'ala rizqika afthartu",
      translation:
        "アッラーよ、私はあなたのために断食し、あなたを信じ、あなたに頼り、あなたの糧で断食を解きます",
      moment: "イフタール時",
    },
    {
      title: "タラウィーの後",
      arabic: "سُبْحَانَ الْمَلِكِ الْقُدُّوسِ",
      latin: "Subhanal malikil quddus (3x)",
      translation: "聖なる王に栄光あれ",
      moment: "タラウィーの後",
    },
    {
      title: "みいつの夜（ライラトル・カダル）",
      arabic: "اَللّٰهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
      latin: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni",
      translation:
        "アッラーよ、あなたは許す方であり、許しを愛されます。どうか私をお許しください",
      moment: "最後の10夜",
    },
  ],
};

export default function RamadhanDoaCard() {
  const { locale } = useI18n();

  // Safe Locale Access with Fallback to 'id'
  const safeLocale = (
    DOA_DATA[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;

  const doas = DOA_DATA[safeLocale];
  const ui = UI_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  return (
    <Card className="border-awqaf-border-light" dir={isRtl ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-comfortaa">
          <Heart className="w-5 h-5 text-awqaf-primary" />
          {ui.cardTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {doas.map((doa, index) => (
          <div
            key={index}
            className="p-4 bg-accent-50 rounded-lg space-y-2 border border-accent-100/50 hover:border-accent-200 transition-colors"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-awqaf-primary font-comfortaa">
                {doa.title}
              </h4>
              <Badge
                variant="secondary"
                className="text-[10px] bg-white text-awqaf-foreground-secondary border border-awqaf-border-light"
              >
                {doa.moment}
              </Badge>
            </div>

            <p className="text-xl font-tajawal text-awqaf-primary text-center leading-loose py-2">
              {doa.arabic}
            </p>

            <p className="text-sm italic text-center text-awqaf-foreground-secondary font-comfortaa">
              {doa.latin}
            </p>

            <p className="text-sm text-center text-awqaf-foreground font-comfortaa border-t border-dashed border-accent-200 pt-2 mt-2">
              &quot;{doa.translation}&quot;
            </p>
          </div>
        ))}

        <Link href="/doa-dzikir" className="block mt-4">
          <Button variant="outline" className="w-full font-comfortaa group">
            {ui.viewAll}
            <ChevronRight
              className={`w-4 h-4 text-awqaf-primary group-hover:translate-x-1 transition-transform ${isRtl ? "mr-2 rotate-180" : "ml-2"}`}
            />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}