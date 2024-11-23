use std::env;
use sqlx::PgPool;
use dotenv::dotenv;

use rocket::fs::{FileServer, relative};
use rocket::routes;

mod base;
use crate::base::create_tables::create_tables;

mod event;
use crate::event::get_events::get_events;

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

    let _ = create_tables(&pool).await.expect("Не удалось создать таблицы");

    rocket::build()
        .mount("/", routes![manual::second])
        .mount("/", FileServer::from(relative!("static")))
        .mount("/api",  routes![get_events]).manage(pool)
}
