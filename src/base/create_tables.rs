use sqlx::{Executor, PgPool};

pub async fn create_tables(pool: &PgPool) -> Result<(), sqlx::Error> {

    pool.execute(
        r#"
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            active BOOLEAN NOT NULL,
            token VARCHAR(255) NULL
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
            image VARCHAR(255) NULL
            --persona INTEGER NOT NULL,
            --stage INTEGER NOT NULL,
            --location_id INTEGER NULL,
            --date_create TIMESTAMP,
            --date_update TIMESTAMP,
            --user_guid VARCHAR(25),
        );
        CREATE TABLE IF NOT EXISTS event_steps (
            guid VARCHAR(25) PRIMARY KEY,
            event_guid VARCHAR(25) REFERENCES events(guid),
            start BOOLEAN NOT NULL,
            finish BOOLEAN NOT NULL,
            text TEXT NOT NULL
            --date_create TIMESTAMP,
            --date_update TIMESTAMP,
            --user_guid VARCHAR(25),
        );
        CREATE TABLE IF NOT EXISTS event_steps_links (
            guid VARCHAR(25) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            next_step VARCHAR(25) REFERENCES event_steps(guid)
            --demaind_id
            --date_create TIMESTAMP,
            --date_update TIMESTAMP,
            --user_guid VARCHAR(25),
        );
        "#,
    )
    .await?;

    Ok(())
}
