"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Share2, Quote, LucideIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LocaleCode } from "@/lib/i18n";
export interface ProcessedIslamItem {
  id: number;
  order: number;
  title: string;
  content: string; // HTML Content
  shortDesc: string;
}

interface IslamDetailProps {
  item: ProcessedIslamItem;
  locale: LocaleCode;
  onBack: () => void;
  icon: LucideIcon;
}

export default function IslamDetail({
  item,
  locale,
  onBack,
  icon: Icon,
}: IslamDetailProps) {
  const isRtl = locale === "ar";
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: item.title,
      text: item.shortDesc,
      url: window.location.href, // Menggunakan URL halaman saat ini
    };

    try {
      // Coba gunakan Web Share API (Mobile Native Share)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback ke Clipboard untuk Desktop / Browser yang tidak mendukung
        await navigator.clipboard.writeText(
          `${item.title}\n\n${item.shortDesc}\n\nBaca selengkapnya: ${window.location.href}`,
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset icon setelah 2 detik
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-md mx-auto min-h-screen bg-white relative pb-20 shadow-xl overflow-hidden">
        {/* HERO SECTION */}
        <div className="relative h-64 bg-gradient-to-tr from-emerald-700 to-teal-500 overflow-hidden">
          {/* Pattern Decoration */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "20px 20px",
            }}
          ></div>

          {/* Navigation */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
            <Button
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="bg-black/20 hover:bg-black/30 text-white rounded-full backdrop-blur-sm transition-all"
            >
              <ArrowLeft className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`} />
            </Button>

            {/* Tombol Share Berfungsi */}
            <Button
              onClick={handleShare}
              variant="ghost"
              size="icon"
              className="bg-black/20 hover:bg-black/30 text-white rounded-full backdrop-blur-sm transition-all"
            >
              {copied ? (
                <Check className="w-5 h-5 text-emerald-300" />
              ) : (
                <Share2 className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Central Icon Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 pb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mb-4 shadow-xl border border-white/40">
              <Icon className="w-9 h-9 text-white drop-shadow-md" />
            </div>
            <Badge className="bg-emerald-900/40 text-emerald-50 border-0 backdrop-blur-sm mb-2 px-3 py-0.5 text-[10px] uppercase tracking-wider">
              Pilar Ke-{item.order}
            </Badge>
            <h1 className="text-3xl font-bold text-center px-4 font-comfortaa leading-tight drop-shadow-lg">
              {item.title}
            </h1>
          </div>

          {/* Wave Divider */}
          <div className="absolute -bottom-1 left-0 right-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
              className="w-full h-auto text-white fill-current"
            >
              <path
                fillOpacity="1"
                d="M0,96L80,112C160,128,320,160,480,160C640,160,800,128,960,112C1120,96,1280,96,1360,96L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <main className="px-6 -mt-8 relative z-20">
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0 space-y-6">
              {/* Highlight Box */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 flex flex-col items-center text-center gap-3">
                <Quote className="w-8 h-8 text-emerald-200 fill-emerald-100" />
                <p className="text-base text-slate-700 font-medium leading-relaxed font-comfortaa">
                  {item.shortDesc}
                </p>
                <div className="w-12 h-1 bg-emerald-100 rounded-full mt-2"></div>
              </div>

              {/* Main HTML Content */}
              <article
                className={`
                prose prose-slate max-w-none 
                prose-p:text-slate-600 prose-p:leading-8 prose-p:font-comfortaa
                prose-strong:text-emerald-800
                ${isRtl ? "text-right font-tajawal" : "text-justify"}
              `}
              >
                <div dangerouslySetInnerHTML={{ __html: item.content }} />
              </article>
            </CardContent>
          </Card>
        </main>

        {/* FOOTER ACTION */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-30">
          <Button
            onClick={onBack}
            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 h-12 font-bold font-comfortaa transition-all active:scale-[0.98]"
          >
            {locale === "en" ? "Complete Reading" : "Selesai Membaca"}
          </Button>
        </div>
      </div>
    </div>
  );
}