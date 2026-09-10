# Project KEYSTONE — Backend Development Specification

## 1. Document Purpose

This document defines the complete backend scope for **Project KEYSTONE**, a Field Service Management Platform for Meridian Facilities Management.

The backend is the authoritative application layer responsible for:

* Authentication
* Authorization
* User and role management
* Customer management
* Site management
* Work-order management
* Work-order lifecycle enforcement
* Technician assignment
* Parts and inventory usage
* Time logging
* SLA tracking
* Status history
* Notifications
* Reporting
* Validation
* Persistence
* Transaction management
* API error handling
* Database migrations
* API documentation

The backend must expose a secure REST API consumed by the React + TypeScript frontend.

The backend is the **authoritative security and business-rule boundary**.

The frontend must never be trusted to enforce authorization, ownership, lifecycle transitions, inventory availability, or other business rules.

---

# 2. Backend Goals

The backend should provide a production-oriented REST API supporting all required KEYSTONE workflows.

Primary goals:

1. Authenticate users securely.
2. Authorize requests according to role.
3. Persist users, customers, sites, work orders, parts, time logs, and related data.
4. Enforce the work-order lifecycle.
5. Assign and reassign technicians according to permissions.
6. Restrict technicians to their assigned work.
7. Restrict customers to their own data.
8. Maintain append-only work-order status history.
9. Track parts usage transactionally.
10. Track technician time.
11. Calculate/expose SLA information.
12. Provide operational reporting.
13. Provide structured API errors.
14. Provide pagination, sorting, filtering, and searching.
15. Provide database migrations through Flyway.
16. Provide OpenAPI/Swagger documentation.
17. Provide automated tests.
18. Keep controllers thin and business logic inside services.
19. Keep persistence logic inside repositories.
20. Prevent direct database access from the frontend.

Target architecture:

```text
React + TypeScript
        |
        | HTTPS / REST / JWT
        v
Spring Boot REST API
        |
        +-- Security
        +-- Controllers
        +-- Services
        +-- Validation
        +-- Domain Rules
        +-- Repositories
        |
        v
PostgreSQL
        |
        ^
     Flyway
```

---

# 3. Technology Stack

## Required Project Stack

The project brief specifies:

* Java 21
* Spring Boot 3
* Spring Security
* JWT authentication
* Spring Data JPA
* Hibernate
* PostgreSQL
* Flyway
* Maven
* Bean Validation
* REST APIs
* OpenAPI / Swagger

Recommended supporting libraries:

```text
Spring Web
Spring Security
Spring Data JPA
Spring Validation
PostgreSQL Driver
Flyway
JWT library
Spring Boot Actuator
Springdoc OpenAPI
JUnit 5
Mockito
Testcontainers where appropriate
```

## Current Repository Note

The current repository has been observed running:

```text
Spring Boot 4.0.0
Java 25.0.4
Hibernate 7.1.8.Final
PostgreSQL 18.6
```

This is an implementation-state observation, not a replacement for the agreed project specification.

Before changing the Java/Spring versions, confirm the target stack with the Zidio Development project requirements.

---

# 4. Backend Architecture

Use a layered architecture.

```text
HTTP Request
     |
     v
Controller
     |
     v
Security / Authorization
     |
     v
Service
     |
     +---- Domain validation
     +---- Business rules
     +---- Transactions
     |
     v
Repository
     |
     v
JPA / Hibernate
     |
     v
PostgreSQL
```

Recommended dependency direction:

```text
Controller
   ↓
Service
   ↓
Repository
   ↓
Database
```

Controllers must not contain substantial business logic.

Repositories must not contain application workflow logic.

Business rules belong primarily in the service/domain layer.

---

# 5. Backend Project Structure

Recommended structure:

```text
backend/
├── pom.xml
├── mvnw
├── mvnw.cmd
├── .mvn/
│   └── wrapper/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── zidio/
│   │   │           └── keystone/
│   │   │               ├── KeystoneBackendApplication.java
│   │   │               │
│   │   │               ├── config/
│   │   │               │   ├── SecurityConfig.java
│   │   │               │   ├── OpenApiConfig.java
│   │   │               │   └── JacksonConfig.java
│   │   │               │
│   │   │               ├── security/
│   │   │               │   ├── JwtAuthenticationFilter.java
│   │   │               │   ├── JwtService.java
│   │   │               │   ├── CustomUserDetailsService.java
│   │   │               │   └── SecurityUser.java
│   │   │               │
│   │   │               ├── controller/
│   │   │               │   ├── AuthController.java
│   │   │               │   ├── UserController.java
│   │   │               │   ├── CustomerController.java
│   │   │               │   ├── SiteController.java
│   │   │               │   ├── WorkOrderController.java
│   │   │               │   ├── PartController.java
│   │   │               │   ├── TimeLogController.java
│   │   │               │   ├── ReportController.java
│   │   │               │   ├── NotificationController.java
│   │   │               │   └── SlaController.java
│   │   │               │
│   │   │               ├── service/
│   │   │               │   ├── AuthService.java
│   │   │               │   ├── UserService.java
│   │   │               │   ├── CustomerService.java
│   │   │               │   ├── SiteService.java
│   │   │               │   ├── WorkOrderService.java
│   │   │               │   ├── AssignmentService.java
│   │   │               │   ├── WorkOrderStatusService.java
│   │   │               │   ├── PartService.java
│   │   │               │   ├── TimeLogService.java
│   │   │               │   ├── SlaService.java
│   │   │               │   ├── ReportService.java
│   │   │               │   └── NotificationService.java
│   │   │               │
│   │   │               ├── repository/
│   │   │               │   ├── UserRepository.java
│   │   │               │   ├── CustomerRepository.java
│   │   │               │   ├── SiteRepository.java
│   │   │               │   ├── WorkOrderRepository.java
│   │   │               │   ├── WorkOrderStatusHistoryRepository.java
│   │   │               │   ├── PartRepository.java
│   │   │               │   ├── PartUsageRepository.java
│   │   │               │   ├── TimeLogRepository.java
│   │   │               │   └── NotificationRepository.java
│   │   │               │
│   │   │               ├── domain/
│   │   │               │   ├── entity/
│   │   │               │   │   ├── User.java
│   │   │               │   │   ├── Customer.java
│   │   │               │   │   ├── Site.java
│   │   │               │   │   ├── WorkOrder.java
│   │   │               │   │   ├── WorkOrderStatusHistory.java
│   │   │               │   │   ├── Part.java
│   │   │               │   │   ├── PartUsage.java
│   │   │               │   │   ├── TimeLog.java
│   │   │               │   │   └── Notification.java
│   │   │               │   │
│   │   │               │   └── enums/
│   │   │               │       ├── Role.java
│   │   │               │       ├── WorkOrderStatus.java
│   │   │               │       ├── Priority.java
│   │   │               │       └── SlaStatus.java
│   │   │               │
│   │   │               ├── dto/
│   │   │               │   ├── auth/
│   │   │               │   ├── user/
│   │   │               │   ├── customer/
│   │   │               │   ├── site/
│   │   │               │   ├── workorder/
│   │   │               │   ├── part/
│   │   │               │   ├── timelog/
│   │   │               │   ├── report/
│   │   │               │   └── notification/
│   │   │               │
│   │   │               ├── mapper/
│   │   │               │   ├── UserMapper.java
│   │   │               │   ├── CustomerMapper.java
│   │   │               │   ├── SiteMapper.java
│   │   │               │   └── WorkOrderMapper.java
│   │   │               │
│   │   │               ├── exception/
│   │   │               │   ├── GlobalExceptionHandler.java
│   │   │               │   ├── ResourceNotFoundException.java
│   │   │               │   ├── BusinessRuleException.java
│   │   │               │   ├── InvalidStatusTransitionException.java
│   │   │               │   ├── InsufficientStockException.java
│   │   │               │   └── UnauthorizedOperationException.java
│   │   │               │
│   │   │               └── validation/
│   │   │                   └── ...
│   │   │
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-test.yml
│   │       └── db/
│   │           └── migration/
│   │               ├── V1__initial_schema.sql
│   │               ├── V2__...
│   │               └── ...
│   │
│   └── test/
│       └── java/
│           └── com/
│               └── zidio/
│                   └── keystone/
│
└── README.md
```

