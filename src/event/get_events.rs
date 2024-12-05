use rocket::{get, serde::json::Json, State, uri, response::Redirect};
use sqlx::PgPool;
use crate::models::Event;
use crate::system::admin_token::{AdminToken, ApiTokenError};

#[get("/events")]
pub async fn get_events(pool: &State<PgPool>, user_id: Result<AdminToken, ApiTokenError>) -> Result<Json<Vec<Event>>, Redirect> {
    match user_id {
        Ok(_) => {},
        Err(_) => {
            Redirect::permanent(uri!("/editor/login"));
            return Err(Redirect::permanent(uri!("/editor/login")))
        }
    };

    let query = r#"
        SELECT 
           e.id, e.name, e.code, e.description, e.image, e.max_cols, e.max_rows,
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
        Err(_) => {return Err(Redirect::permanent(uri!("/editor/login")))}
    };

    Ok(Json(events))
}
