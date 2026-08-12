# MA Infotech

Marketing website for **MA Infotech** — a computer sales and service shop in Borivali (West), Mumbai. It covers custom PC building, laptop & desktop repair, networking, CCTV, and IT product sales.

🔗 **Live:** https://www.mainfotech.com

## Tech stack

- [Astro](https://astro.build/) — static-first site framework
- [Tailwind CSS v4](https://tailwindcss.com/) — styling
- [Preline UI](https://preline.co/) — UI components
- Deployed on [Vercel](https://vercel.com/)

## Getting started

Requires Node `24` (see `.nvmrc`) and [pnpm](https://pnpm.io/).

```bash
pnpm install      # install dependencies
pnpm dev          # start dev server at http://localhost:4321
pnpm build        # type-check + production build
pnpm preview      # preview the production build
```

Other scripts:

```bash
pnpm format:check # verify Prettier formatting (used in CI)
pnpm format:fix   # auto-format all files
pnpm test:smoke   # run smoke tests
```

## Project structure

```
src/
├─ pages/            # routes: index, services, products, contact (+ robots.txt, llms.txt)
├─ components/       # navbar, footer, cards, forms, icons
├─ layouts/          # MainLayout (SEO, nav, footer)
├─ data_files/       # constants.ts — business info, contact, hours, reviews
└─ assets/styles/    # global.css — design tokens & fluid type scale
```

**Editing content:** most business details (phone, email, address, hours, Google rating, testimonials) live in `src/data_files/constants.ts`.

## SEO

- `sitemap-index.xml` — generated at build via `@astrojs/sitemap`
- `robots.txt` and `llms.txt` — served from routes in `src/pages/`
