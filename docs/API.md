# Server API reference

## GET `/api/grid?ba=PJM`

Supported `ba` values: PJM, MISO, ERCO, CISO, ISNE, NYIS, SWPP, SOCO, TVA and DUK. Default: PJM.

Returns authority, source, server fetch time, latest observed record, aligned hourly rows, model analysis and completeness counts. Analysis contains three model metric objects, paired evaluation rows, next-24-hour forecast rows, training count and evaluation boundaries. Forecast rows contain UTC time, point prediction and empirical lower/upper bands. All demand-valued fields use interval-average MW.

- `200`: data and analysis available.
- `400`: invalid authority.
- `503`: upstream, model or database operation unavailable; response includes an error message.

Grid responses have a private five-minute browser cache header; the cached computation revalidates after ten minutes. Refreshing the UI does not guarantee a new upstream fetch inside that window.

## GET `/api/energy`

Returns the previous calendar year, source, fetch time and state objects. State objects include code/name, selected-fuel generation totals, fuel breakdown, generation month count, renewable share and mean residential price.

Generation totals use the source unit of thousand MWh. Prices are cents/kWh. The current implementation does not return independent retail-month coverage.

- `200`: aggregated state data available.
- `503`: upstream or database unavailable.

Server-cached computations revalidate after one day.

## Authentication and credentials

The EIA key is server-only. The app itself does not implement visitor authentication. Access to a Vercel deployment depends on the project's deployment-protection settings. Do not assume that a successful deployment is publicly accessible until checking it without authentication.

The API is an internal product surface, not a separately hardened public API. Public request rate limits and service-level guarantees are not implemented.
