use rocket::{serde::Serialize, serde::Deserialize};
use sqlx::FromRow;
use chrono::{DateTime, Utc};

#[derive(Serialize, FromRow, Deserialize)]
pub struct User {
    pub guid: String,
    username: String,
    password_hash: String,
    admin: bool,
    donate: bool,
    active: bool,
    token: Option<String>,
    date_create: DateTime<Utc>,
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
    pub guid: String,
    pub name: String,
    pub description: Option<String>,
    pub image: Option<String>,
}

#[derive(Serialize, FromRow, Deserialize)]
pub struct Event {
    pub guid: String,
    pub name: String,
    pub description: Option<String>,
    pub image: Option<String>,
    pub date_create: String,
    pub date_update: String,
    pub user: String,
}

#[derive(Serialize, FromRow, Deserialize)]
pub struct NewEventStep {
    pub guid: String,
    pub event_guid: String,
    pub start: bool,
    pub finish: bool,
    pub name: String,
    pub text: String,
    pub image: Option<String>,
}

#[derive(Serialize, FromRow, Deserialize)]
pub struct EventStep {
    pub guid: String,
    pub event_guid: String,
    pub start: bool,
    pub finish: bool,
    pub name: String,
    pub text: Option<String>,
    pub image: Option<String>,
    pub date_create: String,
    pub date_update: String,
    pub user: String,
}
