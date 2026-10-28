import { useEffect, useState } from "react";
import type { Lang } from "./translations";

export function readCaseLanguage(search = window.location.search): Lang {
  return new URLSearchParams(search).get("lang") === "ru" ? "ru" : "en";
}

export function caseListHref(base: string, search = window.location.search) {
  return `${base}?lang=${readCaseLanguage(search)}#cases`;
}

function writeLanguage(lang: Lang) {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  history.replaceState(null, "", url);
}

export function useCaseLanguage() {
  const [lang, setLang] = useState<Lang>(() => readCaseLanguage());
  useEffect(() => {
    document.documentElement.lang = lang;
    writeLanguage(lang);
  }, [lang]);
  useEffect(() => {
    const update = () => setLang(readCaseLanguage());
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  const selectLanguage = (value: Lang) => {
    // Back links render in the same update as the translated content.
    writeLanguage(value);
    setLang(value);
  };
  return [lang, selectLanguage] as const;
}
