"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Heart,
  Loader2,
  Volume2,
} from "lucide-react";
import Image from "next/image";
import { useGetKajianListQuery } from "@/services/public/kajian.service";
import { useI18n } from "@/app/hooks/useI18n";
import { Kajian } from "@/types/public/kajian";
import { LocaleCode } from "@/lib/i18n";

interface TranslationKeys {
  title: string;
  notFound: string;
  description: string;
  audioNotAvailable: string;
}

const UI_TRANSLATIONS: Record<LocaleCode, TranslationKeys> = {
  id: {
    title: "Kajian Audio",
    notFound: "Kajian tidak ditemukan.",
    description: "Deskripsi",
    audioNotAvailable: "Audio tidak tersedia untuk bahasa ini.",
  },
  en: {
    title: "Audio Lecture",
    notFound: "Lecture not found.",
    description: "Description",
    audioNotAvailable: "Audio not available for this language.",
  },
  ar: {
    title: "محاضرة صوتية",
    notFound: "المحاضرة غير موجودة.",
    description: "وصف",
    audioNotAvailable: "الصوت غير متوفر لهذه اللغة.",
  },
  fr: {
    title: "Conférence Audio",
    notFound: "Conférence introuvable.",
    description: "Description",
    audioNotAvailable: "Audio non disponible pour cette langue.",
  },
  kr: {
    title: "오디오 강의",
    notFound: "강의를 찾을 수 없습니다.",
    description: "설명",
    audioNotAvailable: "이 언어로는 오디오를 사용할 수 없습니다.",
  },
  jp: {
    title: "音声講義",
    notFound: "講義が見つかりません。",
    description: "説明",
    audioNotAvailable: "この言語の音声は利用できません。",
  },
};

