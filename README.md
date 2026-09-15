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

## How to start and run the app (start → finish)

You need **three things running**: PostgreSQL (database), the backend API, and the frontend website. Use **two terminal windows** after the database is up.

### Step 0 — Get the code

```powershell
git clone https://github.com/GandharMarathe/Project-KEYSTONE-Field-Service-Management-Platform.git
cd Project-KEYSTONE-Field-Service-Management-Platform
```

(Use branch `main`. That folder already has `backend/`, `frontend/`, and `docs/`.)

### Step 1 — Start PostgreSQL and create the database

1. Start the PostgreSQL service on your machine.
2. Make sure a database named **`keystone`** exists on `127.0.0.1:5432`.

If it does not exist yet:

```powershell
psql -h 127.0.0.1 -U postgres -d postgres -c "CREATE DATABASE keystone;"
```

### Step 2 — Start the backend (API)

Open a terminal in the project root:

```powershell
cd backend
copy .env.example .env
.\mvnw.cmd spring-boot:run
```

On Linux/macOS:

```bash
cd backend
cp .env.example .env
./mvnw spring-boot:run
```

Wait until it finishes starting. Leave this terminal open.

- API is at: http://localhost:8080  
- Tables are created automatically by Flyway on first start.

**Seed manager login (local only):**  
email `admin@keystone.dev` — password from the Flyway seed / team notes (`Keystone@2026Admin!` in local seed).

### Step 3 — Start the frontend (website)

Open a **second** terminal in the project root:

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

On Linux/macOS use `cp .env.example .env` instead of `copy`.

Leave this terminal open.

- Website is at: **http://localhost:5173**  
- Open that URL in the browser (use `localhost`, not `127.0.0.1`, so CORS works).

### Step 4 — Use the app

1. Go to http://localhost:5173  
2. Sign in with the manager account above (or another user you create in the UI).  
3. You should land on the dashboard and can create customers, sites, work orders, etc.

| Role | Where you land |
| --- | --- |
| Manager / Dispatcher | Dashboard / work orders |
| Technician | My Jobs |
| Customer | Customer portal |

### Step 5 — Stop everything

- Frontend: `Ctrl+C` in the frontend terminal  
- Backend: `Ctrl+C` in the backend terminal  
- PostgreSQL: leave running, or stop the Windows/Linux service if you want

### If something fails

| Problem | Check |
| --- | --- |
| Backend will not start | Is PostgreSQL running? Does DB `keystone` exist? |
| Login / API errors in the browser | Is backend still on :8080? Is `frontend/.env` using `VITE_API_BASE_URL=http://localhost:8080`? |
| Blank CORS / blocked requests | Use **http://localhost:5173**, not http://127.0.0.1:5173 |
| `npm` errors | Run `npm install` again inside `frontend/` |

### Optional — Playwright e2e test

With PostgreSQL + backend already running:

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
