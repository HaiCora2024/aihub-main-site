# AIHUB Unified Landing

Единый лендинг AIHUB, собранный из отдельных React + Tailwind блоков, которые изначально лежали как независимые архивы. Сейчас проект работает как одно Vite-приложение, а каждый блок хранится в своей папке и импортируется в общую страницу.

Публичная версия: `https://getcher123.github.io/aihub-site/`

## Что это за проект

Проект состоит из:

- корневого Vite-приложения, которое собирает страницу целиком;
- 12 независимых блоков-секций;
- общего Tailwind/CSS-слоя;
- автодеплоя на GitHub Pages через GitHub Actions.

Каждый блок по-прежнему хранится в собственной папке, чтобы его было удобно редактировать отдельно, но рендерится он внутри общей страницы.

## Стек

- `React 18`
- `TypeScript`
- `Vite`
- `Tailwind CSS`
- `GitHub Pages`
- `GitHub Actions`

## Как устроена сборка страницы

Главная точка сборки страницы:

- [`src/App.tsx`](src/App.tsx)

В этом файле:

- импортируются все блоки;
- задаётся порядок секций;
- задаются `id` секций для якорного меню;
- задаётся единый вертикальный отступ между блоками.

Текущий порядок секций:

1. `01_hero_custom_ai_assistant`
2. `02_instant_business_results`
3. `03_clients_logos`
4. `04_services_directions`
5. `06_cases_animated`
6. `07_roadmap`
7. `08_contact_form`
8. `09_ai_process_integrations`
9. `10_work_process`
10. `11_team`
11. `12_demo_cta`
12. `13_footer_contacts`

## Структура проекта

```text
.
├── 01_hero_custom_ai_assistant/
├── 02_instant_business_results/
├── 03_clients_logos/
├── 04_services_directions/
├── 06_cases_animated/
├── 07_roadmap/
├── 08_contact_form/
├── 09_ai_process_integrations/
├── 10_work_process/
├── 11_team/
├── 12_demo_cta/
├── 13_footer_contacts/
├── src/
│   ├── App.tsx
│   ├── styles.css
│   ├── components/DesktopScaleFrame.tsx
│   └── hooks/useRevealOnView.ts
├── tailwind.config.cjs
├── vite.config.ts
└── .github/workflows/gh-pages.yml
```

## Локальный запуск

Установка зависимостей:

```bash
npm install
```

Запуск dev-сервера:

```bash
npm run dev
```

Сборка production:

```bash
npm run build
```

Локальный preview production-сборки:

```bash
npm run preview
```

## Деплой

Деплой настроен через:

- [`vite.config.ts`](vite.config.ts)
- [`.github/workflows/gh-pages.yml`](.github/workflows/gh-pages.yml)

Как это работает:

- при пуше в `main` GitHub Actions запускает сборку;
- Vite получает `base=/aihub-site/`;
- в `dist` добавляется `.nojekyll`;
- `index.html` копируется в `404.html` для SPA-fallback;
- артефакт публикуется в GitHub Pages.

## Contact API для формы

Для отправки заявок с формы добавлен минимальный backend:

- [`backend/contact-api/server.js`](backend/contact-api/server.js)
- [`backend/contact-api/Dockerfile`](backend/contact-api/Dockerfile)
- [`amvera.yaml`](amvera.yaml)

Backend принимает `POST /api/contact` и отправляет письмо на `aihubworks@gmail.com` через SMTP. Для деплоя на Amvera используется slug `aihub-form`, регион `waw0`.

Нужные env-переменные на Amvera:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `CONTACT_TO=aihubworks@gmail.com`
- `CONTACT_FROM`
- `ALLOWED_ORIGINS=https://getcher123.github.io`

После деплоя backend URL нужно передать во frontend build как:

```bash
VITE_CONTACT_API_URL=https://<amvera-backend-domain>
```

Форма подключена в [`08_contact_form/src/screens/Home/Home.tsx`](08_contact_form/src/screens/Home/Home.tsx). Если `VITE_CONTACT_API_URL` не задан, форма покажет сообщение, что API ещё не настроен.

## Общие правила редактирования дизайна

### 1. Где править глобальные эффекты

Общие стили лежат в:

- [`src/styles.css`](src/styles.css)

Именно там находятся:

- единый hover для CTA-кнопок через `.glow-button`;
- hover-эффекты меню через `.hero-nav-link`;
- глобальные анимации;
- общие utility-стили, которые используются сразу в нескольких блоках.

Если нужно изменить поведение всех кнопок сразу, править нужно не отдельные секции, а `src/styles.css`.

### 2. Где править порядок блоков и якоря

