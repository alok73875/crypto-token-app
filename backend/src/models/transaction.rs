use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

/// Represents a token transaction (mint or transfer)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Transaction {
    pub id: Uuid,
    pub tx_type: TransactionType,
    pub token_id: Uuid,
    pub from_address: Option<String>,
    pub to_address: String,
    pub amount: f64,
    pub timestamp: DateTime<Utc>,
    pub status: TransactionStatus,
}

/// Type of transaction
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TransactionType {
    Mint,
    Transfer,
}

/// Status of transaction
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TransactionStatus {
    Pending,
    Completed,
    Failed,
}

/// Request payload for transferring tokens
#[derive(Debug, Deserialize)]
pub struct TransferRequest {
    pub token_id: Uuid,
    pub from_address: String,
    pub to_address: String,
    pub amount: f64,
}

impl Transaction {
    /// Creates a mint transaction
    pub fn new_mint(token_id: Uuid, to_address: String, amount: f64) -> Self {
        Self {
            id: Uuid::new_v4(),
            tx_type: TransactionType::Mint,
            token_id,
            from_address: None,
            to_address,
            amount,
            timestamp: Utc::now(),
            status: TransactionStatus::Completed,
        }
    }

    /// Creates a transfer transaction
    pub fn new_transfer(token_id: Uuid, from_address: String, to_address: String, amount: f64) -> Self {
        Self {
            id: Uuid::new_v4(),
            tx_type: TransactionType::Transfer,
            token_id,
            from_address: Some(from_address),
            to_address,
            amount,
            timestamp: Utc::now(),
            status: TransactionStatus::Completed,
        }
    }
}