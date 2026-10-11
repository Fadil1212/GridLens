# Portfolio and interview notes

## Project description

GridLens is a deployed full-stack electricity analytics application using live U.S. EIA data, chronological forecasting evaluation and interactive demand-stress planning. It combines TypeScript server ingestion, SQL snapshots, ridge regression and a React dashboard.

## Resume bullets grounded in the implementation

- Built and deployed a full-stack electricity analytics app integrating live EIA data across 10 balancing authorities and 51 state jurisdictions, with interactive charts, CSV exports and database-backed snapshots.
- Implemented lag-based ridge forecasting with a chronological seven-day holdout and paired EIA/seasonal benchmarks; an October 2026 PJM test achieved 1.99% one-step MAPE across 168 held-out hours.
- Added recursive 24-hour forecasts, empirical calibration bands and a demand-stress worksheet, with explicit data completeness, freshness and methodology disclosures.

Use the test date and one-step qualifier when citing model metrics. Do not describe the experiment as a guaranteed production forecast improvement or an equal-lead-time comparison against EIA.

## Good interview talking points

1. Why temporal splits matter more than random splits for forecasting.
2. Why a seasonal baseline is essential before claiming model value.
3. How one-hour-ahead evaluation differs from recursive 24-hour prediction.
4. How missing hourly positions can corrupt lags if records are simply dropped.
5. Why snapshot caching is useful but is not a historical warehouse.
6. Why state price/generation relationships do not establish causation.
7. What would change next: equal-horizon rolling backtests, weather features, publication-time datasets, calibrated multi-step bands and traffic controls.

## Before recruiter sharing

- Make the live demo public if you want anonymous access.
- Verify the public URL in a signed-out browser.
- Add genuine screenshots after desktop/mobile visual checks.
- Pin the repository and set its About website to the deployed URL.
- Add a short walkthrough video demonstrating the user flow and limitations.
