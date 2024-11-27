use rocket::{post, serde::json::Json, State, response::status::Custom, http::Status};
use serde::Deserialize;
use sqlx::PgPool;

use crate::models::EventStep;
use crate::system::admin_token::AdminToken;

#[derive(Debug, Deserialize)]
pub struct EventGuid {
    guid: String
}

#[post("/get_event_links", format = "application/json", data = "<guid>")]
pub async fn get_event_links(pool: &State<PgPool>, guid: Json<EventGuid>, _user_guid: AdminToken) -> Result<Json<Vec<EventStep>>, Custom<String>> {
    let query = r#"
        SELECT
            s.guid, s.event_guid, s.start, s.finish, s.name, s.text, s.image,
            to_char(s.date_create AT TIME ZONE 'Europe/Moscow', 'YYYY-MM-DD HH24:MI:SS') as date_create,
            to_char(s.date_update AT TIME ZONE 'Europe/Moscow', 'YYYY-MM-DD HH24:MI:SS') as date_update,
            u.username as user
        FROM event_steps s
        INNER JOIN users u ON s.user_guid = u.guid
        WHERE s.event_guid = $1;"#;

    let events: Vec<EventStep> = match sqlx::query_as::<_, EventStep>(query)
        .bind(&guid.guid)
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
