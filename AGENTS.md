# Stack

- Heavily customized shadcn/ui components
- Deployed on Vercel

# Architecture

- `components/ui/` — shadcn/ui primitives. DO NOT hand-edit; regenerate with the shadcn CLI.
- `app/globals.css` — The active theme. Single dark theme (no light/dark toggle), hardcoded hex values for NieR aesthetic.
- `scripts/` — One-off maintenance scripts run by hand, not part of the build.

# IMPORTANT

- `public/images/cat/` photos MUST be stripped of metadata BEFORE committing with the `public/images/cat/check-image-metadata.sh` script
- Updating the React version requires changing the version in both `package.json` and `eslint.config.mjs`
- `data/flights.json` is generated, never hand-edit it. Drop a fresh my.flightradar24.com flight diary export in and re-run `pnpm run flights:import <export.csv>`; the export itself is gitignored and stays local. Airports missing from OurAirports (rail stations) need lat/lon added to `data/airports.json` by hand once; manual entries there are never overwritten.
