-- ============================================================
-- KEYSTONE - Core Database Schema
-- V1: Initial domain schema
-- ============================================================

-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    role            VARCHAR(30) NOT NULL,
    enabled         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_users_role
        CHECK (role IN (
            'DISPATCHER',
            'TECHNICIAN',
            'MANAGER',
            'CUSTOMER'
        ))
);

CREATE INDEX idx_users_role
    ON users(role);

CREATE INDEX idx_users_email
    ON users(email);


-- ============================================================
-- CUSTOMERS
-- ============================================================

CREATE TABLE customers (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    email           VARCHAR(255),
    phone           VARCHAR(50),
    address         TEXT,
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_name
    ON customers(name);


-- ============================================================
-- SITES
-- ============================================================

CREATE TABLE sites (
    id              BIGSERIAL PRIMARY KEY,
    customer_id     BIGINT NOT NULL,
    name            VARCHAR(200) NOT NULL,
    address_line1   VARCHAR(255) NOT NULL,
    address_line2   VARCHAR(255),
    city            VARCHAR(100) NOT NULL,
    state           VARCHAR(100),
    postal_code     VARCHAR(30),
    country         VARCHAR(100) NOT NULL DEFAULT 'India',
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_sites_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
);

CREATE INDEX idx_sites_customer_id
    ON sites(customer_id);

CREATE INDEX idx_sites_name
    ON sites(name);


-- ============================================================
-- WORK ORDERS
-- ============================================================

CREATE TABLE work_orders (
    id                  BIGSERIAL PRIMARY KEY,

    code                VARCHAR(30) NOT NULL UNIQUE,

    title               VARCHAR(255) NOT NULL,
    description         TEXT,

    priority            VARCHAR(20) NOT NULL,
    status              VARCHAR(30) NOT NULL DEFAULT 'NEW',

    customer_id         BIGINT NOT NULL,
    site_id             BIGINT NOT NULL,

    assigned_to         BIGINT,

    sla_due_at          TIMESTAMPTZ,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at        TIMESTAMPTZ,
    closed_at           TIMESTAMPTZ,

    CONSTRAINT fk_work_orders_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id),

    CONSTRAINT fk_work_orders_site
        FOREIGN KEY (site_id)
        REFERENCES sites(id),

    CONSTRAINT fk_work_orders_assignee
        FOREIGN KEY (assigned_to)
        REFERENCES users(id),

    CONSTRAINT chk_work_orders_priority
        CHECK (priority IN (
            'LOW',
            'MEDIUM',
            'HIGH',
            'URGENT'
        )),

    CONSTRAINT chk_work_orders_status
        CHECK (status IN (
            'NEW',
            'ASSIGNED',
            'IN_PROGRESS',
            'ON_HOLD',
            'COMPLETED',
            'CLOSED',
            'CANCELLED'
        ))
);

CREATE INDEX idx_work_orders_status
    ON work_orders(status);

CREATE INDEX idx_work_orders_priority
    ON work_orders(priority);

CREATE INDEX idx_work_orders_customer_id
    ON work_orders(customer_id);

CREATE INDEX idx_work_orders_site_id
    ON work_orders(site_id);

CREATE INDEX idx_work_orders_assigned_to
    ON work_orders(assigned_to);

CREATE INDEX idx_work_orders_sla_due_at
    ON work_orders(sla_due_at);


-- ============================================================
-- WORK ORDER STATUS HISTORY
-- Append-only audit trail.
-- ============================================================

CREATE TABLE work_order_status_history (
    id              BIGSERIAL PRIMARY KEY,

    work_order_id   BIGINT NOT NULL,

    from_status     VARCHAR(30),
    to_status       VARCHAR(30) NOT NULL,

    changed_by      BIGINT NOT NULL,

    note            TEXT,

    changed_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_status_history_work_order
        FOREIGN KEY (work_order_id)
        REFERENCES work_orders(id),

    CONSTRAINT fk_status_history_changed_by
        FOREIGN KEY (changed_by)
        REFERENCES users(id),

    CONSTRAINT chk_status_history_from_status
        CHECK (
            from_status IS NULL
            OR from_status IN (
                'NEW',
                'ASSIGNED',
                'IN_PROGRESS',
                'ON_HOLD',
                'COMPLETED',
                'CLOSED',
                'CANCELLED'
            )
        ),

    CONSTRAINT chk_status_history_to_status
        CHECK (
            to_status IN (
                'NEW',
                'ASSIGNED',
                'IN_PROGRESS',
                'ON_HOLD',
                'COMPLETED',
                'CLOSED',
                'CANCELLED'
            )
        )
);

