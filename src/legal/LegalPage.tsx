import { useEffect, useState } from "react";
import { SiteHeader } from "../components/SiteHeader";
import { CompanyDetails } from "../components/CompanyDetails";
import { legalContent } from "./content";
import seller from "../../backend/contact-api/shared/seller.json";
import versions from "../../backend/contact-api/shared/legal.json";

export function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const [lang, setLang] = useState<"en" | "ru">(() =>
    new URLSearchParams(location.search).get("lang") === "ru" ? "ru" : "en",
  );
  const base = import.meta.env.BASE_URL;
  const t = legalContent[lang][kind];
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = `${t.title} | AIHUB WORKS`;
    const url = new URL(location.href);
    url.searchParams.set("lang", lang);
    history.replaceState(null, "", url);
  }, [lang, t.title]);
  return (
    <div className="aihub-theme legal-page">
      <a className="legal-skip" href="#legal-content">
        {lang === "en" ? "Skip to document" : "К документу"}
      </a>
      <SiteHeader
        lang={lang}
        page="legal"
        onLanguageChange={() => setLang(lang === "en" ? "ru" : "en")}
      />
      <main id="legal-content" className="legal-document">
        <nav
          className="legal-links"
          aria-label={
            lang === "en" ? "Documents and request" : "Документы и заявка"
          }
        >
          <a href={`${base}checkout.html?lang=${lang}`}>
            {lang === "en" ? "Return to request" : "Вернуться к заявке"}
          </a>
          <a
            href={`${base}legal/${kind === "privacy" ? "terms" : "privacy-policy"}.html?lang=${lang}`}
          >
            {legalContent[lang][kind === "privacy" ? "terms" : "privacy"].title}
          </a>
        </nav>
        <p className="legal-eyebrow">
          AIHUB WORKS / {lang === "en" ? "Legal" : "Документы"}
        </p>
        <h1>{t.title}</h1>
        <p className="legal-version">
          {lang === "en" ? "Updated" : "Обновлено"}: {versions.effectiveDate} ·{" "}
          {lang === "en" ? "Version" : "Версия"}:{" "}
          {kind === "privacy" ? versions.privacyVersion : versions.termsVersion}
        </p>
        <p className="legal-intro">{t.intro}</p>
        <div className="legal-company">
          <CompanyDetails lang={lang} />
        </div>
        {t.sections.map((section, index) => (
          <section className="legal-section" key={section.heading}>
            <h2>
              {index + 1}. {section.heading}
            </h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
        <footer className="legal-contact">
          <p>
            {lang === "en"
              ? "Requests and service questions"
              : "Заявки и вопросы об услугах"}
            : <a href={`mailto:${seller.salesEmail}`}>{seller.salesEmail}</a>
          </p>
          <p>
            {lang === "en"
              ? "Personal data and rights"
              : "Персональные данные и права"}
            :{" "}
            <a href={`mailto:${seller.privacyEmail}`}>{seller.privacyEmail}</a>
          </p>
          {kind === "privacy" && (
            <p>
              <a
                href="https://uodo.gov.pl/en"
                target="_blank"
                rel="noopener noreferrer"
              >
                UODO:{" "}
                {lang === "en"
                  ? "Polish supervisory authority"
                  : "Надзорный орган Польши"}
              </a>
            </p>
          )}
        </footer>
      </main>
    </div>
  );
}
