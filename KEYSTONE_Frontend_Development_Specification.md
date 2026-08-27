# Project KEYSTONE — Frontend Development Specification

## 1. Document Purpose

This document defines the complete frontend scope for **Project KEYSTONE**, a Field Service Management Platform for Meridian Facilities Management.

The frontend is a **React + TypeScript SPA**. It provides role-specific interfaces for:

- Dispatcher
- Technician
- Manager / Admin
- Customer

The backend is responsible for authentication, authorization, validation, business rules, work-order lifecycle enforcement, SLA logic, and persistence. The frontend must consume the REST API and must **not be treated as the security boundary**.

The project brief specifies the technology stack as React + TypeScript (Vite) for the frontend and Spring Boot 3 / Java 21, Spring Security + JWT, Spring Data JPA, PostgreSQL, and Flyway on the backend.

---

# 2. Frontend Goals

The frontend should provide a single responsive application that changes its navigation and available actions according to the authenticated user's role.

Primary goals:

1. Provide a clean login and authentication experience.
2. Provide role-specific dashboards.
3. Allow dispatchers and managers to manage customers, sites, and work orders.
4. Provide a Kanban work-order board.
5. Provide technicians with a mobile-friendly field view.
6. Allow technicians to update job status, log time, and log parts.
7. Display SLA information and warnings.
8. Provide managers with operational dashboards and reports.
9. Provide customers with a restricted self-service portal.
10. Display work-order status history.
11. Handle loading, empty, validation, authorization, and error states.
12. Integrate with the real Spring Boot REST API when endpoints are available.

---

# 3. Important Data Rule

## Do not use fake business data

The frontend must **not invent realistic-looking customers, technicians, work orders, parts, SLA numbers, or dashboard statistics** and present them as if they came from the backend.

Instead, during frontend development use **placeholder data only for UI development**.

### Placeholder data means

Placeholder data is clearly identifiable UI scaffolding used to build and test components before the backend endpoint is connected.

Examples:

- `Customer Name`
- `Customer Company`
- `Site Address`
- `WO-XXXX`
- `Technician Name`
- `Select technician`
- `0`
- `No work orders available`
- `SLA due date`
- `YYYY-MM-DD`

Do not create fake values such as:

- "ABC Industries"
- "John Smith"
- "HVAC breakdown at Mumbai Office"
- "$12,450 revenue"
- "88% SLA compliance"

unless those values are actually returned by the backend or explicitly supplied as seed/test data.

## API-first behavior

Once an API exists, all business data must come from the API.

Recommended flow:

```text
React UI
   |
   v
API Service Layer
   |
   v
Spring Boot REST API
   |
   v
PostgreSQL
```

The frontend should never connect directly to PostgreSQL.

---

# 4. Technology Stack

## Required

- React
- TypeScript
- Vite
- React Router
- CSS / CSS Modules or the team's chosen styling approach
- REST API integration
- JWT authentication
- Responsive design

## Backend integration

The frontend will consume endpoints such as:

```text
POST /api/auth/login

GET  /api/customers
POST /api/customers

GET  /api/customers/{id}/sites
POST /api/customers/{id}/sites

GET  /api/work-orders
POST /api/work-orders
GET  /api/work-orders/{id}
PUT  /api/work-orders/{id}

POST /api/work-orders/{id}/assign
POST /api/work-orders/{id}/status
POST /api/work-orders/{id}/parts
POST /api/work-orders/{id}/time

GET /api/reports/summary
```

The project brief states that the API should support pagination, sorting, filtering, conventional HTTP methods/status codes, structured errors, and OpenAPI/Swagger documentation.

---

# 5. User Roles

## 5.1 Dispatcher

Dispatcher capabilities:

- Create customers
- Create sites
- Create work orders
- Edit open work orders
- Assign technicians
- Reassign open work orders
- View all jobs
- View Kanban board
- Search/filter/paginate work orders

Frontend navigation:

```text
Dashboard
Work Orders
Customers
Sites
Dispatch Board
```

---

## 5.2 Technician

