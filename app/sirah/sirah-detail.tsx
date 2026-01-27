"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Share2, BookOpen, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProcessedSirahItem } from "./page";

interface SirahDetailProps {
  story: ProcessedSirahItem;
  onBack: () => void;
  locale: string;
  categoryLabel: string;
}

export default function SirahDetail({
  story,
  onBack,
  locale,
  categoryLabel,
}: SirahDetailProps) {
  const [copied, setCopied] = useState(false);
  const isRtl = locale === "ar";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- SHARE FUNCTIONALITY ---
  const handleShare = async () => {
    const shareData = {
      title: story.title,
      text: story.excerpt,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback Clipboard
        await navigator.clipboard.writeText(
          `${story.title}\n\n${story.excerpt}\n\nLink: ${window.location.href}`,
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white" dir={isRtl ? "rtl" : "ltr"}>
      {/* Wrapper max-w-md agar konsisten */}
      <div className="max-w-md mx-auto min-h-screen bg-white relative pb-20 shadow-xl overflow-hidden">
        {/* HEADER: Warna Original Awqaf */}
        <div className="relative h-48 bg-gradient-to-br from-awqaf-primary to-awqaf-secondary rounded-b-[40px] shadow-lg">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 backdrop-blur-sm h-10 w-10"
            >
              <ArrowLeft className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`} />
            </Button>

            {/* Functional Share Button */}
            <Button
              onClick={handleShare}
              variant="ghost"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 backdrop-blur-sm h-10 w-10"
            >
              {copied ? (
                <CheckCheck className="w-5 h-5 text-emerald-300" />
              ) : (
                <Share2 className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Title Area */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
            <div className="inline-block p-2 bg-white/20 backdrop-blur-md rounded-lg mb-2">
              <BookOpen className="w-6 h-6 text-white mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-white font-comfortaa leading-tight drop-shadow-md">
              {story.title}
            </h1>
          </div>
        </div>

        {/* CONTENT DETAIL */}
        <main className="px-4 -mt-6 relative z-10">
          <Card className="border-none shadow-lg bg-white rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="mb-4">
                <Badge className="bg-accent-100 text-awqaf-primary hover:bg-accent-200 border-none px-3 py-1">
                  {categoryLabel}
                </Badge>
              </div>

              <article className="prose prose-sm max-w-none font-comfortaa text-gray-700 leading-loose">
                <div
                  dangerouslySetInnerHTML={{ __html: story.content }}
                  className={`
                    ${isRtl ? "text-right font-tajawal text-lg" : "text-justify"}
                    space-y-4
                  `}
                />
              </article>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}