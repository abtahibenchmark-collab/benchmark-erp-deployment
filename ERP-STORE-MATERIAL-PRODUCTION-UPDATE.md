# ERP Update Notes — Store, Material, Quality, Reconciliation and Production

## Changes included

- **Store & Receiving:** removed PO from the user-facing form and table; added Style No., Color, Buyer and Order Month.
- **Material Control:** removed PO from the user-facing form and table; added Style No., Color, Buyer and Order Month.
- **Orders:** added an optional Color field so reconciliation can group by style/color where the order data provides it.
- **Quality:** Defect Type is required, defect quantity is entered by the user, and DHU is displayed as an automatic calculation: `Defect Qty / Checked Qty * 100`.
- **Production:** added SMV, Manpower and Working Hours; Efficiency is calculated as `Sewing Output * SMV / (Manpower * Working Hours * 60) * 100`. When those inputs are unavailable, the backend keeps a target-based fallback for compatibility with older records.
- **Reconciliation:** includes material required/ordered/received/issued/balance/shortage and store received/issued/balance, grouped by buyer, style, color, factory and order month. Existing PO-linked records remain supported. Unmatched style-based store/material entries are shown as `No Order Master`.
- **Operational Insights:** includes material shortfalls, depleted store stock, high-DHU inspections, low-efficiency records and open shipment balances.

## Deploy the Next.js app to GitHub and Vercel

This archive has `app/`, `components/`, `package.json`, and `next.config.js` directly at the archive root.

1. Extract this ZIP into the local folder that is the root of your GitHub repository. Do not put all files inside another `project/` folder.
2. Review the changed files, then commit and push them to the repository's connected branch.
3. In Vercel, open **Project Settings → Build and Deployment**. Set **Root Directory** to the repository root (blank/default), because `app/` and `package.json` are at the root.
4. Keep the existing environment variables configured in Vercel. Do not commit `.env.local` or API secrets.

## Update the Google Apps Script backend

The updated backend is in `google-apps-script/Code.gs`.

1. Open the Apps Script project attached to your ERP Google Sheet.
2. Replace the existing `Code.gs` content with this updated file and save.
3. If the ERP is already initialized, run `setupBenchmarkERP()` once to append the new headers. The setup helper adds missing headers and does not delete existing columns/data.
4. Open **Deploy → Manage deployments**, edit the existing web-app deployment, choose **New version**, and deploy. If you create a new deployment instead, update `GOOGLE_SCRIPT_URL` in Vercel to the new URL.
5. Do not change `ERP_API_TOKEN` unless you are intentionally rotating it.

## Compatibility note

The old PO columns may remain in existing Google Sheets tabs because the setup function preserves existing data and columns. PO is removed from the Store/Material Control user interface; old PO-linked records can still be reconciled.
