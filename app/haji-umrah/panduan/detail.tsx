"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Share2, LucideIcon, Check, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProcessedGuideStep } from "./page";
import { LocaleCode } from "@/lib/i18n";

interface GuideDetailProps {
  step: ProcessedGuideStep;
  locale: LocaleCode;
  onBack: () => void;
  totalSteps: number;
  icon: LucideIcon;
}

// --- LOCAL UI TRANSLATIONS (6 BAHASA) ---
const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  id: {
    headerTitle: "Detail Panduan",
    step: "Langkah",
    guideLabel: "Panduan",
    finish: "Kembali ke Panduan",
  },
  en: {
    headerTitle: "Guide Detail",
    step: "Step",
    guideLabel: "Guide",
    finish: "Back to Guide",
  },
  ar: {
    headerTitle: "تفاصيل الدليل",
    step: "خطوة",
    guideLabel: "دليل",
    finish: "العودة للدليل",
  },
  fr: {
    headerTitle: "Détail du Guide",
    step: "Étape",
    guideLabel: "Guide",
    finish: "Retour au Guide",
  },
  kr: {
    headerTitle: "가이드 상세",
    step: "단계",
    guideLabel: "가이드",
    finish: "가이드로 돌아가기",
  },
  jp: {
    headerTitle: "ガイドの詳細",
    step: "ステップ",
    guideLabel: "ガイド",
    finish: "ガイドに戻る",
  },
};

export default function GuideDetail({
  step,
  locale,
  onBack,
  totalSteps,
  icon: Icon,
}: GuideDetailProps) {
  // RTL Detection
  const isRtl = locale === "ar";
  const [copied, setCopied] = useState(false);

  // Helper untuk mengambil teks UI berdasarkan locale
  const lt = (key: string) => {
    const lang = locale || "id";
    return UI_TRANSLATIONS[lang]?.[key] || UI_TRANSLATIONS["id"][key] || key;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleShare = async () => {
    const cleanSummary = step.summary.replace(/<[^>]*>?/gm, "");
    const shareText = `${step.title} (${step.category.toUpperCase()})\n\n${cleanSummary}\n\nLink: ${window.location.href}`;

    const shareData = {
      title: step.title,
      text: shareText,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* HEADER: Floating Glass */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
              >
                <ArrowLeft className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`} />
              </Button>
              <div className="text-center">
                <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa">
                  {lt("headerTitle")}
                </h1>
              </div>
              <Button
                onClick={handleShare}
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 hover:text-awqaf-primary transition-colors duration-200"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Share2 className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-md mx-auto px-4 py-2 space-y-4">
        {/* Info Card */}
        <Card className="border-awqaf-border-light shadow-sm bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-accent-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent-100">
              <Icon className="w-8 h-8 text-awqaf-primary" />
            </div>
            <Badge className="mb-3 bg-awqaf-secondary/20 text-awqaf-primary hover:bg-awqaf-secondary/30 border-0 px-3 py-1 font-bold font-comfortaa">
              {step.category.toUpperCase()}
            </Badge>
            <h2 className="text-2xl font-bold text-awqaf-primary font-comfortaa mb-2 leading-tight">
              {step.title}
            </h2>
            <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
              {lt("step")} <span className="font-bold">{step.stepNumber}</span>{" "}
              / {totalSteps}
            </p>
          </CardContent>
        </Card>

        {/* Description Content */}
        <Card className="border-awqaf-border-light shadow-sm bg-white/95 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-awqaf-primary" />
              <span className="font-bold text-awqaf-primary font-comfortaa">
                {lt("guideLabel")}
              </span>
            </div>

            <article
              className={`
                prose prose-sm max-w-none 
                text-awqaf-foreground-secondary font-comfortaa leading-relaxed
                prose-p:mb-4
                prose-strong:text-awqaf-primary prose-strong:font-bold
                prose-li:marker:text-awqaf-primary
                ${isRtl ? "text-right" : "text-justify"}
              `}
            >
              <div dangerouslySetInnerHTML={{ __html: step.content }} />
            </article>
          </CardContent>
        </Card>
      </main>

      {/* Floating Footer Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-30 bg-gradient-to-t from-white via-white/90 to-transparent">
        <div className="max-w-md mx-auto">
          <Button
            onClick={onBack}
            className="w-full rounded-xl bg-awqaf-primary hover:bg-awqaf-primary/90 text-white shadow-lg h-12 font-bold font-comfortaa transition-transform active:scale-[0.98]"
          >
            {lt("finish")}
          </Button>
        </div>
      </div>
    </div>
  );
}