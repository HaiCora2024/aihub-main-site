# Backend заявок магазина

Реализовано локально 2026-10-15. Production не включается этой документацией:
нужны отдельное разрешение выпуска и [операционный checklist](shop-operations.md).
Это **необязывающая заявка** без оплаты, автоматического счёта, расчёта VAT/VIES
или договора. Менеджер согласует окончательную стоимость и налоги отдельно.

## Архитектура

`shop.html -> checkout.html -> /api/shop/requests -> SQLite + transactional outbox -> SMTP`.

Тот же Node-процесс обслуживает старый `/api/contact`, без изменения его payload,
получателей и записи в Sheets. Новые shop-заявки в Sheets не копируются.
SQLite `/data/shop/shop.sqlite`, `node:sqlite`, **один экземпляр** приложения,
`journal_mode=DELETE`, `synchronous=FULL`, FK и `secure_delete`. Требуется Node >=22.16.
На Node 22/24 возможен штатный experimental warning для SQLite.

| Слой | Исходник |
| --- | --- |
| Цены, названия, единицы, версия | [catalog.json](../backend/contact-api/shared/catalog.json) |
| Реквизиты и версии документов | [seller.json](../backend/contact-api/shared/seller.json), [legal.json](../backend/contact-api/shared/legal.json) |
| Валидация и серверные цены | [contract.js](../backend/contact-api/shop/contract.js) |
| Транзакции, очередь, lifecycle | [store.js](../backend/contact-api/shop/store.js) |
| CORS, HTTP, ограничения, worker | [service.js](../backend/contact-api/shop/service.js) |
| Письма | [mail.js](../backend/contact-api/shop/mail.js) |
| Шифрование backup и restore | [maintenance.js](../backend/contact-api/shop/maintenance.js) |
| Операторские команды | [admin.js](../backend/contact-api/shop/admin.js) |
| UI и API-клиент | [Checkout.tsx](../src/shop/Checkout.tsx), [api.ts](../src/shop/api.ts) |
| Ключ и очистка корзины | [submission.ts](../src/shop/submission.ts) |

## HTTP-контракт

Все ответы JSON и `Cache-Control: no-store`. Версии не копировать вручную в интеграцию:
получать из каталога. Клиент отправляет только ID/qty; переданные клиентом цены
игнорируются, сервер вычисляет EUR minor units из общего каталога.

| Метод | URL | Результат |
| --- | --- | --- |
| GET | `/api/shop/catalog` | `version`, `currency`, `products`, `legal`, `mode`, `vatStatus` |
| POST | `/api/shop/requests` | 201 новая сохранённая заявка; 200 идемпотентный повтор |
| GET | `/api/shop/requests/status` | Минимальное подтверждение по секрету в Bearer header |
| GET/HEAD | `/health` | Жив ли HTTP-процесс; не доказательство работы SMTP/БД |
| GET/HEAD | `/health/ready` | 200 если shop БД доступна и обслуживание хранилища успешно; иначе 503 |

Пример тела POST, версии подставляются из GET:

```json
{
  "locale": "en",
  "items": [{ "id": 1, "qty": 1 }],
  "customer": { "name": "Test Buyer", "email": "buyer@example.test", "phone": "" },
  "billing": {
    "type": "individual", "country": "PL", "address": "Example Street 1",
    "addressLine2": "", "city": "Poznan", "region": "", "postalCode": "60-001"
  },
  "comment": "",
  "website": "",
  "catalogVersion": "VALUE_FROM_CATALOG",
  "termsVersion": "VALUE_FROM_CATALOG",
  "privacyVersion": "VALUE_FROM_CATALOG",
  "termsAccepted": true
}
```

B2B: `billing.type=business`, обязательный `companyName`, необязательный
`registrationNumber`, boolean `vatRegistered`; при true обязательный `vatId`.
VAT ID нормализуется, но не проверяется через VIES и не означает освобождение от налога.
ISO-коды стран и исключения обязательного индекса: `shared/countries.json`.
Лимиты: тело 20 KiB, максимум 8 уникальных позиций, qty 1..99, комментарий 2000 символов.
Контактные значения и поля имеют дополнительные лимиты в `contract.js`.

Ответ содержит `request: { id, createdAt, status: received, mode: request,
currency: EUR, estimatedTotalMinor, vatStatus: pending_review }`, `requestId`;
создание также возвращает `replayed`. Контакты, адрес и содержимое писем не возвращаются.
201 означает **commit**, а не успешную доставку email.

