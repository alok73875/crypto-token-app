import React from 'react';
import MintTokenForm from '../components/MintTokenForm';
import TransferForm from '../components/TransferForm';
import WalletView from '../components/WalletView';
import TransactionHistory from '../components/TransactionHistory';
import { useTokens } from '../hooks/useTokens';

const Dashboard = () => {
  const { tokens } = useTokens();

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-2">💰 CryptoToken Manager</h1>
      <p className="mb-4">Create and manage cryptocurrency tokens</p>

      {/* Mint, Transfer, Wallet, History sections go here */}
      {/* (same as your original App.jsx) */}
    </div>
  );
};

export default Dashboard;