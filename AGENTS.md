# Commands

```bash
pnpm run dev          # local dev server
pnpm run build        # production build (CI runs this)
pnpm run lint         # eslint
pnpm run format       # prettier --write
pnpm run format:check # prettier --check (CI runs this)
```

# Stack

- Next.js 16 (App Router, RSC) + React 19, TypeScript, Tailwind CSS v4, pnpm, heavily customized shadcn/ui components
- MDX blog posts in `content/blog/*.mdx`, parsed with `next-mdx-remote` + `gray-matter`
- Deployed on Vercel

# Architecture

- `app/` — Next.js App Router pages. API routes under `app/api/` (Spotify, Raindrop bookmarks).
- `components/nier-*.tsx` — Custom NieR:Automata-themed UI shell wrapping every page. `NierShell` is the main layout with sidebar nav and keyboard navigation (W/S/arrows).
- `components/ui/` — shadcn/ui primitives. DO NOT hand-edit; regenerate with the shadcn CLI.
- `components/custom/` — Page-specific client components (gallery, map, now-playing, contact form, etc.).
- `lib/` — Third party API integrations
- `app/globals.css` — The active theme. Single dark theme (no light/dark toggle), hardcoded hex values for NieR aesthetic.
- `content/blog/` — MDX blog posts with frontmatter (`title`, `date`, `summary`).

# IMPORTANT

- `public/images/cat/` photos MUST be stripped of metadata BEFORE committing with the `public/images/cat/check-image-metadata.sh` script
- Updating the React version requires changing the version in both `package.json` and `eslint.config.mjs`
