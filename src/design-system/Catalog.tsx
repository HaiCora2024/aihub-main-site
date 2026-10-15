import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Badge,
  Button,
  ChangeIndicator,
  CtaFrame,
  DecorativeGlow,
  FormMessage,
  GlowDot,
  Grid,
  Metric,
  NavLink,
  PageContainer,
  ProgressRing,
  Reveal,
  SectionHeading,
  SurfaceCard,
  TextField,
  TimelineStep,
} from "./components";
import type { Accent, CtaTone, DemoState } from "./components";
import {
  blocks,
  componentNames,
  palette,
  sections,
  sourceUrl,
  spaces,
  typography,
} from "./data";
import type { Block } from "./data";
import { DemoContactForm } from "./patterns";
import type { Language } from "./patterns";
import { SolutionIcon, solutionIcons } from "./SolutionIcon";

const accents: Accent[] = [
  "green",
  "blue",
  "yellow",
  "orange",
  "purple",
  "cyan",
  "red",
];
const ctaTones: CtaTone[] = ["green", "blue", "yellow", "orange"];
const groupComponents = {
  actions: ["Button", "CtaFrame", "NavLink"],
  surfaces: ["SurfaceCard", "Badge", "GlowDot", "DecorativeGlow"],
  forms: ["TextField", "FormMessage", "DemoContactForm"],
  metrics: [
    "Metric",
    "ProgressRing",
    "ChangeIndicator",
    "TimelineStep",
    "Reveal",
  ],
  composition: ["PageContainer", "Section", "SectionHeading", "Grid", "Split"],
};
type Group = keyof typeof groupComponents;
type TokenValues = Record<string, string>;
function useTokens() {
  const [tokens, setTokens] = useState<TokenValues>({});
  useEffect(() => {
    const node = document.querySelector(".aihub-theme");
    if (!node) return;
    const styles = getComputedStyle(node);
    const result: TokenValues = {};
    for (const name of Array.from(styles))
      if (name.startsWith("--aihub-"))
        result[name] = styles.getPropertyValue(name).trim();
    setTokens(result);
  }, []);
  return tokens;
}
function rgb(hex: string) {
  const normalized = hex.replace("#", "").slice(0, 6);
  if (normalized.length !== 6) return [0, 0, 0];
  return [0, 2, 4].map((offset) =>
    parseInt(normalized.slice(offset, offset + 2), 16),
  );
}
function contrast(a: string, b: string) {
  const luminance = (color: string) =>
    rgb(color)
      .map((v) => {
        const s = v / 255;
        return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      })
      .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
function Copy({
  value,
  label = "Копировать",
  compact = false,
}: {
  value: string;
  label?: string;
  compact?: boolean;
}) {
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("Скопировано");
    } catch {
      setStatus("Выделите и скопируйте текст вручную");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(""), 2200);
  };
  return (
    <span className="ds-copy-wrap">
      <button
        className={`ds-copy ${compact ? "ds-copy--compact" : ""}`}
        type="button"
        onClick={copy}
        aria-label={`${label}: ${value}`}
        title={value}
      >
        {status === "Скопировано" ? "✓" : "⧉"}
        {!compact && <span>{label}</span>}
      </button>
      <span className="ds-sr-only" role="status">
        {status}
      </span>
      {status && (
        <span className="ds-copy-feedback" aria-hidden="true">
          {status}
        </span>
      )}
    </span>
  );
}
function Token({ name, tokens }: { name: string; tokens: TokenValues }) {
  return (
    <div className="ds-token">
      <div>
        <code>{name}</code>
        <span>{tokens[name] || "…"}</span>
      </div>
      <Copy value={`var(${name})`} compact />
    </div>
  );
}
function Code({ children }: { children: string }) {
  return (
    <div className="ds-code">
      <Copy value={children} label="Копировать код" />
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}
function DocSection({
  id,
  number,
  title,
  intro,
  children,
}: {
  id: string;
  number: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="ds-section" aria-labelledby={`${id}-title`}>
      <div className="ds-section-label">
        <span>{number} / FOUNDATIONS & PATTERNS</span>
        <a href={`#${id}`} aria-label={`Ссылка на раздел ${title}`}>
          #
        </a>
      </div>
      <h2 id={`${id}-title`}>{title}</h2>
      <p className="ds-intro">{intro}</p>
      {children}
    </section>
  );
}
function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  const id = useId();
  return (
    <div className="ds-select">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function Playground({ group, lang }: { group: Group; lang: Language }) {
  const [tab, setTab] = useState("Пример");
  const [tone, setTone] = useState<Accent>("green");
  const [state, setState] = useState<DemoState>("default");
  const [compact, setCompact] = useState(false);
  const [framed, setFramed] = useState(true);
  const [border, setBorder] = useState<"gradient" | "solid" | "none">(
    "gradient",
  );
  const [glow, setGlow] = useState(true);
  const [interactive, setInteractive] = useState(false);
  const [replay, setReplay] = useState(0);
  const [notice, setNotice] = useState("");
  const actionTone: CtaTone = ctaTones.includes(tone as CtaTone)
    ? (tone as CtaTone)
    : "green";
  const buttonLabel =
    lang === "en" ? "Book a consultation" : "Записаться на консультацию";
  const button = (
    <Button
      tone={actionTone}
      compact={compact}
      demoState={state}
      onClick={() =>
        setNotice(
          lang === "en"
            ? "Local action triggered."
            : "Локальное действие выполнено.",
        )
      }
    >
      {buttonLabel}
    </Button>
  );
  const snippets: Record<Group, string> = {
    actions: `${framed ? `<CtaFrame tone="${actionTone}">\n  ` : ""}<Button tone="${actionTone}"${compact ? " compact" : ""}${state === "loading" ? " loading" : state === "disabled" ? " disabled" : ""} href="#contact">\n  ${buttonLabel}\n${framed ? "  " : ""}</Button>${framed ? "\n</CtaFrame>" : ""}\n\n// Навигация: href. Локальное действие: onClick.\n// Отправка формы: type="submit".`,
    surfaces: `<SurfaceCard tone="${tone}" border="${border}" glow={${glow}}>\n  <Badge tone="${tone}">AI AUTOMATION</Badge>\n  <h3>Built for your business</h3>${interactive ? '\n  <a className="aihub-card-link" href="/case.html">Read case</a>' : ""}\n</SurfaceCard>\n<DecorativeGlow tone="${tone}" />`,
    forms:
      '<TextField label="Your name" name="name" required />\n<TextField label="Your e-mail" name="email" type="email"\n  required error={errors.email} autoComplete="email" />\n<TextField label="Phone number" name="phone" type="tel"\n  hint="Optional" autoComplete="tel" />\n<Button type="submit" tone="blue" loading={sending}>\n  Book a consultation\n</Button>\n\n// Локальная демонстрация без API:\n<DemoContactForm lang="en" />',
    metrics: `<Reveal index={0}>\n  <SurfaceCard tone="${tone}">\n    <ProgressRing value={85} label="Automation" tone="${tone}" />\n    <Metric value={32} label="Conversion growth" tone="${tone}" />\n    <ChangeIndicator tone="${tone}">+32% growth</ChangeIndicator>\n  </SurfaceCard>\n</Reveal>\n// Reveal ждёт 720 ms + index × 150 ms; затем запускаются числа.`,
    composition:
      '<div className="aihub-theme">\n  <Section id="benefits">\n    <PageContainer>\n      <SectionHeading eyebrow="AIHUB" description="Your next advantage">\n        Built for your business\n      </SectionHeading>\n      <Grid columns={3}>\n        <SurfaceCard>...</SurfaceCard>\n        <SurfaceCard>...</SurfaceCard>\n        <SurfaceCard>...</SurfaceCard>\n      </Grid>\n    </PageContainer>\n  </Section>\n</div>',
  };
  const rules: Record<Group, string[]> = {
    actions: [
      "Четыре CTA: green / blue / yellow / orange. На заливке используйте тёмный текст: белый не проходит WCAG AA для обычного текста.",
      "Hover: scale 1.035, translateY(-2px), цветное свечение за 320 ms. Focus всегда имеет отдельную видимую обводку.",
      "Рамка задаёт симметричный padding 20 px. Кнопка занимает внутреннюю ширину. Не позиционируйте её через top/left.",
      "Состояния hover/focus/pressed в каталоге принудительные (demoState). На настоящей странице используйте CSS-состояния; loading и disabled управляются props.",
    ],
    surfaces: [
      "Один доминирующий акцент на карточку. Рамка наследует radius 30 px без цветовых исключений.",
      "Градиентная рамка рисуется маской отдельного псевдоэлемента, а не обрезкой всей карточки.",
      "Интерактивная карточка содержит настоящую ссылку .aihub-card-link. Не делайте div с onClick без клавиатурной семантики.",
      "DecorativeGlow: pointer-events none, слой -1 внутри isolate-секции. Не ставьте overflow hidden на секцию.",
    ],
    forms: [
      "Имя и e-mail обязательны. Телефон можно оставить пустым. required отражается и в HTML, и в подписи.",
      "Ошибка связана с полем через aria-describedby, отмечена aria-invalid. После отправки фокус переходит на первое ошибочное поле.",
      "Hover усиливает внутреннее свечение; focus делает его заметнее. Цвет не заменяет текст ошибки.",
      "DemoContactForm не отправляет данные. Для production нужен отдельный контроллер формы и существующий backend API.",
    ],
    metrics: [
      "Видимость карточки и запуск чисел разделены. Сначала Reveal, затем отсчёт и кольцевая диаграмма.",
      "Повторить анимацию можно перемонтированием компонента через key. При обычной прокрутке анимация проигрывается один раз.",
      "При reduced motion сразу выводятся конечные значения. Для screen reader доступно итоговое число, а не каждый кадр.",
      "Числа набраны Manrope. label обязателен; значение кольца ограничено диапазоном 0–100.",
    ],
    composition: [
      "PageContainer: 1140 px максимум, без transform scale. При 1200 px боковые поля по 30 px.",
      "Section отвечает за внутренние отступы, соседние Section за межсекционный gap 24 / 32 / 40 px.",
      "Grid: одна колонка на mobile, две от 768 px, заданное число от 1200 px. Split становится двухколоночным от 1200 px.",
      "Все публичные компоненты принимают стандартные атрибуты соответствующего HTML-элемента; TextField поддерживает ref.",
    ],
  };
  return (
    <div className="ds-playground">
      <div className="ds-playground-top">
        <div className="ds-tablist" role="tablist" aria-label="Режим примера">
          {["Пример", "Код", "Правила"].map((name, index) => (
            <button
              id={`playground-tab-${index}`}
              key={name}
              role="tab"
              aria-selected={tab === name}
              aria-controls="playground-panel"
              tabIndex={tab === name ? 0 : -1}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                  e.preventDefault();
                  const next = (index + (e.key === "ArrowRight" ? 1 : 2)) % 3;
                  setTab(["Пример", "Код", "Правила"][next]);
                  document.getElementById(`playground-tab-${next}`)?.focus();
                }
              }}
              onClick={() => setTab(name)}
            >
              {name}
            </button>
          ))}
        </div>
        <span className="ds-mono">REACT / TYPESCRIPT</span>
      </div>
      <div className="ds-controls">
        {group !== "forms" && group !== "composition" && (
          <Select
            label="Цвет"
            value={group === "actions" ? actionTone : tone}
            options={group === "actions" ? ctaTones : accents}
            onChange={(v) => setTone(v as Accent)}
          />
        )}
        {group === "actions" && (
          <>
            <Select
              label="Состояние"
              value={state}
              options={[
                "default",
                "hover",
                "focus",
                "pressed",
                "loading",
                "disabled",
              ]}
              onChange={(v) => setState(v as DemoState)}
            />
            <label className="ds-check">
              <input
                type="checkbox"
                checked={compact}
                onChange={(e) => setCompact(e.target.checked)}
              />
              Compact
            </label>
            <label className="ds-check">
              <input
                type="checkbox"
                checked={framed}
                onChange={(e) => setFramed(e.target.checked)}
              />
              CtaFrame
            </label>
          </>
        )}
        {group === "surfaces" && (
          <>
            <Select
              label="Рамка"
              value={border}
              options={["gradient", "solid", "none"]}
              onChange={(v) => setBorder(v as typeof border)}
            />
            <label className="ds-check">
              <input
                type="checkbox"
                checked={glow}
                onChange={(e) => setGlow(e.target.checked)}
              />
              Inset glow
            </label>
            <label className="ds-check">
              <input
                type="checkbox"
                checked={interactive}
                onChange={(e) => setInteractive(e.target.checked)}
              />
              Интерактивная
            </label>
          </>
        )}
        {group === "metrics" && (
          <button className="ds-quiet" onClick={() => setReplay((v) => v + 1)}>
            ↻ Повторить анимацию
          </button>
        )}
        <a
          className="ds-permalink"
          href={`#component-${groupComponents[group][0]}`}
        >
          # ссылка на пример
        </a>
      </div>
      <div
        id="playground-panel"
        role="tabpanel"
        aria-labelledby={`playground-tab-${["Пример", "Код", "Правила"].indexOf(tab)}`}
        tabIndex={0}
      >
        {tab === "Код" ? (
          <Code>{snippets[group]}</Code>
        ) : tab === "Правила" ? (
          <ul className="ds-rule-list">
            {rules[group].map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        ) : (
          <div className={`ds-stage ds-stage--${group}`}>
            {group === "actions" && (
              <div className="aihub-stack ds-action-demo">
                <div>
                  {framed ? (
                    <CtaFrame tone={actionTone}>{button}</CtaFrame>
                  ) : (
                    button
                  )}
                </div>
                <NavLink href="#templates">
                  {lang === "en" ? "Explore templates" : "Посмотреть шаблоны"} →
                </NavLink>
                <div role="status" className="aihub-muted">
                  {notice ||
                    (lang === "en"
                      ? "Hover, focus or tap to explore."
                      : "Наведите, сфокусируйте или нажмите.")}
                </div>
              </div>
            )}
            {group === "surfaces" && (
              <div className="ds-surface-demo">
                <DecorativeGlow tone={tone} />
                <SurfaceCard
                  tone={tone}
                  border={border}
                  glow={glow}
                  className="aihub-stack"
                >
                  <Badge tone={tone}>AI AUTOMATION</Badge>
                  <h3>
                    {lang === "en"
                      ? "Built for your business"
                      : "Создано для вашего бизнеса"}
                  </h3>
                  <p className="aihub-muted">
                    {lang === "en"
                      ? "Glass surfaces. Clear hierarchy. One intentional accent."
                      : "Стеклянная поверхность. Понятная иерархия. Один осмысленный акцент."}
                  </p>
                  <div className="aihub-row">
                    <GlowDot tone={tone} />
                    {lang === "en"
                      ? "Connected & ready"
                      : "Подключено и готово"}
                  </div>
                  {interactive && (
                    <a href="#rules" className="aihub-card-link">
                      {lang === "en"
                        ? "Read the guidelines"
                        : "Правила использования"}{" "}
                      →
                    </a>
                  )}
                </SurfaceCard>
              </div>
            )}
            {group === "forms" && (
              <Grid columns={2}>
                <DemoContactForm lang={lang} />
                <div className="aihub-stack">
                  <TextField
                    label={lang === "en" ? "Filled state" : "Заполненное поле"}
                    defaultValue="Alex Morgan"
                  />
                  <TextField
                    label="Your e-mail"
                    defaultValue="alex@"
                    error={
                      lang === "en"
                        ? "Please enter a valid e-mail address."
                        : "Введите корректный адрес e-mail."
                    }
                    required
                  />
                  <TextField
                    label={
                      lang === "en" ? "Disabled state" : "Недоступное поле"
                    }
                    value="alex@company.com"
                    disabled
                  />
                  <FormMessage kind="success">
                    {lang === "en"
                      ? "Success: your request is ready."
                      : "Успех: ваша заявка готова."}
                  </FormMessage>
                  <FormMessage>
                    Данные демонстрации остаются только в памяти этой страницы.
                  </FormMessage>
                </div>
              </Grid>
            )}
            {group === "metrics" && (
              <Grid columns={2} key={replay}>
                <Reveal>
                  <SurfaceCard tone={tone} className="aihub-stack">
                    <div className="aihub-row">
                      <ProgressRing value={85} label="Automation" tone={tone} />
                      <Metric
                        value={32}
                        label={
                          lang === "en" ? "Conversion growth" : "Рост конверсии"
                        }
                        tone={tone}
                      />
                    </div>
                    <ChangeIndicator tone={tone}>
                      +32%{" "}
                      {lang === "en" ? "vs. baseline" : "к базовому периоду"}
                    </ChangeIndicator>
                  </SurfaceCard>
                </Reveal>
                <Reveal index={1}>
                  <TimelineStep
                    number={1}
                    title={
                      lang === "en"
                        ? "Discover & connect"
                        : "Исследуем и подключаем"
                    }
                  >
                    {lang === "en"
                      ? "Numbers start after the card enters."
                      : "Числа запускаются после появления карточки."}
                  </TimelineStep>
                </Reveal>
              </Grid>
            )}
            {group === "composition" && (
              <div>
                <SectionHeading
                  level={3}
                  eyebrow="COMPOSITION"
                  description="One system. Every page."
                >
                  {lang === "en"
                    ? "Built to work together"
                    : "Создано работать вместе"}
                </SectionHeading>
                <Grid>
                  {["Content", "Context", "Action"].map((text) => (
                    <SurfaceCard key={text}>{text}</SurfaceCard>
                  ))}
                </Grid>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function PreviewFrame({
  target,
  kind,
  lang,
}: {
  target: string;
  kind: "block" | "template";
  lang: Language;
}) {
  const [width, setWidth] = useState(1200);
  const [replay, setReplay] = useState(0);
  const [available, setAvailable] = useState(1140);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver((entries) =>
      setAvailable(entries[0].contentRect.width),
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const scale = Math.min(1, available / width);
  const url = `${import.meta.env.BASE_URL}design-system.html?preview=${kind}&target=${encodeURIComponent(target)}&lang=${lang}`;
  return (
    <div className="ds-preview">
      <div className="ds-preview-toolbar">
        <div className="ds-widths" role="group" aria-label="Ширина preview">
          {[390, 768, 1200, 1440].map((size) => (
            <button
              key={size}
              aria-pressed={width === size}
              onClick={() => setWidth(size)}
            >
              {size}
              <span> px</span>
            </button>
          ))}
        </div>
        <div className="aihub-row">
          <button
            className="ds-quiet"
            onClick={() => setReplay((v) => v + 1)}
            aria-label={`Повторить анимации ${target}`}
          >
            ↻ Повтор
          </button>
          <a className="ds-quiet" href={url} target="_blank" rel="noreferrer">
            Открыть →
          </a>
        </div>
      </div>
      <div
        className="ds-preview-viewport"
        ref={ref}
        style={{ height: 760 * scale + 2 }}
      >
        <iframe
          key={`${target}-${width}-${lang}-${replay}`}
          src={url}
          title={`${kind === "block" ? "Блок" : "Шаблон"} ${target}, ${width}px`}
          loading="lazy"
          style={{
            width,
            height: 760,
            left: Math.max(0, (available - width * scale) / 2),
            transform: `scale(${scale})`,
          }}
        />
      </div>
      <p className="ds-preview-note">
        Изолированный viewport: {width} × 760 px · масштаб просмотра{" "}
        {Math.round(scale * 100)}% · прокрутка внутри фрейма.{" "}
        <a href={url} target="_blank" rel="noreferrer">
          Открыть без уменьшения
        </a>
        .
      </p>
    </div>
  );
}

function MiniComposition({ block }: { block: Block }) {
  const isHero = ["hero", "contact", "demo"].includes(block.id);
  return (
    <div
      className={`ds-mini ds-mini--${block.id}`}
      data-tone={block.tone}
      aria-hidden="true"
    >
      <span className="ds-mini-grid" />
      <div className="ds-mini-content">
        <span className="ds-mini-eyebrow">
          AIHUB / {block.name.toUpperCase()}
        </span>
        {isHero ? (
          <div className="ds-mini-split">
            <div>
              <strong>
                Intelligence.
                <br />
                Applied.
              </strong>
              <Badge tone={block.tone}>LET'S TALK →</Badge>
            </div>
            <div
              className={
                block.id === "contact" ? "ds-mini-fields" : "ds-mini-orb"
              }
            >
              {block.id === "contact" && (
                <>
                  <i />
                  <i />
                  <i />
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            <strong>
              {block.name === "Cases" ? "Real impact." : block.name}
            </strong>
            <div className="ds-mini-cards">
              {[0, 1, 2].map((i) => (
                <SurfaceCard key={i} tone={block.tone}>
                  <span>
                    {["cases", "results"].includes(block.id)
                      ? ["85%", "32%", "24/7"][i]
                      : block.id === "work-process" || block.id === "roadmap"
                        ? `0${i + 1}`
                        : ["team", "clients"].includes(block.id)
                          ? "◉"
                          : "✳"}
                  </span>
                  <i />
                  <i />
                </SurfaceCard>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Catalog() {
  const tokens = useTokens();
  const [lang, setLang] = useState<Language>("en");
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState<Group>("actions");
  const [selectedBlock, setSelectedBlock] = useState(blocks[0]);
  const [template, setTemplate] = useState<"service" | "case">("service");
  const [activeSection, setActiveSection] = useState("overview");
  const [motionKey, setMotionKey] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleHash = () => {
      const hash = decodeURIComponent(location.hash.slice(1));
      if (hash.startsWith("component-")) {
        const entry = (
          Object.entries(groupComponents) as [Group, string[]][]
        ).find(([, names]) => names.includes(hash.slice(10)));
        if (entry) {
          setGroup(entry[0]);
          document.getElementById("components")?.scrollIntoView();
        }
      }
      const block = blocks.find((item) => `block-${item.id}` === hash);
      if (block) {
        setSelectedBlock(block);
        document.getElementById("atlas-preview")?.scrollIntoView();
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);
  useEffect(() => {
    let frame = 0;
    const updateSection = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const visible = sections.filter(
          ([id]) =>
            (document.getElementById(id)?.getBoundingClientRect().top ??
              Infinity) <= 180,
        );
        const current = visible[visible.length - 1];
        if (current) setActiveSection(current[0]);
      });
    };
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    updateSection();
    window.addEventListener("scroll", updateSection, { passive: true });
    window.addEventListener("keydown", shortcut);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateSection);
      window.removeEventListener("keydown", shortcut);
    };
  }, []);
  const searchIndex = [
    ...sections.map(([id, label]) => ({
      label,
      detail: "Раздел каталога",
      href: `#${id}`,
    })),
    ...componentNames.map((name) => ({
      label: name,
      detail: "React-компонент",
      href: `#component-${name}`,
    })),
    ...solutionIcons.map((icon) => ({
      label: `${icon.name} / ${icon.label}`,
      detail: "Объёмная иконка",
      href: `#icon-${icon.name}`,
    })),
    ...Object.entries(tokens).map(([name, value]) => ({
      label: name,
      detail: value,
      href: name.includes("color")
        ? "#colors"
        : name.includes("text") ||
            name.includes("font") ||
            name.includes("leading") ||
            name.includes("weight")
          ? "#typography"
          : name.includes("shadow") || name.includes("blur")
            ? "#effects"
            : name.includes("duration") ||
                name.includes("stagger") ||
                name.includes("ease") ||
                name.includes("hover")
              ? "#motion"
              : "#layout",
    })),
    ...blocks.map((block) => ({
      label: `${block.name} / ${block.ru}`,
      detail: block.components,
      href: `#block-${block.id}`,
    })),
  ];
  const matches = search.trim()
    ? searchIndex.filter((item) =>
        `${item.label} ${item.detail}`
          .toLowerCase()
          .includes(search.trim().toLowerCase()),
      )
    : [];
  return (
    <div className="aihub-theme ds-catalog">
      <a className="ds-skip" href="#overview">
        Перейти к содержимому
      </a>
      <header className="ds-topbar">
        <PageContainer>
          <a href="#overview" className="aihub-wordmark">
            AIHUB<span>®</span>
          </a>
          <span className="ds-topbar-divider" />
          <span className="ds-product-label">DESIGN SYSTEM</span>
          <div className="ds-topbar-right">
            <span className="ds-version">
              <GlowDot /> v1.0
            </span>
            <a
              href={`${import.meta.env.BASE_URL}`}
              target="_blank"
              rel="noreferrer"
              className="ds-site-link"
            >
              Лендинг →
            </a>
          </div>
        </PageContainer>
      </header>
      <div className="ds-nav-shell">
        <PageContainer>
          <nav className="ds-nav" aria-label="Разделы дизайн-системы">
            {sections.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={activeSection === id ? "location" : undefined}
              >
                {label}
              </a>
            ))}
          </nav>
        </PageContainer>
      </div>
      <main>
        <PageContainer>
          <section id="overview" className="ds-hero">
            <div className="ds-hero-grid" />
            <DecorativeGlow />
            <div className="ds-hero-top">
              <Badge>AIHUB / SYSTEM 01</Badge>
              <span className="ds-mono">12 BLOCKS. ONE VISUAL LANGUAGE.</span>
            </div>
            <div className="ds-hero-layout">
              <div>
                <h1>
                  Один язык.
                  <br />
                  <span>Любая страница.</span>
                </h1>
                <p>
                  Не новый стиль. Система, собранная
                  <br className="ds-desktop-break" /> из визуального ДНК AIHUB.
                </p>
                <div className="aihub-row">
                  <Button href="#components" compact>
                    Открыть UI-kit <span aria-hidden="true">→</span>
                  </Button>
                  <NavLink href="#templates">Готовые шаблоны →</NavLink>
                </div>
              </div>
              <div
                className="ds-hero-specimen"
                aria-label="Образец визуального языка"
              >
                <div className="ds-orbit ds-orbit--one" />
                <div className="ds-orbit ds-orbit--two" />
                <span className="ds-orbit-label">
                  DESIGN / DEVELOP / REPEAT
                </span>
                <SurfaceCard className="ds-hero-card">
                  <div className="aihub-row">
                    <GlowDot />
                    <span>INTELLIGENCE, APPLIED.</span>
                  </div>
                  <div className="ds-specimen-aa">
                    Aa<span>→</span>
                  </div>
                  <div className="ds-specimen-palette">
                    {accents.map((tone) => (
                      <i
                        key={tone}
                        style={{ background: `var(--aihub-color-${tone})` }}
                      />
                    ))}
                  </div>
                  <div className="ds-hero-card-bottom">
                    <span>Geologica + Manrope</span>
                    <span>1140 px</span>
                  </div>
                </SurfaceCard>
                <Badge tone="yellow">BUILT FROM THE REAL THING</Badge>
              </div>
            </div>
            <div className="ds-hero-stats">
              <div>
                <strong>12</strong>
                <span>паттернов лендинга</span>
              </div>
              <div>
                <strong>{componentNames.length}</strong>
                <span>React-компонентов</span>
              </div>
              <div>
                <strong>07</strong>
                <span>акцентных цветов</span>
              </div>
              <div>
                <strong>02</strong>
                <span>шаблона страниц</span>
              </div>
            </div>
          </section>
          <div className="ds-findbar">
            <div className="ds-search-wrap">
              <label htmlFor="ds-search" className="ds-sr-only">
                Поиск компонентов и токенов
              </label>
              <span aria-hidden="true">⌕</span>
              <input
                ref={searchRef}
                id="ds-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearch("");
                }}
                placeholder="Найти компонент, токен или блок"
                aria-controls="ds-search-results"
              />
              <kbd>Ctrl K</kbd>
            </div>
            <div
              className="ds-language"
              role="group"
              aria-label="Язык примеров"
            >
              <span>Примеры</span>
              {(["en", "ru"] as Language[]).map((language) => (
                <button
                  key={language}
                  aria-pressed={lang === language}
                  onClick={() => setLang(language)}
                >
                  {language.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          {search.trim() && (
            <div id="ds-search-results" className="ds-search-results">
              <p role="status">Найдено: {matches.length}</p>
              {matches.length ? (
                matches.map((item) => (
                  <a
                    key={`${item.label}-${item.href}`}
                    href={item.href}
                    onClick={() => {
                      setSearch("");
                      if (location.hash === item.href)
                        window.dispatchEvent(new HashChangeEvent("hashchange"));
                    }}
                  >
                    <strong>{item.label}</strong>
                    <span>{item.detail}</span>
                    <span aria-hidden="true">→</span>
                  </a>
                ))
              ) : (
                <p>
                  Попробуйте «Button», «green», «радиус» или «--aihub-space».
                </p>
              )}
            </div>
          )}

          <DocSection
            id="colors"
            number="01"
            title="Цвет со смыслом"
            intro="Глубокий синий фон, светлый текст и семь функциональных акцентов. Цвет помогает считывать действие и контекст, а не украшает каждый элемент сразу."
          >
            <div className="ds-palette">
              {palette.map((color) => {
                const name = `--aihub-color-${color.key}`;
                const value = tokens[name] || "";
                const dark = tokens["--aihub-color-bg"] || "#060C24";
                const score = value ? contrast(value, dark) : 0;
                const onWhite = value ? contrast(value, "#FFFFFF") : 0;
                return (
                  <article className="ds-color-card" key={name}>
                    <div
                      className="ds-color-swatch"
                      style={{
                        background: `var(${name})`,
                        color: score >= 4.5 ? dark : "#FFFFFF",
                      }}
                    >
                      <span>Aa</span>
                      <Copy value={value} label="HEX" />
                    </div>
                    <div className="ds-color-content">
                      <div className="ds-color-title">
                        <h3>{color.name}</h3>
                        <code>{value}</code>
                      </div>
                      <p>{color.role}</p>
                      <span className="ds-rgb">
                        RGB {rgb(value).join(" / ")}
                      </span>
                      <div className="ds-contrast">
                        <span>
                          На Midnight: <b>{score.toFixed(2)}:1</b>
                        </span>
                        <Badge
                          tone={
                            score >= 4.5
                              ? "green"
                              : score >= 3
                                ? "yellow"
                                : "red"
                          }
                        >
                          {score >= 4.5
                            ? "AA текст"
                            : score >= 3
                              ? "Только крупный"
                              : "Не для текста"}
                        </Badge>
                      </div>
                      <small>
                        Белый на цвете: {onWhite.toFixed(2)}:1{" "}
                        {onWhite >= 4.5 ? "· AA" : "· не AA для 16 px"}
                      </small>
                      <Token name={name} tokens={tokens} />
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="ds-note">
              Контраст рассчитан по фактическим sRGB-токенам: AA ≥ 4.5:1 для
              обычного текста, ≥ 3:1 для крупного. Прозрачное свечение не
              является фоном для текста. Для текста на CTA используйте Midnight,
              а для ошибок в мелком кегле более светлый оттенок + пояснение.
            </div>
            <div className="ds-subsection">
              <h3>Прозрачности и сочетания</h3>
              <div className="ds-opacity-row">
                {[8, 12, 24, 40, 60, 100].map((opacity) => (
                  <div key={opacity}>
                    <div
                      style={{
                        background: `color-mix(in srgb, var(--aihub-color-green) ${opacity}%, transparent)`,
                      }}
                    />
                    <span>{opacity}%</span>
                    <Copy
                      compact
                      value={`color-mix(in srgb, var(--aihub-color-green) ${opacity}%, transparent)`}
                    />
                  </div>
                ))}
              </div>
              <Grid>
                <SurfaceCard>
                  <Badge>PRIMARY</Badge>
                  <p>
                    Green + Midnight
                    <br />
                    <span className="aihub-muted">
                      Основной CTA и успешный результат.
                    </span>
                  </p>
                </SurfaceCard>
                <SurfaceCard tone="blue">
                  <Badge tone="blue">INPUT</Badge>
                  <p>
                    Blue + White
                    <br />
                    <span className="aihub-muted">
                      Синее свечение под белым текстом поля.
                    </span>
                  </p>
                </SurfaceCard>
                <SurfaceCard tone="purple">
                  <Badge tone="yellow">HIERARCHY</Badge>
                  <p>
                    Purple + Yellow
                    <br />
                    <span className="aihub-muted">
                      Раздел и номера шагов. Не два конкурирующих CTA.
                    </span>
                  </p>
                </SurfaceCard>
              </Grid>
              <Token name="--aihub-color-surface" tokens={tokens} />
            </div>
          </DocSection>

          <DocSection
            id="typography"
            number="02"
            title="Характер в каждом кегле"
            intro="Geologica задаёт голос интерфейса. Manrope отвечает за цифры: результаты, проценты и этапы. Размеры фиксированы внутри брейкпоинта, а не растягиваются вместе с окном."
          >
            <div className="ds-font-pair">
              <div>
                <span className="ds-mono">01 / INTERFACE</span>
                <strong>Geologica</strong>
                <p>400 Regular · 500 Medium · 700 Bold</p>
              </div>
              <div>
                <span className="ds-mono">02 / METRICS</span>
                <strong>
                  Manrope <span>85%</span>
                </strong>
                <p>500 Medium · 600 Semibold · 700 Bold</p>
              </div>
            </div>
            <div className="ds-type-list">
              {typography.map((type) => (
                <article key={type.key} className="ds-type-row">
                  <div className="ds-type-meta">
                    <strong>{type.role}</strong>
                    <span>
                      {tokens[`--aihub-text-${type.key}`]} / mobile{" "}
                      {tokens[`--aihub-text-${type.mobile || type.key}`]}
                    </span>
                    <span>
                      weight {tokens[`--aihub-weight-${type.weight}`]} · line{" "}
                      {tokens[`--aihub-leading-${type.leading}`]}
                    </span>
                    <Copy
                      value={`font-size: var(--aihub-text-${type.key});\nline-height: var(--aihub-leading-${type.leading});\nfont-weight: var(--aihub-weight-${type.weight});`}
                      compact
                    />
                  </div>
                  <div
                    className="ds-type-sample"
                    style={
                      {
                        "--ds-type-size": `var(--aihub-text-${type.key})`,
                        "--ds-type-mobile": `var(--aihub-text-${type.mobile || type.key})`,
                        fontWeight: `var(--aihub-weight-${type.weight})`,
                        lineHeight: `var(--aihub-leading-${type.leading})`,
                      } as CSSProperties
                    }
                  >
                    {lang === "en" ? type.example : type.ru}
                  </div>
                </article>
              ))}
            </div>
            <div className="ds-note">
              <strong>Тест переноса:</strong> «Интеллектуальная автоматизация
              клиентского взаимодействия в международной распределённой
              команде». Не задавайте фиксированную высоту заголовкам и не
              уменьшайте весь блок через scale. Для основного текста минимальный
              кегль 16 px; 12 px только для коротких подписей.
            </div>
          </DocSection>

          <DocSection
            id="layout"
            number="03"
            title="Фиксированный контент. Живая сетка."
            intro="На 1200 px контент максимально крупный, с полями всего по 30 px. На больших экранах растут внешние поля, а не типографика и карточки."
          >
            <div className="ds-layout-diagram">
              <div className="ds-layout-gutter">AUTO</div>
              <div className="ds-layout-center">
                <span>PAGE CONTAINER</span>
                <strong>
                  1140 <small>px</small>
                </strong>
                <div>
                  {Array.from({ length: 12 }, (_, i) => (
                    <i key={i} />
                  ))}
                </div>
                <span>GRID / FLEX · NO TRANSFORM SCALE</span>
              </div>
              <div className="ds-layout-gutter">AUTO</div>
            </div>
            <div className="ds-table-wrap">
              <table>
                <caption>Контрольные ширины</caption>
                <thead>
                  <tr>
                    <th>Viewport</th>
                    <th>Контент</th>
                    <th>Поле / сторона</th>
                    <th>Композиция</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [390, 358, 16, "1 колонка"],
                    [768, 720, 24, "2 колонки"],
                    [1199, 1140, 29.5, "Tablet, Split в 1 колонку"],
                    [1200, 1140, 30, "Desktop, полная сетка"],
                    [1440, 1140, 150, "Фиксированный контент"],
                    [1920, 1140, 390, "Фиксированный контент"],
                  ].map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell, i) => (
                        <td key={i}>
                          {cell}
                          {i < 3 ? " px" : ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="ds-subsection">
              <h3>Шкала отступов</h3>
              <div className="ds-spacing">
                {spaces.map((space) => (
                  <div key={space}>
                    <code>{space}</code>
                    <div style={{ width: `var(--aihub-space-${space})` }} />
                    <Copy value={`var(--aihub-space-${space})`} compact />
                  </div>
                ))}
              </div>
            </div>
            <Grid>
              <SurfaceCard className="aihub-stack">
                <h3>Между секциями</h3>
                <p className="aihub-muted">
                  Внешний промежуток между соседними Section. Не суммировать с
                  дополнительным margin от вложенного блока.
                </p>
                {["mobile", "tablet", "desktop"].map((size) => (
                  <Token
                    key={size}
                    name={`--aihub-section-gap-${size}`}
                    tokens={tokens}
                  />
                ))}
              </SurfaceCard>
              <SurfaceCard tone="cyan" className="aihub-stack">
                <h3>Внутри секции</h3>
                <p className="aihub-muted">
                  Вертикальный padding 32 / 64 px. В карточках 24 / 32 px. Сетка
                  и группы контролов: 24 px.
                </p>
                {["mobile", "desktop"].map((size) => (
                  <Token
                    key={size}
                    name={`--aihub-section-padding-${size}`}
                    tokens={tokens}
                  />
                ))}
              </SurfaceCard>
              <SurfaceCard tone="yellow" className="aihub-stack">
                <h3>Геометрия</h3>
                {["badge", "inset", "card", "pill"].map((size) => (
                  <Token
                    key={size}
                    name={`--aihub-radius-${size}`}
                    tokens={tokens}
                  />
                ))}
              </SurfaceCard>
            </Grid>
          </DocSection>

          <DocSection
            id="effects"
            number="04"
            title="Глубина без визуального шума"
            intro="Граница, стекло и свечение работают как три разных слоя. Декор может выходить за секцию, но не должен перехватывать клик или увеличивать ширину страницы."
          >
            <Grid>
              <SurfaceCard tone="green" className="aihub-stack">
                <span className="ds-effect-number">01</span>
                <h3>Gradient border</h3>
                <p className="aihub-muted">
                  Тонкая цветная линия затухает по периметру. Все углы наследуют
                  один радиус.
                </p>
                <Token name="--aihub-radius-card" tokens={tokens} />
              </SurfaceCard>
              <SurfaceCard tone="blue" className="aihub-stack">
                <span className="ds-effect-number">02</span>
                <h3>Glass surface</h3>
                <p className="aihub-muted">
                  60% Midnight и blur 10 px. Контент остаётся контрастным, фон
                  не отвлекает.
                </p>
                <Token name="--aihub-glass-blur" tokens={tokens} />
              </SurfaceCard>
              <SurfaceCard tone="purple" className="aihub-stack">
                <span className="ds-effect-number">03</span>
                <h3>Inner glow</h3>
                <p className="aihub-muted">
                  Цвет остаётся внутри поверхности. Внешнее свечение сильнее
                  только у действия.
                </p>
                <Token name="--aihub-shadow-inset" tokens={tokens} />
              </SurfaceCard>
            </Grid>
            <div className="ds-layer-demo">
              <DecorativeGlow tone="purple" />
              <div>
                <span className="ds-mono">LAYER −1 / POINTER EVENTS NONE</span>
                <h3>
                  Свечение не заканчивается
                  <br />
                  на границе секции.
                </h3>
                <p>Изоляция слоя, а не обрезка содержимого.</p>
              </div>
              <div className="ds-layer-stack">
                <span>02 · Контент и фокус</span>
                <span>01 · Поверхность / рамка</span>
                <span>00 · Декор / свечение</span>
                <span>−1 · Фон страницы</span>
              </div>
            </div>
            <Code>
              {
                ".page { overflow-x: clip; } /* только внешняя оболочка */\n.section { position: relative; isolation: isolate; }\n.decor { position: absolute; z-index: -1; pointer-events: none; }\n/* Не добавляйте overflow: hidden на карточку или секцию. */"
              }
            </Code>
            <div className="ds-token-grid">
              {[
                "--aihub-shadow-glow",
                "--aihub-shadow-glow-hover",
                "--aihub-shadow-inset",
              ].map((name) => (
                <Token key={name} name={name} tokens={tokens} />
              ))}
            </div>
          </DocSection>

          <DocSection
            id="icons"
            number="04B"
            title="Один материал. Восемь решений."
            intro="Объёмные иконки AIHUB Store: тёмное стекло, полированный металл и зелёные световые детали. Сгенерированы одним набором через LaoZhang Image Lab Clean, модель Nano Banana 2.1."
          >
            <Grid columns={4} id="component-SolutionIcon">
              {solutionIcons.map((icon) => (
                <SurfaceCard
                  key={icon.name}
                  id={`icon-${icon.name}`}
                  className="ds-icon-specimen"
                  glow={false}
                >
                  <SolutionIcon name={icon.name} />
                  <h3>{icon.label}</h3>
                  <code>{icon.name}</code>
                  <Copy
                    value={`<SolutionIcon name="${icon.name}" width={160} height={160} />`}
                    label="Копировать JSX"
                  />
                </SurfaceCard>
              ))}
            </Grid>
            <div className="ds-subsection aihub-stack">
              <p className="aihub-muted">
                Используйте на Midnight-поверхностях, без изменения цвета и
                пропорций. Это WebP с прозрачным фоном, подготовленным через
                Bria после генерации. Рекомендуемый размер: 160–260 px; не
                заменяйте ими компактные интерфейсные пиктограммы. Рядом с
                подписью оставляйте alt пустым.
              </p>
              <Code>
                {
                  'import { SolutionIcon } from "./design-system";\n\n<SolutionIcon name="voice-assistant" width={200} height={200} />'
                }
              </Code>
              <NavLink href={`${import.meta.env.BASE_URL}shop.html`}>
                Посмотреть иконки в магазине →
              </NavLink>
            </div>
          </DocSection>

          <DocSection
            id="components"
            number="05"
            title="Компоненты, а не картинки"
            intro="Те же React-компоненты используются в этом каталоге и в шаблонах. Выберите семейство, измените вариант и заберите рабочий JSX."
          >
            <div
              className="ds-component-families"
              role="group"
              aria-label="Семейства компонентов"
            >
              {(
                [
                  ["actions", "Действия", "01"],
                  ["surfaces", "Поверхности", "02"],
                  ["forms", "Формы", "03"],
                  ["metrics", "Показатели", "04"],
                  ["composition", "Композиция", "05"],
                ] as const
              ).map(([key, name, number]) => (
                <button
                  key={key}
                  aria-pressed={group === key}
                  onClick={() => {
                    setGroup(key);
                    history.replaceState(
                      null,
                      "",
                      `#component-${groupComponents[key][0]}`,
                    );
                  }}
                >
                  <span>{number}</span>
                  {name}
                </button>
              ))}
            </div>
            <div className="ds-component-names">
              {groupComponents[group].map((name) => (
                <a key={name} href={`#component-${name}`}>
                  {name}
                </a>
              ))}
            </div>
            <Playground key={group} group={group} lang={lang} />
          </DocSection>

          <DocSection
            id="motion"
            number="06"
            title="Сначала контекст. Потом движение."
            intro="Анимация объясняет порядок, а не задерживает доступ к информации. Появление карточки, счётчик и диаграмма согласованы во времени."
          >
            <div className="ds-motion-timeline">
              <span>Вход в viewport</span>
              <div>
                <i>Reveal · 720 ms</i>
                <i>Метрика · 1400 ms</i>
              </div>
              <span>Следующая карточка: +150 ms</span>
            </div>
            <div className="ds-token-grid">
              {[
                "--aihub-duration-action",
                "--aihub-hover-scale",
                "--aihub-hover-lift",
                "--aihub-duration-field",
                "--aihub-duration-reveal",
                "--aihub-stagger",
                "--aihub-duration-metric",
                "--aihub-ease",
              ].map((name) => (
                <Token key={name} name={name} tokens={tokens} />
              ))}
            </div>
            <div className="ds-subsection">
              <div className="ds-inline-heading">
                <h3>Появление → счётчик → результат</h3>
                <button
                  className="ds-quiet"
                  onClick={() => setMotionKey((v) => v + 1)}
                >
                  ↻ Повторить последовательность
                </button>
              </div>
              <Grid key={motionKey}>
                {[85, 40, 32].map((value, index) => (
                  <Reveal key={value} index={index}>
                    <SurfaceCard
                      tone={(["green", "blue", "orange"] as Accent[])[index]}
                    >
                      <Metric
                        value={value}
                        label={
                          ["Automation", "Time saved", "Conversion"][index]
                        }
                        tone={(["green", "blue", "orange"] as Accent[])[index]}
                      />
                    </SurfaceCard>
                  </Reveal>
                ))}
              </Grid>
            </div>
            <div className="ds-note">
              Интервал допустим в диапазоне 120–180 ms; стандарт токена 150 ms.{" "}
              <code>prefers-reduced-motion: reduce</code> отключает появление,
              zoom, спиннер и счётчики: конечное состояние показывается сразу.
              Loading остаётся доступным через текст и aria-busy.
            </div>
          </DocSection>

          <DocSection
            id="atlas"
            number="07"
            title="12 блоков. Полная система."
            intro="Атлас всех текущих секций. Миниатюры показывают композицию, а выбранный блок открывается в живом адаптивном preview. Это нормализованные паттерны из UI-kit, не скриншоты исходника."
          >
            <div className="ds-atlas-grid">
              {blocks.map((block, index) => (
                <article
                  className="ds-atlas-card"
                  key={block.id}
                  data-selected={selectedBlock.id === block.id}
                >
                  <MiniComposition block={block} />
                  <div className="ds-atlas-card-footer">
                    <span className="ds-mono">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3>{block.name}</h3>
                      <span>{block.ru}</span>
                    </div>
                    <a
                      href={`#block-${block.id}`}
                      aria-label={`Посмотреть ${block.name}`}
                      onClick={() => setSelectedBlock(block)}
                    >
                      →
                    </a>
                  </div>
                </article>
              ))}
            </div>
            <div id="atlas-preview" className="ds-subsection">
              <div className="ds-inline-heading">
                <h3>
                  {selectedBlock.name}{" "}
                  <span className="aihub-muted">/ {selectedBlock.ru}</span>
                </h3>
                <a
                  href={sourceUrl(selectedBlock.folder)}
                  target="_blank"
                  rel="noreferrer"
                  className="ds-quiet"
                >
                  Исходный блок →
                </a>
              </div>
              <div className="ds-block-meta">
                <p>{selectedBlock.composition}</p>
                <dl>
                  <dt>Компоненты</dt>
                  <dd>{selectedBlock.components}</dd>
                  <dt>Акцент</dt>
                  <dd>
                    <Badge tone={selectedBlock.tone}>
                      {selectedBlock.tone}
                    </Badge>
                  </dd>
                  <dt>Размеры</dt>
                  <dd>{selectedBlock.dimensions}</dd>
                  <dt>Адаптив</dt>
                  <dd>{selectedBlock.responsive}</dd>
                </dl>
              </div>
              <PreviewFrame
                kind="block"
                target={selectedBlock.id}
                lang={lang}
              />
            </div>
          </DocSection>

          <DocSection
            id="templates"
            number="08"
            title="От системы к новой странице"
            intro="Два стартовых шаблона на том же UI-kit: услуга и кейс. Заголовки, контент, карточки, показатели, CTA и локальная форма уже собраны в связный сценарий."
          >
            <div
              className="ds-template-selector"
              role="group"
              aria-label="Шаблон страницы"
            >
              <button
                aria-pressed={template === "service"}
                onClick={() => setTemplate("service")}
              >
                <span>01 / SERVICE</span>
                <strong>Страница услуги</strong>
                <small>Оффер → возможности → процесс → форма</small>
              </button>
              <button
                aria-pressed={template === "case"}
                onClick={() => setTemplate("case")}
              >
                <span>02 / CASE STUDY</span>
                <strong>Страница кейса</strong>
                <small>Задача → результат → решение → форма</small>
              </button>
            </div>
            <PreviewFrame kind="template" target={template} lang={lang} />
            <p className="ds-note">
              Показатели и тексты шаблонов демонстрационные, не заявления о
              реальных результатах клиентов. Все CTA ведут к форме внутри
              страницы; форма никуда не отправляет данные.
            </p>
          </DocSection>

          <DocSection
            id="rules"
            number="09"
            title="Сохраняйте характер. Не ошибки."
            intro="Пять коротких правил, которые защищают визуальный язык и устраняют типичные проблемы исходных экспортированных блоков."
          >
            <div className="ds-guidelines">
              {[
                [
                  "Один главный акцент",
                  "Несколько равнозначных CTA отвлекают от действия.",
                  <div className="aihub-row">
                    <Badge>PRIMARY</Badge>
                    <span className="aihub-muted">Secondary link →</span>
                  </div>,
                  <div className="aihub-row">
                    {accents.slice(0, 5).map((tone) => (
                      <Badge key={tone} tone={tone}>
                        CTA
                      </Badge>
                    ))}
                  </div>,
                ],
                [
                  "Контент не уменьшается",
                  "Не масштабируйте всю страницу ради размещения текста.",
                  <span style={{ fontSize: 20 }}>Readable. Читаемо.</span>,
                  <span style={{ fontSize: 9 }}>
                    Тот же важный текст в слишком мелком масштабе.
                  </span>,
                ],
                [
                  "Свечение свободно",
                  "Overflow hidden на секции обрезает атмосферу.",
                  <div className="ds-glow-example">
                    <DecorativeGlow />
                    <span>Visible glow</span>
                  </div>,
                  <div className="ds-glow-example ds-glow-example--clipped">
                    <DecorativeGlow />
                    <span>Clipped glow</span>
                  </div>,
                ],
                [
                  "Рамка и CTA соосны",
                  "Одна Grid-обёртка вместо независимых left/top.",
                  <div className="ds-frame-example">
                    <span>Book a consultation</span>
                  </div>,
                  <div className="ds-frame-example ds-frame-example--wrong">
                    <span>Book a consultation</span>
                  </div>,
                ],
                [
                  "Метрика после карточки",
                  "Не запускайте все счётчики при монтировании страницы.",
                  <span className="ds-sequence">
                    Карточка → <b>0 … 85%</b>
                  </span>,
                  <span className="ds-sequence ds-sequence--wrong">
                    Невидимая карточка → <b>85%</b>
                  </span>,
                ],
              ].map(([title, text, good, bad], index) => (
                <article key={index}>
                  <div className="ds-guideline-title">
                    <span className="ds-mono">0{index + 1}</span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                  <div className="ds-do">
                    <span className="ds-verdict">ДЕЛАЙТЕ</span>
                    {good}
                  </div>
                  <div className="ds-dont">
                    <span className="ds-verdict">ИЗБЕГАЙТЕ</span>
                    {bad}
                  </div>
                </article>
              ))}
            </div>
            <details className="ds-details">
              <summary>
                Исключения текущего лендинга: что не переносить в новые страницы
              </summary>
              <ul>
                <li>
                  Экспортированные блоки используют координатные 1920px-сцены и
                  DesktopScaleFrame. Это совместимость с исходником, не стандарт
                  новой вёрстки.
                </li>
                <li>
                  Cases имеет свою сетку с порогом 1140 px и контейнером до 1200
                  px. В UI-kit единый desktop 1200 px и значимый контент 1140
                  px.
                </li>
                <li>
                  В исходных CTA встречается высота 80 px и рамка 117 px. Новый
                  стандарт 64 / 48 px и симметричный padding рамки 20 px.
                </li>
                <li>
                  В исходном Work Process цифры 96 px; универсальный
                  TimelineStep использует 64 px. Старый блок не меняется.
                </li>
                <li>
                  Локальные смещения яйца Tools (200 px) и букв AI (150 px)
                  связаны с исходной сценой; они не являются токенами системы.
                </li>
                <li>
                  Случайные имена CSS-переменных экспортера, разноразмерные
                  радиусы и внешние Anima-ассеты остаются только в legacy. Новые
                  страницы используют семантические --aihub-*.
                </li>
              </ul>
            </details>
          </DocSection>

          <DocSection
            id="implementation"
            number="10"
            title="Соберите следующую страницу"
            intro="Один импорт подключает типизированные компоненты и изолированные стили. Существующий лендинг не зависит от нового UI-kit и не меняется."
          >
            <Code>
              {
                'import {\n  PageContainer, Section, SectionHeading, Grid,\n  SurfaceCard, Button, CtaFrame, TextField\n} from "./design-system";\n\nexport function NewPage() {\n  return (\n    <main className="aihub-theme">\n      <Section>\n        <PageContainer>\n          <SectionHeading level={1}>AI for your business</SectionHeading>\n          <CtaFrame>\n            <Button href="#contact">Book a consultation</Button>\n          </CtaFrame>\n        </PageContainer>\n      </Section>\n      {/* Добавьте секцию с id="contact" и production-контроллер формы. */}\n    </main>\n  );\n}'
              }
            </Code>
            <Grid>
              <SurfaceCard>
                <Badge>01 / TOKENS</Badge>
                <h3>Меняйте контракт</h3>
                <p className="aihub-muted">
                  Значения в tokens.css. Каталог считывает их из computed
                  styles. Новый токен получает роль и пример.
                </p>
              </SurfaceCard>
              <SurfaceCard tone="cyan">
                <Badge tone="cyan">02 / COMPONENTS</Badge>
                <h3>Расширяйте осмысленно</h3>
                <p className="aihub-muted">
                  Варианты типизируются в components.tsx, стили остаются внутри
                  .aihub-theme. Добавьте пример и правила.
                </p>
              </SurfaceCard>
              <SurfaceCard tone="yellow">
                <Badge tone="yellow">03 / CHECK</Badge>
                <h3>Проверяйте границы</h3>
                <p className="aihub-muted">
                  390, 768, 1199, 1200, 1440, 1920 px. Клавиатура, reduced
                  motion, переносы и локальная форма.
                </p>
              </SurfaceCard>
            </Grid>
            <div className="ds-note">
              Полное руководство: <code>docs/design-system.md</code>. Локальная
              сборка: <code>npm run build</code> →{" "}
              <code>npm run preview -- --port 4173 --strictPort</code>. URL
              учитывают <code>import.meta.env.BASE_URL</code>. Публикация в
              Pages в этот этап не входит.
            </div>
          </DocSection>
          <footer className="ds-footer">
            <a className="aihub-wordmark" href="#overview">
              AIHUB<span>®</span>
            </a>
            <span>Design is a system. Not a collection of exceptions.</span>
            <a href="#overview">Наверх ↑</a>
          </footer>
        </PageContainer>
      </main>
    </div>
  );
}
