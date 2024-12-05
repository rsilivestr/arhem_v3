CREATE TABLE IF NOT EXISTS event_steps (
    id VARCHAR(25) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    image VARCHAR(255) NULL,
    date_create TIMESTAMPTZ,
    date_update TIMESTAMPTZ,
    user_id VARCHAR(25) REFERENCES users(id)
);