Technician capabilities:

- View only assigned work orders
- Start a job
- Put a job on hold
- Resume a job
- Complete a job
- Log parts
- Log time
- Upload photos where supported
- View job context

The technician interface must be responsive and usable on a phone.

Frontend navigation:

```text
My Jobs
Job Details
Notifications
Profile
```

A technician must not receive a frontend action for:

- Reassigning jobs
- Closing jobs
- Managing users
- Managing inventory

The backend still has to enforce these restrictions even if the frontend hides the controls.

---

## 5.3 Manager / Admin

Manager/Admin capabilities:

- Everything available to dispatchers
- Close completed jobs
- Manage users
- Manage parts
- View all reports
- View SLA compliance
- View overdue work
- View workload by technician/site

Frontend navigation:

```text
Dashboard
Work Orders
Dispatch Board
Customers
Sites
Technicians / Users
Parts
Reports
SLA Monitoring
```

---

## 5.4 Customer

Customer capabilities:

- Create requests for their own sites
- View their own work orders
- View work-order status
- View status history

Customers must not see:

- Other customers
- Internal fields
- Internal operational information
- Administrative controls

Frontend navigation:

```text
My Requests
Create Request
Request Details
Profile
```

---

# 6. Application Structure

Recommended structure:

```text
frontend/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.tsx
│   │   └── providers/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── forms/
│   │   ├── tables/
│   │   ├── modals/
│   │   ├── cards/
│   │   └── feedback/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── customers/
│   │   ├── sites/
│   │   ├── workOrders/
│   │   ├── dispatch/
│   │   ├── technician/
│   │   ├── parts/
│   │   ├── timeLogs/
│   │   ├── sla/
│   │   ├── reports/
│   │   └── customerPortal/
│   │
│   ├── layouts/
│   │   ├── AuthLayout.tsx
│   │   ├── DashboardLayout.tsx
│   │   └── CustomerLayout.tsx
│   │
│   ├── pages/
│   │   ├── Login/
│   │   ├── Dashboard/
│   │   ├── WorkOrders/
│   │   ├── Customers/
│   │   ├── Sites/
│   │   ├── Dispatch/
│   │   ├── Technician/
│   │   ├── Parts/
│   │   ├── Reports/
│   │   └── CustomerPortal/
│   │
│   ├── services/
│   │   ├── apiClient.ts
│   │   ├── authApi.ts
│   │   ├── customerApi.ts
│   │   ├── workOrderApi.ts
│   │   ├── partsApi.ts
│   │   ├── timeLogApi.ts
│   │   └── reportApi.ts
│   │
│   ├── types/
│   │   ├── auth.ts
│   │   ├── customer.ts
│   │   ├── site.ts
│   │   ├── workOrder.ts
│   │   ├── part.ts
│   │   ├── timeLog.ts
│   │   └── report.ts
│   │
│   ├── hooks/
│   ├── utils/
│   ├── constants/
│   └── main.tsx
│
├── public/
├── .env.example
├── package.json
└── README.md
```

The exact folder structure can be adjusted, but feature boundaries should remain clear.

---

# 7. Global Application Layout

Use a dashboard-style application shell for internal users.

```text
┌────────────────────────────────────────────────────────────┐
│ KEYSTONE                         Notifications   User Menu │
├───────────────┬────────────────────────────────────────────┤
│               │                                            │
│ Dashboard     │                                            │
│ Work Orders   │              PAGE CONTENT                  │
│ Dispatch      │                                            │
│ Customers     │                                            │
│ Sites         │                                            │
│ Parts         │                                            │
│ Reports       │                                            │
│               │                                            │
│ Settings      │                                            │
│               │                                            │
└───────────────┴────────────────────────────────────────────┘
```

The sidebar must be role-aware.

Do not create four separate applications. Use a shared application shell with role-specific navigation and pages.

---

# 8. Authentication

## Login Screen

Fields:

- Email
- Password

Actions:

- Login
- Loading state
- Validation messages

Expected API:

```text
POST /api/auth/login
```

Expected conceptual response:

