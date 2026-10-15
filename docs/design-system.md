# AIHUB Design System

## Назначение и границы

Система для разработки новых страниц в существующем стиле AIHUB. Источник визуального
языка: все 12 блоков текущего лендинга. Каталог не является новой версией лендинга.
Исходные секции, production-форма и backend не изменены.

Каталог: `http://localhost:4173/design-system.html`.
Описания на русском, язык интерфейсных примеров переключается EN / RU.
Поле поиска ищет по компонентам, блокам, названиям и computed-значениям CSS-токенов.
Ссылка на пример: `#component-Button`; на паттерн: `#block-cases`.

## Запуск

```bash
npm install
npm run dev
# либо production:
npm run build
npm run preview -- --port 4173 --strictPort
```

При занятом порте используйте `--port 4174`. Не запускайте два сервера на одном порте.
Проверка только нового кода:

```bash
npx tsc --noEmit -p tsconfig.design-system.json
```

Полный `npx tsc --noEmit -p tsconfig.app.json` также проверяет legacy.
До добавления системы в нём были шесть ошибок: несовместимое приведение ref в Cases,
неиспользуемый `useCounter` в HotelConciergePage, `BulletItem` / `FeaturePill` в
OmniCrmPage и `GREEN_90` / `ORANGE_20` в RentalPlatformPage. Они не исправляются
попутно в рамках дизайн-системы. `vite build` не заменяет проверку TypeScript.

## Структура

| Файл                          | Ответственность                                                         |
| ----------------------------- | ----------------------------------------------------------------------- |
| `design-system.html`          | Самостоятельный multipage-entrypoint                                    |
| `src/design-system/index.ts`  | Публичный экспорт UI-kit и подключение его CSS                          |
| `tokens.css`                  | Единственный источник значений `--aihub-*`                              |
| `components.tsx`              | Типизированные примитивы и поведение анимаций                           |
| `ui.css`                      | Стили компонентов под `.aihub-theme`                                    |
| `patterns.tsx`                | 12 композиций, DemoContactForm, PageTemplate                            |
| `patterns.css`                | Стили композиций и шаблонов                                             |
| `data.ts`                     | Описание токенов, ролей шрифта, метаданные атласа и ссылки на исходники |
| `Catalog.tsx`                 | Каталог, поиск, копирование, playground и preview-фреймы                |
| `catalog.css`                 | Только оформление каталога                                              |
| `main.tsx`                    | Выбор каталога, паттерна или шаблона по query-параметрам                |
| `tsconfig.design-system.json` | Независимая строгая проверка UI-kit и каталога                          |

## Подключение к новой странице

Не импортируйте `src/styles.css` или `catalog.css` в новую страницу на UI-kit.
Импорт из `src/design-system/index.ts` подключает нужные стили автоматически.
Корневой узел страницы должен иметь класс `aihub-theme`.

```tsx
import { createRoot } from "react-dom/client";
import {
  PageContainer,
  Section,
  SectionHeading,
  Grid,
  SurfaceCard,
  CtaFrame,
  Button,
  TextField,
} from "./design-system";

function ServicePage() {
  return (
    <main className="aihub-theme service-page">
      <Section>
        <PageContainer>
          <SectionHeading level={1} eyebrow="AI ASSISTANTS">
            AI for your business
          </SectionHeading>
          <Grid columns={3}>
            <SurfaceCard>24/7 support</SurfaceCard>
            <SurfaceCard>Connected workflow</SurfaceCard>
            <SurfaceCard>Measurable impact</SurfaceCard>
          </Grid>
          <CtaFrame>
            <Button href="#contact">Book a consultation</Button>
          </CtaFrame>
        </PageContainer>
      </Section>
      <Section id="contact">
        <PageContainer>
          <SectionHeading>Let’s talk</SectionHeading>
          {/* Подключите production-контроллер, валидацию и endpoint. */}
          <TextField label="Your e-mail" name="email" type="email" required />
        </PageContainer>
      </Section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<ServicePage />);
```

На оболочке новой страницы допустимо `overflow-x: clip`, но не `overflow: hidden`
на каждой секции. В HTML подключите отдельный entrypoint, добавьте путь в
`vite.config.ts → build.rollupOptions.input`. Сбрасывайте margin у body только
специальным классом этой страницы. Не вводите глобальные селекторы для всех h1/button.

