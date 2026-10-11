# Architecture

## Request flow

1. The React client requests `/api/grid?ba=PJM` or `/api/energy`.
2. The API invokes a cached computation. Next.js revalidates grid payloads after ten minutes and energy payloads after one day.
3. On a cache miss, the server calls EIA with the server-only API key, paginates in 5,000-record batches, and retries unsuccessful requests up to three times.
4. Grid records are merged into one row per UTC hour. Missing hours and values remain null.
5. The forecasting module constructs lag/calendar features, fits a ridge model and evaluates paired held-out hours.
6. A full-history refit produces a recursive 24-hour outlook. Separate calibration supplies empirical error bands.
7. The complete response is cached by the Next.js server data cache and returned to the client.
8. The client renders metrics and charts, recalculates stress assumptions locally, and exports CSVs.

## Components

| Component | Location | Responsibility |
| --- | --- | --- |
| Web interface | `app/page.tsx`, `app/globals.css` | Filters, charts, state comparison, planning and exports |
| Grid API | `app/api/grid/route.ts` | Authority validation, UTC alignment and forecast response |
| Energy API | `app/api/energy/route.ts` | Selected fuel generation and residential-price aggregation |
| EIA adapter | `lib/eia.ts` | Secret-backed requests, pagination, timeout and memory cache |
| Model engine | `lib/forecast.ts` | Features, fitting, metrics, calibration and recursive predictions |
| Cache integration | `app/api/*/route.ts` | Next.js cached computations with timed revalidation |
| Hosting | `vercel.json`, Next.js | Node.js functions on Vercel |

## Storage and hosting

This branch uses Next.js server data caching instead of Cloudflare D1. It is not a historical warehouse or an SQL persistence layer. Cache behavior follows the hosting platform; revalidation may serve the last successful response while a refresh occurs.

Hosted audience and deployment protection are configured in Vercel. The app has no custom user login system or stored passwords. The existing Sites deployment remains separate. Vercel Git integration can deploy pushes to its configured production branch after account connection.

## Tradeoffs

- TypeScript model fitting avoids a separate Python service and keeps the numerical model inspectable in the deployed runtime.
- Next.js server caching reduces repeated external computation; it does not archive every retrieval.
- An in-memory EIA cache is only a best-effort cache within a Node.js function instance.
- No scheduler is deployed; freshness comes from request-driven refreshes.
- No single-flight lock exists, so concurrent misses can duplicate upstream work.
- Only the selected monthly fuel categories are included; aggregate fuel totals are excluded to avoid double counting.
- The EIA adapter's pagination loop is bounded at 20,000 rows. Current source filters fit within that bound; larger date ranges would need explicit completeness handling.