```text
JWT + role
```

Do not hard-code a JWT.

After successful authentication:

```text
Login
  ↓
Receive JWT + role
  ↓
Store authentication state
  ↓
Load role-specific application
```

---

# 9. Authentication State

Create an authentication context/store containing:

```typescript
type Role =
  | "DISPATCHER"
  | "TECHNICIAN"
  | "MANAGER"
  | "CUSTOMER";

interface AuthUser {
  id: string;
  email: string;
  role: Role;
}
```

Do not assume the exact backend response shape until the API contract is finalized.

The frontend should have:

- `isAuthenticated`
- `user`
- `role`
- `token`
- `login()`
- `logout()`

Protected routes should redirect unauthenticated users to `/login`.

Role-protected routes should prevent inappropriate UI access.

Again, frontend route protection is for UX. Backend authorization remains authoritative.

---

# 10. API Client

Create a central API client.

Responsibilities:

- Base URL configuration
- Authorization header
- JSON handling
- HTTP errors
- Authentication failures
- Consistent response parsing

Example request:

```text
Authorization: Bearer <JWT>
```

Base URL should come from environment configuration:

```text
VITE_API_BASE_URL
```

Example:

```text
VITE_API_BASE_URL=http://localhost:8080
```

Do not commit real production secrets.

---

# 11. Work Order Domain

The work order is the central frontend feature.

Conceptual model:

```typescript
interface WorkOrder {
  id: string;
  code: string;
  title: string;
  description: string;
  priority: string;
  status: WorkOrderStatus;
  customerId: string;
  siteId: string;
  assigneeId?: string;
  slaDueDate?: string;
}
```

Status values:

```text
NEW
ASSIGNED
IN_PROGRESS
ON_HOLD
COMPLETED
CLOSED
CANCELLED
```

Do not add additional lifecycle states unless the backend specification is changed.

---

# 12. Work Order List

Page:

```text
/work-orders
```

Features:

- Search
- Status filter
- Priority filter
- Customer filter
- Site filter
- Technician filter where permitted
- Sorting
- Pagination
- Loading state
- Empty state
- Error state

Do not load an unlimited number of records.

The backend specifically requires paginated list endpoints.

Placeholder state:

```text
Search work orders...
Filter by status
Filter by priority
Filter by customer
```

Empty state:

```text
No work orders available.
```

This is preferable to inventing example work orders.

---

# 13. Work Order Board

Page:

```text
/dispatch
```

Use a Kanban board.

Columns:

```text
NEW
ASSIGNED
IN PROGRESS
ON HOLD
COMPLETED
```

Terminal states can be shown separately if required:

```text
CLOSED
CANCELLED
```

Card information:

- Work-order code
- Title
- Priority
- Customer
- Site
- Assignee
- SLA status

Data must come from the backend.

The frontend should not independently decide whether a transition is legal.

---

# 14. Work Order Details

Page:

```text
/work-orders/:id
```

Suggested sections:

## Header

- Work-order code
- Title
- Current status
- Priority
- SLA status

## Job information

- Description
- Customer
- Site
- Assigned technician
- SLA due date

## Status history

Display:

```text
From → To
Changed by
Date/time
Optional note
```

Status history is append-only on the backend.

## Parts

Display:

- Part
- Quantity
- Cost where provided

## Time

Display:

- Minutes
- Note
- Technician
- Timestamp

## Actions

Actions must depend on role and current state.

---

# 15. Lifecycle UI Rules

The frontend should visually guide the user toward valid actions.

Lifecycle:

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
 |         \ hold
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
NEW / appropriate open state
        |
        v
    CANCELLED
```

The exact permitted transitions must follow the backend implementation.

If the backend returns:

```text
409 Conflict
```

for an illegal transition, show a clear UI message such as:

```text
This status change is not allowed for the current work order.
```

Never silently change the local status.

---

# 16. Dispatcher UI

## Dispatcher Dashboard

Show operational information returned by the API.

Potential sections:

- Open work orders
- Unassigned work
- Work by status
- SLA risks
- Recent activity

If an endpoint is not yet available, use placeholder labels or empty states rather than invented statistics.

Example:

```text
Open Work Orders
--

