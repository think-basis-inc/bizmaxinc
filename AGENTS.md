# AGENTS.md — Bizmax Inc.

Instructions for AI agents working on this codebase.

## Project

Corporate website for **Bizmax Inc.** — parent company of [Discover Hidden Profits](https://discoverhiddenprofits.com) (`hidden-profit` repo).

## Stack

- Astro 7 with server output (`output: 'server'`); static pages opt in with `export const prerender = true`
- Cloudflare Workers/Pages via `@astrojs/cloudflare`
- Tailwind CSS 4 via `@tailwindcss/vite`
- Wrangler CLI for deploys

## Conventions

- Verify changes with `npm run build` (must exit cleanly).
- Keep pages/components small; split files that approach 500 LOC.
- No secrets in git. Local secrets go in `.dev.vars` (gitignored). Production secrets via Cloudflare dashboard or Infisical.
- This is a corporate marketing site; keep copy direct and factual. If writing significant new marketing copy, ask for the brand voice guide or mirror the Think Basis writing rules.

## Related

- [`hidden-profit`](../hidden-profit) — Discover Hidden Profits funnel (subsidiary/project).
