use sqlx::{Executor, PgPool};
use std::fs;
use std::path::Path;

pub async fn create_tables(pool: &PgPool) -> Result<(), sqlx::Error> {
    let sql_files = vec![
        "01_users_table.sql",
        "02_users_log_text_table.sql",
        "03_users_log_table.sql",
        "04_locations_table.sql",
        "05_events_table.sql",
        "06_event_steps_table.sql",
        "07_event_x_steps_table.sql",
        "08_event_links_table.sql",
        "09_event_options_table.sql",
        "10_event_links_x_options_table.sql",
    ];

    for file_name in sql_files {
        let file_path = format!("src/base/sql/{}", file_name);
        println!("Выполняем SQL file: {}", &file_name );
        let sql = fs::read_to_string(Path::new(&file_path))
            .unwrap_or_else(|_| panic!("Не смог прочитать SQL file: {}", file_path));
        pool.execute(&*sql).await?;
    }

    Ok(())
}
