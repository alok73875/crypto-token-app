use std::sync::Mutex;
use std::collections::HashMap;
use crate::models::types::{Wallet, Token, Transaction};

pub struct MemoryStore {
    pub wallets: Mutex<HashMap<String, Wallet>>,
    pub tokens: Mutex<Vec<Token>>,
    pub transactions: Mutex<Vec<Transaction>>,
}

impl MemoryStore {
    pub fn new() -> Self {
        MemoryStore {
            wallets: Mutex::new(HashMap::new()),
            tokens: Mutex::new(Vec::new()),
            transactions: Mutex::new(Vec::new()),
        }
    }

    #[allow(dead_code)]
    pub fn add_wallet(&self, wallet: Wallet) {
        self.wallets.lock().unwrap().insert(wallet.address.clone(), wallet);
    }
}
