import { solutionIconSrc } from "../design-system/SolutionIcon";
import type { SolutionIconName } from "../design-system/SolutionIcon";
import type { Accent } from "../design-system";
import commercialCatalog from "../../backend/contact-api/shared/catalog.json";

export type ShopLanguage = "en" | "ru";
export type CategoryId =
  | "employees"
  | "automation"
  | "analytics"
  | "recommendations"
  | "consulting";
type Localized = Record<ShopLanguage, string>;
export interface Product {
  id: number;
  slug: SolutionIconName;
  category: CategoryId;
  price: number;
  unit: "setup" | "session";
  name: Localized;
  description: Localized;
}

export const categories: { id: CategoryId; name: Localized; tone: Accent }[] = [
  {
    id: "employees",
    name: { en: "Virtual employees", ru: "AI-сотрудники" },
    tone: "green",
  },
  {
    id: "automation",
    name: { en: "Automation", ru: "Автоматизация" },
    tone: "blue",
  },
  {
    id: "analytics",
    name: { en: "AI analytics", ru: "AI-аналитика" },
    tone: "cyan",
  },
  {
    id: "recommendations",
    name: { en: "Recommendations", ru: "Рекомендации" },
    tone: "yellow",
  },
  {
    id: "consulting",
    name: { en: "Consulting", ru: "Консалтинг" },
    tone: "orange",
  },
];

const productDetails: Omit<Product, "name" | "price" | "unit">[] = [
  {
    id: 1,
    slug: "voice-assistant",
    category: "employees",
    description: {
      en: "Answers calls 24/7, books appointments and handles routine requests in your voice channel.",
      ru: "Отвечает на звонки 24/7, записывает клиентов и обрабатывает типовые обращения по телефону.",
    },
  },
  {
    id: 2,
    slug: "chat-assistant",
    category: "employees",
    description: {
      en: "Text assistant for web chat, Telegram or WhatsApp that handles bookings, orders and feedback.",
      ru: "Помогает с бронированиями, заказами и обратной связью в чате сайта, Telegram или WhatsApp.",
    },
  },
  {
    id: 3,
    slug: "email-orders",
    category: "automation",
    description: {
      en: "Reads purchase orders from email and creates documents in 1C automatically.",
      ru: "Читает заказы из электронной почты и автоматически создаёт документы в 1С.",
    },
  },
  {
    id: 4,
    slug: "document-autofill",
    category: "automation",
    description: {
      en: "Fills contracts, forms and reports from your data in seconds instead of hours.",
      ru: "Заполняет договоры, формы и отчёты из ваших данных за секунды вместо часов ручной работы.",
    },
  },
  {
    id: 5,
    slug: "kpi-reporting",
    category: "analytics",
    description: {
      en: "Collects partner and team metrics and delivers structured reports on schedule.",
      ru: "Собирает показатели партнёров и команды, формирует структурированные отчёты по расписанию.",
    },
  },
  {
    id: 6,
    slug: "sentiment-monitor",
    category: "analytics",
    description: {
      en: "Tracks customer mood across Telegram chats and alerts you about negative trends.",
      ru: "Анализирует настроение клиентов в Telegram-чатах и предупреждает о негативных тенденциях.",
    },
  },
  {
    id: 7,
    slug: "recommendations",
    category: "recommendations",
    description: {
      en: "Personalized suggestions that lift average order value by 20–30%.",
      ru: "Персонализированные предложения товаров для увеличения среднего чека на 20–30%.",
    },
  },
  {
    id: 8,
    slug: "discovery-workshop",
    category: "consulting",
    description: {
      en: "A 2-hour session to map your processes and find the fastest AI wins.",
      ru: "Двухчасовая сессия: изучаем ваши процессы и находим задачи, где AI даст быстрый результат.",
    },
  },
];

export const products: Product[] = productDetails.map((detail) => {
  const commercial = commercialCatalog.products.find((p) => p.id === detail.id);
  if (!commercial || !["setup", "session"].includes(commercial.unit))
    throw new Error("Invalid shared catalog");
  return {
    ...detail,
    name: commercial.name,
    price: commercial.unitPriceMinor / 100,
    unit: commercial.unit as Product["unit"],
  };
});

