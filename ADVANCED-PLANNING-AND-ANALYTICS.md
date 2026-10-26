# Benchmark Group ERP — Advanced Planning, Abtahi's Brain & Analytics

## What's changed
- `/planning` and `/planning-command` now load the Planning Command Center rather than a generic planning form/redirect. It provides Full View, Capacity & Load, Planning Board, Allocations, Feeding Plan, Rebalance, Optimize, Gantt, Approvals and Abtahi's Brain tabs.
- Full View joins Orders with Planning, Production and Shipment records using Factory + PO, applies factory filtering and text search, and exports CSV.
- Capacity & Load compares available factory capacity and active order workload (SMV minutes) as returned by the deployed Apps Script `dashboard` endpoint.
- Allocations can be created via the existing ERP save endpoint. Existing allocation line/date changes use the existing `planningmove` (Admin) or `planningrequest` (other staff) backend workflows; Admin can approve/reject pending requests.
- Feeding shows recorded material shortages; Rebalance and Optimize display *advisory* recommendations only; they do not silently modify the spreadsheet.
- Gantt shows saved allocations across a rolling approximately 75-day viewport.
- `/reports` now renders live charts (monthly trends, factory comparison, buyer order volumes, defect categories), operational cards, CSV export, and explicit partial-load errors.
- Abtahi's Brain includes specific PO/factory scoping for exact names found in permitted records, production/quality/shortage summaries, and basic capacity workload explanations. This is rules-based data analysis, NOT generative AI or guaranteed forecasting.

## Backend and safety
- Bundled Google Apps Script `google-apps-script/Code.gs` is the same matching backend from the previous Login Fix project. No new Apps Script columns are required for these frontend changes.
- Existing protected API `/api/erp` proxies signed-in users to Apps Script. Backend credentials must remain in `.env.local`, not in code or GitHub. A stable `ERP_SESSION_SECRET` of at least 32 chars is required.
- Take a backup of the live Google Sheet before any Code.gs deployment. Prefer trial runs against a test spreadsheet.
- Global Admin is not assigned a factory; non-admin user factory scope is enforced by Apps Script.
- Any 0 shown on a successful but empty sheet is genuine *recorded* data absence, not a simulated KPI. Failed modules show an error; the resulting partial results are incomplete.

## Install
1. Extract project, ensure `.env.local` is next to package.json with GOOGLE_SCRIPT_URL, ERP_API_TOKEN and ERP_SESSION_SECRET.
2. Run `npm install`, then `npm run dev`.
3. Test `/api/erp?action=session` (should report `authenticated:true` after login).
4. Test `/api/erp?action=list&module=orders` and `/api/erp?action=list&module=planning` after login.
5. Open `/planning` and `/reports`; compare a test order and its allocation in Google Sheets, then test saving a *test* allocation and refreshing.
6. Run role-specific tests: Admin (blank factory access), a non-admin permitted factory, and a non-admin blocked factory. Test approvals and rollback procedures before production.

## Testing limitations
- TypeScript syntax was checked using global `tsc`; full project type-check/build was not possible in the execution environment because npm dependency installation timed out and Next.js/React typings were unavailable. Test `npm run build` on your machine.
- No credentials or accessible live Google Sheets Web App were supplied for end-to-end verification. Live synchronization, authorization and performance are therefore unverified.
- This release enhances three surfaces; it is not evidence that every old module is production-ready, nor a justified 10/10 score.
