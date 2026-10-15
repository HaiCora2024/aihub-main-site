# Аудит агентских путей AIHUB

Дата: 15.10.2026. Проверены два разных слоя: инструкции coding-агенту в репозитории
и публичные discovery-файлы сайта. Наличие второго не означает работающий MCP/A2A API.
Отчёт фиксирует результаты на указанную дату. Публикация этих файлов не означает
повторной проверки или восстановления внешних API.

## Инструкции и исходники

| Обнаружено | Исправление |
| --- | --- |
| Нет корневого AGENTS.md | Добавлена [единая точка входа](../AGENTS.md) с картой реальных файлов |
| CLAUDE.md описывал одну страницу без API и тестов | Перенаправлен на актуальные инструкции и профильные гайды |
| _AI_RULES.md требовал отсутствующие ui/blocks/layouts/PageBuilder и clsx | Заменён картой фактической архитектуры без фиктивных зависимостей |
| README направлял правки меню/typing в старые файлы | Указаны общие SiteHeader и TypewriterText |
| Нет маршрута создания новой страницы | Добавлен [пошаговый гайд](agent-page-guide.md) |
| Не определена граница демо/реальных заказов | Добавлен [backend-гайд](shop-backend-guide.md) |
| `llms.txt` содержал отсутствующий `#analytics` | Локально заменён существующим `#services` |
| Магазин и UI-kit отсутствовали в discovery | Локально добавлены в llms.txt и sitemap |

Вложенные `workspace/PATTERNS.md` относятся к отдельным legacy-блокам, местами
содержат прежний порог 1280 px. Они не массово переписаны: область действия
явно ограничена в AGENTS.md. Шаблонные пути будущих страниц/API в гайдах помечены
как **планируемые**, не выданы за существующие файлы.

## Карта публичных путей

| Исходник | URL на основном домене |
| --- | --- |
| [public/llms.txt](../public/llms.txt) | `https://aihub.works/llms.txt` |
| [public/robots.txt](../public/robots.txt) | `https://aihub.works/robots.txt` |
| [public/sitemap.xml](../public/sitemap.xml) | `https://aihub.works/sitemap.xml` |
| [agent.json](../public/.well-known/agent.json) | `https://aihub.works/.well-known/agent.json` |
| [agents.json](../public/.well-known/agents.json) | `https://aihub.works/.well-known/agents.json` |
| [webmcp.json](../public/.well-known/webmcp.json) | `https://aihub.works/.well-known/webmcp.json` |

На зеркале к тем же путям добавляется base:
`https://getcher123.github.io/aihub-site/`. Например,
`https://getcher123.github.io/aihub-site/.well-known/agents.json`.
`public/` в опубликованном URL отсутствует. Canonical-ссылки внутри статических
метаданных намеренно остаются на `aihub.works`, а не переписываются на зеркало.

AGENTS.md, CLAUDE.md и `docs/` доступны в репозитории, но не копируются в Pages
автоматически. Их нельзя рекламировать как работающие `/AGENTS.md` или `/docs/...`.
Отдельная страница должна входить в `build.rollupOptions.input`; наличие TSX не создаёт URL.

## Фактическая live-проверка

Проверены текущие опубликованные файлы, до локальных изменений этого этапа.

| Проверка | Результат |
| --- | --- |
| GET шести discovery-файлов на aihub.works | 6/6 HTTP 200; ожидаемые text/XML/JSON, JSON разбирается |
| GET тех же файлов на GitHub Pages с `/aihub-site/` | 6/6 HTTP 200; ожидаемые форматы, не HTML fallback |
| HEAD `https://aihubworks.com/chats/telegram-chat` | HTTP 200, `text/html`, web-интерфейс чата |
| GET `https://aihub-form-getcher.waw0.amvera.tech/health` | HTTP 503, HTML от платформы, 17:20 UTC |
| OPTIONS `/api/contact`, origin `https://aihub.works` | HTTP 503, 17:20 UTC; CORS backend подтвердить нельзя |

Письма, заявки, записи Sheets и платежи не создавались. `GET /api/contact` не является
правильной проверкой его работы: в исходнике это POST-only endpoint. Даже здоровый
`/health` не доказывает доставку письма/запись в Sheets или наличие сервера магазина.

### Незакрытые вопросы

- **Contact API недоступен.** Нужна отдельная диагностика runtime Amvera и повторная
  проверка health/CORS. Адрес не изменён, сервис не перезапускался в рамках документации.
- **A2A не подтверждён.** `agents.json` объявляет `protocol: a2a`, но ссылка ведёт
  на web-чат. HTTP 200 HTML не подтверждает совместимость. Проверка стандартного
  AgentCard и реального binding требует отдельной интеграционной задачи:
  [спецификация A2A](https://a2a-protocol.org/latest/specification/).
- **WebMCP не подтверждён.** `webmcp.json` с `spec: webmcp/0.1` является существующей
  legacy-метадатой, не доказательством регистрации инструментов в браузере. Атрибуты
  `tool-name` у формы также не заменяют проверку по
  [актуальному WebMCP draft](https://webmachinelearning.github.io/webmcp/).

URL и форматы legacy JSON сохранены, чтобы не менять неизвестных потребителей
под видом правки документации. Не объявлять здесь новые shop tools до существования
backend, политики доступа, подтверждения write-действий и контрактных тестов.

## Воспроизводимая локальная проверка

```bash
node scripts/check-agent-paths.mjs
npm run build
node scripts/check-agent-paths.mjs --dist dist
```

[Скрипт](../scripts/check-agent-paths.mjs) не требует пакетов и ничего не отправляет.
Он проверяет входные инструкции, относительные Markdown-ссылки в активных гайдах,
все HTML-входы Vite и их module paths, JSON, canonical URL и якоря главной,
согласованность адреса Contact API в workflow/metadata. С `--dist` также проверяет
HTML и точное копирование шести публичных metadata-файлов, включая `.well-known`.

Нулевой exit code означает исправность этих **локальных путей**, а не живого API.
WARN про протоколы остаются видимыми; HTTP автоматически не выполняется.
Не проверяются arbitrary пути в code fences, будущие файлы, произвольные Markdown
heading anchors, все исторические workspace-заметки и схемы сторонних протоколов.
Если меняется структура Vite-конфига или способ задания API URL, обновить и checker.

### Результаты проверок этого изменения

- `node scripts/check-agent-paths.mjs`: 238/238, 13 документов и 19 HTML-входов.
- `npm run build`: успешно; `--dist dist`: 269/269, `.well-known` попал в сборку.
- Оба TSX-примера page-гайда проверены TypeScript с реальными импортами проекта
  через виртуальные файлы; пример workshop не добавлялся в приложение.
- Три JSON-примера в гайдах успешно разобраны. Это проверка синтаксиса, не тест
  ещё не реализованного backend-контракта.
- Повторный read-only запрос `/health` снова вернул 503. Runtime не изменялся.
- UI и серверный код не менялись; полный браузерный регрессионный набор не повторялся.

Read-only проверка Contact API при следующей диагностике:

```bash
curl --fail-with-body --max-time 15 https://aihub-form-getcher.waw0.amvera.tech/health
curl --request OPTIONS --max-time 15 -D - -o /dev/null \
  -H 'Origin: https://aihub.works' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: Content-Type' \
  https://aihub-form-getcher.waw0.amvera.tech/api/contact
```

OPTIONS не подтверждает саму отправку. Не заменять эти команды тестовым POST с
контактными данными без явного разрешения и безопасного тестового окружения.