Unassigned
--

SLA At Risk
--

Completed Today
--
```

The `--` values are placeholders, not fake statistics.

---

# 17. Customer Management

Page:

```text
/customers
```

Features:

- Customer list
- Search
- Pagination
- Create customer
- Edit customer
- Customer details
- Sites belonging to customer

Customer form should contain only fields supported by the backend model.

Do not invent business fields without agreement with the backend team.

---

# 18. Site Management

Page:

```text
/sites
```

A site must belong to a customer.

UI relationship:

```text
Customer
   |
   └── Sites
          |
          └── Work Orders
```

Site creation should therefore require a customer selection.

The backend remains responsible for enforcing that a site belongs to a valid customer.

---

# 19. Create Work Order

Page/modal:

```text
/work-orders/new
```

Required conceptual fields from the brief:

- Title
- Description
- Priority
- Customer
- Site

Potential additional fields should only be included if agreed with the backend API.

Validation should occur both:

1. Client-side for immediate user feedback.
2. Server-side for authoritative validation.

Example placeholder form:

```text
Title: [ Enter work-order title ]

Description:
[ Enter description ]

Priority:
[ Select priority ]

Customer:
[ Select customer ]

Site:
[ Select site ]

[ Create Work Order ]
```

Do not prefill the form with fake customer/site records.

---

# 20. Technician Field View

The technician view is one of the most important frontend experiences.

It must be optimized for mobile browsers.

Page:

```text
/my-jobs
```

Display only jobs assigned to the authenticated technician.

Job card:

```text
WORK ORDER
WO-XXXX

[Title placeholder]

Priority
SLA status
Site

[View Job]
```

Do not show another technician's jobs.

---

# 21. Technician Job Detail

Page:

```text
/my-jobs/:id
```

Sections:

- Work order information
- Customer/site information
- Current status
- SLA information
- Parts
- Time
- Photos/attachments where supported
- Status history

Large touch-friendly actions:

```text
[ Start Job ]

[ Put On Hold ]

[ Resume ]

[ Complete Job ]
```

The available actions should depend on the actual status.

---

# 22. Parts Logging

Technician action:

```text
Log Parts
```

Form:

```text
Part:
[ Select part ]

Quantity:
[ Enter quantity ]

[ Add Part ]
```

Backend behavior:

```text
Log Part Usage
+
Decrement Stock
=
Single Transaction
```

The frontend should display backend errors such as insufficient stock clearly.

Example:

```text
Unable to add part.
The requested quantity is not available.
```

Do not calculate or maintain authoritative inventory independently in the frontend.

---

# 23. Time Logging

Form:

```text
Minutes:
[ Enter minutes ]

Note:
[ Optional note ]

[ Log Time ]
```

The API records the time entry.

The frontend can display total time based on API response.

Do not create fake time entries.

---

# 24. SLA UI

Every work-order view should make SLA state easy to understand.

Possible states:

```text
Within SLA
At Risk
Breached
```

Only display these if the backend provides the necessary SLA information.

Show:

- SLA due date
- SLA status
- Breach indication
- Related notification where available

Manager dashboard should surface SLA breaches.

---

# 25. Manager Dashboard

Page:

```text
/dashboard
```

The brief requires managers to see:

- Counts by status
- Overdue work
- SLA compliance
- Breakdown by technician or site

Recommended layout:

```text
┌──────────────┬──────────────┬──────────────┐
│ Total Open   │ Overdue      │ SLA          │
│ --           │ --           │ --           │
└──────────────┴──────────────┴──────────────┘

┌──────────────────────────┐
│ Work Orders by Status    │
│          --              │
└──────────────────────────┘

┌──────────────────────────┐
│ SLA Compliance           │
│          --              │
└──────────────────────────┘

