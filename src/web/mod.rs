use rocket::routes;

mod editor;

pub fn web_routes() -> Vec<rocket::Route> {
    routes![
        editor::editor_login,
        editor::editor_page,
        editor::editor_register,
    ]
}
