# Deploy GridLens on Vercel

This `vercel` branch runs standard Next.js with Node.js server routes. The existing `main` branch preserves the original Sites/Cloudflare deployment.

## Required settings

| Setting | Value |
| --- | --- |
| Git repository | `Fadil1212/GridLens` |
| Deployment branch | `vercel` |
| Framework | Next.js |
| Root directory | Repository root |
| Build command | `pnpm build` |
| Install command | `pnpm install --frozen-lockfile` |
| Node.js | 22.x or a compatible later version |
| Environment variable | `EIA_API_KEY` (server-only, production and preview) |

Configure the EIA key in Vercel project settings; do not paste it into source or GitHub. The exported key example is only a placeholder.

## What changed

- Vinext/Cloudflare runtime replaced with native Next.js App Router.
- D1 response snapshots replaced by Next.js server data caching.
- Grid analysis revalidates after 600 seconds, energy analysis after 86,400 seconds.
- Cache revalidation can serve an older successful response while refreshing. Use the returned `fetchedAt` and observation time to assess freshness.
- Server functions declare a 300-second maximum duration, subject to the Vercel project's plan and configuration.
- There is no separate database account or SQL migration required for this deployment.

The cache is not an SQL database or historical warehouse. If historical snapshot retention is needed, add a database-backed repository later. The model and live data features remain the same.

## Import and deploy

1. Import the repository into Vercel.
2. Choose `vercel` as the deployment branch. If import defaults to `main`, deploy the `vercel` branch explicitly and set the production branch in the project's Git settings.
3. Set `EIA_API_KEY` for the selected environment.
4. Deploy and check the build logs.
5. Verify `/`, `/api/grid?ba=PJM`, `/api/energy`, and the dashboard interactions.
6. Configure project-level deployment protection to match the audience you intend; a Vercel URL is not proof of anonymous access.

## Verified production deployment

- Live app: https://gridlens-blond.vercel.app/
- Vercel project: `gridlens`
- Source commit: `3437febcf1850937f6f5431faf81860d62c16917` on `vercel`
- Provider state: READY; build duration approximately 48 seconds.
- Verified October 11, 2026: public dashboard loads live PJM observations; Forecast lab renders benchmark scores; Energy transition renders 51 jurisdictions; Decision studio updates its planning buffer when the stress slider changes.
- HTTP checks: `/api/grid?ba=PJM` 200, `/api/energy` 200, invalid authority 400.
- EIA_API_KEY is stored as a sensitive server environment variable for production and preview.

The deployment was created explicitly from the commit above. For automatic production releases, verify the Vercel project's Git production branch is `vercel` before relying on push-triggered deployment. Main retains the original Cloudflare implementation.

Observability limitation: build-log retrieval through the connector returned a team-scope authorization error. Verification used provider READY status, public HTTP checks and browser interactions. No runtime error-log scan or monitoring-drain audit is claimed.

## Local development

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
# Set EIA_API_KEY privately.
pnpm dev
```

Default URL: http://localhost:3000. Build and run production with `pnpm build` followed by `pnpm start`.

## References

- https://vercel.com/docs/frameworks/full-stack/nextjs
- https://vercel.com/docs/functions/configuring-functions/duration
- https://nextjs.org/docs/app/api-reference/functions/unstable_cache
