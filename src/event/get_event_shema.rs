use rocket::{get, serde::json::Json, State, response::status::Custom, http::Status};
use rocket::serde::Serialize;
use sqlx::{PgPool, query_as};

use crate::models::{EventStep, EventLink};
use crate::system::admin_token::AdminToken;

#[derive(Serialize)]
pub struct EventChema {
    event_guid: String,
    steps: Vec<Step>
}

#[derive(Serialize)]
pub struct Step {
    step: EventStep,
    links: Vec<EventLink>
}

#[get("/event_shema/<guid>")]
pub async fn get_event_shema(pool: &State<PgPool>, guid: String, _user_guid: AdminToken) -> Result<Json<EventChema>, Custom<String>> {
    let query = r#"
        SELECT
            s.guid, s.event_guid, s.start, s.finish, s.name, s.text, s.image,
            to_char(s.date_create AT TIME ZONE 'Europe/Moscow', 'YYYY-MM-DD HH24:MI:SS') as date_create,
            to_char(s.date_update AT TIME ZONE 'Europe/Moscow', 'YYYY-MM-DD HH24:MI:SS') as date_update,
            u.username as user
        FROM event_steps s
        INNER JOIN users u ON s.user_guid = u.guid
        WHERE s.event_guid = $1;"#;

    let steps: Vec<EventStep> = match query_as::<_, EventStep>(query)
        .bind(&guid)
        .fetch_all(pool.inner())
        .await
    {
        Ok(steps) => steps,
        Err(e) => {
            return Err(Custom(Status::InternalServerError, format!("Database error: {}", e)));
        }
    };

    let mut steps_with_links = Vec::new();

    for step in steps {
        // Fetch links for each step
        let links: Vec<EventLink> = match query_as::<_, EventLink>(
            r#"SELECT
                l.guid, l.step_guid, l.name, l.description, l.lose_time,
                l.next_step_win, l.next_step_lose,
                to_char(l.date_create AT TIME ZONE 'Europe/Moscow', 'YYYY-MM-DD HH24:MI:SS') as date_create,
                to_char(l.date_update AT TIME ZONE 'Europe/Moscow', 'YYYY-MM-DD HH24:MI:SS') as date_update,
                u.username as user
            FROM event_links l 
            INNER JOIN users u ON l.user_guid = u.guid
            WHERE l.step_guid = $1"#)
            .bind(&step.guid)
            .fetch_all(pool.inner())
            .await
        {
            Ok(links) => links,
            Err(e) => {
                println!("{}", e);
                Vec::new()
            },
        };

        steps_with_links.push(Step {
            step,
            links,
        });
    }

    let event_chema = EventChema {
        event_guid: guid,
        steps: steps_with_links,
    };

    Ok(Json(event_chema))
}
