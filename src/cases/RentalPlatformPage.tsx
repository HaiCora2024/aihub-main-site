import { useEffect, useRef, useState } from "react";

const GREEN = "rgba(8, 208, 112, 0.95)";
const GREEN_80 = "rgba(8, 208, 112, 0.8)";
const GREEN_08 = "rgba(8, 208, 112, 0.08)";
const GREEN_06 = "rgba(8, 208, 112, 0.06)";
const GREEN_20 = "rgba(8, 208, 112, 0.2)";
const GREEN_13 = "rgba(8, 208, 112, 0.13)";
const GREEN_90 = "rgba(8, 208, 112, 0.9)";
const GREEN_30 = "rgba(8, 208, 112, 0.30)";
const ORANGE = "rgba(255, 186, 144, 0.9)";
const ORANGE_20 = "rgba(255, 186, 144, 0.2)";

const content = {
  en: {
    pageTitle: "AI Voice & Chat Agent for Vacation Rental Platform — Case Study | AIHUB Works",
    backToCases: "Back to cases",
    brand: "AIHUB Works",
    languageLabel: "Language",
    eyebrow: "Case Study · AI for Sales and Support",
    heroTitle: "AI Front-Line Coverage for a Vacation Rental Platform",
    heroLead: "A vacation rental platform with international inbound demand eliminated front-line leakage, removed a language bottleneck, and improved conversion without expanding the team.",
    heroNote: "The solution covered phone calls, website chat, and WhatsApp. After implementation, the company stopped losing demand at first contact and gained a controlled inbound handling process during peak season, including automated actions in Bitrix and data validation in Avantio.",
    demoLabel: "Try voice agent",
    impactKicker: "Core business impact",
    impactTitle1: "~500 missed calls",
    impactTitle2: " during the season before implementation.",
    impactTitle3: "100% inbound coverage",
    impactTitle4: " after launch.",
    mini: [
      { value: "90%", label: "of standard requests resolved without escalation to a manager" },
      { value: "+50%", label: "increase in conversion after eliminating front-line leakage" },
    ],
    stats: [
      { kicker: "Pre-implementation loss", value: "~500", label: "missed calls from June through August 2025" },
      { kicker: "Operating load", value: "4 / 3 / 1", label: "4 managers, 3 inbound languages, 1 team member fluent in French" },
      { kicker: "After implementation", value: "100%", label: "first-line inbound coverage delivered by the AI solution" },
      { kicker: "Revenue impact", value: "€93 563", label: "estimated additional seasonal revenue at 30% conversion and €625 average booking value" },
    ],
    challengeKicker: "Business challenge",
    challengeTitle: "The company was losing potential bookings at the first point of contact",
    challengeSub: "During peak season, response speed had a direct impact on conversion. With a limited team and multilingual inbound demand, first-line handling became a clear operational constraint.",
    challengeCards: [
      { kicker: "Capacity", title: "A small team handled the full inbound workload", copy: "Four managers had to process calls, website enquiries, and WhatsApp messages during the busiest demand periods." },
      { kicker: "Language coverage", title: "A language bottleneck made the problem worse", copy: "Enquiries arrived in English, Spanish, and French, while only one team member could confidently handle French-language interactions." },
      { kicker: "Commercial impact", title: "Losses occurred at the highest-intent stage of the funnel", copy: "Missed calls translated into lost bookings, while delayed responses also weakened service quality for current guests and property owners." },
    ],
    factsKicker: "Observed pattern",
    factsTitle: "The issue was visible across every month of peak season",
    factsSub: "Updated inbound data confirmed a structural overload on the front line throughout the summer, not a one-off spike.",
    missedCallsLabel: "Missed calls by month",
    missedCallsData: [
      { month: "June 2025", value: 141 },
      { month: "July 2025", value: 134 },
      { month: "August 2025", value: 224 },
    ],
    factsCardTitle: "Roughly 166 lost inbound opportunities per month during the season",
    factsCardKicker: "What this meant for the business",
    factsBullets: [
      "Some potential guests moved to competing platforms before any conversation took place.",
      "The team operated under continuous overload and could not maintain a stable front-line response standard.",
      "High-intent demand did not convert into bookings at full potential because of an operational bottleneck.",
    ],
    solutionKicker: "Solution",
    solutionTitle: "An AI first-line inbound layer was deployed across calls and messaging channels",
    solutionSub: "The solution delivered continuous first-line coverage, reduced dependence on individual language specialists, and standardized handling of routine requests without adding headcount.",
    solutionCards: [
      { kicker: "Voice channel", title: "Inbound calls were automated at first contact", copy: "The system receives the call, identifies the language, conducts the dialogue, resolves standard questions, and records the result of the interaction." },
      { kicker: "Text channels", title: "Website chat and WhatsApp were brought into one operating layer", copy: "AI handles standard requests in chat and messaging, while more complex cases are routed to managers with the relevant context attached." },
      { kicker: "System integration", title: "The front line was integrated into the client's operating stack", copy: "The solution works alongside Bitrix, Avantio, telephony, and the internal knowledge base, automatically triggering CRM actions and validating booking data in the reservation system." },
    ],
    proofChips: ["89 guest scenarios", "56 owner scenarios", "CRM + Avantio + telephony + website + WhatsApp", "English, Spanish, and French at first line"],
    processKicker: "How it works",
    processTitle: "AI handles the full inbound stream, while the team focuses only on cases that require human judgment",
    processSub: "This operating model increases response speed, standardizes first-line handling, and reallocates team capacity to higher-value work.",
    steps: [
      { num: "01", title: "Request intake", copy: "AI answers the call or message immediately, without waiting for a free manager." },
      { num: "02", title: "Language-based handling", copy: "The system communicates in the guest's language and records the nature of the request." },
      { num: "03", title: "Qualification and routing", copy: "Routine enquiries are resolved automatically, while non-standard cases are routed to the right employee with context." },
      { num: "04", title: "Validation and pipeline recovery", copy: "The system validates key data in Avantio and returns recovered inbound demand to the funnel without front-line leakage." },
    ],
    resultsKicker: "Outcomes",
    resultsTitle: "The company gained a controllable inbound handling process during peak seasonal load",
    resultsSub: "After implementation, first-line handling was no longer a growth constraint. The solution reduced operational pressure on the team while improving commercial performance.",
    resultCards: [
      { kicker: "Full coverage", title: "100% of first-line inbound covered by AI", copy: "Every inbound request is captured and processed, including during peak demand periods." },
      { kicker: "Lower workload", title: "90% of standard requests do not require escalation", copy: "Managers can focus on complex leads, sales, and service issues where human involvement adds the most value." },
      { kicker: "Higher efficiency", title: "Conversion increased by 50%", copy: "Eliminating front-line leakage returned previously lost demand to the funnel and improved booking performance." },
    ],
    econKicker: "Economics",
    econTitle: "The revenue estimate is based on recovered inbound demand",
    econSub: "The model uses the updated missed-call data, an estimated 30% conversion to booking, and an average booking value of €625.",
    econCalcKicker: "Calculation",
    econFormula: [
      { bold: "499", text: " missed calls during the season" },
      { bold: "30%", text: " estimated booking conversion" },
      { bold: "€625", text: " average booking value" },
      { bold: "€93,563", text: " estimated additional summer-season revenue" },
    ],
    econFootnote: "On a monthly basis, this corresponds to approximately €31,188 in additional revenue during peak season.",
    econResultKicker: "Business result",
    econResultValue: "€93,563 per season",
    econResultCopy1: "The company removed first-line leakage, preserved demand during peak periods, and improved revenue output without increasing operating headcount.",
    econResultCopy2: "If the actual conversion rate from recovered inbound is refined, the economics block can be updated accordingly.",
  },
  ru: {
    pageTitle: "Голосовой и чат-агент для платформы туристической аренды — Кейс | AIHUB Works",
    backToCases: "Назад к кейсам",
    brand: "AIHUB Works",
    languageLabel: "Язык",
    eyebrow: "Кейс · AI для продаж и поддержки",
    heroTitle: "AI-агент на первой линии с клиентами для платформы бронирования: 90% звонков и переписок закрываются без менеджера",
    heroLead: "Платформа краткосрочной аренды теряла клиентов в сезон: команда не успевала отвечать на звонки и сообщения на трёх языках. Мы автоматизировали первую линию и убрали потери на входе без расширения штата.",
    heroNote: "AI-агент принял на себя звонки, чат на сайте и WhatsApp. В результате компания перестала терять горячий спрос в момент первого обращения, а менеджеры переключились с рутины на продажи и сложные кейсы.",
    demoLabel: "Попробовать голосового агента",
    impactKicker: "Главный результат",
    impactTitle1: "≈500 пропущенных звонков",
    impactTitle2: " за летний сезон до запуска.",
    impactTitle3: "100% входящих",
    impactTitle4: " под контролем после запуска.",
    mini: [
      { value: "90%", label: "типовых обращений агент закрывает без подключения менеджера" },
      { value: "+50%", label: "рост конверсии после того, как первая линия перестала терять обращения" },
    ],
    stats: [
      { kicker: "До внедрения", value: "≈500", label: "пропущенных звонков за июнь–август 2025 года" },
      { kicker: "Команда", value: "4 / 3 / 1", label: "4 менеджера, 3 языка входящих, только 1 сотрудник свободно говорил по-французски" },
      { kicker: "После запуска", value: "100%", label: "первая линия закрыта AI-агентом после внедрения" },
      { kicker: "Экономика", value: "€93 563", label: "оценка дополнительного оборота за сезон при конверсии 30% и среднем чеке €625" },
    ],
    challengeKicker: "Проблема",
    challengeTitle: "Компания теряла бронирования ещё до разговора с клиентом",
    challengeSub: "В высокий сезон первая линия не справлялась с объёмом обращений. Чем дольше клиент ждал ответа, тем выше был шанс, что он уйдёт на Booking или к другому оператору.",
    challengeCards: [
      { kicker: "Нагрузка", title: "Одна небольшая команда закрывала весь входящий поток", copy: "Четыре менеджера одновременно вели звонки, чат на сайте и WhatsApp, причём именно в пиковые месяцы, когда скорость ответа особенно важна." },
      { kicker: "Язык", title: "Французский стал узким местом", copy: "Запросы шли на английском, испанском и французском. При этом уверенно работать на французском мог только один сотрудник." },
      { kicker: "Потери", title: "Спрос был, но компания не успевала его обработать", copy: "Потери возникали не из-за нехватки заявок, а из-за перегруженной первой линии: звонки пропускались, ответы задерживались, а горячие клиенты уходили." },
    ],
    factsKicker: "Факты",
    factsTitle: "Перегрузка держалась весь сезон, а не возникала эпизодически",
    factsSub: "Новые данные по звонкам показали, что проблема носила системный характер: команда не выдерживала входящий поток на протяжении всего летнего периода.",
    missedCallsLabel: "Пропущенные звонки по месяцам",
    missedCallsData: [
      { month: "Июнь 2025", value: 141 },
      { month: "Июль 2025", value: 134 },
      { month: "Август 2025", value: 224 },
    ],
    factsCardTitle: "В среднем терялось около 166 входящих в месяц",
    factsCardKicker: "Что это значило для бизнеса",
    factsBullets: [
      "Часть гостей уходила к конкурентам, так и не получив ответа.",
      "Текущие клиенты дольше ждали решения вопросов по уже существующим бронированиям.",
      "Менеджеры тратили время на повторяющиеся обращения вместо продаж и сложных ситуаций.",
    ],
    solutionKicker: "Решение",
    solutionTitle: "Мы поставили AI-агента на первую линию и связали его с рабочими системами клиента",
    solutionSub: "Система закрыла первую линию без перерывов, сняла зависимость от отдельных языковых специалистов и стандартизировала обработку типовых запросов.",
    solutionCards: [
      { kicker: "Звонки", title: "AI-агент взял на себя входящие звонки", copy: "Он определяет язык, ведёт диалог, отвечает на типовые вопросы, квалифицирует обращение и фиксирует результат в системе." },
      { kicker: "Чаты", title: "Сайт и WhatsApp работают в том же контуре", copy: "Типовые вопросы закрываются автоматически, а сложные случаи уходят менеджеру уже с контекстом и историей обращения." },
      { kicker: "Интеграции", title: "Первая линия встроена в рабочий процесс", copy: "Решение связано с CRM, Avantio, телефонией и базой знаний, поэтому обращение не просто принимается, а сразу попадает в операционный контур." },
    ],
    proofChips: ["89 сценариев для гостей", "56 сценариев для собственников", "CRM + Avantio + телефония + сайт + WhatsApp", "Английский, испанский и французский на первой линии"],
    processKicker: "Как это работает",
    processTitle: "AI обрабатывает весь поток, а человек подключается только там, где это действительно нужно",
    processSub: "Такой контур позволяет ускорить ответ, убрать потери на входе и освободить команду от однотипной рутины.",
    steps: [
      { num: "01", title: "Принимает обращение", copy: "Звонок или сообщение попадает в систему сразу, без ожидания свободного менеджера." },
      { num: "02", title: "Определяет язык и тему", copy: "Агент понимает, кто обращается, на каком языке и с каким вопросом." },
      { num: "03", title: "Закрывает типовые кейсы", copy: "Если запрос стандартный, система решает его сама. Если нет — передаёт менеджеру вместе с контекстом." },
      { num: "04", title: "Возвращает спрос в воронку", copy: "Сохранённые входящие не теряются на первой линии и доходят до бронирования или дальнейшей обработки." },
    ],
    resultsKicker: "Результат",
    resultsTitle: "Первая линия перестала быть узким местом для продаж и сервиса",
    resultsSub: "После внедрения компания перестала терять обращения на входе, разгрузила менеджеров и получила более предсказуемый процесс обработки спроса в сезон.",
    resultCards: [
      { kicker: "Охват", title: "100% первой линии закрыто AI-агентом", copy: "Все обращения фиксируются и обрабатываются, включая периоды сезонного пика." },
      { kicker: "Автозакрытие", title: "90% типовых запросов идут без эскалации", copy: "Менеджеры подключаются только там, где действительно нужна их экспертиза: сложные лиды, спорные вопросы и нестандартные ситуации." },
      { kicker: "Конверсия", title: "+50% к конверсии", copy: "После того как первая линия перестала терять обращения, больший объём входящего спроса стал доходить до бронирования." },
    ],
    econKicker: "Экономика",
    econTitle: "Эффект считали от реально потерянного входящего потока",
    econSub: "В расчёт взяли актуальные данные по пропущенным звонкам, ориентир по конверсии в бронирование на уровне 30% и средний чек €625.",
    econCalcKicker: "Расчёт",
    econFormula: [
      { bold: "499", text: " пропущенных звонков за сезон" },
      { bold: "30%", text: " конверсия в бронирование" },
      { bold: "€625", text: " средний чек" },
      { bold: "€93 563", text: " дополнительного оборота за летний сезон" },
    ],
    econFootnote: "В среднем это около €31 188 дополнительного оборота в месяц в высокий сезон.",
    econResultKicker: "Итог для бизнеса",
    econResultValue: "€93 563 за сезон",
    econResultCopy1: "Компания перестала терять горячий спрос на первом контакте и вернула в воронку доход, который раньше сгорал из-за перегрузки первой линии.",
    econResultCopy2: "Если уточнить фактическую конверсию из сохранённого входящего, этот блок можно пересчитать ещё точнее.",
  },
} as const;

