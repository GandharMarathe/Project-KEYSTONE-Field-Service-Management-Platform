# Project KEYSTONE — Field Service Management Platform

Clone the `backend` branch. That branch contains backend, frontend, and docs. These files are **not** on `main` yet.

```powershell
git clone -b backend https://github.com/GandharMarathe/Project-KEYSTONE-Field-Service-Management-Platform.git
cd Project-KEYSTONE-Field-Service-Management-Platform
```

## How to turn on and run

Use two terminals. Start PostgreSQL and the backend first, then the frontend.

### 1. PostgreSQL

Make sure PostgreSQL is running and a `keystone` database exists on `127.0.0.1:5432`.

### 2. Backend (terminal 1)

```powershell
cd backend
copy .env.example .env
.\mvnw.cmd spring-boot:run
```

On macOS/Linux: `./mvnw spring-boot:run`

Wait until Spring Boot finishes starting.

- API: http://localhost:8080
- Login endpoint: `POST` http://localhost:8080/api/auth/login

Spring Boot does not load `.env` automatically. Export `SERVER_PORT`, `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, and `JWT_SECRET`, or use the local-dev defaults in `backend/src/main/resources/application.properties`.

### 3. Frontend (terminal 2)

```powershell
cd frontend
copy .env.example .env
pnpm install
pnpm dev
```

- UI: http://localhost:5173
- Login page: http://localhost:5173/login
- `VITE_API_BASE_URL` in `frontend/.env` must stay `http://localhost:8080`

Do not run `.\mvnw.cmd` from the repo root. The Maven wrapper is inside `backend`.

## Notes

- Development log, including local ports: `docs/myLogs.md`
- Project brief: `docs/Zidio_Development_Project_Keystone.pdf`
- Backend specification: `docs/Backend Specialization.md`
- Frontend specification: `docs/Frontend Specialization.md`
- System design: `docs/KEYSTONE_System_Design.pdf`
- Backend env template: `backend/.env.example`
- Frontend env template: `frontend/.env.example`
- Backend API test payloads: `backend/*-payload.json`
