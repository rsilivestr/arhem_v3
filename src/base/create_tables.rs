use sqlx::{Executor, PgPool};

pub async fn create_tables(pool: &PgPool) -> Result<(), sqlx::Error> {

    pool.execute(
        r#"
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
        CREATE TABLE IF NOT EXISTS users_log_text(
            id SERIAL PRIMARY KEY,
            text TEXT NOT NULL UNIQUE
        );
        CREATE TABLE IF NOT EXISTS users_log(
            time TIMESTAMPTZ,
            user_id VARCHAR(25) REFERENCES users(id),
            text_id SERIAL REFERENCES users_log_text(id)
        );
        CREATE TABLE IF NOT EXISTS locations (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            declension VARCHAR(255) NOT NULL UNIQUE,
            date_update TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS events (
            id VARCHAR(25) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT NULL,
            image VARCHAR(255) NULL,
            max_cols SMALLINT,
            max_rows SMALLINT,
            date_create TIMESTAMPTZ,
            date_update TIMESTAMPTZ,
            user_id VARCHAR(25) REFERENCES users(id)
        );
        CREATE TABLE IF NOT EXISTS event_steps (
            id VARCHAR(25) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            text TEXT NOT NULL,
            image VARCHAR(255) NULL,
            date_create TIMESTAMPTZ,
            date_update TIMESTAMPTZ,
            user_id VARCHAR(25) REFERENCES users(id)
        );
        CREATE TABLE IF NOT EXISTS event_x_steps(
            event_id VARCHAR(25) REFERENCES events(id),
            step_id VARCHAR(25) REFERENCES event_steps(id),
            start BOOLEAN,
            row SMALLINT,
            col SMALLINT
        );
        CREATE TABLE IF NOT EXISTS event_links (
            id VARCHAR(25) PRIMARY KEY,
            step_id VARCHAR(25) REFERENCES event_steps(id),
            output SMALLINT,
            next_step_win VARCHAR(25) REFERENCES event_steps(id),
            input_win SMALLINT,
            next_step_fail VARCHAR(25) NULL,
            input_fail SMALLINT NULL,
            FOREIGN KEY (next_step_lose) REFERENCES event_steps(id),
            name VARCHAR(255) NOT NULL,
            description TEXT NULL,
            lose_time SMALLINT NULL,
            date_create TIMESTAMPTZ,
            date_update TIMESTAMPTZ,
            user_id VARCHAR(25) REFERENCES users(id)
        );
        CREATE TABLE IF NOT EXISTS event_options (
            id VARCHAR(25) PRIMARY KEY,
            code VARCHAR(255),
            parameter VARCHAR(25),
            value SMALLINT
        );
        CREATE TABLE IF NOT EXISTS event_links_x_options(
            link_id VARCHAR(25) REFERENCES event_links(id),
            option_id VARCHAR(25) REFERENCES event_options(id)
        );
        "#,
    )
    .await?;

    Ok(())
}
