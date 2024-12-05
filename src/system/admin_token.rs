use rocket::{
    request::{FromRequest, Outcome},
    http::Status,
    Request,
    response::Redirect,
    uri,
};
use sqlx::PgPool;


#[derive(Debug)]
pub struct AdminToken(pub String);

#[derive(Debug)]
pub enum ApiTokenError {
    Missing,
    Invalid,
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for AdminToken {
    type Error = ApiTokenError;

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let pool = req.rocket().state::<PgPool>().expect("Database pool not found");
        let token = req.headers().get_one("token").map(|header| header.to_string());

        match token {
            Some(token) => {
                let query = r#"SELECT id FROM users WHERE admin = True AND token = $1;"#;
                match sqlx::query_scalar::<_, String>(query)
                    .bind(&token)
                    .fetch_one(pool)
                    .await
                {
                    Ok(user_id) => Outcome::Success(AdminToken(user_id)),
                    Err(_) => {
                        let redirect = Redirect::to(uri!("editor/login"));
                        req.local_cache(|| redirect);
                        Outcome::Error((Status::Unauthorized, ApiTokenError::Invalid))
                    }
                }
            }
            None => {
                let redirect = Redirect::to(uri!("editor/login"));
                req.local_cache(|| redirect);
                Outcome::Error((Status::Unauthorized, ApiTokenError::Missing))
            }
        }
    }
}
