# Abtahi's Brain Intelligence 2.0

## What's improved
- Reworked the assistant panel into a management-oriented intelligence workspace with executive, planning, and operations prompt groups.
- Displays the latest response's live ERP snapshot metrics, response timestamp, source, and an explicit partial-data status when module fetches fail.
- Keeps a bounded recent conversation history in browser memory (up to 12 turns) and supports copying answers.
- Preserves read-only behavior: the assistant does not create, edit, delete, allocate, approve, or ship ERP records.
- The `/api/brain` endpoint retains the deterministic ERP-grounded answer path and adds an optional generative layer. If the provider is missing or unavailable, the grounded response remains available.
- The optional generative layer only receives the question, aggregate operational metrics, module failure indicators, and selected answer evidence—not the entire sheet dataset.

## Optional generative AI configuration
Add these server-side environment variables locally and in Vercel if you choose to enable the generative layer:

- `OPENAI_API_KEY` — private provider API key; never use a `NEXT_PUBLIC_` prefix.
- `OPENAI_MODEL` — optional model name supported by the API account. Defaults to `gpt-4.1-mini`; override it if that model is not enabled for the account.

Without `OPENAI_API_KEY`, the assistant works in `ERP-GROUNDED MODE` using deterministic rules and source records. With the key, a selected set of evidence and operational aggregates is sent to the configured AI provider to draft an answer. Review your company's data-sharing policy before enabling this; do not send personal or confidential data unless approved. Provider charges may apply.

## Verification and limitations
- `npm test` / `node tests/backend-validation.test.cjs` passes the 14 existing backend validation/redaction assertions.
- Live Google Sheets access, AI provider credentials, production build, concurrency behavior, and end-to-end workflows were not verifiable in this environment.
- Forecasts are not claimed by this version. Predictive analytics should be added only after sufficient historical data, explicit methodology, backtesting, and human review are in place.
- The assistant is read-only. Keep source records as the system of record and verify critical decisions against them.
