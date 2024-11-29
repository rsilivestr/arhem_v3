use rocket::{post, serde::json::Json, State, response::status::Custom, http::Status};
use sqlx::PgPool;
use chrono::Utc;

use crate::models::{NewEventStep, EventStep};
use crate::system::admin_token::AdminToken;
use crate::system::user_log_creation::user_log_creation;

#[post("/event_step", format = "application/json", data = "<event_step>")]
pub async fn create_event_step(pool: &State<PgPool>, event_step: Json<NewEventStep>, user_id: AdminToken) -> Result<Json<EventStep>, Custom<String>> {
    let new_event = event_step.into_inner();
    let now = Utc::now();
    // проверяем таблицу step на наличие такой строчки, если полное совпадение, ничего не делаем.
    // просто инсертим в связи
    // если неполное, нужно проверить, если такой степ в event_x_steps с другими event
    // если есть - меняем id step на новый и заливаем
    // если нет - апдейтим step на новый 
    // есть в бд? проверяем таблицу связей event_x_steps
    // если в ней уже


    // 1 проверям step на наличие в steps на name text image
    let query = r#"SELECT
    EXISTS (SELECT 1 FROM event_steps
        WHERE id = $1 AND name = $2 AND text = $3 AND image = $4
    ) AS full_match,
    EXISTS (SELECT 1 FROM event_steps WHERE id = $1) AS id_match;"#;

    let step_exists: (bool, bool) = match query_as::<_, (bool, bool)> (query)
        .bind(&new_event)


    let query = r#"
        WITH inserted AS (
            INSERT INTO event_steps (
                id, name, text, image, date_create, date_update, user_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8, $9)
            ON CONFLICT (id)
            DO UPDATE
                SET event_id = EXCLUDED.event_id,
                    start = EXCLUDED.start,
                    finish = EXCLUDED.finish,
                    name = EXCLUDED.name,
                    text = EXCLUDED.text,
                    image = EXCLUDED.image,
                    date_update = EXCLUDED.date_update,
                    user_id = EXCLUDED.user_guid
            RETURNING guid, event_guid, start, finish, name, text, image, date_create, date_update, user_guid
        )
        SELECT
            i.guid,
            i.event_guid,
            i.start,
            i.finish,
            i.name,
            i.text,
            i.image,
            to_char(i.date_create AT TIME ZONE 'Europe/Moscow', 'YYYY-MM-DD HH24:MI:SS') as date_create,
            to_char(i.date_update AT TIME ZONE 'Europe/Moscow', 'YYYY-MM-DD HH24:MI:SS') as date_update,
            u.username as user
        FROM inserted i
        JOIN users u ON i.user_guid = u.guid;"#;

    let inserted_event: EventStep = match sqlx::query_as::<_, EventStep>(query)
        .bind(&new_event.guid)
        .bind(&new_event.event_guid)
        .bind(new_event.start)
        .bind(new_event.finish)
        .bind(&new_event.name)
        .bind(&new_event.text)
        .bind(&new_event.image)
        .bind(now)
        .bind(&user_guid.0)
        .fetch_one(pool.inner())
        .await
    {
        Ok(event_step) => event_step,
        Err(e) => {
            return Err(Custom(Status::InternalServerError, format!("Database error: {}", e)));
        }
    };

    user_log_creation(pool.inner(), &user_guid.0, "Добавил новый event_step или изменил старый").await?;

    Ok(Json(inserted_event))
}
