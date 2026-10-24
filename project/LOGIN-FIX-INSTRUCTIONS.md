# Login redirect repair

Cause: previously the Apps Script authentication could succeed even when ERP_SESSION_SECRET was blank; next page readSession rejected the cookie and redirected to login.

1. Back up the existing project and .env.local.
2. Extract this package, and copy your existing .env.local (do not share its secret values).
3. Add ERP_SESSION_SECRET with a unique stable random value of 32+ characters (recommended: 48 random bytes hex), distinct from ERP_API_TOKEN.
   PowerShell: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
4. Make sure GOOGLE_SCRIPT_URL and ERP_API_TOKEN point to your current Apps Script deployment and Script Properties.
5. Stop server Ctrl+C, run npm install, then npm run dev.
6. Open http://localhost:3000/login (use same hostname and port when navigating).
7. After login, open http://localhost:3000/api/erp?action=session. You should get authenticated:true.

The fix refuses login when session secret is missing, and verifies the session cookie before redirecting. It does not change Code.gs or Google Sheets. Existing passwords in screenshots should be rotated.
