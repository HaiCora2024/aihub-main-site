# Website chat integration

The AIHUB Pages build injects the first-party adapter in `src/chat/embed.ts` into
all public HTML entries except the design-system preview. The adapter shows a
floating egg-shaped, click-to-load chat button, creates a 128-bit random visitor ID in tab-scoped
`sessionStorage`, and opens `https://aihubworks.com/chats/chat/` with that ID.
Only a ready message from the exact iframe and CRM origin reveals the panel;
otherwise the button offers retry after 10 seconds. Closing the chat removes
the iframe and restores the button without changing the tab's visitor ID. No
CRM credentials or API keys belong in the site bundle.

This deployment depends on coordinated changes to Universal CRM Core and CEP:

1. Core gateway must expose only `/chats/chat` and `/chats/chat/` from the
   client Nuxt app, in addition to its existing Mini App and static assets.
2. CEP must allow `https://getcher123.github.io` and `https://aihub.works` as frame ancestors for only
   that page, identify website chats by the validated visitor ID in HTTP and
   WebSocket, and ignore CRM JWTs for this public channel.
3. Release Core/CEP before pushing the site. Confirm HTTP 200 and the exact
   `frame-ancestors` response header on `/chats/chat/`.
4. Push the site only after the CRM release is healthy. A live click creates a
   real chat session and may trigger downstream automation, so do not perform
   live message or LLM smoke tests without separate approval.

Local no-message checks: site Vite build, the browser adapter smoke with a
mocked iframe, CEP backend unit tests, and a built Nuxt iframe smoke with
backend API requests mocked. These checks do not prove the production release.
