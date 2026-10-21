# Website chat integration

The AIHUB Pages build injects the first-party adapter in `src/chat/embed.ts` into
all public HTML entries except the design-system preview. The adapter shows a
floating egg-shaped, click-to-load chat button, creates a 128-bit random visitor ID in tab-scoped
`sessionStorage`, and opens `https://aihubworks.com/chats/chat/` with that ID.
On `aihub.works` and `getcher123.github.io`, a ready message from the exact
iframe and CRM origin reveals the embedded panel; otherwise the button offers
retry after 10 seconds. Closing it restores the button without changing the
tab's visitor ID. No CRM credentials or API keys belong in the site bundle.

The iframe uses the legacy 420x700 desktop dimensions with a 20px inset and
the design-system card radius (30px). The host iframe clips its contents so
opaque chat skins cannot paint square corners outside that radius. Fullscreen
mobile mode deliberately has no corner radius. Its validated `avatar_path`
points to the retained legacy portrait when the active bot has no configured
avatar. Both Aura theme
directories, including their fonts, must be exposed by the CRM gateway.

This deployment depends on coordinated changes to Universal CRM Core and CEP:

1. Core gateway must expose only `/chats/chat` and `/chats/chat/` from the
   client Nuxt app, in addition to its existing Mini App and static assets.
2. CEP identifies website chats by the validated visitor ID in HTTP and
   WebSocket and ignores CRM JWTs for this public channel. Only the website
   chat page allows `https://getcher123.github.io` and `https://aihub.works`
   as frame ancestors. The Mini App and other routes retain their own policy.
3. Confirm HTTP 200 on `/chats/chat/` and verify its `frame-ancestors`
   response header before changing the adapter's mode.
4. A live click creates a real chat session and may trigger downstream
   automation, so do not perform
   live message or LLM smoke tests without separate approval.

Local no-message checks: site Vite build, the browser adapter smoke with a
mocked iframe, CEP backend unit tests, and a built Nuxt iframe smoke with
backend API requests mocked. These checks do not prove the production release.
