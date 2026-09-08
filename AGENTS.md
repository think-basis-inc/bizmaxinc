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

- Run `npm test` (Vitest) and `npm run build` for product changes. Exercise the changed real browser flow after tests; a build or screenshot alone is not behavioral verification.
- Use shared `ship-pipeline` and `model-currency`: direct work for bounded marketing-site tasks, explicit appropriate model/effort, and risk-based independent review. A named bug needs a failing regression test before the fix.
- Keep pages/components small; split files that approach 500 LOC.
- Secret values come from Infisical wrappers into the subprocess that needs them; never write them into `.dev.vars`, `.env` files, logs or chat. Committed example files may document variable names, not values.
- This is a corporate marketing site; keep copy direct and factual. If writing significant new marketing copy, ask for the brand voice guide or mirror the Think Basis writing rules.

## Related

- [`hidden-profit`](../hidden-profit) — Discover Hidden Profits funnel (subsidiary/project).
