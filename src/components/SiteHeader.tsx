import { useEffect, useId, useRef, useState } from "react";
import type { MouseEvent } from "react";
import type { Lang } from "../i18n/translations";
import "./site-header.css";

const labels = {
  en: {
    home: "AIHUB home",
    links: ["Services", "Cases", "Roadmap", "Team", "Shop"],
    cta: ["Book", "a consultation"],
    menu: "Open menu",
    close: "Close menu",
    navigation: "Main navigation",
    language: "Switch to Russian",
    company: "Company details",
  },
  ru: {
    home: "AIHUB: главная",
    links: ["Услуги", "Кейсы", "Дорожная карта", "Команда", "Магазин"],
    cta: ["Записаться", "на консультацию"],
    menu: "Открыть меню",
    close: "Закрыть меню",
    navigation: "Главное меню",
    language: "Switch to English",
    company: "Реквизиты",
  },
};

export function SiteLogo({
  lang,
  className = "",
}: {
  lang: Lang;
  className?: string;
}) {
  return (
    <a
      href={`${import.meta.env.BASE_URL}?lang=${lang}`}
      className={`site-logo ${className}`}
      aria-label={labels[lang].home}
    >
      <img
        src={`${import.meta.env.BASE_URL}brand/aihub-logo.png`}
        width={165}
        height={49}
        alt="AIHUB"
      />
    </a>
  );
}

export function SiteHeader({
  lang,
  onLanguageChange,
  page,
}: {
  lang: Lang;
  onLanguageChange: () => void;
  page: "landing" | "shop" | "legal";
}) {
  const t = labels[lang];
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const menuButton = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLElement>(null);
  const base = import.meta.env.BASE_URL;
  const home = `${base}?lang=${lang}`;
  const shop = `${base}shop.html?lang=${lang}`;
  const sectionHref = (section: string) =>
    page === "landing" ? `#${section}` : `${home}#${section}`;
  const links = ["services", "cases", "roadmap", "team"].map((section, i) => ({
    label: t.links[i],
    href: sectionHref(section),
    current: false,
  }));
  links.push({ label: t.links[4], href: shop, current: page === "shop" });

  useEffect(() => {
    if (!open) return;
    root.current
      ?.querySelector<HTMLAnchorElement>("nav a")
      ?.focus({ preventScroll: true });
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    const query = matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (query.matches) setOpen(false);
    };
    query.addEventListener("change", closeOnDesktop);
    return () => query.removeEventListener("change", closeOnDesktop);
  }, []);

  const navigate = (event: MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute("href");
    setOpen(false);
    // Keep native modified-click navigation; only smooth-scroll local section links.
    if (
      !href?.startsWith("#") ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    event.preventDefault();
    history.pushState(null, "", href);
    if (href === "#company-details") target.focus({ preventScroll: true });
    requestAnimationFrame(() =>
      target.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      }),
    );
  };

  return (
    <header
      ref={root}
      className={`site-header site-header--${page}`}
      data-menu-open={open}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          menuButton.current?.focus();
        }
      }}
    >
      <div className="site-header__inner">
        <div className="site-header__brand">
          <SiteLogo lang={lang} />
          <a
            className="site-header__company"
            href="#company-details"
            onClick={navigate}
          >
            {t.company}
          </a>
        </div>
        <a
          href={shop}
          className="site-header__quick-shop site-header__link"
          aria-current={page === "shop" ? "page" : undefined}
        >
          {t.links[4]}
        </a>
        <nav
          id={menuId}
          className="site-header__navigation"
          aria-label={t.navigation}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="site-header__link"
              aria-current={link.current ? "page" : undefined}
              onClick={navigate}
            >
              {link.label}
            </a>
          ))}
          <a
            href={sectionHref("contact")}
            className="site-header__mobile-contact site-header__link"
            onClick={navigate}
          >
            {t.cta.join(" ")}
          </a>
        </nav>
        <div className="site-header__actions">
          <button
            type="button"
            className="site-header__language site-header__link"
            onClick={onLanguageChange}
            aria-label={t.language}
          >
            {lang === "en" ? "RU" : "EN"}
          </button>
          <button
            ref={menuButton}
            type="button"
            className="site-header__menu-button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? t.close : t.menu}
            aria-expanded={open}
            aria-controls={menuId}
          >
            <span />
            <span />
          </button>
        </div>
        <div className="site-header__cta-frame">
          <img
            src={`${base}brand/cta-frame.svg`}
            alt=""
            aria-hidden="true"
            width={330}
            height={117}
          />
          <a
            href={sectionHref("contact")}
            onClick={navigate}
            className="site-header__cta"
          >
            <span>{t.cta[0]}</span>
            <span>{t.cta[1]}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
