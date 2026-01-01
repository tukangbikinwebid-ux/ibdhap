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
// Import Service
import { useGetKajianListQuery } from "@/services/public/kajian.service";

export default function KajianDetailPage() {
  const params = useParams();
  const router = useRouter();
  const kajianId = Number(params.id);

  // Fetch Kajian List untuk mencari detail (Workaround jika belum ada endpoint detail spesifik)
  // Idealnya ada endpoint: /public/ustadz/kajian/:id
  const { data: kajianData, isLoading } = useGetKajianListQuery({
    page: 1,
    paginate: 100, // Ambil cukup banyak untuk probability ketemu
  });

  const kajian = useMemo(
    () => kajianData?.data.find((k) => k.id === kajianId),
    [kajianData, kajianId]
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [like, setLike] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!kajian?.audio) return;

    const el = new Audio(kajian.audio);
    audioRef.current = el;

    const onTime = () => setCurrentTime(el.currentTime);
    const onLoaded = () => setDuration(el.duration || kajian.duration || 0);
    const onEnded = () => setIsPlaying(false);

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("ended", onEnded);

    return () => {
      el.pause();
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("ended", onEnded);
    };
  }, [kajian]);

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
      Math.min(duration || 0, el.currentTime + secs)
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent-50 to-accent-100">
        <Loader2 className="w-8 h-8 animate-spin text-awqaf-primary" />
      </div>
    );
  }

  if (!kajian) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Kajian tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
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
                <ArrowLeft className="w-5 h-5 text-awqaf-primary" />
              </Button>
              <h1 className="text-lg font-bold text-awqaf-primary font-comfortaa text-center flex-1">
                Kajian Audio
              </h1>
              <div className="w-10 h-10" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Info */}
        <Card className="border-awqaf-border-light">
          <CardContent className="p-4 space-y-2">
            <h2 className="font-semibold text-card-foreground font-comfortaa text-lg leading-tight">
              {kajian.title}
            </h2>
            <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
              {kajian.ustadz?.name} •{" "}
              {new Date(kajian.created_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <div
              className="text-sm text-awqaf-foreground-secondary font-comfortaa mt-2"
              dangerouslySetInnerHTML={{ __html: kajian.description }}
            />
          </CardContent>
        </Card>

        {/* Audio Player */}
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
                className={`w-8 h-8 p-0 rounded-full ${
                  like ? "bg-red-100" : "bg-accent-100"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    like ? "text-red-500 fill-red-500" : "text-awqaf-primary"
                  }`}
                />
              </Button>
            </div>

            {/* Progress bar */}
            <div className="mb-6 px-1">
              <input
                type="range"
                min={0}
                max={Math.max(0, Math.floor(duration || 0))}
                value={Math.floor(currentTime)}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="w-full accent-awqaf-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-center gap-6 pb-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 border-2"
                onClick={() => seekBy(-15)}
              >
                <RotateCcw className="w-5 h-5 text-gray-600" />
              </Button>

              <Button
                variant="default"
                size="icon"
                className="w-14 h-14 rounded-full shadow-lg bg-awqaf-primary hover:bg-awqaf-primary/90"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white fill-current" />
                ) : (
                  <Play className="w-6 h-6 text-white fill-current ml-1" />
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 border-2"
                onClick={() => seekBy(15)}
              >
                <RotateCw className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}