"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Language = "en" | "hi";

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  isHydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: "en" as Language,
      isHydrated: false,
      setLanguage: (language: Language) => set({ language, isHydrated: true }),
      setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),
      toggleLanguage: () =>
        set((state) => ({
          language: state.language === "en" ? "hi" : "en",
          isHydrated: true,
        })),
    }),
    {
      name: "labour-hub-language",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    },
  ),
);
