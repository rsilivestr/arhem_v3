use rocket::{serde::Serialize, serde::Deserialize};
use sqlx::FromRow;

#[derive(Serialize, FromRow, Deserialize)]
pub struct Event {
    pub guid: String,
    pub name: String,
}