Порядок секций, `id` и межблочные отступы находятся в:

- [`src/App.tsx`](src/App.tsx)

Если нужно:

- поменять порядок блоков;
- удалить блок;
- добавить новый блок;
- поменять `id` якоря;
- изменить общие вертикальные отступы между секциями,

делать это нужно в `src/App.tsx`.

### 3. Как работает desktop-адаптация

Для нескольких секций используется:

- [`src/components/DesktopScaleFrame.tsx`](src/components/DesktopScaleFrame.tsx)

Это важно:

- desktop-режим стартует с `1200px`;
- после `1200px` контент не должен расти бесконечно;
- смысловой контент держится фиксированной ширины;
- на больших экранах увеличиваются боковые поля, а не масштаб контента.

Если блок выглядит слишком маленьким или слишком узким на desktop, обычно нужно проверять:

- `contentLeft`
- `contentWidth`
- `targetWidth`

в `DesktopScaleFrame` у конкретного блока.

### 4. Как работает последовательное появление

Общий хук для reveal-анимаций:

- [`src/hooks/useRevealOnView.ts`](src/hooks/useRevealOnView.ts)

Он запускает анимацию только тогда, когда блок действительно входит в viewport. Его используют блоки, где есть поэтапное появление карточек, элементов, заголовков и таймлайнов.

Если нужно добавить отложенное появление в новый элемент:

1. подключить `useRevealOnView`;
2. привязать `ref` к корню нужной секции;
3. управлять классами видимости через `isVisible`;
4. использовать stagger delay через inline style или готовые классы.

### 5. Как добавлять локальные ассеты

Если SVG или картинку нужно стабильно контролировать, лучше хранить asset локально в блоке, а не тянуть из внешнего URL.

Пример:

- [`03_clients_logos/src/screens/Home/assets/frame-1948760013-unified.svg`](03_clients_logos/src/screens/Home/assets/frame-1948760013-unified.svg)

Подход:

- класть asset в `.../src/screens/Home/assets/`;
- импортировать его прямо в `Home.tsx`;
- только после этого использовать в JSX.

## Как модифицировать каждый блок

Ниже список всех блоков с назначением и файлами, которые реально нужно править.

### 01. Hero / Главный экран

Основной файл:

- [`01_hero_custom_ai_assistant/src/screens/Home/Home.tsx`](01_hero_custom_ai_assistant/src/screens/Home/Home.tsx)

Что находится внутри:

- верхнее меню;
- главный заголовок;
- эффект печати текста;
- мигающий курсор;
- hero CTA;
- якорные ссылки на остальные секции.

Если нужно изменить:

- пункты меню: править массив/ссылки в `Home.tsx`;
- привязку меню к секциям: сверять `href="#..."` с `id` в `src/App.tsx`;
- hero-текст и typing-эффект: править `Home.tsx`;
- стиль hover у меню: править `src/styles.css`, класс `.hero-nav-link`;
- общий hover CTA: править `src/styles.css`, класс `.glow-button`.

### 02. Instant Business Results / Результаты

Основной файл:

- [`02_instant_business_results/src/screens/Home/Home.tsx`](02_instant_business_results/src/screens/Home/Home.tsx)

Что находится внутри:

- карточки с метриками;
- иконки результатов;
- CTA;
- декоративные градиенты и glow-эффекты.

Если нужно изменить:

- тексты и цифры карточек: `Home.tsx`;
- размеры иконок: `Home.tsx`;
- структуру карточек: `Home.tsx`;
- поведение CTA на hover: глобально через `src/styles.css`.

### 03. Clients / Наши клиенты

Основной файл:

- [`03_clients_logos/src/screens/Home/Home.tsx`](03_clients_logos/src/screens/Home/Home.tsx)

Локальные ассеты:

- [`03_clients_logos/src/screens/Home/assets/frame-1948760013-unified.svg`](03_clients_logos/src/screens/Home/assets/frame-1948760013-unified.svg)

Что находится внутри:

- сетка карточек с логотипами;
- stagger reveal по входу в viewport;
- индивидуальные цветовые рамки карточек.

Если нужно изменить:

- состав логотипов и карточек: `Home.tsx`;
- скругления и рамки зелёной длинной карточки: локальный SVG asset;
- последовательность появления карточек: `Home.tsx`, reveal delay;
- desktop/mobile компоновку: `Home.tsx`.

### 04. Services / Наши направления

Основной файл:

- [`04_services_directions/src/screens/Home/Home.tsx`](04_services_directions/src/screens/Home/Home.tsx)

Что находится внутри:

- карточки направлений;
- поэтапное появление самих карточек;
- поэтапное появление элементов внутри карточки.

