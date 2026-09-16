# Project KEYSTONE — Field Service Management Platform

## Backend Development Logs

### Start Date: 30/08/2026

### End Date: 11/09/2026

### System Design Reference: https://wasp-hall-12061834.figma.site/

### Status: Backend core complete. UI lives on the `frontend` branch, not this one.

### Next: Frontend teammate tweaks on `frontend`. Do not put a `frontend/` folder on `backend`.

---

**Project:** Zidio Development Project — KEYSTONE
**Product:** Field Service Management Platform
**Organization:** Meridian Facilities Management

### Repository

* **Repository:** `Project-KEYSTONE-Field-Service-Management-Platform`
* **Workspace Path:** `C:\Users\gamer\Desktop\ZidioDevelopment_Workspace\Project-KEYSTONE-Field-Service-Management-Platform`
* **Backend Path:** `...\backend`
* **Git Remote:** `https://github.com/GandharMarathe/Project-KEYSTONE-Field-Service-Management-Platform`
* **Developer Git Identity:** `s0a1m0x01`

Same GitHub repo, three different branches:

| Branch | Clone | Contents |
| --- | --- | --- |
| `main` | `git clone` (default) | Docs only. **Not** the app. |
| `backend` | `git clone -b backend ...` | Spring Boot API + `docs`. **This log / this branch.** No `frontend/` folder. |
| `frontend` | `git clone -b frontend ...` | React / Vite UI at that branch’s **repo root** (frontend teammate). |

`backend` is not merged into `main` yet.

### How to turn on and run (this branch)

```powershell
git clone -b backend https://github.com/GandharMarathe/Project-KEYSTONE-Field-Service-Management-Platform.git
cd Project-KEYSTONE-Field-Service-Management-Platform
```

1. Start PostgreSQL. `psql` is the SQL client; the server is the Windows service.

```powershell
Get-Service *postgres*
Start-Service postgresql-x64-18
```

This machine uses PostgreSQL 18 (`postgresql-x64-18`). The service is Automatic, so it is often already `Running`. Need database `keystone` on `127.0.0.1:5432`.

Optional client (password prompt; do not commit the password):

```powershell
psql -h 127.0.0.1 -U postgres -d keystone
```

If `keystone` is missing:

```powershell
psql -h 127.0.0.1 -U postgres -d postgres -c "CREATE DATABASE keystone;"
```

Local credentials: `backend/.env` copied from `backend/.env.example`. Never commit `.env`.

2. Start the API:

```powershell
cd backend
copy .env.example .env
.\mvnw.cmd spring-boot:run
```

| Service | Port | Local URL |
| --- | --- | --- |
| Backend API | `8080` | http://localhost:8080 |
| API login | `8080` | `POST` http://localhost:8080/api/auth/login |
| PostgreSQL | `5432` | `127.0.0.1:5432` / database `keystone` |

`.\mvnw.cmd` must be run from `backend`, not the repo root.

The UI is **not** in this checkout. Clone `-b frontend` separately. That app should use `VITE_API_BASE_URL=http://localhost:8080`. Remaining UI tweaks belong on `frontend`.

### Project documents

Keep specifications in `docs` only.

* Project brief: `docs/Zidio_Development_Project_Keystone.pdf`
* Backend specification: `docs/Backend Specialization.md`
* Frontend specification: `docs/Frontend Specialization.md`
* System design: `docs/KEYSTONE_System_Design.pdf`
* Development log: `docs/myLogs.md`

---

# System Architecture

### Architecture Style

* [x] Layered Monolithic Backend
* [x] RESTful API architecture
* [x] Domain/entity-driven relational design
* [x] Controller → Service → Repository separation
* [x] DTO usage for authentication/user-facing request/response flows
* [x] JPA/Hibernate persistence
* [x] Flyway database migrations
* [x] Spring Security + custom JWT authentication
* [x] PostgreSQL relational database
* [x] BCrypt password hashing
* [x] Role-based authorization
* [x] Environment-based configuration
* [x] Centralized HTTP/security behavior through Spring Security
* [x] Backend designed to integrate with separate React frontend

### Runtime Stack

* **Language:** Java
* **Java Runtime:** Java 25.0.4
* **Framework:** Spring Boot 4.0.0
* **Web Server:** Tomcat 11.0.14
* **Database:** PostgreSQL 18.6
* **ORM:** JPA / Hibernate
* **Migration:** Flyway
* **Security:** Spring Security
* **Authentication:** Custom JWT
* **Password Security:** BCrypt
* **API Style:** REST
* **Build Tool:** Maven Wrapper
* **Testing/Verification:** PowerShell + `curl.exe` + PostgreSQL `psql`
* **Source Control:** Git / GitHub

---

# Core Domain Model

The backend implements the core Field Service Management domain around:

* [x] Users
* [x] Roles
* [x] Customers
* [x] Sites
* [x] Work Orders
* [x] Work Order Status History
* [x] Parts
* [x] Part Usage
* [x] Time Logs
* [x] Reports

### Main Relationships

* Customer → Site
* Customer → Work Order
* Site → Work Order
* Work Order → Assigned Technician/User
* Work Order → Status History
* Work Order → Part Usage
* Work Order → Time Logs
* User → Status History (`changedBy`)
* Part → Part Usage

---

# Roles Implemented

* [x] CUSTOMER
* [x] TECHNICIAN
* [x] DISPATCHER
* [x] MANAGER

