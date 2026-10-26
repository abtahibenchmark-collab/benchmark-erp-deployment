# Dashboard functionality update — v9.2.0

- Connected dashboard date range controls to the Google Apps Script dashboard API.
- Added a working year selector, factory and status filters, search, refresh, and page-size-aware pagination for line status.
- Removed hard-coded demo quantities and misleading static shipment/production summaries.
- Made notification and detail/report navigation links actionable.
- Fixed Reports, AI Insights, Settings, and Users pages so they load the correct source endpoint instead of falling back to Orders.
- Added safe automatic sheet headers for newly introduced fields such as SMV and Order Minutes.
- Derived production efficiency from output/target when the sheet has no saved efficiency value.
- Kept reconciliation empty when no source data is available rather than displaying fabricated sample records.

The app syntax and Apps Script syntax were checked. A full `npm run build` could not be completed in this environment because dependency installation did not finish; run `npm install` and `npm run build` on the development PC before deployment.

# Dashboard analytics update

- Added factory-wise Orders vs Capacity grouped bar chart with quantity tooltips. Capacity is the sum of recorded production line targets.
- Added factory performance ranking based on average production line efficiency.
- Added factory-wise DHU chart and inspection/defect totals from the Quality sheet.
- Added defect type selection to Quality records and a factory-wise defect type breakdown on the dashboard.
- Fixed sidebar avatar hydration mismatch by resolving the saved user after the component mounts.
- Left `google-apps-script/Code.gs` unchanged as requested.

## One-time Google Sheets setup

In the `Quality` tab, add a new column with the exact header `Defect Type`. Do not delete or replace existing columns. This is required for saving and reporting defect categories because Code.gs was intentionally not changed.

## Capacity definition

The dashboard uses the sum of the `Target` values in Production records for each factory as the current planned line capacity. Ensure daily line targets are entered for meaningful capacity comparisons.

## Validation

The project files were updated and packaged. A full Next.js build could not be completed in this environment because dependency installation timed out. Run `npm install` and `npm run build` locally before production deployment.
