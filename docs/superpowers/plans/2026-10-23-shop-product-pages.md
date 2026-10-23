# Магазин: страницы товаров и уровни — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** у каждой услуги магазина есть уровни с ценами и отдельная страница
(PDP); карточки ведут на PDP, цены подписаны «нетто, + VAT · ориентировочно»,
в корзину и заявку идёт выбранный уровень.

**Architecture:** уровни хранятся в общем `catalog.json`; чистая логика цен и
корзины вынесена в `src/shop/pricing.ts` без импортов из браузера и тестируется
`node --test`. Сервер принимает `packageId` и считает цену сам. PDP — отдельные
HTML-входы `shop/<slug>.html`, которые рендерит общий `ProductPage`; язык,
корзина и панель корзины вынесены из `Shop.tsx` в общие модули.

**Tech Stack:** React 18, TypeScript, Vite multipage, Node ≥22.16 (`node:test`,
`node:sqlite`), Playwright для smoke вне проекта.

**Spec:** [docs/superpowers/specs/2026-10-23-shop-product-pages-design.md](../specs/2026-10-23-shop-product-pages-design.md)

## Global Constraints

- Ветка `feat/shop-product-pages`; push, PR и выкладка только по запросу.
- Новых npm-зависимостей нет. Router, PageBuilder, `clsx` не ставить.
- Валюта `EUR`; цены в каталоге в minor units; `catalog.version` → `2026-10-23-v3`;
  `legal.termsVersion` → `2026-10-23-request-v3`.
- Подпись цены везде из одного ключа `copy[lang].priceNote`:
  EN `net, + VAT · indicative`, RU `нетто, + VAT · ориентировочно`.
- Итог в корзине, checkout и письмах: EN `Indicative estimate, net`,
  RU `Ориентировочно, нетто`. Фраза про «верхнюю границу» удаляется везде.
- В текстах магазина нет цифр эффекта и слов «гарантированно», «мгновенно»,
  «сразу», «за секунды» (EN: guaranteed, instant, immediately, in seconds).
- EN и RU в каждом новом тексте; `Localized = Record<ShopLanguage, string>`.
- Стили только scoped `.shop-*`; компоненты из `src/design-system`; клавиатура,
  доступные имена, reduced motion.
- Внутренние URL через `import.meta.env.BASE_URL`; ссылки внутри магазина
  сохраняют `?lang=`.
- Тесты фронтенд-логики: `node --test scripts/*.test.mjs` (Node 24 снимает
  типы при импорте `.ts`). Тесты сервера: `cd backend/contact-api && npm test`.

## Review Focus

