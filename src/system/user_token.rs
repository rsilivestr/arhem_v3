use rocket::{
    request::{FromRequest, Outcome},
    http::Status,
    Request,
};
use sqlx::PgPool;

#[derive(Debug)]
pub struct UserToken(pub String);

#[derive(Debug)]
pub enum ApiTokenError {
    Missing,
    Invalid,
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for UserToken {
    type Error = ApiTokenError;

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let pool = req.rocket().state::<PgPool>().expect("Database pool not found");
        let token = req.headers().get_one("token").map(|header| header.to_string());

        match token {
            Some(token) => {
                let query = r#"SELECT guid FROM users WHERE token = $1;"#;
                match sqlx::query_scalar::<_, String>(query)
                    .bind(&token)
                    .fetch_one(pool)
                    .await
                {
                    Ok(user_guid) => Outcome::Success(UserToken(user_guid)),
                    Err(_) => Outcome::Error((Status::Unauthorized, ApiTokenError::Invalid)),
                }
            }
            None => Outcome::Error((Status::Unauthorized, ApiTokenError::Missing)),
        }
    }
}
