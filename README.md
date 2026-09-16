# MFM frontend (KEYSTONE project)

This folder lives on **`main`** as part of the monorepo (`backend/` + `frontend/` + `docs/`).

React + TypeScript + Vite frontend for **Meridian Facilities Management** — Field Service Management Platform.
The repo/project codename remains KEYSTONE; the product UI brand is MFM.

## Run locally

1. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to the Spring Boot API URL.
2. Install dependencies with `pnpm install` (or `npm install`).
3. Start the development server with `pnpm dev` (or `npm run dev`).

## End-to-end tests

Playwright repeats the live manager → technician → close walk against `http://localhost:5173` and `http://localhost:8080`. It creates labeled test records through the UI; it does not put mock business data in `src/pages`.

1. Start PostgreSQL and the Spring Boot API on port 8080.
2. From this folder: `npx playwright install chromium` (first time).
3. `npm run test:e2e`

Override the local Flyway manager seed with `E2E_MANAGER_EMAIL` / `E2E_MANAGER_PASSWORD` if needed.

## Implementation notes

- Authentication uses `POST /api/auth/login`; the token is supplied in the API authorization header after login.
- Operational content comes from the REST API. UI-only states use the specification's explicit placeholders and never fabricated business data.
- The interface includes responsive dispatcher/manager, technician, and customer shells with role-protected routing.
- Anime.js provides page and login entrance motion; Lucide supplies accessible interface icons; TanStack Query manages API request state and caching.

The final field names and response types must be aligned with the agreed Spring Boot API contract before production deployment.