The exact structure can evolve, but the separation between domain, DTOs, controllers, services, repositories, security, exceptions, and migrations should remain clear.

---

# 6. Configuration

Primary configuration file:

```text
backend/src/main/resources/application.yml
```

Development configuration:

```text
backend/src/main/resources/application-dev.yml
```

Test configuration:

```text
backend/src/main/resources/application-test.yml
```

Production secrets must not be committed.

Use environment variables for:

```text
DATABASE_URL
DATABASE_USERNAME
DATABASE_PASSWORD
JWT_SECRET
JWT_EXPIRATION
```

Example conceptual configuration:

```text
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USERNAME}
    password: ${DATABASE_PASSWORD}

  jpa:
    open-in-view: false
```

The actual configuration should match the team's deployment environment.

---

# 7. Database

PostgreSQL is the authoritative persistence layer.

Conceptual database:

```text
keystone
```

The backend must never expose PostgreSQL directly to the frontend.

Correct:

```text
React
 ↓
REST API
 ↓
Spring Boot
 ↓
JPA
 ↓
PostgreSQL
```

Incorrect:

```text
React
 ↓
PostgreSQL
```

---

# 8. Flyway Database Migrations

Migration directory:

```text
backend/src/main/resources/db/migration/
```

Migration naming convention:

```text
V1__initial_schema.sql
V2__add_work_order_tables.sql
V3__add_parts.sql
```

Never manually modify an already-applied production migration.

Instead create a new migration.

Example:

```text
V4__add_sla_fields.sql
```

Flyway must manage schema evolution.

The application should not rely on Hibernate automatically creating production tables.

Recommended production approach:

```text
spring.jpa.hibernate.ddl-auto=validate
```

Flyway:

```text
Migration source of truth
```

---

# 9. Core Domain Model

The backend domain consists of:

```text
User
Customer
Site
WorkOrder
WorkOrderStatusHistory
Part
PartUsage
TimeLog
Notification
```

Relationships:

```text
Customer
   |
   +---- Site
           |
           +---- WorkOrder
                    |
                    +---- Status History
                    +---- Part Usage
                    +---- Time Logs
```

Technicians are represented by users with:

```text
Role.TECHNICIAN
```

---

# 10. Roles

Create:

```text
backend/src/main/java/com/zidio/keystone/domain/enums/Role.java
```

Allowed roles:

```text
DISPATCHER
TECHNICIAN
MANAGER
CUSTOMER
```

Do not add roles unless the project specification is changed.

Role authorization must be enforced by the backend.

---

# 11. User Entity

Create:

```text
backend/src/main/java/com/zidio/keystone/domain/entity/User.java
```

Conceptual fields:

```text
id
email
passwordHash
firstName
lastName
role
enabled
createdAt
updatedAt
```

Important rules:

* Email must be unique.
* Password must never be stored in plaintext.
* Store a password hash.
* Role must be persisted.
* Disabled users must not authenticate.
* Created/updated timestamps should be maintained by the backend.

The API must never return:

```text
passwordHash
```

in normal user DTOs.

---

# 12. User Repository

Create:

```text
backend/src/main/java/com/zidio/keystone/repository/UserRepository.java
```

Responsibilities:

* Find users by ID.
* Find users by email.
* Check email uniqueness.
* Find technicians where required.
* Support user-management queries.

Do not expose repository objects directly through controllers.

---

# 13. Authentication

Authentication endpoint:

```text
POST /api/auth/login
```

Request:

```text
email
password
```

Conceptual flow:

```text
Login request
      |
      v
Find user by email
      |
      v
Check enabled
      |
      v
Verify password hash
      |
      v
Generate JWT
      |
      v
Return token + user/role information
```

Invalid credentials should return an appropriate authentication response without revealing whether the email exists.

Do not return:

```text
User not found
```

when doing so would allow account enumeration.

Prefer a generic authentication failure.

---

# 14. JWT Security

Create:

```text
backend/src/main/java/com/zidio/keystone/security/JwtService.java
```

Responsibilities:

* Generate JWT.
* Validate JWT.
* Extract subject/user identity.
* Extract role claims where appropriate.
* Check expiration.

Create:

```text
backend/src/main/java/com/zidio/keystone/security/JwtAuthenticationFilter.java
```

Responsibilities:

```text
Authorization header
        |
        v
Bearer token
        |
        v
Validate JWT
        |
        v
Load user
        |
        v
Create authenticated SecurityContext
```

Expected request:

```text
Authorization: Bearer <JWT>
```

JWT signing secrets must never be hard-coded into source code.

---

# 15. Security Configuration

Create:

```text
backend/src/main/java/com/zidio/keystone/config/SecurityConfig.java
```

Security must:

* Disable unauthorized access to protected endpoints.
* Permit login endpoint.
* Authenticate protected endpoints.
* Apply role-based authorization.
* Configure stateless JWT authentication.
* Configure appropriate CORS.
* Avoid exposing unnecessary endpoints.

Conceptual public endpoint:

```text
POST /api/auth/login
```

Protected endpoints:

```text
/api/work-orders/**
/api/customers/**
/api/sites/**
/api/reports/**
...
```

Actuator exposure must also be deliberately controlled.

---

# 16. Password Security

Passwords must be hashed using a strong password hashing algorithm such as BCrypt or the project's approved password encoder.

Never store:

```text
password
```

directly.

Never log:

```text
password
JWT
passwordHash
```

---

# 17. Authentication DTOs

Recommended location:

```text
backend/src/main/java/com/zidio/keystone/dto/auth/
```

Possible classes:

```text
LoginRequest.java
LoginResponse.java
AuthenticatedUserDto.java
```

Example conceptual response:

```json
{
  "token": "...",
  "user": {
    "id": "...",
    "email": "...",
    "role": "TECHNICIAN"
  }
}
```

The exact JSON contract must be finalized with the frontend.

---

# 18. Customer Domain

Create:

```text
backend/src/main/java/com/zidio/keystone/domain/entity/Customer.java
```

A customer represents an organization/customer using the facilities-management service.

Conceptual fields should include only those agreed by the backend model.

Possible conceptual fields:

```text
id
name
contact information
createdAt
updatedAt
```

Do not invent unnecessary business fields.

---