### Work Order Lifecycle

```text
NEW
 ↓
ASSIGNED
 ↓
IN_PROGRESS
 ↓
ON_HOLD
 ↓
COMPLETED
 ↓
CLOSED
```

Additional terminal state:

```text
CANCELLED
```

---

# Day 1 — Backend Foundation & Repository Analysis

### Phase 0 — Project & Architecture Understanding

* [x] Reviewed KEYSTONE project requirements
* [x] Established backend repository boundary
* [x] Confirmed layered monolithic architecture
* [x] Reviewed domain responsibilities
* [x] Reviewed role-based access requirements
* [x] Reviewed work-order lifecycle
* [x] Reviewed database relationships
* [x] Reviewed security requirements
* [x] Avoided unnecessary architecture redesign
* [x] Kept backend work within existing project scope

### Phase 1 — Backend Structure

* [x] Inspected backend package structure
* [x] Inspected controllers
* [x] Inspected services
* [x] Inspected repositories
* [x] Inspected entities
* [x] Inspected DTOs
* [x] Inspected security configuration
* [x] Inspected Flyway migrations
* [x] Inspected application configuration
* [x] Verified existing implementation before modifying files

---

# Day 2 — Authentication & Security

### JWT Authentication

* [x] Implemented/verified login endpoint
* [x] Verified `POST /api/auth/login`
* [x] Verified JWT token generation
* [x] Verified JWT request authentication
* [x] Verified `JwtAuthenticationFilter`
* [x] Verified authenticated request handling
* [x] Verified protected API behavior
* [x] Verified BCrypt password matching

### Important Security Finding

* [x] Investigated Spring Boot `"Using generated security password"` message
* [x] Confirmed it was unused Spring Security auto-configuration noise
* [x] Confirmed application authentication is custom
* [x] Confirmed authentication does not rely on `UserDetailsService`
* [x] Confirmed `AuthService.login()` manually validates users/passwords
* [x] Confirmed JWT filter manually builds authenticated security context

---

# Day 3 — Database Bootstrap & Flyway

### Initial Authentication Bootstrap Problem

Identified a chicken-and-egg authentication problem:

* `/api/users/**` required authentication
* No initial usable user existed
* Therefore login could not happen
* Without login, user creation could not happen
* Therefore the application had no clean initial authentication path

### Fix — Flyway V2

* [x] Added initial manager seed migration
* [x] Created `V2__seed_initial_manager.sql`
* [x] Seeded MANAGER account
* [x] Used BCrypt password hash
* [x] Restarted backend
* [x] Verified Flyway migration
* [x] Verified schema reached version 2

### V2 Seed Issue

* [x] Detected incorrect email:

  * `admin@ekeystone.dev`
* [x] Expected email:

  * `admin@keystone.dev`
* [x] Queried PostgreSQL directly
* [x] Confirmed password hash was correct
* [x] Confirmed role was correct
* [x] Confirmed account was enabled
* [x] Identified email typo as login failure cause

### Fix — Flyway V3

* [x] Added `V3__fix_admin_email_typo.sql`
* [x] Corrected seeded manager email
* [x] Restarted backend
* [x] Verified Flyway version 3
* [x] Successfully restored login functionality

---

# Day 4 — Authentication Endpoint Verification

### Login

* [x] Created temporary `login-payload.json`
* [x] Used `curl.exe` to avoid PowerShell JSON escaping issues
* [x] Successfully obtained JWT
* [x] Stored token in PowerShell variable
* [x] Tested authenticated requests

### Protected Endpoints

* [x] `GET /api/customers`
* [x] `GET /api/work-orders`

Verified:

```text
HTTP 200
[]
```

when no records existed.

### 403 Investigation

* [x] Investigated initial `403` responses
* [x] Confirmed they were not endpoint bugs
* [x] Confirmed login failure resulted in an empty `$token`
* [x] Confirmed request effectively contained:
  `Authorization: Bearer`
* [x] Confirmed JWT filter therefore did not authenticate the request

---

# Day 5 — User/Auth DTO Bug Fix

### LoginResponse Bug

Identified a real Java logic bug:

```java
setRole(String Role)
```

had an incorrectly capitalized parameter and self-assignment behavior.

### Fix

* [x] Corrected setter parameter handling
* [x] Ensured supplied role is actually assigned to the response field
* [x] Verified authentication response behavior

---

# Day 6 — Customer & Site API Testing

### Customer API

* [x] POST customer
* [x] GET customer by ID
* [x] GET all customers
* [x] Customer name search
* [x] PUT customer
* [x] Validation behavior checked
* [x] Authentication behavior checked

### Site API

* [x] Site creation
* [x] Site retrieval
* [x] Site update
* [x] Customer/site relationship verification
* [x] Entity behavior inspected

### Entity Compatibility Fixes

* [x] Added required `setId()` methods where necessary for request/entity handling
* [x] Reviewed JSON serialization behavior
* [x] Verified nested entity responses

---

# Day 7 — Work Order Implementation & Testing

### Work Order API

* [x] Create Work Order
* [x] Get Work Order
* [x] List Work Orders
* [x] Update Work Order
* [x] Assign technician
* [x] Update status
* [x] Customer relationship
* [x] Site relationship
* [x] Priority
* [x] SLA fields
* [x] Work-order code
* [x] Timestamp fields

### Verified Example

Created:

```text
WO-1001
```

with:

