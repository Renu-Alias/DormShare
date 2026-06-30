# Backend: Database and Startup Notes

This file explains recommended settings and steps to avoid MongoDB connection failures.

Key recommendations
- Whitelist your server's public IP in MongoDB Atlas Network Access (or use a secure proxy). For quick testing, you can add `0.0.0.0/0` temporarily.
- Prefer SRV (`mongodb+srv://`) URIs when DNS SRV lookups work. Some environments (Node with certain DNS configs, corporate networks, or VPNs) block SRV lookups; in that case use the non-SRV URI.
- Do not store real credentials in source control. Use `backend/.env` locally and a secrets manager in production.
- Rotate DB credentials if they were committed or exposed.

Startup behavior implemented
- The app will try `MONGO_URI` first (SRV). If Node's DNS cannot resolve SRV, it will try `MONGO_URI_NON_SRV` (non-SRV host list built from SRV records).
- If both fail, it tries `MONGO_URI_FALLBACK` (local DB) if provided.
- The server performs exponential-backoff retries controlled by `DB_MAX_RETRIES` and `DB_RETRY_BASE_MS` before either starting in degraded mode or exiting (if `DB_FAIL_FAST=true`).
- When starting without DB, the server schedules background reconnect attempts every `DB_RECONNECT_INTERVAL_MS`.

How to run
1. Copy `backend/.env.example` to `backend/.env` and fill values.
2. Ensure Atlas IP whitelist and user credentials are correct.
3. From repository root:
```powershell
cd backend
node server.js
```

Production notes
- Set `DB_FAIL_FAST=true` in production to avoid running without DB.
- Use a secrets manager (Azure Key Vault, AWS Secrets Manager, Vault, etc.) and CI/CD to inject env vars.
- Monitor DB connection logs and set up alerts for prolonged disconnects.
