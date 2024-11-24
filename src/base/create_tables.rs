use sqlx::{Executor, PgPool};

pub async fn create_tables(pool: &PgPool) -> Result<(), sqlx::Error> {

    pool.execute(
        r#"
        CREATE TABLE IF NOT EXISTS users (
            guid VARCHAR(25) PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            admin BOOLEAN NOT NULL,
            donate BOOLEAN NOT NULL,
            active BOOLEAN NOT NULL,
            token VARCHAR(25) NULL,
            date_create TIMESTAMPTZ
        );
        CREATE TABLE IF NOT EXISTS users_log_text(
            id SERIAL PRIMARY KEY,
            text TEXT NOT NULL UNIQUE
        );
        CREATE TABLE IF NOT EXISTS users_log(
            time TIMESTAMPTZ,
            user_guid VARCHAR(25) REFERENCES users(guid),
            text_id SERIAL REFERENCES users_log_text(id)
        );
        CREATE TABLE IF NOT EXISTS locations (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            declension VARCHAR(255) NOT NULL UNIQUE,
            date_update TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS events (
            guid VARCHAR(25) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT NULL,
            image VARCHAR(255) NULL,
            --persona INTEGER NOT NULL,
            --stage INTEGER NOT NULL,
            --location_id INTEGER NULL,
            date_create TIMESTAMPTZ,
            date_update TIMESTAMPTZ,
            user_guid VARCHAR(25) REFERENCES users(guid)
        );
        CREATE TABLE IF NOT EXISTS event_steps (
            guid VARCHAR(25) PRIMARY KEY,
            event_guid VARCHAR(25) REFERENCES events(guid),
            start BOOLEAN NOT NULL,
            finish BOOLEAN NOT NULL,
            text TEXT NOT NULL,
            date_create TIMESTAMPTZ,
            date_update TIMESTAMPTZ,
            user_guid VARCHAR(25) REFERENCES users(guid)
        );
        CREATE TABLE IF NOT EXISTS event_steps_links (
            guid VARCHAR(25) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            next_step VARCHAR(25) REFERENCES event_steps(guid),
            date_create TIMESTAMPTZ,
            date_update TIMESTAMPTZ,
            user_guid VARCHAR(25) REFERENCES users(guid)
        );
        "#,
    )
    .await?;

    Ok(())
}
