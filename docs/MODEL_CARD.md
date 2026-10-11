# Forecasting model card

## Intended use

Research, portfolio demonstration, forecast comparison and exploratory demand planning for ten U.S. balancing authorities. Not intended for live grid control, reserve compliance, trading or guaranteed dispatch decisions.

## Training data and features

The grid API requests the previous 60 days of EIA-930 hourly records. The learned model predicts actual demand using:

- Intercept.
- Observed demand at lags 1, 24 and 168 hours.
- Sine/cosine of UTC hour and weekday.
- Weekend indicator.

Training demand is normalized by a training-only mean. Ridge penalty is 0.1 on non-intercept coefficients. There is no tuning search, weather enrichment or cross-authority shared model.

## Evaluation

The final 168 hourly positions are held out chronologically. Ridge is fitted before that boundary. Evaluation retains only timestamps with actual demand, required lags and an EIA forecast. Three methods are evaluated on exactly those pairs:

1. Ridge regression.
2. Same-hour previous-week demand.
3. EIA published demand forecast.

Metrics: MAE, RMSE, mean bias and MAPE. MAPE uses actual demand as denominator; zero actuals are excluded from its percentage average. Bias is `actual - predicted`, so positive bias means underprediction.

One-step ridge predictions may use earlier observed demand within the test week. This is valid for rolling one-hour-ahead evaluation, but it is not a fixed-origin seven-day forecast. EIA forecast publication times and historical revisions are not reconstructed. Its operational lead time differs from ridge's, so lower error does not prove an equal-horizon improvement over EIA.

## Future outlook

After evaluation, ridge is refitted using all eligible retrieved observations. Starting from the last observed demand hour, it predicts recursively for the next 24 hours, using its own prediction when the one-hour lag is no longer observed. The outlook is anchored to the last observation, which can lag current wall-clock time.

## Empirical uncertainty band

A separate model is fitted before the pre-test calibration week. Its absolute errors over that calibration week determine a nominal 90% empirical band. This band is reused for the recursive outlook. It has no verified conditional coverage, multi-step calibration, distribution-shift protection or guaranteed 90% future coverage.

## Missing data

Missing hourly positions remain visible. Rows without required lag values are excluded from fitting and evaluation. Missing lags can shorten a future forecast. The dashboard shows observed/expected demand completeness and paired test counts.

## Known limits and next experiments

- Demand-only features; weather, holidays and market effects are omitted.
- Sixty-day training windows may omit seasonal regimes.
- Linear relationships cannot capture all nonlinear demand effects.
- One observed test week is insufficient evidence of general reliability.
- A stronger next evaluation would use rolling-origin multi-week tests at equal forecast horizons, frozen publication-time datasets, weather features and calibrated multi-horizon intervals.

Numerical implementation: `lib/forecast.ts`. Validation evidence: [VALIDATION.md](VALIDATION.md).
