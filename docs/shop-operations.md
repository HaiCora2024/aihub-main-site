# Магазин: эксплуатация и выпуск

Подготовка защиты форм от 28.10.2026: [реализация и включение](forms-antibot.md).
Рабочие ключи Cloudflare ещё не подключены; этот этап не является production-выпуском.

Статус на 2026-10-16: после выпуска тестовой копии владелец отдельно разрешил
публикацию на `aihub.works` вместе с закреплением корзины при прокрутке.
Основной сайт опубликован; backend Amvera `waw0` RUNNING, 1/1 экземпляр.
Реальные тестовые письма отдельно не разрешены и не отправлялись.

## Защита форм 28.10.2026

Основной сайт и Amvera обновлены до `d931fb3`, обязательный Turnstile включён
для консультаций и checkout. Рабочие токены обоих actions проверены напрямую
через Siteverify; без токена оба endpoint возвращают 403. Backend RUNNING 1/1,
readiness 200, опубликованные формы прошли 40 read-only проверок без заявок
и доставки писем. Уровни продуктов сохранены, тестовый Pages не обновлялся.
Подтверждение ingress Amvera остаётся незакрытым: доверие proxy выключено,
IP-лимит может быть общим. SHA, workflow, проверки и ограничения:
[отчёт выпуска защиты форм](forms-antibot.md#выпуск-на-основной-домен-28102026).

## Основной выпуск 16.10.2026

- Frontend: `2cca15be9a1bbc68227dfdc0164a499a959438d5` в
  `HaiCora2024/aihub-main-site`, без force-push.
  [Pages workflow 38809946896](https://github.com/HaiCora2024/aihub-main-site/actions/runs/38809946896)
  завершился success. [Магазин](https://aihub.works/shop.html?lang=ru).
- Кнопка корзины закрепляется после прокрутки её исходного места и остаётся
  доступной до футера. Один DOM-trigger, стабильное место в макете,
  возврат фокуса без скачка страницы, обновляемый счётчик.
- `VITE_BASE=/`, `VITE_SHOP_API_URL=https://aihub-form-getcher.waw0.amvera.tech`
  заданы в основном репозитории. В Amvera `SHOP_SITE_URL=https://aihub.works/`;
  выполнен restart без смены backend-кода, тарифа и числа экземпляров.
- Локально: build и `tsc -p tsconfig.shop.json --noEmit` успешны;
  `shop-smoke.mjs` 69/69, `sticky-cart-smoke.mjs` 118/118.
  На основном домене sticky smoke 118/118: RU/EN, 320-1920 px, прокрутка до
  футера, resize/reload, открытие/закрытие и счётчик. JS ошибок и 404 нет.
- На основном домене `company-details-smoke.mjs` 210/210: реквизиты,
  ссылки в header/footer, мобильные размеры и страницы кейсов.
- Checkout на основном домене загрузил живой каталог 200, показал доступную
  кнопку отправки и непредвыбранные условия. Readiness 200; CORS для
  `https://aihub.works` 204. POST не выполнялся.
- Артефакты: `/tmp/aihub-sticky-cart-live/report.json`,
  `/tmp/aihub-company-primary-live/report.json`, `/tmp/aihub-checkout-primary-live.png`,
  `/tmp/aihub-shop-primary-qa/report.json`.
  Тестовая копия остаётся на предыдущем выпуске, в этой задаче не обновлялась.
- Открытые организационные условия ниже сохраняются: разрешение публикации
  не заменяет проверку доставки писем, независимых резервных копий и договоров.

## Предыдущий выпуск тестовой копии 16.10.2026

- Код frontend/backend: `5f610fcc6cf8bb82f7574049b9b06297df2fc280`.
  Amvera `master` подтверждён этим SHA; Docker build завершился с exit 0.
  После сборки выполнен restart; итог RUNNING, 1/1, текущий тариф сохранён.
- [Pages workflow 38808092605](https://github.com/getcher123/aihub-site/actions/runs/38808092605)
  завершился success. [Опубликованный магазин](https://getcher123.github.io/aihub-site/shop.html?lang=ru).
  Основной репозиторий HaiCora2024 остался на `4a860ff`, `aihub.works` не публиковался.
- `/health`, `/health/ready`, `/api/shop/catalog`: 200. Версии каталога и документов
  совпадают с frontend; получены восемь позиций, USD, request-only и VAT pending_review.
  CORS четырёх настроенных origins: 204, чужого origin: 403; status без ключа: 401.
- Live browser: 210/210 проверок блока реквизитов, 0 JS ошибок/локальных 404.
  Отдельный checkout с локальной тестовой корзиной загрузил живой каталог 200,
  показал форму, доступную кнопку отправки и непредвыбранные условия. POST не отправлялся.
  Артефакты на машине оператора: `/tmp/aihub-company-live/report.json`,
  `/tmp/aihub-checkout-live-ru.png`.
- `/data` настроен как persistent mount; API файлов видит каталог `shop`.
  Readiness 200 подтверждает успешное начальное обслуживание БД и создание
  зашифрованного snapshot по текущему коду. Это не заменяет отдельный runtime restore-test.
  Ключ помещён в секрет Amvera и отдельно сохранён в закрытом хранилище оператора вне Git.
- Реальные заявки, письма и записи в Sheets для smoke не создавались. Независимая
  копия production snapshot/journal не получена; восстановление production-данных
  и переносимость заявок после restart не проверялись на реальной записи.
  `SHOP_TRUST_PROXY_HOPS` оставлен 0, пока не подтверждена цепочка ingress:
  при общем proxy IP лимит может быть общим для нескольких посетителей.
- Согласование договоров провайдеров/DPA, внешнее резервирование, мониторинг,
  почтовый retention и подтверждение доставки остаются организационными условиями
  основного запуска, не объявляются выполненными этим техническим smoke.

Локальный контейнер с лимитом 130 MiB / 0.1 CPU прошёл readiness без OOM;
измеренное потребление около 73 MiB не является нагрузочным тестом.
Не использовать `git diff --check` по исходным OFL-лицензиям как основание изменять
их текст: две исходные строки имеют trailing space; лицензии сохранены без изменений.

## Обязательные условия выпуска

- [x] Владелец разрешил обновление backend и Pages тестовой копии, затем основного
  домена; текущий тариф и один экземпляр сохраняются.
- [ ] Отдельно разрешены и проверены контрольные письма реальным адресатам.
- [ ] Согласованы EN/RU Privacy Policy и Terms, реквизиты и фактические процессы.
- [ ] Проверены юридические лица провайдеров, DPA/договоры, регионы и конкретные
  основания международных передач для GitHub, Amvera, Google SMTP/sales и хостинга
  `techcrew@aihub.works`. DNS MX сам по себе не подтверждает договор или safeguards.
- [ ] Определены сроки логов провайдеров и общих обращений, ответственный за права
  субъектов, почтовые удаления и регулярное закрытие неактивных заявок.
- [ ] Проверены полномочия SMTP-отправителя, DKIM/SPF/DMARC, фактические получатели,
  отсутствие автоматической пересылки заявок в непредусмотренные системы.
- [ ] `/data` действительно persistent и доступен для записи; SQLite работает при
  рестарте/пересборке. Один экземпляр, без двух одновременно работающих версий.
- [ ] `SHOP_BACKUP_KEY` хранится в секретах; ключ восстановления доступен отдельно.
  Проверено восстановление с актуальным lifecycle-журналом и его независимая сохранность.
- [ ] Readiness 200, локальный SMTP smoke, CORS обоих сайтов, схема v1 и свободное место.
- [ ] Подтверждены согласованные версии каталога и документов в API/frontend.

Это не юридическое заключение о соответствии всем нормам ЕС. Публичные тексты
подготовлены под описанный процесс, но не подтверждают неизвестные договоры
провайдеров. NIP публикуется как NIP; VAT/VAT-UE статус продавца не подтверждён.
Банковские реквизиты не публикуются: checkout не является оплатой или счётом.

## Конфигурация

Существующие `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`,
`CONTACT_FROM`, `CONTACT_TO`, `GOOGLE_*` сохраняются. Новые заявки не используют Sheets.

| Переменная | Значение/назначение |
| --- | --- |
| `SHOP_ENABLED` | `true` только для включения; без него shop 503, contact работает как раньше |
| `SHOP_DB_PATH` | `/data/shop/shop.sqlite` |
| `SHOP_SALES_TO` | `sales@aihubworks.com`; на тестовом стенде только тестовый ящик |
| `SHOP_SITE_URL` | `https://aihub.works/`, абсолютный доверенный адрес для ссылок в письмах |
| `SHOP_BACKUP_KEY` | Секрет: 32 случайных байта в base64, обязателен для production entrypoint |
| `SHOP_BACKUP_DIR` | По умолчанию `/data/shop/backups` |
| `SHOP_TRUST_PROXY_HOPS` | По умолчанию 0; настроить только после проверки цепочки Amvera ingress |
| `ALLOWED_ORIGINS` | Точные origins через запятую; не `*`, без путей и trailing slash |
| `VITE_SHOP_API_URL` | Публичный origin API, не секрет; GitHub Repository Variable в обоих репозиториях |

Разрешённые ранее origins: `https://aihub.works`, `https://www.aihub.works`,
`https://getcher123.github.io`, `https://haicora2024.github.io`. Подпуть Pages не входит
в origin. Локально добавить только нужные `http://127.0.0.1:PORT`.
Для SQLite требуется Node >=22.16, Docker использует `node:22-alpine`.
В первом выпуске `SHOP_SITE_URL` был адресом тестовой копии; основной выпуск
16.10.2026 сменил его на `https://aihub.works/` с перезапуском контейнера.
SMTP-получатели старого `POST /api/contact` не менялись.

Генерация ключа выполняется оператором в закрытом контексте, без записи в Git/логи
или передачи значения в аргументах команд. Не подставлять SMTP или backup secrets в VITE.

## Локальный тест без реальной отправки

```bash
npm ci
npm --prefix backend/contact-api ci
npm --prefix backend/contact-api test
npx tsc --noEmit -p tsconfig.shop.json
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs \
CHROME_PATH=/absolute/path/to/chrome \
node scripts/checkout-smoke.mjs
QA_BASE=/nested/ QA_OUTPUT=/tmp/aihub-checkout-nested \
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs \
CHROME_PATH=/absolute/path/to/chrome \
node scripts/checkout-smoke.mjs
```

Тест сам создаёт временные БД и локальный SMTP sink, принимает оба письма по SMTP,
но никому их не доставляет. Чужие SMTP env не используются этим тестом.
Скриншоты и отчёт по умолчанию в `/tmp/aihub-checkout-qa`.
Обычный `npm run build` без API URL оставляет реальную отправку выключенной.
`QA_PRODUCTION=true` проверяет временную production-сборку вместо Vite dev.
`AXE_MODULE=/absolute/path/to/@axe-core/playwright/dist/index.mjs` включает
автоматические WCAG A/AA-проверки; они не заменяют ручную проверку доступности.

## Хранение и служебные операции

Все команды выполняются из `backend/contact-api` с доступом к нужной БД и секретам.
Ни одна команда не является HTTP admin endpoint. Не публиковать `/data` веб-сервером.

```bash
npm run shop:admin -- stats
npm run shop:admin -- list
npm run shop:admin -- close REQ-UUID
npm run shop:admin -- converted REQ-UUID
npm run shop:admin -- purge
npm run shop:admin -- export REQ-UUID /private/request-export.json
npm run shop:admin -- erase REQ-UUID
npm run shop:admin -- retry-mail REQ-UUID
npm run shop:admin -- backup
```

`list` показывает максимум 100 номеров/статусов/дат, без контактов.
`export` создаёт новый файл 0600, не печатает PII в stdout и не перезаписывает файл.
Проверять личность заявителя пропорционально, передавать экспорт защищённо,
удалять рабочую выгрузку после выполнения запроса. Бэкапы/выгрузки не коммитить.

Раз в неделю пересматривать open-заявки; если работа прекращена, `close` фиксирует
дату начала 90 дней. Не вызывать close повторно ради продления срока. `converted`
исключает заявку из правила несостоявшихся обращений, но не означает бессрочное хранение:
перенести нужные документы в договорный учёт с его регламентом, затем удалить лишние
рабочие данные. Почтовые копии удаляет ответственный сотрудник по той же дате закрытия,
включая sent, inbox, trash и известные пересылки; сайт этого не делает автоматически.

Очистка БД выполняется при запуске и каждый час: closed без договора старше 90 дней.
Удаление удаляет outbox по FK, а хеш ключа остаётся до 90 дней для защиты от повтора.
Для гарантированного прекращения ещё не отправленного письма остановить worker/API
и дождаться in-flight SMTP до `erase`; уже доставленное письмо не отзывается.
`retry-mail` после разбора ошибки может доставить дубликат при неизвестном SMTP ACK.

Lifecycle-файл `shop.sqlite.lifecycle.jsonl` содержит только хеши ключей, действия
closed/converted/erased и время. Он fsync-ится до изменения БД; после сбоя действия
переигрываются. При живом API файл append-only. Раз в месяц остановить API и все
другие admin-команды, затем выполнить:

```bash
SHOP_SERVICE_STOPPED=true npm run shop:admin -- compact-ledger
```

Команда сохраняет последние события для существующих заявок и события последних
90 дней, удаляя старые ненужные хеши. Флаг является подтверждением оператора,
не автоматическим механизмом остановки сервиса. Не компактировать одновременно с записью.

## Backup и восстановление

При запуске и далее каждые 24 часа создаётся согласованный `VACUUM INTO` snapshot,
шифруется AES-256-GCM с authenticated metadata и сохраняется как `shop-TIMESTAMP.enc`.
Каталог 0700, файлы 0600; plaintext временный файл удаляется в finally. Старые
зашифрованные копии старше 7 дней и оставшиеся после аварии старые tmp очищаются
во время hourly maintenance. Ошибка maintenance закрывает readiness и новые заявки
до успешного повторного обслуживания, старый contact endpoint продолжает работать.

Копии по умолчанию находятся **на том же persistent volume**: защищают от логической
ошибки, но не от полной потери тома. Независимое защищённое копирование backup и
актуального журнала организует оператор до выпуска; новый платный сервис автоматически
не создавался. У всех внешних копий также срок 7 дней, согласованные DPA/доступ и ключ.
Нельзя восстановить удалённые данные из старой копии без актуального lifecycle-файла.

Порядок restore: остановить сервис, сохранить текущие файлы приватно для разбора,
взять backup не старше 7 дней и **самый свежий** журнал (не его устаревшую копию
из того же backup), указать секрет через окружение, создать новый target:

```bash
SHOP_LIFECYCLE_LEDGER=/private/latest/shop.sqlite.lifecycle.jsonl \
npm run shop:admin -- restore /private/shop-TIMESTAMP.enc /data/recovery/shop.sqlite
```

Restore не перезаписывает БД, проверяет шифрование/возраст/integrity, применяет удаления,
статусы и retention. Несохранённые как sent задачи переводятся в failed с
`RESTORE_REVIEW_REQUIRED`, без слепой повторной рассылки. Проверить stats/выгрузку
контрольных фиктивных данных, переключить `SHOP_DB_PATH` остановленного сервиса,
разобрать очередь, запустить один экземпляр. Если journal потерян или его актуальность
не подтверждается, restore в production запрещён до восстановления списка удалений.

## Наблюдение, выпуск и откат

Проверять `/health/ready` внешним монитором, возраст последнего backup, свободное место,
`stats` очереди и события `shop_mail_failed`, `shop_worker_failed`, `shop_maintenance_failed`.
SMTP readiness не обещается: при SMTP-сбое заявки сохраняются и остаются в outbox.
Реальный тест должен подтвердить доставку обоих писем и правильный Reply-To.

После прохождения gates: восстановить/собрать `aihub-form` на текущем тарифе с одним
экземпляром, проверить persist/restart/health/CORS. Затем задать repository variable
`VITE_SHOP_API_URL=https://aihub-form-getcher.waw0.amvera.tech` для разрешённых сайтов,
собрать frontend и публиковать согласованный SHA в main и fork. Push сайта не деплоит
backend. Не отправлять реальные заявки для smoke без отдельного согласования.

Откат: убрать frontend API variable или отключить `SHOP_ENABLED`, не возвращать
ложный demo-success. Сохранить базу/журнал, не откатывать данные вместе с кодом.
Схема `PRAGMA user_version=1`; более новая неизвестная схема отклоняется. Для будущей
миграции нужны backup, тест миграции/restore и совместимый rollback, а не ручное DDL
в живом приложении. При восстановлении версии кода не менять историю версий заявок.

## Источники

Правовые ориентиры: [основания EDPB](https://www.edpb.europa.eu/sme/be-compliant/process-personal-data-lawfully_en),
[права субъектов EDPB](https://www.edpb.europa.eu/sme/be-compliant/respect-individuals-rights_en),
[дистанционные договоры ЕС](https://europa.eu/youreurope/business/selling-in-eu/selling-goods-services/ecommerce-distance-selling/index_en.htm).
Хранилище: [Amvera Docker persistenceMount](https://docs.amvera.ru/applications/configuration/docker.html),
[SQLite в Amvera](https://docs.amvera.ru/databases/sqlite.html).
Реквизиты сверены с [KRS](https://api-krs.ms.gov.pl/api/krs/OdpisAktualny/0001200571?rejestr=P&format=json).
Это источники подготовки, не подтверждение production-аудита или юридического заключения.