Все локальные URL ассетов и других страниц строятся через `import.meta.env.BASE_URL`.
В HTML используйте `%BASE_URL%`. Это поддерживает `/` и размещение в подпапке Pages.
Публикация в Pages в текущую задачу не входит.

## Токены

Значения определены в `.aihub-theme` файла `tokens.css`, а не в глобальном `:root`.
Каталог читает их через `getComputedStyle`: копируемые значения и отрисовка не расходятся.
Переменная `--aihub-accent` меняется атрибутом `data-tone` на компоненте.
Зависимые токены теней объявлены также на `[data-tone]`: CSS вычисляет вложенный
`var()` на том узле, где токен объявлен. Без этого все дочерние цветовые варианты
унаследовали бы уже вычисленное зелёное свечение корневой темы.

| Группа                    | Контракт                                                                                                             |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Фон                       | `--aihub-color-bg: #060C24`, поверхность `#060C2499`                                                                 |
| Текст                     | Белый основной, `#B4BDD1` вторичный                                                                                  |
| Акценты                   | green `#08D070`, blue `#0385FF`, yellow `#FFD409`, orange `#FE8A04`, purple `#BF5BF3`, cyan `#63E6E1`, red `#FF463A` |
| Шрифты                    | Geologica UI, Manrope метрики; оба явно подключены                                                                   |
| Кегли                     | 86 / 64 / 32 / 24 / 20 / 16 / 14 / 12 px                                                                             |
| Mobile                    | 42 / 36 / 28 / 22 / 18 / 16 / 14 / 12 px                                                                             |
| Интерлиньяж               | display 1.08, title 1.2, body 1.6                                                                                    |
| Вес                       | 400 основной, 500 акцентный, 700 bold; метрики 600                                                                   |
| Контейнер                 | 1140 px, desktop от 1200 px                                                                                          |
| Поля                      | 16 px, от 640 px 24 px, дальше центрирование контейнера                                                              |
| Отступы                   | 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80 px                                                                |
| Радиусы                   | 12 badge, 20 inset, 30 card/field, 999 pill                                                                          |
| Межсекционные промежутки  | 24 / 32 / 40 px                                                                                                      |
| Внутренний padding секции | 32 px, desktop 64 px                                                                                                 |
| CTA                       | Высота 64 px; compact 48 px; padding рамки 20 px                                                                     |
| Поле                      | Минимальная высота 72 px, radius 30 px                                                                               |

Контраст swatch в каталоге вычисляется по WCAG sRGB: обычный текст AA ≥4.5:1,
крупный текст ≥3:1. Яркие заливки CTA используют тёмный текст, не белый.
Прозрачности 8/12/24/40/60/100% показываются на Midnight. Их нельзя считать
готовыми безопасными сочетаниями для текста поверх произвольного изображения.

CSS-переменную нельзя непосредственно использовать в условии `@media`.
При изменении `--aihub-breakpoint-desktop` обязательно синхронизируйте литерал
`1200px` в `ui.css`, `patterns.css`, `catalog.css`, таблицу контрольных ширин и тесты.

## API компонентов

Общие props соответствуют HTML-элементу. `className`, `style`, `id`, `data-*`,
`aria-*`, обработчики событий поддерживаются стандартными React-типами.
Тип `Accent`: green / blue / yellow / orange / purple / cyan / red.
Тип `CtaTone`: green / blue / yellow / orange.

| Компонент       | Основные props и семантика                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------------- |
| PageContainer   | div с максимальной шириной 1140 px                                                                          |
| Section         | section, внутренние отступы и isolation; добавляйте доступный заголовок                                     |
| SectionHeading  | `level: 1\|2\|3`, `eyebrow`, `description`, `tone`, children; переданные HTML-атрибуты относятся к h1/h2/h3 |
| Grid            | `columns: 2\|3\|4`; mobile 1, от 768 px 2, от 1200 заданное число                                           |
| Split           | 1 колонка до 1200 px, затем 2                                                                               |
| Button          | `href` создаёт a; без href button; `tone`, `compact`, `loading`, `disabled`, `type`, `onClick`              |
| CtaFrame        | `tone`; совместное центрирование рамки и одной кнопки                                                       |
| NavLink         | Настоящая ссылка; зелёное свечение hover/focus; `aria-current` для текущей                                  |
| SurfaceCard     | `tone`, `glow`, `border: gradient\|solid\|none`; div, не скрытая кнопка                                     |
| Badge / GlowDot | `tone`; GlowDot декоративный и скрыт от accessibility tree                                                  |
| DecorativeGlow  | `tone`; декоративный div, pointer-events none                                                               |
| TextField       | `label`, `error`, `hint`, `tone`, нативные input props; ref на input                                        |
| FormMessage     | `kind: info\|error\|success`; alert для ошибок, status для остальных                                        |
| DemoContactForm | `lang: en\|ru`, `id`; только локальное состояние                                                            |
| Metric          | `value`, `suffix` (по умолчанию %), `label`, `tone`                                                         |
| ProgressRing    | `value` (ограничивается 0–100), `label`, `tone`; доступный итог через aria-label                            |
| ChangeIndicator | `direction: up\|down`, `tone`, children                                                                     |
| TimelineStep    | `number`, `title`, `tone`, children                                                                         |
| Reveal          | `index`; начинает появление после входа в viewport, даёт метрикам сигнал готовности                         |

