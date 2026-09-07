# Bizmax Inc.

Corporate website for **Bizmax Inc.**, the parent company of [Discover Hidden Profits](https://discoverhiddenprofits.com).

## Stack

- [Astro 7](https://astro.build) with server output
- [Cloudflare Workers / Pages](https://developers.cloudflare.com/pages/) via [`@astrojs/cloudflare`](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Tailwind CSS 4](https://tailwindcss.com) with the Vite plugin
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) for local dev and deploys

## Develop

```bash
npm install
npm run dev          # localhost:4321
npm run build        # production build to dist/
npm run preview      # preview production build locally
```

## Deploy

```bash
npm run deploy       # astro build + wrangler deploy
```

## Env / secrets

See `.dev.vars.example`. Production secrets are managed via Cloudflare / Infisical — never commit them.