Если нужно изменить:

- названия направлений: `Home.tsx`;
- тексты описаний: `Home.tsx`;
- порядок карточек: `Home.tsx`;
- анимацию появления dot/title/text: `Home.tsx` и связанные reveal-классы.

### 06. Cases / Кейсы

Основной файл:

- [`06_cases_animated/src/screens/Home/Home.tsx`](06_cases_animated/src/screens/Home/Home.tsx)

Что находится внутри:

- анимированные карточки кейсов;
- анимация процентов;
- круговые диаграммы;
- стрелки и счётчики;
- запуск анимации только после появления секции в viewport.

Если нужно изменить:

- контент кейсов: `Home.tsx`;
- логику анимации чисел и диаграмм: `Home.tsx`;
- момент старта анимации: `Home.tsx`, связка видимости карточки и animation state;
- кнопку кейсов и её рамку: `Home.tsx` плюс глобальный `glow-button`.

### 07. Roadmap / Дорожная карта

Главный файл:

- [`07_roadmap/src/screens/Home/Home.tsx`](07_roadmap/src/screens/Home/Home.tsx)

Вложенные секции:

- [`07_roadmap/src/screens/Home/sections/RoadmapSection/RoadmapSection.tsx`](07_roadmap/src/screens/Home/sections/RoadmapSection/RoadmapSection.tsx)
- [`07_roadmap/src/screens/Home/sections/CustomAISection/CustomAISection.tsx`](07_roadmap/src/screens/Home/sections/CustomAISection/CustomAISection.tsx)
- [`07_roadmap/src/screens/Home/sections/DevelopmentPhaseSection/DevelopmentPhaseSection.tsx`](07_roadmap/src/screens/Home/sections/DevelopmentPhaseSection/DevelopmentPhaseSection.tsx)
- [`07_roadmap/src/screens/Home/sections/LaunchPhaseSection/LaunchPhaseSection.tsx`](07_roadmap/src/screens/Home/sections/LaunchPhaseSection/LaunchPhaseSection.tsx)
- [`07_roadmap/src/screens/Home/sections/OptimizationPhaseSection/OptimizationPhaseSection.tsx`](07_roadmap/src/screens/Home/sections/OptimizationPhaseSection/OptimizationPhaseSection.tsx)
- [`07_roadmap/src/screens/Home/sections/AdvancedAutomationSection/AdvancedAutomationSection.tsx`](07_roadmap/src/screens/Home/sections/AdvancedAutomationSection/AdvancedAutomationSection.tsx)

Что находится внутри:

- общая обвязка секции roadmap;
- отдельные этапы дорожной карты;
- последовательное появление карточек/этапов.

Если нужно изменить:

- общий layout и desktop-фокус секции: `Home.tsx`;
- конкретный этап roadmap: соответствующий файл в `sections/...`;
- порядок этапов: чаще всего `Home.tsx`;
- stagger reveal этапов: `Home.tsx` и/или конкретный section component.

### 08. Contact Form / Форма

Основной файл:

- [`08_contact_form/src/screens/Home/Home.tsx`](08_contact_form/src/screens/Home/Home.tsx)

Что находится внутри:

- форма;
- кнопка отправки;
- обводки и декоративные элементы;
- hover/focus внутреннее свечение полей.

Если нужно изменить:

- поля формы и подписи: `Home.tsx`;
- внутреннее свечение полей на hover/focus: `Home.tsx` плюс `src/styles.css`, если эффект нужно сделать общим;
- CTA формы: `Home.tsx`;
- декоративные фоновые элементы формы: `Home.tsx`.

### 09. Tools / Integrations / Интеграции

Основной файл:

- [`09_ai_process_integrations/src/screens/Home/Home.tsx`](09_ai_process_integrations/src/screens/Home/Home.tsx)

Что находится внутри:

- карточки интеграций;
- категории `CRM`, `Cloud Apps`, `Development`, `Data`, `LLM`, `Infrastructure`;
- декоративное яйцо;
- буквы `AI` поверх яйца;
- последовательное появление карточек и элементов внутри них.

Если нужно изменить:

- названия категорий и списки интеграций: `Home.tsx`;
- reveal-последовательность: `Home.tsx`;
- позицию яйца: `Home.tsx`, desktop decorative wrapper;
- позицию `AI`: `Home.tsx`, `union.svg` image node;
- фоновые glow-элементы секции: `Home.tsx`.

Важно: яйцо и `AI` сейчас управляются раздельно. Их можно двигать независимо.

### 10. Work Process / Процесс работы

Основной файл:

- [`10_work_process/src/screens/Home/Home.tsx`](10_work_process/src/screens/Home/Home.tsx)

