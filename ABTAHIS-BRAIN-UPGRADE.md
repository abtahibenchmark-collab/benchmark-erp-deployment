# Abtahi’s Brain upgrade (integration build)

## Included
- Original ERP v9.2.0 frontend and modules retained.
- Latest user-provided Google Apps Script Code.gs replaces old bundled Code.gs; preserves original spreadsheet structure and includes planning approvals.
- New dashboard-wide, Planning-wide read-only **Abtahi’s Brain** assistant accessible from floating button.
- New `/api/brain` endpoint builds summaries from current authorized Google Sheets records through existing `/api/erp` session validation. No simulated ERP figures, no paid LLM API required.
- Session signing now requires independent `ERP_SESSION_SECRET`, rather than using the API token as a fallback.

## IMPORTANT limitations
This is a grounded deterministic operational analyst, not a generative LLM. It answers supported ERP questions and can suggest the factual areas needing attention; it **does not invent predictions**, autonomously modify records, or understand unlimited arbitrary prompts. A true LLM integration would need model provider credentials, cost/security controls and careful read-only function calling. There is no verified live Google Sheets connection or production build in this package.

## Deploy safely
1. Back up the spreadsheet and current Apps Script project; test on a COPY first.
2. In Apps Script Script Properties set `ERP_BOOTSTRAP_ADMIN_PASSWORD` (14+ chars) only if no admin exists; set `ERP_API_TOKEN` or run setup to generate it.
3. Replace Apps Script code with `google-apps-script/Code.gs`, run `setupBenchmarkERP()` on your backup, authorize, and deploy a NEW Web App version, Execute as: Me, appropriate access for the server integration.
4. Set Next.js server variables `GOOGLE_SCRIPT_URL` to your deployed `/exec`, `ERP_API_TOKEN` to the matching secret, `ERP_SESSION_SECRET` to independently generated random 64+ character secret. Never set them as `NEXT_PUBLIC_*`.
5. Install dependencies using `npm install`, start with `npm run dev`, log in, test `/api/erp?action=health` then every CRUD module, PIN and approval flows. Visit dashboard or Planning, open Brain, and ask an operational question.
6. Before real production launch, complete permission hardening, concurrency/load tests, backups and session revocation. Role enforcement in Apps Script still needs review across **all** CRUD actions; session cookie includes username and role but is not immediately revoked by disabling the sheet account.

## Deployment limitation
`/api/brain` currently retrieves 8 modules sequentially via internal HTTP requests. For high volume, optimize with a single server-side batch snapshot endpoint or parallel requests, rate limits and caching. Apps Script quotas and latency apply.
