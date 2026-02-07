"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Pastikan DialogTrigger ada jika diperlukan, atau gunakan state open control
import { Globe, Check } from "lucide-react";
import { useGetLocalesQuery } from "@/services/public/locale.service";
import { Locale as LocaleType } from "@/types/public/locale";
import { getCurrentLocale, setLocale, type LocaleCode } from "@/lib/i18n";

// 1. Definisikan kamus terjemahan untuk teks statis
const staticTranslations: Record<
  string,
  { title: string; loading: string; label: string }
> = {
  id: { title: "Pilih Bahasa", loading: "Memuat bahasa...", label: "Bahasa" },
  en: {
    title: "Select Language",
    loading: "Loading languages...",
    label: "Language",
  },
  ar: { title: "اختر اللغة", loading: "جارٍ تحميل اللغات...", label: "اللغة" },
  fr: {
    title: "Choisir la langue",
    loading: "Chargement des langues...",
    label: "Langue",
  },
  kr: { title: "언어 선택", loading: "언어 로딩 중...", label: "언어" }, // kr biasanya kodenya 'ko', tapi kita ikuti 'kr' sesuai request
  jp: {
    title: "言語を選択",
    loading: "言語を読み込んでいます...",
    label: "言語",
  }, // jp biasanya kodenya 'ja', tapi kita ikuti 'jp'
};

// Helper untuk mapping bendera
const getFlag = (code: string) => {
  switch (code) {
    case "id":
      return "🇮🇩";
    case "en":
      return "🇬🇧";
    case "ar":
      return "🇸🇦";
    case "fr":
      return "🇫🇷";
    case "kr":
      return "🇰🇷";
    case "jp":
      return "🇯🇵";
    default:
      return "🌐";
  }
};

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<LocaleCode>("id");
  const { data: locales, isLoading } = useGetLocalesQuery();

  useEffect(() => {
    // Pastikan type casting aman
    const savedLocale = getCurrentLocale() as LocaleCode;
    // Validasi sederhana jika locale yang tersimpan ada di list yang didukung
    if (["id", "en", "ar", "fr", "kr", "jp"].includes(savedLocale)) {
      setCurrentLocale(savedLocale);
    }
  }, []);

  const handleLocaleChange = (localeCode: string) => {
    const newLocale = localeCode as LocaleCode;
    setLocale(newLocale);
    setCurrentLocale(newLocale);
    setIsOpen(false);
    // Trigger custom event to notify other components to refresh/reload translations
    window.dispatchEvent(
      new CustomEvent("localeChanged", { detail: newLocale }),
    );
  };

  // 2. Ambil teks terjemahan berdasarkan currentLocale
  // Jika tidak ketemu, fallback ke 'id'
  const t = staticTranslations[currentLocale] || staticTranslations.id;

  // Get current locale name for tooltip (fallback logic included)
  const currentLocaleName =
    locales?.find((l) => l.code === currentLocale)?.name ||
    staticTranslations[currentLocale]?.label ||
    "Language";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 p-0 rounded-full bg-accent-100 hover:bg-accent-200 hover:text-awqaf-primary transition-colors duration-200"
        onClick={() => setIsOpen(true)}
        title={`${t.label}: ${currentLocaleName}`}
      >
        <Globe className="w-5 h-5 text-awqaf-primary" />
      </Button>

      {/* Dialog Content */}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle
            className={`font-comfortaa flex items-center gap-2 ${currentLocale === "ar" ? "flex-row-reverse" : ""}`}
          >
            <Globe className="w-5 h-5 text-awqaf-primary" />
            {/* 3. Gunakan variabel t.title */}
            {t.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                {/* 4. Gunakan variabel t.loading */}
                {t.loading}
              </p>
            </div>
          ) : locales && locales.length > 0 ? (
            // Render dari API
            locales.map((locale: LocaleType) => (
              <Button
                key={locale.id}
                variant={currentLocale === locale.code ? "default" : "outline"}
                className={`w-full justify-between font-comfortaa h-auto py-3 ${
                  currentLocale === locale.code
                    ? "bg-awqaf-primary hover:bg-awqaf-primary/90"
                    : "hover:bg-accent-50"
                }`}
                onClick={() => handleLocaleChange(locale.code)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getFlag(locale.code)}</span>
                  <div className="text-left">
                    <p className="font-semibold text-sm">{locale.name}</p>
                    {locale.code && (
                      <p className="text-[10px] opacity-75 uppercase">
                        {locale.code}
                      </p>
                    )}
                  </div>
                </div>
                {currentLocale === locale.code && <Check className="w-5 h-5" />}
              </Button>
            ))
          ) : (
            // Fallback manual jika API gagal/kosong
            <div className="space-y-2">
              {[
                { code: "id", name: "Bahasa Indonesia" },
                { code: "en", name: "English" },
                { code: "ar", name: "العربية" },
                { code: "fr", name: "Français" },
                { code: "kr", name: "한국어" },
                { code: "jp", name: "日本語" },
              ].map((locale) => (
                <Button
                  key={locale.code}
                  variant={
                    currentLocale === locale.code ? "default" : "outline"
                  }
                  className={`w-full justify-between font-comfortaa h-auto py-3 ${
                    currentLocale === locale.code
                      ? "bg-awqaf-primary hover:bg-awqaf-primary/90"
                      : "hover:bg-accent-50"
                  }`}
                  onClick={() => handleLocaleChange(locale.code)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getFlag(locale.code)}</span>
                    <p className="font-semibold text-sm">{locale.name}</p>
                  </div>
                  {currentLocale === locale.code && (
                    <Check className="w-5 h-5" />
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}