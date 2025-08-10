import { useState, useEffect } from 'react';
import { tokenAPI } from '../services/api';

/**
 * Custom hook to manage tokens, wallets, and transactions
 */
export const useTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data from backend
  const fetchData = async () => {
    try {
      setLoading(true);

      const [tokensData, walletsData, transactionsData] = await Promise.all([
        tokenAPI.getAllTokens(),
        tokenAPI.getAllWallets(),
        tokenAPI.getTransactions()
      ]);

      setTokens(tokensData);
      setWallets(walletsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Manual refresh trigger
  const refreshData = () => {
    fetchData();
  };

  return {
    tokens,
    wallets,
    transactions,
    loading,
    refreshData
  };
};