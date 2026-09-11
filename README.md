# Project KEYSTONE — Field Service Management Platform

Clone the `backend` branch. That branch now contains backend, frontend, and docs.

```powershell
git clone -b backend https://github.com/GandharMarathe/Project-KEYSTONE-Field-Service-Management-Platform.git
cd Project-KEYSTONE-Field-Service-Management-Platform
```

## Backend

The Maven wrapper lives in `backend`, not the repo root.

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

API: `http://localhost:8080`

PostgreSQL must be running with a `keystone` database. `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, and `JWT_SECRET` are optional; local-dev defaults are in `backend/src/main/resources/application.properties`.

## Frontend

```powershell
cd frontend
copy .env.example .env
pnpm install
pnpm dev
```

UI: `http://localhost:5173`

## Notes

- Development log: `docs/myLogs.md`
- Backend API test payloads: `backend/*-payload.json`
