use actix_web::{web, HttpResponse, Result};
use serde_json::json;

use crate::storage::MemoryStore;

/// GET /api/balance/{address} — Retrieve token balances for a wallet
pub async fn get_balance(
    store: web::Data<MemoryStore>,
    path: web::Path<String>,
) -> Result<HttpResponse> {
    let address = path.into_inner();

    match store.get_wallet(&address) {
        Some(wallet) => Ok(HttpResponse::Ok().json(json!({
            "address": wallet.address,
            "balances": wallet.balances,
            "total_tokens": wallet.balances.len()
        }))),
        None => Ok(HttpResponse::Ok().json(json!({
            "address": address,
            "balances": {},
            "total_tokens": 0
        }))),
    }
}

/// GET /api/wallets — Retrieve all wallets
pub async fn get_wallets(store: web::Data<MemoryStore>) -> Result<HttpResponse> {
    let wallets = store.get_all_wallets();
    Ok(HttpResponse::Ok().json(wallets))
}