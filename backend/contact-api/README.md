# AIHUB Contact API

Minimal HTTP backend for the landing contact form. It accepts contact leads and sends them to `aihubworks@gmail.com` via SMTP.

## Endpoints

- `GET /health` - health check.
- `POST /api/contact` - accepts JSON body:

```json
{
  "name": "Lead name",
  "phone": "+1 555 000 0000",
  "source": "aihub-site",
  "page": "https://getcher123.github.io/aihub-site/"
}
```

## Required environment variables

- `SMTP_HOST` - SMTP host, for Gmail use `smtp.gmail.com`.
- `SMTP_PORT` - SMTP port, for Gmail SSL use `465`.
- `SMTP_SECURE` - `true` for port `465`, `false` for `587`.
- `SMTP_USER` - SMTP login.
- `SMTP_PASS` - SMTP password or app password.

## Optional environment variables

- `CONTACT_TO` - destination email, defaults to `aihubworks@gmail.com`.
- `CONTACT_FROM` - sender, defaults to `SMTP_USER`.
- `ALLOWED_ORIGINS` - comma-separated CORS allowlist. Example: `https://getcher123.github.io,https://getcher123.github.io/aihub-site`.
- `RATE_LIMIT_WINDOW_MS` - default `900000`.
- `RATE_LIMIT_MAX` - default `5`.
- `PORT` - default `8080`.

## Local run

```bash
npm install
SMTP_HOST=smtp.gmail.com \
SMTP_PORT=465 \
SMTP_SECURE=true \
SMTP_USER=your-smtp-user \
SMTP_PASS=your-app-password \
npm start
```

Health check:

```bash
curl -fsS http://127.0.0.1:8080/health
```
