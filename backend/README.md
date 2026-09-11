# KEYSTONE backend

Spring Boot + PostgreSQL REST API for Meridian Facilities Management's field-service platform.

This folder lives on the `backend` branch. That branch is **API + `docs` only**. The React UI is on the separate `frontend` branch (app at that branch’s repo root, not in a `frontend/` folder here).

## Git clone

```powershell
git clone -b backend https://github.com/GandharMarathe/Project-KEYSTONE-Field-Service-Management-Platform.git
cd Project-KEYSTONE-Field-Service-Management-Platform\backend
```

Frontend teammate (separate clone):

```powershell
git clone -b frontend https://github.com/GandharMarathe/Project-KEYSTONE-Field-Service-Management-Platform.git
```

## Run locally

Start PostgreSQL, then this API.

- Ensure PostgreSQL is running on `127.0.0.1:5432` with a `keystone` database.
- Copy `.env.example` to `.env` for the local variable names. Spring Boot does not load `.env` automatically; export `SERVER_PORT`, `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, and `JWT_SECRET`, or rely on the local-dev defaults in `src/main/resources/application.properties`.
- Start the API with `.\mvnw.cmd spring-boot:run` (Windows) or `./mvnw spring-boot:run` (macOS/Linux). Flyway applies schema migrations automatically on startup.
- Backend: http://localhost:8080
- API login: `POST` http://localhost:8080/api/auth/login

The frontend app is not in this branch. Point the UI’s `VITE_API_BASE_URL` at http://localhost:8080.

## Project documents

Specifications live in `docs`, not in this folder.

- Project brief: `../docs/Zidio_Development_Project_Keystone.pdf`
- Backend specification: `../docs/Backend Specialization.md`
- Development log: `../docs/myLogs.md`

## Implementation notes

- Authentication is custom JWT, not Spring's default `UserDetailsService`. `POST /api/auth/login` verifies credentials against the DB with BCrypt and returns a signed token, which subsequent requests supply via `Authorization: Bearer <token>`.
- Role-based access control `(MANAGER, DISPATCHER, TECHNICIAN, CUSTOMER)` is enforced per-endpoint in SecurityConfig; write operations are generally restricted to MANAGER/DISPATCHER, with TECHNICIAN additionally permitted to update the status of work orders assigned specifically to them.
- Domain entities (Customer, Site, Work Order, Part, Part Usage, Time Log, Status History) are related via standard JPA `@ManyToOne` associations, eagerly fetched to avoid lazy-initialization failures under `open-in-view=false`.
- `DELETE` endpoints check for dependent records before deleting and return `409 Conflict` rather than surfacing a raw foreign-key violation.
- Schema is version-controlled via Flyway migrations under `src/main/resources/db/migration`; `spring.jpa.hibernate.ddl-auto=validate` means Hibernate never generates schema itself.

Response field names and DTO shapes should be confirmed against the frontend's expectations before integration — several endpoints (Customer, Site, Work Order) currently return JPA entities directly rather than dedicated response DTOs.
