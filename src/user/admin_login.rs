use rocket::{post, serde::json::Json, State, response::status::Forbidden};
use sqlx::{query, query_as, PgPool};
use bcrypt::verify;
use cuid::cuid2;

use crate::models::{Credentials, LoginResponse, User};

#[post("/admin_login", format = "json", data = "<credentials>")]
pub async fn admin_login(pool: &State<PgPool>, credentials: Json<Credentials>) -> Result<Json<LoginResponse>, Forbidden<String>> {
    let credentials = credentials.into_inner();

    // Получаем хеш пароля из базы данных
    let user: Option<User> = query_as::<_, User>(r#"SELECT * FROM users WHERE username = $1 and admin = true limit 1;"#)
        .bind(&credentials.username)
        .fetch_optional(pool.inner())
        .await
        .map_err(|_| Forbidden("Не смог найти user".to_string()))?;

    let user = match user {
        Some(h) => h,
        None => return Err(Forbidden("Не найден admin".to_string())),
    };

    if let Ok(valid) = verify(credentials.password.as_bytes(), &user.password_hash) {
        if valid {
            // Проверяем, есть ли уже токен
            let token = match user.token {
                Some(token) => token,
                None => {
                    // Генерируем новый UUID для токена
                    let new_token = cuid2();

                    // Обновляем строку в базе данных с новым токеном
                    query(r#"UPDATE users SET token = $1 WHERE username = $2"#)
                        .bind(&new_token)
                        .bind(&credentials.username)
                        .execute(pool.inner())
                        .await
                        .map_err(|_| Forbidden("Не смог update token".to_string()))?;

                    new_token
                }
            };
            Ok(Json(LoginResponse {
                message: "Logged in successfully".to_string(),
                token,
            }))
        } else {
           Err(Forbidden("Неправильный пароль".to_string()))
        }
    } else {
        Err(Forbidden("Неправильный пароль".to_string()))
    }
}
