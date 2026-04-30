import { useEffect, useRef, useState } from "react";

const GREEN = "rgba(8, 208, 112, 0.95)";
const GREEN_80 = "rgba(8, 208, 112, 0.8)";
const GREEN_08 = "rgba(8, 208, 112, 0.08)";
const GREEN_06 = "rgba(8, 208, 112, 0.06)";
const GREEN_20 = "rgba(8, 208, 112, 0.20)";
const GREEN_13 = "rgba(8, 208, 112, 0.13)";
const GREEN_90 = "rgba(8, 208, 112, 0.90)";

const content = {
  ru: {
    pageTitle: "AI-обработка заказов с интеграцией 1С — Кейс | AIHUB Works",
    backToCases: "Назад к кейсам",
    brand: "AIHUB Works",
    languageLabel: "Язык",
    caseStudy: "Кейс",
    heroTitle: "AI-система обработки заказов с интеграцией в 1С",
    heroLead:
      "Автоматизируем обработку входящих заказов, чтобы finance и ops-команды работали быстрее, точнее и с полным audit trail, без изменений в формате документов со стороны партнеров.",
    heroBody:
      "Система сама распознает входящий документ, сверяет позиции, проводит тендер по списку доверенных поставщиков и подставляет в итоговое коммерческое предложение наиболее выгодный вариант.",
    tags: ["Опт и дистрибуция", "Обработка заказов", "Автоматизация 1С"],
    kpis: [
      { value: "1 день → 10 мин", label: "От заказа клиента до КП" },
      { value: "15-40 сек", label: "Обработка одного документа" },
      { value: "98%", label: "Точность OCR на сканах" },
      { value: "70 дней", label: "Срок внедрения" },
    ],
    challengeTitle: "Проблема",
    challenge: [
      "Заказы поступали в разных форматах: сканы PDF, Excel-таблицы, Word-документы. Единого шаблона со стороны клиентов не было.",
      "Finance и ops-команды вручную разбирали входящие заявки, переносили строки в систему и тратили на это до полного рабочего дня, прежде чем можно было собрать корректное КП.",
      "Наименования у клиентов часто не совпадали с внутренней номенклатурой и прайсами поставщиков, из-за чего возникали задержки, уточнения и ошибки при подборе позиции.",
      "По каждой заявке нужно было отдельно сверять цены и наличие у доверенных поставщиков, фактически проводя мини-тендер вручную.",
      "Не хватало прозрачности: при расхождениях было сложно быстро понять, что именно было в исходном документе, как система интерпретировала строку и почему в КП попала конкретная позиция.",
    ],
    builtTitle: "Что мы внедрили",
    built: [
      "Универсальный прием документов через email, Telegram-бота или веб-форму с поддержкой PDF, XLSX, XLS и DOCX, автоматическим определением формата и передачей в нужный сценарий обработки.",
      "OCR-модуль на Azure Document Intelligence для распознавания сканов, рукописных пометок, печатей и таблиц с точностью до 98%.",
      "LLM-слой извлечения данных, который достает из неструктурированного текста наименование, артикул, количество, единицу измерения и другие параметры позиции, даже если в документе есть сокращения, опечатки и нестандартные обозначения.",
      "Семантическое сопоставление на базе векторных эмбеддингов, которое связывает клиентские формулировки с внутренней номенклатурой и каталогами поставщиков, даже если отличаются названия, бренды или единицы измерения.",
      "Автоматический тендер по списку доверенных поставщиков: система сравнивает подходящие позиции, цены, наличие и другие заданные условия, а затем выбирает наиболее выгодный вариант для включения в КП.",
      "Скоринг уверенности и полный audit trail по каждой строке: видно исходный фрагмент документа, результат распознавания, логику сопоставления, варианты поставщиков и причину выбора итоговой позиции.",
      "Автоматическое формирование коммерческого предложения в фирменном шаблоне компании с уже подставленными лучшими позициями, ценами и сроками.",
      "Прямая загрузка подтвержденных заказов и связанных данных в 1С через odata REST API без ручного ввода.",
    ],
    resultsTitle: "Результат",
    results: [
      "Цикл от получения заказа клиента до готового коммерческого предложения сократился с одного дня до 10 минут.",
      "Один документ теперь проходит полный цикл за 15-40 секунд вне зависимости от формата и сложности.",
      "Finance и ops-команды перестали тратить время на ручной разбор, сверку и перенос строк между документами, прайсами и 1С.",
      "Спорные позиции не теряются в процессе: система выносит их на проверку с полным контекстом, а не пропускает молча.",
      "По каждой позиции сохраняется прозрачная история обработки, поэтому решение можно быстро проверить и объяснить внутри команды или партнеру.",
    ],
    featuresTitle: "Ключевые функции",
    features: [
      "Прием документов в разных форматах",
      "98% OCR на сканах и рукописных пометках",
      "LLM-извлечение товарных позиций",
      "Семантическое сопоставление с номенклатурой",
      "Автотендер по доверенным поставщикам",
      "Скоринг уверенности и audit trail",
      "Автогенерация коммерческих предложений",
      "Прямая загрузка в 1С по REST API",
      "Полный журнал обработки",
    ],
    technology: "Технологии",
    technologyValue:
      "Python · Azure Document Intelligence · OpenAI API · 1С odata REST API · векторная база данных",
    timeline: "Срок",
    timelineValue: "70 рабочих дней",
  },
  en: {
    pageTitle: "AI Order Processing with 1C Integration — Case Study | AIHUB Works",
    backToCases: "Back to cases",
    brand: "AIHUB Works",
    languageLabel: "Language",
    caseStudy: "Case Study",
    heroTitle: "AI order processing system with 1C integration",
    heroLead:
      "3–4 hours of manual data entry per day, down to 20 minutes — without changing how suppliers send orders.",
    heroBody:
      "Intelligent document intake, line-item extraction, and automated ERP sync for a wholesale distributor",
    tags: ["Wholesale / Distribution", "Document intelligence", "ERP automation"],
    kpis: [
      { value: "3–4 hrs → 20 min", label: "Daily order processing time" },
      { value: "15–40 sec", label: "Per-document processing time" },
      { value: "98%", label: "OCR accuracy on scanned docs" },
      { value: "70 days", label: "Implementation time" },
    ],
    challengeTitle: "The challenge",
    challenge: [
      "Incoming purchase orders arrived in incompatible formats — scanned PDFs, Excel tables, Word documents — with no consistent structure across buyers",
      "Managers manually re-keyed every line item into 1C, spending 3–4 hours per day on a task that added no value and introduced regular errors in SKUs and quantities",
      "Product names used by buyers rarely matched internal catalogue terminology, causing delays, back-and-forth clarifications, and occasional shipment conflicts",
      "No audit trail: when errors occurred, there was no record of what the original document said versus what was entered",
      "Handwritten annotations, stamps, and non-standard abbreviations were processed inconsistently or missed entirely",
    ],
    builtTitle: "What we built",
    built: [
      "Universal document intake via email, Telegram bot, or web form — supporting PDF, XLSX, XLS, and DOCX with automatic format detection and routing to the correct parser",
      "OCR module (Azure Document Intelligence) handling scanned documents, handwritten annotations, stamps, and printed tables at 98% accuracy",
      "LLM extraction layer that pulls product name, SKU, quantity, unit of measure, and price from unstructured text — including abbreviations, typos, and non-standard notation",
      "Semantic matching engine using vector embeddings to map buyer terminology to internal catalogue entries — finds the right product even when names, brands, or units differ",
      "Confidence scoring on every line item: low-confidence matches are flagged for manager review with full context — what the system read, what it matched, and why it's uncertain",
      "Automated quote generation in the company's branded template with live prices, stock levels, and lead times",
      "Direct 1C sync via odata REST API — confirmed orders written to the ERP with zero manual input",
    ],
    resultsTitle: "Results",
    results: [
      "Order processing time cut from 3–4 hours to 20 minutes per day across the full incoming volume",
      "Each document processed in 15–40 seconds end-to-end, regardless of format or complexity",
      "Manual re-keying errors eliminated — SKU mismatches and quantity errors no longer reach 1C",
      "Fallback logic ensures nothing is silently wrong: unresolved items surface as tasks with context, not as gaps in the system",
    ],
    featuresTitle: "Key features",
    features: [
      "Multi-format document intake",
      "98% OCR on scans and handwriting",
      "LLM line-item extraction",
      "Semantic catalogue matching",
      "Confidence scoring and flagging",
      "Automated quote generation",
      "Direct 1C sync via REST API",
      "Full processing audit log",
    ],
    technology: "Technology",
    technologyValue:
      "Python · Azure Document Intelligence · OpenAI API · 1C odata REST API · vector database",
    timeline: "Timeline",
    timelineValue: "70 working days",
  },
} as const;

