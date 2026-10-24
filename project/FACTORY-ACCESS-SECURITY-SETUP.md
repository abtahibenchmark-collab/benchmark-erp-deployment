# Factory-wise Production & Quality Access Protection

This update adds backend-enforced factory access and separate factory/module PINs for Production and Quality. The PIN is never stored in browser storage. The server forwards the signed-in username to Apps Script, and Apps Script verifies the assigned factory and PIN for every create, edit, and delete request.

## 1. Replace the project files

Use the files in this package, especially:

- `components/ModulePage.tsx`
- `app/api/erp/route.ts`
- `google-apps-script/Code.gs`
- `app/globals.css`

Keep your existing `.env.local` and its Google Apps Script URL/API token. Do not put secrets in client-side code.

## 2. Update the Google Apps Script

1. Open the Apps Script project connected to the ERP Google Sheet.
2. Replace its `Code.gs` with `google-apps-script/Code.gs` from this package.
3. Save the script.
4. Run `setupBenchmarkERP()` once and approve the requested authorization. This adds the `Factory Access` column to `ERP_Users`, creates the private `Factory_Security` sheet, and adds the `Defect Type` column to Quality if missing.
5. Deploy > Manage deployments > Edit the web app deployment > select **New version** > Deploy. Keep the same deployment URL so the existing `.env.local` can continue to use it.

## 3. Assign each non-admin user to one factory

In Apps Script, choose and run `assignERPFactoryFromPrompt`.

- Enter the exact ERP username.
- Enter exactly one factory: `Benchmark Apparels`, `Benchmark Exports`, or `Fabtex`.
- Run it again for each Production or QA user.
- After changing a user's factory access, that user must sign out and sign in again.

An empty Factory Access leaves the user unable to access Production or Quality records. Admin accounts can access all factories, but still need the appropriate factory/module PIN to enter, edit, or delete records.

## 4. Set separate PINs per factory and module

Run `configureFactoryPinFromPrompt` once for each combination below:

- Benchmark Apparels / production
- Benchmark Apparels / quality
- Benchmark Exports / production
- Benchmark Exports / quality
- Fabtex / production
- Fabtex / quality

Use a unique 6–12 digit PIN for every combination. Do not reuse one PIN across factories or modules. PINs are stored as salted hashes in `Factory_Security`, not as plain text. The prompt does not log the PIN.

## 5. How users will work

1. User signs in to the ERP with their normal ERP username/password.
2. In Production or Quality, they click **New Entry**, Edit, or Delete.
3. They enter the factory PIN. Non-admin users can only select their assigned factory.
4. The form locks the Factory field to that factory.
5. The server checks factory assignment and PIN again when saving or deleting. Changing the browser request or dropdown alone cannot bypass the server-side check.
6. Production/Quality record lists and CSV exports are filtered to the assigned factory for non-admin users.

## Notes

- This is a shared PIN per factory and module, combined with each user's assigned factory. Anyone who knows the shared PIN and has a user account assigned to that factory can perform the protected actions. Share PINs only with authorized staff and rotate them when staff leave.
- The protection applies to ERP actions routed through this Next.js/API + Apps Script setup. Restrict direct edit access to the underlying Google Sheet to trusted administrators, because spreadsheet editors can bypass the application by editing cells directly.
- Do not share the Apps Script API token. Keep it only in Apps Script Script Properties and server-side `.env.local`.
