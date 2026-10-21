# Website chat integration

The AIHUB Pages build injects the first-party adapter in `src/chat/embed.ts` into
all public HTML entries except the design-system preview. The adapter shows a
floating, click-to-load chat button, creates a 128-bit random visitor ID in tab-scoped
`sessionStorage`, and opens `https://aihubworks.com/chats/chat/` with that ID.
On click, a correctly sized loading panel appears immediately without waiting
for network requests. Its Close button and Escape cancel loading and restore
focus. A ready message from the exact iframe and CRM origin replaces that panel
with the chat; otherwise the button offers retry after 10 seconds. Closing it
restores the button without changing the
tab's visitor ID. No CRM credentials or API keys belong in the site bundle.

The independent `launcher_skin` setting is read on page load from the public
`/api/knowledge/widget_launcher` selector with credentials omitted and a five-
second timeout. Only `classic` and `aihub` are accepted. Style and image assets
come from the fixed `/widget-launcher/v1/` directory on the CRM origin, which
is explicitly allowed for CSS/images by the homepage CSP. A failed selector or
asset request preserves the bundled neutral Classic SVG button, so the chat
remains usable. This same compact button appears during initial loading; the
superseded `chat-egg.svg` is not loaded or briefly displayed before the new skin.

AIHUB is a transparent four-frame PNG animated entirely by shared CSS: four eye
changes one second apart followed by three up/down waves at half-second steps,
repeating every seven seconds. An independent 3.6-second ease-in-out animation
gently sways the character by +/-3 degrees. Reduced motion disables both loops
and uses a static smiling frame.
The chat server precompresses public assets with gzip/Brotli to reduce cold-load
transfer size. A visible loading panel does not imply the chat is already ready.
Changing the launcher in CRM requires Save Draft, Apply Settings and a website
refresh; it does not change the chat window skin or visitor identity.

`scripts/chat-launcher-smoke.py` verifies the selector/asset fallback, keyboard
open/close, preserved visitor id, mobile layout, reduced motion and all timed
sprite states, smooth sway, shared pause behavior and delayed loading without
an old-character flash. It uses a local site preview on 4188 and CRM on 18089, intercepts
conversation traffic and never sends a real message. `LIVE=1` checks the actual
published assets while still stubbing every conversation endpoint/WebSocket.

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