* Customer: Acme Facilities Corp
* Site: Acme Main Warehouse
* Technician: Sam Rivera
* Priority: HIGH
* Status: ASSIGNED

### Endpoint Verification

* [x] `POST /api/work-orders` → `201`
* [x] `GET /api/work-orders` → `200`
* [x] `GET /api/work-orders/1` → `200`
* [x] `GET /api/work-orders/2` → `404` correctly because ID 2 did not exist
* [x] PUT assignment/status → `200`

---

# Day 8 — Work Order Serialization & Security Fix

### Critical Security Bug

Discovered that raw `User` entities nested inside:

* `WorkOrder.assignedTo`
* `WorkOrderStatusHistory.changedBy`

were exposing:

```text
passwordHash
```

in JSON responses.

### Fix

Modified:

```text
domain/entity/User.java
```

to apply:

```java
@JsonIgnore
```

to `passwordHash`.

### Result

* [x] BCrypt hashes no longer exposed through API responses
* [x] Login unaffected
* [x] User creation unaffected
* [x] Java service-layer password handling unaffected
* [x] Nested User responses sanitized

Verified through:

```text
GET /api/work-orders/1
```

where `assignedTo` no longer contained `passwordHash`.

---

# Day 9 — Work Order Status History

### Status History API

* [x] Create history record
* [x] Retrieve history by ID
* [x] Retrieve history by work order
* [x] Automatically identify authenticated user
* [x] Resolve `changedBy` from authenticated user's email
* [x] Resolve Work Order from request ID
* [x] Persist status transition
* [x] Return authenticated manager as `changedBy`

### Incorrect Status History Logic

Detected:

```text
ASSIGNED → ASSIGNED
```

being generated.

### Root Cause

The controller attempted to infer `fromStatus` from the Work Order's current status.

But the Work Order had already been updated to:

```text
ASSIGNED
```

before the history request was made.

Therefore the controller could no longer know that the previous status had been:

```text
NEW
```

### Fix

* [x] Removed automatic `fromStatus` guessing
* [x] Required callers to explicitly provide transition values
* [x] Prevented silently incorrect audit history
* [x] Verified correct:

```text
NEW → ASSIGNED
```

### Verification

Successfully created:

```text
fromStatus: NEW
toStatus: ASSIGNED
note: Assigned to Sam Rivera
```

with:

```text
changedBy: System Admin
```

---

# Day 10 — Work Order / Entity Fetching Adjustments

### Relationship Fetching

Adjusted entity relationships where necessary for current API serialization/testing:

* [x] WorkOrder → Customer
* [x] WorkOrder → Site
* [x] WorkOrder → assigned User
* [x] WorkOrderStatusHistory → WorkOrder
* [x] WorkOrderStatusHistory → changedBy User

### EAGER Fetch Adjustments

Applied where needed to ensure nested API response data was available during current implementation/testing.

### Entity Setter Compatibility

Added required setters for:

* [x] `User.id`
* [x] `Site.id`
* [x] `WorkOrder.id`

---

# Day 11 — Parts API & Duplicate Constraint Handling

### Parts API

* [x] Part creation
* [x] Part retrieval
* [x] Part update
* [x] Part listing
* [x] Part number validation
* [x] Duplicate part-number testing

### Bug Found

Duplicate `partNumber` creation resulted in an uncontrolled database failure / `500`.

Existing repository method:

```text
existsByPartNumber(...)
```

was available but unused.

### Fix

Added application-level duplicate checking.

### Create Flow

Before saving:

```text
existsByPartNumber(partNumber)
```

If duplicate:

```text
409 CONFLICT
```

### Update Flow

* [x] Compare existing part number with incoming part number
* [x] Only check duplicate existence when the number actually changes
* [x] Prevent false-positive conflict when updating the same part
* [x] Return `409 CONFLICT` when attempting to steal another part's number
* [x] Allow legitimate updates with unchanged part number

### Implementation Layers

* `PartRepository`
* `PartService`
* `PartController`

---

# Day 12 — Part Patch Build Failure & Correction

### Build Issue

During duplicate part-number patching:

* [x] Duplicate `existsByPartNumber()` method was accidentally introduced into `PartService`
* [x] Maven compilation failed
* [x] Backend restart therefore did not succeed
* [x] Tests were initially hitting the previously running application

### Diagnosis

* [x] Confirmed build had not succeeded
* [x] Inspected actual `PartService.java`
* [x] Found pre-existing `existsByPartNumber()` method
* [x] Removed duplicate method
* [x] Preserved existing implementation
* [x] Confirmed `PartController` patch was correct
* [x] Restarted backend
* [x] Re-tested after successful compilation

### Important Development Lesson

* [x] Never assume a patch is active until Maven successfully rebuilds and Spring Boot restarts
* [x] Verify `BUILD SUCCESS`
* [x] Verify `Started KeystoneBackendApplication`

---

# Day 13 — Git / Repository Hygiene

### Git Verification

* [x] Reviewed `git status`
* [x] Reviewed `git diff`
* [x] Checked modified files
* [x] Checked untracked test payload files
* [x] Reviewed backend `.gitignore`

### Temporary Test Payloads

Used temporary files including:

```text
login-payload.json
history-payload2.json
part-payload.json
part2-payload.json
part2-conflict-payload.json
part2-legit-update-payload.json
```

### Security/Hygiene

