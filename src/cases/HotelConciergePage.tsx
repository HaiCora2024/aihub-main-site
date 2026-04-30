import { useEffect, useRef, useState } from "react";

const GREEN = "rgba(8, 208, 112, 0.95)";
const GREEN_80 = "rgba(8, 208, 112, 0.8)";
const GREEN_08 = "rgba(8, 208, 112, 0.08)";
const GREEN_06 = "rgba(8, 208, 112, 0.06)";
const GREEN_20 = "rgba(8, 208, 112, 0.2)";
const GREEN_13 = "rgba(8, 208, 112, 0.13)";
const GREEN_90 = "rgba(8, 208, 112, 0.9)";

const content = {
  en: {
    pageTitle: "AI Concierge for Hotel — Case Study | AIHUB Works",
    backToCases: "Back to cases",
    brand: "AIHUB Works",
    languageLabel: "Language",
    caseStudy: "Case Study",
    heroTitle: "AI concierge for boutique hotel guest services",
    heroBody: "Multilingual booking assistant with PMS integration and upsell automation",
    tags: ["Hospitality", "Conversational AI", "Booking automation"],
    kpis: [
      { value: "82%", label: "Reduction in manual handling" },
      { value: "72%", label: "Requests handled without staff" },
      { value: "30 days", label: "Implementation time" },
      { value: "3–5 sec", label: "Average response time" },
    ],
    challengeTitle: "The challenge",
    challenge: [
      "60% of guest inquiries were routine — room availability, pricing, amenities — consuming front desk time that should go to personal service",
      "International guests faced a language barrier with no 24/7 multilingual support in place",
      "Time zone differences caused delays in booking confirmations and basic requests",
      "Upsell and loyalty opportunities were missed during every guest interaction",
      "No systematic way to capture and act on guest preferences across stays",
    ],
    builtTitle: "What we built",
    built: [
      "Conversational AI concierge that detects guest language automatically and responds natively — Russian, English, German, Chinese, Georgian and more",
      "Real-time room availability and pricing pulled from PMS (Exely) and OTA platforms (Booking.com / TravelLine) via an adapter layer that normalises different APIs",
      "End-to-end booking flow: guest provides details, bot completes the reservation in the hotel's management system, confirmation sent automatically",
      "Voice channel via Twilio + Whisper — guests can call, speak naturally, and get answers without waiting on hold",
      "Personalised upsell engine that offers spa, restaurant, transfer, and tours based on stay context — romantic packages on weekend bookings, etc.",
      "Post-stay retention flow: automated review request, loyalty programme invitation, and personalised return offer",
      "Analytics dashboard capturing request volume, peak hours, popular services, and unmet demand patterns",
    ],
    resultsTitle: "Results",
    results: [
      "82% reduction in manual handling with AI in the first month of operation",
      "72% of all guest requests resolved without any staff involvement",
      "Zero outdated pricing or availability shown — RAG architecture ensures every response pulls live data",
      "Consistent guest experience across all time zones, 24/7",
    ],
    featuresTitle: "Key features",
    features: [
      "Real-time availability and pricing",
      "End-to-end booking via OTA / PMS",
      "Auto language detection",
      "Voice channel (Twilio + Whisper)",
      "Guest preference memory",
      "Personalised upsell and loyalty",
      "Post-stay retention automation",
      "Request analytics and reporting",
    ],
    technology: "Technology",
    technologyValue: "Python · OpenAI API · Whisper · Twilio · TravelLine / Bnovo API · Telegram Bot API / WhatsApp",
    timeline: "Timeline",
    timelineValue: "30 working days",
  },
  ru: {
    pageTitle: "AI-консьерж для отеля — Кейс | AIHUB Works",
    backToCases: "Назад к кейсам",
    brand: "AIHUB Works",
    languageLabel: "Язык",
    caseStudy: "Кейс",
    heroTitle: "AI-консьерж для сервиса гостей в бутик-отеле",
    heroBody: "Мультиязычный ассистент для бронирований и обращений гостей с интеграцией в PMS и автоматизацией upsell-сценариев",
    tags: ["HoReCa", "Разговорный AI", "Автоматизация бронирований"],
    kpis: [
      { value: "82%", label: "Снижение ручной нагрузки" },
      { value: "72%", label: "Запросов обработано без участия персонала" },
      { value: "30 дней", label: "Срок внедрения" },
      { value: "3–5 сек", label: "Среднее время ответа" },
    ],
    challengeTitle: "Проблема",
    challenge: [
      "До 60% обращений гостей были типовыми: наличие номеров, цены, удобства, правила проживания. Эти запросы забирали время у стойки размещения и отвлекали команду от персонального сервиса.",
      "Иностранные гости сталкивались с языковым барьером, при этом круглосуточной мультиязычной поддержки не было.",
      "Из-за разницы часовых поясов подтверждение бронирований и ответы на базовые вопросы часто задерживались.",
      "Во время коммуникации с гостями терялись возможности для допродаж и повышения лояльности.",
      "Не было системного способа сохранять предпочтения гостей и использовать их при следующих обращениях и повторных заездах.",
    ],
    builtTitle: "Что мы внедрили",
    built: [
      "Разговорного AI-консьержа, который автоматически определяет язык гостя и отвечает нативно: на русском, английском, немецком, китайском, грузинском и других языках.",
      "Получение актуальной информации о наличии и ценах в реальном времени из PMS Exely и OTA-платформ через адаптерный слой, который нормализует разные API.",
      "Полный сценарий бронирования: гость передает данные, бот создает бронь в системе управления отелем и автоматически отправляет подтверждение.",
      "Голосовой канал через Twilio + Whisper: гость может позвонить, задать вопрос обычной речью и сразу получить ответ без ожидания на линии.",
      "Персонализированный upsell-движок, который предлагает спа, ресторан, трансфер и экскурсии в зависимости от контекста проживания.",
      "Post-stay сценарий удержания: автоматический запрос отзыва, приглашение в программу лояльности и персональное предложение на повторное бронирование.",
      "Аналитический дашборд по обращениям: объем запросов, пиковые часы, популярные услуги и паттерны неудовлетворенного спроса.",
    ],
    resultsTitle: "Результат",
    results: [
      "Снижение ручной нагрузки на 82% уже в первый месяц работы системы.",
      "72% всех запросов гостей закрываются без участия персонала.",
      "Гости не получают устаревшие цены или неверную доступность: архитектура с live-данными подставляет актуальную информацию в каждый ответ.",
      "Единый качественный сервис 24/7 для гостей из разных часовых поясов.",
    ],
    featuresTitle: "Ключевые функции",
    features: [
      "Актуальные цены и наличие в реальном времени",
      "Сквозное бронирование через OTA / PMS",
      "Автоопределение языка",
      "Голосовой канал на Twilio + Whisper",
      "Память о предпочтениях гостей",
      "Персонализированный upsell и loyalty",
      "Автоматизация post-stay коммуникации",
      "Аналитика и отчетность по обращениям",
    ],
    technology: "Технологии",
    technologyValue: "Python · OpenAI API · Whisper · Twilio · TravelLine / Bnovo API · Telegram Bot API / WhatsApp",
    timeline: "Срок",
    timelineValue: "30 рабочих дней",
  },
} as const;

