# Benchmark ERP — Reliability and Security Upgrade (9.5.0-beta.1)

This is a **candidate**, not a verified 9.5/10 release.

## Implemented
- Backend department-role authorization for every save and delete. Unknown roles cannot write. Admin remains global without factory assignment.
- Planning allocation validation: a matching PO and factory must exist; quantity must be a positive integer; combined allocations may not exceed the order.
- Server-side request-origin checks for mutations.
- Formula injection protection extended to more spreadsheet cell prefixes.
- Existing Analytics Center, Planning tabs, and Abtahi’s Brain retained.

## Before switching live
1. BACK UP the complete Google Spreadsheet and the current Code.gs deployment.
2. On a COPIED spreadsheet, paste google-apps-script/Code.gs and run setupBenchmarkERP (requires configured bootstrap admin password only if admin is absent).
3. Deploy a NEW Apps Script web-app version; update GOOGLE_SCRIPT_URL in .env.local. Keep ERP_API_TOKEN server-side. Set ERP_SESSION_SECRET to 32+ random characters.
4. Start frontend with npm ci if a lockfile exists, otherwise npm install, then npm run build, npm run start.
5. Confirm session endpoint /api/erp?action=session returns authenticated=true after login.
6. Verify CRUD across each role and factory, test rejection of unauthorized writes and over-allocation.
7. Verify status transitions and approved moves in Planning, then Google Sheets rows and audit logs.
8. Test at least two simultaneous users, backup recovery, exported reports, and all Brain questions.

## Known limitations
- Google Sheets live access and a real production build have not been verified in this environment.
- Abtahi’s Brain is a deterministic ERP-data assistant, NOT a generative LLM. No external AI API is configured.
- Line-specific minute capacity, holidays, material lead-times, and automatic optimizer remain advisory/limited.
- Server-to-Script trust uses ERP_API_TOKEN. Do not publish it; browser never receives it.
- Existing sessions are stateless and do not yet enforce immediate per-user session revocation.
- On high traffic, Google Apps Script quotas and latency can be a bottleneck.