Набор расширен компонентом `SolutionIcon`: `name` из восьми типизированных имён,
нативные img-атрибуты, `alt=""` по умолчанию. Прозрачные WebP, 640 × 640 px;
рекомендуемый размер в карточках 160–260 px. Пример:
`<SolutionIcon name="voice-assistant" width={200} height={200} />`.
Раздел `/design-system.html#icons` содержит все изображения и копируемый JSX.
Иконки используются на реальной странице [магазина](shop.md); история генерации:
[shop-icons.md](shop-icons.md). Всего UI-kit экспортирует 21 компонент.

Для кликабельной SurfaceCard используйте внутри ссылку `.aihub-card-link` с `href`.
Её псевдоэлемент расширяет область клика. Не помещайте другие действия внутри такой
карточки: они конфликтуют с растянутой ссылкой. Не добавляйте `onClick` на div вместо a.
Кнопки локальных действий по умолчанию имеют `type="button"`; для формы задавайте submit.
Отключённые ссылки предотвращают навигацию, имеют aria-disabled и исключены из tab order.

`demoState` у Button существует только для каталога: default/hover/focus/pressed/loading/disabled.
Для production hover/pressed/focus обеспечиваются нативным состоянием элемента.

## Форма и backend

DemoContactForm не использует fetch, SMTP, Sheets API или рабочий endpoint. Отправка
имитируется таймером 1000 ms. После размонтирования таймер отменяется. Имя и e-mail
обязательны, телефон опционален. `noValidate` позволяет показать единый текст ошибки,
required остаётся на input для семантики. Фокус переводится на первое ошибочное поле.

Для настоящей новой страницы отделите контроллер формы от визуальных TextField и Button.
Используйте контракт существующей production-формы из
`08_contact_form/src/screens/Home/Home.tsx` и документацию `backend/contact-api/README.md`.
Не переносите локальный таймер в production. Не храните SMTP/Gmail/Sheets-секреты во frontend.
Поле контактов должно передавать и email, и phone, если телефон указан.

## Движение

- CTA: translateY(-2px) scale(1.035), цветное свечение, 320 ms; pressed scale(.98).
- Поля: внутреннее свечение 280 ms, focus сильнее hover.
- Reveal: 720 ms, stagger 150 ms (допустимые варианты 120–180 ms).
- Metric и ProgressRing: 1400 ms после завершения Reveal, а не при монтировании страницы.
- useReducedMotion реагирует на изменение настройки без перезагрузки.
- При reduced motion конечные значения видны сразу, анимированные трансформации отключены.
- Кнопка «Повтор» перемонтирует пример через key; обычная прокрутка не повторяет счётчик.

Оборачивайте **всю карточку** в Reveal. Его контекст откладывает анимацию вложенных
метрик до завершения появления. Без Reveal метрика запускается при собственной видимости.
Статический label и итоговое число доступны screen reader без анонса каждого кадра.

## Атлас всех исходных блоков

