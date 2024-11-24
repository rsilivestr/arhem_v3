use rocket::{get, serde::json::Json, State, response::status::Custom, http::Status};
use sqlx::PgPool;
use crate::models::Event;
use crate::system::admin_token::AdminToken;

#[get("/events")]
pub async fn get_events(pool: &State<PgPool>, _user_guid: AdminToken) -> Result<Json<Vec<Event>>, Custom<String>> {
    let query = r#"SELECT guid, name FROM events;"#;

    let events: Vec<Event> = match sqlx::query_as::<_, Event>(query)
        .fetch_all(pool.inner())
        .await
    {
        Ok(events) => events,
        Err(e) => {
            return Err(Custom(Status::InternalServerError, format!("Database error: {}", e),));
        }
    };

    Ok(Json(events))
}
