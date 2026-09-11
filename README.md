# Project KEYSTONE — Field Service Management Platform

This GitHub repo has three branches. They are not the same checkout.

| Branch | What it contains |
| --- | --- |
| `main` | Docs only. A plain `git clone` does **not** include the app. |
| `backend` | Spring Boot API + `docs`. **This branch.** No frontend folder. |
| `frontend` | React / Vite UI at the **root** of that branch (frontend teammate). |

## Clone this branch (backend)

```powershell
git clone -b backend https://github.com/GandharMarathe/Project-KEYSTONE-Field-Service-Management-Platform.git
cd Project-KEYSTONE-Field-Service-Management-Platform
```

The UI is a separate clone:

```powershell
git clone -b frontend https://github.com/GandharMarathe/Project-KEYSTONE-Field-Service-Management-Platform.git keystone-frontend
```

## How to run the API

Start PostgreSQL first, then this backend.

### 1. PostgreSQL

`psql` is the SQL client. Start the **Windows service** first. On this machine it is PostgreSQL 18:

```powershell
Get-Service *postgres*
Start-Service postgresql-x64-18
```

The service is Automatic, so it is often already `Running`. You need database `keystone` on `127.0.0.1:5432`.

Optional client (you will be prompted for the local password; do not paste it into git):

```powershell
psql -h 127.0.0.1 -U postgres -d keystone
```

If `keystone` does not exist yet:

```powershell
psql -h 127.0.0.1 -U postgres -d postgres -c "CREATE DATABASE keystone;"
```

Local DB username/password live only in `backend/.env` (copy from `backend/.env.example`). Never commit `.env`.

### 2. Backend

```powershell
cd backend
copy .env.example .env
.\mvnw.cmd spring-boot:run
```

On macOS/Linux: `./mvnw spring-boot:run`

Wait until Spring Boot finishes starting.

- API: http://localhost:8080
- Login: `POST` http://localhost:8080/api/auth/login

Spring Boot does not load `.env` automatically. Export `SERVER_PORT`, `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, and `JWT_SECRET`, or use the local-dev defaults in `backend/src/main/resources/application.properties`.

Do not run `.\mvnw.cmd` from the repo root. The Maven wrapper is inside `backend`.

The frontend teammate’s app expects `VITE_API_BASE_URL=http://localhost:8080`. Remaining UI tweaks belong on the `frontend` branch.

## Notes

- Development log: `docs/myLogs.md`
- Project brief: `docs/Zidio_Development_Project_Keystone.pdf`
- Backend specification: `docs/Backend Specialization.md`
- Frontend specification: `docs/Frontend Specialization.md`
- System design: `docs/KEYSTONE_System_Design.pdf`
- Backend env template: `backend/.env.example`
- Backend API test payloads: `backend/*-payload.json`
