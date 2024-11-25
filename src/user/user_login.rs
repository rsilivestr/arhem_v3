use rocket::{post, serde::json::Json, State, response::Debug};
use sqlx::{query_scalar, query, PgPool};
use bcrypt::verify;
use cuid::cuid2;

use crate::models::{Credentials, LoginResponse};


#[post("/user_login", format = "json", data = "<credentials>")]
pub async fn user_login(pool: &State<PgPool>, credentials: Json<Credentials>) -> Result<Json<LoginResponse>, Debug<sqlx::Error>> {
    let credentials = credentials.into_inner();

    // Ищем пользователя по username
    let exists: bool = query_scalar(r#"SELECT EXISTS(SELECT 1 FROM users WHERE username = $1 and active = true)"#)
        .bind(&credentials.username)
        .fetch_one(pool.inner())
        .await
        .map_err(Debug)?;

    if !exists {
        return Err(Debug(sqlx::Error::RowNotFound));
    }

    // Получаем хеш пароля из базы данных
    let user_hash: String = query_scalar(r#"SELECT password_hash FROM users WHERE username = $1"#)
        .bind(&credentials.username)
        .fetch_one(pool.inner())
        .await
        .map_err(Debug)?;

    if let Ok(valid) = verify(credentials.password.as_bytes(), &user_hash) {
        if valid {
            // Генерируем UUID для токена
            let token = cuid2();

            // Обновляем строку в базе данных с новым токеном
            query(r#"UPDATE users SET token = $1 WHERE username = $2"#)
            .bind(&token)
            .bind(credentials.username)
            .execute(pool.inner())
            .await
            .map_err(Debug)?;
            // Возвращаем токен в ответе JSON
            Ok(Json(LoginResponse {
                message: "Logged in successfully".to_string(),
                token,
            }))
        } else {
            Err(Debug(sqlx::Error::RowNotFound))
        }
    } else {
        Err(Debug(sqlx::Error::RowNotFound))
    }
}