type Locale = keyof typeof content;

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

interface KpiProps { value: string; label: string; delay?: number; }

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
        style={{ fontSize: "clamp(24px,4vw,38px)", color: GREEN }}
      >
        {value}
      </span>
      <span className="[font-family:'Geologica',Helvetica] font-light text-white/70 text-sm leading-snug">
        {label}
      </span>
    </div>
  );
}

interface SectionProps { title: string; children: React.ReactNode; delay?: number; }

function Section({ title, children, delay = 0 }: SectionProps) {
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
          background: `linear-gradient(129deg, ${GREEN} 0%, transparent 70%)`,
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

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 [font-family:'Geologica',Helvetica] font-light text-white/80 text-sm sm:text-base leading-relaxed">
      <span className="mt-[5px] shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} />
      <span>{children}</span>
    </li>
  );
}

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

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="px-3 py-1 rounded-full [font-family:'Geologica',Helvetica] font-light text-xs"
      style={{ background: GREEN_08, border: `1px solid ${GREEN_20}`, color: GREEN_90 }}
    >
      {children}
    </span>
  );
}

export function OrderProcessing1CPage() {
  const base = import.meta.env.BASE_URL;
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

      <nav className="sticky top-0 z-50 bg-[#060c24cc] backdrop-blur-[12px] border-b border-white/5">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 min-h-14 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
          <a
            href={`${base}#cases`}
            className="flex items-center gap-2 [font-family:'Geologica',Helvetica] font-light text-white/60 hover:text-white text-sm transition-colors duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t.backToCases}
          </a>
          <span className="text-white/20">·</span>
          <span className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-sm">{t.brand}</span>
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
            className="[font-family:'Geologica',Helvetica] font-bold text-white leading-tight mb-3"
            style={{ fontSize: "clamp(26px,5vw,52px)" }}
          >
            {t.heroTitle}
          </h1>
          <p
            className="[font-family:'Geologica',Helvetica] font-semibold mb-2 max-w-[680px]"
            style={{ fontSize: "clamp(15px,2vw,18px)", color: GREEN_90 }}
          >
            {t.heroLead}
          </p>
          <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-base sm:text-lg leading-relaxed mb-6 max-w-[680px]">
            {t.heroBody}
          </p>
          <div className="flex flex-wrap gap-2">
            {t.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>

        {/* KPIs */}
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
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-2 pb-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-xs uppercase tracking-widest mb-1.5">{t.technology}</p>
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-sm leading-relaxed">
              {t.technologyValue}
            </p>
          </div>
          <div className="sm:border-l sm:border-white/10 sm:pl-8 shrink-0">
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-xs uppercase tracking-widest mb-1.5">{t.timeline}</p>
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-sm">{t.timelineValue}</p>
          </div>
        </div>

      </main>
    </div>
  );
}