# 19. Customer API

Base endpoint:

```text
/api/customers
```

Required operations:

```text
GET  /api/customers
POST /api/customers
GET  /api/customers/{id}
PUT  /api/customers/{id}
```

Access:

```text
DISPATCHER
MANAGER
```

Customer users should only access their own customer context through explicitly authorized endpoints.

---

# 20. Site Domain

Create:

```text
backend/src/main/java/com/zidio/keystone/domain/entity/Site.java
```

A site must belong to a customer.

Relationship:

```text
Customer 1
   |
   +---- * Sites
```

The backend must verify the customer exists before creating a site.

---

# 21. Site API

Base endpoint:

```text
/api/sites
```

Potential operations:

```text
GET  /api/sites
GET  /api/sites/{id}
POST /api/sites
PUT  /api/sites/{id}
```

Customer-specific:

```text
GET /api/customers/{id}/sites
POST /api/customers/{id}/sites
```

Authorization must ensure users cannot manipulate another customer's sites.

---

# 22. Work Order Domain

The work order is the central backend domain.

Create:

```text
backend/src/main/java/com/zidio/keystone/domain/entity/WorkOrder.java
```

Conceptual fields:

```text
id
code
title
description
priority
status
customer
site
assignee
slaDueDate
createdAt
updatedAt
```

Additional fields must only be added when supported by the agreed domain model.

---

# 23. Work Order Status

Create:

```text
backend/src/main/java/com/zidio/keystone/domain/enums/WorkOrderStatus.java
```

Allowed states:

```text
NEW
ASSIGNED
IN_PROGRESS
ON_HOLD
COMPLETED
CLOSED
CANCELLED
```

Do not add:

```text
PENDING
REOPENED
ESCALATED
DISPATCHED
RESOLVED
```

unless the project specification is explicitly changed.

---

# 24. Priority

Create:

```text
backend/src/main/java/com/zidio/keystone/domain/enums/Priority.java
```

Allowed values:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

The exact values must match the frontend contract.

---

# 25. Work Order Creation

Endpoint:

```text
POST /api/work-orders
```

Conceptual request:

```text
title
description
priority
customerId
siteId
```

Backend must validate:

1. Required fields.
2. Customer exists.
3. Site exists.
4. Site belongs to customer.
5. Priority is valid.
6. Requesting user has permission.

Initial status:

```text
NEW
```

The frontend must not be allowed to arbitrarily create a work order in:

```text
IN_PROGRESS
COMPLETED
CLOSED
```

unless explicitly supported by business rules.

---

# 26. Work Order Code

The backend should generate work-order identifiers/codes.

Example conceptual format:

```text
WO-XXXX
```

The frontend must never generate authoritative work-order IDs.

IDs must be unique.

---

# 27. Work Order List

Endpoint:

```text
GET /api/work-orders
```

The endpoint must support pagination.

Conceptual parameters:

```text
page
size
sort
status
priority
customerId
siteId
technicianId
search
```

Example:

```text
GET /api/work-orders?page=0&size=20&status=ASSIGNED
```

Do not return unlimited records.

---

# 28. Pagination Response

Recommended conceptual structure:

```json
{
  "content": [],
  "page": 0,
  "size": 20,
  "totalElements": 0,
  "totalPages": 0
}
```

The exact response contract must be finalized.

Pagination should be implemented at the repository/database query level rather than loading the entire table into memory.

---

# 29. Work Order Details

Endpoint:

```text
GET /api/work-orders/{id}
```

Return a role-appropriate DTO.

Internal users may receive:

```text
work order
customer
site
assignee
SLA information
status
history
parts
time
```

Customer responses must be restricted to customer-visible information.

Never return internal-only fields simply because they exist on the entity.

---

# 30. Work Order Assignment

Endpoint:

```text
POST /api/work-orders/{id}/assign
```

Conceptual request:

```text
technicianId
```

Allowed roles:

```text
DISPATCHER
MANAGER
```

Backend must verify:

1. Work order exists.
2. Technician exists.
3. User has `TECHNICIAN` role.
4. Work order is in an assignable state.
5. Requesting user has permission.
6. Assignment is persisted transactionally.

---

# 31. Reassignment

Reassignment is allowed only for permitted open states.

The backend must enforce:

```text
Who can reassign?
When can reassignment occur?
Can completed jobs be reassigned?
Can closed jobs be reassigned?
```

The frontend cannot decide these rules.

If an invalid assignment occurs:

```text
409 Conflict
```

should be considered where appropriate.

---

# 32. Work Order Lifecycle

The backend is the authoritative lifecycle engine.

Primary lifecycle:

```text
NEW
 |
 | assign
 v
ASSIGNED
 |
 | start
 v
IN_PROGRESS
 |        \
 |         \
 |          | hold
 |          v
 |       ON_HOLD
 |          |
 |          | resume
 |          v
 |      IN_PROGRESS
 |
 | complete
 v
COMPLETED
 |
 | close
 v
CLOSED
```

Cancellation:

```text
OPEN/APPROPRIATE STATE
        |
        v
    CANCELLED
```

The exact legal transitions must be explicitly implemented.

---

# 33. Lifecycle Transition Enforcement

Create:

```text
backend/src/main/java/com/zidio/keystone/service/WorkOrderStatusService.java
```

The service should determine whether a requested transition is valid.

Conceptual method:

```text
changeStatus(
    workOrderId,
    requestedStatus,
    authenticatedUser
)
```

Validation:

```text
Current state
      +
Requested state
      +
Authenticated role
      +
Ownership/assignment
      =
Allowed / Denied
```

Never rely on the frontend to prevent invalid transitions.

---

# 34. Status API

Endpoint:

```text
POST /api/work-orders/{id}/status
```

Conceptual request:

```text
status
note
```

The backend must:

1. Load work order.
2. Verify authorization.
3. Verify transition.
4. Update status.
5. Create status-history record.
6. Persist changes transactionally.
7. Return updated representation.

---

# 35. Status History

Create:

```text
backend/src/main/java/com/zidio/keystone/domain/entity/WorkOrderStatusHistory.java
```

Conceptual fields:

```text
id
workOrder
fromStatus
toStatus
changedBy
changedAt
note
```

History should be append-only.

Do not allow users to edit old history entries through normal application APIs.

---

# 36. Status History API

Potential endpoint:

```text
GET /api/work-orders/{id}/history
```

The response should be ordered chronologically.

Example:

```text
NEW
 ↓
ASSIGNED
 ↓
IN_PROGRESS
 ↓
ON_HOLD
 ↓
IN_PROGRESS
 ↓
COMPLETED
 ↓
CLOSED
```

Every transition must originate from backend activity.

Do not manufacture history records.

---

# 37. Technician Authorization

Technicians may:

```text
View assigned work orders
Start assigned jobs
Hold assigned jobs
Resume assigned jobs
Complete assigned jobs
Log parts
Log time
Upload supported attachments
```

Technicians must not:

```text
Assign jobs
Reassign jobs
Close jobs
Manage users
Manage customers
Manage inventory
View another technician's jobs
```

Backend authorization must enforce all of these rules.

---

# 38. Technician Ownership Checks

Never trust:

```text
/my-jobs/{id}
```

just because the frontend displays the ID.

The backend must verify:

