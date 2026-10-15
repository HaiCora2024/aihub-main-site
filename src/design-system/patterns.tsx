import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
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
  Section,
  SectionHeading,
  Split,
  SurfaceCard,
  TextField,
  TimelineStep,
} from "./components";
import type { Accent } from "./components";
import { blocks } from "./data";
import type { BlockId } from "./data";

export type Language = "en" | "ru";
const copy = (lang: Language, en: string, ru: string) =>
  lang === "en" ? en : ru;

export function DemoContactForm({
  lang = "en",
  id = "demo-contact-form",
}: {
  lang?: Language;
  id?: string;
}) {
  const [values, setValues] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Partial<typeof values>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    const next: Partial<typeof values> = {};
    if (!values.name.trim())
      next.name = copy(lang, "Please enter your name.", "Укажите ваше имя.");
    if (!values.email.trim())
      next.email = copy(
        lang,
        "Please enter your e-mail.",
        "Укажите ваш e-mail.",
      );
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = copy(
        lang,
        "Please enter a valid e-mail address.",
        "Введите корректный адрес e-mail.",
      );
    setErrors(next);
    if (Object.keys(next).length) {
      setStatus("idle");
      (next.name ? nameRef : emailRef).current?.focus();
      return;
    }
    setStatus("sending");
    // Deliberately local: the catalog never calls the production lead API.
    timer.current = setTimeout(() => setStatus("success"), 1000);
  };
  const change = (key: keyof typeof values, value: string) => {
    setValues((old) => ({ ...old, [key]: value }));
    setErrors((old) => ({ ...old, [key]: undefined }));
    setStatus("idle");
  };
  return (
    <form
      id={id}
      className="aihub-stack"
      onSubmit={submit}
      noValidate
      aria-label={copy(
        lang,
        "Demo contact form",
        "Демонстрационная контактная форма",
      )}
    >
      <TextField
        ref={nameRef}
        name="name"
        label={copy(lang, "Your name", "Ваше имя")}
        placeholder={copy(lang, "Alex Morgan", "Александр Иванов")}
        autoComplete="name"
        required
        value={values.name}
        error={errors.name}
        onChange={(e) => change("name", e.target.value)}
        disabled={status === "sending"}
      />
      <TextField
        ref={emailRef}
        name="email"
        label={copy(lang, "Your e-mail", "Ваш e-mail")}
        placeholder="you@company.com"
        type="email"
        autoComplete="email"
        required
        value={values.email}
        error={errors.email}
        onChange={(e) => change("email", e.target.value)}
        disabled={status === "sending"}
      />
      <TextField
        name="phone"
        label={copy(lang, "Phone number", "Номер телефона")}
        hint={copy(lang, "Optional", "Необязательно")}
        placeholder="+7 999 123 45 67"
        type="tel"
        autoComplete="tel"
        value={values.phone}
        onChange={(e) => change("phone", e.target.value)}
        disabled={status === "sending"}
      />
      {Object.keys(errors).some(
        (key) => errors[key as keyof typeof errors],
      ) && (
        <FormMessage kind="error">
          {copy(
            lang,
            "Check the highlighted fields.",
            "Проверьте выделенные поля.",
          )}
        </FormMessage>
      )}
      {status === "success" ? (
        <FormMessage kind="success">
          {copy(
            lang,
            "Demo complete. No data was sent.",
            "Демонстрация завершена. Данные никуда не отправлены.",
          )}
        </FormMessage>
      ) : (
        <Button type="submit" tone="blue" loading={status === "sending"}>
          {status === "sending"
            ? copy(lang, "Sending...", "Отправка...")
            : copy(lang, "Book a consultation", "Записаться на консультацию")}
        </Button>
      )}
      {status === "success" && (
        <Button
          compact
          tone="blue"
          onClick={() => {
            setValues({ name: "", email: "", phone: "" });
            setStatus("idle");
          }}
        >
          {" "}
          {copy(lang, "Try again", "Заполнить заново")}
        </Button>
      )}
      <p className="aihub-demo-disclaimer">
        {copy(
          lang,
          "Interactive demo only. No email, CRM or spreadsheet requests.",
          "Только локальная демонстрация. Без запросов к почте, CRM и таблицам.",
        )}
      </p>
    </form>
  );
}

