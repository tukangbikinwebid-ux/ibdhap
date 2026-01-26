"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Share2,
  CheckCircle2,
  LucideIcon,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProcessedImanItem } from "./page";
// Sesuaikan import ini dengan file config i18n Anda
import { LocaleCode } from "@/lib/i18n";

interface ImanDetailProps {
  item: ProcessedImanItem;
  locale: LocaleCode;
  onBack: () => void;
  icon: LucideIcon;
}

export default function ImanDetail({
  item,
  locale,
  onBack,
  icon: Icon,
}: ImanDetailProps) {
  const isRtl = locale === "ar";
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- SHARE FUNCTIONALITY ---
  const handleShare = async () => {
    const shareData = {
      title: item.title,
      text: item.shortDesc,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback Clipboard
        await navigator.clipboard.writeText(
          `${item.title}\n\n${item.shortDesc}\n\nBaca selengkapnya: ${window.location.href}`,
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-md mx-auto min-h-screen bg-white relative pb-20 shadow-xl overflow-hidden">
        {/* HERO SECTION */}
        <div className="relative h-64 bg-gradient-to-b from-awqaf-primary to-awqaf-secondary overflow-hidden">
          {/* Abstract Circle Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>

          {/* Navigation */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
            <Button
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm"
            >
              <ArrowLeft className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`} />
            </Button>

            {/* Functional Share Button */}
            <Button
              onClick={handleShare}
              variant="ghost"
              size="icon"
              className="bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-300" />
              ) : (
                <Share2 className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Central Icon Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 pb-8">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 shadow-lg border border-white/30">
              <Icon className="w-10 h-10 text-white" />
            </div>
            <Badge className="bg-white/20 hover:bg-white/20 text-white border-0 backdrop-blur-sm mb-2 px-3 py-1 text-xs">
              #{item.order}
            </Badge>
            <h1 className="text-2xl font-bold text-center px-4 font-comfortaa leading-tight drop-shadow-md">
              {item.title}
            </h1>
          </div>

          {/* Curve Divider */}
          <div className="absolute -bottom-1 left-0 right-0 h-8 bg-white rounded-t-[30px] z-10"></div>
        </div>

        {/* CONTENT SECTION */}
        <main className="px-6 -mt-2 relative z-20">
          <Card className="border-none shadow-none">
            <CardContent className="p-0">
              {/* Short Description Box */}
              <div className="bg-accent-50 rounded-2xl p-5 mb-6 border border-accent-100 flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-awqaf-secondary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-awqaf-primary font-medium leading-relaxed italic">
                  {`"${item.shortDesc}"`}
                </p>
              </div>

              {/* Main Content */}
              <article
                className={`
                prose prose-sm prose-slate max-w-none 
                prose-headings:text-awqaf-primary prose-headings:font-bold
                prose-p:text-slate-600 prose-p:leading-loose prose-p:font-comfortaa
                ${isRtl ? "text-right font-tajawal" : "text-justify"}
              `}
              >
                <div dangerouslySetInnerHTML={{ __html: item.content }} />
              </article>
            </CardContent>
          </Card>
        </main>

        {/* FOOTER BUTTON */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gradient-to-t from-white via-white to-transparent z-30 pointer-events-none">
          <div className="pointer-events-auto">
            <Button
              onClick={onBack}
              className="w-full rounded-full bg-awqaf-primary hover:bg-awqaf-secondary text-white shadow-lg h-12 font-bold font-comfortaa transition-colors"
            >
              {locale === "en" ? "Done" : "Selesai"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}