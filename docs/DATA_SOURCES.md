# Data sources and semantics

Source: [U.S. Energy Information Administration Open Data API v2](https://www.eia.gov/opendata/documentation.php).

| Dataset | Route | Grain | Product use |
| --- | --- | --- | --- |
| EIA-930 grid operations | `electricity/rto/region-data` | Authority × type × UTC hour | Demand, forecast, net generation and interchange |
| Electric power operations | `electricity/electric-power-operational-data` | State × fuel × month | Selected generation mix, all-sector code `99` |
| Retail electricity sales | `electricity/retail-sales` | State × sector × month | Residential price, sector `RES` |

## Authorities

PJM, MISO, ERCO, CISO, ISNE, NYIS, SWPP, SOCO, TVA and DUK. These selected authorities do not represent every U.S. electricity system; aggregated demand should not be described as total U.S. demand.

## Hourly demand units

EIA returns energy over an hourly interval in megawatthours. For a one-hour interval its numerical value equals average power in MW. Dashboard demand is shown as interval-average MW/GW, not instantaneous telemetry.

## State generation

Fuel codes: coal `COL`, natural gas `NG`, nuclear `NUC`, wind `WND`, solar `SUN`, conventional hydro `HYC`, geothermal `GEO`, wood `WWW` and petroleum `PET`. Generation source units were verified as thousand MWh in the October 11, 2026 live check.

Renewable share is renewable generation divided by generation from these selected fuels. Other fuels are excluded. Aggregate totals such as ALL/renewable rollups are not included, preventing totals from being summed alongside components. This is not a claim of exhaustive state generation coverage.

## Residential prices

Source units: cents/kWh. Each state price is an unweighted average of monthly residential prices within the selected calendar year. The dashboard's overall average is an unweighted mean of state averages, not a sales-weighted national price.

## Time coverage and refresh

Hourly data cover the last requested 60 days; state data use the previous calendar year. Generation month counts are displayed. Price-month coverage is not shown independently, so a state's price mean can reflect fewer observations than its generation coverage. EIA records can lag or be revised.

Snapshots expire after ten minutes for grid data and one day for state data. Refresh is on demand. A failed source request results in an explicit error; no fabricated dataset is substituted.
