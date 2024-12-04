use rocket::routes;

mod user_create;
mod user_login;
mod check_token;
mod admin_login;

pub fn user_routes() -> Vec<rocket::Route> {
    routes![
        user_create::user_create,
        user_login::user_login,
        check_token::check_token,
        admin_login::admin_login,
    ]
}