```text
workOrder.assignee.id == authenticatedUser.id
```

before allowing technician-specific operations.

Example:

```text
Technician A
   |
   +---- WO-123 ✓

Technician A
   |
   +---- WO-456 ✗
          assigned to Technician B
```

The second request must be rejected.

---

# 39. Technician Jobs Endpoint

Potential endpoint:

```text
GET /api/work-orders/my
```

Alternative:

```text
GET /api/work-orders?technicianId=currentUser
```

The backend should derive the authenticated technician identity from the security context.

Do not accept arbitrary technician IDs for technician self-service endpoints.

---

# 40. Parts Domain

Create:

```text
backend/src/main/java/com/zidio/keystone/domain/entity/Part.java
```

Conceptual fields:

```text
id
name
partNumber
quantityInStock
unitCost
createdAt
updatedAt
```

Only fields agreed by the domain model should be implemented.

---

# 41. Part Usage

Create:

```text
backend/src/main/java/com/zidio/keystone/domain/entity/PartUsage.java
```

Conceptual fields:

```text
id
workOrder
part
quantity
cost where applicable
recordedBy
createdAt
```

---

# 42. Inventory Transaction Rule

Part usage must be transactional.

Correct:

```text
Log Part Usage
      |
      +---- Validate stock
      |
      +---- Decrement stock
      |
      +---- Create usage record
      |
      +---- Commit transaction
```

Do not perform:

```text
decrement stock
      ↓
separate API request
      ↓
create usage record
```

because this can create inconsistent inventory.

---

# 43. Parts API

Potential endpoints:

```text
GET  /api/parts
POST /api/parts
PUT  /api/parts/{id}
```

Usage:

```text
POST /api/work-orders/{id}/parts
GET  /api/work-orders/{id}/parts
```

Technicians may log part usage for their assigned work orders.

Managers may manage inventory.

---

# 44. Insufficient Stock

If requested quantity exceeds available stock:

```text
409 Conflict
```

or the project's agreed business-error status should be returned.

Example response:

```text
Unable to add part.
The requested quantity is not available.
```

The backend must not allow stock to become negative unless explicitly supported by the business specification.

---

# 45. Time Logs

Create:

```text
backend/src/main/java/com/zidio/keystone/domain/entity/TimeLog.java
```

Conceptual fields:

```text
id
workOrder
technician
minutes
note
createdAt
```

---

# 46. Time Logging API

Endpoint:

```text
POST /api/work-orders/{id}/time
```

Request:

```text
minutes
note
```

Validation:

```text
minutes > 0
```

The backend must verify the authenticated technician is permitted to log time against the work order.

---

# 47. Time Log Retrieval

Potential endpoint:

```text
GET /api/work-orders/{id}/time
```

Return only fields appropriate for the requesting role.

Managers can receive broader operational information.

Customers should not automatically receive internal technician/time information unless explicitly required.

---

# 48. SLA Domain

Create:

```text
backend/src/main/java/com/zidio/keystone/domain/enums/SlaStatus.java
```

Conceptual states:

```text
WITHIN_SLA
AT_RISK
BREACHED
```

SLA data may include:

```text
slaDueDate
slaStatus
```

The exact SLA model must be agreed with the project requirements.

---

# 49. SLA Rules

The backend should be responsible for determining SLA status.

Conceptually:

```text
Current time < warning threshold
        ↓
WITHIN_SLA

Current time >= warning threshold
        ↓
AT_RISK

Current time > SLA due time
        ↓
BREACHED
```

Do not allow the frontend to independently calculate authoritative SLA status.

---

# 50. SLA API

Potential endpoint:

```text
GET /api/sla
```

or work-order-level SLA data:

```text
GET /api/work-orders/{id}
```

with:

```text
slaDueDate
slaStatus
```

Manager-specific monitoring:

```text
GET /api/reports/sla
```

The exact API should be finalized according to the backend implementation.

---

# 51. Notifications

Create:

```text
backend/src/main/java/com/zidio/keystone/domain/entity/Notification.java
```

Potential notification events:

```text
Work order assigned
SLA at risk
SLA breached
```

Notifications should be generated from backend events/business operations.

Do not hard-code notification records.

---

# 52. Notification API

Potential endpoint:

```text
GET /api/notifications
```

Potential operations:

```text
GET  /api/notifications
PUT  /api/notifications/{id}/read
```

The backend must ensure users can only access their own notifications.

---

# 53. Manager/Admin Capabilities

Managers can:

```text
Manage users
Manage customers
Manage sites
Manage work orders
Assign/reassign technicians
Manage parts
Close completed work orders
View reports
View SLA information
View operational breakdowns
```

Managers should not bypass business rules merely because they have elevated permissions.

For example:

```text
COMPLETED → CLOSED
```

must still follow the defined lifecycle.

---

# 54. User Management

Potential endpoints:

```text
GET  /api/users
POST /api/users
GET  /api/users/{id}
PUT  /api/users/{id}
```

Manager-only operations should be protected.

User creation must:

1. Validate email.
2. Hash password.
3. Validate role.
4. Prevent duplicate email.
5. Persist user.
6. Never return password hash.

---

# 55. Customer Access Isolation

Customer users must only access:

```text
Their own customer
Their own sites
Their own work orders
Their own request history
```

The backend must derive customer ownership from the authenticated user.

Do not trust:

```text
customerId
```

provided by the browser as proof of ownership.

Correct:

```text
JWT user
   ↓
Authenticated User
   ↓
Associated Customer
   ↓
Authorized Resources
```

---

# 56. Customer Work Order Creation

Customer endpoint may use:

```text
POST /api/work-orders
```

or a dedicated:

```text
POST /api/customer-portal/requests
```

The backend must:

1. Identify authenticated customer.
2. Validate selected site.
3. Confirm site belongs to that customer.
4. Validate request data.
5. Create work order.
6. Set appropriate initial status.
7. Record creation information.

A customer must never be able to create a work order against another customer's site by simply changing an ID.

---

# 57. DTO Architecture

Do not expose JPA entities directly from controllers.

Use DTOs.

Example location:

```text
backend/src/main/java/com/zidio/keystone/dto/workorder/
```

Possible DTOs:

```text
WorkOrderResponse.java
CreateWorkOrderRequest.java
UpdateWorkOrderRequest.java
AssignWorkOrderRequest.java
ChangeWorkOrderStatusRequest.java
WorkOrderSummaryDto.java
```

Benefits:

* Prevent sensitive field exposure.
* Stabilize API contracts.
* Avoid serialization problems.
* Separate database schema from API schema.
* Support role-specific responses.

---

# 58. DTO Mapping

Recommended mapper location:

```text
backend/src/main/java/com/zidio/keystone/mapper/
```

Example:

```text
WorkOrderMapper.java
```

Responsibilities:

```text
Entity → DTO
DTO → Entity where appropriate
```

Business authorization should remain in services, not mappers.

---

# 59. Validation

Use Jakarta Bean Validation.

Example conceptual annotations:

```text
@NotBlank
@NotNull
@Email
@Size
@Positive
```

Validation belongs on request DTOs.

Example:

```text
CreateWorkOrderRequest.java
```

must validate required fields before service execution.

---

# 60. Business Validation

Bean validation is not enough.

