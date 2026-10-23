"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { bn } from "./bn";
import { type Dictionary, en, type TranslationKey } from "./en";
import { hi } from "./hi";

export const LOCALES = [
  { id: "en", label: "English", native: "English" },
  { id: "hi", label: "Hindi", native: "हिन्दी" },
  { id: "bn", label: "Bengali", native: "বাংলা" },
] as const;

export type Locale = (typeof LOCALES)[number]["id"];

const DICTIONARIES: Record<Locale, Dictionary> = { en, hi, bn };
const STORAGE_KEY = "swarmandala.locale";

interface I18nApi {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  dictionary: Dictionary;
}

const I18nContext = createContext<I18nApi | null>(null);

function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "hi" || value === "bn";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isLocale(stored)) {
        setLocaleState(stored);
        document.documentElement.lang = stored;
      }
    } catch {
      // Private mode or blocked storage: English is a fine fallback.
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.documentElement.lang = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage failures; the UI has already switched.
    }
  }, []);

  const dictionary = DICTIONARIES[locale];

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => {
      let value: string = DICTIONARIES[locale][key] ?? en[key];
      if (vars) {
        for (const [name, replacement] of Object.entries(vars)) {
          value = value.replaceAll(`{${name}}`, String(replacement));
        }
      }
      return value;
    },
    [locale],
  );

  const value = useMemo<I18nApi>(
    () => ({ locale, setLocale, t, dictionary }),
    [locale, setLocale, t, dictionary],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nApi {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}
