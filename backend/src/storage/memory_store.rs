use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use uuid::Uuid;

use crate::models::{Token, Wallet, Transaction};

/// In-memory store for tokens, wallets, and transactions
#[derive(Clone)]
pub struct MemoryStore {
    pub tokens: Arc<Mutex<HashMap<Uuid, Token>>>,
    pub wallets: Arc<Mutex<HashMap<String, Wallet>>>,
    pub transactions: Arc<Mutex<Vec<Transaction>>>,
}

impl MemoryStore {
    /// Initializes a new empty store
    pub fn new() -> Self {
        Self {
            tokens: Arc::new(Mutex::new(HashMap::new())),
            wallets: Arc::new(Mutex::new(HashMap::new())),
            transactions: Arc::new(Mutex::new(Vec::new())),
        }
    }

    // ───── Token Methods ─────

    pub fn add_token(&self, token: Token) {
        let mut tokens = self.tokens.lock().unwrap();
        tokens.insert(token.id, token);
    }

    pub fn get_token(&self, id: &Uuid) -> Option<Token> {
        let tokens = self.tokens.lock().unwrap();
        tokens.get(id).cloned()
    }

    pub fn get_all_tokens(&self) -> Vec<Token> {
        let tokens = self.tokens.lock().unwrap();
        tokens.values().cloned().collect()
    }

    // ───── Wallet Methods ─────

    pub fn add_wallet(&self, wallet: Wallet) {
        let mut wallets = self.wallets.lock().unwrap();
        wallets.insert(wallet.address.clone(), wallet);
    }

    pub fn get_wallet(&self, address: &str) -> Option<Wallet> {
        let wallets = self.wallets.lock().unwrap();
        wallets.get(address).cloned()
    }

    pub fn update_wallet(&self, wallet: Wallet) {
        let mut wallets = self.wallets.lock().unwrap();
        wallets.insert(wallet.address.clone(), wallet);
    }

    pub fn get_all_wallets(&self) -> Vec<Wallet> {
        let wallets = self.wallets.lock().unwrap();
        wallets.values().cloned().collect()
    }

    // ───── Transaction Methods ─────

    pub fn add_transaction(&self, transaction: Transaction) {
        let mut transactions = self.transactions.lock().unwrap();
        transactions.push(transaction);
    }

    pub fn get_all_transactions(&self) -> Vec<Transaction> {
        let transactions = self.transactions.lock().unwrap();
        transactions.clone()
    }
}