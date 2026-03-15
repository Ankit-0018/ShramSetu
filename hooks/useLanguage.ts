"use client";

import { useLanguageStore } from "@/lib/stores/useLanguageStore";
import { t as translateKey } from "@/lib/translations";
import { useEffect, useState } from "react";

export const useLanguage = () => {
  const { language, setLanguage, toggleLanguage, isHydrated } =
    useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const translate = (key: string): string => {
    return translateKey(key, language);
  };

  return {
    language: mounted ? language : "en",
    setLanguage,
    toggleLanguage,
    translate,
    t: translate,
    isHydrated: mounted && isHydrated,
  };
};
