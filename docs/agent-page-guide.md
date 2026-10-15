# Агентский гайд: новая страница по дизайн-системе

Читать после [AGENTS.md](../AGENTS.md). Цель: добавить настоящую multipage-страницу,
а не новый iframe каталога. Примеры ниже являются рецептом; страницы `workshop`
в проекте пока нет. Сам гайд не создаёт её и не меняет API общих компонентов.

## 1. Исходные данные

- Зафиксировать URL, аудиторию, основное действие, согласованный контент и обе локали.
- Решить, куда ведёт CTA: к секции главной, локальной форме или отдельному процессу.
- Отделить демонстрацию от интеграции. Не выдумывать кейсы, метрики и цены.
- Проверить `git status --short`; не включать чужие изменения в свою работу.
- Открыть [компоненты](../src/design-system/components.tsx),
  [токены](../src/design-system/tokens.css) и [магазин](../src/shop/Shop.tsx).

Ориентиры после запуска preview:

```text
http://localhost:4173/design-system.html
http://localhost:4173/design-system.html?preview=template&target=service&lang=ru
http://localhost:4173/design-system.html?preview=template&target=case&lang=en
http://localhost:4173/shop.html?lang=ru
```

`PageTemplate` и `BlockPattern` показывают композицию. Их тексты, цифры,
текстовый wordmark и `DemoContactForm` нельзя целиком выдавать за production-страницу.
Полное API: [design-system.md](design-system.md).

## 2. Файлы и HTML-вход

Предлагаемая структура **новых** файлов для примера:

```text
pages/workshop.html
src/pages/workshop/main.tsx
src/pages/workshop/WorkshopPage.tsx
src/pages/workshop/content.ts
src/pages/workshop/workshop.css
tsconfig.workshop.json
```

В [vite.config.ts](../vite.config.ts) добавить в `build.rollupOptions.input`:

```ts
workshop: path.resolve(__dirname, "pages/workshop.html"),
```

В `pages/workshop.html` задать уникальные title/description, `lang`, viewport,
`<body class="workshop-body">`, `<div id="root"></div>` и:

```html
<script type="module" src="/src/pages/workshop/main.tsx"></script>
```

Это **исходный module entry для Vite**, не ссылка на опубликованный JS.
Сборщик преобразует его с учётом base. Для статических ресурсов внутри HTML
использовать `%BASE_URL%brand/aihub-logo.png`, без сегмента `public/`.

Отдельный `tsconfig.workshop.json`:

```json
{
  "extends": "./tsconfig.app.json",
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.workshop.tsbuildinfo"
  },
  "include": ["src/pages/workshop", "src/vite-env.d.ts"]
}
```

Импортированные зависимости попадут в проверку автоматически. Изолированные
checks магазина и UI-kit не проверяют произвольную новую страницу.

## 3. Оболочка и локализация

`main.tsx` для указанного расположения:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LanguageProvider } from "../../i18n/LanguageContext";
import { WorkshopPage } from "./WorkshopPage";
import "./workshop.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <WorkshopPage />
    </LanguageProvider>
  </StrictMode>,
);
```

Минимальный **контент**, ещё без общей шапки, в `WorkshopPage.tsx`:

```tsx
import {
  Button, CtaFrame, Grid, PageContainer, Section, SectionHeading, SurfaceCard,
} from "../../design-system";
import { useLanguage } from "../../i18n/LanguageContext";

