# Benchmark ERP — PO / Style Production Progress

Dashboard now includes a searchable **PO & Style-wise Production Progress** table with factory filter, cutting, sewing, finishing (pieces and percentages), finishing balance and validation warnings.

**Source:** `Orders` and `Production` tabs of the same Google Sheet. Only matching `(Factory, PO Number/PO, Style)` rows are aggregated. The `Orders` tab supplies the denominator. The `Production` tab supplies daily/incremental quantities which are summed across rows and production lines.

**Formula:** Cutting % = sum(Cutting) / Order Qty * 100. Sewing % = sum(Sewing Output) / Order Qty * 100. Finishing % = sum(Finishing) / Order Qty * 100. Values >100% are displayed and flagged; unknown order qty -> no percent shown.

**Assumptions:** Production quantities represent incremental quantities per record; do NOT input running cumulative totals into each daily record, or sums will overcount. Verify all PO and Style identifiers are consistent across sheets and factory spellings match exactly. Repeated order rows for the same PO/style/factory will be added together; ensure this matches your order-line granularity.

## Install
1. Backup the current project and Apps Script.
2. Copy the three changed files: `components/Dashboard.tsx`, `app/globals.css`, and `google-apps-script/Code.gs` from this package into your existing v9.6 project, or use the entire ZIP.
3. In Google Apps Script update the existing `Code.gs`, save, then **Deploy > Manage deployments > Edit > New version > Deploy**. Do not publish passwords or API tokens.
4. Ensure your `.env.local` uses the correct `GOOGLE_SCRIPT_URL`, `ERP_API_TOKEN`, and `ERP_SESSION_SECRET` and restart Next.js.
5. Open the dashboard, check PO/style quantities and the stage percentages against the Sheets data. Test factory filtering and search.

**Security:** Existing factory PIN authorization code was preserved. The app should be tested before production deployment. No full Next.js build or live Google Sheets test has been executed here.
