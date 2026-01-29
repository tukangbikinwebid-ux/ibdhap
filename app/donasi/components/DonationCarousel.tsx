"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, Loader2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import ImageWithFallback from "./ImageWithFallback";
import { useI18n } from "@/app/hooks/useI18n";
import { useGetCampaignsQuery } from "@/services/public/campaign.service";
import { Campaign } from "@/types/public/campaign";

// --- TYPES ---
type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

interface CarouselTranslations {
  noData: string;
  progress: string;
  days: string;
  donateBtn: string;
  loading: string;
}

export interface CarouselDonation {
  id: number; // ID asli dari DB (number)
  title: string;
  image: string;
  currentAmount: number;
  targetAmount: number;
  progress: number;
  donorCount: number;
  endDate: string;
  category: string;
}

interface DonationCarouselProps {
  onDonateClick?: (donation: CarouselDonation) => void;
}

// --- TRANSLATION DICTIONARY ---
const CAROUSEL_TEXT: Record<LocaleCode, CarouselTranslations> = {
  id: {
    noData: "Tidak ada donasi populer saat ini",
    progress: "Tercapai",
    days: "Hari",
    donateBtn: "Donasi Sekarang",
    loading: "Memuat donasi...",
  },
  en: {
    noData: "No popular donations at the moment",
    progress: "Raised",
    days: "Days",
    donateBtn: "Donate Now",
    loading: "Loading donations...",
  },
  ar: {
    noData: "لا توجد تبرعات شائعة في الوقت الحالي",
    progress: "مكتمل",
    days: "أيام",
    donateBtn: "تبرع الآن",
    loading: "جار تحميل التبرعات...",
  },
  fr: {
    noData: "Aucun don populaire pour le moment",
    progress: "Atteint",
    days: "Jours",
    donateBtn: "Donner",
    loading: "Chargement...",
  },
  kr: {
    noData: "현재 인기 있는 기부가 없습니다",
    progress: "달성률",
    days: "일",
    donateBtn: "지금 기부",
    loading: "로드 중...",
  },
  jp: {
    noData: "現在人気の寄付はありません",
    progress: "達成率",
    days: "日",
    donateBtn: "今すぐ寄付",
    loading: "読み込み中...",
  },
};

// --- HELPER FUNCTIONS ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("id-ID").format(num);
};

const getDaysRemaining = (endDate: string) => {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export default function DonationCarousel({
  onDonateClick,
}: DonationCarouselProps) {
  const { locale } = useI18n();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Safe Locale Access
  const safeLocale = (
    CAROUSEL_TEXT[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = CAROUSEL_TEXT[safeLocale];
  const isRtl = safeLocale === "ar";

  // --- API INTEGRATION ---
  // Fetch Top 5 Campaigns (bisa disesuaikan sort-nya di backend jika ada parameter 'popular')
  const { data: campaignsData, isLoading } = useGetCampaignsQuery({
    page: 1,
    paginate: 5,
  });

  // --- DATA PROCESSING ---
  const donations: CarouselDonation[] = useMemo(() => {
    if (!campaignsData?.data) return [];

    return campaignsData.data.map((campaign) => {
      // Logic Translation untuk Title
      const translation =
        campaign.translations?.find((tr) => tr.locale === locale) ||
        campaign.translations?.find((tr) => tr.locale === "id");

      const displayTitle = translation?.title || campaign.title;

      const progress =
        campaign.target_amount > 0
          ? Math.round((campaign.raised_amount / campaign.target_amount) * 100)
          : 0;

      return {
        id: campaign.id,
        title: displayTitle,
        image: campaign.image,
        currentAmount: campaign.raised_amount,
        targetAmount: campaign.target_amount,
        progress: Math.min(progress, 100),
        donorCount: 0, // Mock, karena list API biasanya tidak return jumlah donatur
        endDate: campaign.end_date,
        category: campaign.category,
      };
    });
  }, [campaignsData, locale]);

  // Carousel Autoplay Logic
  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [api]);

  // --- RENDER ---

  // Loading State (Skeleton)
  if (isLoading) {
    return (
      <Card className="border-awqaf-border-light overflow-hidden p-0 h-[250px] w-full">
        <div className="h-full w-full bg-gray-200 animate-pulse flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </Card>
    );
  }

  // Empty State
  if (donations.length === 0) {
    return (
      <Card className="border-awqaf-border-light">
        <CardContent className="p-6 text-center">
          <p className="text-awqaf-foreground-secondary font-comfortaa">
            {t.noData}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative" dir={isRtl ? "rtl" : "ltr"}>
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
          direction: isRtl ? "rtl" : "ltr",
        }}
        className="w-full"
      >
        <CarouselContent>
          {donations.map((donation) => {
            const daysRemaining = getDaysRemaining(donation.endDate);

            return (
              <CarouselItem key={donation.id}>
                <Card className="border-awqaf-border-light overflow-hidden p-0">
                  <div className="relative aspect-video">
                    {/* Background Image - Full Coverage */}
                    <div className="absolute inset-0">
                      <ImageWithFallback
                        src={donation.image}
                        alt={donation.title}
                        fill
                        className="object-cover"
                      />
                      {/* Darker overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-10 h-full flex flex-col justify-end p-6">
                      {/* Title */}
                      <div className="mb-3">
                        <h3 className="text-lg font-semibold text-white font-comfortaa leading-snug line-clamp-2 drop-shadow-md">
                          {donation.title}
                        </h3>
                      </div>

                      {/* Progress Bar & Amounts */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-200 font-comfortaa font-medium drop-shadow-sm">
                            {t.progress}
                          </span>
                          <span className="text-sm font-bold text-white font-comfortaa drop-shadow-sm">
                            {donation.progress}%
                          </span>
                        </div>
                        <Progress
                          value={donation.progress}
                          className="h-2 bg-white/20 mb-2"
                          // Anda bisa custom class indicator di global css atau tailwind config untuk warna fill progress
                        />
                        <div
                          className="flex justify-between text-[10px] sm:text-xs text-gray-300 font-comfortaa font-mono"
                          dir="ltr"
                        >
                          <span className="drop-shadow-sm">
                            {formatCurrency(donation.currentAmount)}
                          </span>
                          <span className="drop-shadow-sm">
                            {formatCurrency(donation.targetAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Stats - Simplified for Carousel */}
                      <div className="flex items-center gap-4 mb-4 text-xs text-gray-200">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span className="font-comfortaa font-medium drop-shadow-sm">
                            {formatNumber(donation.donorCount)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span className="font-comfortaa font-medium drop-shadow-sm">
                            {daysRemaining} {t.days}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => onDonateClick?.(donation)}
                        className="w-full bg-awqaf-primary hover:bg-awqaf-primary/90 text-white font-comfortaa text-sm py-2.5 rounded-lg"
                      >
                        {t.donateBtn}
                      </button>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {donations.map((_, idx) => (
          <button
            key={idx}
            onClick={() => api?.scrollTo(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === current
                ? "bg-awqaf-primary w-4"
                : "bg-gray-300 hover:bg-awqaf-primary/50"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}