┌──────────────────────────┐
│ Technician / Site        │
│ Breakdown                │
│          --              │
└──────────────────────────┘
```

`--` means no backend data is available yet.

Once `/api/reports/summary` is connected, the dashboard must render live API values.

---

# 26. Customer Portal

The customer portal should be intentionally simpler than the internal application.

## Customer Dashboard

Show:

- Their requests
- Current status
- Recent history
- Create request button

## Create Request

The customer should select one of their own sites and provide the request information.

Example:

```text
Site:
[ Select your site ]

Title:
[ Enter request title ]

Description:
[ Describe the problem ]

Priority:
[ Select priority if permitted ]

[ Submit Request ]
```

After submission, the request enters the same work-order pipeline as internal work.

---

# 27. Customer Work Order Details

Customers can see:

- Work-order code
- Title
- Description
- Site
- Current status
- Status history
- Relevant progress information

Customers must not see internal fields that the backend does not expose to them.

The frontend should render only the DTO fields returned for the customer role.

---

# 28. Status History Component

Create a reusable component:

```text
StatusTimeline
```

Example structure:

```text
NEW
 │
 ├─ changed by: [API data]
 │  date: [API data]
 │
ASSIGNED
 │
 ├─ changed by: [API data]
 │  date: [API data]
 │
IN_PROGRESS
```

If there is no history:

```text
No status history available.
```

Never manufacture timeline entries.

---

# 29. Notifications

The brief allows email or in-app notifications.

Frontend should support an in-app notification presentation if the backend exposes notifications.

Potential notification types:

- Work order assigned
- SLA at risk
- SLA breached

Example empty state:

```text
No new notifications.
```

Do not simulate notifications with hard-coded fake events.

---

# 30. Global UI States

Every API-driven page must support four states.

## Loading

```text
Loading work orders...
```

Prefer skeletons for major dashboard/table sections.

## Empty

```text
No work orders found.
```

## Error

```text
Unable to load work orders.
Please try again.
```

## Success

Render API data.

This is explicitly important because the project requirements call for empty and loading states.

---

# 31. Form Validation

Client-side validation should provide immediate feedback.

Examples:

```text
Title is required.

Description is required.

Please select a customer.

Please select a site.

Please enter a valid number of minutes.
```

However, server-side validation remains authoritative.

For API validation errors, map structured field errors to the relevant inputs.

Do not display raw backend stack traces.

---

# 32. Error Handling

Centralize API error handling.

Handle at minimum:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Server Error
```

Recommended behavior:

### 400

Show validation errors.

### 401

Clear authentication state and redirect to login when appropriate.

### 403

Show:

```text
You do not have permission to perform this action.
```

### 404

Show:

```text
The requested resource could not be found.
```

### 409

Especially important for work-order lifecycle:

```text
This operation cannot be performed because the work order is in an invalid state for this action.
```

### 500

Show a generic error:

```text
Something went wrong on the server.
Please try again later.
```

Never expose stack traces.

---

# 33. Role-Based Routing

Conceptual routing:

```text
/login

/dashboard

/work-orders
/work-orders/new
/work-orders/:id

/dispatch

/customers
/customers/:id

/sites
/sites/:id

/my-jobs
/my-jobs/:id

/parts

/reports

/sla

/portal
/portal/requests
/portal/requests/new
/portal/requests/:id
```

Route availability:

| Route | Dispatcher | Technician | Manager | Customer |
|---|---:|---:|---:|---:|
| Dashboard | ✓ | Optional | ✓ | ✓ |
| Work Orders | ✓ | Assigned only | ✓ | Own only |
| Dispatch | ✓ | ✗ | ✓ | ✗ |
| Customers | ✓ | ✗ | ✓ | ✗ |
| Sites | ✓ | Relevant only | ✓ | Own only |
| My Jobs | ✗ | ✓ | ✗ | ✗ |
| Parts | ✗ | Job usage | ✓ | ✗ |
| Reports | ✗ | ✗ | ✓ | ✗ |
| Customer Portal | ✗ | ✗ | ✗ | ✓ |

This table describes the frontend experience. The backend must enforce the actual permissions.

---

# 34. Responsive Design