Что находится внутри:

- таймлайн процесса;
- шаги процесса;
- последовательное появление шагов при входе блока в viewport.

Если нужно изменить:

- названия шагов: `Home.tsx`;
- порядок шагов: `Home.tsx`;
- тайминги появления: `Home.tsx` и связанные timeline-классы;
- desktop-масштаб/ширину блока: `DesktopScaleFrame` props внутри `Home.tsx`, если они там используются.

### 11. Team / Команда

Основной файл:

- [`11_team/src/screens/Home/Home.tsx`](11_team/src/screens/Home/Home.tsx)

Что находится внутри:

- карточки команды;
- роли;
- текстовые бейджи;
- desktop и mobile раскладки.

Если нужно изменить:

- участников команды: `Home.tsx`;
- роли и подписи: `Home.tsx`;
- поведение длинных ролей на мобильных: `Home.tsx`;
- desktop-width и боковые поля: `Home.tsx`.

### 12. Demo CTA / Блок демо

Основной файл:

- [`12_demo_cta/src/screens/Home/Home.tsx`](12_demo_cta/src/screens/Home/Home.tsx)

Что находится внутри:

- финальный CTA;
- двухколоночная desktop-раскладка;
- адаптивный переход к stacked layout.

Если нужно изменить:

- финальный заголовок и CTA: `Home.tsx`;
- breakpoint двух колонок: `Home.tsx`;
- glow кнопки: глобально через `src/styles.css`.

### 13. Footer / Контакты и футер

Основной файл:

- [`13_footer_contacts/src/screens/Home/Home.tsx`](13_footer_contacts/src/screens/Home/Home.tsx)

Что находится внутри:

- контактная информация;
- нижняя часть лендинга;
- финальные ссылки и декоративные элементы.

Если нужно изменить:

- контакты, ссылки, подписи: `Home.tsx`;
- визуал футера: `Home.tsx`;
- отступы и адаптив: `Home.tsx`.

## Частые сценарии изменений

### Изменить порядок секций

Править:

- [`src/App.tsx`](src/App.tsx)

Меняется:

- порядок импортов;
- порядок элементов в массиве `sections`.

### Поменять общий эффект hover на всех кнопках

Править:

- [`src/styles.css`](src/styles.css)

Смотреть классы:

- `.glow-button`
- `.glow-button--green`
- `.glow-button--yellow`
- `.glow-button--orange`
- `.glow-button--blue`

### Поменять межсекционные отступы

Править:

- [`src/App.tsx`](src/App.tsx)

Смотреть классы:

- `mt-6`
- `sm:mt-8`
- `min-[1200px]:mt-10`

### Изменить якоря верхнего меню

Править:

- [`01_hero_custom_ai_assistant/src/screens/Home/Home.tsx`](01_hero_custom_ai_assistant/src/screens/Home/Home.tsx)
- [`src/App.tsx`](src/App.tsx)

Важно: `href="#section-id"` в hero и `id="section-id"` в App должны совпадать.

### Исправить desktop-масштаб конкретного блока

Проверять:

- `Home.tsx` нужного блока;
- [`src/components/DesktopScaleFrame.tsx`](src/components/DesktopScaleFrame.tsx)

Обычно проблема находится в:

- `contentLeft`
- `contentWidth`
- `targetWidth`

### Добавить новый блок

Рекомендуемый порядок:

1. создать новую папку по шаблону `NN_block_name`;
2. положить компонент в `src/screens/Home/Home.tsx`;
3. экспортировать его через `src/screens/Home/index.ts`;
4. импортировать блок в [`src/App.tsx`](src/App.tsx);
5. добавить новый элемент в массив `sections`;
6. при необходимости добавить новый якорь в hero-меню.

## Что в репозитории игнорируется

Список исключений лежит в:

- [`.gitignore`](.gitignore)

Сейчас в git не должны попадать:

- сборки (`dist`, `build`, `out`);
- кэши;
- временные папки;
- архивы;
- установочные файлы и дистрибутивы;
- логи;
- локальные IDE-файлы.

## Практический совет перед правками

Если изменение затрагивает только один блок, в большинстве случаев порядок такой:

1. править `.../src/screens/Home/Home.tsx` нужного блока;
2. если изменение общее для всех блоков, править `src/styles.css` или `src/App.tsx`;
3. запускать `npm run build`;
4. коммитить и пушить в `main`, если нужно обновить GitHub Pages.

Если изменение связано с:

- одинаковым hover у всех кнопок;
- поведением якорного меню;
- адаптивным принципом после `1200px`;
- межсекционными отступами,

то почти всегда сначала нужно смотреть не блок, а общий слой `src/`.
