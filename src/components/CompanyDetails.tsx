import { useEffect, useState } from "react";
import type { Lang } from "../i18n/translations";
import seller from "../../backend/contact-api/shared/seller.json";
import "./company-details.css";

export function CompanyDetails({ lang }: { lang: Lang }) {
  const ru = lang === "ru";
  return (
    <section
      id="company-details"
      className="company-details"
      aria-labelledby="company-details-title"
      tabIndex={-1}
    >
      <h2 id="company-details-title">
        {ru ? "Реквизиты компании" : "Company details"}
      </h2>
      <p className="company-details__name" lang="pl">
        {seller.name}
      </p>
      <p lang="pl">{seller.address}</p>
      <p className="company-details__ids">
        <span>NIP: {seller.nip}</span>
        <span>KRS: {seller.krs}</span>
        <span>REGON: {seller.regon}</span>
      </p>
      <p>
        {ru ? "Уставный капитал" : "Share capital"}: {seller.capital}
      </p>
      <p>
        {ru ? "Регистрационный суд" : "Register court"}:{" "}
        <span lang="pl">{seller.court}</span>
      </p>
      <p>
        {ru ? "Заявки" : "Requests"}:{" "}
        <a href={`mailto:${seller.salesEmail}`}>{seller.salesEmail}</a>
      </p>
      <p>
        {ru ? "Персональные данные" : "Personal data"}:{" "}
        <a href={`mailto:${seller.privacyEmail}`}>{seller.privacyEmail}</a>
      </p>
    </section>
  );
}

// Standalone case pages manage their own language rather than the site context.
export function CompanyFooter() {
  const [lang, setLang] = useState<Lang>(() =>
    document.documentElement.lang === "ru" ? "ru" : "en",
  );
  useEffect(() => {
    const update = () =>
      setLang(document.documentElement.lang === "ru" ? "ru" : "en");
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });
    return () => observer.disconnect();
  }, []);
  return (
    <footer className="company-footer">
      <CompanyDetails lang={lang} />
      <nav
        aria-label={lang === "ru" ? "Юридические документы" : "Legal documents"}
      >
        <a
          href={`${import.meta.env.BASE_URL}legal/privacy-policy.html?lang=${lang}`}
        >
          {lang === "ru" ? "Конфиденциальность" : "Privacy Policy"}
        </a>
        <a href={`${import.meta.env.BASE_URL}legal/terms.html?lang=${lang}`}>
          {lang === "ru" ? "Условия подачи заявки" : "Request terms"}
        </a>
      </nav>
    </footer>
  );
}
