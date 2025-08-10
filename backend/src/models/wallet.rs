use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use std::collections::HashMap;

/// Represents a wallet holding token balances
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Wallet {
    pub address: String,
    pub balances: HashMap<Uuid, f64>,
    pub created_at: DateTime<Utc>,
}

impl Wallet {
    /// Creates a new wallet with an empty balance map
    pub fn new(address: String) -> Self {
        Self {
            address,
            balances: HashMap::new(),
            created_at: Utc::now(),
        }
    }

    /// Retrieves the balance for a specific token
    pub fn get_balance(&self, token_id: &Uuid) -> f64 {
        *self.balances.get(token_id).unwrap_or(&0.0)
    }

    /// Adds tokens to the wallet balance
    pub fn add_balance(&mut self, token_id: Uuid, amount: f64) {
        let current = self.balances.get(&token_id).unwrap_or(&0.0);
        self.balances.insert(token_id, current + amount);
    }

    /// Subtracts tokens from the wallet balance, returns error if insufficient
    pub fn subtract_balance(&mut self, token_id: &Uuid, amount: f64) -> Result<(), String> {
        let current = self.get_balance(token_id);
        if current < amount {
            return Err(format!(
                "Insufficient balance. Available: {}, Required: {}",
                current, amount
            ));
        }
        self.balances.insert(*token_id, current - amount);
        Ok(())
    }
}