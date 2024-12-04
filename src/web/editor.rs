use rocket::response::content::RawHtml;
use std::fs;
use rocket::get;

#[get("/editor/login")]
pub fn login() -> RawHtml<String> {
    let content = fs::read_to_string("static/editor/login.html").expect("Unable to read file");
    RawHtml(content)
}

#[get("/editor/editor")]
pub fn editor() -> RawHtml<String> {
    let content = fs::read_to_string("static/editor/index.html").expect("Unable to read file");
    RawHtml(content)
}

#[get("/editor/register")]
pub fn register() -> RawHtml<String> {
    let content = fs::read_to_string("static/editor/register.html").expect("Unable to read file");
    RawHtml(content)
}
