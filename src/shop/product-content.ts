// Product page texts by slug. Package keys must match the package ids in
// backend/contact-api/shared/catalog.json; data.ts and check-shop-pages verify it.
// Wording rule: describe scope, never promise results, speed or a fixed price.
type Localized = { en: string; ru: string };

export interface ProductContent {
  packages: Record<string, Localized[]>;
  priceFactors: Localized[];
  timeline: Localized;
}

const weeks = (from: number, to: number): Localized => ({
  en: `Usually ${from}–${to} weeks after the scope is agreed.`,
  ru: `Обычно ${from}–${to} ${to <= 4 ? "недели" : "недель"} после согласования объёма.`,
});

export const productContent: Record<string, ProductContent> = {
  "voice-assistant": {
    packages: {
      start: [
        { en: "One phone line and one main scenario", ru: "Одна линия и один основной сценарий" },
        { en: "Answers to frequent questions from your materials", ru: "Ответы на частые вопросы по вашим материалам" },
        { en: "Call summaries sent to email or a messenger", ru: "Итоги звонков на почту или в мессенджер" },
      ],
      business: [
        { en: "Several scenarios, such as booking and enquiries", ru: "Несколько сценариев, например запись и консультации" },
        { en: "Integration with a calendar or CRM", ru: "Интеграция с календарём или CRM" },
        { en: "Transfer to a person on agreed triggers", ru: "Перевод на сотрудника по согласованным условиям" },
        { en: "Call reports for the team", ru: "Отчёты по звонкам для команды" },
      ],
      pro: [
        { en: "Several integrations and languages", ru: "Несколько интеграций и языков" },
        { en: "Complex call logic and custom scripts", ru: "Сложная логика звонков и индивидуальные скрипты" },
        { en: "Extended launch support", ru: "Расширенное сопровождение запуска" },
        { en: "Scope and final price agreed in the proposal", ru: "Объём и итоговая цена уточняются в предложении" },
      ],
    },
    priceFactors: [
      { en: "Number of scenarios and call branches", ru: "Количество сценариев и веток разговора" },
      { en: "Systems to connect: calendar, CRM, telephony", ru: "Какие системы подключать: календарь, CRM, телефония" },
      { en: "Languages and voice requirements", ru: "Языки и требования к голосу" },
      { en: "Expected call volume", ru: "Ожидаемый объём звонков" },
    ],
    timeline: weeks(3, 6),
  },
  "chat-assistant": {
    packages: {
      standard: [
        { en: "One channel: website chat, Telegram or WhatsApp", ru: "Один канал: чат сайта, Telegram или WhatsApp" },
        { en: "Knowledge base built from your documents", ru: "База знаний на основе ваших документов" },
        { en: "Handover to a person when the assistant is unsure", ru: "Передача сотруднику, если ассистент не уверен" },
        { en: "Conversation history for the team", ru: "История диалогов для команды" },
      ],
    },
    priceFactors: [
      { en: "Size and structure of the knowledge base", ru: "Объём и структура базы знаний" },
      { en: "Channel and its technical setup", ru: "Канал и его техническая настройка" },
      { en: "Need for bookings or orders inside the chat", ru: "Нужны ли записи или заказы прямо в чате" },
    ],
    timeline: weeks(2, 4),
  },
  "email-orders": {
    packages: {
      start: [
        { en: "One mailbox and one order format", ru: "Один почтовый ящик и один формат заказа" },
        { en: "Order documents created in 1C for review", ru: "Создание документов заказа в 1С для проверки" },
        { en: "Notifications about orders that need attention", ru: "Уведомления о заказах, требующих внимания" },
      ],
      extended: [
        { en: "Several mailboxes and order formats", ru: "Несколько ящиков и форматов заказов" },
        { en: "Checks against prices and stock", ru: "Сверка с ценами и остатками" },
        { en: "Queue for exceptions with manual review", ru: "Очередь исключений с ручной проверкой" },
        { en: "Processing reports", ru: "Отчёты по обработке" },
      ],
    },
    priceFactors: [
      { en: "Number of mailboxes and order formats", ru: "Количество ящиков и форматов заказов" },
      { en: "1C configuration and access", ru: "Конфигурация 1С и доступы" },
      { en: "Validation rules and exceptions", ru: "Правила проверки и исключения" },
    ],
    timeline: weeks(2, 5),
  },
  "document-autofill": {
    packages: {
      start: [
        { en: "One document template", ru: "Один шаблон документа" },
        { en: "Data from one source, such as a spreadsheet", ru: "Данные из одного источника, например таблицы" },
        { en: "Documents ready for your review", ru: "Готовые документы для вашей проверки" },
      ],
      extended: [
        { en: "Up to five document templates", ru: "До пяти шаблонов документов" },
        { en: "Data from a CRM or several spreadsheets", ru: "Данные из CRM или нескольких таблиц" },
        { en: "Field checks before a document is created", ru: "Проверка полей перед созданием документа" },
      ],
    },
    priceFactors: [
      { en: "Number and complexity of templates", ru: "Количество и сложность шаблонов" },
      { en: "Where the data comes from", ru: "Откуда берутся данные" },
      { en: "Required checks and formats", ru: "Нужные проверки и форматы" },
    ],
    timeline: weeks(1, 3),
  },
  "kpi-reporting": {
    packages: {
      start: [
        { en: "One data source", ru: "Один источник данных" },
        { en: "One report on a schedule", ru: "Один отчёт по расписанию" },
        { en: "Delivery to email or Telegram", ru: "Отправка на почту или в Telegram" },
      ],
      extended: [
        { en: "Several data sources", ru: "Несколько источников данных" },
        { en: "Reports for different roles or partners", ru: "Отчёты для разных ролей или партнёров" },
        { en: "Alerts when a metric leaves its range", ru: "Оповещения, если показатель выходит за пределы" },
      ],
    },
    priceFactors: [
      { en: "Number of sources and metrics", ru: "Количество источников и показателей" },
      { en: "How data is accessed", ru: "Как предоставляется доступ к данным" },
      { en: "Number of report variants", ru: "Количество вариантов отчёта" },
    ],
    timeline: weeks(1, 3),
  },
  "sentiment-monitor": {
    packages: {
      start: [
        { en: "A set of Telegram chats agreed with you", ru: "Набор Telegram-чатов, согласованный с вами" },
        { en: "Weekly mood digest", ru: "Еженедельная сводка настроений" },
        { en: "Main topics of negative messages", ru: "Основные темы негативных сообщений" },
      ],
      extended: [
        { en: "More chats and categories", ru: "Больше чатов и категорий" },
        { en: "Alerts about negative trends", ru: "Оповещения о негативных тенденциях" },
        { en: "Dashboard for the team", ru: "Дашборд для команды" },
      ],
    },
    priceFactors: [
      { en: "Number of chats and message volume", ru: "Количество чатов и объём сообщений" },
      { en: "Categories and alert rules", ru: "Категории и правила оповещений" },
      { en: "Reporting format", ru: "Формат отчётности" },
    ],
    timeline: weeks(2, 4),
  },
  recommendations: {
    packages: {
      start: [
        { en: "Recommendations in one placement, such as the cart", ru: "Рекомендации в одном месте, например в корзине" },
        { en: "Rules based on your catalogue and order history", ru: "Правила на основе каталога и истории заказов" },
        { en: "Basic performance report", ru: "Базовый отчёт по показам и кликам" },
      ],
      business: [
        { en: "Several placements on the site", ru: "Несколько мест на сайте" },
        { en: "Personalisation by customer behaviour", ru: "Персонализация по поведению покупателя" },
        { en: "Integration with your e-commerce platform", ru: "Интеграция с вашей e-commerce платформой" },
      ],
      pro: [
        { en: "Several channels, such as site and email", ru: "Несколько каналов, например сайт и рассылки" },
        { en: "Custom models and A/B tests", ru: "Индивидуальные модели и A/B-тесты" },
        { en: "Scope and final price agreed in the proposal", ru: "Объём и итоговая цена уточняются в предложении" },
      ],
    },
    priceFactors: [
      { en: "Catalogue size and data quality", ru: "Размер каталога и качество данных" },
      { en: "Number of placements and channels", ru: "Количество мест показа и каналов" },
      { en: "Platform and integration effort", ru: "Платформа и сложность интеграции" },
      { en: "Testing and analytics requirements", ru: "Требования к тестам и аналитике" },
    ],
    timeline: weeks(4, 8),
  },
  "discovery-workshop": {
    packages: {
      session: [
        { en: "Two hours online", ru: "Два часа онлайн" },
        { en: "Up to five participants", ru: "До пяти участников" },
        { en: "A list of processes where AI may help", ru: "Список процессов, где AI может помочь" },
      ],
      team: [
        { en: "Up to twelve participants", ru: "До двенадцати участников" },
        { en: "Preparation interviews with key people", ru: "Подготовительные интервью с ключевыми сотрудниками" },
        { en: "Written conclusions and an opportunity map", ru: "Письменные выводы и карта возможностей" },
      ],
    },
    priceFactors: [
      { en: "Number of participants", ru: "Количество участников" },
      { en: "Preparation and written materials", ru: "Подготовка и письменные материалы" },
      { en: "Online or on-site format", ru: "Онлайн или выездной формат" },
    ],
    timeline: {
      en: "Date agreed with you after the request.",
      ru: "Дата согласуется с вами после заявки.",
    },
  },
};
