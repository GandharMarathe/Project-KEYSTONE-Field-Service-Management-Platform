# KEYSTONE frontend

React + TypeScript + Vite frontend for Meridian Facilities Management's field-service platform.

## Run locally

1. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to the Spring Boot API URL.
2. Install dependencies with `pnpm install` (or `npm install`).
3. Start the development server with `pnpm dev` (or `npm run dev`).

Frontend: http://localhost:5173
Backend API: http://localhost:8080

## Project documents

Specifications live in `docs`, not in this folder.

- Project brief: `../docs/Zidio_Development_Project_Keystone.pdf`
- Frontend specification: `../docs/Frontend Specialization.md`
- Backend specification: `../docs/Backend Specialization.md`
- Development log: `../docs/myLogs.md`

## Implementation notes

- Authentication uses `POST /api/auth/login`; the token is supplied in the API authorization header after login.
- Operational content comes from the REST API. UI-only states use the specification's explicit placeholders and never fabricated business data.
- The interface includes responsive dispatcher/manager, technician, and customer shells with role-protected routing.
- Anime.js provides page and login entrance motion; Lucide supplies accessible interface icons; TanStack Query manages API request state and caching.

The final field names and response types must be aligned with the agreed Spring Boot API contract before production deployment.