type Locale = keyof typeof content;

/* ── Scroll-reveal hook ── */
function useReveal(threshold = 0.12) {
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

/* ── Shared card base styles ── */
const cardBase: React.CSSProperties = {
  borderRadius: 22,
  padding: "22px 24px",
  border: `1px solid rgba(255,255,255,0.08)`,
  background: "rgba(255,255,255,0.03)",
};

const cardDark: React.CSSProperties = {
  borderRadius: 22,
  padding: "22px 24px",
  border: `1px solid ${GREEN_20}`,
  background: GREEN_06,
};

/* ── Section wrapper ── */
interface SectionWrapProps {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}

function SectionWrap({ children, delay = 0, style }: SectionWrapProps) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
        borderRadius: 28,
        padding: "28px 28px 32px",
        border: `1px solid rgba(255,255,255,0.07)`,
        background: "rgba(255,255,255,0.025)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Section header ── */
interface SectionHeadProps {
  kicker: string;
  title: string;
  sub?: string;
}

function SectionHead({ kicker, title, sub }: SectionHeadProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 18, marginBottom: 22, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 320px" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: GREEN_80, marginBottom: 8, fontFamily: "'Geologica', Helvetica", fontWeight: 500 }}>
          {kicker}
        </div>
        <div style={{ fontSize: "clamp(22px, 3vw, 30px)", lineHeight: 1.1, fontWeight: 700, letterSpacing: "-0.03em", color: "#fff", fontFamily: "'Geologica', Helvetica" }}>
          {title}
        </div>
      </div>
      {sub && (
        <div style={{ maxWidth: 400, fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.5)", fontFamily: "'Geologica', Helvetica", fontWeight: 300, flex: "0 1 400px" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

/* ── Card kicker label ── */
function CardKicker({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: GREEN_80, marginBottom: 10, fontFamily: "'Geologica', Helvetica", fontWeight: 500 }}>
      {children}
    </div>
  );
}

/* ── Card title ── */
function CardTitle({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div style={{ fontSize: 18, lineHeight: 1.2, fontWeight: 700, letterSpacing: "-0.025em", color: dark ? "#fff" : "#fff", fontFamily: "'Geologica', Helvetica", marginBottom: 10 }}>
      {children}
    </div>
  );
}

/* ── Card copy ── */
function CardCopy({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div style={{ fontSize: 14, lineHeight: 1.6, color: dark ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.55)", fontFamily: "'Geologica', Helvetica", fontWeight: 300 }}>
      {children}
    </div>
  );
}

/* ── Stat card ── */
interface StatCardProps {
  kicker: string;
  value: string;
  label: string;
  delay?: number;
}

function StatCard({ kicker, value, label, delay = 0 }: StatCardProps) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        ...cardBase,
        minHeight: 130,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      }}
    >
      <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: GREEN_80, fontFamily: "'Geologica', Helvetica", fontWeight: 500, marginBottom: 8 }}>{kicker}</div>
      <div style={{ fontSize: "clamp(26px,3vw,38px)", lineHeight: 1, fontWeight: 750, letterSpacing: "-0.04em", color: GREEN, fontFamily: "'Geologica', Helvetica", marginBottom: 10 }}>{value}</div>
      <div style={{ fontSize: 13, lineHeight: 1.5, color: "rgba(255,255,255,0.5)", fontFamily: "'Geologica', Helvetica", fontWeight: 300 }}>{label}</div>
    </div>
  );
}