* [x] Added payload patterns to `.gitignore`
* [x] Prevented temporary login/test payloads from entering source control
* [x] Identified root `.gitignore` as a separate shared-repository concern
* [x] Did not modify the unrelated root `.gitignore`
* [x] Identified line-ending-only `.gitignore` difference as harmless

---

# Git Commits / Synchronization

### Completed Repository Synchronization

* [x] Backend changes committed
* [x] Backend changes pushed to GitHub
* [x] Verified branch synchronization
* [x] Verified working tree during completed commit phases

### Known Commits

* `98bb5ed` — authentication/bootstrap/security-related backend fixes
* `308dc83` — Customer/Site-related fix batch

---

# Major Bugs / Fixes Summary

### Authentication

* [x] No initial authentication bootstrap path
* [x] Added V2 manager seed migration
* [x] Fixed V2 admin email typo using V3 migration
* [x] Verified JWT login

### Authorization

* [x] Verified protected endpoint behavior
* [x] Verified unauthenticated requests return protected responses
* [x] Identified future need to tighten `/api/users/**` authorization to MANAGER-only

### Login Response

* [x] Fixed `setRole()` self-assignment bug

### Security

* [x] Prevented `passwordHash` JSON leakage
* [x] Added `@JsonIgnore` to User password hash

### Work Order History

* [x] Removed incorrect automatic `fromStatus` inference
* [x] Explicit status transition values now used

### Parts

* [x] Added duplicate part-number conflict handling
* [x] Prevented database-level duplicate failure from surfacing as generic `500`
* [x] Added update-specific duplicate checking
* [x] Fixed accidental duplicate service method introduced during patching

### Testing

* [x] Distinguished genuine application bugs from test/setup mistakes
* [x] Distinguished missing IDs from endpoint failures
* [x] Distinguished empty JWT from authorization configuration problems
* [x] Distinguished failed builds from runtime application behavior

---

# Current API/Controller Inventory

```text
AuthController
CustomerController
PartController
PartUsageController
ReportController
SiteController
TimeLogController
UserController
WorkOrderController
WorkOrderStatusHistoryController
```

### Current DTO Inventory

```text
dto/
├── CreateUserRequest.java
├── UserResponse.java
└── auth/
    ├── LoginRequest.java
    └── LoginResponse.java
```

---

# Current Backend Completion Status

## Completed

* [x] Project architecture established
* [x] Spring Boot backend operational
* [x] PostgreSQL connected
* [x] Flyway operational
* [x] Database schema operational
* [x] Initial manager bootstrap
* [x] JWT authentication
* [x] BCrypt password handling
* [x] Role-based security
* [x] Customer API
* [x] Site API
* [x] User API
* [x] Work Order API
* [x] Work Order Status History API
* [x] Parts API
* [x] Part Usage API
* [x] Time Log API implementation
* [x] Report API implementation
* [x] API integration testing started
* [x] Write-flow testing started
* [x] Serialization/security testing
* [x] Database integrity testing
* [x] Duplicate-data testing
* [x] Error-response testing
* [x] Git synchronization
* [x] Major discovered bugs fixed

---

# Remaining Backend Objectives Before Frontend

## Final API Verification

* [x] Finish TimeLog endpoint testing
* [x] Verify no-parameter TimeLog behavior
* [x] Verify TimeLog filtering
* [x] Verify PartUsage write/read flows
* [x] Verify User creation/update behavior
* [x] Verify Report endpoints
* [x] Verify authorization behavior per role
* [x] Verify invalid IDs return correct `404`
* [x] Verify validation failures return correct `400`
* [x] Verify duplicate resources return appropriate `409`
* [x] Verify protected endpoints return appropriate `401/403`
* [x] Verify no sensitive fields appear in API JSON
* [x] Verify Work Order lifecycle behavior
* [x] Verify assignment behavior
* [x] Verify status transitions
* [x] Verify audit/history behavior

---

# Final Backend Smoke Test

Before frontend integration:

* [x] Stop and cleanly restart backend
* [x] Confirm Maven `BUILD SUCCESS`
* [x] Confirm `Started KeystoneBackendApplication`
* [x] Confirm PostgreSQL connection
* [x] Confirm Flyway current schema version
* [x] Login successfully
* [x] Obtain JWT
* [x] Test representative GET endpoints
* [x] Test representative POST endpoints
* [x] Test representative PUT endpoints
* [x] Test protected endpoints
* [x] Test role restrictions
* [x] Test error cases
* [x] Check logs for unexpected exceptions
* [x] Check Git working tree
* [x] Commit final backend changes
* [x] Push final backend branch
* [x] Confirm backend branch is synchronized with remote

---

# Backend → Frontend Integration Transition

The React UI is maintained on the `frontend` branch. Do not add it back under `frontend/` on `backend`.

Once the final backend smoke test is clean:

### Backend Handoff

* [x] Freeze backend architecture
* [x] Avoid unnecessary backend redesign during frontend phase
* [x] Record final API endpoints
* [x] Record authentication flow
* [x] Record JWT header requirements
* [x] Record request/response payload structures
* [x] Record role permissions
* [x] Record important status transitions
* [x] Record known test data
* [x] Record database startup requirements

### Frontend Integration

Next major phase:

```text
React + TypeScript + Vite
            ↓
      API Integration
            ↓
      JWT Authentication
            ↓
       Role-based UI
            ↓
       CRUD Screens
            ↓
      Work Order UI
            ↓
       Parts / Time Logs
            ↓
        Reports
            ↓
       Full-stack Run
```

