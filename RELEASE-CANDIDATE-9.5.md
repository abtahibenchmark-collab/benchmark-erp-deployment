# Benchmark ERP 9.5 Release Candidate 2

This release focuses on correctness and safe validation before production rollout.

## Changes in this package
- Pinned direct dependency versions instead of using `latest`.
- Added `npm test` / `npm run check:backend` for backend validation tests.
- Added username-based failed-login throttling in Apps Script (8 invalid attempts; 15-minute cache window). Apps Script does not reliably expose client IPs, so this is not a replacement for edge-level rate limiting.
- Corrected Material Control `Balance Qty` to represent stock on hand (`Received Qty - Issued Qty`); shortage remains `Required Qty - Received Qty`.
- Rejects material issue quantities above received stock.
- Validates cumulative shipment quantity against the matching order and factory while allowing partial shipments.
- Expanded test coverage for material issue validation and spreadsheet-formula injection safety.

## Install and verify
1. Back up the existing ERP folder and Google Spreadsheet.
2. Test the included `google-apps-script/Code.gs` against a COPY of the live spreadsheet.
3. In the project folder run `npm install`, then `npm test`, then `npm run build`.
4. Keep `.env.local` out of Git and preserve your current values.
5. Verify login, read/write/update/delete in each authorized module, cross-factory denial, factory PIN enforcement, planning approvals, material balances, partial shipments, reconciliation and Abtahi's Brain.
6. Perform two-user concurrency tests and a backup/restore drill before production.

## Important limits
- No live Google Sheets account was available to this build process; connectivity must be tested after deployment.
- A lockfile could not be generated in this environment because the npm registry was unavailable. After running `npm install` in a network-enabled environment, commit the generated `package-lock.json` and use `npm ci` for reproducible deployments.
- This is a release candidate, not a claim that all production acceptance tests have passed.
