"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Share2,
  MessageCircleQuestion,
  MessageSquareQuote,
  UserCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProcessedFatwaItem } from "./page";
import { LocaleCode } from "@/lib/i18n";

interface FatwaDetailProps {
  item: ProcessedFatwaItem;
  locale: LocaleCode;
  onBack: () => void;
  catLabel: string;
}

export default function FatwaDetail({
  item,
  locale,
  onBack,
  catLabel,
}: FatwaDetailProps) {
  const isRtl = locale === "ar";
  const [copied, setCopied] = useState(false);

  // Label statis sederhana untuk UI Detail
  const LABELS = {
    question:
      locale === "en" ? "Question" : locale === "ar" ? "السؤال" : "Pertanyaan",
    answer: locale === "en" ? "Answer" : locale === "ar" ? "الجواب" : "Jawaban",
    fatwaBy:
      locale === "en"
        ? "Fatwa by"
        : locale === "ar"
          ? "الفتوى من"
          : "Fatwa oleh",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- SHARE FUNCTIONALITY ---
  const handleShare = async () => {
    // Bersihkan HTML tag untuk text share yang rapi
    const cleanAnswer = item.answer.replace(/<[^>]*>?/gm, "");
    const shareText = `${item.question}\n\n${cleanAnswer.substring(0, 100)}...\n\nBaca selengkapnya: ${window.location.href}`;

    const shareData = {
      title: "Fatwa: " + item.question,
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
    <div className="min-h-screen bg-white" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-md mx-auto min-h-screen bg-white relative pb-20 shadow-lg overflow-hidden">
        {/* HEADER: Warna Default Awqaf */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-awqaf-border-light">
          <div className="p-4 flex justify-between items-center">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="hover:bg-accent-50 text-awqaf-primary rounded-full p-2 h-10 w-10"
            >
              <ArrowLeft className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`} />
            </Button>

            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                FATWA
              </span>
              <Badge
                variant="outline"
                className="border-awqaf-primary/20 text-awqaf-primary text-[10px] h-5 mt-0.5 capitalize"
              >
                {catLabel}
              </Badge>
            </div>

            {/* Functional Share Button */}
            <Button
              onClick={handleShare}
              variant="ghost"
              size="sm"
              className="hover:bg-accent-50 text-awqaf-primary rounded-full p-2 h-10 w-10"
            >
              {copied ? (
                <Check className="w-5 h-5 text-emerald-500" />
              ) : (
                <Share2 className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* CONTENT */}
        <main className="p-5 space-y-6">
          {/* 1. BAGIAN PERTANYAAN (Box Accent) */}
          <div className="bg-accent-50 rounded-2xl p-5 border border-accent-100 relative">
            <div className="absolute -top-3 left-4 bg-white px-2 py-0.5 rounded-full border border-accent-200 flex items-center gap-1">
              <MessageCircleQuestion className="w-3 h-3 text-awqaf-secondary" />
              <span className="text-[10px] font-bold text-awqaf-secondary uppercase tracking-wide">
                {LABELS.question}
              </span>
            </div>
            <h2
              className={`font-bold text-awqaf-primary text-lg leading-relaxed ${isRtl ? "font-tajawal" : "font-comfortaa"}`}
            >
              {item.question}
            </h2>
          </div>

          {/* 2. BAGIAN JAWABAN (Main Text) */}
          <div className="relative pl-2">
            {/* Garis dekorasi vertikal */}
            <div
              className={`absolute top-0 bottom-0 w-1 bg-gradient-to-b from-awqaf-primary to-transparent rounded-full opacity-20 ${isRtl ? "right-0" : "left-0"}`}
            ></div>

            <div className={`${isRtl ? "pr-6" : "pl-6"}`}>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquareQuote className="w-5 h-5 text-awqaf-primary" />
                <span className="text-sm font-bold text-awqaf-primary uppercase tracking-wide">
                  {LABELS.answer}
                </span>
              </div>

              <article
                className={`
                  prose prose-sm max-w-none text-gray-700
                  prose-p:leading-loose prose-p:font-comfortaa
                  ${isRtl ? "text-right font-tajawal text-lg" : "text-justify"}
                `}
              >
                <div dangerouslySetInnerHTML={{ __html: item.answer }} />
              </article>
            </div>
          </div>

          {/* 3. INFO SYAIKH (Footer Card) */}
          <div className="mt-8 pt-6 border-t border-dashed border-gray-200">
            <div className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm p-3 rounded-xl">
              <div className="w-10 h-10 bg-awqaf-primary/10 rounded-full flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-awqaf-primary" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">
                  {LABELS.fatwaBy}
                </p>
                <p className="text-sm font-bold text-awqaf-primary">
                  {item.sheikh}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}