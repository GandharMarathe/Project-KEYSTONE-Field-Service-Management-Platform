# Project KEYSTONE — Field Service Management Platform

Monorepo for **Project KEYSTONE**, a field service management platform for **Meridian Facilities Management (MFM)**.

- **UI brand:** MFM / Meridian Facilities Management  
- **Project codename:** KEYSTONE  

## One clone = full codebase

```powershell
git clone https://github.com/GandharMarathe/Project-KEYSTONE-Field-Service-Management-Platform.git
cd Project-KEYSTONE-Field-Service-Management-Platform
```

```text
/
  backend/     Spring Boot API
  frontend/    React + TypeScript + Vite (MFM UI)
  docs/        Specs, myLogs, PDFs
  README.md    This file
```

The historical `backend` and `frontend` **branches** may still exist for older clones; **`main` is now the supported full-stack tree.**

## Run locally

### 1. PostgreSQL

Create database `keystone` on `127.0.0.1:5432`. Credentials: copy `backend/.env.example` → `backend/.env` (never commit `.env`).

### 2. API

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Linux/macOS: `./mvnw spring-boot:run`  
API: http://localhost:8080

### 3. UI

```powershell
cd frontend
copy .env.example .env
# VITE_API_BASE_URL=http://localhost:8080
npm install
npm run dev
```

UI: http://localhost:5173 (CORS allowlist is localhost:5173)

### E2E

With API already on `:8080`:

```powershell
cd frontend
npx playwright install chromium
npm run test:e2e
```

## Portals

1. Manager / Dispatcher — operations dashboard  
2. Technician — field My Jobs  
3. Customer — self-service portal  

## Documents

- `docs/myLogs.md` — development log  
- `docs/Backend Specialization.md`  
- `docs/Frontend Specialization.md`  
- `docs/KEYSTONE_System_Design.pdf`  

## Branch notes

| Branch | Role now |
| --- | --- |
| `main` | **Supported monorepo** (backend + frontend + docs) |
| `backend` | Legacy API-only branch (optional; prefer `main`) |
| `frontend` | Legacy UI-only branch (optional; prefer `main`) |

Do not put secrets in git. Production still needs real CORS origins, JWT secret, and DB credentials.
