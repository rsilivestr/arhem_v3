use rocket::{post, serde::json::Json, State, response::status::Custom, http::Status};
use sqlx::PgPool;
use chrono::Utc;

use crate::models::{NewEvent, Event};
use crate::system::admin_token::AdminToken;
use crate::system::user_log_creation::user_log_creation;


#[post("/events", format = "application/json", data = "<event>")]
pub async fn create_event(pool: &State<PgPool>, event: Json<NewEvent>, user_guid: AdminToken) -> Result<Json<Event>, Custom<String>> {
    let new_event = event.into_inner();
    let now = Utc::now();

    let query = r#"
            WITH inserted AS (
                INSERT INTO events (
                    guid, name, description, image,
                    date_create, date_update, user_guid
                )
                VALUES ($1, $2, $3, $4, $5, $5, $6)
                ON CONFLICT (guid)
                DO UPDATE
                    SET name = EXCLUDED.name,
                        description = EXCLUDED.description,
                        image = EXCLUDED.image,
                        date_update = EXCLUDED.date_update,
                        user_guid = EXCLUDED.user_guid
                RETURNING guid, name, description, image,
                    date_create, date_update, user_guid
            )
            SELECT 
                i.guid, 
                i.name, 
                i.description, 
                i.image,
                to_char(i.date_create AT TIME ZONE 'Europe/Moscow', 'YYYY-MM-DD HH24:MI:SS') as date_create,
                to_char(i.date_update AT TIME ZONE 'Europe/Moscow', 'YYYY-MM-DD HH24:MI:SS') as date_update,
                u.username as user
            FROM inserted i
            JOIN users u ON i.user_guid = u.guid;"#;

    let inserted_event: Event = match sqlx::query_as::<_, Event>(query)
        .bind(&new_event.guid)
        .bind(&new_event.name)
        .bind(&new_event.description)
        .bind(&new_event.image)
        .bind(now)   
        .bind(&user_guid.0)
        .fetch_one(pool.inner())
        .await
    {
        Ok(event) => event,
        Err(e) => {
            return Err(Custom(Status::InternalServerError, format!("Database error: {}", e),));
        }
    };
    user_log_creation(pool.inner(), &user_guid.0, "Добавил новый event или изменил старый").await?;

    Ok(Json(inserted_event))
}
