# Local setup and deployment

## Prerequisites

- Node.js 22.13+.
- pnpm 11.25.0, matching `packageManager` in `package.json`.
- A free EIA API key from https://www.eia.gov/opendata/register.php.

## Install and configure

```bash
pnpm install --frozen-lockfile
cp .env.example .env
cp .dev.vars.example .dev.vars
```

Replace the placeholder with your key privately. `.env` supplies local Node/Vite environment values; `.dev.vars` supplies local Worker bindings. Both are ignored by Git. Do not put the key in `NEXT_PUBLIC_*`, source code, the hosting manifest or GitHub repository variables intended for the browser.

## Initialize the local database

```bash
pnpm build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_youthful_stellaris.sql
```

Apply once per fresh local database. Migration changes should be appended, not edited after application. Local and production databases are separate.

## Start

```bash
pnpm dev
```

Use the printed loopback URL, usually port 5173. To preview the built Worker instead, run `pnpm start` after building and initializing the database.

## Checks

```bash
pnpm typecheck
pnpm test
pnpm build
```

Optional live tests:

```bash
pnpm test:live
node tests/energy.mjs
```

The first test command transpiles shared modules into ignored `.sites-runtime/checks/`. The energy test uses those compiled modules, so run it after `pnpm test` or `pnpm test:live`.

## Deployment

Current deployment: https://gridlens-fadil.blushreed33.chatgpt.site.

The existing live app is managed through Sites. This GitHub source export intentionally excludes its live Site ID. Do not create another Site simply to upload code to GitHub. Updating GitHub does not redeploy the existing app automatically.

For a new independent Sites deployment, follow the Sites initialization/publication workflow, configure `EIA_API_KEY` as a server secret, retain the `DB` binding, and let publication apply schema migrations. Direct third-party deployment has not been validated. Vercel or GitHub Pages are not drop-in hosts for this Worker/D1 implementation.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Missing EIA configuration | Populate ignored local environment files or hosted server secret |
| `no such table: data_snapshots` | Apply the migration to the correct local/hosted database |
| EIA temporarily unavailable | Retry later; inspect upstream status without printing credential-bearing URLs |
| Too few valid observations | Try another authority; missing lag/forecast data can reduce paired rows |
| Live app asks for sign-in | Site audience is private; GitHub visibility does not alter app visibility |
| Port already in use | Stop the existing development instance or use a different local port |
