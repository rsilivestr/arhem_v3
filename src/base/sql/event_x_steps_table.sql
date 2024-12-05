CREATE TABLE IF NOT EXISTS event_x_steps(
    event_id VARCHAR(25) REFERENCES events(id),
    step_id VARCHAR(25) REFERENCES event_steps(id),
    start BOOLEAN,
    row SMALLINT,
    col SMALLINT
);