### Frontend Integration Objectives

* [x] Connect frontend authentication to `/api/auth/login`
* [x] Store/use JWT appropriately
* [x] Add authenticated API requests
* [x] Connect Customer screens
* [x] Connect Site screens
* [x] Connect User/role functionality
* [x] Connect Work Order screens
* [x] Connect assignment/status workflow
* [x] Connect Work Order history
* [x] Connect Parts
* [x] Connect Part Usage
* [x] Connect Time Logs
* [x] Connect Reports
* [x] Implement role-specific UI behavior
* [x] Verify backend/frontend payload compatibility

---

# Final Full-Stack Validation

After frontend integration:

* [x] Start PostgreSQL
* [x] Start Spring Boot backend
* [x] Start React/Vite frontend
* [x] Verify frontend → backend connectivity
* [x] Verify CORS/configuration if required
* [x] Verify login from UI
* [x] Verify JWT-authenticated API calls
* [x] Verify CRUD from UI
* [x] Verify role-based behavior
* [x] Verify Work Order lifecycle
* [x] Verify Parts/Usage
* [x] Verify Time Logs
* [x] Verify Reports
* [x] Verify error handling
* [x] Debug integration-specific issues
* [x] Perform final end-to-end smoke test
* [x] Document final system state

---

# Final Project Completion Target

```text
KEYSTONE
│
├── Backend
│   ├── Spring Boot
│   ├── Java
│   ├── PostgreSQL
│   ├── Flyway
│   ├── JPA/Hibernate
│   ├── Spring Security
│   ├── JWT
│   ├── BCrypt
│   └── REST APIs
│
├── Frontend
│   ├── React
│   ├── TypeScript
│   └── Vite
│
└── Full-Stack Integration
    ├── Authentication
    ├── Authorization
    ├── CRUD
    ├── Work Orders
    ├── Status Workflow
    ├── Audit History
    ├── Parts
    ├── Time Logs
    ├── Reports
    └── End-to-End Testing
```

## Overall Status

**Backend:** 🟢 Core implementation complete
**Database:** 🟢 Operational
**Authentication:** 🟢 Operational
**JWT:** 🟢 Operational
**Security:** 🟢 Major discovered issues fixed
**Core APIs:** 🟢 Implemented and actively tested
**Git model:** 🟢 **`main` is now a monorepo** (`backend/` + `frontend/` + `docs/`) — one clone gets the full codebase
**Legacy branches:** `backend` / `frontend` may still exist for older clones; prefer `main`
**Frontend:** 🟢 Units 0–11 on `frontend/` in monorepo (live API + Playwright lifecycle)
**UI brand:** 🟢 MFM / Meridian Facilities Management (KEYSTONE = project codename only)
**Local full-stack test:** 🟢 manual + Playwright against `localhost:5173` ↔ `localhost:8080`
**Deploy:** 🟡 scaffolding ready (Render + Netlify configs); public URL not live until you apply Blueprint + Netlify site

---

# 11/09/2026 — Frontend folder removed from `backend`

A copy of the UI was added under `frontend/` on this branch so the API could be tested with the real screens. That belonged on the `frontend` branch, not here.

* [x] Confirmed the app runs locally (API on `8080`; UI on the frontend teammate’s branch / local copy)
* [x] Remaining issues are frontend tweaks, not backend rebuild
* [x] Removed `frontend/` from the `backend` branch (local + GitHub)
* [x] Root README, backend README, and this log now describe the three-branch layout
* [x] Do not clone `main` expecting the app
* [x] Do not clone `backend` expecting a `frontend/` folder

### Full Stack Integration End Date: 11/09/2026 (local test). UI follow-up stays on `frontend`.

---

# 16/09/2026 — Frontend Units 0–11 + MFM branding (on `frontend` branch)

Work was done in the `frontend/` git worktree (`frontend` branch only). Backend Java was not changed for these units. Product UI brand is now **MFM** (Meridian Facilities Management); **KEYSTONE** stays the repo/project codename.

## Portals (not admin-only)

1. **Manager / Dispatcher** — `DashboardLayout` (`/dashboard`, work orders, customers, sites, parts, users, reports, SLA)
2. **Technician** — `FieldLayout` (`/my-jobs`)
3. **Customer** — `CustomerLayout` (`/portal/requests`)

## Units completed

* [x] Unit 0 — verify existing app against live API / JWT
* [x] Unit 1 — safe status PUT + Complete Job (tech status-only body; manager copies code/title/description/priority/SLA)
* [x] Unit 2 — POST status history after successful PUT (timeline notes)
* [x] Unit 3 — Customers CRUD UI
* [x] Unit 4 — Sites CRUD UI
* [x] Unit 5 — Parts catalog (manager)
* [x] Unit 6 — Part usage + time logs on job detail
* [x] Unit 7 — Assign / reassign technician (manager only; `GET /api/users` MANAGER-only)
* [x] Unit 8 — Reports summary + SLA page (API summary counts only)
* [x] Unit 9 — Customer Create Request must not 403 (no `POST /api/work-orders` from CUSTOMER)
* [x] Unit 10 — dead nav / placeholders cleaned for wired routes
* [x] Unit 11 — manual e2e walk + Playwright `e2e/work-order-lifecycle.spec.ts` (**1 passed**)

## Playwright notes (Unit 11)