Ошибки: `{ error: { code, fields }, requestId }`. Значимые коды:
`VALIDATION_ERROR` (400), `BODY_TOO_LARGE` (413), `UNSUPPORTED_MEDIA_TYPE` (415),
`CATALOG_CHANGED` / `LEGAL_CHANGED` / `IDEMPOTENCY_CONFLICT` (409),
`REQUEST_NOT_FOUND` (404), `REQUEST_DELETED` (410), `RATE_LIMITED` (429),
`SHOP_UNAVAILABLE` (503). 429 содержит `Retry-After: 900`.

## Идемпотентность и восстановление

Перед первой отправкой браузер генерирует 32 случайных байта, кодирует 64 lowercase
hex и отправляет в `Idempotency-Key`. В БД уникален SHA-256 ключа, не открытый секрет.
Тот же нормализованный payload и ключ возвращают прежнюю заявку; другой payload
с тем же ключом даёт 409. Заявка и две задачи outbox записываются одной транзакцией.
Повтор ранее принятого запроса работает и после смены версии каталога.

Статус требует `Authorization: Bearer <тот же ключ>`. Номер заявки не даёт доступа.
Секрет нельзя помещать в URL, логи, аналитику или письмо. Доступ через этот endpoint
не предоставляет полный экспорт персональных данных.

Ключ + снимок корзины допустимы в sessionStorage, форма остаётся только в памяти.
После сетевого сбоя UI не создаёт новый ключ автоматически: проверка статуса,
затем повтор того же запроса. После reload сохранённая заявка восстанавливается;
если её нет, пользователь вводит контакты снова под прежним ключом. Закрытие сессии
может потерять ключ; в таком случае обращаться в sales, не обещать восстановление
по публичному номеру. Невалидный ответ API не считается успешной отправкой.

После подтверждения вычитаются отправленные количества из свежей корзины, а не
очищается весь localStorage. Web Locks сериализуют повторное применение подтверждения.
Неперсональные последние receipt IDs ограничены 20 записями. При ошибке хранилища
безопаснее оставить позиции, чем повторно вычесть их; сама заявка уже сохранена.

## Письма и защита

Две независимые задачи: полные реквизиты в sales и краткая квитанция клиенту.
Авторизованный SMTP From остаётся прежним; Reply-To у sales указывает клиента,
у клиента указывает sales. Шаблоны plain text, без исполняемого HTML и вложений.
Нельзя разрешать клиенту задавать From/To, шаблон, callback URL или цену.

Worker проверяет очередь каждые 5 секунд, захватывает lease 120 секунд и повторяет
ошибки с задержками до восьми попыток. После этого `failed`, ручной разбор и retry.
Message-ID стабилен для задания, но SMTP может доставить дубликат после потери ACK.
Гарантия идемпотентности относится к записи заявки, не к абсолютному exactly-once email.

CORS разрешает только настроенные origins и необходимые headers; originless вызовы
возможны, поскольку это публичная guest-форма, не аутентификация. Лимит POST 5/15 min
и status 120/15 min; IP хешируется с солью процесса, карта ограничена и очищается.
За reverse proxy нужно явно проверить и настроить число доверенных hops; доверять
произвольному X-Forwarded-For нельзя. Honeypot дополняет, но не заменяет rate limit.
Логи магазина содержат технические коды и номера, не payload, адреса или email.

## Изменение каталога и документов

Менять коммерческие поля только в shared JSON; descriptions/categories остаются
в `src/shop/data.ts`. Повышать `catalog.version` при изменении коммерческого смысла.
Не переиспользовать ID другого товара. Сохранять совместимость незавершённых корзин.

Документы: [content.ts](../src/legal/content.ts), версии в `shared/legal.json`.
Сначала согласовать текст и фактическую обработку, затем обновить версию и собрать
backend/frontend вместе. Несовпадение API и опубликованной версии блокирует новую
отправку. 409 сбрасывает checkbox и требует повторного ознакомления, не стирая поля.
Будущая онлайн-оплата требует нового согласования и отдельной архитектуры.

## Проверки

```bash
npm --prefix backend/contact-api ci
npm --prefix backend/contact-api test
npx tsc --noEmit -p tsconfig.shop.json
npm run build
node scripts/check-agent-paths.mjs --dist dist
```

[checkout-smoke.mjs](../scripts/checkout-smoke.mjs) запускает временные API/SQLite,
Vite и локальный SMTP sink. Параметры Playwright описаны в [shop.md](shop.md).
`QA_BASE=/nested/` проверяет подкаталог. Он не использует production SMTP или БД.
Старый [shop-smoke.mjs](../scripts/shop-smoke.mjs) проверяет каталог/корзину/переходы
без POST. Производственный smoke требует отдельного разрешения на реальные письма.
