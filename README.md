## Project-KEYSTONE-Field-Service-Management-Platform

Development repository for Project KEYSTONE, a field service management platform for facilities and maintenance operations.

The planned product is a responsive, role-based field service management platform for dispatchers, technicians, managers/admins, and customers. Its scope includes work order management, technician assignment and dispatch, SLA tracking, time logs, parts usage, customer/site management, operational dashboards, reporting, and audit/history tracking.

# Project documents
- Field Service Management Platform
- Developer Handover Pack
- Software Requirements Specification
- Suggested MVP

# Role-based authentication and authorization
JWT-based authentication with role-based access control and tenant/organization-aware data access.

# Work order management
Work order creation, assignment, status workflows, priorities, SLA tracking, technician execution, completion, and manager closure.

# Technician operations
Assigned work orders, status updates, time logging, parts usage, and job execution workflows.

# Customer and site management
Customer organizations, service sites, and work orders associated with their respective customers and locations.

# Parts and inventory usage
Part management and transactional part usage tracking with protection against negative inventory.

# Reports and dashboards
Operational status summaries, overdue/SLA reporting, technician performance, site breakdowns, and service metrics.

# Audit and history tracking
Append-only work order status history and operational records for traceability.

# Suggested technology stack
- `Frontend`: React + TypeScript + Vite
- `Styling`: Tailwind CSS
- `Backend`: Spring Boot 3 / Java 21
- `Database`: PostgreSQL
- `Authentication`: Spring Security + JWT
- `ORM`: Spring Data JPA / Hibernate
- `Database migrations`: Flyway
- `API documentation`: springdoc OpenAPI

# Architecture
Layered monolithic architecture with thin controllers, service-layer business rules, DTO-based API boundaries, repository-based persistence, and centralized security/error handling.

# Reference
`Link`: [Project KEYSTONE Figma Reference](https://wasp-hall-12061834.figma.site/)

# Implementation status
Backend and frontend implementation are in progress. The project documents and approved requirements remain the source of truth for product scope, architecture, and acceptance criteria.
