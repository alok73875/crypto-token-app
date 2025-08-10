import React from 'react';
import { Toaster } from 'react-hot-toast';
import MintTokenForm from './components/MintTokenForm';
import TransferForm from './components/TransferForm';
import WalletView from './components/WalletView';
import TransactionHistory from './components/TransactionHistory';
import { useTokens } from './hooks/useTokens';

function App() {
  const { tokens } = useTokens();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toaster />
      <h1 className="text-2xl font-bold mb-2">💰 CryptoToken Manager</h1>
      <p className="mb-4">Create and manage cryptocurrency tokens</p>

      {/* Token Creation */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Mint New Token</h2>
        <MintTokenForm />
      </section>

      {/* Token List */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Created Tokens</h2>
        {tokens.length === 0 ? (
          <p>No tokens created yet.</p>
        ) : (
          <div className="space-y-4">
            {tokens.map((token) => (
              <div key={token.id} className="border p-4 rounded shadow">
                <h3 className="text-lg font-bold">
                  {token.name} ({token.symbol})
                </h3>
                <p>Supply: {token.total_supply.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Wallet View */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Wallets</h2>
        <WalletView />
      </section>

      {/* Transfer Tokens */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Transfer Tokens</h2>
        <TransferForm />
      </section>

      {/* Transaction History */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Transaction History</h2>
        <TransactionHistory />
      </section>
    </div>
  );
}

export default App;