The service layer must validate business relationships.

Examples:

```text
Does site belong to customer?

Can this user modify this work order?

Can this status transition occur?

Does this technician exist?

Does this technician have TECHNICIAN role?

Is enough inventory available?

Is this customer allowed to access this resource?
```

---

# 61. Transaction Management

Use Spring transactions for multi-step operations.

Important transactional operations:

```text
Work-order status transition
Assignment
Part usage
Inventory decrement
Work-order creation with related records
```

For example:

```text
@Transactional
changeStatus()
```

must ensure:

```text
WorkOrder update
+
StatusHistory insert
```

either both succeed or both fail.

---

# 62. Repository Layer

Repositories should extend Spring Data JPA interfaces where appropriate.

Example:

```text
backend/src/main/java/com/zidio/keystone/repository/WorkOrderRepository.java
```

Responsibilities:

* Query persistence.
* Pagination.
* Filtering.
* Sorting.
* Ownership-aware retrieval.

Do not place HTTP logic in repositories.

---

# 63. Work Order Querying

Work-order queries should support:

```text
Status
Priority
Customer
Site
Technician
Search
Pagination
Sorting
```

For complex combinations, use appropriate Spring Data mechanisms such as:

```text
Specifications
Criteria API
Query methods
Custom repository queries
```

Do not load every work order into memory and filter using Java collections.

---

# 64. API Controllers

Controller location:

```text
backend/src/main/java/com/zidio/keystone/controller/
```

Controllers should:

1. Receive HTTP request.
2. Validate DTO.
3. Obtain authenticated user.
4. Call service.
5. Return appropriate response.

Controllers should not:

```text
Directly manipulate repositories
Implement lifecycle rules
Modify inventory
Hash passwords manually
Construct complicated business decisions
```

---

# 65. HTTP Methods

Use conventional REST semantics.

```text
GET
POST
PUT
PATCH where justified
DELETE where appropriate
```

Examples:

```text
GET  /api/work-orders
GET  /api/work-orders/{id}

POST /api/work-orders
POST /api/work-orders/{id}/assign
POST /api/work-orders/{id}/status
POST /api/work-orders/{id}/parts
POST /api/work-orders/{id}/time
```

---

# 66. HTTP Status Codes

Use appropriate status codes.

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity where agreed
500 Internal Server Error
```

Do not return:

```text
200 OK
```

for every operation.

---

# 67. Global Error Handling

Create:

```text
backend/src/main/java/com/zidio/keystone/exception/GlobalExceptionHandler.java
```

Handle:

```text
Validation errors
Resource not found
Authentication failures
Authorization failures
Business rule violations
Invalid transitions
Inventory conflicts
Unexpected server errors
```

---

# 68. Structured API Errors

Recommended conceptual structure:

```json
{
  "timestamp": "2026-08-30T00:00:00Z",
  "status": 409,
  "message": "Invalid work-order status transition.",
  "path": "/api/work-orders/123/status"
}
```

Validation errors may include:

```json
{
  "timestamp": "...",
  "status": 400,
  "message": "Validation failed.",
  "fieldErrors": {
    "title": "Title is required.",
    "priority": "Priority is required."
  }
}
```

Never expose:

```text
Stack traces
Database connection strings
SQL errors
JWT secrets
Password hashes
Internal filesystem paths
```

---

# 69. 401 vs 403

Use:

```text
401 Unauthorized
```

when authentication is missing or invalid.

Use:

```text
403 Forbidden
```

when the authenticated user lacks permission.

Example:

```text
Technician attempts to close work order
        ↓
Authenticated ✓
        ↓
Permission ✗
        ↓
403 Forbidden
```

---

# 70. 404 Handling

When a requested resource does not exist:

```text
404 Not Found
```

Example:

```text
GET /api/work-orders/999999
```

Response should be structured and safe.

---

# 71. 409 Conflict

Use conflict responses for state/business conflicts.

Important cases:

```text
Invalid work-order transition
Insufficient stock
Duplicate resource where appropriate
Conflicting assignment/state
```

Example:

```text
POST /api/work-orders/{id}/status
```

when:

```text
CLOSED → IN_PROGRESS
```

is not permitted.

---

# 72. CORS

Configure CORS deliberately.

Development may permit the frontend development server.

Example conceptual origin:

```text
http://localhost:5173
```

Production must use the actual deployed frontend origin.

Do not use unrestricted:

```text
*
```

with credential-sensitive authentication configuration unless explicitly justified.

---

# 73. OpenAPI / Swagger

Create:

```text
backend/src/main/java/com/zidio/keystone/config/OpenApiConfig.java
```

The API should document:

* Authentication
* Endpoints
* Request DTOs
* Response DTOs
* Error responses
* Roles
* Pagination
* Filtering
* Work-order lifecycle

Swagger/OpenAPI should become the reference point for frontend integration.

---

# 74. API Contract

The backend team must define contracts for:

```text
Login response
JWT claims
User DTO
Customer DTO
Site DTO
WorkOrder DTO
Status values
Priority values
Assignment request
Status transition request
Status history
Part DTO
Part usage
Time logs
SLA
Notifications
Reports
Pagination
Errors
```

The frontend must not have to guess backend response structures.

---

# 75. Work Order API Summary

Core endpoints:

```text
POST /api/work-orders

GET /api/work-orders

GET /api/work-orders/{id}

PUT /api/work-orders/{id}

POST /api/work-orders/{id}/assign

POST /api/work-orders/{id}/status

GET /api/work-orders/{id}/history

POST /api/work-orders/{id}/parts

GET /api/work-orders/{id}/parts

POST /api/work-orders/{id}/time

GET /api/work-orders/{id}/time
```

Additional endpoints may be added when required by the final design.

---

# 76. Customer API Summary

```text
GET  /api/customers
POST /api/customers
GET  /api/customers/{id}
PUT  /api/customers/{id}

GET  /api/customers/{id}/sites
POST /api/customers/{id}/sites
```

---

# 77. User API Summary

```text
GET  /api/users
POST /api/users
GET  /api/users/{id}
PUT  /api/users/{id}
```

Manager/Admin authorization required where appropriate.

---

# 78. Parts API Summary

```text
GET  /api/parts
POST /api/parts
PUT  /api/parts/{id}

