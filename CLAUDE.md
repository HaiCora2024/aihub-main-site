# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:4173
npm run build     # Production build
npm run preview   # Preview production build locally
```

No lint or test scripts are configured.

## Architecture

This is a **static marketing landing page** — a single HTML page composed of 12 independent section blocks. There is no routing library, no state management, and no API calls.

### Block system

Each section lives in its own top-level numbered directory (e.g., `01_hero_custom_ai_assistant/`, `02_instant_business_results/`). The editable component is always at `NN_name/src/screens/Home/Home.tsx`.

All blocks are assembled and ordered in `src/App.tsx`, which also controls section `id` anchors, inter-section spacing, and scroll margins. Navigation is anchor-based (`#hero`, `#results`, etc.).

### Key shared files

- `src/styles.css` — Global animations, `.glow-button` effect (with color variants via `--glow-rgb`), hero nav hover, smooth scroll
- `src/components/DesktopScaleFrame.tsx` — CSS `transform: scale()` wrapper for 1200px+ viewports
- `src/hooks/useRevealOnView.ts` — IntersectionObserver hook for stagger scroll-reveal animations

### Styling conventions (from `_AI_RULES.md`)

- **No arbitrary Tailwind values** — use only classes defined in `tailwind.config.cjs`, which maps ~120+ CSS custom properties (e.g., `--green`, `--black-10`) to Tailwind color tokens
- Block root elements must not have external margins; spacing is controlled by the parent in `App.tsx`
- Use `clsx` for conditional classes — no string concatenation
- TypeScript strict mode is on; `any` is forbidden
- Named exports only — no `export default`
- Each component's props interface must be exported and declared before the component function
- Style variants use union types: `variant: 'primary' | 'secondary'` not `variant: string`

### Build & deploy

Vite reads `VITE_BASE` env var for the base URL (defaults to `/{repoName}/`). GitHub Actions deploys to GitHub Pages on push to `main`.
