use rocket::response::content::RawHtml;
use std::fs;
use rocket::get;
//use rocket::uri;
//use rocket::response::Redirect;

//use crate::system::admin_token::{AdminToken, ApiTokenError};


#[get("/editor/login")]
pub fn editor_login() -> RawHtml<String> {
    let content = fs::read_to_string("static/editor/login.html").expect("Unable to read file");
    RawHtml(content)
}

#[get("/editor/register")]
pub fn editor_register() -> RawHtml<String> {
    let content = fs::read_to_string("static/editor/register.html").expect("Unable to read file");
    RawHtml(content)
}

#[get("/editor")]
pub fn editor_page() -> RawHtml<String> {
    let content = fs::read_to_string("static/editor/index.html").expect("Unable to read file");
    RawHtml(content)
}

/*
#[get("/editor")]
pub fn editor_page(user_id: Result<AdminToken, ApiTokenError>) 
    -> Result<RawHtml<String>, Redirect> {
    match user_id {
        Ok(_) => {
            let content = fs::read_to_string("static/editor/index.html").expect("Unable to read file");
            Ok(RawHtml(content))
        },
        Err(_) => Err(Redirect::to(uri!("/editor/login"))),
    }
}
*/
