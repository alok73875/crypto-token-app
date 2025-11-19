import axios from 'axios';

// 🌐 Base URL for Rust backend
export // const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const BASE_URL = "http://localhost:8888/api";
// 🔧 Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 📦 Token API methods
export const tokenAPI = {
  async mintToken(tokenData) {
    const response = await api.post('/api/mint', tokenData);
    return response.data;
  },

  async transferTokens(transferData) {
    const response = await api.post('/api/transfer', transferData);
    return response.data;
  },

  async getBalance(address) {
    const response = await api.get(`/api/balance/${address}`);
    return response.data;
  },

  async getAllTokens() {
    const response = await api.get('/api/tokens');
    return response.data;
  },

  async getAllWallets() {
    const response = await api.get('/api/wallets');
    return response.data;
  },

  async getTransactions() {
    const response = await api.get('/api/transactions');
    return response.data;
  }
};

export default api;