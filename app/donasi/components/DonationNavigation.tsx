"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { DonationCategory } from "../data/donations";
import Link from "next/link";
import { useI18n } from "@/app/hooks/useI18n";

// --- TYPES ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface NavTranslations {
  quote: string;
  source: string;
  // Mapping untuk kategori (lowercase keys agar mudah dicocokkan)
  categories: {
    wakaf: { name: string; description: string };
    zakat: { name: string; description: string };
    kurban: { name: string; description: string };
    infaq: { name: string; description: string };
  };
}

// --- TRANSLATION DICTIONARY ---
const NAV_TEXT: Record<LocaleCode, NavTranslations> = {
  id: {
    quote:
      '"Sesungguhnya sedekah itu akan memadamkan panas kubur bagi pelakunya"',
    source: "- HR. Thabrani",
    categories: {
      wakaf: { name: "Wakaf", description: "Wakaf untuk kemaslahatan umat" },
      zakat: { name: "Zakat", description: "Zakat fitrah dan mal" },
      kurban: { name: "Kurban", description: "Hewan kurban untuk Idul Adha" },
      infaq: { name: "Infaq", description: "Infaq untuk kebaikan" },
    },
  },
  en: {
    quote: '"Indeed, charity extinguishes the heat of the grave for its doer"',
    source: "- HR. Thabrani",
    categories: {
      wakaf: { name: "Waqf", description: "Endowment for public welfare" },
      zakat: { name: "Zakat", description: "Zakat Fitrah and Mal" },
      kurban: { name: "Qurban", description: "Sacrifice for Eid al-Adha" },
      infaq: { name: "Infaq", description: "Voluntary charity for goodness" },
    },
  },
  ar: {
    quote: '"إن الصدقة لتطفئ عن أهلها حر القبور"',
    source: "- رواه الطبراني",
    categories: {
      wakaf: { name: "وقف", description: "وقف لمصلحة الأمة" },
      zakat: { name: "زكاة", description: "زكاة الفطر والمال" },
      kurban: { name: "أضحية", description: "أضاحي لعيد الأضحى" },
      infaq: { name: "إنفاق", description: "إنفاق في وجوه الخير" },
    },
  },
  fr: {
    quote:
      '"En effet, la charité éteint la chaleur de la tombe pour celui qui la pratique"',
    source: "- HR. Thabrani",
    categories: {
      wakaf: { name: "Waqf", description: "Dotation pour le bien public" },
      zakat: { name: "Zakat", description: "Zakat Fitrah et Mal" },
      kurban: { name: "Qurban", description: "Sacrifice pour l'Aïd al-Adha" },
      infaq: { name: "Infaq", description: "Charité volontaire" },
    },
  },
  kr: {
    quote: '"자선은 실천하는 자에게 무덤의 열기를 식혀줍니다"',
    source: "- HR. 타브라니",
    categories: {
      wakaf: { name: "와카프", description: "공공 복지를 위한 기부" },
      zakat: { name: "자카트", description: "자카트 피트라 및 말" },
      kurban: { name: "쿠르반", description: "이드 알 아드하 희생" },
      infaq: { name: "인파크", description: "선을 위한 자발적 자선" },
    },
  },
  jp: {
    quote: '"慈善は、それを行う者のために墓の熱を消し去ります"',
    source: "- HR. タブラニ",
    categories: {
      wakaf: { name: "ワクフ", description: "公共の福祉のための寄付" },
      zakat: { name: "ザ カート", description: "ザカート・フィトラと富" },
      kurban: { name: "クルバン", description: "イード・アル＝アドハーの犠牲" },
      infaq: { name: "インファク", description: "善意の自発的な寄付" },
    },
  },
};

interface DonationNavigationProps {
  categories: DonationCategory[];
}

export default function DonationNavigation({
  categories,
}: DonationNavigationProps) {
  const { locale } = useI18n();

  // Safe Locale Access
  const safeLocale = (
    NAV_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = NAV_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  return (
    <div className="space-y-4" dir={isRtl ? "rtl" : "ltr"}>
      {/* Category Grid */}
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => {
          // Mapping kategori berdasarkan ID (pastikan ID di data dummy lowercase: 'wakaf', 'zakat', dll)
          const catKey = category.id.toLowerCase() as keyof typeof t.categories;
          const translated = t.categories[catKey] || {
            name: category.name,
            description: category.description,
          };

          return (
            <Link key={category.id} href={category.href}>
              <Card className="border-awqaf-border-light hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">{category.icon}</div>
                    <ArrowRight
                      className={`w-4 h-4 text-awqaf-foreground-secondary group-hover:text-awqaf-primary transition-colors duration-200 ${isRtl ? "rotate-180" : ""}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-card-foreground text-sm font-comfortaa">
                      {translated.name}
                    </h4>
                    <p className="text-xs text-awqaf-foreground-secondary font-comfortaa line-clamp-2">
                      {translated.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Motivational Quote */}
      <Card className="border-awqaf-border-light bg-gradient-to-r from-accent-100 to-accent-200">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-awqaf-primary font-comfortaa mb-1">
            {t.quote}
          </p>
          <p className="text-xs text-awqaf-foreground-secondary font-tajawal">
            {t.source}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}