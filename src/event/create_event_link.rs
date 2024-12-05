use rocket::{post, serde::json::Json, State, response::status::Custom, http::Status};
use sqlx::PgPool;
use chrono::Utc;

use crate::models::{NewEventLink, EventLink};
use crate::system::admin_token::AdminToken;
use crate::system::user_log_creation::user_log_creation;


#[post("/event_link", format = "application/json", data = "<event_link>")]
pub async fn create_event_link(pool: &State<PgPool>, event_link: Json<NewEventLink>, user_id: AdminToken) -> Result<Json<EventLink>, Custom<String>> {
    let new_link = event_link.into_inner();
    let now = Utc::now();

    let query = r#"
        WITH inserted AS (
            INSERT INTO event_links (
                id, step_id, output, next_step_win, input_win,
                next_step_fail, input_fail, name, description, lose_time,
                date_create, date_update, user_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8, $9)
            ON CONFLICT (id)
            DO UPDATE
                SET step_id = EXCLUDED.step_id,
                    output = EXCLUDED.output,
                    next_step_win = EXCLUDED.next_step_win,
                    input_win = EXCLUDED.next_step_win,
                    next_step_lose = EXCLUDED.next_step_lose,
                    input_fail = EXCLUDED.input_fail,
                    name = EXCLUDED.name,
                    description = EXCLUDED.description,
                    lose_time = EXCLUDED.lose_time,
                    date_update = EXCLUDED.date_update,
                    user_id = EXCLUDED.user_id
            RETURNING id, step_id, output, next_step_win, input_win,
                next_step_fail, input_fail, name, description, lose_time,
                date_create, date_update, user_id
        )
        SELECT
            i.id,
            i.step_id,
            i.output,
            i.next_step_win,
            i.input_win,
            i.next_step_fail,
            i.input_fail,
            i.name,
            i.description,
            i.lose_time,
            to_char(i.date_create AT TIME ZONE 'Europe/Moscow', 'YYYY-MM-DD HH24:MI:SS') as date_create,
            to_char(i.date_update AT TIME ZONE 'Europe/Moscow', 'YYYY-MM-DD HH24:MI:SS') as date_update,
            u.username as user
        FROM inserted i
        JOIN users u ON i.user_id = u.id;"#;

    let inserted_link: EventLink = match sqlx::query_as::<_, EventLink>(query)
        .bind(&new_link.id)
        .bind(&new_link.step_id)
        .bind(new_link.output)
        .bind(&new_link.next_step_win)
        .bind(new_link.input_win)
        .bind(&new_link.next_step_fail)
        .bind(new_link.input_fail)
        .bind(&new_link.name)
        .bind(&new_link.description)
        .bind(new_link.lose_time)
        .bind(now)
        .bind(&user_id.0)
        .fetch_one(pool.inner())
        .await
    {
        Ok(event_link) => event_link,
        Err(e) => {
            return Err(Custom(Status::InternalServerError, format!("Database error: {}", e)));
        }
    };

    user_log_creation(pool.inner(), &user_id.0, "Добавил новый event_link или изменил старый").await?;

    Ok(Json(inserted_link))
}
