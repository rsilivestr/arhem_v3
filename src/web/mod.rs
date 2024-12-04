use rocket::routes;

mod editor;


pub fn web_routes() -> Vec<rocket::Route> {
    routes![
        editor::login,
        editor::editor,
    ]
}