type Locale = keyof typeof content;

/* ── Scroll-reveal hook ── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── Animated counter ── */
function useCounter(target: number, active: boolean, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const raf = requestAnimationFrame(function step(ts) {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

/* ── KPI Card ── */
interface KpiProps {
  value: string;
  label: string;
  delay?: number;
}

function KpiCard({ value, label, delay = 0 }: KpiProps) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center justify-center p-6 rounded-[24px] bg-[#060c2499] backdrop-blur-[10px] text-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms`,
        boxShadow: `inset 0 0 40px ${GREEN_08}`,
      }}
    >
      <div
        className="absolute inset-0 p-px rounded-[24px] pointer-events-none"
        style={{
          background: `linear-gradient(129deg, ${GREEN_80} 0%, transparent 70%)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <span
        className="[font-family:'Geologica',Helvetica] font-bold leading-none mb-2"
        style={{ fontSize: "clamp(28px,5vw,44px)", color: GREEN }}
      >
        {value}
      </span>
      <span className="[font-family:'Geologica',Helvetica] font-light text-white/70 text-sm leading-snug">
        {label}
      </span>
    </div>
  );
}

/* ── Section block ── */
interface SectionProps {
  title: string;
  children: React.ReactNode;
  delay?: number;
  accentColor?: string;
}

function Section({ title, children, delay = 0, accentColor = "rgba(8, 208, 112, 0.95)" }: SectionProps) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="relative rounded-[24px] bg-[#060c2499] backdrop-blur-[10px] p-6 sm:p-8"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
        boxShadow: `inset 0 0 40px ${GREEN_06}`,
      }}
    >
      <div
        className="absolute inset-0 p-px rounded-[24px] pointer-events-none"
        style={{
          background: `linear-gradient(129deg, ${accentColor} 0%, transparent 70%)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <h2 className="[font-family:'Geologica',Helvetica] font-semibold text-white text-xl sm:text-2xl mb-5">
        {title}
      </h2>
      {children}
    </div>
  );
}

/* ── Bullet list item ── */
function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 [font-family:'Geologica',Helvetica] font-light text-white/80 text-sm sm:text-base leading-relaxed">
      <span className="mt-[5px] shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} />
      <span>{children}</span>
    </li>
  );
}

