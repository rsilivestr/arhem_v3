use rocket::{get, serde::json::Json, State, response::status::Custom, http::Status};
use rocket::serde::Serialize;
use sqlx::{PgPool, query_as};

use crate::models::{EventStep, EventLink};
use crate::system::admin_token::AdminToken;

#[derive(Serialize)]
pub struct EventChema {
    event_guid: String,
    max_cols: i16,
    max_rows: i16,
    steps: Vec<Step>
}

#[derive(Serialize)]
pub struct Step {
    step: EventStep,
    links: Vec<EventLink>
}

#[get("/event_shema/<event_id>")]
pub async fn get_event_shema(pool: &State<PgPool>, event_id: String, _user_id: AdminToken) -> Result<Json<EventChema>, Custom<String>> {
    let query = r#"SELECT max_cols, max_rows FROM events WHERE id = $1;"#;
    let max:(i16, i16) = match query_as::<_, (i16, i16)>(query)
        .bind(&event_id)
        .fetch_all(pool.inner())
        .await
    {
        Ok(max) => max[0],
        Err(e) => {
            return Err(Custom(Status::InternalServerError, format!("Не найден Event: {}", e)));
        }
    };

    let query = r#"
        SELECT
            s.id, s.name, s.text, s.image, s.col, s.row
            to_char(s.date_create AT TIME ZONE 'Europe/Moscow', 'YYYY-MM-DD HH24:MI:SS') as date_create,
            to_char(s.date_update AT TIME ZONE 'Europe/Moscow', 'YYYY-MM-DD HH24:MI:SS') as date_update,
            u.username as user
        FROM event_x_steps e 
        INNER JOIN event_steps s on e.step_id = s.id
        INNER JOIN users u ON s.user_guid = u.id
        WHERE s.event_id = $1;"#;

    let steps: Vec<EventStep> = match query_as::<_, EventStep>(query)
        .bind(&event_id)
        .fetch_all(pool.inner())
        .await
    {
        Ok(steps) => steps,
        Err(e) => {
            return Err(Custom(Status::InternalServerError, format!("Проблемы со step: {}", e)));
        }
    };

    let mut steps_with_links = Vec::new();

    for step in steps {
        // Fetch links for each step
        let links: Vec<EventLink> = match query_as::<_, EventLink>(
            r#"SELECT
                l.id, l.step_id, l.output, l.next_step_win, l.input_win,
                l.next_step_fail, l.input_fail,
                l.name, l.description, l.lose_time,
                to_char(l.date_create AT TIME ZONE 'Europe/Moscow', 'YYYY-MM-DD HH24:MI:SS') as date_create,
                to_char(l.date_update AT TIME ZONE 'Europe/Moscow', 'YYYY-MM-DD HH24:MI:SS') as date_update,
                u.username as user
            FROM event_links l 
            INNER JOIN users u ON l.user_id = u.id
            WHERE l.step_id = $1"#)
            .bind(&step.id)
            .fetch_all(pool.inner())
            .await
        {
            Ok(links) => links,
            Err(e) => {
                println!("Проблемы с link, по идее просто пустые{}", e);
                Vec::new()
            },
        };

        steps_with_links.push(Step {
            step,
            links,
        });
    }

    let event_chema = EventChema {
        event_guid: event_id,
        max_cols: max.0,
        max_rows: max.1,
        steps: steps_with_links,
    };

    Ok(Json(event_chema))
}