export const productIcon = (product: Product) => solutionIconSrc(product.slug);
export const formatPrice = (price: number, lang: ShopLanguage) =>
  new Intl.NumberFormat(lang === "ru" ? "ru-RU" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

export const copy = {
  en: {
    home: "Back to AIHUB",
    services: "Services",
    cases: "Cases",
    contact: "Contact",
    cart: "Cart",
    language: "Switch to Russian",
    eyebrow: "AIHUB / Solutions store",
    title: "Ready-made AI.",
    titleAccent: "Made for you.",
    intro:
      "Less routine. More room to grow. Choose the assistants and automations your business needs. We'll take care of the integration.",
    browse: "Explore solutions",
    catalog: "Find your next advantage.",
    catalogLabel: "The collection",
    all: "All solutions",
    search: "Search solutions",
    searchPlaceholder: "Try “assistant” or “reports”",
    found: "solutions",
    clear: "Reset filters",
    noResults: "No match. A fresh start?",
    noResultsText: "Try a different keyword or explore all solutions.",
    add: "Add to cart",
    added: "added to cart",
    setup: "one-time setup",
    session: "per session",
    product: "Solution",
    customLabel: "A different challenge?",
    customTitle: "Your idea.\nOur next solution.",
    customText:
      "Not every business fits a template. Let's build the AI that fits yours.",
    customCta: "Talk to the team",
    helpEyebrow: "Start with a conversation",
    helpTitle: "Not sure where\nto start?",
    helpText:
      "Tell us what slows your team down. We'll help you find the right solution, without the guesswork.",
    helpCta: "Book a consultation",
    footerLine: "AI that works. For your business.",
    privacy: "Privacy policy",
    terms: "Terms of service",
    top: "Back to top",
    cartTitle: "Your AI toolkit",
    close: "Close",
    empty: "Your next upgrade starts here.",
    emptyText: "Add a solution to request a proposal from our team.",
    keepBrowsing: "Explore solutions",
    remove: "Remove",
    decrease: "Decrease quantity",
    increase: "Increase quantity",
    quantity: "Quantity",
    total: "Indicative estimate",
    checkout: "Continue to request",
    cartDisclaimer:
      "No payment or contract at this stage. VAT and final pricing are agreed with our team.",
    skip: "Skip to solutions",
  },
  ru: {
    home: "На главную AIHUB",
    services: "Услуги",
    cases: "Кейсы",
    contact: "Контакты",
    cart: "Корзина",
    language: "Switch to English",
    eyebrow: "AIHUB / Магазин решений",
    title: "Готовый AI.",
    titleAccent: "Ваш результат.",
    intro:
      "Меньше рутины. Больше возможностей. Выберите ассистентов и автоматизации для своего бизнеса. Мы позаботимся об интеграции.",
    browse: "Выбрать решение",
    catalog: "Найдите своё преимущество.",
    catalogLabel: "Коллекция решений",
    all: "Все решения",
    search: "Поиск решений",
    searchPlaceholder: "Например, «ассистент» или «отчёт»",
    found: "решений",
    clear: "Сбросить фильтры",
    noResults: "Ничего не найдено. Попробуем ещё?",
    noResultsText: "Измените запрос или посмотрите все решения.",
    add: "В корзину",
    added: "добавлено в корзину",
    setup: "разовое внедрение",
    session: "за сессию",
    product: "Решение",
    customLabel: "Другая задача?",
    customTitle: "Ваша идея.\nНаше новое решение.",
    customText:
      "Бизнес не всегда укладывается в шаблон. Создадим AI именно под ваши процессы.",
    customCta: "Обсудить задачу",
    helpEyebrow: "Начнём с разговора",
    helpTitle: "Не знаете,\nс чего начать?",
    helpText:
      "Расскажите, что замедляет работу команды. Поможем выбрать подходящее решение без лишних догадок.",
    helpCta: "Записаться на консультацию",
    footerLine: "AI, который работает на ваш бизнес.",
    privacy: "Конфиденциальность",
    terms: "Условия использования",
    top: "Наверх",
    cartTitle: "Ваш набор AI-решений",
    close: "Закрыть",
    empty: "Ваш следующий шаг начинается здесь.",
    emptyText: "Добавьте решение, чтобы запросить предложение у нашей команды.",
    keepBrowsing: "Смотреть решения",
    remove: "Удалить",
    decrease: "Уменьшить количество",
    increase: "Увеличить количество",
    quantity: "Количество",
    total: "Ориентировочная стоимость",
    checkout: "Перейти к заявке",
    cartDisclaimer:
      "Без оплаты и заключения договора. VAT и окончательная цена согласуются с менеджером.",
    skip: "К решениям",
  },
} satisfies Record<ShopLanguage, Record<string, string>>;