function Orb({ tone = "green" }: { tone?: Accent }) {
  return (
    <div className="aihub-orb-stage" data-tone={tone} aria-hidden="true">
      <DecorativeGlow tone={tone} />
      <div className="aihub-orb">
        <span>AI</span>
      </div>
      <span className="aihub-orb-orbit" />
    </div>
  );
}
function FeatureCards({ lang }: { lang: Language }) {
  return (
    <Grid>
      {[
        ["24/7", copy(lang, "Always available", "Всегда на связи"), "green"],
        [
          "CRM",
          copy(lang, "One connected workflow", "Единый рабочий процесс"),
          "cyan",
        ],
        [
          "AI",
          copy(lang, "Built around your business", "Под задачи вашего бизнеса"),
          "purple",
        ],
      ].map(([name, title, tone], index) => (
        <Reveal key={name} index={index}>
          <SurfaceCard tone={tone as Accent} className="aihub-stack">
            <Badge tone={tone as Accent}>{name}</Badge>
            <h3>{title}</h3>
            <p className="aihub-muted">
              {copy(
                lang,
                "Less routine. More time for the work that matters.",
                "Меньше рутины. Больше времени для действительно важных задач.",
              )}
            </p>
          </SurfaceCard>
        </Reveal>
      ))}
    </Grid>
  );
}

