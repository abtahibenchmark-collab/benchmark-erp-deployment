# Benchmark RMG ERP Control Tower v9.2 – Functional Dashboard and Modules

This is a runnable Next.js ERP dashboard with:

- Reference-style Management Control Tower UI
- Google Sheets / Apps Script live data connection
- Automatic 30-second refresh
- Secure login screen with first-login password change
- Session cookie authentication through the server API
- Google Sheets CRUD for Orders, Merchandising, Planning, Material Control, Store, Production, Shipment, and Quality
- Search and CSV export in data modules
- Reconciliation module in the sidebar
- PO-wise order → material → cutting → sewing → finishing → FG → shipment reconciliation
- Honest empty states when Google Sheets has no matching records (no fabricated production totals)
- Working date range and year filters, factory/status filters, search, refresh, and pagination
- Functional Reports, AI Insights, Settings, and Users page data sources

## Run locally

```powershell
npm install
Copy-Item .env.local.example .env.local
# Edit .env.local and paste your Apps Script Web App /exec URL
npm run dev
```

Open: http://localhost:3000

Sign in at `/login`. Initial administrator credentials are documented in `google-apps-script/SETUP.md`; change the temporary password immediately.

Reconciliation: http://localhost:3000/reconciliation

## Google Sheets setup

See `google-apps-script/SETUP.md`.

## Important

When `GOOGLE_SCRIPT_URL` is missing, the UI shows **Not Connected** and empty operational totals rather than presenting fabricated numbers as live data. Once the URL and `ERP_API_TOKEN` are configured and you are signed in, the sidebar changes to **Connected** and the UI refreshes from Google Sheets every 30 seconds. Operational form saves write to their corresponding sheet tabs. See `google-apps-script/SETUP.md` for deployment and security steps.

### Easy PowerShell start
You can also run:

```powershell
.\START-ERP.ps1
```

The script checks that you are in the correct folder, installs dependencies, creates `.env.local` if needed, and starts the ERP.

## Brand logo

Place the original Benchmark Group logo at `public/logo.png` to display it in the login screen and sidebar. The uploaded v9.0 ZIP did not contain the logo asset, so the UI has a clean `B` fallback until you copy that file into `public/`.
## Factory-wise Production and Quality protection
See [FACTORY-ACCESS-SECURITY-SETUP.md](./FACTORY-ACCESS-SECURITY-SETUP.md) for the required Apps Script deployment, user factory assignments, and per-factory Production/Quality PIN configuration.


## Order workload vs factory capacity (SMV)

The Orders form includes **SMV (minutes per piece)**. On save, Apps Script calculates **Order Minutes = Order Qty × SMV** and stores both values in the `Orders` tab. The dashboard compares active order workload minutes with available monthly factory capacity minutes.

The `Factory_Capacity` sheet is created by `setupBenchmarkERP()` if it does not exist. Initial line/operator/day figures are seeded from the planning notes and must be verified. Edit `Sewing Lines`, `Operators Per Line`, `Working Minutes Per Day` and `Working Days Per Month` there; capacity is recalculated as their product.

### Google Sheets connection check

1. In Apps Script, run `setupBenchmarkERP()` and confirm it completes.
2. In **Project Settings → Script Properties**, verify `ERP_API_TOKEN` exists. The same exact value must be in the server-only `.env.local` file.
3. Deploy **Deploy → Manage deployments → Edit → New version → Deploy** as a Web App, executing as the script owner and with access allowed to the intended users.
4. Set `GOOGLE_SCRIPT_URL` to the deployment URL ending `/exec`, set `ERP_API_TOKEN` to the exact Script Property, and set a long stable `ERP_SESSION_SECRET` in `.env.local`.
5. Restart Next.js after editing `.env.local`.
6. Visit `/api/erp?action=health`. A connected response verifies the Apps Script URL and token. Then sign in at `/login`; normal ERP records still require a valid ERP session.
7. If health works but login fails, use the ERP_Users sheet to check the username, Active status, and password. Do not create a duplicate admin account. If the token was shown in a screenshot, rotate it and update `.env.local` to match.

Do not put tokens or session secrets in client-side code, public environment variables, or screenshots.


## v9.2.0 functional controls update

The dashboard date-range picker and chart-year selector now send date filters to Apps Script. Factory comparison cards and the factory selector filter analytics; the line table supports factory/status filters, search, page-size selection, and real pagination. Dashboard notifications, report details, user management navigation, and refresh controls are wired to real pages/actions. Shipment and production summaries and AI signals are calculated from loaded records rather than fixed sample claims.

Reports & Analytics reads the reconciliation endpoint, AI Insights reads production records, Settings tests the API health endpoint, and Users & Permissions reads the authorized user directory. The user directory is intentionally read-only in the UI; account creation and factory/PIN configuration remain administrator-controlled through the documented Google Sheets / Apps Script workflow.

### Deploy the matching Apps Script update

1. Open the Apps Script project connected to the same Google spreadsheet.
2. Replace its `Code.gs` contents with `google-apps-script/Code.gs` from this package.
3. Save, then choose **Deploy → Manage deployments → Edit → New version → Deploy** for the existing Web App.
4. Keep the existing spreadsheet and `ERP_API_TOKEN`; do not create a new spreadsheet or regenerate the token just for this UI update.
5. Restart the Next.js app, sign in, and test a date range, factory selector, line filters, pagination, record save/edit/delete, Reports, and Settings.

The backend scopes dashboard and reconciliation results to the signed-in user's assigned factory unless the user has the Admin role. Newly introduced form fields are added as new sheet columns without overwriting existing columns.

**Verification note:** TypeScript/TSX syntax and Apps Script JavaScript syntax checks passed in the preparation environment. `npm install` timed out here, so a complete dependency-backed `npm run build` could not be verified in this environment. Run `npm install` followed by `npm run build` on your connected Windows PC before deployment.
