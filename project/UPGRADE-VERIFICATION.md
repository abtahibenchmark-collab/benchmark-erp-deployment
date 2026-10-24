# Benchmark ERP — integrity & security hardening (test candidate)

This package is based on the user's `Benchmark-ERP-9.5-RELIABILITY-UPGRADE(1).zip`.

## Implemented in Google Apps Script
- Server-side non-negative quantity validation on Orders, Planning, Production, Store, Material, Shipment and Quality.
- Order quantity > 0 and prevention of duplicate `(factory, PO number)` on creation/edit.
- Optional optimistic concurrency protection: when updating/deleting a record, provide `expectedUpdatedAt` equal to the `Updated At` value read from the sheet. Conflicts return an error instead of overwriting newer data. **The existing frontend may not pass this field yet**, so this protection is available for updated clients but not universal.
- Audit log `Details` now includes before/after snapshots for CRUD operations, with credential-related fields excluded. Existing Spreadsheet editors can still change audit sheets directly; this is not tamper-proof.
- Failed-login attempts per username are limited using Apps Script CacheService to 7 attempts in a 15-minute cache window. This is best-effort and does NOT protect against distributed attacks, cache eviction, or all account-enumeration risks.

## Kept from previous release
- Planning Command Center, Reports & Analytics, Abtahi's Brain rules-based analysis.
- Signed session verification, origin checks, factory PIN restrictions, and planning approval flow.

## Not yet verified / work still needed
- Live Apps Script connectivity, successful deployed login, and Google Sheets CRUD under simultaneous user load.
- `npm run build` and dependency lockfile: package registry was unreachable in the build environment. Run `npm install`, commit the generated `package-lock.json`, and run `npm ci && npm run build` on an internet-connected machine before deploying.
- Existing UI does not pass `expectedUpdatedAt` for every edit and delete; wire this field to benefit from optimistic concurrency.
- Do not use this as a verified enterprise security solution: session revocation and audit-log tamper protection require additional work.
- Abtahi's Brain is a data-grounded rules engine, not a connected LLM.

## Safe upgrade
1. Back up Google Sheet and previous Apps Script deployment.
2. Deploy new `google-apps-script/Code.gs` against a test Spreadsheet first; run setup as required by SETUP.md.
3. Test add/edit/delete on each operational module, including duplicate PO rejection, negative quantity rejection and conflict rejection.
4. Confirm the Admin account has global access and blank Factory Access; test with non-admin roles.
5. Use fresh `ERP_SESSION_SECRET` (>=32 chars), the same Google Script deployment URL and token in your server environment.
6. Only deploy to production after functional test sign-off, data-backup recovery testing, and concurrency tests.

## API concurrency example
An update or delete request may include `{ "expectedUpdatedAt": "2026-10-21T07:00:00.000Z" }` based on the current sheet value. Google Apps Script returns a conflict when a different value has been saved since.