* Config: `playwright.config.ts`; script `npm run test:e2e`
* Requires API already on `:8080`; Vite started by Playwright `webServer`
* Fixes applied during green run:
  * Unique technician last name (assign dropdown is first+last only)
  * Part `selectOption` uses string label, not RegExp
  * Reports Closed count: invalidate `summary` / `my-jobs` on status+assign; `refetchOnMount`; `expect.poll` in spec
* Auth helper expects heading **Sign in to MFM** after branding change

## Branding change (UI only)

* Login, layouts, placeholders, `index.html` title → **MFM** + Field Service Management Platform
* Company line remains Meridian Facilities Management
* Seed credentials unchanged (backend Flyway) — full values recorded in **LIVE deploy** section:
  * MANAGER: `admin@keystone.dev` / `Keystone@2026Admin!`
  * DISPATCHER / TECHNICIAN: not seeded; create via Users UI after manager login

## Deploy status (simplest path)

Scaffolding is in the monorepo. **Live deploy completed 16/09/2026** (see section below for URLs, patches, and login creds):

* [x] `CORS_ALLOWED_ORIGINS` env (comma-separated) — production can allow the Netlify origin
* [x] `backend/Dockerfile` for Render Docker runtime
* [x] `render.yaml` Blueprint (free Postgres + API)
* [x] Root `netlify.toml` for static UI build
* [x] Optional `docker-compose.yml` (local Postgres + API)
* [x] README deploy steps (Render → Netlify → CORS / `VITE_API_BASE_URL`)
* [x] Create Render + Netlify accounts, apply Blueprint, set env, verify login on the public URL

## Git commit plan for this session

* [x] Log this work in `docs/myLogs.md` on `backend` (and mirror to `main` docs)
* [x] Commit UI work on `frontend` (`9cdba39`) → pushed to `origin/frontend`
* [x] Commit integration log on `backend` → pushed to `origin/backend`
* [x] Commit docs mirror on `main` (docs only, no app code)
* [ ] Keep `main` docs in sync when clone-layout notes change (push `origin/main` if ahead)

---

# 16/09/2026 — Pre-push cleanup / merge hygiene

* [x] Discarded CRLF-only noise on `backend` (no fake Java diffs committed)
* [x] Kept UI commits only on `frontend`
* [x] Kept API branch free of a nested `frontend/` folder
* [x] `main` carries docs + clean README; **do not merge** `backend`/`frontend` into `main`
* [x] README conflict between marketing `main` and operational `backend` resolved by separate READMEs per branch
* [x] `origin/backend` and `origin/frontend` updated with session work
* [ ] Confirm `origin/main` has latest clone-layout / myLogs notes after push

---

# 16/09/2026 — Can someone `git clone` and get the whole app?

## Team takeaway (read this first)

**`main` is now a monorepo.** One `git clone` of the default branch gives `backend/` + `frontend/` + `docs/`.

| Goal | What to do |
| --- | --- |
| Get the whole codebase | Clone `main` (default) |
| Run the API | `cd backend` → Maven / Spring Boot |
| Run the UI | `cd frontend` → `npm install` / `npm run dev` |
| Legacy branch clones | Optional; prefer monorepo `main` going forward |

## Short answer

**Yes (after monorepo migration).** Cloning default **`main`** gives the full codebase: `backend/` + `frontend/` + `docs/`. You still start Postgres, the API, and Vite as separate processes (or Compose later).

| If they clone… | What they get |
| --- | --- |
| `main` (default) | **Full monorepo** — API + UI + docs |
| `-b backend` (legacy) | API-oriented tree only |
| `-b frontend` (legacy) | UI-oriented tree only |

## What is “correct / standard”?

Common industry patterns:

### 1. Monorepo on one long-lived branch (most common for a single product)

One default branch (often `main`) contains both apps in folders, e.g.:

```text
/
  backend/     Spring Boot
  frontend/    React + Vite
  docs/
```

- One `git clone` → full codebase
- Feature branches / PRs for changes
- Still run API and UI as two processes locally (or Docker Compose)

**This is usually what people mean by “clone the whole app.”**

### 2. Two (or three) repositories

- `keystone-backend`, `keystone-frontend`, maybe `keystone-docs`
- Each clone is one piece; README links the others
- Standard for larger orgs / separate release cadences

### 3. What KEYSTONE does now (monorepo on `main`)

- **`main`:** `backend/` + `frontend/` + `docs/` — one clone for the whole product
- Legacy `backend` / `frontend` branches: optional compatibility; new work should land on `main`

## Correct way to get the full stack *today* (updated)

**Preferred — monorepo on `main` (done 16/09/2026):**

```powershell
git clone https://github.com/GandharMarathe/Project-KEYSTONE-Field-Service-Management-Platform.git
cd Project-KEYSTONE-Field-Service-Management-Platform
# run backend/ then frontend/ as documented in root README
```

**Legacy — two branch clones** (only if someone still uses old `backend` / `frontend` branches):

```powershell
git clone -b backend … keystone-backend
git clone -b frontend … keystone-frontend
```

## Monorepo migration — DONE (16/09/2026)

* [x] Put `backend/` + `frontend/` + `docs/` together on **`main`**
* [x] Root README documents one-clone full-stack run
* [x] Root `.gitignore` covers `.env`, `backend/target`, `frontend/node_modules` / `dist` / Playwright artifacts
* [x] Updated Overall Status: clone-once is supported via `main`
* [x] Optional local Docker Compose (`docker-compose.yml`) for Postgres + API
* [ ] Push latest `main` (monorepo + deploy scaffolding) to `origin/main`
* [ ] Optional later: retire or archive legacy `backend` / `frontend` branches after teammates switch

