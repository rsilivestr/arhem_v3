CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(25) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    admin BOOLEAN NOT NULL,
    donate BOOLEAN NOT NULL,
    active BOOLEAN NOT NULL,
    token VARCHAR(25) NULL,
    date_create TIMESTAMPTZ
);
