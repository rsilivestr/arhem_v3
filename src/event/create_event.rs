use rocket::{post, serde::json::Json, State, response::status::Custom, http::Status};
use sqlx::PgPool;
use crate::models::Event;
use crate::system::admin_token::AdminToken;
use crate::system::user_log_creation::user_log_creation;


#[post("/events", format = "application/json", data = "<event>")]
pub async fn create_event(pool: &State<PgPool>, event: Json<Event>, user_guid: AdminToken) -> Result<Json<Event>, Custom<String>> {
    let new_event = event.into_inner();

    let query = r#"
        INSERT INTO events (guid, name)
        VALUES ($1, $2)
        ON CONFLICT (guid) 
        DO UPDATE SET name = EXCLUDED.name    
        RETURNING guid, name;"#;

    let inserted_event: Event = match sqlx::query_as::<_, Event>(query)
        .bind(&new_event.guid)
        .bind(&new_event.name)
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