CREATE INDEX idx_status_history_work_order
    ON work_order_status_history(work_order_id);

CREATE INDEX idx_status_history_changed_at
    ON work_order_status_history(changed_at);


-- ============================================================
-- PARTS
-- ============================================================

CREATE TABLE parts (
    id              BIGSERIAL PRIMARY KEY,

    part_number     VARCHAR(100) NOT NULL UNIQUE,
    name            VARCHAR(200) NOT NULL,
    description     TEXT,

    unit_cost       NUMERIC(12, 2) NOT NULL DEFAULT 0,
    stock_quantity  INTEGER NOT NULL DEFAULT 0,

    active          BOOLEAN NOT NULL DEFAULT TRUE,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_parts_unit_cost
        CHECK (unit_cost >= 0),

    CONSTRAINT chk_parts_stock_quantity
        CHECK (stock_quantity >= 0)
);

CREATE INDEX idx_parts_name
    ON parts(name);


-- ============================================================
-- PART USAGE
-- ============================================================

CREATE TABLE part_usage (
    id              BIGSERIAL PRIMARY KEY,

    work_order_id   BIGINT NOT NULL,
    part_id         BIGINT NOT NULL,

    quantity        INTEGER NOT NULL,

    unit_cost       NUMERIC(12, 2) NOT NULL,

    note            TEXT,

    used_by         BIGINT NOT NULL,

    used_at         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_part_usage_work_order
        FOREIGN KEY (work_order_id)
        REFERENCES work_orders(id),

    CONSTRAINT fk_part_usage_part
        FOREIGN KEY (part_id)
        REFERENCES parts(id),

    CONSTRAINT fk_part_usage_user
        FOREIGN KEY (used_by)
        REFERENCES users(id),

    CONSTRAINT chk_part_usage_quantity
        CHECK (quantity > 0),

    CONSTRAINT chk_part_usage_unit_cost
        CHECK (unit_cost >= 0)
);

CREATE INDEX idx_part_usage_work_order
    ON part_usage(work_order_id);

CREATE INDEX idx_part_usage_part
    ON part_usage(part_id);


-- ============================================================
-- TIME LOGS
-- ============================================================

CREATE TABLE time_logs (
    id              BIGSERIAL PRIMARY KEY,

    work_order_id   BIGINT NOT NULL,
    technician_id   BIGINT NOT NULL,

    minutes         INTEGER NOT NULL,

    note            TEXT,

    logged_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_time_logs_work_order
        FOREIGN KEY (work_order_id)
        REFERENCES work_orders(id),

    CONSTRAINT fk_time_logs_technician
        FOREIGN KEY (technician_id)
        REFERENCES users(id),

    CONSTRAINT chk_time_logs_minutes
        CHECK (minutes > 0)
);

CREATE INDEX idx_time_logs_work_order
    ON time_logs(work_order_id);

CREATE INDEX idx_time_logs_technician
    ON time_logs(technician_id);


-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON TABLE users IS
    'KEYSTONE platform users and their roles.';

COMMENT ON TABLE customers IS
    'Customer organisations served by Meridian Facilities Management.';

COMMENT ON TABLE sites IS
    'Physical sites belonging to customer organisations.';

COMMENT ON TABLE work_orders IS
    'Core unit of maintenance work.';

COMMENT ON TABLE work_order_status_history IS
    'Append-only audit history for every work-order status transition.';

COMMENT ON TABLE parts IS
    'Parts inventory maintained by Meridian.';

COMMENT ON TABLE part_usage IS
    'Parts consumed against work orders.';

COMMENT ON TABLE time_logs IS
    'Technician labour time recorded against work orders.';