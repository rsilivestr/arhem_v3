use rocket::{serde::Serialize, serde::Deserialize};
use sqlx::FromRow;
use chrono::{DateTime, Utc};

#[derive(Serialize, FromRow, Deserialize)]
pub struct User {
    pub id: String,
    pub username: String,
    pub password_hash: String,
    pub admin: bool,
    pub donate: bool,
    pub active: bool,
    pub token: Option<String>,
    pub date_create: DateTime<Utc>,
}

#[derive(Deserialize)]
pub struct Credentials {
    pub username: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct LoginResponse {
    pub message: String,
    pub token: String,
}

#[derive(Serialize, FromRow, Deserialize)]
pub struct NewEvent {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub image: Option<String>,
    pub max_cols: i16,
    pub max_rows: i16,
}

#[derive(Serialize, FromRow, Deserialize)]
pub struct Event {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub image: Option<String>,
    pub max_cols: i16,
    pub max_rows: i16,
    pub date_create: String,
    pub date_update: String,
    pub user: String,
}

#[derive(Debug, Deserialize)]
pub struct EventId {
    pub id: String
}

#[derive(Serialize, FromRow, Deserialize)]
pub struct NewEventStep {
    pub id: String,
    pub event_id: String,
    pub start: bool,
    pub col: i16,
    pub row: i16,
    pub name: String,
    pub text: String,
    pub image: Option<String>,
}

#[derive(Serialize, FromRow, Deserialize)]
pub struct EventStep {
    pub id: String,
    pub name: String,
    pub text: String,
    pub image: Option<String>,
    pub date_create: String,
    pub date_update: String,
    pub user: String,
}

#[derive(Serialize, FromRow, Deserialize)]
pub struct NewEventLink {
    pub id: String,
    pub step_id: String,
    pub output:  i16,
    pub next_step_win:String,
    pub input_win: i16,
    pub next_step_fail: Option<String>,
    pub input_fail: Option<i16>,
    pub name: String,
    pub description: Option<String>,
    pub lose_time: Option<i16>,
}

#[derive(Serialize, FromRow, Deserialize)]
pub struct EventLink {
    pub id: String,
    pub step_id: String,
    pub output:  i16,
    pub next_step_win:String,
    pub input_win: i16,
    pub next_step_fail: Option<String>,
    pub input_fail: Option<i16>,
    pub name: String,
    pub description: Option<String>,
    pub lose_time: Option<i16>,
    pub date_create: String,
    pub date_update: String,
    pub user: String,
}
