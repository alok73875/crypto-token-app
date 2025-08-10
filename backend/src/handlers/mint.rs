use actix_web::{web, HttpResponse, Result};
use serde_json::json;

use crate::models::{Token, Wallet, Transaction, MintRequest};
use crate::storage::MemoryStore;

/// POST /api/mint — Mint a new token and assign it to a wallet
pub async fn mint_token(
    store: web::Data<MemoryStore>,
    req: web::Json<MintRequest>,
) -> Result<HttpResponse> {
    // Create new token
    let token = Token::new(
        req.name.clone(),
        req.symbol.clone(),
        req.initial_supply,
        req.owner_address.clone(),
    );

    // Create or retrieve wallet
    let mut wallet = store
        .get_wallet(&req.owner_address)
        .unwrap_or_else(|| Wallet::new(req.owner_address.clone()));

    // Add initial supply to wallet
    wallet.add_balance(token.id, req.initial_supply);

    // Create mint transaction
    let transaction = Transaction::new_mint(
        token.id,
        req.owner_address.clone(),
        req.initial_supply,
    );

    // Persist data
    store.add_token(token.clone());
    store.update_wallet(wallet);
    store.add_transaction(transaction);

    Ok(HttpResponse::Ok().json(json!({
        "success": true,
        "message": format!("Token {} minted successfully!", token.symbol),
        "token": token
    })))
}

/// GET /api/tokens — Retrieve all minted tokens
pub async fn get_tokens(store: web::Data<MemoryStore>) -> Result<HttpResponse> {
    let tokens = store.get_all_tokens();
    Ok(HttpResponse::Ok().json(tokens))
}