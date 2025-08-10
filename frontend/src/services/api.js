import axios from 'axios';

// 🌐 Base API URL (can be overridden by environment variable)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// 🔧 Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 📦 Token API methods
export const tokenAPI = {
  // Mint a new token
  async mintToken(tokenData) {
    const response = await api.post('/mint', tokenData);
    return response.data;
  },

  // Transfer tokens between wallets
  async transferTokens(transferData) {
    const response = await api.post('/transfer', transferData);
    return response.data;
  },

  // Get balance for a specific wallet
  async getBalance(address) {
    const response = await api.get(`/balance/${address}`);
    return response.data;
  },

  // Get all minted tokens
  async getAllTokens() {
    const response = await api.get('/tokens');
    return response.data;
  },

  // Get all wallets
  async getAllWallets() {
    const response = await api.get('/wallets');
    return response.data;
  },

  // Get all transactions
  async getTransactions() {
    const response = await api.get('/transactions');
    return response.data;
  }
};

export default api;