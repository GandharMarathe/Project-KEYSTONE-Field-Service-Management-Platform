# KEYSTONE backend
Spring Boot + PostgreSQL REST API for Meridian Facilities Management's field-service platform.

## Run locally

- Ensure PostgreSQL is running and a keystone database exists.
- Optionally set DB_URL, DB_USERNAME, DB_PASSWORD, and JWT_SECRET as environment variables — all fall back to local-dev defaults in application.properties if unset.
- Start the API with .\mvnw.cmd spring-boot:run (Windows) or ./mvnw spring-boot:run (macOS/Linux). Flyway applies schema migrations automatically on startup.

## Implementation notes

- Authentication is custom JWT, not Spring's default UserDetailsService: POST /api/auth/login verifies credentials against the DB with BCrypt and returns a signed token, which subsequent requests supply via Authorization: Bearer <token>.
- Role-based access control (MANAGER, DISPATCHER, TECHNICIAN, CUSTOMER) is enforced per-endpoint in SecurityConfig; write operations are generally restricted to MANAGER/DISPATCHER, with TECHNICIAN additionally permitted to update the status of work orders assigned specifically to them.
- Domain entities (Customer, Site, Work Order, Part, Part Usage, Time Log, Status History) are related via standard JPA @ManyToOne associations, eagerly fetched to avoid lazy-initialization failures under open-in-view=false.
- DELETE endpoints check for dependent records before deleting and return 409 Conflict rather than surfacing a raw foreign-key violation.
- Schema is version-controlled via Flyway migrations under src/main/resources/db/migration; spring.jpa.hibernate.ddl-auto=validate means Hibernate never generates schema itself.

Response field names and DTO shapes should be confirmed against the frontend's expectations before integration — several endpoints (Customer, Site, Work Order) currently return JPA entities directly rather than dedicated response DTOs.
