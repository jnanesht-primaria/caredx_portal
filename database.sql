CREATE DATABASE IF NOT EXISTS caredx;
USE caredx;

CREATE TABLE IF NOT EXISTS users (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(120)  NOT NULL,
    email          VARCHAR(190)  NOT NULL UNIQUE,
    password_hash  VARCHAR(255)  NOT NULL,   -- bcrypt hash, generated in Python
    role           ENUM('Admin', 'Technician', 'Receptionist') NOT NULL,
    is_active      TINYINT(1)    NOT NULL DEFAULT 1,
    created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- To seed a user, generate a bcrypt hash in Python first:
--   import bcrypt
--   bcrypt.hashpw(b"YourPassword123", bcrypt.gensalt()).decode()
--
-- Then insert it, e.g.:
-- INSERT INTO users (name, email, password_hash, role)
-- VALUES ('Ava Reyes', 'ava@caredx.com', '$2b$12$...hash...', 'Admin');