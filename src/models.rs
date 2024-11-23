use rocket::{serde::Serialize, serde::Deserialize};
use sqlx::FromRow;

#[derive(Serialize, FromRow, Deserialize)]
pub struct Event {
    guid: String,
    name: String,
}

