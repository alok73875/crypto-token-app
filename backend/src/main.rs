use actix_web::{web, App, HttpServer, middleware::Logger};
use actix_cors::Cors;

mod models;
mod handlers;
mod storage;

use storage::MemoryStore;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize logger
    env_logger::init();

    // Shared in-memory store
    let store = web::Data::new(MemoryStore::new());

    println!("🚀 Starting Crypto Token Server on http://localhost:8080");

    // Start HTTP server
    HttpServer::new(move || {
        App::new()
            .app_data(store.clone())
            .wrap(Logger::default())
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header()
            )
            .service(
                web::scope("/api")
                    .route("/mint", web::post().to(handlers::mint::mint_token))
                    .route("/transfer", web::post().to(handlers::transfer::transfer_tokens))
                    .route("/balance/{address}", web::get().to(handlers::balance::get_balance))
                    .route("/tokens", web::get().to(handlers::mint::get_tokens))
                    .route("/wallets", web::get().to(handlers::balance::get_wallets))
                    .route("/transactions", web::get().to(handlers::transfer::get_transactions))
            )
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}