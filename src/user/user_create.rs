use rocket::{post, serde::json::Json, State, response::status::Custom, http::Status};
use sqlx::{query_as, PgPool};
use cuid::cuid2;
use chrono::Utc;
use bcrypt::{hash, DEFAULT_COST};

use crate::models::{Credentials, User};
use crate::system::user_log_creation::user_log_creation;

#[post("/users", format = "application/json", data = "<credentials>")]
pub async fn user_create(pool: &State<PgPool>, credentials: Json<Credentials>) -> Result<Json<User>, Custom<String>> {
    let new_user = credentials.into_inner();
    let guid = cuid2();
    let date_create = Utc::now();

    // Hash the password
    let password_hash = hash(&new_user.password, DEFAULT_COST).map_err(|e| {
        Custom(Status::InternalServerError, format!("Password hashing error: {}", e),)
    })?;

    let query = r#"
        INSERT INTO users (guid, username, password_hash, admin, donate, active, token, date_create)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (username)
        DO UPDATE SET
            password_hash = EXCLUDED.password_hash,
            admin = EXCLUDED.admin,
            donate = EXCLUDED.donate,
            active = EXCLUDED.active,
            token = EXCLUDED.token,
            date_create = EXCLUDED.date_create
        RETURNING guid, username, password_hash, admin, donate, active, token, date_create;
    "#;

    let inserted_user: User = match query_as::<_, User>(query)
        .bind(&guid)
        .bind(&new_user.username)
        .bind(&password_hash)
        .bind(false) // Default value for admin
        .bind(false) // Default value for donate
        .bind(true)  // Default value for active
        .bind::<Option<String>>(None) // Default value for token
        .bind(date_create)
        .fetch_one(pool.inner())
        .await
    {
        Ok(user) => user,
        Err(e) => {
            // Log the error for better debugging
            eprintln!("Database error: {}", e);
            return Err(Custom(Status::InternalServerError, format!("Database error: {}", e),));
        }
    };
    user_log_creation(pool.inner(), &inserted_user.guid, "Пользователь создан").await?;

    Ok(Json(inserted_user))
}

