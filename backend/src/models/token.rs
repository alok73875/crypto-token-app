use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

/// Represents a crypto token
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Token {
    pub id: Uuid,
    pub name: String,
    pub symbol: String,
    pub total_supply: f64,
    pub owner: String,
    pub created_at: DateTime<Utc>,
}

/// Request payload for minting a new token
#[derive(Debug, Deserialize)]
pub struct MintRequest {
    pub name: String,
    pub symbol: String,
    pub initial_supply: f64,
    pub owner_address: String,
}

impl Token {
    /// Creates a new token instance
    pub fn new(name: String, symbol: String, total_supply: f64, owner: String) -> Self {
        Self {
            id: Uuid::new_v4(),
            name,
            symbol: symbol.to_uppercase(),
            total_supply,
            owner,
            created_at: Utc::now(),
        }
    }
}