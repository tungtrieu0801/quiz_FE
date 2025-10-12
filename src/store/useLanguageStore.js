import { create } from "zustand";

export const useLanguageStore = create((set) => ({
    language: "vi",
    setLanguage: (lang) => set({ language: lang }),
}))