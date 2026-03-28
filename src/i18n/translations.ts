export type Lang = "en" | "ru";

export const translations = {
  en: {
    langSwitch: "RU",
    hero: {
      lines: [
        { text: "YOUR CUSTOM ", color: "text-[#ffffff]" },
        { text: "AI-ASSISTANT", color: "text-[#08d070]" },
        { text: "IN TWO WEEKS", color: "text-[#ffffff]" },
      ],
      nav: ["Services", "Cases", "Roadmap", "Team"],
      tagline: "The first AI agency that combines cutting-edge technologies with deep understanding of business operational problems",
      cardTitle: "Boost your work efficiency",
      cardText: "Our automations save your time and effort. We don't break existing processes — we enhance them with AI.",
      ctaLine1: "Book",
      ctaLine2: "a consultation",
    },
    results: {
      title1: "INSTANT RESULTS",
      title2: "FOR YOUR BUSINESS",
      ctaLine1: "Get",
      ctaLine2: "personal demo",
      cards: [
        { title: "Time Savings", text: "Automation frees the team from routine" },
        { title: "Risk Protection", text: "Proven solutions with guaranteed results" },
        { title: "Proven Effectiveness", text: "11 successful cases" },
      ],
    },
    clients: {
      part1: "OUR ",
      part2: "CLIENTS",
    },
    services: {
      part1: "OUR ",
      part2: "DIRECTIONS",
      items: [
        {
          title: "Virtual Employees",
          textShort: "Reduce customer support costs by 3x. Voice and text AI assistants are embedded in your communication channels, work 24/7 and help close routine requests without overloading the team.",
          textLong: "Reduce customer support costs by 3x. Voice and text AI assistants are embedded in your communication channels (web, TG, PMS), work 24/7, instantly respond and solve problems, reduce customer stress, find common ground with them, answer simple and complex questions, offer discounts, and simplify tasks: appointment booking, order processing, feedback collection.",
        },
        {
          title: "Business Process Automation",
          textShort: "Free employees from routine and speed up work by 5-10x: data processing, content creation, document filling, reporting and other repetitive operations.",
          textLong: "Free employees from routine and speed up work by 5-10x. Instead of manual processing and structuring of data, you get automatic creation of product descriptions, articles, social media posts, order processing, document filling, and reporting.",
        },
        {
          title: "AI Analytics",
          textShort: "Get structured reports, data recognition, forecasts and custom analytics. We can analyze text, numbers, voice and video for making more accurate decisions.",
          textLong: "You upload your data and with AI tools you get: structured reports, real-time news/quotes updates, custom reports, data recognition, forecasts. We can analyze both text and numbers, as well as voice and even video, creating convenient documents for making the right decisions.",
        },
        {
          title: "Recommendation Systems",
          textShort: "Increase average order value by 20-30% through personalization, smart recommendations, product selections and identifying hidden patterns in user behavior.",
          textLong: "Increase average order value by 20-30% without additional advertising costs and grow customer engagement through smart personalization algorithms, product selections, identifying user behavioral patterns and finding hidden regularities.",
        },
      ],
    },
    cases: {
      title: "CASES",
      downloadBtn: "Download all cases",
      cardTexts: [
        "82% of routine tasks automated in a real estate agency",
        "Automated order processing from purchase order in Email into 1C",
        "61% reduction time on partner KPI reporting for a company tracking commissions",
        "60x faster complaint processing at a housing company",
        "80% reduction in manual performance monitoring effort for a cleaning robotics fleet",
        "7x faster customer sentiment monitoring for an EMI tracking dozens of Telegram chats by hand",
        "80% of routine calls handled without staff — for a clinic that missed 700+ bookings every month",
        "80x faster website creation with Claude Code",
        "1.5x faster onboarding of new employees at a company with large volumes of unstructured information",
        "20x faster digest creation at a news agency",
        "42% less load on Hotel's reception",
        "2x increase in training information accessibility at a cleaning company",
      ],
    },
    roadmap: {
      titleSpans: [
        { text: "ROADMAP ", green: true },
        { text: "AIHUB.", green: false },
        { text: "WORKS", green: true },
      ],
      dates: ["November 2023", "December 2024", "June 2025", "Q4 2025", "January 2026"],
      optimization: {
        title: "AI Automation Foundation",
        description: "Building enterprise-grade AI infrastructure and multi-industry agent deployment with full-stack orchestration capabilities.",
        bullets: [
          "Low-code workflow automation",
          "Multi-model LLM orchestration",
          "Custom agents (4+ sectors)",
          "CRM & ERP integrations",
          "Chat memory & personalization",
          "Cross-channel deployment",
        ],
      },
      customAI: {
        title: "Product Platform",
        description: "Launch of scalable multi-tenant infrastructure with automated knowledge extraction and real-time monitoring systems.",
        bullets: [
          "Automated site parsing",
          "Multi-tenant architecture",
          "PWA analytics dashboard",
          "Private cloud hosting",
          "AI system monitoring (850+ tasks)",
          "Humanoid robotics NLP-integration",
        ],
      },
      development: {
        title: "Intelligence Layer",
        description: "Self-improving AI systems with continuous learning, voice interfaces, and predictive analytics for enterprise operations.",
        bullets: [
          "Self-training chatbots",
          "Voice AI assistants",
          "Feedback loop automation",
          "Predictive segmentation",
          "UTM & conversion tracking",
          "Advanced analytics engine",
        ],
      },
      launch: {
        title: "Autonomous Operations",
        description: "End-to-end autonomous workflows with bidirectional integrations across booking, payment, and operational systems.",
        bullets: [
          "Multi-channel orchestration",
          "Instagram → Bot → OTA → ERP",
          "Autonomous task execution",
          "Real-time synchronization",
          "Cross-platform deployment",
          "Enterprise workflow automation",
        ],
      },
      advanced: {
        title: "AI-Native Ecosystem",
        description: "Full-stack AI products with IoT orchestration, humanoid robotics fleet management, and vertical-specific intelligent systems.",
        bullets: [
          "AI Marketplace SDK",
          "Custom AI products (PMS, CRM, Analytics)",
          "Enterprise IoT + AI orchestration",
          "Humanoid robotics at scale",
          "Predictive operations & anomaly detection",
          "Edge-compatible infrastructure",
        ],
      },
    },
    contact: {
      title1: "LEAVE YOUR",
      title2: "PHONE NUMBER",
      sub1: "WE WILL CONTACT YOU,",
      sub2: "DISCUSS YOUR TASKS",
      sub3: "AND OFFER A SOLUTION",
      sub4: "BASED ON AI",
      namePlaceholder: "Your name",
      phonePlaceholder: "Your phone",
      submitBtn: "Submit",
    },
    integrations: {
      heading1: "WE DON'T BREAK EXISTING PROCESSES,",
      heading2: "WE ENHANCE THEM, WITH AI.",
    },
    workProcess: {
      title1: "THIS IS HOW THE WORK PROCESS ",
      title2: "USUALLY LOOKS:",
      steps: [
        [
          { type: "yellow" as const, text: "30-minute call" },
          { type: "purple" as const, text: "Map of current processes" },
        ],
        [
          { type: "yellow" as const, text: "Finding 'bottlenecks' in processes" },
          { type: "purple" as const, text: "Quick improvement plan with AI" },
        ],
        [
          { type: "yellow" as const, text: "Calculation of potential effect" },
        ],
        [
          { type: "yellow" as const, text: "Proposal with AI solution" },
        ],
      ],
    },
    team: {
      part1: "OUR ",
      part2: "TEAM",
    },
    demo: {
      title1: "BOOK",
      title2: "DEMO TODAY",
      sub1: "AND GET",
      sub2: "PERSONALIZED AUTOMATION PLAN",
      sub3: "FOR FREE",
      ctaLine1: "Book",
      ctaLine2: "consultation",
    },
  },
  ru: {
    langSwitch: "EN",
    hero: {
      lines: [
        { text: "ВАШ КАСТОМНЫЙ ", color: "text-[#ffffff]" },
        { text: "AI-АССИСТЕНТ", color: "text-[#08d070]" },
        { text: "ЗА ДВЕ НЕДЕЛИ", color: "text-[#ffffff]" },
      ],
      nav: ["Услуги", "Кейсы", "Дорожная карта", "Команда"],
      tagline: "Первое AI-агентство, которое объединяет передовые технологии с глубоким пониманием операционных проблем бизнеса",
      cardTitle: "Повысьте эффективность работы",
      cardText: "Наши автоматизации экономят ваше время и усилия. Мы не ломаем существующие процессы, а дополняем их AI.",
      ctaLine1: "Записаться",
      ctaLine2: "на консультацию",
    },
    results: {
      title1: "МГНОВЕННЫЙ РЕЗУЛЬТАТ",
      title2: "ДЛЯ ВАШЕГО БИЗНЕСА",
      ctaLine1: "Получить",
      ctaLine2: "персональное демо",
      cards: [
        { title: "Экономия времени", text: "Автоматизация освобождает команду от рутины" },
        { title: "Защита от рисков", text: "Проверенные решения с гарантией результата" },
        { title: "Доказанная эффективность", text: "11 успешных кейсов" },
      ],
    },
    clients: {
      part1: "НАШИ ",
      part2: "КЛИЕНТЫ",
    },
    services: {
      part1: "НАШИ ",
      part2: "НАПРАВЛЕНИЯ",
      items: [
        {
          title: "Виртуальные сотрудники",
          textShort: "Сократите расходы на поддержку клиентов в 3 раза. Голосовые и текстовые AI-ассистенты встраиваются в ваши каналы связи, работают 24/7 и помогают закрывать рутинные запросы без перегруза команды.",
          textLong: "Сократите расходы на поддержку клиентов в 3 раза. Голосовые и текстовые AI-ассистенты встраиваются в ваши каналы связи (web, TG, PMS), работают 24/7, мгновенно отвечают и решают проблемы, снижают стресс клиентов, находят с ними общий язык, отвечают на простые и сложные вопросы, предлагают скидки, облегчают задачи: запись на прием, обработка заказов, сбор обратной связи.",
        },
        {
          title: "Автоматизация бизнес-процессов",
          textShort: "Освободите сотрудников от рутины и ускорьте работу в 5-10 раз: обработка данных, создание контента, заполнение документов, ведение отчетности и другие повторяемые операции.",
          textLong: "Освободите сотрудников от рутины и ускорьте работу в 5-10 раз. Вместо ручной обработки и структурирования данных вы получаете автоматическое создание описаний товаров, статей, постов в соцсетях, обработку заказов, заполнение документов, ведение отчетности.",
        },
        {
          title: "AI аналитика",
          textShort: "Получайте структурированные отчеты, распознавание данных, прогнозы и кастомную аналитику. Мы можем анализировать текст, цифры, голос и видео для принятия более точных решений.",
          textLong: "Вы загружаете свои данные и с помощью AI-инструментов получаете: структурированные отчеты, real-time обновления новостей/котировок, кастомные отчеты, распознавание данных, прогнозы. Мы можем анализировать как текст и цифры, так и голос и даже видео, создавая удобные документы для принятия верных решений.",
        },
        {
          title: "Рекомендательные системы",
          textShort: "Увеличьте средний чек на 20-30% через персонализацию, умные рекомендации, подборки товаров и выявление скрытых закономерностей в поведении пользователей.",
          textLong: "Увеличьте средний чек на 20-30% без дополнительных расходов на рекламу и взрастите вовлеченность клиентов через умные алгоритмы персонализации, подборки товаров, выявление поведенческих паттернов пользователей и поиск скрытых закономерностей.",
        },
      ],
    },
    cases: {
      title: "КЕЙСЫ",
      downloadBtn: "Скачать все кейсы",
      cardTexts: [
        "На 82% рутинных задач автоматизировали в агентстве недвижимости",
        "Автоматизировали формирование ответов на FAQ в компании, где большинство задач решалось через WhatsApp",
        "На 61% снизили расходы на контент для маркетплейса",
        "В 60 раз ускорили обработку жалоб в компании ЖКХ",
        "На 80% снизили время обработки звонков и постановки задач в компании с большим количеством внутренних совещаний",
        "В 7 раз ускорили создание слайдов для презентаций в он-лайн школе",
        "на 30% сократили время обработки звонков в компании, где 90% выручки приходится на продажи по телефону",
        "В 80 раз ускорили создание эскизов сайтов в рекламном агентстве",
        "в 1,5 раза ускорили онбординг новых сотрудников в компании с большим объемом неструктурированной информации",
        "В 20 раз ускорили создание дайджестов в новостном агентстве",
        "На 42% снизили нагрузку на сейлза в отеле",
        "В 2 раза увеличили доступность информации из тренингов в клининговой компании",
      ],
    },
    roadmap: {
      titleSpans: [
        { text: "ДОРОЖНАЯ ", green: true },
        { text: "КАРТА", green: false },
        { text: " AIHUB.", green: true },
        { text: "WORKS", green: false },
      ],
      dates: ["Ноябрь 2023", "Декабрь 2024", "Июнь 2025", "Q4 2025", "Январь 2026"],
      optimization: {
        title: "AI Automation Foundation",
        description: "Создание enterprise AI-инфраструктуры и мультиотраслевого развёртывания агентов с возможностями полного стека оркестрации.",
        bullets: [
          "Low-code автоматизация процессов",
          "Мульти-модельная LLM оркестрация",
          "Кастомные агенты (4+ сектора)",
          "Интеграции CRM и ERP",
          "Память чата и персонализация",
          "Кросс-канальное развёртывание",
        ],
      },
      customAI: {
        title: "Product Platform",
        description: "Запуск масштабируемой мультитенантной инфраструктуры с автоматическим извлечением знаний и мониторингом в реальном времени.",
        bullets: [
          "Автоматический парсинг сайтов",
          "Мультитенантная архитектура",
          "PWA-дашборд аналитики",
          "Хостинг в приватном облаке",
          "Мониторинг AI-систем (850+ задач)",
          "NLP-интеграция гуманоидной роботики",
        ],
      },
      development: {
        title: "Intelligence Layer",
        description: "Самообучающиеся AI-системы с непрерывным обучением, голосовыми интерфейсами и предиктивной аналитикой для корпоративных операций.",
        bullets: [
          "Самообучающиеся чатботы",
          "Голосовые AI-ассистенты",
          "Автоматизация обратной связи",
          "Предиктивная сегментация",
          "UTM и конверсионное отслеживание",
          "Продвинутый движок аналитики",
        ],
      },
      launch: {
        title: "Autonomous Operations",
        description: "Сквозные автономные процессы с двунаправленными интеграциями для бронирования, платежей и операционных систем.",
        bullets: [
          "Мультиканальная оркестрация",
          "Instagram → Bot → OTA → ERP",
          "Автономное выполнение задач",
          "Синхронизация в реальном времени",
          "Кросс-платформенное развёртывание",
          "Автоматизация корпоративных процессов",
        ],
      },
      advanced: {
        title: "AI-Native Ecosystem",
        description: "Полностековые AI-продукты с IoT-оркестрацией, управлением парком гуманоидных роботов и вертикально-специализированными интеллектуальными системами.",
        bullets: [
          "AI Marketplace SDK",
          "Кастомные AI-продукты (PMS, CRM, аналитика)",
          "Корпоративная IoT + AI оркестрация",
          "Гуманоидная роботика в масштабе",
          "Предиктивные операции и обнаружение аномалий",
          "Edge-совместимая инфраструктура",
        ],
      },
    },
    contact: {
      title1: "ОСТАВЬТЕ ВАШ",
      title2: "НОМЕР ТЕЛЕФОНА",
      sub1: "МЫ СВЯЖЕМСЯ С ВАМИ,",
      sub2: "ОБСУДИМ ВАШИ ЗАДАЧИ",
      sub3: "И ПРЕДЛОЖИМ РЕШЕНИЕ",
      sub4: "НА ОСНОВЕ AI",
      namePlaceholder: "Ваше имя",
      phonePlaceholder: "Ваш телефон",
      submitBtn: "Отправить",
    },
    integrations: {
      heading1: "МЫ НЕ ЛОМАЕМ СУЩЕСТВУЮЩИЕ ПРОЦЕССЫ,",
      heading2: "А УСИЛИВАЕМ ИХ, БЛАГОДАРЯ AI.",
    },
    workProcess: {
      title1: "ТАК ОБЫЧНО ВЫГЛЯДИТ ",
      title2: "ПРОЦЕСС РАБОТЫ:",
      steps: [
        [
          { type: "yellow" as const, text: "30-минутный звонок" },
          { type: "purple" as const, text: "Карта текущих процессов" },
        ],
        [
          { type: "yellow" as const, text: "Поиск «бутылочных горлышек» в процессах" },
          { type: "purple" as const, text: "План быстрых улучшений с AI" },
        ],
        [
          { type: "yellow" as const, text: "Расчет потенциального эффекта" },
        ],
        [
          { type: "yellow" as const, text: "Предложение с AI-решением" },
        ],
      ],
    },
    team: {
      part1: "НАША ",
      part2: "КОМАНДА",
    },
    demo: {
      title1: "ЗАБРОНИРУЙТЕ",
      title2: "ДЕМО СЕГОДНЯ",
      sub1: "И ПОЛУЧИТЕ",
      sub2: "ПЕРСОНАЛЬНЫЙ ПЛАН",
      sub3: "АВТОМАТИЗАЦИИ БЕСПЛАТНО",
      ctaLine1: "Забронировать",
      ctaLine2: "консультацию",
    },
  },
};

export type Translations = typeof translations.en;
