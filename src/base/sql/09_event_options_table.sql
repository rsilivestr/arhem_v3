CREATE TABLE IF NOT EXISTS event_options (
    id VARCHAR(25) PRIMARY KEY,
    code VARCHAR(255),
    parameter VARCHAR(25),
    value SMALLINT
);
