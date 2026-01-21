"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Globe, Check } from "lucide-react";
import { useGetLocalesQuery } from "@/services/public/locale.service";
import { Locale as LocaleType } from "@/types/public/locale";
import { getCurrentLocale, setLocale, type LocaleCode } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<LocaleCode>("id");
  const { data: locales, isLoading } = useGetLocalesQuery();

  useEffect(() => {
    setCurrentLocale(getCurrentLocale());
  }, []);

  const handleLocaleChange = (localeCode: string) => {
    const newLocale = localeCode as LocaleCode;
    setLocale(newLocale);
    setCurrentLocale(newLocale);
    setIsOpen(false);
    // Trigger custom event to notify other components
    window.dispatchEvent(new CustomEvent("localeChanged", { detail: newLocale }));
  };

  // Get current locale name
  const currentLocaleName = locales?.find(
    (l) => l.code === currentLocale
  )?.name || "Bahasa Indonesia";

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 p-0 rounded-full bg-accent-100 hover:bg-accent-200 hover:text-awqaf-primary transition-colors duration-200"
        onClick={() => setIsOpen(true)}
        title={`Bahasa: ${currentLocaleName}`}
      >
        <Globe className="w-5 h-5 text-awqaf-primary" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-comfortaa flex items-center gap-2">
              <Globe className="w-5 h-5 text-awqaf-primary" />
              Pilih Bahasa
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            {isLoading ? (
              <div className="text-center py-4">
                <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                  Memuat bahasa...
                </p>
              </div>
            ) : locales && locales.length > 0 ? (
              locales.map((locale: LocaleType) => (
                <Button
                  key={locale.id}
                  variant={currentLocale === locale.code ? "default" : "outline"}
                  className={`w-full justify-between font-comfortaa ${
                    currentLocale === locale.code
                      ? "bg-awqaf-primary hover:bg-awqaf-primary/90"
                      : ""
                  }`}
                  onClick={() => handleLocaleChange(locale.code)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {locale.code === "id" ? "🇮🇩" : 
                       locale.code === "en" ? "🇬🇧" : 
                       locale.code === "ar" ? "🇸🇦" :
                       locale.code === "fr" ? "🇫🇷" :
                       locale.code === "kr" ? "🇰🇷" :
                       locale.code === "jp" ? "🇯🇵" : "🌐"}
                    </span>
                    <div className="text-left">
                      <p className="font-semibold">{locale.name}</p>
                      <p className="text-xs opacity-75">
                        {locale.code.toUpperCase()} • {locale.direction.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  {currentLocale === locale.code && (
                    <Check className="w-5 h-5" />
                  )}
                </Button>
              ))
            ) : (
              // Fallback jika API tidak mengembalikan data
              <div className="space-y-2">
                {[
                  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
                  { code: "en", name: "English", flag: "🇬🇧" },
                  { code: "ar", name: "العربية", flag: "🇸🇦" },
                  { code: "fr", name: "Français", flag: "🇫🇷" },
                  { code: "kr", name: "한국어", flag: "🇰🇷" },
                  { code: "jp", name: "日本語", flag: "🇯🇵" },
                ].map((locale) => (
                  <Button
                    key={locale.code}
                    variant={currentLocale === locale.code ? "default" : "outline"}
                    className={`w-full justify-between font-comfortaa ${
                      currentLocale === locale.code
                        ? "bg-awqaf-primary hover:bg-awqaf-primary/90"
                        : ""
                    }`}
                    onClick={() => handleLocaleChange(locale.code)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{locale.flag}</span>
                      <p className="font-semibold">{locale.name}</p>
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
    </>
  );
}
