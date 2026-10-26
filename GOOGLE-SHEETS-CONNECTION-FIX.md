# Google Sheets connection repair — Benchmark ERP

This package cannot include your private Google Apps Script deployment URL, live API token, or login password. Use the exact values from your Apps Script project.

## A. Update the Google Sheet backend
1. Open the Google Sheet that is the ERP source of truth.
2. Open **Extensions → Apps Script** and replace the editor contents with `google-apps-script/Code.gs` from this package; save.
3. Select `setupBenchmarkERP` and Run it once. Approve access. It adds the `SMV` column to `Orders` and creates `Factory_Capacity` with the initial figures from your notes. It will not overwrite existing capacity rows.
4. If the admin login is invalid, select `resetERPUserPasswordFromPrompt`, Run it, and follow the prompts for the exact username and a temporary password of at least 10 characters.
5. Choose **Deploy → Manage deployments → Edit → New version → Deploy**. The Web App should execute as you and use an access setting that allows the server request to reach the app. Copy the exact `/exec` URL.
6. Under **Project Settings → Script Properties**, check `ERP_API_TOKEN`. Copy its value privately. Do not put it in client-side code or screenshots.

## B. Configure the Next.js server
1. In the project root, create `.env.local` (do not name it `.env.local.txt`). Add:

```env
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/PASTE_YOUR_DEPLOYMENT_ID/exec
ERP_API_TOKEN=PASTE_THE_EXACT_SCRIPT_PROPERTY_TOKEN
ERP_SESSION_SECRET=PASTE_A_SEPARATE_LONG_RANDOM_SECRET
```

2. Generate the session secret in PowerShell with:

```powershell
[guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N")
```

Paste the output as the value of `ERP_SESSION_SECRET`. Do not change it each time you start the server; changing it invalidates current login cookies.
3. Stop Next.js with `Ctrl+C`, then run `npm install` and `npm run dev` from the folder containing `package.json`.
4. Open `http://localhost:3000/api/erp?action=health`. Expected: JSON with `"connected":true`. If false, the returned error identifies whether the URL/token/configuration is wrong. Fix that before trying to sign in.
5. Open `/login` and sign in. If you changed the session secret or API token, sign in again.

## C. Order and capacity inputs
- Open **Orders → New Entry** and enter PO, style, factory, order quantity and **SMV (minutes per garment)**. SMV is required so the workload can be calculated.
- `Factory_Capacity` contains editable settings: Lines, Operators Per Line, Working Minutes Per Day and Working Days Per Month.
- Available monthly capacity = Lines × Operators Per Line × Working Minutes Per Day × Working Days Per Month.
- Order workload = Order Qty × SMV. The dashboard compares workload minutes with monthly available capacity minutes.
- If an existing order has no SMV, the dashboard flags it; edit that order and enter its correct SMV.

## D. Token safety
A token appeared in one of the screenshots shared during troubleshooting. After the new version is configured, rotate it at a convenient time by selecting and running `rotateERPApiToken` in Apps Script, copying the newly logged token into `.env.local`, then restarting Next.js. Until both sides match, the API will be disconnected.