| Паттерн      | Исходная папка                | Особенность нового стандарта                             |
| ------------ | ----------------------------- | -------------------------------------------------------- |
| Hero         | `01_hero_custom_ai_assistant` | 86px оффер, зелёный CTA, Split                           |
| Results      | `02_instant_business_results` | Жёлтые метрики в равных карточках                        |
| Clients      | `03_clients_logos`            | Одинаковый R30 всех плиток, последовательное появление   |
| Services     | `04_services_directions`      | Фиолетовый раздел, 4 направления                         |
| Cases        | `06_cases_animated`           | Показатели после появления, центрированный оранжевый CTA |
| Roadmap      | `07_roadmap`                  | 5 фаз, зелёные поверхности, жёлтые бейджи                |
| Contact      | `08_contact_form`             | Синий акцент, имя/email обязательны, телефон опционален  |
| Tools        | `09_ai_process_integrations`  | Группы интеграций и зелёные бейджи                       |
| Work Process | `10_work_process`             | 4 шага, жёлтые номера, фиолетовый заголовок              |
| Team         | `11_team`                     | Фото R20 внутри карточек R30, 2 колонки                  |
| Demo CTA     | `12_demo_cta`                 | Один оффер и зелёный CTA к форме                         |
| Footer       | `13_footer_contacts`          | Семантические контакты и legal-ссылки                    |

Каталог показывает нормализованные композиции из нового kit. Это не точная копия
контента исходных блоков. Каждая карточка атласа имеет ссылку на реальный Home.tsx,
описание геометрии, цвета, компонентов и адаптива.

### Legacy-исключения

1920px-сцены и DesktopScaleFrame остаются в исходных экспортированных блоках.
Собственная сетка Cases (порог 1140 px), CTA высотой 80 px, рамки 117 px, 96px цифры
Work Process и сдвиги декора Tools не являются стандартом новых страниц.
Не копируйте случайные CSS-имена экспортера или абсолютное позиционирование текста.
Исходные блоки не мигрированы на kit автоматически.

## Шаблоны и preview

```text
/design-system.html?preview=template&target=service&lang=en
/design-system.html?preview=template&target=case&lang=ru
/design-system.html?preview=block&target=cases&lang=en
```

В iframe задаётся реальная ширина viewport 390/768/1200/1440 px. Сам фрейм только
уменьшается визуально, чтобы поместиться в каталог: это не масштабирование контента
рабочей страницы. При открытии в новой вкладке нет уменьшения. Высота preview 760 px,
внутри есть вертикальная прокрутка. Кнопка повторного запуска пересоздаёт iframe.

PageTemplate содержит связный сценарий с настоящими компонентами; все примеры метрик
демонстрационные. Для production замените тексты, числа, фотоматериалы и локальную форму.

## Как расширять

1. Сначала определите роль: новый токен/вариант действительно нужен или подходит существующий.
2. Добавьте токен в tokens.css; не повторяйте его значение в TSX.
3. Обновите метаданные в data.ts и соответствующую секцию каталога. Поиск увидит CSS-токен автоматически.
4. Расширьте union-type props, добавьте scoped-селектор в ui.css. Если нужен новый компонент, экспортируйте его из index.ts.
5. Добавьте живой пример, JSX, правила, focus/disabled/loading и EN/RU-тексты.
6. Проверьте контраст, длинные строки, переносы, aria-семантику и reduced motion.
7. Выполните отдельный TypeScript-check, production-build и браузерную проверку матрицы ширин.

## Проверка перед использованием

- 390, 768, 1199, 1200, 1440, 1920 px: нет горизонтального скролла, фиксированная ширина desktop 1140 px.
- Ссылки, якоря, поиск, копирование JSX/CSS и переключение EN/RU работают.
- Hover/focus/pressed/loading/disabled у CTA согласованы, рамка соосна кнопке.
- Пустые имя/email и некорректный email дают сообщения, пустой телефон допустим.
- Демо-отправка не создаёт POST и не обращается к backend.
- Декор не ловит клики, соседние секции не обрезают glow.
- В reduced motion значения конечные, движения нет, фокус видим.
- Проверены `/` и BASE_URL с подпапкой; исходный лендинг не импортирует CSS нового каталога.

Результаты фактической проверки этой реализации: [design-system-qa.md](design-system-qa.md).

Автоматизированный браузерный smoke: `scripts/design-system-smoke.mjs`.
Playwright не входит в production-зависимости. Его можно установить отдельно:

```bash
npm install --prefix /tmp/aihub-design-qa playwright
PLAYWRIGHT_MODULE=/tmp/aihub-design-qa/node_modules/playwright/index.mjs \
  node scripts/design-system-smoke.mjs
```

Если Chromium не установлен, установите браузер через Playwright или укажите
`CHROME_PATH` (абсолютный путь к существующему Chromium). `PREVIEW_URL` меняет
базовый адрес, `QA_OUTPUT` задаёт каталог JSON-отчёта и PNG (по умолчанию `/tmp/aihub-design-qa`).
Не направляйте smoke на production-лендинг: он предназначен для локального каталога.