export function BlockPattern({
  block,
  lang = "en",
}: {
  block: BlockId;
  lang?: Language;
}) {
  const meta = blocks.find((item) => item.id === block)!;
  const title = copy(lang, meta.name.toUpperCase(), meta.ru.toUpperCase());
  let content;
  switch (block) {
    case "hero":
      content = (
        <Split>
          <div>
            <SectionHeading
              level={1}
              eyebrow="AIHUB / CUSTOM AI"
              description={copy(
                lang,
                "Your business. Amplified by intelligence.",
                "Ваш бизнес. Усиленный искусственным интеллектом.",
              )}
            >
              {copy(
                lang,
                "AI that works for you",
                "AI, который работает на вас",
              )}
            </SectionHeading>
            <CtaFrame>
              <Button href="#preview-contact">
                {copy(
                  lang,
                  "Book a consultation",
                  "Записаться на консультацию",
                )}
              </Button>
            </CtaFrame>
          </div>
          <Orb />
        </Split>
      );
      break;
    case "results":
      content = (
        <>
          <SectionHeading tone="yellow">
            {copy(lang, "Instant business results", "Результат для бизнеса")}
          </SectionHeading>
          <Grid>
            {[
              [85, "Faster responses", "Быстрее ответы"],
              [40, "Less routine", "Меньше рутины"],
              [30, "More conversions", "Больше конверсий"],
            ].map(([value, en, ru], index) => (
              <Reveal key={value} index={index}>
                <SurfaceCard tone="yellow">
                  <Metric
                    tone="yellow"
                    value={Number(value)}
                    label={copy(lang, String(en), String(ru))}
                  />
                </SurfaceCard>
              </Reveal>
            ))}
          </Grid>
          <div className="aihub-pattern-action">
            <Button tone="yellow" href="#preview-contact">
              {copy(lang, "Get personal demo", "Получить персональное демо")}
            </Button>
          </div>
        </>
      );
      break;
    case "clients":
      content = (
        <>
          <SectionHeading tone="cyan">
            {copy(lang, "Trusted by teams", "Нам доверяют")}
          </SectionHeading>
          <Grid>
            {[
              "HOSPITALITY",
              "REAL ESTATE",
              "FINTECH",
              "HEALTHCARE",
              "RETAIL",
              "LOGISTICS",
            ].map((name, index) => (
              <Reveal key={name} index={index}>
                <SurfaceCard
                  tone={
                    (
                      [
                        "blue",
                        "orange",
                        "purple",
                        "cyan",
                        "green",
                        "yellow",
                      ] as Accent[]
                    )[index]
                  }
                  className="aihub-client-tile"
                >
                  <span>{name}</span>
                  <small>
                    {copy(lang, "Example client", "Пример клиента")}
                  </small>
                </SurfaceCard>
              </Reveal>
            ))}
          </Grid>
        </>
      );
      break;
    case "services":
      content = (
        <>
          <SectionHeading tone="purple">
            {copy(lang, "Our expertise", "Наши направления")}
          </SectionHeading>
          <Grid columns={4}>
            {["AI assistants", "Automation", "Voice AI", "Analytics"].map(
              (name, index) => (
                <Reveal index={index} key={name}>
                  <SurfaceCard tone="purple" className="aihub-stack">
                    <Badge tone="purple">0{index + 1}</Badge>
                    <h3>
                      {lang === "en"
                        ? name
                        : [
                            "AI-ассистенты",
                            "Автоматизация",
                            "Голосовой AI",
                            "Аналитика",
                          ][index]}
                    </h3>
                    <p className="aihub-muted">
                      {copy(
                        lang,
                        "Connected to your workflow. Built to deliver.",
                        "Интегрируется в ваши процессы. Работает на результат.",
                      )}
                    </p>
                    <div className="aihub-row">
                      <GlowDot tone="purple" />
                      <span>API + CRM</span>
                    </div>
                  </SurfaceCard>
                </Reveal>
              ),
            )}
          </Grid>
        </>
      );
      break;
    case "cases":
      content = (
        <>
          <SectionHeading tone="orange">
            {copy(
              lang,
              "Real work. Real impact.",
              "Реальные задачи. Измеримый эффект.",
            )}
          </SectionHeading>
          <Grid>
            {["Hospitality", "Real estate", "Customer support"].map(
              (name, index) => {
                const tone = (["orange", "cyan", "green"] as Accent[])[index];
                return (
                  <Reveal key={name} index={index}>
                    <SurfaceCard tone={tone} className="aihub-stack">
                      <Badge tone={tone}>
                        {lang === "en"
                          ? name
                          : [
                              "Гостеприимство",
                              "Недвижимость",
                              "Поддержка клиентов",
                            ][index]}
                      </Badge>
                      <ProgressRing
                        value={85 - index * 10}
                        label={copy(lang, "Automation", "Автоматизация")}
                        tone={tone}
                      />
                      <h3>
                        {copy(
                          lang,
                          "From conversation to conversion",
                          "От диалога к результату",
                        )}
                      </h3>
                      <ChangeIndicator tone={tone}>
                        {copy(lang, "+32% conversion rate", "+32% к конверсии")}
                      </ChangeIndicator>
                    </SurfaceCard>
                  </Reveal>
                );
              },
            )}
          </Grid>
          <div className="aihub-pattern-action">
            <CtaFrame tone="orange">
              <Button tone="orange" href="#preview-contact">
                {copy(lang, "Get personal demo", "Получить персональное демо")}
              </Button>
            </CtaFrame>
          </div>
        </>
      );
      break;
    case "roadmap":
      content = (
        <>
          <SectionHeading>
            {copy(lang, "Your roadmap to AI", "Дорожная карта внедрения")}
          </SectionHeading>
          <Grid columns={2}>
            {[
              "Discovery",
              "Architecture",
              "Prototype",
              "Integration",
              "Launch & growth",
            ].map((step, index) => (
              <Reveal key={step} index={index}>
                <SurfaceCard>
                  <Badge tone="yellow">
                    {copy(lang, `Phase ${index + 1}`, `Этап ${index + 1}`)}
                  </Badge>
                  <TimelineStep
                    number={index + 1}
                    title={
                      lang === "en"
                        ? step
                        : [
                            "Исследование",
                            "Архитектура",
                            "Прототип",
                            "Интеграция",
                            "Запуск и развитие",
                          ][index]
                    }
                  >
                    {copy(
                      lang,
                      "A clear deliverable. A measurable next step.",
                      "Понятный результат. Измеримый следующий шаг.",
                    )}
                  </TimelineStep>
                </SurfaceCard>
              </Reveal>
            ))}
          </Grid>
        </>
      );
      break;
    case "contact":
      content = (
        <Split>
          <SectionHeading
            tone="blue"
            eyebrow="LET'S TALK"
            description={copy(
              lang,
              "Tell us what you want to improve. We will find the right starting point.",
              "Расскажите, что вы хотите улучшить. Найдём подходящую точку старта.",
            )}
          >
            {copy(
              lang,
              "Let’s build something useful",
              "Создадим что-то полезное",
            )}
          </SectionHeading>
          <SurfaceCard tone="blue">
            <DemoContactForm lang={lang} />
          </SurfaceCard>
        </Split>
      );
      break;
    case "integrations":
      content = (
        <>
          <SectionHeading>
            {copy(lang, "Your tools. Connected.", "Ваши инструменты. Вместе.")}
          </SectionHeading>
          <Grid>
            {[
              ["AI models", "OpenAI", "Claude", "Gemini"],
              ["Automation", "n8n", "Make", "Python"],
              ["Communication", "Telegram", "WhatsApp", "CRM"],
            ].map(([category, ...items], index) => (
              <Reveal key={category} index={index}>
                <SurfaceCard className="aihub-stack">
                  <Badge>{category}</Badge>
                  {items.map((item) => (
                    <div className="aihub-tool-row" key={item}>
                      <GlowDot />
                      <span>{item}</span>
                      <span aria-hidden="true">→</span>
                    </div>
                  ))}
                </SurfaceCard>
              </Reveal>
            ))}
          </Grid>
        </>
      );
      break;
    case "work-process":
      content = (
        <>
          <SectionHeading tone="purple">
            {copy(lang, "How we work", "Процесс работы")}
          </SectionHeading>
          <Grid columns={4}>
            {["Discover", "Design", "Build", "Improve"].map((name, index) => (
              <Reveal key={name} index={index}>
                <TimelineStep
                  number={index + 1}
                  title={
                    lang === "en"
                      ? name
                      : [
                          "Исследуем",
                          "Проектируем",
                          "Разрабатываем",
                          "Улучшаем",
                        ][index]
                  }
                >
                  {copy(
                    lang,
                    "One team. Shared goals. Clear milestones.",
                    "Одна команда. Общие цели. Понятные этапы.",
                  )}
                </TimelineStep>
              </Reveal>
            ))}
          </Grid>
        </>
      );
      break;
    case "team":
      content = (
        <>
          <SectionHeading tone="cyan">
            {copy(
              lang,
              "People behind the intelligence",
              "Люди за технологиями",
            )}
          </SectionHeading>
          <Grid columns={2}>
            {[
              ["Denis Salnikov", "denis-salnikov.jpg", "AI & Automation"],
              ["Elvira", "Elvira.jpeg", "Product & Strategy"],
            ].map(([name, file, role], index) => (
              <Reveal key={name} index={index}>
                <SurfaceCard
                  tone={index ? "purple" : "cyan"}
                  className="aihub-team-card"
                >
                  <img
                    src={`${import.meta.env.BASE_URL}${file}`}
                    width="134"
                    height="134"
                    alt={name}
                    loading="lazy"
                  />
                  <div className="aihub-stack">
                    <h3>{name}</h3>
                    <Badge tone={index ? "purple" : "cyan"}>{role}</Badge>
                    <p className="aihub-muted">
                      {copy(
                        lang,
                        "Technology with a human perspective.",
                        "Технологии с человеческим подходом.",
                      )}
                    </p>
                  </div>
                </SurfaceCard>
              </Reveal>
            ))}
          </Grid>
        </>
      );
      break;
    case "demo":
      content = (
        <div className="aihub-demo-banner">
          <DecorativeGlow />
          <SectionHeading level={1} eyebrow="YOUR NEXT CHAPTER">
            {copy(
              lang,
              "Ready for your next advantage?",
              "Готовы к следующему шагу?",
            )}
          </SectionHeading>
          <CtaFrame>
            <Button href="#preview-contact">
              {copy(lang, "Get personal demo", "Получить персональное демо")}
            </Button>
          </CtaFrame>
        </div>
      );
      break;
    case "footer":
      content = (
        <Grid>
          <div>
            <strong className="aihub-wordmark">
              AIHUB<span>®</span>
            </strong>
            <p className="aihub-muted">
              {copy(lang, "Intelligence. Applied.", "Интеллект в действии.")}
            </p>
          </div>
          <div className="aihub-stack">
            <h3>{copy(lang, "Let’s talk", "Свяжитесь с нами")}</h3>
            <NavLink href="tel:+4915774490172">+49 157 744 901 72</NavLink>
            <NavLink href="mailto:techcrew@aihub.works">
              techcrew@aihub.works
            </NavLink>
            <NavLink
              href="https://www.linkedin.com/company/aihubworks"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn →
            </NavLink>
          </div>
          <div className="aihub-stack">
            <NavLink
              href={`${import.meta.env.BASE_URL}legal/privacy-policy.html`}
            >
              {copy(lang, "Privacy policy", "Политика конфиденциальности")}
            </NavLink>
            <NavLink href={`${import.meta.env.BASE_URL}legal/terms.html`}>
              {copy(lang, "Terms of use", "Условия использования")}
            </NavLink>
          </div>
        </Grid>
      );
      break;
  }
  return (
    <Section
      aria-label={title}
      id={block === "contact" ? "preview-contact" : undefined}
    >
      <PageContainer>{content}</PageContainer>
    </Section>
  );
}

