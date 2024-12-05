CREATE TABLE IF NOT EXISTS users_log(
    time TIMESTAMPTZ,
    user_id VARCHAR(25) REFERENCES users(id),
    text_id SERIAL REFERENCES users_log_text(id)
);
