"use client";

import { useState, useEffect } from "react";
import { getCurrentLocale, setLocale, t, type LocaleCode } from "@/lib/i18n";

export function useI18n() {
  const [locale, setLocaleState] = useState<LocaleCode>(getCurrentLocale());

  useEffect(() => {
    setLocaleState(getCurrentLocale());
    
    // Listen for locale changes
    const handleLocaleChange = (event: CustomEvent) => {
      setLocaleState(event.detail as LocaleCode);
    };
    
    window.addEventListener("localeChanged", handleLocaleChange as EventListener);
    
    return () => {
      window.removeEventListener("localeChanged", handleLocaleChange as EventListener);
    };
  }, []);

  const changeLocale = (newLocale: LocaleCode) => {
    setLocale(newLocale);
    setLocaleState(newLocale);
  };

  return {
    locale,
    t: (key: string) => t(key, locale),
    changeLocale,
  };
}