/* ── Feature pill ── */
function FeaturePill({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-[12px] bg-[#ffffff08]" style={{ border: `1px solid ${GREEN_13}` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: GREEN }} />
      <span className="[font-family:'Geologica',Helvetica] font-light text-white/80 text-sm leading-snug">
        {children}
      </span>
    </div>
  );
}

/* ── Tag pill ── */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 rounded-full [font-family:'Geologica',Helvetica] font-light text-xs" style={{ background: GREEN_08, border: `1px solid ${GREEN_20}`, color: GREEN_90 }}>
      {children}
    </span>
  );
}

/* ── Main page ── */
export function HotelConciergePage() {
  const base = import.meta.env.BASE_URL;
  const backHref = `${base}#cases`;

  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [locale, setLocale] = useState<Locale>("en");
  const t = content[locale];
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    document.title = t.pageTitle;
    document.documentElement.lang = locale;
  }, [locale, t.pageTitle]);

  return (
    <div className="min-h-screen bg-[#060c24] text-white">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#060c24cc] backdrop-blur-[12px] border-b border-white/5">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 min-h-14 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <a
              href={backHref}
              className="flex items-center gap-2 [font-family:'Geologica',Helvetica] font-light text-white/60 hover:text-white text-sm transition-colors duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t.backToCases}
            </a>
            <span className="text-white/20">·</span>
            <span className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-sm">
              {t.brand}
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-full px-1.5 py-1 bg-white/[0.04] shrink-0"
            style={{ border: `1px solid ${GREEN_13}` }}
            aria-label={t.languageLabel}
          >
            {(["ru", "en"] as const).map((lang) => {
              const active = locale === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLocale(lang)}
                  className="px-2.5 py-1 rounded-full [font-family:'Geologica',Helvetica] text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-200"
                  style={{
                    background: active ? GREEN_08 : "transparent",
                    border: `1px solid ${active ? GREEN_20 : "transparent"}`,
                    color: active ? GREEN : "rgba(255,255,255,0.45)",
                  }}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 py-10 sm:py-14 space-y-6 sm:space-y-8">

        {/* Hero */}
        <div
          ref={heroRef}
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1)",
          }}
        >
          {/* eyebrow */}
          <p className="[font-family:'Geologica',Helvetica] font-light text-sm uppercase tracking-widest mb-3" style={{ color: GREEN }}>
            {t.caseStudy}
          </p>

          <h1
            className="[font-family:'Geologica',Helvetica] font-bold text-white leading-tight mb-4"
            style={{ fontSize: "clamp(26px,5vw,52px)" }}
          >
            {t.heroTitle}
          </h1>

          <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-base sm:text-lg leading-relaxed mb-6 max-w-[680px]">
            {t.heroBody}
          </p>

          <div className="flex flex-wrap gap-2">
            {t.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {t.kpis.map((item, index) => (
            <KpiCard key={item.label} value={item.value} label={item.label} delay={index * 80} />
          ))}
        </div>

        {/* The Challenge */}
        <Section title={t.challengeTitle} delay={0}>
          <ul className="space-y-3">
            {t.challenge.map((item) => (
              <BulletItem key={item}>{item}</BulletItem>
            ))}
          </ul>
        </Section>

        {/* What we built */}
        <Section title={t.builtTitle} delay={60}>
          <ul className="space-y-3">
            {t.built.map((item) => (
              <BulletItem key={item}>{item}</BulletItem>
            ))}
          </ul>
        </Section>

        {/* Results */}
        <Section title={t.resultsTitle} delay={120}>
          <ul className="space-y-3">
            {t.results.map((item) => (
              <BulletItem key={item}>{item}</BulletItem>
            ))}
          </ul>
        </Section>

        {/* Key features */}
        <Section title={t.featuresTitle} delay={180}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {t.features.map((item) => (
              <FeaturePill key={item}>{item}</FeaturePill>
            ))}
          </div>
        </Section>

        {/* Tech & Timeline */}
        <div
          className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-2 pb-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-xs uppercase tracking-widest mb-1.5">
              {t.technology}
            </p>
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-sm leading-relaxed">
              {t.technologyValue}
            </p>
          </div>
          <div className="sm:border-l sm:border-white/10 sm:pl-8 shrink-0">
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-xs uppercase tracking-widest mb-1.5">
              {t.timeline}
            </p>
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-sm">
              {t.timelineValue}
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
