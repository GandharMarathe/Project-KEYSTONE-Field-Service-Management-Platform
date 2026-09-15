# Project KEYSTONE — Field Service Management Platform

Development repository for **Project KEYSTONE**, a field service management platform for **Meridian Facilities Management (MFM)**.

The product UI brand is **MFM**. **KEYSTONE** remains the project / repository codename.

## Three-branch layout (important)

These branches are **not** the same checkout. Do not merge app code into `main`.

| Branch | What it contains | Clone |
| --- | --- | --- |
| `main` | **Docs only** (this branch). A plain `git clone` does **not** include the app. | default |
| `backend` | Spring Boot API + `docs`. No `frontend/` folder. | `git clone -b backend …` |
| `frontend` | React / Vite UI at the **root** of that branch. | `git clone -b frontend … keystone-frontend` |

```powershell
# Docs (this branch)
git clone https://github.com/GandharMarathe/Project-KEYSTONE-Field-Service-Management-Platform.git

# API
git clone -b backend https://github.com/GandharMarathe/Project-KEYSTONE-Field-Service-Management-Platform.git keystone-backend

# UI
git clone -b frontend https://github.com/GandharMarathe/Project-KEYSTONE-Field-Service-Management-Platform.git keystone-frontend
```

## Product scope

Responsive, role-based field service management for dispatchers, technicians, managers, and customers:

- Work order management, assignment, status workflow, priorities, SLA
- Technician execution (time logs, parts usage)
- Customer and site management
- Parts catalog / inventory usage
- Reports and operational summaries
- Append-only status history / audit trail

### Portals

1. **Manager / Dispatcher** — operations dashboard
2. **Technician** — field “My Jobs” app
3. **Customer** — self-service request portal

## Suggested technology stack

- Frontend: React + TypeScript + Vite
- Backend: Spring Boot / Java 21+
- Database: PostgreSQL + Flyway
- Auth: Spring Security + JWT
- ORM: Spring Data JPA / Hibernate

## Project documents (`docs/`)

- Development log: `docs/myLogs.md`
- Backend specialization: `docs/Backend Specialization.md`
- Frontend specialization: `docs/Frontend Specialization.md`
- System design: `docs/KEYSTONE_System_Design.pdf`
- Project brief: `docs/Zidio_Development_Project_Keystone.pdf`

## Implementation status

- Backend API: core complete and tested locally
- Frontend (`frontend` branch): Units 0–11 complete against live API; Playwright lifecycle e2e green
- UI brand: MFM / Meridian Facilities Management
- Deploy: not configured yet (local `localhost:5173` ↔ `localhost:8080` is the supported path)

## Merge / push rules (keep this clean)

- Push **`frontend`** for UI commits only
- Push **`backend`** for API + shared docs log
- Push **`main`** for docs / README only — **do not** merge `backend` or `frontend` into `main` (that dumps the whole app onto the docs branch and creates large conflicts)
- Never commit `.env`, `target/`, `node_modules/`, or a nested `frontend/` folder on `backend`

## Reference

System Design Architecture: https://wasp-hall-12061834.figma.site/
