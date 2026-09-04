--===========================================================================================
-- V2: Seed initial MANAGER account for bootstrapping auth.
-- Email: admin@keystone.dev
-- Password: Keystone@2026Admin! (Change after first login)

INSERT INTO users (email, password_hash, first_name, last_name, role, enabled)
VALUES (
        'admin@ekeystone.dev',
        '$2a$10$awh6.FbgAAPyY2.qqrymdej4ZSjzr201Np1Pm1xXFBqpQIlJBL7MS',
        'System',
        'Admin',
        'MANAGER',
        TRUE
       );