The frontend must support:

## Desktop

Primary audience:

- Dispatcher
- Manager

Use:

- Sidebar
- Tables
- Kanban board
- Dashboard cards
- Charts
- Filters

## Tablet

Use responsive layouts with collapsible navigation.

## Mobile

Primary audience:

- Technician
- Customer

Priorities:

- Large touch targets
- Simple navigation
- Minimal horizontal scrolling
- Readable cards
- Sticky primary actions where appropriate
- Responsive forms
- Mobile-friendly status controls

The brief explicitly states that the technician view should be usable on a phone.

---

# 35. Reusable Components

Build reusable components instead of duplicating UI.

Recommended:

```text
Button
Input
Select
Textarea
Modal
Drawer
Table
Pagination
SearchInput
FilterBar
StatusBadge
PriorityBadge
SlaBadge
LoadingSkeleton
EmptyState
ErrorState
ConfirmDialog
Toast
Card
StatCard
Timeline
WorkOrderCard
WorkOrderBoard
WorkOrderDetails
```

---

# 36. Design System

Use a consistent visual system.

## Typography

Use a modern sans-serif font.

Hierarchy:

```text
Page title
Section title
Card title
Body
Secondary text
Caption
```

## Status badges

Use visually distinct states:

```text
NEW
ASSIGNED
IN PROGRESS
ON HOLD
COMPLETED
CLOSED
CANCELLED
```

Do not rely on color alone. Include text/icons where appropriate for accessibility.

## Priority

Use:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

Only use values supported by the backend contract.

---

# 37. Accessibility

Frontend should follow basic accessibility requirements:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Labels for inputs
- Accessible buttons
- Sufficient contrast
- ARIA only where needed
- Do not rely exclusively on color
- Meaningful error messages
- Accessible modals
- Responsive text sizing

---

# 38. State Management

Use local component state for simple UI state.

Examples:

- Modal open/closed
- Input values
- Selected filters
- Temporary form state

Use a shared state solution/context where global state is needed.

Global state candidates:

```text
Authentication
Current user
Role
Token
Global notifications
```

Server data should remain conceptually separate from authentication/UI state.

---

# 39. API Service Organization

Keep API calls out of presentation components where practical.

Example:

```text
workOrderApi.ts

getWorkOrders()
getWorkOrder(id)
createWorkOrder(data)
updateWorkOrder(id, data)
assignWorkOrder(id, technicianId)
changeWorkOrderStatus(id, status)
addPartUsage(id, data)
addTimeLog(id, data)
```

Then pages/components consume these service functions.

This keeps components focused on presentation and interaction.

---

# 40. API Query Parameters

For list pages, support backend query parameters when available:

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

Example conceptual request:

```text
GET /api/work-orders?page=0&size=20&status=ASSIGNED
```

The exact parameter names must follow the backend API contract.

---

# 41. No Direct Database Access

Never implement:

```text
React → PostgreSQL
```

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

The frontend should have no database credentials.

---

# 42. Environment Configuration

Use environment variables.

Example:

```text
.env.example

VITE_API_BASE_URL=http://localhost:8080
```

Production values should be configured in the deployment environment.

Do not commit:

- JWT secrets
- Database passwords
- API secrets
- Production credentials

The frontend should never contain the PostgreSQL credentials or backend JWT signing secret.

---

# 43. Placeholder Development Mode

Until the backend endpoints are ready, build components using **explicit placeholder states**, not fake business records.

Recommended patterns:

### Empty state

```text
No data available
```

### Placeholder field

```text
Customer Name
```

### Placeholder ID

```text
WO-XXXX
```

### Placeholder metric

```text
--
```

### Placeholder date

```text
YYYY-MM-DD
```

### Disabled selection

```text
Select customer
```

This allows the UI to be built without creating misleading business data.

Once the API is available, replace placeholder states with API responses.

---

# 44. Mock API Policy

Do not create mock REST endpoints that pretend to be the production API.

Avoid:

```text
GET /mock/work-orders
```

Avoid hard-coded arrays such as:

```typescript
const workOrders = [
  {
    id: "1",
    title: "Fix HVAC"
  }
];
```

for the actual application flow.

If component-level testing requires sample objects, keep them inside test files or Storybook-style component fixtures and label them clearly as test fixtures.

Production application data must come from the real backend API.

---

# 45. Frontend Testing

Priority testing areas:

## Authentication

- Login success
- Invalid login
- Logout
- Expired authentication
- Protected routes

## Role access

- Dispatcher cannot access technician-only pages
- Technician sees only their assigned-job UI
- Customer sees only customer portal
- Manager sees management features

## Work order

- Create form validation
- Work-order list
- Filters
- Pagination
- Details
- Lifecycle action handling
- 409 error handling

## Technician

- Start
- Hold
- Resume
- Complete
- Parts
- Time

## Dashboard

- Loading
- Empty
- Error
- API data rendering

---

# 46. Frontend Definition of Done

A frontend feature is complete when:

- The page is responsive.
- The UI matches the agreed design.
- TypeScript has no avoidable type errors.
- Loading state exists.
- Empty state exists.
- Error state exists.
- Forms validate user input.
- API calls are isolated in service modules.
- Role-based UI is implemented.
- Backend authorization is not assumed to be replaced by frontend checks.
- No fake business data is used in the production flow.
- Placeholder data is clearly represented as placeholder UI.
- API responses are mapped to UI models.
- Unauthorized actions are handled gracefully.
- The feature works on desktop and, where relevant, mobile.
- The feature is tested.

---

# 47. Suggested Frontend Development Order

## Phase 1 — Foundation

Build:

1. Vite + React + TypeScript setup
2. Routing
3. Global layout
4. Sidebar
5. Header
6. Authentication screen
7. Authentication state
8. Protected routes
9. Role-based navigation
10. API client

Deliverable:

```text
Application shell + login + role-aware routing
```

---

## Phase 2 — Core Work Orders

Build:

1. Work-order types
2. API service
3. Work-order list
4. Search
5. Filters
6. Pagination
7. Work-order creation
8. Work-order details
9. Status badges
10. Kanban board

Deliverable:

```text
Work orders end-to-end through the UI
```

---

## Phase 3 — Workflow

Build:

1. Assignment UI
2. Technician field view
3. Lifecycle actions
4. Status timeline
5. Parts logging
6. Time logging
7. SLA display
8. Notifications

Deliverable:

```text
Dispatch → Technician → Completion workflow
```

---

## Phase 4 — Productization

Build:

1. Manager dashboard
2. Reports
3. Customer portal
4. Mobile polish
5. Empty/loading/error states
6. Accessibility improvements
7. Testing
8. Swagger/API integration verification
9. Deployment configuration

Deliverable:

```text
Complete role-specific production frontend
```

---

# 48. Frontend Work Breakdown

## Authentication

```text
Login
Auth context/store
JWT handling
Protected routes
Role routing
Logout
```

## Dispatcher

```text
Dashboard
Customer management
Site management
Work-order creation
Work-order list
Work-order details
Dispatch board
Assignment
Filters
Pagination
```

## Technician

```text
My jobs
Job details
Start
Hold
Resume
Complete
Parts
Time
Photos/attachments
Mobile responsive UI
```

## Manager

```text
Dashboard
Work-order overview
SLA monitoring
Reports
Users
Parts
Close work order
Operational breakdowns
```

## Customer

```text
Customer dashboard
Create request
My requests
Request details
Status history
```

---

# 49. Backend Contract Dependencies

The frontend team should coordinate with the backend team on:

1. Login response shape
2. JWT claims
3. Role enum values
4. User DTO
5. Customer DTO
6. Site DTO
7. WorkOrder DTO
8. WorkOrder status values
9. Priority values
10. Assignment request/response
11. Status transition request/response
12. Status history DTO
13. Part DTO
14. Part usage DTO
15. Time log DTO
16. SLA fields
17. Dashboard summary response
18. Notification response
19. Pagination format
20. Structured error format
21. Attachment/photo upload API
22. CORS configuration
23. Production API URL

