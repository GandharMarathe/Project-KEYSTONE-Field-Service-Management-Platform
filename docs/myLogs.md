# Project KEYSTONE — Field Service Management Platform

## Backend Development Logs

### Start Date: 30/08/2026

### End Date: 11/09/2026

### System Design Reference: https://wasp-hall-12061834.figma.site/

### Status: Backend Core + API Implementation & Integration Testing — Near Completion

### Next Major Phase: Frontend Integration & Full-Stack Testing

---

**Project:** Zidio Development Project — KEYSTONE
**Product:** Field Service Management Platform
**Organization:** Meridian Facilities Management

### Repository

* **Repository:** `Project-KEYSTONE-Field-Service-Management-Platform`
* **Backend Path:** `C:\Users\gamer\Desktop\ZidioDevelopment_Workspace\Project-KEYSTONE-Field-Service-Management-Platform\backend`
* **Backend Branch:** `backend`
* **Git Remote:** `https://github.com/GandharMarathe/Project-KEYSTONE-Field-Service-Management-Platform`
* **Developer Git Identity:** `s0a1m0x01`

### Local URLs and ports

Use these after a clone of the `backend` branch. Run commands from the matching folder, not the repo root.

| Service | Port | Local URL | Start from |
| --- | --- | --- | --- |
| Backend API (Spring Boot) | `8080` | http://localhost:8080 | `backend` → `.\mvnw.cmd spring-boot:run` |
| API login | `8080` | `POST` http://localhost:8080/api/auth/login | backend must already be running |
| Frontend (Vite) | `5173` | http://localhost:5173 | `frontend` → `pnpm dev` |
| Frontend login | `5173` | http://localhost:5173/login | frontend must already be running |
| PostgreSQL | `5432` | `127.0.0.1:5432` database `keystone` | local Postgres service |

Environment templates:

* Backend: copy `backend/.env.example` to `backend/.env` (gitignored). Spring Boot reads `SERVER_PORT`, `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, and `JWT_SECRET` as OS environment variables, with the same local-dev defaults in `backend/src/main/resources/application.properties`.
* Frontend: copy `frontend/.env.example` to `frontend/.env`. `VITE_API_BASE_URL` must stay `http://localhost:8080` so the UI can reach the API.

Common mistake: `.\mvnw.cmd` at the repo root fails because the Maven wrapper is inside `backend`.

### Project documents

Keep specifications and the project brief in `docs` only. Do not keep copies inside `backend`.

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

* [ ] Connect frontend authentication to `/api/auth/login`
* [ ] Store/use JWT appropriately
* [ ] Add authenticated API requests
* [ ] Connect Customer screens
* [ ] Connect Site screens
* [ ] Connect User/role functionality
* [ ] Connect Work Order screens
* [ ] Connect assignment/status workflow
* [ ] Connect Work Order history
* [ ] Connect Parts
* [ ] Connect Part Usage
* [ ] Connect Time Logs
* [ ] Connect Reports
* [ ] Implement role-specific UI behavior
* [ ] Verify backend/frontend payload compatibility

---

# Final Full-Stack Validation

After frontend integration:

* [ ] Start PostgreSQL
* [ ] Start Spring Boot backend
* [ ] Start React/Vite frontend
* [ ] Verify frontend → backend connectivity
* [ ] Verify CORS/configuration if required
* [ ] Verify login from UI
* [ ] Verify JWT-authenticated API calls
* [ ] Verify CRUD from UI
* [ ] Verify role-based behavior
* [ ] Verify Work Order lifecycle
* [ ] Verify Parts/Usage
* [ ] Verify Time Logs
* [ ] Verify Reports
* [ ] Verify error handling
* [ ] Debug integration-specific issues
* [ ] Perform final end-to-end smoke test
* [ ] Document final system state

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

**Backend:** 🟢 Core implementation complete / final verification remaining
**Database:** 🟢 Operational
**Authentication:** 🟢 Operational
**JWT:** 🟢 Operational
**Security:** 🟢 Major discovered issues fixed
**Core APIs:** 🟢 Implemented and actively tested
**Git:** 🟢 Synchronized during completed phases
**Frontend:** ⏳ Next major development phase
**Full-Stack Integration:** ⏳ After backend freeze
**Final E2E Debugging:** ⏳ After frontend + backend are running together



### Full Stack Integration End Date: 