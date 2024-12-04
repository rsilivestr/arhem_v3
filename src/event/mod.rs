use rocket::routes;

mod get_events;
mod get_event_steps;
mod get_event_shema;
mod create_event;
mod create_event_step;
mod create_event_link;

pub fn event_routes() -> Vec<rocket::Route> {
    routes![
        get_events::get_events,
        create_event::create_event,
        get_event_steps::get_event_steps,
        create_event_step::create_event_step,
        create_event_link::create_event_link,
        get_event_shema::get_event_shema,
    ]
}
