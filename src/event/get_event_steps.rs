use rocket::{post, serde::json::Json, State, response::status::Custom, http::Status};
use sqlx::PgPool;

use crate::models::{EventStep, EventId};
use crate::system::admin_token::AdminToken;

#[post("/get_event_steps", format = "application/json", data = "<event_id>")]
pub async fn get_event_steps(pool: &State<PgPool>, event_id: Json<EventId>, _user_guid: AdminToken) -> Result<Json<Vec<EventStep>>, Custom<String>> {
    let query = r#"
        SELECT
            s.id, s.name, s.text, s.image, s.col, s.row,
            to_char(s.date_create AT TIME ZONE 'Europe/Moscow', 'YYYY-MM-DD HH24:MI:SS') as date_create,
            to_char(s.date_update AT TIME ZONE 'Europe/Moscow', 'YYYY-MM-DD HH24:MI:SS') as date_update,
            u.username as user
        FROM event_steps s
        INNER JOIN users u ON s.user_id = u.id
        WHERE s.event_id = $1;"#;

    let events: Vec<EventStep> = match sqlx::query_as::<_, EventStep>(query)
        .bind(&event_id.id)
        .fetch_all(pool.inner())
        .await
    {
        Ok(events) => events,
        Err(e) => {
            return Err(Custom(Status::InternalServerError, format!("Database error: {}", e)));
        }
    };

    Ok(Json(events))
}
