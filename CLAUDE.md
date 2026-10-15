# Claude Code: AIHUB

Сначала прочитать [AGENTS.md](AGENTS.md): это единая актуальная карта проекта
и правил. Не поддерживать отдельную противоречащую ей инструкцию здесь.

- Создание страниц: [docs/agent-page-guide.md](docs/agent-page-guide.md).
- UI-kit: [docs/design-system.md](docs/design-system.md).
- Backend магазина: [docs/shop-backend-guide.md](docs/shop-backend-guide.md).
- Проверка ссылок и discovery: [docs/agent-paths-audit.md](docs/agent-paths-audit.md).

Проект не ограничен одним лендингом: есть HTML-входы кейсов, legal-страниц,
магазина и дизайн-системы. Contact API реален; оформление в магазине локальное.
Не устанавливать `clsx`, router или PageBuilder только ради старых инструкций.

```bash
npm run dev -- --strictPort
node scripts/check-agent-paths.mjs
npx tsc --noEmit -p tsconfig.shop.json
npm run build
npm run preview -- --port 4173 --strictPort
```

Dev и preview используют 4173; запускать один из них либо выбирать другой порт.
Отдельные браузерные тесты лежат в `scripts/`, хотя `npm test` не настроен.
Все пути относительно корня репозитория, без привязки к диску или машине автора.
