use rocket::{get, serde::json::Json, State, response::status::Custom, http::Status};
use sqlx::PgPool;
use crate::models::Event;
use crate::system::admin_token::AdminToken;

#[get("/events")]
pub async fn get_events(pool: &State<PgPool>, _user_guid: AdminToken) -> Result<Json<Vec<Event>>, Custom<String>> {
    let query = r#"
        SELECT 
           e.id, e.name, e.code, e.description, e.image,
           to_char(e.date_create AT TIME ZONE 'Europe/Moscow', 'YYYY-MM-DD HH24:MI:SS') as date_create,
           to_char(e.date_update AT TIME ZONE 'Europe/Moscow', 'YYYY-MM-DD HH24:MI:SS') as date_update,
           u.username as user
        FROM events e
        inner join users u on e.user_id = u.id;
        "#;

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
