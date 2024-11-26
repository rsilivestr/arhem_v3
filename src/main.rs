use std::env;
use sqlx::PgPool;
use dotenv::dotenv;
use rocket::fs::{FileServer, relative};
use rocket::routes;
use rocket_cors::{
    AllowedOrigins,
    CorsOptions,
};

mod models;
mod system;

mod user;
use crate::user::user_create::user_create;
use crate::user::user_login::user_login;
use crate::user::check_token::check_token;
use crate::user::admin_login::admin_login;

mod base;
use crate::base::create_tables::create_tables;

mod event;
use crate::event::get_events::get_events;
use crate::event::create_event::create_event;
use crate::event::get_event_steps::get_event_steps;
use crate::event::create_event_step::create_event_step;

mod manual {
    use std::path::{PathBuf, Path};
    use rocket::fs::NamedFile;

    #[rocket::get("/second/<path..>")]
    pub async fn second(path: PathBuf) -> Option<NamedFile> {
        let mut path = Path::new(super::relative!("static")).join(path);
        if path.is_dir() {
            path.push("login.html");
        }

        NamedFile::open(path).await.ok()
    }
}


#[rocket::launch]
async fn rocket() -> _ {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL не задан в конфиге");
    let pool = PgPool::connect(&database_url).await.expect("No DB CONNECT!");

    create_tables(&pool).await.expect("Не удалось создать таблицы");

    let cors = CorsOptions {
        allowed_origins: AllowedOrigins::all(),
        allowed_methods: vec![
            rocket::http::Method::Get,
            rocket::http::Method::Post,
            rocket::http::Method::Put,
            rocket::http::Method::Delete,
            rocket::http::Method::Options,
        ]
        .into_iter()
        .map(From::from)
        .collect(),
        allowed_headers: rocket_cors::AllowedHeaders::some(&[
            "Authorization",
            "Accept",
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Headers",
            "Content-Type",
        ]),
        allow_credentials: true,
        ..Default::default()
    }
    .to_cors()
    .expect("Error creating CORS fairing");

    rocket::build()
        .mount("/", routes![manual::second])
        .mount("/", FileServer::from(relative!("static")))
        .mount("/api",  routes![
            user_create, user_login, check_token, admin_login,
            get_events, create_event, get_event_steps, create_event_step,
        ])
        .manage(pool)
        .attach(cors)
}
