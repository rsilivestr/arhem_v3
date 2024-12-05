CREATE TABLE IF NOT EXISTS event_links_x_options(
    link_id VARCHAR(25) REFERENCES event_links(id),
    option_id VARCHAR(25) REFERENCES event_options(id)
);
