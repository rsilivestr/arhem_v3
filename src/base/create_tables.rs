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
            guid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(255) NOT NULL,
            description TEXT NULL,
            image VARCHAR(255) NULL
            --persona INTEGER NOT NULL,
            --stage INTEGER NOT NULL,
            --location_id integer INTEGER NULL,
        );
        CREATE TABLE IF NOT EXISTS event_steps (
            guid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            event_guid UUID REFERENCES events(guid),
            start BOOLEAN NOT NULL,
            finish BOOLEAN NOT NULL, 
            text TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS event_steps_links (
            guid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(255) NOT NULL,
            next_step UUID REFERENCES event_steps(guid)
            ---demaind_id 
        );
        "#,
    )
    .await?;

    Ok(())
}
