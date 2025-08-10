use actix_web::{web, HttpResponse, Result};
use serde_json::json;

use crate::models::{Wallet, Transaction, TransferRequest};
use crate::storage::MemoryStore;

/// POST /api/transfer — Transfer tokens between wallets
pub async fn transfer_tokens(
    store: web::Data<MemoryStore>,
    req: web::Json<TransferRequest>,
) -> Result<HttpResponse> {
    // Retrieve sender wallet
    let mut sender = match store.get_wallet(&req.from_address) {
        Some(wallet) => wallet,
        None => {
            return Ok(HttpResponse::BadRequest().json(json!({
                "success": false,
                "message": "Sender wallet not found"
            })));
        }
    };

    // Ensure token exists
    if store.get_token(&req.token_id).is_none() {
        return Ok(HttpResponse::BadRequest().json(json!({
            "success": false,
            "message": "Token not found"
        })));
    }

    // Attempt to subtract balance from sender
    if let Err(err) = sender.subtract_balance(&req.token_id, req.amount) {
        return Ok(HttpResponse::BadRequest().json(json!({
            "success": false,
            "message": err
        })));
    }

    // Retrieve or create receiver wallet
    let mut receiver = store
        .get_wallet(&req.to_address)
        .unwrap_or_else(|| Wallet::new(req.to_address.clone()));

    // Add balance to receiver
    receiver.add_balance(req.token_id, req.amount);

    // Create transfer transaction
    let transaction = Transaction::new_transfer(
        req.token_id,
        req.from_address.clone(),
        req.to_address.clone(),
        req.amount,
    );

    // Persist updates
    store.update_wallet(sender);
    store.update_wallet(receiver);
    store.add_transaction(transaction.clone());

    Ok(HttpResponse::Ok().json(json!({
        "success": true,
        "message": "Transfer completed successfully!",
        "transaction": transaction
    })))
}

/// GET /api/transactions — Retrieve all transactions, sorted by timestamp
pub async fn get_transactions(store: web::Data<MemoryStore>) -> Result<HttpResponse> {
    let mut transactions = store.get_all_transactions();
    transactions.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
    Ok(HttpResponse::Ok().json(transactions))
}