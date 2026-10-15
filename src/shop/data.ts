import { solutionIconSrc } from "../design-system/SolutionIcon";
import type { SolutionIconName } from "../design-system/SolutionIcon";
import type { Accent } from "../design-system";

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

export const products: Product[] = [
  {
    id: 1,
    slug: "voice-assistant",
    category: "employees",
    price: 1490,
    unit: "setup",
    name: { en: "AI Voice Assistant", ru: "Голосовой AI-ассистент" },
    description: {
      en: "Answers calls 24/7, books appointments and handles routine requests in your voice channel.",
      ru: "Отвечает на звонки 24/7, записывает клиентов и обрабатывает типовые обращения по телефону.",
    },
  },
  {
    id: 2,
    slug: "chat-assistant",
    category: "employees",
    price: 990,
    unit: "setup",
    name: { en: "AI Chat Assistant", ru: "AI-ассистент в чате" },
    description: {
      en: "Text assistant for web chat, Telegram or WhatsApp that handles bookings, orders and feedback.",
      ru: "Помогает с бронированиями, заказами и обратной связью в чате сайта, Telegram или WhatsApp.",
    },
  },
  {
    id: 3,
    slug: "email-orders",
    category: "automation",
    price: 1200,
    unit: "setup",
    name: { en: "Email → 1C Order Processing", ru: "Заказы из почты → 1С" },
    description: {
      en: "Reads purchase orders from email and creates documents in 1C automatically.",
      ru: "Читает заказы из электронной почты и автоматически создаёт документы в 1С.",
    },
  },
  {
    id: 4,
    slug: "document-autofill",
    category: "automation",
    price: 690,
    unit: "setup",
    name: { en: "Document Auto-fill", ru: "Автозаполнение документов" },
    description: {
      en: "Fills contracts, forms and reports from your data in seconds instead of hours.",
      ru: "Заполняет договоры, формы и отчёты из ваших данных за секунды вместо часов ручной работы.",
    },
  },
  {
    id: 5,
    slug: "kpi-reporting",
    category: "analytics",
    price: 890,
    unit: "setup",
    name: { en: "KPI Reporting Bot", ru: "Бот для KPI-отчётов" },
    description: {
      en: "Collects partner and team metrics and delivers structured reports on schedule.",
      ru: "Собирает показатели партнёров и команды, формирует структурированные отчёты по расписанию.",
    },
  },
  {
    id: 6,
    slug: "sentiment-monitor",
    category: "analytics",
    price: 790,
    unit: "setup",
    name: { en: "Chat Sentiment Monitor", ru: "Анализ тональности чатов" },
    description: {
      en: "Tracks customer mood across Telegram chats and alerts you about negative trends.",
      ru: "Анализирует настроение клиентов в Telegram-чатах и предупреждает о негативных тенденциях.",
    },
  },
  {
    id: 7,
    slug: "recommendations",
    category: "recommendations",
    price: 1290,
    unit: "setup",
    name: { en: "Product Recommendations", ru: "Персональные рекомендации" },
    description: {
      en: "Personalized suggestions that lift average order value by 20–30%.",
      ru: "Персонализированные предложения товаров для увеличения среднего чека на 20–30%.",
    },
  },
  {
    id: 8,
    slug: "discovery-workshop",
    category: "consulting",
    price: 290,
    unit: "session",
    name: { en: "AI Discovery Workshop", ru: "Воркшоп по внедрению AI" },
    description: {
      en: "A 2-hour session to map your processes and find the fastest AI wins.",
      ru: "Двухчасовая сессия: изучаем ваши процессы и находим задачи, где AI даст быстрый результат.",
    },
  },
];

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
    emptyText: "Add a solution to try the demo checkout.",
    keepBrowsing: "Explore solutions",
    remove: "Remove",
    decrease: "Decrease quantity",
    increase: "Increase quantity",
    quantity: "Quantity",
    total: "Total",
    emptyTextLive: "Add a solution to place an order.",
    checkoutLive: "Proceed to checkout",
    cartDisclaimerLive:
      "Secure checkout and payment by Ecwid. You'll confirm the order on the next step.",
    checkoutTitle: "Checkout",
    checkoutIntro:
      "Confirm your contact details and pay securely. After the order, our team will reach out to plan the integration.",
    checkoutBack: "Back to the store",
    checkoutLoading: "Loading secure checkout…",
    checkoutError:
      "Checkout is temporarily unavailable. Please try again later or contact us.",
    checkoutDisabled:
      "Online checkout is not enabled yet. You can place a demo order in the store or contact our team.",
    checkoutDone:
      "Thank you! Your order is confirmed. We'll contact you shortly.",
    checkout: "Create demo order",
    cartDisclaimer:
      "Demo only. No payment is collected and no request is sent to the AIHUB team.",
    successEyebrow: "Local demo",
    successTitle: "Your demo order\nis ready.",
    successText:
      "Nothing has been charged or sent. This preview is stored only in this session. To discuss a real project, contact our team.",
    order: "Order reference",
    details: "View order data",
    continue: "Continue exploring",
    successContact: "Discuss this project",
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
    emptyText: "Добавьте решение и попробуйте демо-оформление.",
    keepBrowsing: "Смотреть решения",
    remove: "Удалить",
    decrease: "Уменьшить количество",
    increase: "Увеличить количество",
    quantity: "Количество",
    total: "Итого",
    emptyTextLive: "Добавьте решение, чтобы оформить заказ.",
    checkoutLive: "Перейти к оформлению",
    cartDisclaimerLive:
      "Безопасное оформление и оплата через Ecwid. Заказ подтверждается на следующем шаге.",
    checkoutTitle: "Оформление заказа",
    checkoutIntro:
      "Укажите контакты и оплатите заказ. После оформления команда свяжется с вами, чтобы спланировать внедрение.",
    checkoutBack: "Вернуться в магазин",
    checkoutLoading: "Загружаем безопасное оформление…",
    checkoutError:
      "Оформление временно недоступно. Попробуйте позже или свяжитесь с нами.",
    checkoutDisabled:
      "Онлайн-оформление пока не подключено. Можно создать демо-заказ в магазине или связаться с командой.",
    checkoutDone:
      "Спасибо! Заказ подтверждён. Мы скоро свяжемся с вами.",
    checkout: "Создать демо-заказ",
    cartDisclaimer:
      "Только демонстрация. Оплата не взимается, заявка команде AIHUB не отправляется.",
    successEyebrow: "Локальная демонстрация",
    successTitle: "Ваш демо-заказ\nготов.",
    successText:
      "Ничего не списано и не отправлено. Предпросмотр хранится только в текущей сессии. Для реального проекта свяжитесь с командой.",
    order: "Номер заказа",
    details: "Посмотреть данные заказа",
    continue: "Продолжить просмотр",
    successContact: "Обсудить проект",
    skip: "К решениям",
  },
} satisfies Record<ShopLanguage, Record<string, string>>;