GET  /api/work-orders/{id}/parts
POST /api/work-orders/{id}/parts
```

---

# 79. Reports API

Create:

```text
backend/src/main/java/com/zidio/keystone/controller/ReportController.java
```

Service:

```text
backend/src/main/java/com/zidio/keystone/service/ReportService.java
```

Potential endpoint:

```text
GET /api/reports/summary
```

Potential information:

```text
Counts by status
Open work
Overdue work
SLA compliance
Workload by technician
Workload by site
```

Reports must be calculated from actual persisted data.

Never return hard-coded statistics.

---

# 80. Dashboard Summary

Potential response:

```text
totalOpen
overdue
slaCompliance
statusCounts
technicianBreakdown
siteBreakdown
```

If there is no data:

```text
0
```

or appropriate empty collections.

Do not fabricate:

```text
88% SLA compliance
42 open jobs
17 overdue
```

unless these values actually come from the database.

---

# 81. Reporting Authorization

Reports should be restricted to authorized roles.

Typical access:

```text
MANAGER
```

Potentially:

```text
DISPATCHER
```

for operational views where explicitly required.

Technicians and customers must not receive management-wide reports unless specifically authorized.

---

# 82. SLA Monitoring API

Potential endpoint:

```text
GET /api/reports/sla
```

Potential filters:

```text
status
customerId
siteId
technicianId
from
to
```

The backend must calculate results from persisted work orders/SLA information.

---

# 83. Auditability

Important business actions should leave a trace.

At minimum:

```text
Work-order status changes
Assignment changes
Part usage
Time logging
```

Status history provides the primary lifecycle audit trail.

Where required, additional audit logging can be introduced.

---

# 84. Date and Time Handling

Use timezone-aware date/time types where appropriate.

Recommended:

```text
OffsetDateTime
Instant
```

depending on the agreed persistence/API strategy.

Avoid ambiguous local timestamps.

All timestamps returned through the API should use a consistent representation.

---

# 85. Entity Relationships

Conceptual model:

```text
User
 |
 +---- WorkOrder.assignee
 |
 +---- StatusHistory.changedBy
 |
 +---- TimeLog.technician
 |
 +---- PartUsage.recordedBy

Customer
 |
 +---- Site
       |
       +---- WorkOrder

WorkOrder
 |
 +---- StatusHistory
 |
 +---- PartUsage
 |
 +---- TimeLog
```

Relationships must be carefully configured to avoid accidental cascading/deletion of important historical records.

---

# 86. Deletion Policy

Do not automatically delete historical records when a parent entity is deleted.

For example:

```text
Deleting a work order
```

must not casually erase:

```text
Status history
Time logs
Part usage
```

The final deletion/archival policy must be agreed by the project.

For important operational records, cancellation or deactivation may be preferable to physical deletion.

---

# 87. Database Constraints

Database constraints should reinforce application rules where practical.

Examples:

```text
Unique user email
Non-null required fields
Foreign-key relationships
Valid quantities
```

The application should still perform user-friendly validation before database constraints fail.

---

# 88. Concurrency

The backend must consider concurrent requests.

Important examples:

```text
Two technicians attempt to consume the last part.
Two users attempt conflicting status transitions.
Two dispatchers modify the same work order.
```

Transactions and appropriate locking/optimistic concurrency strategies should be used where required.

Inventory is particularly sensitive to race conditions.

---

# 89. Inventory Concurrency

Example:

```text
Stock = 1

Technician A requests 1
Technician B requests 1
```

The backend must not allow:

```text
Stock = -1
```

because both requests read stock before either update completed.

Use appropriate transactional/locking strategy.

---

# 90. Work Order Concurrency

Example:

```text
Current status = IN_PROGRESS

Request A → COMPLETED
Request B → ON_HOLD
```

The backend must ensure the final state is consistent with the lifecycle rules.

Invalid concurrent transitions should fail safely rather than silently overwriting each other.

---

# 91. Security Boundary

The backend must assume the client is hostile.

A malicious client can send:

```text
curl
Postman
browser DevTools
custom scripts
modified JWT attempts
manually crafted JSON
```

Therefore the backend must independently validate:

```text
Identity
Role
Ownership
Resource existence
Lifecycle state
Inventory
Input
Permissions
```

---

# 92. Never Trust Client-Supplied Identity

Do not accept:

```text
userId
technicianId
customerId
```

as authoritative identity when the identity can be derived from authentication.

Correct:

```text
JWT
 ↓
Authenticated Principal
 ↓
Backend identity
```

The client may request an operation against a resource, but authorization must derive from the authenticated principal.

---

# 93. Technician Assignment Security

A technician should not be able to send:

```json
{
  "technicianId": "another-technician"
}
```

to change their own assignment.

Assignment endpoints must be restricted to:

```text
DISPATCHER
MANAGER
```

---

# 94. Customer Ownership Security

A customer should not be able to send:

```text
customerId = anotherCustomer
```

and access another organization's data.

The backend must derive customer ownership from authenticated identity and verify resource relationships.

---

# 95. API Data Isolation

Repository queries should preferably enforce ownership at the query/service level.

Avoid:

```text
SELECT all work orders
        ↓
filter in frontend
```

For customer/technician-specific endpoints, query only authorized records.

---

# 96. No Fake Backend Data

The backend must not contain fabricated production records such as:

```text
ABC Industries
John Smith
Mumbai Office
WO-1001
$12,450 revenue
88% SLA
```

unless they are explicitly defined as:

```text
seed data
test data
development fixtures
```

Production business data must originate from actual application operations/database records.

---

# 97. Seed Data Policy

If development seed data is required, keep it clearly separated from production behavior.

Possible location:

```text
backend/src/test/
```

or an explicitly development-only mechanism.

Never silently insert fake customers/work orders every time the application starts.

---

# 98. Service Layer

Services should represent business use cases.

Example:

```text
WorkOrderService
```

may expose:

```text
createWorkOrder()
getWorkOrder()
getWorkOrders()
updateWorkOrder()
```

Assignment:

```text
AssignmentService
```

may expose:

```text
assign()
reassign()
```

Status:

```text
WorkOrderStatusService
```

may expose:

```text
changeStatus()
```

Parts:

```text
PartService
```

may expose:

```text
addPartUsage()
getPartUsage()
manageInventory()
```

---

# 99. Authentication Service

Create:

```text
backend/src/main/java/com/zidio/keystone/service/AuthService.java
```

Responsibilities:

```text
Authenticate user
Verify password
Check enabled state
Generate JWT
Return authentication DTO
```

It should not handle HTTP responses directly.

---

# 100. Exception Design

Recommended exceptions:

```text
ResourceNotFoundException
BusinessRuleException
InvalidStatusTransitionException
InsufficientStockException
UnauthorizedOperationException
```

Location:

```text
backend/src/main/java/com/zidio/keystone/exception/
```

Exceptions should represent business failures clearly enough for the global exception handler to map them to HTTP responses.

---

# 101. Logging

Use structured application logging.

Log useful operational information:

```text
Request failures
Business rule failures
Unexpected exceptions
Important system events
```

Never log:

```text
Passwords
JWT secrets
Password hashes
Sensitive authentication credentials
```

Avoid excessive SQL/debug logging in production.

---

# 102. Actuator

Spring Boot Actuator may be used for operational health.

Potential endpoint:

```text
GET /actuator/health
```

The endpoint should not expose sensitive environment information.

Production actuator exposure must be explicitly configured.

---

# 103. Health Check

The backend should provide a simple health mechanism.

Conceptually:

```text
GET /actuator/health
```

Expected healthy result should indicate the application is operational.

Database health may be included according to the deployment requirements.

---

# 104. Testing Strategy

Backend testing should occur at multiple levels.

## Unit tests

Test:

```text
Services
Lifecycle rules
Validation logic
SLA calculations
Inventory logic
Authorization rules
```

## Integration tests

Test:

```text
Controllers
Database persistence
Repositories
Security
Transactions
Flyway
```

## End-to-end/API tests

Test complete workflows:

```text
Login
Create customer
Create site
Create work order
Assign technician
Start job
Log part
Log time
Complete
Close
```

---

# 105. Authentication Tests

Test:

```text
Valid login
Invalid password
Unknown email
Disabled user
JWT validation
Expired JWT
Missing JWT
Malformed JWT
```

---

# 106. Authorization Tests

Test:

```text
Dispatcher access
Technician access
Manager access
Customer access
Unauthorized role
Cross-customer access
Cross-technician access
```

Critical security tests should verify that authorization cannot be bypassed by manipulating IDs.

---

# 107. Work Order Tests

Test:

```text
Create work order
Invalid customer
Invalid site
Site/customer mismatch
Update open work order
Assign technician
Invalid assignment
Start job
Hold job
Resume job
Complete job
Close job
Cancel job
Invalid transitions
```

---

# 108. Inventory Tests

Test:

```text
Add part usage
Correct stock decrement
Zero quantity rejection
Negative quantity rejection
Insufficient stock
Concurrent consumption where appropriate
Transaction rollback
```

---

# 109. Time Log Tests

Test:

```text
Valid time entry
Zero minutes
Negative minutes
Unauthorized technician
Time against another technician's job
```

---

# 110. SLA Tests

Test:

```text
Within SLA
At risk
Breached
Boundary timestamps
Completed work
Closed work
```

---

# 111. API Integration Tests

Important endpoints:

```text
POST /api/auth/login

