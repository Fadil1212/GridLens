# Server API reference

## GET `/api/grid?ba=PJM`

Supported `ba` values: PJM, MISO, ERCO, CISO, ISNE, NYIS, SWPP, SOCO, TVA and DUK. Default: PJM.

Returns authority, source, server fetch time, latest observed record, aligned hourly rows, model analysis and completeness counts. Analysis contains three model metric objects, paired evaluation rows, next-24-hour forecast rows, training count and evaluation boundaries. Forecast rows contain UTC time, point prediction and empirical lower/upper bands. All demand-valued fields use interval-average MW.

- `200`: data and analysis available.
- `400`: invalid authority.
- `503`: upstream, model or database operation unavailable; response includes an error message.

Grid responses have a private five-minute browser cache header; the server snapshot expires after ten minutes. Refreshing the UI does not guarantee a new upstream fetch inside that window.

## GET `/api/energy`

Returns the previous calendar year, source, fetch time and state objects. State objects include code/name, selected-fuel generation totals, fuel breakdown, generation month count, renewable share and mean residential price.

Generation totals use the source unit of thousand MWh. Prices are cents/kWh. The current implementation does not return independent retail-month coverage.

- `200`: aggregated state data available.
- `503`: upstream or database unavailable.

Server snapshots expire after one day.

## Authentication and credentials

The current hosted Site is private and requires platform access. Normal requests from the dashboard use the visitor's platform session; the app has no separate API-key authentication scheme for visitors. The EIA key is server-only. Private Sites service-access credentials are platform-managed and must never be committed or shown in client examples.

The API is an internal product surface, not a separately hardened public API. Public request rate limits and service-level guarantees are not implemented.