1. Корзина в браузере в старом формате `[{id, qty}]` (живой сайт и PR #3) —
   открывается, каждая строка получает самый дешёвый уровень. Тест в Task 2.
2. Незавершённая заявка в sessionStorage без `packageId` — повторная отправка
   идёт с тем же телом (без `packageId`), чтобы идемпотентный повтор не дал
   `IDEMPOTENCY_CONFLICT`; сервер подставляет самый дешёвый уровень. Тест в Task 1
   (сервер) и Task 2 (`normalizePending`).
3. Один товар двумя уровнями — две строки, у каждой свой qty; удаление одной
   не трогает другую. Тест в Task 2.
4. `packageId` существует, но у другого товара (`{id: 4, packageId: "pro"}`) —
   `VALIDATION_ERROR`. Тест в Task 1.
5. Повторное «Выбрать» того же уровня на PDP увеличивает qty, максимум 99,
   кнопка блокируется на 99. Тест в Task 2 (логика) и Task 9 (smoke).

---

## Файлы

| Файл | Ответственность |
| --- | --- |
| `backend/contact-api/shared/catalog.json` | Товары: `id`, `slug`, `unit`, `name`, `packages` |
| `backend/contact-api/shop/contract.js` | Валидация `items[].packageId`, цена по уровню |
| `backend/contact-api/shop/mail.js` | Уровень в строке письма, подпись итога |
| `src/shop/pricing.ts` (new) | Чистые функции: диапазон, уровни, нормализация и математика корзины |
| `src/shop/cart.ts` | Обёртки над `pricing.ts` с `localStorage` и данными магазина |
| `src/shop/data.ts` | Тексты товаров и уровней, `priceNote`, новые ключи copy |
| `src/shop/useShopLanguage.ts` (new) | Язык из `?lang`, `<html lang>`, title |
| `src/shop/useShopCart.ts` (new) | Состояние корзины, синхронизация, добавление уровня |
| `src/shop/CartDrawer.tsx` (new) | Панель корзины (вынесена из `Shop.tsx`) |
| `src/shop/ProductPage.tsx`, `product-main.tsx` (new) | PDP |
| `shop/*.html` (new, 8 файлов) | Входы PDP |
| `scripts/check-shop-pages.mjs` (new) | Сверка каталога, HTML-входов и текстов |
| `scripts/shop-pricing.test.mjs`, `scripts/check-shop-pages.test.mjs` (new) | Тесты |

---

### Task 1: Каталог с уровнями и сервер

**Files:**
- Modify: `backend/contact-api/shared/catalog.json`, `backend/contact-api/shared/legal.json`
- Modify: `backend/contact-api/shop/contract.js:118-170`, `backend/contact-api/shop/mail.js:9-30,61`
- Modify: `src/shop/data.ts` (только чтение каталога, чтобы сборка оставалась зелёной)
- Test: `backend/contact-api/test/shop.test.js`

**Interfaces:**
- Produces: `catalog.products[i] = { id, slug, unit, name, packages: [{ id, priceMinor, openEnded, name }] }`;
  `validateSubmission` → `clean.items: [{ id, packageId, qty }]` (packageId всегда заполнен);
  `priceItems(items)` → `[{ id, packageId, qty, name, packageName, unit, unitPriceMinor, openEnded }]`.
- `MAX_ITEMS = 8` экспортируется из `contract.js`.

- [ ] **Step 1: Обновить `catalog.json`.** Удалить `priceFromMinor`, `unitPriceMinor`,
  `openEnded` с уровня товара; добавить `slug` и `packages` по таблице. Имена
  уровней: start Start/Старт, business Business/Бизнес, pro Pro/Про,
  standard Standard/Стандарт, extended Extended/Расширенный, session Session/Сессия,
  team Team/Команда. `version: "2026-10-23-v3"`. `legal.json`:
  `termsVersion: "2026-10-23-request-v3"`.

  | id | slug | packages (`id:priceMinor`, `+` = openEnded) |
  | --- | --- | --- |
  | 1 | voice-assistant | start:180000, business:280000, pro:400000+ |
  | 2 | chat-assistant | standard:150000 |
  | 3 | email-orders | start:90000, extended:250000 |
  | 4 | document-autofill | start:30000, extended:90000 |
  | 5 | kpi-reporting | start:30000, extended:90000 |
  | 6 | sentiment-monitor | start:90000, extended:250000 |
  | 7 | recommendations | start:250000, business:500000, pro:750000+ |
  | 8 | discovery-workshop | session:40000, team:185000 |

- [ ] **Step 2: Написать падающие тесты** в `shop.test.js`:
  - `prices the selected package on the server`: `items: [{id:1, packageId:"pro", qty:2, unitPriceMinor:1}]`
    → 201, `estimatedTotalMinor === 800000`, `currency === "EUR"`.
  - `defaults a missing packageId to the cheapest package`: `[{id:1, qty:1}]` → `180000`.
  - `rejects a package that belongs to another product`: `[{id:4, packageId:"pro", qty:1}]`
    → 400, `error.code === "VALIDATION_ERROR"`, `error.fields.items === "invalid"`.
  - `keeps two packages of one product as two lines`: `[{id:1,packageId:"start",qty:1},{id:1,packageId:"pro",qty:1}]`
    → `580000`.
  - `rejects duplicate product+package lines`: две строки `{id:1,packageId:"start"}` → 400.
  - `names the package and net estimate in the sales email`: письмо sales содержит
    `1 x AI Voice Assistant · Pro (from 4000.00 EUR)` и `Indicative estimate, net`.
  - Существующий тест `request is durable…` обновить: `items: [{id:1, packageId:"start", qty:2}]` → `360000`.
- [ ] **Step 3: Запустить** `cd backend/contact-api && npm test` — новые тесты FAIL.
- [ ] **Step 4: Реализовать.** В `validateSubmission`: лимит строк `MAX_ITEMS`;
  `packageId` — отсутствует или строка `^[a-z0-9-]{1,32}$` из уровней этого товара;
  отсутствующий заменяется id самого дешёвого уровня; ключ уникальности
  `${id}:${packageId}`; сортировка по `id`, затем по цене уровня. `priceItems`
  берёт `unitPriceMinor` из уровня. `mail.js`: строка
  `${qty} x ${name} · ${packageName} (${openEnded ? from : ""}${price} EUR)`
  (`from ` / `от `), итог `Indicative estimate, net` / `Ориентировочно, нетто`
  в обоих письмах. В `data.ts` временно: `price = max(priceMinor)/100`,
  `priceFrom = min(priceMinor)/100`, `openEnded` от самого дорогого уровня.
- [ ] **Step 5: Проверить:** `npm test` в `backend/contact-api` — все PASS;
  `npx tsc --noEmit -p tsconfig.shop.json` — без ошибок.
- [ ] **Step 6: Commit** `feat(shop): packages in catalog, server prices selected package`.

---

### Task 2: Чистая логика цен и корзины

**Files:**
- Create: `src/shop/pricing.ts`, `scripts/shop-pricing.test.mjs`
- Modify: `src/shop/cart.ts`, `src/shop/submission.ts`, `src/shop/data.ts`

**Interfaces:**
- Consumes: формат каталога из Task 1.
- Produces (`pricing.ts`, без runtime-импортов):
  ```ts
  export interface ShopPackage { id: string; priceMinor: number; openEnded: boolean; name: Record<string, string> }
  export interface PricedProduct { id: number; packages: ShopPackage[] }
  export interface CartItem { id: number; packageId: string; qty: number }
  export interface RequestItem { id: number; packageId?: string; qty: number }
  export const MAX_QUANTITY = 99;
  export const MAX_LINES = 8;
  export function priceRange(p: PricedProduct): { fromMinor: number; toMinor: number; openEnded: boolean; single: boolean }
  export function cheapestPackage(p: PricedProduct): ShopPackage
  export function findPackage(products: PricedProduct[], id: number, packageId: string): ShopPackage | undefined
  export function normalizeCart(value: unknown, products: PricedProduct[]): CartItem[]
  export function normalizePending(value: unknown, products: PricedProduct[]): RequestItem[] | null
  export function changeQuantity(cart: CartItem[], products: PricedProduct[], id: number, packageId: string, delta: number): CartItem[]
  export function removeLine(cart: CartItem[], id: number, packageId: string): CartItem[]
  export function cartTotalMinor(cart: RequestItem[], products: PricedProduct[]): number
  ```
- `cart.ts` экспортирует: `CART_KEY`, `MAX_QUANTITY`, `CartItem`, `readCart()`,
  `updateQuantity(cart, id, packageId, delta)`, `removeItem(cart, id, packageId)`,
  `cartTotal(cart): number` (в евро). `data.ts`: `Product.packages: ShopPackage[]`
  (с текстами из Task 4 позже), `formatPriceRange(product, lang)` на `priceRange`.

- [ ] **Step 1: Написать падающие тесты** `scripts/shop-pricing.test.mjs`
  (импорт `../src/shop/pricing.ts` и `../backend/contact-api/shared/catalog.json` с
  `with { type: "json" }`):
  - `priceRange`: товар 1 → `{fromMinor:180000,toMinor:400000,openEnded:true,single:false}`;
    товар 2 → `single:true`, `fromMinor===toMinor===150000`.
  - `normalizeCart([{id:1,qty:2},{id:3,qty:1}])` → `[{id:1,packageId:"start",qty:2},{id:3,packageId:"start",qty:1}]`.
  - `normalizeCart` удаляет `{id:1,packageId:"nope"}`, `{id:99,...}`, qty ≤0;
    объединяет повторы одной пары с ограничением 99; не-массив → `[]`.
  - `changeQuantity` для новой пары добавляет строку; `+1` на qty 99 оставляет 99;
    до 0 удаляет только эту пару; `{1,start}` и `{1,pro}` — разные строки.
  - `removeLine(cart, 1, "pro")` оставляет `{1,start}`.
  - `cartTotalMinor([{id:1,packageId:"pro",qty:1},{id:2,packageId:"standard",qty:2}])` → `700000`;
    строка без `packageId` считается по самому дешёвому.
  - `normalizePending([{id:1,qty:1}])` → `[{id:1,qty:1}]` (без подстановки `packageId`);
    неизвестный `packageId` → `null`; более 8 строк → `null`.
- [ ] **Step 2: Запустить** `node --test scripts/shop-pricing.test.mjs` — FAIL (нет модуля).
- [ ] **Step 3: Реализовать `pricing.ts`**, затем перевести `cart.ts`, `submission.ts`
  (`PendingSubmission.items: RequestItem[]`, `readPending` через `normalizePending`,
  отправка тела без добавления `packageId`) и `data.ts` на эти функции. `Shop.tsx`
  и `Checkout.tsx` правятся только по сигнатурам: карточка пока добавляет
  самый дешёвый уровень, строки корзины ключуются по `${id}:${packageId}`.
- [ ] **Step 4: Проверить:** тесты PASS; `npx tsc --noEmit -p tsconfig.shop.json` чисто.
- [ ] **Step 5: Commit** `feat(shop): package-aware cart logic`.

---

### Task 3: Общие модули языка, корзины и панели корзины

**Files:**
- Create: `src/shop/useShopLanguage.ts`, `src/shop/useShopCart.ts`, `src/shop/CartDrawer.tsx`
- Modify: `src/shop/Shop.tsx` (строки 61–140 и блок `<ShopDialog>` от ~444)

**Interfaces:**
- Consumes: `cart.ts` из Task 2.
- Produces:
  ```ts
  useShopLanguage(titles: Record<ShopLanguage, string>): { lang: ShopLanguage; setLang(l: ShopLanguage): void; t: (typeof copy)[ShopLanguage] }
  useShopCart(): { cart: CartItem[]; setCart: Dispatch<SetStateAction<CartItem[]>>; count: number; total: number; add(id: number, packageId: string): void }
  <CartDrawer open lang cart setCart onClose onCheckout />  // разметка и классы как сейчас
  ```
- `useShopCart` переносит запись в `localStorage` и подписку на `storage` без
  изменения поведения. `CartDrawer` выводит под названием строки уровень:
  `${product.name[lang]} · ${pkg.name[lang]}` и цену уровня.

- [ ] **Step 1: Вынести код** без изменения поведения; `Shop.tsx` использует модули.
- [ ] **Step 2: Проверить:** `npx tsc --noEmit -p tsconfig.shop.json`, `npm run build`;
  в браузере (`npm run preview -- --port 4173 --strictPort`) на `shop.html?lang=ru`
  добавление, изменение qty, удаление, перезагрузка и синхронизация двух вкладок
  работают как до правки.
- [ ] **Step 3: Commit** `refactor(shop): share language, cart and drawer`.

---

### Task 4: Тексты уровней, подписи и правки формулировок

**Files:**
- Modify: `src/shop/data.ts`, `src/shop/checkout-copy.ts`, `src/legal/content.ts:85-90,195-200`

**Interfaces:**
- Produces в `data.ts`:
  ```ts
  interface ProductDetail { …; packages: Record<string, { features: Localized[] }>; priceFactors: Localized[]; timeline: Localized }
  copy[lang]: priceNote, finalPriceNote, details, choosePackage, from, priceFactorsTitle,
              processTitle, processSteps (string[] из 3), notFound, notFoundText, backToShop, breadcrumbShop
  ```
- `data.ts` бросает `Error("Shop texts do not match catalog")`, если набор
  `packages` в текстах не совпадает с каталогом.

- [ ] **Step 1: Добавить тексты** по спецификации (раздел «Черновик уровней»):
  3–5 `features` на уровень, 3–4 `priceFactors`, `timeline` из таблицы сроков.
  Без запрещённых слов из Global Constraints.
- [ ] **Step 2: Заменить формулировки:** заголовок `title/titleAccent` →
  EN `AI solutions` / `built for your business.`, RU `AI-решения` / `под ваш бизнес.`;
  описания товаров 4, 7, 8 по спецификации; `total` → итог из Global Constraints;
  удалить `rangeNote`. `checkout-copy.ts`: `estimate` → итог из Global Constraints.
  Юридический раздел «Оценка и VAT» EN/RU: суммы нетто без VAT, цена выбранного
  уровня ориентировочная, окончательная цена и налоги до договора.
- [ ] **Step 3: Проверить:**
  `grep -nEi "guarantee|instant|immediately|in seconds|гарантирован|мгновенн|сразу|за секунды|20–30|верхн" src/shop src/legal/content.ts`
  — совпадений в текстах магазина нет (VAT-оговорки в legal допустимы);
  `npx tsc --noEmit -p tsconfig.shop.json` чисто.
- [ ] **Step 4: Commit** `feat(shop): package copy, net price notes, safer wording`.

---

### Task 5: Страница товара

**Files:**
- Create: `shop/<slug>.html` ×8, `src/shop/product-main.tsx`, `src/shop/ProductPage.tsx`
- Modify: `vite.config.ts` (8 входов `product<Slug>`), `src/shop/shop.css` (блоки `.shop-pdp-*`)

**Interfaces:**
- Consumes: `useShopLanguage`, `useShopCart`, `CartDrawer` (Task 3); тексты (Task 4).
- HTML-вход: как `shop.html`, плюс `<meta name="aihub-product" content="<slug>">`,
  `<title><EN name> | AIHUB</title>`, `meta description` = EN-описание товара,
  `<script type="module" src="/src/shop/product-main.tsx">`.

- [ ] **Step 1: Создать входы и `product-main.tsx`**, который читает meta и рендерит
  `<ProductPage slug={…} />`.
- [ ] **Step 2: Реализовать `ProductPage`** по спецификации (раздел «PDP»): крошки
  `Магазин → категория → услуга` с `?lang`; шапка с ценой, `priceNote`,
  `finalPriceNote`; карточки уровней (цена уровня, `от` для `openEnded`,
  кнопка `choosePackage` с именем «<choosePackage>: <уровень>», вызывает `add`
  и открывает `CartDrawer`, блокируется на qty 99); `priceFactors`; три шага
  процесса и `timeline`; оговорка корзины и CTA на контактную форму главной.
  Неизвестный slug — `notFound`, `notFoundText`, ссылка `backToShop`.
  `document.title`: `<имя на языке> | AIHUB`.
- [ ] **Step 3: Проверить:** `npx tsc --noEmit -p tsconfig.shop.json`; `npm run build`; в браузере
  `shop/voice-assistant.html?lang=ru` и `?lang=en` на 390/768/1200/1440 px,
  выбор уровня, Tab по всем кнопкам, reduced motion; `shop/unknown.html` не
  существует, поэтому проверка «не найдено» — временной правкой meta в DevTools.
- [ ] **Step 4: Commit** `feat(shop): product detail pages`.

---

### Task 6: Проверка страниц товаров (скрипт)

**Files:**
- Create: `scripts/check-shop-pages.mjs`, `scripts/check-shop-pages.test.mjs`
- Modify: `scripts/check-agent-paths.mjs` (вызов проверки)

**Interfaces:**
- Produces: `export async function checkShopPages(root: string): Promise<string[]>`
  (список ошибок, пустой — успех); CLI `node scripts/check-shop-pages.mjs`
  печатает ошибки и выходит с кодом 1.
- Проверяет: для каждого товара `shop/<slug>.html` существует; в `vite.config.ts`
  есть `path.resolve(__dirname, "shop/<slug>.html")`; `meta name="aihub-product"`
  равна slug; в `shop/` нет HTML без товара; ≥1 уровня; id уровней уникальны;
  `openEnded` только у самого дорогого; ключи текстов уровней в `data.ts`
  совпадают с каталогом (поиск по исходнику `data.ts` блока slug).

- [ ] **Step 1: Написать падающие тесты** на временной копии фикстуры
  (`fs.mkdtemp` в `os.tmpdir()`, минимальные `catalog.json`, `vite.config.ts`, `shop/*.html`):
  - валидная фикстура → `[]`;
  - нет `shop/b.html` → ошибка содержит `shop/b.html`;
  - `meta` с чужим slug → ошибка содержит `aihub-product`;
  - лишний `shop/old.html` → ошибка содержит `old.html`;
  - `openEnded` у не самого дорогого → ошибка содержит `openEnded`.
- [ ] **Step 2: Запустить** `node --test scripts/check-shop-pages.test.mjs` — FAIL.
- [ ] **Step 3: Реализовать** и подключить в `check-agent-paths.mjs` (ошибки идут
  в его `failures`).
- [ ] **Step 4: Проверить:** тесты PASS; `node scripts/check-agent-paths.mjs` на
  репозитории без ошибок (8 страниц уже созданы в Task 5).
- [ ] **Step 5: Commit** `test(shop): check product pages against catalog`.

---

### Task 7: Карточки на стартовой странице магазина

**Files:**
- Modify: `src/shop/Shop.tsx` (карточка ~строки 296–345), `src/shop/shop.css`

- [ ] **Step 1: Изменить карточку:** цена `formatPriceRange`, под ней `priceNote`;
  кнопку «В корзину» заменить ссылкой `Button`/`NavLink` UI-kit на
  `${BASE_URL}shop/${slug}.html?lang=${lang}`, текст `details`, `aria-label`
  `${details}: ${name}`. Удалить ставший ненужным код добавления с карточки и
  объявление `added`.
- [ ] **Step 2: Проверить:** `npx tsc --noEmit -p tsconfig.shop.json`; в браузере
  каждая из 8 карточек открывает свою PDP с тем же языком; ширина цены и подписи
  не переполняет карточку на 390 и 1200 px.
- [ ] **Step 3: Commit** `feat(shop): cards link to product pages`.

---

### Task 8: Checkout, API-клиент и документация

**Files:**
- Modify: `src/shop/contracts.ts`, `src/shop/api.ts:58-80`, `src/shop/Checkout.tsx:89-105,745-775`
- Modify: `docs/shop.md`, `docs/shop-backend-guide.md`

- [ ] **Step 1:** `ShopCatalog.products[i]` → `{ id, slug, unit, name, packages }`,
  `Submission.items: RequestItem[]`; `loadCatalog` проверяет `packages`
  (непустой массив, строковый `id`, целый `priceMinor ≥ 0`, boolean `openEnded`,
  `name.en/ru` строки). Checkout: оценка через `cartTotalMinor` по каталогу API,
  строка выбора `qty × уровень · цена` (`от` для `openEnded`), отсутствие
  `packageId` в каталоге API блокирует отправку так же, как неизвестный товар.
- [ ] **Step 2: Документация:** в `docs/shop.md` описать `packages`, PDP,
  `check-shop-pages`, формат корзины `{id, packageId, qty}`; в
  `docs/shop-backend-guide.md` пример POST с `packageId` и правило подстановки
  самого дешёвого уровня.
- [ ] **Step 3: Проверить:** `npx tsc --noEmit -p tsconfig.shop.json`;
  `node scripts/check-agent-paths.mjs`; `node scripts/checkout-smoke.mjs` по
  инструкции из `docs/shop-operations.md` (локальный SMTP sink).
- [ ] **Step 4: Commit** `feat(shop): checkout and docs for packages`.

---

### Task 9: Smoke и финальная проверка

**Files:**
- Modify: `scripts/shop-smoke.mjs`

- [ ] **Step 1: Обновить smoke:** добавление через PDP вместо карточки; суммы
  сценария корзины: голосовой «Старт» ×2 + чат «Стандарт» ×1 = `€5,100`,
  уменьшение голосового → `€3,300`, увеличение чата → `€4,800`; новый сценарий
  «Подробнее» на каждой из 8 карточек → URL `shop/<slug>.html?lang=en`;
  `localStorage.aihub_cart = '[{"id":1,"qty":1}]'` → строка «AI Voice Assistant · Start»;
  на PDP qty 99 блокирует кнопку уровня.
- [ ] **Step 2: Запустить** по `docs/shop.md` (Playwright в `/tmp/aihub-shop-qa-tools`,
  `npm run preview -- --port 4173 --strictPort`) — все проверки PASS.
- [ ] **Step 3: Полный набор:**
  `node --test scripts/*.test.mjs`; `cd backend/contact-api && npm test`;
  `npx tsc --noEmit -p tsconfig.shop.json`; `npx tsc --noEmit -p tsconfig.design-system.json`;
  `npm run build`; `node scripts/check-agent-paths.mjs --dist dist`; `git diff --check`.
- [ ] **Step 4: Commit** `test(shop): smoke for product pages and packages`.
