# Architecture

## Request flow

1. The React client requests `/api/grid?ba=PJM` or `/api/energy`.
2. The API checks a D1 snapshot. Fresh grid payloads expire after ten minutes; energy payloads expire after one day.
3. On a cache miss, the server calls EIA with the server-only API key, paginates in 5,000-record batches, and retries unsuccessful requests up to three times.
4. Grid records are merged into one row per UTC hour. Missing hours and values remain null.
5. The forecasting module constructs lag/calendar features, fits a ridge model and evaluates paired held-out hours.
6. A full-history refit produces a recursive 24-hour outlook. Separate calibration supplies empirical error bands.
7. The complete response is saved as a database snapshot and returned to the client.
8. The client renders metrics and charts, recalculates stress assumptions locally, and exports CSVs.

## Components

| Component | Location | Responsibility |
| --- | --- | --- |
| Web interface | `app/page.tsx`, `app/globals.css` | Filters, charts, state comparison, planning and exports |
| Grid API | `app/api/grid/route.ts` | Authority validation, UTC alignment and forecast response |
| Energy API | `app/api/energy/route.ts` | Selected fuel generation and residential-price aggregation |
| EIA adapter | `lib/eia.ts` | Secret-backed requests, pagination, timeout and memory cache |
| Model engine | `lib/forecast.ts` | Features, fitting, metrics, calibration and recursive predictions |
| Snapshot repository | `lib/snapshots.ts` | Read/write persistent cached responses |
| Database schema | `db/schema.ts` | Migration-owned snapshot table |
| Runtime/build integration | `build/`, `scripts/`, `vite.config.ts` | Worker packaging, local binding simulation and deployment integration |

## Persistent data

`data_snapshots` stores a key, JSON payload, and server fetch timestamp. `grid:<authority>` keys keep one current payload per authority; `energy` keeps one current state-economics payload. Upserts replace expired payloads. This is a durable response cache, not a historical fact warehouse. No raw API key is written into a snapshot.

## Hosting and access

The live app runs on Workers with D1 via Sites. Hosted access is enforced by the Sites platform. There is no custom password/login database. The GitHub export removes the live Site ID from `.openai/hosting.json`, preventing another checkout from accidentally targeting the existing Site. The logical `DB` binding remains.

GitHub is source hosting. A GitHub push does not automatically redeploy the Sites app; use the Sites publication workflow for subsequent app changes.

## Tradeoffs

- TypeScript model fitting avoids a separate Python service and keeps the numerical model inspectable in the deployed runtime.
- D1 snapshots reduce repeated external calls and survive worker restarts.
- An in-memory EIA cache is only a best-effort cache within a worker instance.
- No scheduler is deployed; freshness comes from request-driven refreshes.
- No single-flight lock exists, so concurrent misses can duplicate upstream work.
- Only the selected monthly fuel categories are included; aggregate fuel totals are excluded to avoid double counting.
- The EIA adapter's pagination loop is bounded at 20,000 rows. Current source filters fit within that bound; larger date ranges would need explicit completeness handling.
