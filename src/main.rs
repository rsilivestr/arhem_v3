use std::env;
use sqlx::PgPool;
use dotenv::dotenv;
use rocket::fs::FileServer;

mod models;
mod system;
use crate::system::cors::cors;
mod base;
use crate::base::create_tables::create_tables;

mod user;
use crate::user::user_routes;
mod event;
use crate::event::event_routes;
mod web;
use crate::web::web_routes;


#[rocket::launch]
async fn rocket() -> _ {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL не задан в конфиге");
    let pool = PgPool::connect(&database_url).await.expect("No DB CONNECT!");

    create_tables(&pool).await.expect("Не удалось создать таблицы");

    let cors =  cors().to_cors().expect("Error creating CORS fairing");

    rocket::build()
        .mount("/", web_routes())
        .mount("/editor", FileServer::from("static/editor"))
        .mount("/api", user_routes())
        .mount("/api", event_routes())
        .manage(pool)
        .attach(cors)
}
