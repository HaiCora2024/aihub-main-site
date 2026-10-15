import type { Accent } from "./components";

export const palette: {
  name: string;
  key: string;
  role: string;
  tone?: Accent;
}[] = [
  {
    name: "Midnight",
    key: "bg",
    role: "Основной фон страницы; тёмный текст на ярких CTA.",
  },
  {
    name: "White",
    key: "text",
    role: "Основной текст и заголовки на тёмных поверхностях.",
  },
  { name: "Mist", key: "muted", role: "Вторичный текст, описания и подписи." },
  {
    name: "Green",
    key: "green",
    tone: "green",
    role: "Главное действие, Hero, Roadmap, Tools, успешный результат.",
  },
  {
    name: "Blue",
    key: "blue",
    tone: "blue",
    role: "Контактная форма, доверие, информационные состояния.",
  },
  {
    name: "Yellow",
    key: "yellow",
    tone: "yellow",
    role: "Results, числовые акценты, даты и шаги процесса.",
  },
  {
    name: "Orange",
    key: "orange",
    tone: "orange",
    role: "CTA в Cases, эффективность, дополнительное действие.",
  },
  {
    name: "Purple",
    key: "purple",
    tone: "purple",
    role: "Services и Work Process. Не заменяет основной зелёный CTA.",
  },
  {
    name: "Cyan",
    key: "cyan",
    tone: "cyan",
    role: "Интеграции, вторичные показатели, клавиатурный фокус.",
  },
  {
    name: "Red",
    key: "red",
    tone: "red",
    role: "Ошибки и отрицательная динамика; всегда вместе с текстом.",
  },
];
export const typography = [
  {
    role: "Display / Hero",
    key: "hero",
    mobile: "hero-mobile",
    weight: "regular",
    leading: "display",
    example: "Intelligence. Applied.",
    ru: "Интеллект, который работает.",
  },
  {
    role: "Section / H2",
    key: "section",
    mobile: "section-mobile",
    weight: "regular",
    leading: "title",
    example: "Built for your business",
    ru: "Решения для вашего бизнеса",
  },
  {
    role: "Title / H3",
    key: "title",
    mobile: "title-mobile",
    weight: "medium",
    leading: "title",
    example: "From idea to impact",
    ru: "От первой идеи до измеримого результата",
  },
  {
    role: "Subtitle / H4",
    key: "subtitle",
    mobile: "subtitle-mobile",
    weight: "medium",
    leading: "title",
    example: "Your next advantage",
    ru: "Ваше следующее конкурентное преимущество",
  },
  {
    role: "Lead",
    key: "lead",
    mobile: "lead-mobile",
    weight: "regular",
    leading: "body",
    example: "AI assistants designed around the way you work.",
    ru: "AI-ассистенты, которые учитывают особенности ваших рабочих процессов.",
  },
  {
    role: "Body",
    key: "body",
    weight: "regular",
    leading: "body",
    example: "One system. Every customer conversation.",
    ru: "Единая система для обработки обращений клиентов и автоматизации повседневных задач.",
  },
  {
    role: "Compact",
    key: "small",
    weight: "regular",
    leading: "body",
    example: "Designed to integrate with your existing tools.",
    ru: "Интеграция с привычными инструментами вашей команды.",
  },
  {
    role: "Caption",
    key: "caption",
    weight: "medium",
    leading: "body",
    example: "PRODUCT SYSTEM / VERSION 1.0",
    ru: "ДИЗАЙН-СИСТЕМА / ВЕРСИЯ 1.0",
  },
];
export const spaces = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80];
export const componentNames = [
  "PageContainer",
  "Section",
  "SectionHeading",
  "Grid",
  "Split",
  "Button",
  "CtaFrame",
  "NavLink",
  "SurfaceCard",
  "Badge",
  "GlowDot",
  "DecorativeGlow",
  "TextField",
  "FormMessage",
  "DemoContactForm",
  "Metric",
  "ProgressRing",
  "ChangeIndicator",
  "TimelineStep",
  "Reveal",
  "SolutionIcon",
];
export type BlockId =
  | "hero"
  | "results"
  | "clients"
  | "services"
  | "cases"
  | "roadmap"
  | "contact"
  | "integrations"
  | "work-process"
  | "team"
  | "demo"
  | "footer";
