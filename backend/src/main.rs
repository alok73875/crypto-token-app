use actix_web::{web, App, HttpServer, middleware::Logger};
use actix_cors::Cors;
use mongodb::{Client, options::ClientOptions};
use std::env;
use dotenv::dotenv;

mod models;
mod handlers;
mod storage;

use storage::MemoryStore;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize logger
    env_logger::init();

    // Load environment variables
    dotenv().ok();
    let mongo_uri = env::var("MONGODB_URI").unwrap_or_else(|_| {
        eprintln!("❌ MONGODB_URI not found in .env");
        std::process::exit(1);
    });

    // Connect to MongoDB
    let client_options = match ClientOptions::parse(&mongo_uri).await {
        Ok(opts) => opts,
        Err(e) => {
            eprintln!("❌ Failed to parse MongoDB URI: {:?}", e);
            std::process::exit(1);
        }
    };

    let mongo_client = match Client::with_options(client_options) {
        Ok(client) => client,
        Err(e) => {
            eprintln!("❌ Failed to connect to MongoDB: {:?}", e);
            std::process::exit(1);
        }
    };

    // Shared in-memory store (optional)
    let store = web::Data::new(MemoryStore::new());
    let db = web::Data::new(mongo_client);

    println!("🚀 Starting Crypto Token Server on http://localhost:8080");

    // Start HTTP server
    HttpServer::new(move || {
        App::new()
            .app_data(store.clone()) // optional legacy store
            .app_data(db.clone())    // MongoDB client
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
                    .route("/status", web::get().to(|| async { "OK" })) // Health check
            )
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}