# Local setup

This branch uses standard Next.js. Requirements: Node.js 22.13+, pnpm 11.25.0 and a free EIA API key.

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
# Privately replace the placeholder in .env.local with your EIA_API_KEY.
pnpm dev
```

Open http://localhost:3000. On Windows, copy the environment file through your file manager if needed.

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm start
```

Optional live tests: `pnpm test:live`, then `node tests/energy.mjs`. The first test transpiles shared modules into ignored `.sites-runtime/checks/`. Network-dependent tests may hit upstream limits.

No D1 binding, SQL migration or database account is needed. Platform cache revalidation can serve an older successful response while updating; inspect the fetched and observed timestamps.

Deployment: [VERCEL.md](VERCEL.md). If live requests report missing EIA configuration, populate `.env.local` or the Vercel project's server environment variable. Do not expose secrets in client code.