export function WorkshopPage() {
  const { lang } = useLanguage();
  const base = import.meta.env.BASE_URL;
  const labels = lang === "ru"
    ? { title: "AI-воркшоп", cta: "Обсудить задачу", items: ["Задача", "Данные", "План"] }
    : { title: "AI workshop", cta: "Discuss your project", items: ["Scope", "Data", "Plan"] };

  return (
    <div className="aihub-theme workshop-page">
      <main id="main-content">
        <Section aria-labelledby="workshop-title">
          <PageContainer>
            <SectionHeading id="workshop-title" level={1}>{labels.title}</SectionHeading>
            <Grid columns={3}>
              {labels.items.map((item) => <SurfaceCard key={item}>{item}</SurfaceCard>)}
            </Grid>
            <CtaFrame>
              <Button href={`${base}?lang=${lang}#contact`}>{labels.cta}</Button>
            </CtaFrame>
          </PageContainer>
        </Section>
      </main>
    </div>
  );
}
```

Импорт `../../design-system` уже подключает tokens/ui/patterns CSS. Не импортировать
[src/styles.css](../src/styles.css) или `catalog.css`. Начало scoped CSS:

```css
body.workshop-body { margin: 0; background: #060c24; }
.workshop-page { min-height: 100vh; overflow-x: clip; }
```

Body находится вне `.aihub-theme`, её переменные там ещё недоступны. Внутри темы
использовать токены. Для полностью scoped-CSS страницы добавить
`!./src/pages/workshop/**` в `content` [tailwind.config.cjs](../tailwind.config.cjs),
по аналогии с магазином. Полный контент вынести в `content.ts` с RU/EN.

## 4. Общее меню и hero

Не создавать копию [SiteHeader](../src/components/SiteHeader.tsx). Сейчас `page`
допускает только `"landing" | "shop"`. Следующие шаги являются **будущим изменением
компонента при реализации страницы**, а не уже существующим API:

1. Расширить union нейтральным значением `"content"`.
2. Оставить локальные якоря только для `landing`, ссылки через base для остальных.
3. Сохранить активность Shop только для `shop`; не передавать `shop` ради обхода типов.
4. Получить `toggleLang` из `useLanguage()` и вставить перед `main`
   `<SiteHeader page="content" lang={lang} onLanguageChange={toggleLang} />`.
5. Проверить `site-header--content`: обычный поток, без landing absolute overlay.
6. Добавлять новый пункт меню только если это часть задачи, а не для каждой страницы.

Provider сохраняет `?lang=ru|en`. Title страницы тоже должен реагировать на язык.
Добавить skip-link и проверить фокус. В футере использовать
[SiteLogo](../src/components/SiteHeader.tsx) и существующие legal-ссылки,
не копировать текстовый логотип демонстрационного шаблона.

Для печатающегося hero использовать [TypewriterText](../src/components/TypewriterText.tsx)
внутри одного `h1`/`SectionHeading level={1}`. Пример цвета строки:
`color: "var(--aihub-color-green)"`. Компонент резервирует высоту, скрывает промежуточные
буквы от скринридера и учитывает reduced motion. Не добавлять второй таймер.
Размеры и line-height сверить с реальными hero: scoped-настройки магазина
отличаются от общих display-токенов.

## 5. Сборка из компонентов

| Задача | Компоненты |
| --- | --- |
| Контейнер, секция, заголовок | PageContainer, Section, SectionHeading |
| Сетка и колонки | Grid, Split |
| Карточка | SurfaceCard; ссылка или Button внутри для действия |
| Основной CTA | CtaFrame + Button; href для навигации, button для действия |
| Поля и ошибки | TextField, FormMessage, Button loading |
| Объёмная иконка | SolutionIcon из [экспорта UI-kit](../src/design-system/index.ts) |
| Анимации и метрики | Reveal вокруг всей карточки, Metric/ProgressRing внутри |

Контейнер 1140 px, desktop от 1200 px; Grid: 1 колонка на телефоне, 2 от 768 px,
затем заданное число. Не масштабировать всю сцену через transform. Не добавлять
технические подписи, счётчики и eyebrow без задачи. Не обрезать glow на каждой
секции и не делать декор кликабельным. Общий новый вариант добавлять в UI-kit,
типы и каталог; одноразовую особенность оставлять в CSS страницы.

## 6. Пути и интеграции

Runtime-ссылки: `${base}pages/workshop.html?lang=${lang}`,
`${base}shop.html?lang=${lang}`, `${base}?lang=${lang}#services`.
Для локальной секции допустимо `#details`, если такой id есть.
Не использовать `/shop.html` или `../` для runtime-переходов из вложенной страницы.

`DemoContactForm` не отправляет лиды. Реальная форма требует отдельного контроллера,
валидации и согласованного endpoint. Магазин имеет отдельный
[план backend-интеграции](shop-backend-guide.md); не отправлять корзину в Contact API.

Для индексируемой страницы добавить canonical URL в [sitemap](../public/sitemap.xml)
и релевантную ссылку в [llms.txt](../public/llms.txt). `docs/` и AGENTS.md не
публикуются Vite автоматически. JSON в `.well-known` сам по себе не реализует протокол.

## 7. Приёмка

```bash
node scripts/check-agent-paths.mjs
npx tsc --noEmit -p tsconfig.workshop.json
npx tsc --noEmit -p tsconfig.shop.json
npx tsc --noEmit -p tsconfig.design-system.json
npm run build
node scripts/check-agent-paths.mjs --dist dist
npm run preview -- --port 4173 --strictPort
```

Повторить сборку с `VITE_BASE=/aihub-site/` и preview с тем же значением.
Не запускать dev и preview на одном порте. Здесь `VITE_BASE` читается из process env
конфигурации; для проверки задавать его перед командой. Не путать это с
[клиентскими env Vite](https://vite.dev/guide/env-and-mode).

- Проверить новую страницу на 390/768/1199/1200/1440/1920 px, RU/EN, после reload.
- Проверить прямое открытие вложенного URL, logo/home/shop/contact, якоря и язык.
- Проверить Tab/Shift+Tab/Enter/Escape, фокус, один h1 и доступные названия.
- Проверить длинный текст, loading/error/empty, потерянные изображения и reduced motion.
- Для общих компонентов запустить регрессию из [shop.md](shop.md) и
  [design-system.md](design-system.md); она не заменяет тесты новой страницы.
- Сохранить URL/ширины, PNG, вывод проверок и ограничения.
- Не отправлять реальные формы и не платить в production ради smoke.
- Не коммитить и не публиковать без явного разрешения в текущей задаче.

В отчёте указать путь страницы, изменения общих компонентов, выполненные проверки
и то, что осталось непроверенным. Vite build не заменяет TypeScript-check.
