use rocket::{post, serde::json::Json, State};
use sqlx::PgPool;
use crate::models::Event;


#[post("/events", format = "application/json", data = "<event>")]
pub async fn create_event(pool: &State<PgPool>, event: Json<Event>) -> Result<Json<Event>, rocket::response::status::Custom<String>> {
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
            // Log the error for better debugging
            eprintln!("Database error: {}", e);
            return Err(rocket::response::status::Custom(
                rocket::http::Status::InternalServerError,
                format!("Database error: {}", e),
            ));
        }
    };

    Ok(Json(inserted_event))
}
