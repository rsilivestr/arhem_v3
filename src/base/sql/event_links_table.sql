CREATE TABLE IF NOT EXISTS event_links (
    id VARCHAR(25) PRIMARY KEY,
    step_id VARCHAR(25) REFERENCES event_steps(id),
    output SMALLINT,
    next_step_win VARCHAR(25) REFERENCES event_steps(id),
    input_win SMALLINT,
    next_step_fail VARCHAR(25) NULL,
    input_fail SMALLINT NULL,
    FOREIGN KEY (next_step_fail) REFERENCES event_steps(id),
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    lose_time SMALLINT NULL,
    date_create TIMESTAMPTZ,
    date_update TIMESTAMPTZ,
    user_id VARCHAR(25) REFERENCES users(id)
);
