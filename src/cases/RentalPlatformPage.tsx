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
    pageTitle: "AI Voice & Chat Agent for Vacation Rental Platform — Case Study | AIHUB Works",
    backToCases: "Back to cases",
    brand: "AIHUB Works",
    languageLabel: "Language",
    caseStudy: "Case Study",
    heroTitle: "Automating first-line sales and support for a vacation rental platform",
    heroBody: "Voice and text AI agent system that handles 100% of inbound inquiries across English, Spanish, and French — without adding headcount",
    tags: ["Vacation Rental", "Voice AI", "Sales Automation", "Conversational AI"],
    kpis: [
      { value: "2 396", label: "Missed calls over 3 summer months" },
      { value: "100%", label: "First-line coverage taken by AI" },
      { value: "90%", label: "Requests resolved without escalation" },
      { value: "+50%", label: "Conversion rate growth" },
    ],
    challengeTitle: "The challenge",
    challenge: [
      "A team of just 4 managers handled all inbound inquiries from two audiences: guests looking to book short-term rentals and property owners listing their homes and apartments",
      "Calls came in three languages — English, Spanish, and French — but only one manager was fluent in French",
      "During peak summer months the team simply couldn't keep up with volume: 743 missed calls in June, 1,007 in July, 646 in August — 2,396 total over the season",
      "Missed leads didn't wait: they booked through Booking.com or competing platforms before anyone could call back",
      "Service quality for existing guests also suffered — clients with active bookings couldn't reach anyone either, which damaged trust",
    ],
    missedCallsLabel: "Missed calls by month",
    missedCallsData: [
      { month: "June 2025", value: 743 },
      { month: "July 2025", value: 1007 },
      { month: "August 2025", value: 646 },
    ],
    builtTitle: "What we built",
    built: [
      "Started with a deep business diagnostic: mapped the sales funnel, reviewed the CRM, Avantio booking system, website, messengers, chat widget, telephony, and a knowledge base scattered across Excel files",
      "Designed an agentic system with two types of agents: a voice agent for inbound calls and a text agent for website chat and WhatsApp",
      "Mapped and structured 89 communication scenarios for guests and tenants, and 56 scenarios for property owners — covering the full range of routine inquiries",
      "Built automated lead qualification: every inbound contact is captured and processed regardless of time, language, or call volume",
      "Implemented native multilingual handling in English, Spanish, and French — first-line responses delivered without human routing or language-dependent staffing",
      "Wired safety escalation logic: if a caller is upset, a conflict arises, or the request falls outside standard scenarios, the conversation is immediately transferred to a manager",
      "Integrated with Avantio, CRM, the site's chat widget, WhatsApp, and the telephony stack",
    ],
    resultsTitle: "Results",
    results: [
      "The agentic system now handles 100% of first-line inbound communications: voice calls, website chat, and WhatsApp messages",
      "~90% of routine requests are resolved by the agent without escalation; the remaining 10% are handed off to managers with full context",
      "Managers stopped drowning in repetitive inquiries and shifted focus to complex leads, high-value clients, and sales",
      "Zero missed leads from unanswered calls: every inbound contact is captured and receives a response",
      "First-line communication works 24/7 in English, Spanish, and French — without language-dependent staffing",
      "Conversion rate grew by 50% as the company stopped losing hot demand at the moment of first contact",
    ],
    featuresTitle: "Key features",
    features: [
      "Voice agent for inbound calls",
      "Text agent for website chat and WhatsApp",
      "Auto language detection (EN / ES / FR)",
      "Avantio booking system integration",
      "CRM integration",
      "Lead qualification automation",
      "Owner inquiry automation",
      "Safety escalation to human agents",
      "24/7 availability, no staffing cap",
    ],
    technology: "Technology",
    technologyValue: "Python · OpenAI API · Whisper · Avantio API · WhatsApp Business API · Telephony integration",
    scenariosLabel: "Communication scenarios",
    scenariosValue: "89 guest scenarios · 56 owner scenarios",
  },
  ru: {
    pageTitle: "Голосовой и чат-агент для платформы туристической аренды — Кейс | AIHUB Works",
    backToCases: "Назад к кейсам",
    brand: "AIHUB Works",
    languageLabel: "Язык",
    caseStudy: "Кейс",
    heroTitle: "Автоматизация первой линии продаж и поддержки для платформы туристической аренды",
    heroBody: "Агентная система из голосовых и текстовых агентов, которая обрабатывает 100% входящих обращений на английском, испанском и французском — без расширения команды",
    tags: ["Туристическая аренда", "Голосовой AI", "Автоматизация продаж", "Разговорный AI"],
    kpis: [
      { value: "2 396", label: "Пропущенных звонков за 3 летних месяца" },
      { value: "100%", label: "Первая линия взята агентами" },
      { value: "90%", label: "Запросов решается без эскалации" },
      { value: "+50%", label: "Рост конверсии" },
    ],
    challengeTitle: "Проблема",
    challenge: [
      "Весь входящий поток обрабатывала небольшая команда из 4 менеджеров: обращения поступали как от гостей, которые хотели забронировать жильё, так и от собственников, сдающих квартиры, дома и небольшие отели",
      "Клиенты обращались на трёх языках: английском, испанском и французском — при этом французским свободно владел только один сотрудник",
      "В пиковые периоды команда не справлялась с объёмом: 743 пропущенных звонка в июне, 1 007 в июле, 646 в августе — 2 396 за три летних месяца",
      "Пропущенные лиды не ждали: они уходили бронировать жильё через Booking.com и другие площадки, пока до них не дозвонились",
      "Страдал и сервис для текущих клиентов — гости с активными бронированиями тоже не могли дозвониться, что подрывало доверие к платформе",
    ],
    missedCallsLabel: "Пропущенные звонки по месяцам",
    missedCallsData: [
      { month: "Июнь 2025", value: 743 },
      { month: "Июль 2025", value: 1007 },
      { month: "Август 2025", value: 646 },
    ],
    builtTitle: "Что мы внедрили",
    built: [
      "Провели глубокую бизнес-диагностику: разобрали воронку продаж, изучили CRM, систему бронирования Avantio, сайт, мессенджеры, виджет чата, телефонию и разрозненную базу знаний в Excel",
      "Спроектировали агентную систему из двух типов агентов: голосовой агент для входящих звонков и текстовый агент для чата на сайте и WhatsApp",
      "Описали и структурировали 89 сценариев коммуникации для арендаторов и гостей, и 56 сценариев для собственников — охватив весь спектр типовых обращений",
      "Настроили автоматическую квалификацию лидов: каждое входящее обращение фиксируется и обрабатывается вне зависимости от времени, языка и нагрузки",
      "Реализовали нативную мультиязычную обработку на английском, испанском и французском — первая линия отвечает на языке клиента без ручного роутинга и языкозависимого найма",
      "Настроили логику безопасной эскалации: если клиент раздражён, возникает конфликт или запрос выходит за рамки стандартных сценариев, диалог сразу переводится на менеджера",
      "Интегрировали систему с Avantio, CRM, виджетом на сайте, WhatsApp и телефонией",
    ],
    resultsTitle: "Результат",
    results: [
      "Агентная система взяла на себя 100% первой линии входящих коммуникаций: звонки, чат на сайте и сообщения в WhatsApp",
      "~90% типовых запросов агент закрывает самостоятельно; оставшиеся 10% передаются менеджерам с полным контекстом диалога",
      "Менеджеры перестали тонуть в потоке однотипных обращений и сфокусировались на сложных лидах, продажах и сервисе",
      "Потери лидов из-за пропущенных звонков устранены: каждый входящий контакт фиксируется и получает обработку",
      "Первая линия работает 24/7 на английском, испанском и французском — без языкозависимого найма и без ограничений по нагрузке",
      "Конверсия выросла на 50%, потому что компания перестала терять горячий спрос в момент первого обращения",
    ],
    featuresTitle: "Ключевые функции",
    features: [
      "Голосовой агент для входящих звонков",
      "Текстовый агент для чата и WhatsApp",
      "Автоопределение языка (EN / ES / FR)",
      "Интеграция с системой бронирования Avantio",
      "Интеграция с CRM",
      "Автоматическая квалификация лидов",
      "Автоматизация коммуникации с собственниками",
      "Безопасная эскалация на менеджера",
      "Работа 24/7 без ограничений по нагрузке",
    ],
    technology: "Технологии",
    technologyValue: "Python · OpenAI API · Whisper · Avantio API · WhatsApp Business API · Интеграция с телефонией",
    scenariosLabel: "Сценарии коммуникации",
    scenariosValue: "89 сценариев для гостей · 56 сценариев для собственников",
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

/* ── Missed calls bar chart ── */
interface MissedCallsChartProps {
  label: string;
  data: readonly { month: string; value: number }[];
}

function MissedCallsChart({ label, data }: MissedCallsChartProps) {
  const { ref, visible } = useReveal(0.1);
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div ref={ref} className="mt-5 pt-5" style={{ borderTop: `1px solid ${GREEN_13}` }}>
      <p className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-xs uppercase tracking-widest mb-4">
        {label}
      </p>
      <div className="flex gap-4 items-end">
        {data.map((item, i) => {
          const pct = (item.value / max) * 100;
          return (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
              <span
                className="[font-family:'Geologica',Helvetica] font-semibold text-sm"
                style={{ color: GREEN }}
              >
                {item.value.toLocaleString()}
              </span>
              <div className="w-full rounded-t-[6px]" style={{ background: GREEN_13, height: 80, display: "flex", alignItems: "flex-end" }}>
                <div
                  className="w-full rounded-t-[6px]"
                  style={{
                    background: i === 1 ? GREEN : GREEN_80,
                    height: visible ? `${pct}%` : "0%",
                    transition: `height 0.9s cubic-bezier(.22,1,.36,1) ${i * 120}ms`,
                    minHeight: 4,
                  }}
                />
              </div>
              <span className="[font-family:'Geologica',Helvetica] font-light text-white/50 text-xs text-center leading-tight">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main page ── */
export function RentalPlatformPage() {
  const base = import.meta.env.BASE_URL;
  const backHref = `${base}#cases`;

  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [locale, setLocale] = useState<Locale>("ru");
  const t = content[locale];

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(timer);
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
          <MissedCallsChart label={t.missedCallsLabel} data={t.missedCallsData} />
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

        {/* Tech & Scenarios */}
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
              {t.scenariosLabel}
            </p>
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-sm">
              {t.scenariosValue}
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
