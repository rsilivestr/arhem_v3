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
pub struct NewUser {
    pub username: String,
    pub password: String,
}

#[derive(Serialize, FromRow, Deserialize)]
pub struct Event {
    pub guid: String,
    pub name: String,
}

