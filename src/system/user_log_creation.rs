use chrono::Utc;
use sqlx::PgPool;
use rocket::response::status::Custom;
use rocket::http::Status;

pub async fn user_log_creation(pool: &PgPool, user_guid: &str, log_text: &str) -> Result<(), Custom<String>> {
    let log_query = r#"
        WITH inserted_text AS (
              INSERT INTO users_log_text (text) VALUES ($1) ON CONFLICT DO NOTHING RETURNING id
        )
        INSERT INTO users_log (time, user_guid, text_id)
        SELECT $2, $3, id FROM inserted_text;
    "#;

    let result = sqlx::query(log_query)
        .bind(log_text)
        .bind(Utc::now())
        .bind(user_guid)
        .execute(pool)
        .await;

    match result {
        Ok(_) => Ok(()),
        Err(e) => {
            Err(Custom(Status::InternalServerError, format!("Database error: {}", e)))
        }
    }
}