---

# 16/09/2026 — How to start and run the app (simple)

Same guide as root `README.md`. Plain order of operations:

1. **Clone `main`** (monorepo with `backend/` + `frontend/` + `docs/`).
2. **Start PostgreSQL** and ensure database **`keystone`** exists on `127.0.0.1:5432`.
3. **Terminal 1 — backend:** `cd backend` → copy `.env.example` to `.env` → `./mvnw spring-boot:run` (Windows: `.\mvnw.cmd spring-boot:run`). Wait until it is up on **http://localhost:8080**.
4. **Terminal 2 — frontend:** `cd frontend` → copy `.env.example` to `.env` → `npm install` → `npm run dev`. Open **http://localhost:5173** (must be `localhost`, not `127.0.0.1`).
5. **Sign in** with seed **MANAGER**: email `admin@keystone.dev` / password `Keystone@2026Admin!` (Flyway V2/V3).  
   Then create **DISPATCHER** / **TECHNICIAN** users from the Users page (no other seed passwords exist).
6. **Stop:** `Ctrl+C` in each terminal when done.

You always need DB + API + UI. The website talks to the API; the API talks to PostgreSQL.

---

# 16/09/2026 — Deploy scaffolding (Render + Netlify)

Simplest hosted path prepared in-repo, then applied live (same day).

* [x] CORS from `CORS_ALLOWED_ORIGINS` (comma-separated)
* [x] `backend/Dockerfile` + `.dockerignore`
* [x] `render.yaml` Blueprint (free DB + Docker API)
* [x] Root `netlify.toml` (build `frontend`, SPA redirects)
* [x] `docker-compose.yml` for local DB+API parity
* [x] README “How to deploy” steps
* [x] Apply Render Blueprint and confirm `/actuator/health`
* [x] Create Netlify site with `VITE_API_BASE_URL` → Render API
* [x] Set Render `CORS_ALLOWED_ORIGINS` to the Netlify `https://` origin
* [x] Verify login on the public Netlify URL

---

# 16/09/2026 — LIVE deploy: what we fixed, why, and how to log in

Plain English record so nobody has to re-discover this the hard way.

## What is live (working)

| Piece | Where | URL / name |
| --- | --- | --- |
| Frontend (MFM UI) | Netlify | `https://mfmfsmp.netlify.app` |
| Backend API | Render | `https://keystone-api-j2qc.onrender.com` |
| Database | Render Postgres | service paired with the API (Blueprint) |
| Health check | Render | `https://keystone-api-j2qc.onrender.com/actuator/health` → `{"status":"UP"}` |

**GitHub note:** the canonical product repo is still `GandharMarathe/Project-KEYSTONE-…`.  
Netlify was connected to the collaborator fork **`s0a1m0x01/Project-KEYSTONE-Field-Service-Management-Platform`** because the deployer did not own the upstream repo. That is fine — just remember: **push the fork** if you want Netlify to rebuild.

Render was created from the Blueprint against the monorepo (`main`).

## Seed / login credentials (do not lose these)

### Straight answer: who can log in?

App login roles (enum + Users UI): **MANAGER**, **DISPATCHER**, **TECHNICIAN**, **CUSTOMER**.

| Who you asked about | Login email / password? | Reality |
| --- | --- | --- |
| **Admin / Manager** | `admin@keystone.dev` / `Keystone@2026Admin!` | **Same account.** Flyway seeds one **MANAGER**. That *is* the bootstrap admin. There is no separate “admin” user. |
| **Technician** | **None seeded** | Create in **Users** while logged in as manager. You pick email + password. |
| **Dispatcher** | **None seeded** | Same — create via Users. |
| **Customer** (login role) | **None seeded** | Role exists (`CUSTOMER`) and can be created in Users, but there is **no** Flyway seed customer login. A “Customer” *business record* (company/site) is different from a `CUSTOMER` *user account*. |
| **Extra admins** | Create more **MANAGER** users in Users | Only if you add them yourself. |

### Seeded account (only one — local + hosted after Flyway)

| Field | Value |
| --- | --- |
| Role | **MANAGER** (bootstrap admin) |
| Email | `admin@keystone.dev` |
| Password | `Keystone@2026Admin!` |
| Source | `backend/.../V2__seed_initial_manager.sql` (+ `V3` email typo fix) |

Use this on:

* Local: `http://localhost:5173`
* Hosted: `https://mfmfsmp.netlify.app/login`

### Create the other roles (required for technician / customer / dispatcher logins)

1. Sign in as **MANAGER** above.
2. Open **Users** (manager-only screen).
3. Add users. Suggested team convention (you choose real passwords and write them down):

| Role | Example email | Password | Status |
| --- | --- | --- | --- |
| MANAGER | `admin@keystone.dev` | `Keystone@2026Admin!` | **Seeded — use this** |
| DISPATCHER | e.g. `dispatch@keystone.dev` | **You choose** (≥ 8 chars) | Create in UI |
| TECHNICIAN | e.g. `tech@keystone.dev` | **You choose** (≥ 8 chars) | Create in UI |
| CUSTOMER | e.g. `cust1@keystone.dev` | **You choose** (≥ 8 chars) | Create in UI |

