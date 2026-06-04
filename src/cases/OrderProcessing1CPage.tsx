import { useEffect, useRef, useState } from "react";

const GREEN = "rgba(8, 208, 112, 0.95)";
const GREEN_80 = "rgba(8, 208, 112, 0.8)";
const GREEN_08 = "rgba(8, 208, 112, 0.08)";
const GREEN_06 = "rgba(8, 208, 112, 0.06)";
const GREEN_20 = "rgba(8, 208, 112, 0.20)";
const GREEN_13 = "rgba(8, 208, 112, 0.13)";
const GREEN_90 = "rgba(8, 208, 112, 0.90)";
const RED_10 = "rgba(255, 80, 80, 0.10)";
const RED_30 = "rgba(255, 80, 80, 0.30)";
const GOLD = "rgba(250, 200, 60, 0.95)";

const content = {
  ru: {
    pageTitle: "Умный конвейер закупок — Кейс | AIHUB Works",
    backToCases: "Назад к кейсам",
    brand: "AIHUB Works",
    languageLabel: "Язык",
    caseStudy: "Кейс",
    heroTitle: "Умный конвейер закупок: от хаоса прайсов к готовому заказу за 10 минут",
    heroLead: "Помогаем закупкам и продажам быстрее обрабатывать сложные заказы с большим количеством SKU, меньше ошибаться в номенклатуре и не терять клиентов из-за ручной рутины.",
    heroBody: "NDA — крупный импортёр ветеринарных препаратов. 500+ позиций в каждом заказе. 20+ поставщиков из Китая, Европы и России. До внедрения: 10 000+ строк сравнений вручную каждый раз.",
    tags: ["Опт и дистрибуция", "Ветеринарные препараты", "Автоматизация закупок"],
    kpis: [
      { value: "×3", label: "Рост пропускной способности отдела" },
      { value: "10 мин", label: "Цикл обработки заказа (было: весь день)" },
      { value: "98%", label: "Точность распознавания на сканах" },
      { value: "70 дней", label: "Срок внедрения" },
    ],
    challengeTitle: "Проблема",
    challengeCallout: "500+ позиций × 20+ поставщиков из трёх стран = 10 000+ строк сравнений каждый раз вручную",
    challenge: [
      "500+ товарных позиций в каждом заказе нужно было сверить с прайсами 20+ поставщиков — вручную, по-позиционно, каждый раз заново.",
      "Поставщики из Китая, Европы и России присылали прайсы на разных языках в несовместимых форматах: PDF-сканы, Excel, Word, email-вложения.",
      "Одна позиция встречалась под разными названиями: «Амоксициллин 10%» у одного поставщика — это «Amoxicillin sol. 100mg/ml» у другого. Сверить без ручной проверки невозможно.",
      "Байер открывал 20+ прайсов параллельно и строил сводную таблицу сравнения вручную по каждому заказу. Один заказ — весь рабочий день.",
    ],
    processTitle: "Как это работает",
    processSubtitle: "От входящего документа до заказа в 1С — автоматически",
    process: [
      { icon: "📨", title: "Входящий документ", sub: "PDF / Excel / скан через Telegram или Email" },
      { icon: "👁️", title: "Распознавание", sub: "Текст и структура через OCR + Document AI" },
      { icon: "🧠", title: "Сопоставление", sub: "Привязка к номенклатуре через LLM" },
      { icon: "⚖️", title: "Авто-тендер", sub: "20+ поставщиков одновременно" },
      { icon: "🔍", title: "Проверка", sub: "Спорные позиции с Audit Trail" },
      { icon: "✅", title: "Выгрузка в 1С", sub: "Один клик через REST API" },
    ],
    layersTitle: "6 слоёв автоматизации вместо ручного труда",
    layers: [
      { tag: "СЛОЙ 1", title: "OCR + Document AI", body: "«Видит» любой документ: скан, PDF, таблицу. Распознаёт текст и структуру даже при плохом качестве скана.", alt: "↪ Tesseract, PaddleOCR, Yandex Vision" },
      { tag: "СЛОЙ 2", title: "LLM — языковая модель", body: "Понимает смысл: «Амоксициллин 10%» и «Amoxicillin sol.» — одна позиция. Работает с опечатками и сокращениями.", alt: "↪ GigaChat (Сбер), YandexGPT, LLaMA" },
      { tag: "СЛОЙ 3", title: "Авто-тендерный движок", body: "По каждой позиции опрашивает всех 20+ поставщиков одновременно, сравнивает цены и сроки, выбирает оптимальный вариант.", alt: "↪ Python, собственная логика ранжирования" },
      { tag: "СЛОЙ 4", title: "Audit Trail", body: "Каждое решение ИИ задокументировано: откуда взяли позицию, почему выбрали поставщика, что было альтернативой.", alt: "↪ Собственная БД логов, интеграция с ERP" },
      { tag: "СЛОЙ 5", title: "REST API → 1С", body: "Подтверждённые заказы выгружаются в 1С в один клик — никакого ручного ввода данных.", alt: "↪ SAP, Bitrix, любая система с API" },
      { tag: "СЛОЙ 6", title: "Telegram-бот + Email", body: "Менеджер пересылает документ в Telegram или на почту. Никаких новых интерфейсов — работа там, где привыкли.", alt: "↪ WhatsApp, веб-форма, корп. портал" },
    ],
    screenshotsTitle: "Система в работе",
    screenshots: [
      { file: "screenshot-2.png", figNum: "Рис. 2", caption: "Система нашла позицию в 1С по CAS-номеру и автоматически подобрала донора из каталога поставщиков" },
      { file: "screenshot-3.png", figNum: "Рис. 3", caption: "CAS в документе отсутствует: система самостоятельно обогатила данные через GPT и только после этого выполнила запрос в 1С и к поставщикам" },
    ],
    beforeAfterTitle: "Бизнес-результат",
    beforeAfterSubtitle: "Тот же отдел. В три раза больше заказов.",
    beforeTitle: "До автоматизации",
    afterTitle: "После внедрения",
    beforeItems: [
      "1 заказ (500+ позиций) — весь рабочий день",
      "Ручная сверка 20+ прайсов из трёх стран",
      "Ошибки из-за усталости и человеческого фактора",
      "Объём ограничен пропускной способностью команды",
    ],
    afterItems: [
      "1 заказ — 10 минут, точность 98%",
      "Авто-тендер по всем поставщикам одновременно",
      "Каждое решение задокументировано и прозрачно",
      "Тот же отдел обрабатывает в ×3 больше заказов",
    ],
    roiTitle: "Посчитайте эффект для своего бизнеса",
    roiSubtitle: "Введите параметры своих процессов — получите расчёт экономии от автоматизации",
    roiPosLabel: "Позиций в среднем заказе",
    roiSuppLabel: "Поставщиков для сравнения",
    roiOrdersLabel: "Заказов в месяц",
    roiHoursLabel: "Часов на обработку одного заказа (сейчас)",
    roiRateLabel: "Стоимость часа сотрудника, ₽",
    roiDefaultRate: 1200,
    roiResultTitle: "Расчёт эффекта",
    roiR1: "Часов на закупки в месяц сейчас",
    roiR2: "Стоимость этих часов в месяц",
    roiR3: "Строк сравнений в месяц (вручную)",
    roiR4: "После автоматизации: часов/мес",
    roiR5: "Экономия в год",
    roiCta: "Получить расчёт внедрения →",
    roiNote: "* Расчёт приблизительный. Реальный эффект зависит от специфики процессов.",
    featuresTitle: "Ключевые функции",
    features: [
      "Приём документов в любом формате",
      "98% OCR на сканах и рукописных пометках",
      "LLM-извлечение товарных позиций",
      "Семантическое сопоставление с номенклатурой",
      "Авто-тендер по 20+ поставщикам",
      "Скоринг уверенности и Audit Trail",
      "Автогенерация коммерческих предложений",
      "Прямая выгрузка в 1С по REST API",
      "Полный журнал обработки",
    ],
    technology: "Технологии",
    technologyValue: "Python · Azure Document Intelligence · OpenAI API · 1С odata REST API · векторная база данных",
    techNote: "У каждого компонента есть российский или open-source аналог — система не зависит от западных облаков.",
    timeline: "Срок",
    timelineValue: "70 рабочих дней",
  },
  en: {
    pageTitle: "Smart Procurement Pipeline — Case Study | AIHUB Works",
    backToCases: "Back to cases",
    brand: "AIHUB Works",
    languageLabel: "Language",
    caseStudy: "Case Study",
    heroTitle: "Smart procurement pipeline: from price-list chaos to a ready order in 10 minutes",
    heroLead: "We help procurement and sales teams handle complex high-SKU orders faster, reduce nomenclature errors, and stop losing clients to manual routine.",
    heroBody: "NDA — a major veterinary drug importer. 500+ line items per order. 20+ suppliers across China, Europe, and Russia. Before automation: 10,000+ manual comparison rows every single time.",
    tags: ["Wholesale / Distribution", "Veterinary drugs", "Procurement automation"],
    kpis: [
      { value: "×3", label: "Department throughput increase" },
      { value: "10 min", label: "Order processing cycle (was: full day)" },
      { value: "98%", label: "OCR accuracy on scanned docs" },
      { value: "70 days", label: "Implementation timeline" },
    ],
    challengeTitle: "The challenge",
    challengeCallout: "500+ items × 20+ suppliers from 3 countries = 10,000+ comparison rows every time — manually",
    challenge: [
      "500+ line items per order had to be cross-checked against 20+ supplier price lists — manually, line by line, every time.",
      "Suppliers from China, Europe, and Russia sent price lists in different languages and incompatible formats: scanned PDFs, Excel files, Word documents, email attachments.",
      "The same product appeared under different names across suppliers: 'Amoxicillin 10%' from one is 'Amoxicillin sol. 100mg/ml' from another. Matching them required manual verification every time.",
      "A buyer would open 20+ price lists simultaneously and build a comparison table from scratch for every order. One order = one full working day.",
    ],
    processTitle: "How it works",
    processSubtitle: "From incoming document to 1C order — automatically",
    process: [
      { icon: "📨", title: "Incoming document", sub: "PDF / Excel / scan via Telegram or Email" },
      { icon: "👁️", title: "Recognition", sub: "Text and structure via OCR + Document AI" },
      { icon: "🧠", title: "Matching", sub: "Catalogue binding via LLM" },
      { icon: "⚖️", title: "Auto-tender", sub: "20+ suppliers simultaneously" },
      { icon: "🔍", title: "Review", sub: "Disputed items with Audit Trail" },
      { icon: "✅", title: "Export to 1C", sub: "One click via REST API" },
    ],
    layersTitle: "6 automation layers replacing manual labour",
    layers: [
      { tag: "LAYER 1", title: "OCR + Document AI", body: "Reads any document — scan, PDF, table. Recognizes text and structure even with low-quality scans.", alt: "↪ Tesseract, PaddleOCR, Yandex Vision" },
      { tag: "LAYER 2", title: "LLM understanding", body: "Understands meaning — 'Amoxicillin 10%' and 'Amoxicillin sol.' are the same item. Handles typos and abbreviations.", alt: "↪ GigaChat (Sber), YandexGPT, LLaMA" },
      { tag: "LAYER 3", title: "Auto-tender engine", body: "Queries all 20+ suppliers simultaneously for each item, compares prices and lead times, selects the optimal option.", alt: "↪ Python, custom ranking logic" },
      { tag: "LAYER 4", title: "Audit Trail", body: "Every AI decision is documented: source of the line item, why a supplier was chosen, what the alternatives were.", alt: "↪ Custom log DB, ERP integration" },
      { tag: "LAYER 5", title: "REST API → 1C", body: "Confirmed orders exported to 1C in one click — no manual data entry. Works with SAP, Bitrix, or any API-enabled ERP.", alt: "↪ SAP, Bitrix, any API-enabled system" },
      { tag: "LAYER 6", title: "Telegram + Email intake", body: "Manager forwards the document via Telegram or email. No new interfaces — work where you're used to.", alt: "↪ WhatsApp, web form, corporate portal" },
    ],
    screenshotsTitle: "System in action",
    screenshots: [
      { file: "screenshot-2.png", figNum: "Fig. 2", caption: "System found the item in 1C by CAS number and automatically matched a donor from the supplier catalogue" },
      { file: "screenshot-3.png", figNum: "Fig. 3", caption: "CAS not found in document: system independently enriched data via GPT, then queried 1C and suppliers" },
    ],
    beforeAfterTitle: "Business results",
    beforeAfterSubtitle: "Same team. Three times more orders.",
    beforeTitle: "Before",
    afterTitle: "After",
    beforeItems: [
      "1 order (500+ items) = full working day",
      "Manual cross-check of 20+ price lists from 3 countries",
      "Errors from fatigue and human factor",
      "Volume capped by team capacity",
    ],
    afterItems: [
      "1 order = 10 minutes, 98% accuracy",
      "Auto-tender across all suppliers simultaneously",
      "Every decision documented and transparent",
      "Same team handles 3× more orders",
    ],
    roiTitle: "Calculate the ROI for your business",
    roiSubtitle: "Enter your process parameters — get an estimate of your automation savings",
    roiPosLabel: "Line items per order (avg)",
    roiSuppLabel: "Suppliers to compare",
    roiOrdersLabel: "Orders per month",
    roiHoursLabel: "Hours to process one order (currently)",
    roiRateLabel: "Employee hourly rate, $",
    roiDefaultRate: 50,
    roiResultTitle: "Automation impact estimate",
    roiR1: "Hours on procurement per month now",
    roiR2: "Cost of those hours (per month)",
    roiR3: "Manual comparison rows per month",
    roiR4: "After automation: hours/month",
    roiR5: "Annual savings",
    roiCta: "Get an implementation estimate →",
    roiNote: "* Estimate only. Actual savings depend on your specific processes.",
    featuresTitle: "Key features",
    features: [
      "Multi-format document intake",
      "98% OCR on scans and handwriting",
      "LLM line-item extraction",
      "Semantic catalogue matching",
      "Auto-tender across 20+ suppliers",
      "Confidence scoring and Audit Trail",
      "Automated quote generation",
      "Direct 1C sync via REST API",
      "Full processing audit log",
    ],
    technology: "Technology",
    technologyValue: "Python · Azure Document Intelligence · OpenAI API · 1C odata REST API · vector database",
    techNote: "Every component has a Russian or open-source alternative — the system is independent of Western cloud vendors.",
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
          background: `linear-gradient(129deg, ${GREEN_80} 0%, transparent 70%)`,
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

interface LayerCardProps { tag: string; title: string; body: string; alt: string; delay?: number; }

function LayerCard({ tag, title, body, alt, delay = 0 }: LayerCardProps) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="relative rounded-[16px] p-5 bg-[#060c2499] backdrop-blur-[10px] flex flex-col gap-2"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms`,
        border: `1px solid ${GREEN_13}`,
        boxShadow: `inset 0 0 30px ${GREEN_06}`,
      }}
    >
      <span
        className="self-start px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-widest [font-family:'Geologica',Helvetica]"
        style={{ background: GREEN_08, color: GREEN, border: `1px solid ${GREEN_20}` }}
      >
        {tag}
      </span>
      <h3 className="[font-family:'Geologica',Helvetica] font-semibold text-white text-sm sm:text-base">
        {title}
      </h3>
      <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-sm leading-relaxed flex-1">
        {body}
      </p>
      <p className="[font-family:'Geologica',Helvetica] font-light text-white/30 text-xs mt-1">
        {alt}
      </p>
    </div>
  );
}

interface ProcessFlowProps {
  title: string;
  subtitle: string;
  steps: readonly { readonly icon: string; readonly title: string; readonly sub: string }[];
}

function ProcessFlow({ title, subtitle, steps }: ProcessFlowProps) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="relative rounded-[24px] bg-[#060c2499] backdrop-blur-[10px] p-6 sm:p-8"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1)",
        boxShadow: `inset 0 0 40px ${GREEN_06}`,
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
      <h2 className="[font-family:'Geologica',Helvetica] font-semibold text-white text-xl sm:text-2xl mb-1">
        {title}
      </h2>
      <p className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-sm mb-6">
        {subtitle}
      </p>
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-0 overflow-x-auto pb-1">
        {steps.map((step, i) => (
          <div key={step.title} className="flex sm:flex-1 items-center gap-3 sm:gap-0 w-full sm:w-auto">
            <div className="flex flex-row sm:flex-col items-center sm:items-center gap-3 sm:gap-2 sm:w-full sm:text-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                style={{ background: GREEN_08, border: `1px solid ${GREEN_20}` }}
              >
                {step.icon}
              </div>
              <div className="flex flex-col sm:items-center gap-0.5">
                <span className="[font-family:'Geologica',Helvetica] font-medium text-white text-xs sm:text-[11px] leading-snug sm:text-center">
                  {step.title}
                </span>
                <span className="[font-family:'Geologica',Helvetica] font-light text-white/35 text-[10px] leading-snug sm:text-center">
                  {step.sub}
                </span>
              </div>
            </div>
            {i < steps.length - 1 && (
              <svg
                className="shrink-0 hidden sm:block mx-1 mt-3"
                style={{ color: GREEN_20 }}
                width="14" height="14" viewBox="0 0 14 14" fill="none"
              >
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface ScreenshotCardProps { src: string; caption: string; figNum: string; delay?: number; }

function ScreenshotCard({ src, caption, figNum, delay = 0 }: ScreenshotCardProps) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="relative rounded-[20px] overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
        border: `1px solid ${GREEN_13}`,
      }}
    >
      <div className="w-full bg-[#0a1020] overflow-hidden">
        <img src={src} alt={caption} className="w-full h-auto block" style={{ maxHeight: "420px", objectFit: "cover", objectPosition: "top" }} />
      </div>
      <div className="px-5 py-4 bg-[#060c24e6]" style={{ borderTop: `1px solid ${GREEN_13}` }}>
        <span className="[font-family:'Geologica',Helvetica] font-medium text-[11px] uppercase tracking-widest mr-3" style={{ color: GREEN }}>
          {figNum}
        </span>
        <span className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-sm leading-relaxed">
          {caption}
        </span>
      </div>
    </div>
  );
}

interface BeforeAfterProps {
  title: string;
  subtitle: string;
  beforeTitle: string;
  afterTitle: string;
  beforeItems: readonly string[];
  afterItems: readonly string[];
}

function BeforeAfter({ title, subtitle, beforeTitle, afterTitle, beforeItems, afterItems }: BeforeAfterProps) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="relative rounded-[24px] bg-[#060c2499] backdrop-blur-[10px] p-6 sm:p-8"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1)",
        boxShadow: `inset 0 0 40px ${GREEN_06}`,
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
      <h2 className="[font-family:'Geologica',Helvetica] font-semibold text-white text-xl sm:text-2xl mb-1">
        {title}
      </h2>
      <p className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-sm mb-6">
        {subtitle}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-[16px] p-5" style={{ background: RED_10, border: `1px solid ${RED_30}` }}>
          <p className="[font-family:'Geologica',Helvetica] font-medium text-sm uppercase tracking-widest mb-4" style={{ color: "rgba(255,80,80,0.85)" }}>
            {beforeTitle}
          </p>
          <ul className="space-y-3">
            {beforeItems.map((item) => (
              <li key={item} className="flex items-start gap-3 [font-family:'Geologica',Helvetica] font-light text-white/70 text-sm leading-relaxed">
                <span className="mt-[3px] shrink-0 text-[13px]" style={{ color: "rgba(255,80,80,0.7)" }}>✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[16px] p-5" style={{ background: GREEN_08, border: `1px solid ${GREEN_20}` }}>
          <p className="[font-family:'Geologica',Helvetica] font-medium text-sm uppercase tracking-widest mb-4" style={{ color: GREEN }}>
            {afterTitle}
          </p>
          <ul className="space-y-3">
            {afterItems.map((item) => (
              <li key={item} className="flex items-start gap-3 [font-family:'Geologica',Helvetica] font-light text-white/70 text-sm leading-relaxed">
                <span className="mt-[3px] shrink-0 text-[13px]" style={{ color: GREEN }}>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

interface RoiCalcContent {
  roiTitle: string;
  roiSubtitle: string;
  roiPosLabel: string;
  roiSuppLabel: string;
  roiOrdersLabel: string;
  roiHoursLabel: string;
  roiRateLabel: string;
  roiDefaultRate: number;
  roiResultTitle: string;
  roiR1: string;
  roiR2: string;
  roiR3: string;
  roiR4: string;
  roiR5: string;
  roiCta: string;
  roiNote: string;
}

function RoiCalculator({ t, isRu }: { t: RoiCalcContent; isRu: boolean }) {
  const { ref, visible } = useReveal();
  const [positions, setPositions] = useState(200);
  const [suppliers, setSuppliers] = useState(8);
  const [orders, setOrders] = useState(15);
  const [hoursPerOrder, setHoursPerOrder] = useState(4);
  const [ratePerHour, setRatePerHour] = useState(t.roiDefaultRate);

  const hoursMonth = hoursPerOrder * orders;
  const costMonth = hoursMonth * ratePerHour;
  const rowsMonth = positions * suppliers * orders;
  const hoursAfter = parseFloat((orders * 10 / 60).toFixed(1));
  const saveYear = Math.max(0, (hoursMonth - hoursAfter) * ratePerHour * 12);
  const savedHours = Math.max(0, Math.round(hoursMonth - hoursAfter));

  const fmtN = (n: number) =>
    isRu ? n.toLocaleString("ru-RU") : n.toLocaleString("en-US");

  const fmtMoney = (n: number): string => {
    if (isRu) {
      if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} млн ₽`;
      if (n >= 1_000) return `${Math.round(n / 1_000)} тыс ₽`;
      return `${Math.round(n)} ₽`;
    } else {
      if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
      if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
      return `$${Math.round(n)}`;
    }
  };

  const conclusion = (() => {
    if (saveYear <= 0 || savedHours <= 0) return null;
    if (isRu) {
      const part = saveYear > 2_000_000
        ? `Окупаемость внедрения — как правило, до 3 месяцев.`
        : `Плюс рост пропускной способности в ×3 без найма.`;
      return `Автоматизация освобождает ${fmtN(savedHours)} ч/мес — это ${fmtMoney(saveYear)} в год только на ФОТ. ${part}`;
    } else {
      const part = saveYear > 100_000
        ? `Typical implementation payback: under 3 months.`
        : `Plus 3× throughput increase without additional headcount.`;
      return `Automation frees up ${fmtN(savedHours)} hrs/month — that's ${fmtMoney(saveYear)} per year in labor cost alone. ${part}`;
    }
  })();

  const inputClass = "w-full rounded-[10px] px-4 py-2.5 [font-family:'Geologica',Helvetica] font-light text-white text-sm bg-[#060c24] outline-none focus:ring-1 transition-all";

  return (
    <div
      ref={ref}
      className="relative rounded-[24px] bg-[#060c2499] backdrop-blur-[10px] p-6 sm:p-8"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1)",
        boxShadow: `inset 0 0 40px ${GREEN_06}`,
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
      <h2 className="[font-family:'Geologica',Helvetica] font-semibold text-white text-xl sm:text-2xl mb-1">
        {t.roiTitle}
      </h2>
      <p className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-sm mb-6">
        {t.roiSubtitle}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Inputs */}
        <div className="flex flex-col gap-5">

          <div className="flex flex-col gap-1.5">
            <label className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-[11px] uppercase tracking-widest">
              {t.roiPosLabel}
            </label>
            <input
              type="number" min={10} max={2000} value={positions}
              onChange={(e) => setPositions(Math.max(1, parseInt(e.target.value) || 0))}
              className={inputClass}
              style={{ border: `1px solid ${GREEN_13}`, "--tw-ring-color": GREEN } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-[11px] uppercase tracking-widest flex justify-between">
              <span>{t.roiSuppLabel}</span>
              <span style={{ color: GREEN, fontFamily: "'Geologica',Helvetica", fontWeight: 700 }}>{suppliers}</span>
            </label>
            <input
              type="range" min={1} max={30} value={suppliers}
              onChange={(e) => setSuppliers(parseInt(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: GREEN, background: `linear-gradient(90deg, ${GREEN} ${((suppliers - 1) / 29 * 100).toFixed(1)}%, rgba(8,208,112,0.15) ${((suppliers - 1) / 29 * 100).toFixed(1)}%)` }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-[11px] uppercase tracking-widest">
              {t.roiOrdersLabel}
            </label>
            <input
              type="number" min={1} max={500} value={orders}
              onChange={(e) => setOrders(Math.max(1, parseInt(e.target.value) || 0))}
              className={inputClass}
              style={{ border: `1px solid ${GREEN_13}`, "--tw-ring-color": GREEN } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-[11px] uppercase tracking-widest flex justify-between">
              <span>{t.roiHoursLabel}</span>
              <span style={{ color: GREEN, fontFamily: "'Geologica',Helvetica", fontWeight: 700 }}>{hoursPerOrder}</span>
            </label>
            <input
              type="range" min={0.5} max={12} step={0.5} value={hoursPerOrder}
              onChange={(e) => setHoursPerOrder(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: GREEN, background: `linear-gradient(90deg, ${GREEN} ${((hoursPerOrder - 0.5) / 11.5 * 100).toFixed(1)}%, rgba(8,208,112,0.15) ${((hoursPerOrder - 0.5) / 11.5 * 100).toFixed(1)}%)` }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-[11px] uppercase tracking-widest">
              {t.roiRateLabel}
            </label>
            <input
              type="number" min={100} max={50000} step={isRu ? 100 : 5} value={ratePerHour}
              onChange={(e) => setRatePerHour(Math.max(1, parseInt(e.target.value) || 0))}
              className={inputClass}
              style={{ border: `1px solid ${GREEN_13}`, "--tw-ring-color": GREEN } as React.CSSProperties}
            />
          </div>

        </div>

        {/* Results */}
        <div className="flex flex-col">
          <p className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-[11px] uppercase tracking-widest mb-4">
            {t.roiResultTitle}
          </p>
          <div className="flex flex-col gap-0 flex-1" style={{ borderTop: `1px solid rgba(255,255,255,0.06)` }}>
            {[
              { label: t.roiR1, value: `${fmtN(Math.round(hoursMonth))} ч`, color: GREEN },
              { label: t.roiR2, value: fmtMoney(costMonth), color: GOLD },
              { label: t.roiR3, value: fmtN(rowsMonth), color: GREEN },
              { label: t.roiR4, value: `${hoursAfter} ч`, color: GREEN },
              { label: t.roiR5, value: fmtMoney(saveYear), color: GREEN, big: true },
            ].map(({ label, value, color, big }) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 py-3"
                style={{ borderBottom: `1px solid rgba(255,255,255,0.06)` }}
              >
                <span className="[font-family:'Geologica',Helvetica] font-light text-white/50 text-xs sm:text-sm leading-snug">
                  {label}
                </span>
                <span
                  className="[font-family:'Geologica',Helvetica] font-bold shrink-0"
                  style={{ color, fontSize: big ? "clamp(20px,3vw,28px)" : "clamp(14px,2vw,16px)" }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {conclusion && (
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/50 text-xs leading-relaxed mt-4">
              {conclusion}
            </p>
          )}

          <button
            type="button"
            className="mt-5 w-full px-5 py-3 rounded-[12px] [font-family:'Geologica',Helvetica] font-medium text-sm uppercase tracking-widest transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{ background: GREEN_08, border: `1px solid ${GREEN_20}`, color: GREEN }}
            onClick={() => window.location.href = `${import.meta.env.BASE_URL}#contact`}
          >
            {t.roiCta}
          </button>
          <p className="[font-family:'Geologica',Helvetica] font-light text-white/25 text-[11px] mt-3">
            {t.roiNote}
          </p>
        </div>

      </div>
    </div>
  );
}

export function OrderProcessing1CPage() {
  const base = import.meta.env.BASE_URL;
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
            style={{ fontSize: "clamp(24px,4.5vw,50px)" }}
          >
            {t.heroTitle}
          </h1>
          <p
            className="[font-family:'Geologica',Helvetica] font-semibold mb-2 max-w-[720px]"
            style={{ fontSize: "clamp(15px,2vw,18px)", color: GREEN_90 }}
          >
            {t.heroLead}
          </p>
          <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-base sm:text-lg leading-relaxed mb-6 max-w-[720px]">
            {t.heroBody}
          </p>
          <div className="flex flex-wrap gap-2">
            {t.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {t.kpis.map((item, index) => (
            <KpiCard key={item.label} value={item.value} label={item.label} delay={index * 80} />
          ))}
        </div>

        {/* Challenge */}
        <Section title={t.challengeTitle}>
          <div
            className="rounded-[14px] px-5 py-4 mb-5 [font-family:'Geologica',Helvetica] font-semibold text-sm sm:text-base leading-snug text-center"
            style={{ background: GREEN_08, border: `1px solid ${GREEN_20}`, color: GREEN_90 }}
          >
            {t.challengeCallout}
          </div>
          <ul className="space-y-3">
            {t.challenge.map((item) => <BulletItem key={item}>{item}</BulletItem>)}
          </ul>
        </Section>

        {/* Process flow */}
        <ProcessFlow title={t.processTitle} subtitle={t.processSubtitle} steps={t.process} />

        {/* 6 Layers */}
        <Section title={t.layersTitle}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {t.layers.map((layer, i) => (
              <LayerCard key={layer.tag} tag={layer.tag} title={layer.title} body={layer.body} alt={layer.alt} delay={i * 50} />
            ))}
          </div>
        </Section>

        {/* Screenshots */}
        <Section title={t.screenshotsTitle}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {t.screenshots.map((s, i) => (
              <ScreenshotCard
                key={s.file}
                src={`${base}cases/1c/${s.file}`}
                figNum={s.figNum}
                caption={s.caption}
                delay={i * 100}
              />
            ))}
          </div>
        </Section>

        {/* Before / After */}
        <BeforeAfter
          title={t.beforeAfterTitle}
          subtitle={t.beforeAfterSubtitle}
          beforeTitle={t.beforeTitle}
          afterTitle={t.afterTitle}
          beforeItems={t.beforeItems}
          afterItems={t.afterItems}
        />

        {/* ROI Calculator */}
        <RoiCalculator key={locale} t={t} isRu={locale === "ru"} />

        {/* Key features */}
        <Section title={t.featuresTitle}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {t.features.map((item) => <FeaturePill key={item}>{item}</FeaturePill>)}
          </div>
        </Section>

        {/* Tech & Timeline */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-4 pb-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex-1">
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/40 text-xs uppercase tracking-widest mb-1.5">{t.technology}</p>
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/60 text-sm leading-relaxed mb-2">{t.technologyValue}</p>
            <p className="[font-family:'Geologica',Helvetica] font-light text-white/30 text-xs leading-relaxed">{t.techNote}</p>
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
