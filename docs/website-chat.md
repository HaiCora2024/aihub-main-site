# Website chat integration

The AIHUB Pages build injects the first-party adapter in `src/chat/embed.ts` into
all public HTML entries except the design-system preview. The adapter shows a
floating egg-shaped, click-to-load chat button, creates a 128-bit random visitor ID in tab-scoped
`sessionStorage`, and opens `https://aihubworks.com/chats/chat/` with that ID.
On `aihub.works`, the button opens the chat in a new tab because the currently
active CRM release does not allow that domain in its `frame-ancestors` header.
On the `getcher123.github.io` site, only a ready message from the exact iframe
and CRM origin reveals the embedded panel; otherwise the button offers retry
after 10 seconds. Closing it restores the button without changing the tab's
visitor ID. No CRM credentials or API keys belong in the site bundle.

This deployment depends on coordinated changes to Universal CRM Core and CEP:

1. Core gateway must expose only `/chats/chat` and `/chats/chat/` from the
   client Nuxt app, in addition to its existing Mini App and static assets.
2. CEP identifies website chats by the validated visitor ID in HTTP and
   WebSocket and ignores CRM JWTs for this public channel. The active release
   allows only `https://getcher123.github.io` as a frame ancestor. Adding
   `https://aihub.works` requires a separate production release before the
   fork can switch from new-tab mode to an embedded panel.
3. Confirm HTTP 200 on `/chats/chat/` and verify its `frame-ancestors`
   response header before changing the adapter's mode.
4. A live click creates a
   real chat session and may trigger downstream automation, so do not perform
   live message or LLM smoke tests without separate approval.

Local no-message checks: site Vite build, the browser adapter smoke with a
mocked iframe, CEP backend unit tests, and a built Nuxt iframe smoke with
backend API requests mocked. These checks do not prove the production release.
