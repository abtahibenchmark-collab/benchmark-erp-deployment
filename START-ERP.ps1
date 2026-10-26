$ErrorActionPreference = "Stop"
Write-Host "Benchmark RMG ERP v9.0" -ForegroundColor Cyan
if (-not (Test-Path ".\package.json")) {
  Write-Host "ERROR: package.json is not in this folder." -ForegroundColor Red
  Write-Host "Open PowerShell inside the extracted Benchmark-RMG-ERP-Control-Tower-v9.0-LIVE-GOOGLE-SHEETS-ERP folder." -ForegroundColor Yellow
  exit 1
}
if (-not (Test-Path ".\.env.local")) {
  Copy-Item ".\.env.local.example" ".\.env.local"
  Write-Host "Created .env.local. Add your GOOGLE_SCRIPT_URL to enable live Google Sheets." -ForegroundColor Yellow
}
npm install
npm run dev