There is a old local API test payload mentioning `cust1@keystone.dev` / `Keystone@2026Cust!` under `backend/user-customer-payload.json` — that is **not** a Flyway seed and is **not** guaranteed on the hosted Render DB unless someone POSTed it there. Prefer creating users in the live UI and recording passwords in a password manager.

**Local Postgres** (compose / defaults — website login is separate): password `Keystone@2026Strong!`.  
**Hosted Postgres** password: see gitignored `docs/render-env.local.md` or Render → Environment (never commit it).

## What broke during deploy, and what we patched

### 1) “Repo isn’t mine” (collaborator ownership)

* **Problem:** Netlify/Render GitHub import needs access to the repo. Upstream is Gandhar’s.
* **Fix used:** **Fork** to `s0a1m0x01/…`, import **the fork** on Netlify.
* **Lesson:** browser GitHub login ≠ git CLI push auth. Prefer keeping the fork in sync, or get collaborator access later and point Netlify at upstream.

### 2) Netlify first deploy — install failed

* **Symptom:** `Failed during stage 'Install dependencies'` / exit code 1.
* **Cause:** monorepo — `package.json` lives under `frontend/`, not repo root. Install ran in the wrong place until base/path was correct.
* **Fix:** build from `frontend` (`netlify.toml` already has `base = "frontend"`). If the UI fights you on paths, use root-relative:

  * Build: `npm --prefix frontend ci && npm --prefix frontend run build`
  * Publish: `frontend/dist`
  * Or: Base directory `frontend`, Publish `dist` (not `frontend/dist` stacked twice).

### 3) Netlify then used **pnpm** and choked on lockfile

* **Symptom (Netlify AI / logs):**  
  `ERR_PNPM_OUTDATED_LOCKFILE` — `@playwright/test@^1.63.0` in `package.json` but missing from `pnpm-lock.yaml`.
* **Why:** `frontend/` has **both** `package-lock.json` and `pnpm-lock.yaml`. Netlify saw `pnpm-lock.yaml` and ran **pnpm** with frozen lockfile.
* **Fix:** regenerate lockfile (`pnpm install` in `frontend/`), commit:  
  `ac826f0` — `fix: sync frontend pnpm lockfile with Playwright dependency`  
  Pushed to the **fork** `main` so Netlify could rebuild.
* **Lesson:** don’t leave two lockfiles out of sync. Prefer one package manager for CI, or keep both locks updated whenever `package.json` changes.

### 4) UI loaded but login said “Unable to connect to the server”

* **Symptom:** Netlify site OK; button stuck on “Signing in…” / refresh shows unable to connect.
* **Not** “Netlify is down.” The React client throws that text when `fetch` fails (see `frontend/src/services/apiClient.ts`).
* **Real cause:** Render API was **UP**, but **CORS** rejected the Netlify origin (`Invalid CORS request` on preflight).
* **Fix:** Render → **keystone-api** → **Environment**:

  * `CORS_ALLOWED_ORIGINS` = `https://mfmfsmp.netlify.app`  
    (exact origin, **no** trailing slash)

* Also required at build time on Netlify:

  * `VITE_API_BASE_URL` = `https://keystone-api-j2qc.onrender.com`  
    (Vite bakes this into the JS bundle — changing it later needs a **redeploy**)

## Env vars checklist (keep these)

### Netlify (Site → Environment variables)

| Key | Value (current) |
| --- | --- |
| `VITE_API_BASE_URL` | `https://keystone-api-j2qc.onrender.com` |
| `VITE_ENABLE_UI_DEV_ACCESS` | `false` (optional; toml default) |

### Render (Web Service → Environment) — live values 16/09/2026

Non-secret / shareable in git:

| Key | Value |
| --- | --- |
| `CORS_ALLOWED_ORIGINS` | `https://mfmfsmp.netlify.app` |
| `DB_HOST` | `dpg-dakt1ljm8hqs73ejb480-a` |
| `DB_NAME` | `keystone_u1el` |
| `DB_PORT` | `5432` |
| `DB_USERNAME` | `keystone` |
| `SERVER_PORT` | `8080` |

**Secrets** (`DB_PASSWORD`, `JWT_SECRET`): live in Render → Environment. Also copied for local eyes only into **`docs/render-env.local.md`** (gitignored — will not be pushed). Do **not** paste those into `myLogs.md` or commit them.

If this chat or a screenshot already leaked them, rotate `JWT_SECRET` / DB password in Render when you can.

## Day-to-day after this (not hectic)

1. Change code locally on monorepo `main`.
2. Commit + push to the GitHub repo **Netlify/Render are watching** (today: the fork for Netlify).
3. Wait for auto-deploy.
4. Refresh the site.

Only touch env/CORS again if the **Netlify URL** or **Render API URL** changes.

## Free-tier reminder

Render free web services **spin down** when idle. First request after idle can take ~30–60+ seconds — that can look like “can’t connect” once; wait and retry.

---

* [x] Live Netlify UI verified
* [x] Live Render API health verified
* [x] CORS fixed for Netlify origin
* [x] pnpm lockfile sync committed (`ac826f0`)
* [x] Seed manager credentials recorded in this log (not dropped)
* [x] Explained how DISPATCHER / TECHNICIAN / CUSTOMER accounts are created (no seed passwords invented)
* [x] Render env keys documented; secrets kept in gitignored `docs/render-env.local.md`