export type Block = {
  id: BlockId;
  name: string;
  ru: string;
  folder: string;
  tone: Accent;
  components: string;
  composition: string;
  responsive: string;
  dimensions: string;
};
export const blocks: Block[] = [
  {
    id: "hero",
    name: "Hero",
    ru: "Первый экран",
    folder: "01_hero_custom_ai_assistant",
    tone: "green",
    components: "SectionHeading · Split · CtaFrame · Button",
    composition:
      "Крупный оффер слева, декоративный объект справа. Единственный главный CTA и спокойная навигация.",
    dimensions: "Заголовок 86 / 42 px; контейнер 1140 px; CTA 64 px.",
    responsive:
      "До 1200 px колонки складываются; текст остаётся первым. Декор не влияет на ширину.",
  },
  {
    id: "results",
    name: "Results",
    ru: "Результаты для бизнеса",
    folder: "02_instant_business_results",
    tone: "yellow",
    components: "Grid · SurfaceCard · Metric · Button",
    composition:
      "Три равнозначных результата, жёлтый акцент. Показатель крупнее пояснения, CTA под карточками.",
    dimensions: "H2 64 / 36 px; карточки R30; gap 24 px.",
    responsive:
      "1 / 2 / 3 колонки на mobile / tablet / desktop. Высота карточек по содержимому.",
  },
  {
    id: "clients",
    name: "Clients",
    ru: "Наши клиенты",
    folder: "03_clients_logos",
    tone: "cyan",
    components: "Grid · SurfaceCard · Reveal",
    composition:
      "Равные по значимости логотипы на стеклянных плитках. Акцентные рамки не меняют геометрию.",
    dimensions: "Единый R30 для всех цветов, padding 32 / 24 px.",
    responsive:
      "1 / 2 / 3 колонки. Логотипы вписаны через object-fit: contain; не обрезать углы пятой плитки.",
  },
  {
    id: "services",
    name: "Services",
    ru: "Наши направления",
    folder: "04_services_directions",
    tone: "purple",
    components: "Grid · SurfaceCard · Badge · GlowDot",
    composition:
      "Четыре направления, иерархия заголовок → описание → возможности. Фиолетовый обозначает раздел, не все действия.",
    dimensions: "H2 64 / 36 px; заголовок карточки 24 / 22 px.",
    responsive:
      "1 / 2 / 4 колонки. Карточки и элементы появляются последовательно, без фиксированной высоты.",
  },
  {
    id: "cases",
    name: "Cases",
    ru: "Кейсы",
    folder: "06_cases_animated",
    tone: "orange",
    components: "SurfaceCard · Metric · ProgressRing · ChangeIndicator",
    composition:
      "Карточки с контекстом и измеримым результатом. Один акцент внутри каждой карточки; оранжевый CTA.",
    dimensions: "Показатель 64 px, кольцо 112 px, gap 24 px.",
    responsive:
      "Новая сетка 1 / 2 / 3 колонки; счётчики запускаются только после появления карточки.",
  },
  {
    id: "roadmap",
    name: "Roadmap",
    ru: "Дорожная карта",
    folder: "07_roadmap",
    tone: "green",
    components: "TimelineStep · Badge · SurfaceCard · Reveal",
    composition:
      "Пять последовательных этапов; зелёные поверхности и жёлтые бейджи сроков. Сначала порядок, затем детали.",
    dimensions: "Контейнер 1140 px; бейдж R12; шаг 64 px.",
    responsive:
      "На desktop две колонки; на mobile единый вертикальный порядок. Не уменьшать весь блок transform: scale().",
  },
  {
    id: "contact",
    name: "Contact",
    ru: "Контактная форма",
    folder: "08_contact_form",
    tone: "blue",
    components: "Split · TextField · FormMessage · Button",
    composition:
      "Имя и e-mail обязательны, телефон опционален. Текст согласия и статус рядом с отправкой. Синий цвет действия.",
    dimensions: "Поля 72 px, R30; вертикальный gap 24 px.",
    responsive:
      "Колонки складываются до 1200 px. Поля на всю ширину; сообщение ошибки не перекрывает следующий элемент.",
  },
  {
    id: "integrations",
    name: "Tools",
    ru: "Инструменты и интеграции",
    folder: "09_ai_process_integrations",
    tone: "green",
    components: "SurfaceCard · Badge · GlowDot · DecorativeGlow",
    composition:
      "Инструменты сгруппированы по назначению; зелёные бейджи категорий. Декоративное яйцо отделено от текста.",
    dimensions: "R30 снаружи, R20 внутри; gap 24 px.",
    responsive:
      "Группы 1 / 2 / 3 колонки. Не переносить абсолютные смещения яйца из исходного макета на новые страницы.",
  },
  {
    id: "work-process",
    name: "Work Process",
    ru: "Процесс работы",
    folder: "10_work_process",
    tone: "purple",
    components: "Grid · TimelineStep · Reveal",
    composition:
      "Четыре шага с жёлтыми номерами на фоне фиолетового раздела. Последовательное раскрытие сохраняет порядок.",
    dimensions: "H2 64 / 36 px; цифры нового kit 64 px (в исходнике 96 px).",
    responsive:
      "4 колонки на desktop, 2 на tablet, 1 на mobile. В новой сетке нет масштабирования 1920px-сцены.",
  },
  {
    id: "team",
    name: "Team",
    ru: "Команда",
    folder: "11_team",
    tone: "cyan",
    components: "Grid · SurfaceCard · Badge",
    composition:
      "Человеческое лицо, имя, роль и специализация. Акцентная рамка вторична по отношению к контенту.",
    dimensions: "Фото 134 × 134 px, R20; карточка R30.",
    responsive:
      "1 / 2 колонки. Длинные имена и роли переносятся; текст не ужимается ради фиксированной высоты.",
  },
  {
    id: "demo",
    name: "Demo CTA",
    ru: "Финальный призыв",
    folder: "12_demo_cta",
    tone: "green",
    components: "SectionHeading · CtaFrame · DecorativeGlow",
    composition:
      "Короткий сильный оффер и одно действие. Зелёное свечение поддерживает CTA, но не конкурирует с ним.",
    dimensions: "Display 86 / 42 px; рамка и кнопка центрируются вместе.",
    responsive:
      "На узком экране текст переносится естественно. CTA не шире контейнера; ссылка ведёт к форме.",
  },
  {
    id: "footer",
    name: "Footer",
    ru: "Контакты и юридические ссылки",
    folder: "13_footer_contacts",
    tone: "green",
    components: "PageContainer · Grid · NavLink",
    composition:
      "Логотип, способы связи и юридическая информация. Контакты остаются настоящими ссылками mailto / tel.",
    dimensions: "Основной текст 16 px, подписи 12 px; touch-target ≥44 px.",
    responsive:
      "1 / 2 / 3 колонки; ссылки переносятся и не создают горизонтальный скролл.",
  },
];
export const sections = [
  ["overview", "Обзор"],
  ["colors", "Цвет"],
  ["typography", "Типографика"],
  ["layout", "Сетка"],
  ["effects", "Эффекты"],
  ["icons", "3D-иконки"],
  ["components", "Компоненты"],
  ["motion", "Движение"],
  ["atlas", "12 блоков"],
  ["templates", "Шаблоны"],
  ["rules", "Правила"],
  ["implementation", "Подключение"],
] as const;
export const sourceUrl = (folder: string) =>
  `https://github.com/getcher123/aihub-site/blob/main/${folder}/src/screens/Home/Home.tsx`;