export default function KajianDetailPage() {
  const { locale } = useI18n();
  const params = useParams();
  const router = useRouter();
  const kajianId = Number(params.id);

  // Safe Locale Access
  const currentLocale = (
    UI_TRANSLATIONS[locale as LocaleCode] ? locale : "id"
  ) as LocaleCode;
  const t = UI_TRANSLATIONS[currentLocale];
  const isRtl = currentLocale === "ar";

  // --- HELPER TRANSLATION (UPDATED) ---
  const getKajianContent = (item: Kajian) => {
    const localized = item.translations.find((t) => t.locale === locale);
    const idFallback = item.translations.find((t) => t.locale === "id");

    const isValid = (str?: string | null) => str && str.trim() !== "";

    return {
      title:
        (isValid(localized?.title) ? localized!.title : null) ||
        (isValid(idFallback?.title) ? idFallback!.title : null) ||
        item.title,

      description:
        (isValid(localized?.description) ? localized!.description : null) ||
        (isValid(idFallback?.description) ? idFallback!.description : null) ||
        item.description,

      audio:
        (isValid(localized?.audio) ? localized!.audio : null) ||
        (isValid(idFallback?.audio) ? idFallback!.audio : null) ||
        item.audio,
    };
  };

  const { data: kajianData, isLoading } = useGetKajianListQuery({
    page: 1,
    paginate: 100,
  });

  const kajian = useMemo(
    () => kajianData?.data.find((k) => k.id === kajianId),
    [kajianData, kajianId],
  );

  const content = useMemo(() => {
    if (!kajian) return { title: "", description: "", audio: "" };
    return getKajianContent(kajian);
  }, [kajian, locale]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [like, setLike] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Calculate percentage for slider background
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    if (!content.audio) return;

    const el = new Audio(content.audio);
    audioRef.current = el;

    const onTime = () => setCurrentTime(el.currentTime);
    const onLoaded = () => setDuration(el.duration || kajian?.duration || 0);
    const onEnded = () => setIsPlaying(false);

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("ended", onEnded);

    setIsPlaying(false);
    setCurrentTime(0);

    return () => {
      el.pause();
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("ended", onEnded);
    };
  }, [content.audio, kajian?.duration]);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      el.play();
      setIsPlaying(true);
    }
  };

  const seekBy = (secs: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = Math.max(
      0,
      Math.min(duration || 0, el.currentTime + secs),
    );
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${r.toString().padStart(2, "0")}`;
  };

  const handleSeek = (value: number) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    const newTime = Math.max(0, Math.min(duration, value));
    el.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const localeMap: Record<string, string> = {
      id: "id-ID",
      en: "en-US",
      ar: "ar-SA",
      fr: "fr-FR",
      kr: "ko-KR",
      jp: "ja-JP",
    };
    return date.toLocaleDateString(localeMap[currentLocale] || "id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent-50 to-accent-100">
        <Loader2 className="w-8 h-8 animate-spin text-awqaf-primary" />
      </div>
    );
  }

  if (!kajian) {
    return (
      <div className="min-h-screen flex items-center justify-center font-comfortaa text-slate-500">
        <p>{t.notFound}</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="relative bg-background/90 backdrop-blur-md rounded-2xl border border-awqaf-border-light/50 shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="w-10 h-10 p-0 rounded-full hover:bg-accent-100 transition-colors duration-200"
              >
                <ArrowLeft
                  className={`w-5 h-5 text-awqaf-primary ${isRtl ? "rotate-180" : ""}`}
                />
              </Button>
              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa text-center flex-1">
                {t.title}
              </h1>
              <div className="w-10 h-10" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Info Card */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4 space-y-2">
            <h2 className="font-semibold text-card-foreground font-comfortaa text-lg leading-tight">
              {content.title}
            </h2>
            <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
              {kajian.ustadz?.name} • {formatDate(kajian.created_at)}
            </p>
            <div
              className={`text-sm text-awqaf-foreground-secondary font-comfortaa mt-2 ${isRtl ? "text-right font-tajawal" : "text-justify"}`}
              dangerouslySetInnerHTML={{ __html: content.description || "" }}
            />
          </CardContent>
        </Card>

        {/* Audio Player Card */}
        <Card className="border-awqaf-border-light">
          <CardContent className="pt-6">
            <div className="rounded-xl overflow-hidden border border-awqaf-border-light mb-4 relative bg-gray-100">
              <Image
                unoptimized
                width={400}
                height={200}
                src="https://images.unsplash.com/photo-1700716137543-ef7d4d78c5f3?q=80&w=1334&auto=format&fit=crop"
                alt="Preview Kajian"
                className="w-full h-48 object-cover opacity-90"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <Volume2 className="w-12 h-12 text-white opacity-80" />
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-awqaf-foreground-secondary font-comfortaa font-mono">
                {fmt(currentTime)} / {fmt(duration || 0)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLike((v) => !v)}
                className={`w-8 h-8 p-0 rounded-full ${like ? "bg-red-100" : "bg-accent-100"}`}
              >
                <Heart
                  className={`w-4 h-4 ${like ? "text-red-500 fill-red-500" : "text-awqaf-primary"}`}
                />
              </Button>
            </div>

            {/* CUSTOM SLIDER WITH DYNAMIC BACKGROUND */}
            <div className="mb-6 px-1">
              <input
                type="range"
                min={0}
                max={Math.max(0, Math.floor(duration || 0))}
                value={Math.floor(currentTime)}
                onChange={(e) => handleSeek(Number(e.target.value))}
                disabled={!content.audio}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-0 disabled:opacity-50"
                style={{
                  background: `linear-gradient(to right, #C8A97E 0%, #C8A97E ${progressPercent}%, #E5E7EB ${progressPercent}%, #E5E7EB 100%)`,
                }}
                dir="ltr"
              />
              <style jsx>{`
                input[type="range"]::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 16px;
                  height: 16px;
                  background: #8b6e4e; /* Warna coklat tua untuk thumb */
                  border-radius: 50%;
                  cursor: pointer;
                  border: 2px solid white;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                  transition: transform 0.1s;
                }
                input[type="range"]::-webkit-slider-thumb:hover {
                  transform: scale(1.1);
                }
                input[type="range"]::-moz-range-thumb {
                  width: 16px;
                  height: 16px;
                  background: #8b6e4e;
                  border-radius: 50%;
                  cursor: pointer;
                  border: 2px solid white;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }
              `}</style>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 pb-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 border-2"
                onClick={() => seekBy(-15)}
                disabled={!content.audio}
              >
                <RotateCcw className="w-5 h-5 text-gray-600" />
              </Button>

              <Button
                variant="default"
                size="icon"
                className="w-14 h-14 rounded-full shadow-lg bg-awqaf-primary hover:bg-awqaf-primary/90 disabled:opacity-50"
                onClick={togglePlay}
                disabled={!content.audio}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white fill-current" />
                ) : (
                  <Play
                    className={`w-6 h-6 text-white fill-current ${isRtl ? "mr-1" : "ml-1"}`}
                  />
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 border-2"
                onClick={() => seekBy(15)}
                disabled={!content.audio}
              >
                <RotateCw className="w-5 h-5 text-gray-600" />
              </Button>
            </div>

            {!content.audio && (
              <p className="text-center text-xs text-red-500 mt-4 font-comfortaa">
                {t.audioNotAvailable}
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}