/* ── Dot bullet ── */
function Dot() {
  return <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: GREEN, flexShrink: 0, marginTop: 6 }} />;
}

/* ── Missed calls bar chart ── */
interface BarChartProps {
  label: string;
  data: readonly { month: string; value: number }[];
}

function BarChart({ label, data }: BarChartProps) {
  const { ref, visible } = useReveal(0.1);
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div ref={ref}>
      <CardKicker>{label}</CardKicker>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-end", height: 180, marginTop: 8 }}>
        {data.map((item, i) => {
          const pct = (item.value / max) * 100;
          return (
            <div key={item.month} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 8, height: "100%" }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: GREEN, fontFamily: "'Geologica', Helvetica", letterSpacing: "-0.03em" }}>
                {item.value}
              </span>
              <div style={{ flex: 1, background: GREEN_08, borderRadius: "12px 12px 0 0", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
                <div
                  style={{
                    width: "100%",
                    background: i === 2 ? `linear-gradient(180deg, ${GREEN_80} 0%, ${GREEN} 100%)` : `linear-gradient(180deg, ${GREEN_30} 0%, ${GREEN_80} 100%)`,
                    borderRadius: "12px 12px 0 0",
                    height: visible ? `${pct}%` : "0%",
                    transition: `height 0.9s cubic-bezier(.22,1,.36,1) ${i * 120}ms`,
                    minHeight: 4,
                  }}
                />
              </div>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontFamily: "'Geologica', Helvetica", fontWeight: 300, textAlign: "center" }}>
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
  const [locale, setLocale] = useState<Locale>("en");
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
    <div className="min-h-screen text-white" style={{ background: "#060c24" }}>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(6,12,36,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", minHeight: 56, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
            <a
              href={backHref}
              style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Geologica', Helvetica", fontWeight: 300, color: "rgba(255,255,255,0.5)", fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t.backToCases}
            </a>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
            <span style={{ fontFamily: "'Geologica', Helvetica", fontWeight: 300, color: "rgba(255,255,255,0.35)", fontSize: 14 }}>
              {t.brand}
            </span>
          </div>

          {/* Language toggle */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 4, borderRadius: 999, padding: "4px 4px", background: "rgba(255,255,255,0.04)", border: `1px solid ${GREEN_13}`, flexShrink: 0 }}
            aria-label={t.languageLabel}
          >
            {(["en", "ru"] as const).map((lang) => {
              const active = locale === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLocale(lang)}
                  style={{
                    border: `1px solid ${active ? GREEN_20 : "transparent"}`,
                    background: active ? GREEN_08 : "transparent",
                    color: active ? GREEN : "rgba(255,255,255,0.4)",
                    borderRadius: 999,
                    padding: "5px 12px",
                    fontFamily: "'Geologica', Helvetica",
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 72px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* ── HERO ── */}
        <div
          ref={heroRef}
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1)",
            borderRadius: 28,
            padding: "36px 36px 40px",
            background: "linear-gradient(135deg, rgba(8,208,112,0.10) 0%, rgba(6,12,36,0.95) 55%, rgba(4,8,20,1) 100%)",
            border: `1px solid ${GREEN_20}`,
            boxShadow: `0 18px 60px rgba(8,208,112,0.08)`,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1.35fr 0.95fr", gap: 24, alignItems: "end" }}>
            {/* Left */}
            <div>
              <div style={{ display: "inline-block", padding: "6px 12px", borderRadius: 999, background: GREEN_08, border: `1px solid ${GREEN_13}`, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 18, fontFamily: "'Geologica', Helvetica", fontWeight: 400 }}>
                {t.eyebrow}
              </div>
              <h1 style={{ fontSize: "clamp(28px,4vw,48px)", lineHeight: 1.05, fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", fontFamily: "'Geologica', Helvetica", marginBottom: 18, maxWidth: 720 }}>
                {t.heroTitle}
              </h1>
              <p style={{ fontSize: 18, lineHeight: 1.5, color: "rgba(255,255,255,0.72)", fontFamily: "'Geologica', Helvetica", fontWeight: 300, marginBottom: 14, maxWidth: 680 }}>
                {t.heroLead}
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.5)", fontFamily: "'Geologica', Helvetica", fontWeight: 300, maxWidth: 640 }}>
                {t.heroNote}
              </p>
              <a
                href="https://getcher123.github.io/dialog-agent/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 24,
                  padding: "12px 22px",
                  borderRadius: 999,
                  background: GREEN_08,
                  border: `1px solid ${GREEN_30}`,
                  color: GREEN,
                  fontFamily: "'Geologica', Helvetica",
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "background 0.2s, border-color 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = GREEN_20;
                  e.currentTarget.style.borderColor = GREEN_80;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = GREEN_08;
                  e.currentTarget.style.borderColor = GREEN_30;
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.9" />
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
                  <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
                </svg>
                {t.demoLabel}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ opacity: 0.6 }}>
                  <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            {/* Right — impact card */}
            <div style={{ background: GREEN_08, border: `1px solid ${GREEN_20}`, borderRadius: 22, padding: 24 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 12, fontFamily: "'Geologica', Helvetica", fontWeight: 400 }}>
                {t.impactKicker}
              </div>
              <div style={{ fontSize: "clamp(18px,2.2vw,26px)", lineHeight: 1.25, fontWeight: 700, color: "#fff", fontFamily: "'Geologica', Helvetica", letterSpacing: "-0.025em" }}>
                <span style={{ color: ORANGE }}>{t.impactTitle1}</span>{t.impactTitle2}
                <br />
                <span style={{ color: GREEN }}>{t.impactTitle3}</span>{t.impactTitle4}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 18 }}>
                {t.mini.map((m) => (
                  <div key={m.value} style={{ background: "rgba(255,255,255,0.05)", border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 16, padding: 14 }}>
                    <div style={{ fontSize: 26, fontWeight: 750, color: GREEN, fontFamily: "'Geologica', Helvetica", letterSpacing: "-0.03em" }}>{m.value}</div>
                    <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.5, color: "rgba(255,255,255,0.6)", fontFamily: "'Geologica', Helvetica", fontWeight: 300 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── STATS ROW ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          {t.stats.map((s, i) => (
            <StatCard key={s.kicker} kicker={s.kicker} value={s.value} label={s.label} delay={i * 80} />
          ))}
        </div>

        {/* ── CHALLENGE ── */}
        <SectionWrap delay={0}>
          <SectionHead kicker={t.challengeKicker} title={t.challengeTitle} sub={t.challengeSub} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {t.challengeCards.map((c) => (
              <div key={c.kicker} style={cardBase}>
                <CardKicker>{c.kicker}</CardKicker>
                <CardTitle>{c.title}</CardTitle>
                <CardCopy>{c.copy}</CardCopy>
              </div>
            ))}
          </div>
        </SectionWrap>

        {/* ── FACTS ── */}
        <SectionWrap delay={60}>
          <SectionHead kicker={t.factsKicker} title={t.factsTitle} sub={t.factsSub} />
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 14 }}>
            {/* Bar chart card */}
            <div style={cardBase}>
              <BarChart label={t.missedCallsLabel} data={t.missedCallsData} />
            </div>
            {/* Analysis card */}
            <div style={cardDark}>
              <CardKicker>{t.factsCardKicker}</CardKicker>
              <CardTitle dark>{t.factsCardTitle}</CardTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
                {t.factsBullets.map((b) => (
                  <div key={b} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <Dot />
                    <span style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.75)", fontFamily: "'Geologica', Helvetica", fontWeight: 300 }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionWrap>

        {/* ── SOLUTION ── */}
        <SectionWrap delay={80}>
          <SectionHead kicker={t.solutionKicker} title={t.solutionTitle} sub={t.solutionSub} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 16 }}>
            {t.solutionCards.map((c) => (
              <div key={c.kicker} style={cardBase}>
                <CardKicker>{c.kicker}</CardKicker>
                <CardTitle>{c.title}</CardTitle>
                <CardCopy>{c.copy}</CardCopy>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {t.proofChips.map((chip) => (
              <div key={chip} style={{ padding: "8px 14px", borderRadius: 999, background: GREEN_06, border: `1px solid ${GREEN_13}`, fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: "'Geologica', Helvetica", fontWeight: 300 }}>
                {chip}
              </div>
            ))}
          </div>
        </SectionWrap>

        {/* ── PROCESS ── */}
        <SectionWrap delay={100}>
          <SectionHead kicker={t.processKicker} title={t.processTitle} sub={t.processSub} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {t.steps.map((s) => (
              <div key={s.num} style={{ ...cardBase, padding: "18px 20px" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: GREEN_08, border: `1px solid ${GREEN_20}`, color: GREEN, fontSize: 12, fontWeight: 700, fontFamily: "'Geologica', Helvetica", marginBottom: 12 }}>
                  {s.num}
                </div>
                <div style={{ fontSize: 16, lineHeight: 1.2, fontWeight: 700, color: "#fff", fontFamily: "'Geologica', Helvetica", letterSpacing: "-0.02em", marginBottom: 8 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.55, color: "rgba(255,255,255,0.5)", fontFamily: "'Geologica', Helvetica", fontWeight: 300 }}>
                  {s.copy}
                </div>
              </div>
            ))}
          </div>
        </SectionWrap>

        {/* ── RESULTS ── */}
        <SectionWrap delay={120}>
          <SectionHead kicker={t.resultsKicker} title={t.resultsTitle} sub={t.resultsSub} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {t.resultCards.map((c) => (
              <div key={c.kicker} style={cardDark}>
                <CardKicker>{c.kicker}</CardKicker>
                <CardTitle dark>{c.title}</CardTitle>
                <CardCopy dark>{c.copy}</CardCopy>
              </div>
            ))}
          </div>
        </SectionWrap>

        {/* ── ECONOMICS ── */}
        <SectionWrap delay={140}>
          <SectionHead kicker={t.econKicker} title={t.econTitle} sub={t.econSub} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 0.95fr", gap: 14 }}>
            {/* Formula card */}
            <div style={cardBase}>
              <CardKicker>{t.econCalcKicker}</CardKicker>
              <div style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.8)", fontFamily: "'Geologica', Helvetica", fontWeight: 300 }}>
                {t.econFormula.map((line, i) => {
                  const last = i === t.econFormula.length - 1;
                  const prefix = last
                    ? <span style={{ color: GREEN, marginRight: 8 }}>=</span>
                    : i > 0
                    ? <span style={{ color: "rgba(255,255,255,0.35)", marginRight: 8 }}>×</span>
                    : null;
                  return (
                    <div key={i}>
                      {prefix}
                      <strong style={{ color: "#fff", fontWeight: 700 }}>{line.bold}</strong>
                      <span>{line.text}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 16, fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.45)", fontFamily: "'Geologica', Helvetica", fontWeight: 300, borderTop: `1px solid rgba(255,255,255,0.07)`, paddingTop: 14 }}>
                {t.econFootnote}
              </div>
            </div>
            {/* Money card */}
            <div style={{ ...cardDark, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: ORANGE, marginBottom: 10, fontFamily: "'Geologica', Helvetica", fontWeight: 500 }}>
                  {t.econResultKicker}
                </div>
                <div style={{ fontSize: "clamp(28px,3.5vw,42px)", lineHeight: 1, fontWeight: 760, letterSpacing: "-0.05em", color: GREEN, fontFamily: "'Geologica', Helvetica", marginBottom: 16 }}>
                  {t.econResultValue}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.72)", fontFamily: "'Geologica', Helvetica", fontWeight: 300 }}>
                  {t.econResultCopy1}
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.55, color: "rgba(255,255,255,0.45)", fontFamily: "'Geologica', Helvetica", fontWeight: 300 }}>
                  {t.econResultCopy2}
                </div>
              </div>
            </div>
          </div>
        </SectionWrap>

      </main>
    </div>
  );
}
