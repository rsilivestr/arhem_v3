use rocket::{post, serde::json::Json, serde::Serialize, State, response::status::Custom, http::Status};
use sqlx::{PgPool, query_as, query};
use chrono::Utc;
use cuid;

use crate::models::NewEventStep;
use crate::system::admin_token::AdminToken;
use crate::system::user_log_creation::user_log_creation;

#[derive(Serialize)]
pub struct StatusMessage {
    message: String,
}

#[post("/event_step", format = "application/json", data = "<event_step>")]
pub async fn create_event_step(pool: &State<PgPool>, event_step: Json<NewEventStep>, user_id: AdminToken) -> Result<Json<StatusMessage>, Custom<String>> {
    let new_event = event_step.into_inner();
    // проверяем таблицу step на наличие такой строчки, если полное совпадение, ничего не делаем.
    // просто инсертим в связи
    // если неполное, нужно проверить, если такой степ в event_x_steps с другими event
    // если есть - меняем id step на новый и заливаем
    // если нет - апдейтим step на новый 
    // есть в бд? проверяем таблицу связей event_x_steps
    // если в ней уже


    // 1 проверям step на наличие в steps на name text image
    let query_ = r#"SELECT
    EXISTS (SELECT 1 FROM event_x_steps WHERE id = $1) AS id_match,
    EXISTS (SELECT 1 FROM event_steps
        WHERE id = $1 AND name = $2 AND text = $3 AND image = $4
    ) AS full_match,
    EXISTS (SELECT 1 FROM event_xsteps where event_id = $5 and step_id = $1) as this_event,
    EXISTS (SELECT 1 FROM event_x_steps where event_id != $5 and step_id = $1) as else_event;"#;
    // (наличие step, полное совпадение step, наличие связки с диалогом, с другим диалогом )
    let message: String = match query_as::<_, (bool, bool, bool, bool)> (query_)
        .bind(&new_event.id)
        .bind(&new_event.name)
        .bind(&new_event.text)
        .bind(&new_event.image)
        .bind(&new_event.event_id)
        .fetch_one(pool.inner())
        .await
    {
        Ok((true, true, true, true)) | Ok((true, true, true, false)) => {
            // step полнотью совпадает и есть event  с такими шагом - просто обновим эту строчку
             update_event_x_steps(pool.inner(), &new_event, &new_event.id).await?;
            "обновил строчку связи step и event".to_string()
        },
        Ok((true, true, false, true)) | Ok((true, true, false, false)) => {
            // тут можно просто добавить строку в event_x_steps
            insert_event_x_steps(pool.inner(), &new_event).await?;
            "добавил строчку связи step и event".to_string()
        },
        Ok((true, false, true, true )) => {
            // самая долбанутая ситуация step изменился, но используется в разных событиях
            // нужно создать новый step c новым id и изменить это id в event_x_steps
            let new_step_id = cuid::cuid2();
            insert_event_steps(pool.inner(), &new_event, &user_id.0, &new_step_id).await?;
            update_event_x_steps(pool.inner(), &new_event, &new_step_id).await?;
            "Клонировал step и обновил строку связи step и event".to_string()
        },
        Ok((true, false, true, false)) => {
            // тут нужно обновить step и строчку event_x_steps
            update_event_steps(pool.inner(), &new_event, &user_id.0).await?;
            update_event_x_steps(pool.inner(), &new_event, &new_event.id).await?;
            "Обновил step и строчку связи step и event".to_string()
        },
        Ok((true, false, false, false)) => {
            // тут нужно обновить step и добавить event_x_steps
            update_event_steps(pool.inner(), &new_event, &user_id.0).await?;
            insert_event_x_steps(pool.inner(), &new_event).await?;
            "Обновил step и добавил строчку связи step и event".to_string()

        },
        Ok((false, false, false, false)) => {
            // тут нужно добавить step и добавить event_x_steps
            insert_event_steps(pool.inner(), &new_event, &user_id.0, &new_event.id).await?;
            insert_event_x_steps(pool.inner(), &new_event).await?;
            "Добавил step и добавил строчку связи step и event".to_string()
        },
        Ok(_) => {
            return Err(Custom(Status::InternalServerError, "невозможная комбинация".to_string()));
        },
        Err(e) => {
            return Err(Custom(Status::InternalServerError, format!("Database error: {}", e)));
        }
    };


    user_log_creation(pool.inner(), &user_id.0, "Добавил новый event_step или изменил старый").await?;
    let status_message = StatusMessage { message };
    Ok(Json(status_message))
}


async fn update_event_x_steps(pool: &PgPool, new_event: &NewEventStep, new_step_id: &str) -> Result<(), Custom<String>> {
    query(r#"UPDATE event_x_steps 
        set start = $1, row = $2, col = $3
        where event_id = $4 and step_id = $5"#)
        .bind(&new_event.start)
        .bind(&new_event.row)
        .bind(&new_event.col)
        .bind(&new_event.event_id)
        .bind(new_step_id)
        .execute(pool)
        .await
        .map_err(|e| Custom(Status::InternalServerError, format!("Database error: {}", e)))?;

    Ok(())
}

async fn insert_event_x_steps(pool: &PgPool, new_event: &NewEventStep) -> Result<(), Custom<String>> {
    query(r#"INSERT INTO event_x_steps VALUES($1, $2, $3, $4, $5"#)
        .bind(&new_event.event_id)
        .bind(&new_event.id)
        .bind(&new_event.start)
        .bind(&new_event.row)
        .bind(&new_event.col)
        .execute(pool)
        .await
        .map_err(|e| Custom(Status::InternalServerError, format!("Database error: {}", e)))?;

    Ok(())
}

async fn insert_event_steps(pool: &PgPool, new_event: &NewEventStep, user_id: &str, new_step_id: &str) -> Result<(), Custom<String>> {
    let now = Utc::now();
    query(r#"INSERT INTO event_steps VALUES($1, $2, $3, $4, $5, $5, $6);"#)
        .bind(&new_step_id)
        .bind(&new_event.name)
        .bind(&new_event.text)
        .bind(&new_event.image)
        .bind(now)
        .bind(user_id)
        .execute(pool)
        .await
        .map_err(|e| Custom(Status::InternalServerError, format!("Database error: {}", e)))?;

    Ok(())
}

async fn update_event_steps(pool: &PgPool, new_event: &NewEventStep, user_id: &str) -> Result<(), Custom<String>> {
    let now = Utc::now();
    query(r#"UPDATE event_steps 
            set name = $2, text = $3, image = $4, date_update = $5, user_id = $6
            WHERE id = $1;"#)
        .bind(&new_event.id)
        .bind(&new_event.name)
        .bind(&new_event.text)
        .bind(&new_event.image)
        .bind(now)
        .bind(user_id)
        .execute(pool)
        .await
        .map_err(|e| Custom(Status::InternalServerError, format!("Database error: {}", e)))?;

    Ok(())
}