Do not guess these contracts. Agree on them with the backend team before final integration.

---

# 50. API Integration Contract Example

A conceptual frontend contract can look like:

```typescript
interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface ApiError {
  timestamp: string;
  status: number;
  message: string;
  fieldErrors?: Record<string, string>;
}
```

This is only a frontend type example.

The actual implementation must match the backend's final JSON response.

---

# 51. Important Security Rules for Frontend

The frontend must assume users can manipulate requests directly.

Therefore:

- Do not trust role information only because a button is hidden.
- Do not trust IDs received from URL parameters.
- Do not assume a customer owns a site merely because it appears in the UI.
- Do not assume a technician can update a work order merely because it appears in their UI.
- Handle 401 and 403 responses correctly.
- Never store backend secrets in the frontend.
- Never expose database credentials.
- Never bypass API authorization.

The backend remains the authoritative security boundary.

---

# 52. Key Frontend User Journeys

## Dispatcher Journey

```text
Login
 ↓
Dashboard
 ↓
Create / view work order
 ↓
Select customer + site
 ↓
Assign technician
 ↓
Monitor Kanban board
 ↓
Track SLA/status
```

## Technician Journey

```text
Login
 ↓
My Jobs
 ↓
Open assigned work order
 ↓
Start
 ↓
Log parts/time
 ↓
Hold/resume if necessary
 ↓
Complete
```

## Manager Journey

```text
Login
 ↓
Dashboard
 ↓
Review open/overdue work
 ↓
Review SLA compliance
 ↓
Inspect work order
 ↓
Close completed job
 ↓
Review reports
```

## Customer Journey

```text
Login
 ↓
Customer Portal
 ↓
Create request
 ↓
Select own site
 ↓
Submit
 ↓
Track work order
 ↓
View status history
```

---

# 53. Final Frontend Architecture

The target frontend architecture should look like:

```text
                    ┌──────────────────────┐
                    │       USERS          │
                    │ Dispatcher           │
                    │ Technician           │
                    │ Manager/Admin        │
                    │ Customer             │
                    └──────────┬───────────┘
                               │
                               ▼
              ┌────────────────────────────────┐
              │ React + TypeScript SPA         │
              │                                │
              │ Role-Based Views               │
              │ Dashboard / Work Orders        │
              │ Dispatch / Technician          │
              │ Customer Portal / Reports      │
              └───────────────┬────────────────┘
                              │
                              │ HTTPS / REST / JWT
                              ▼
              ┌────────────────────────────────┐
              │ Spring Boot REST API           │
              │                                │
              │ Authentication                 │
              │ Authorization                  │
              │ Work Orders                    │
              │ Dispatch                       │
              │ Parts / Time                   │
              │ SLA / Reports                  │
              └───────────────┬────────────────┘
                              │
                              ▼
              ┌────────────────────────────────┐
              │ PostgreSQL                     │
              │                                │
              │ Users                          │
              │ Customers / Sites              │
              │ Work Orders                    │
              │ Status History                 │
              │ Parts / Usage                  │
              │ Time Logs                      │
              └────────────────────────────────┘
```

---

# 54. Final Rule

The frontend should be a **real API-driven React application**, not a collection of screens filled with fabricated records.

During development:

```text
Backend unavailable
        ↓
Use empty states / placeholders
        ↓
Build and test UI
        ↓
Backend endpoint becomes available
        ↓
Connect API service
        ↓
Render real API data
        ↓
Remove UI-only placeholder states
```

The final deployed application must use the live Spring Boot API and must reflect the actual PostgreSQL-backed data.

The most important frontend areas to prioritize are:

1. Authentication and RBAC UI
2. Work-order management
3. Dispatch board
4. Technician field experience
5. Work-order lifecycle UI
6. Parts/time logging
7. SLA visibility
8. Manager dashboard
9. Customer portal
10. Responsive/mobile usability
11. Loading/empty/error states
12. Clean API integration

These directly correspond to the platform's required features and acceptance criteria.
