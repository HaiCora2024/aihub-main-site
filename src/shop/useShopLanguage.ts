import { useEffect, useState } from "react";
import { copy } from "./data";
import type { ShopLanguage } from "./data";

// Language comes from ?lang= and is written back so shared links keep it.
export function useShopLanguage(titles: Record<ShopLanguage, string>) {
  const [lang, setLang] = useState<ShopLanguage>(() =>
    new URLSearchParams(location.search).get("lang") === "ru" ? "ru" : "en",
  );
  const title = titles[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = title;
    const url = new URL(location.href);
    url.searchParams.set("lang", lang);
    history.replaceState(null, "", url);
  }, [lang, title]);

  return { lang, setLang, t: copy[lang] };
}