GET /api/work-orders
POST /api/work-orders
GET /api/work-orders/{id}

POST /api/work-orders/{id}/assign
POST /api/work-orders/{id}/status

POST /api/work-orders/{id}/parts
POST /api/work-orders/{id}/time

GET /api/reports/summary
```

---

# 112. Database Testing

Tests should verify:

```text
Entities persist
Relationships work
Foreign keys behave correctly
Flyway migrations execute
Transactions roll back correctly
Pagination works
Filtering works
```

Testcontainers can be considered for realistic PostgreSQL integration testing.

---

# 113. Maven Build

Backend root:

```text
backend/
```

Build/test command:

```text
.\mvnw.cmd clean test
```

A successful build should end with:

```text
BUILD SUCCESS
```

The current repository has already demonstrated a successful:

```text
.\mvnw.cmd clean test
```

run after fixing the `User.java` compilation issues.

---

# 114. Build Definition of Done

A backend change is not complete merely because it compiles.

It should satisfy:

```text
Compilation
+
Unit tests
+
Integration tests where applicable
+
Validation
+
Authorization
+
Database migration
+
API contract
+
Error handling
```

---

# 115. Backend API Documentation

The backend README should document:

```text
Project setup
Java version
Maven commands
PostgreSQL setup
Environment variables
Database migrations
Running locally
Testing
Swagger/OpenAPI
Authentication
API endpoints
Roles
```

Location:

```text
backend/README.md
```

---

# 116. Environment Example

Create:

```text
backend/.env.example
```

or document environment variables in:

```text
backend/README.md
```

Conceptual variables:

```text
DATABASE_URL=
DATABASE_USERNAME=
DATABASE_PASSWORD=
JWT_SECRET=
JWT_EXPIRATION=
```

Never commit real values.

---

# 117. Git Rules

Do not commit:

```text
.env
Production credentials
JWT secrets
Database passwords
target/
IDE metadata
Generated build artifacts
```

Recommended `.gitignore` should cover:

```text
target/
.idea/
.vscode/
*.iml
.env
```

The exact repository-wide Git policy should follow the project's existing configuration.

---

# 118. Backend Development Phases

## Phase 1 — Foundation

Build:

1. Spring Boot project
2. Maven configuration
3. PostgreSQL connection
4. Flyway
5. Base package structure
6. Security configuration
7. User entity
8. Role enum
9. JWT authentication
10. Global exception handling
11. Validation
12. OpenAPI

Deliverable:

```text
Running Spring Boot API
+
PostgreSQL
+
Flyway
+
JWT authentication
```

---

# 119. Phase 2 — Core Domain

Build:

1. Customer entity
2. Site entity
3. WorkOrder entity
4. WorkOrderStatus enum
5. Priority enum
6. Repositories
7. DTOs
8. Mappers
9. Services
10. Controllers
11. Pagination
12. Filtering
13. Sorting

Deliverable:

```text
Customer → Site → Work Order
```

fully represented through the REST API.

---

# 120. Phase 3 — Workflow

Build:

1. Assignment
2. Technician authorization
3. Status transitions
4. Status history
5. Technician jobs
6. Parts
7. Part usage
8. Inventory transactions
9. Time logging

Deliverable:

```text
Dispatcher
   ↓
Assignment
   ↓
Technician
   ↓
Start
   ↓
Parts / Time
   ↓
Complete
```

---

# 121. Phase 4 — SLA and Management

Build:

1. SLA model
2. SLA calculation
3. At-risk detection
4. Breach detection
5. Notifications
6. Manager dashboard API
7. Reports
8. Technician workload
9. Site workload
10. Operational summaries

Deliverable:

```text
Operational management API
+
SLA visibility
+
Reporting
```

---

# 122. Phase 5 — Customer Portal Backend

Build:

1. Customer authentication
2. Customer ownership model
3. Customer site access
4. Customer request creation
5. Customer work-order access
6. Customer status history
7. Customer-safe DTOs

Deliverable:

```text
Customer
   ↓
Own Sites
   ↓
Create Request
   ↓