export function PageTemplate({
  type,
  lang = "en",
}: {
  type: "service" | "case";
  lang?: Language;
}) {
  const isCase = type === "case";
  return (
    <>
      <PageContainer>
        <nav
          className="aihub-template-nav"
          aria-label={copy(lang, "Template navigation", "Навигация шаблона")}
        >
          <a
            className="aihub-wordmark"
            href={`${import.meta.env.BASE_URL}design-system.html`}
          >
            AIHUB<span>®</span>
          </a>
          <NavLink href="#preview-contact">
            {copy(lang, "Let’s talk", "Обсудим проект")} →
          </NavLink>
        </nav>
      </PageContainer>
      <Section>
        <PageContainer>
          <Split>
            <div>
              <SectionHeading
                level={1}
                tone={isCase ? "orange" : "green"}
                eyebrow={
                  isCase
                    ? "CASE STUDY / HOSPITALITY"
                    : "SERVICE / AI ASSISTANTS"
                }
                description={
                  isCase
                    ? copy(
                        lang,
                        "An AI concierge that turns guest conversations into better experiences.",
                        "AI-консьерж превращает обращения гостей в качественный сервис.",
                      )
                    : copy(
                        lang,
                        "Automate the routine. Keep the human touch.",
                        "Автоматизируйте рутину. Сохраните человеческий подход.",
                      )
                }
              >
                {isCase
                  ? copy(
                      lang,
                      "Every guest. Personally.",
                      "Каждому гостю. Лично.",
                    )
                  : copy(
                      lang,
                      "Your team’s next superpower",
                      "Новая суперсила вашей команды",
                    )}
              </SectionHeading>
              <CtaFrame tone={isCase ? "orange" : "green"}>
                <Button
                  tone={isCase ? "orange" : "green"}
                  href="#preview-contact"
                >
                  {copy(
                    lang,
                    "Book a consultation",
                    "Записаться на консультацию",
                  )}
                </Button>
              </CtaFrame>
            </div>
            <Orb tone={isCase ? "orange" : "green"} />
          </Split>
        </PageContainer>
      </Section>
      <Section>
        <PageContainer>
          <SectionHeading
            eyebrow={copy(lang, "THE OPPORTUNITY", "ВОЗМОЖНОСТИ")}
            tone={isCase ? "orange" : "cyan"}
          >
            {isCase
              ? copy(
                  lang,
                  "Less waiting. More hospitality.",
                  "Меньше ожидания. Больше заботы.",
                )
              : copy(
                  lang,
                  "Built around your workflow",
                  "Создано под ваши процессы",
                )}
          </SectionHeading>
          {isCase ? (
            <Grid>
              {[85, 32, 40].map((value, index) => (
                <Reveal key={value} index={index}>
                  <SurfaceCard tone="orange" className="aihub-stack">
                    <Metric
                      value={value}
                      tone="orange"
                      label={copy(
                        lang,
                        [
                          "Requests automated",
                          "Conversion increase",
                          "Time saved",
                        ][index],
                        [
                          "Автоматизация запросов",
                          "Рост конверсии",
                          "Экономия времени",
                        ][index],
                      )}
                    />
                    <ChangeIndicator tone="orange">
                      {copy(
                        lang,
                        "Illustrative result",
                        "Демонстрационные данные",
                      )}
                    </ChangeIndicator>
                  </SurfaceCard>
                </Reveal>
              ))}
            </Grid>
          ) : (
            <FeatureCards lang={lang} />
          )}
        </PageContainer>
      </Section>
      <Section>
        <PageContainer>
          <Split>
            <SectionHeading
              tone="purple"
              eyebrow={copy(lang, "THE APPROACH", "ПОДХОД")}
            >
              {isCase
                ? copy(
                    lang,
                    "One connected guest journey",
                    "Единый путь вашего гостя",
                  )
                : copy(
                    lang,
                    "From first idea to everyday impact",
                    "От первой идеи до ежедневной пользы",
                  )}
            </SectionHeading>
            <div className="aihub-stack">
              {[1, 2, 3].map((number, index) => (
                <Reveal key={number} index={index}>
                  <TimelineStep
                    number={number}
                    title={copy(
                      lang,
                      ["Understand", "Connect", "Improve"][index],
                      ["Исследуем", "Интегрируем", "Улучшаем"][index],
                    )}
                  >
                    {copy(
                      lang,
                      "Connect knowledge, tools and people into a measurable process.",
                      "Объединяем знания, инструменты и людей в измеримый процесс.",
                    )}
                  </TimelineStep>
                </Reveal>
              ))}
            </div>
          </Split>
        </PageContainer>
      </Section>
      <BlockPattern block="contact" lang={lang} />
      <BlockPattern block="footer" lang={lang} />
    </>
  );
}
