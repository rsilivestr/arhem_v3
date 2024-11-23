use rocket::{get, serde::json::Json, State};
use sqlx::PgPool;
use crate::models::Event;

#[get("/events")]
pub async fn get_events(pool: &State<PgPool>) -> Result<Json<Vec<Event>>, rocket::response::status::Custom<String>> {
    let query = r#"SELECT guid, name FROM events;"#;

    let events: Vec<Event> = match sqlx::query_as::<_, Event>(query)
        .fetch_all(pool.inner())
        .await
    {
        Ok(events) => events,
        Err(e) => {
            // Log the error for better debugging
            eprintln!("Database error: {}", e);
            return Err(rocket::response::status::Custom(
                rocket::http::Status::InternalServerError,
                format!("Database error: {}", e),
            ));
        }
    };

    Ok(Json(events))
}
