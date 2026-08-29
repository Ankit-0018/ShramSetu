"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";

export function LanguageToggle() {
  const { language, toggleLanguage, isHydrated } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isHydrated) {
    return (
      <button
        disabled
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground border border-border bg-secondary"
      >
        <Globe className="w-3.5 h-3.5" />
        <span>EN</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-accent active:bg-accent transition-colors text-xs font-semibold text-foreground border border-border bg-secondary"
      title={`Click to switch language: ${language === "en" ? "Switch to हिंदी" : "Switch to English"}`}
      aria-label={`Current language: ${language === "en" ? "English" : "हिंदी"}. Click to toggle.`}
    >
      <Globe className="w-3.5 h-3.5" />
      <span>{language === "en" ? "EN" : "HI"}</span>
    </button>
  );
}
