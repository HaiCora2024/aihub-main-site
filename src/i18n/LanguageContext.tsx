import { createContext, useContext, useEffect, useState } from "react";

import { translations, type Lang } from "./translations";

interface LanguageContextValue {
  lang: Lang;
  t: typeof translations.en;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() =>
    new URLSearchParams(window.location.search).get("lang") === "ru"
      ? "ru"
      : "en",
  );

  useEffect(() => {
    document.documentElement.lang = lang;
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    history.replaceState(null, "", url);
  }, [lang]);

  const toggleLang = () => {
    setLang((l) => (l === "en" ? "ru" : "en"));
  };

  return (
    <LanguageContext.Provider
      value={{ lang, t: translations[lang], toggleLang }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
