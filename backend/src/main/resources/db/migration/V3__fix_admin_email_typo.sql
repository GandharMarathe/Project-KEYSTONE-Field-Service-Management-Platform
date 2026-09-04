-- Corrects a typo introduced when V2 was created: admin@ekeystone.dev -> admin@keystone.dev
UPDATE users
SET email = 'admin@keystone.dev'
WHERE email = 'admin@ekeystone.dev';