Track Work Order
```

---

# 123. Phase 6 — Hardening

Build:

1. Security testing
2. Authorization testing
3. Transaction testing
4. Concurrency testing
5. API documentation
6. Error consistency
7. Performance review
8. Database indexes
9. Production configuration
10. Deployment configuration
11. Logging/monitoring
12. Final integration with frontend

Deliverable:

```text
Production-ready backend API
```

---

# 124. Backend Work Breakdown

## Authentication

```text
User
Role
Password hashing
Login
JWT
Security filter
Security configuration
```

## Customers

```text
Customer entity
Customer repository
Customer service
Customer controller
Customer DTO
Customer validation
```

## Sites

```text
Site entity
Customer relationship
Site repository
Site service
Site controller
Ownership validation
```

## Work Orders

```text
WorkOrder entity
Status
Priority
Creation
Update
List
Search
Filtering
Sorting
Pagination
Details
```

## Dispatch

```text
Assignment
Reassignment
Technician lookup
Authorization
```

## Technician

```text
Assigned jobs
Start
Hold
Resume
Complete
Parts
Time
```

## Lifecycle

```text
Transition validation
Status update
Status history
Transactional changes
```

## Inventory

```text
Part
Stock
Part usage
Stock decrement
Concurrency
```

## SLA

```text
Due date
SLA status
At risk
Breached
Monitoring
```

## Management

```text
Users
Reports
Dashboard summary
Workload
SLA reporting
```

## Customer Portal

```text
Customer ownership
Requests
Own work orders
Status history
```

---

# 125. Backend Definition of Done

A backend feature is complete when:

* It compiles.
* Automated tests pass.
* Database schema is migrated through Flyway.
* Request DTOs validate input.
* Service layer enforces business rules.
* Authorization is implemented.
* Ownership checks are implemented where required.
* Controllers return appropriate HTTP status codes.
* Errors are structured.
* Entities are not exposed directly.
* Sensitive fields are not returned.
* Transactions are used where required.
* Pagination is implemented for large collections.
* API documentation is updated.
* No production fake data is introduced.
* No credentials are committed.
* The frontend contract is documented.
* Integration tests exist for important workflows.

---

# 126. Backend Contract Dependencies

The backend team must coordinate with the frontend team on:

1. Login response
2. JWT claims
3. Role values
4. User DTO
5. Customer DTO
6. Site DTO
7. WorkOrder DTO
8. Status values
9. Priority values
10. Assignment request
11. Status request
12. Status history response
13. Parts response
14. Part usage request
15. Time log request
16. SLA response
17. Notification response
18. Dashboard response
19. Pagination format
20. Error format
21. Attachment upload contract
22. CORS
23. Production API URL

Neither side should invent contract fields independently.

---

# 127. Conceptual API Architecture

```text
                         ┌──────────────────────┐
                         │       CLIENTS        │
                         │                      │
                         │ React SPA            │
                         │ Mobile Browser       │
                         │ API Clients          │
                         └──────────┬───────────┘
                                    │
                                    │ HTTPS
                                    │ REST + JWT
                                    ▼
              ┌────────────────────────────────────────┐
              │         SPRING BOOT REST API           │
              │                                        │
              │ Authentication                         │
              │ Authorization                          │
              │ Validation                             │
              │ Controllers                            │
              │                                        │
              │ Customers                              │
              │ Sites                                  │
              │ Work Orders                            │
              │ Dispatch                               │
              │ Technician Workflow                    │
              │ Parts / Inventory                      │
              │ Time Logs                              │
              │ SLA                                    │
              │ Reports                                │
              │ Notifications                           │
              └───────────────────┬────────────────────┘
                                  │
                                  ▼
              ┌────────────────────────────────────────┐
              │             SERVICE LAYER              │
              │                                        │
              │ Business Rules                         │
              │ Lifecycle Enforcement                  │
              │ Authorization Checks                   │
              │ Transactions                            │
              │ SLA Logic                              │
              │ Inventory Logic                        │
              └───────────────────┬────────────────────┘
                                  │
                                  ▼
              ┌────────────────────────────────────────┐
              │          SPRING DATA JPA               │
              │                                        │
              │ Repositories                           │
              │ Pagination                             │
              │ Filtering                              │
              │ Sorting                                │
              └───────────────────┬────────────────────┘
                                  │
                                  ▼
              ┌────────────────────────────────────────┐
              │             POSTGRESQL                  │
              │                                        │
              │ Users                                  │
              │ Customers                              │
              │ Sites                                  │
              │ Work Orders                            │
              │ Status History                          │
              │ Parts                                  │
              │ Part Usage                             │
              │ Time Logs                              │
              │ Notifications                           │
              └────────────────────────────────────────┘
                                  ▲
                                  │
                          Flyway migrations
```

---

# 128. Complete Backend User Journeys

## Dispatcher

```text
Login
 ↓
JWT issued
 ↓
View dashboard
 ↓
Create customer
 ↓
Create site
 ↓
Create work order
 ↓
Assign technician
 ↓
Monitor status
 ↓
Monitor SLA
```

---

## Technician

```text
Login
 ↓
JWT issued
 ↓
View assigned jobs
 ↓
Open work order
 ↓
Start
 ↓
Log parts
 ↓
Log time
 ↓
Hold/resume if required
 ↓
Complete
```

---

## Manager

```text
Login
 ↓
Dashboard
 ↓
Review open work
 ↓
Review overdue work
 ↓
Review SLA
 ↓
Inspect work order
 ↓
Close completed work
 ↓
Review reports
```

---

## Customer

```text
Login
 ↓
JWT issued
 ↓
Customer context identified
 ↓
View own sites
 ↓
Create request
 ↓
Track work order
 ↓
View status history
```

---

# 129. Backend Security Architecture

The security model should ultimately look like:

```text
                    HTTP Request
                         |
                         v
                 ┌───────────────┐
                 │ JWT Validation│
                 └───────┬───────┘
                         |
                         v
                 ┌───────────────┐
                 │ Authenticated │
                 │    User       │
                 └───────┬───────┘
                         |
                         v
                 ┌───────────────┐
                 │ Role Check    │
                 └───────┬───────┘
                         |
                         v
                 ┌───────────────┐
                 │ Ownership /   │
                 │ Business Rule │
                 └───────┬───────┘
                         |
                    ┌────┴────┐
                    │         │
                   ALLOW     DENY
                    │         │
                    v         v
                 Service    403/409
                    |
                    v
                PostgreSQL
```

---

# 130. Final Backend Architecture

The target backend architecture is:

```text
                    ┌──────────────────────┐
                    │       USERS          │
                    │                      │
                    │ Dispatcher           │
                    │ Technician           │
                    │ Manager/Admin        │
                    │ Customer             │
                    └──────────┬───────────┘
                               │
                               ▼
              ┌────────────────────────────────┐
              │ React + TypeScript Frontend    │
              └───────────────┬────────────────┘
                              │
                              │ HTTPS
                              │ REST + JWT
                              ▼
              ┌────────────────────────────────┐
              │ Spring Boot Backend            │
              │                                │
              │ Security                       │
              │ Controllers                    │
              │ DTOs                           │
              │ Services                       │
              │ Business Rules                 │
              │ Validation                     │
              │ Exception Handling             │
              └───────────────┬────────────────┘
                              │
                              ▼
              ┌────────────────────────────────┐
              │ Spring Data JPA / Hibernate    │
              │                                │
              │ Repositories                   │
              │ Pagination                     │
              │ Filtering                      │
              │ Sorting                        │
              └───────────────┬────────────────┘
                              │
                              ▼
              ┌────────────────────────────────┐
              │ PostgreSQL                     │
              │                                │
              │ Users                          │
              │ Customers                      │
              │ Sites                          │
              │ Work Orders                    │
              │ Status History                 │
              │ Parts                          │
              │ Part Usage                     │
              │ Time Logs                      │
              │ Notifications                  │
              └────────────────────────────────┘
                              ▲
                              │
                              │
              ┌────────────────────────────────┐
              │ Flyway                         │
              │ Database Migrations             │
              └────────────────────────────────┘
```

---

# 131. Final Backend Rule

The backend must be the **single authoritative source of truth for KEYSTONE business operations**.

The fundamental rule is:

```text
Frontend request
       ↓
Authentication
       ↓
Authorization
       ↓
Validation
       ↓
Business rules
       ↓
Transaction
       ↓
Database
       ↓
API response
       ↓
Frontend
```

Never:

```text
Frontend
   ↓
"trust the UI"
   ↓
Database
```

The backend must independently enforce every important rule.

The frontend may hide unauthorized controls for usability, but the backend must assume that every request could have been manually crafted.

The most important backend areas to prioritize are:

1. Authentication and JWT security
2. Role-based authorization
3. Customer/site ownership
4. Work-order domain
5. Work-order lifecycle enforcement
6. Technician assignment and ownership
7. Status history
8. Parts and transactional inventory
9. Time logging
10. SLA logic
11. Manager reporting
12. Customer isolation
13. Structured errors
14. Pagination/filtering/sorting
15. Flyway migrations
16. Automated testing
17. OpenAPI documentation
18. Transaction/concurrency safety

These directly correspond to the required KEYSTONE platform capabilities and provide the backend contract that the React frontend should consume.
