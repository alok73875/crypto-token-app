import React from 'react';

const TransactionHistory = ({ transactions, tokens }) => {
  const getTokenSymbol = (tokenId) => {
    const token = tokens.find(t => t.id === tokenId);
    return token ? token.symbol : 'Unknown';
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Recent Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <div className="space-y-4">
          {transactions.slice(0, 10).map(tx => {
            const isMint = tx.tx_type === 'Mint';
            const bgClass = isMint ? 'bg-purple-50 border-purple-200' : 'bg-blue-50 border-blue-200';
            const icon = isMint ? '🏭' : '💸';

            return (
              <div
                key={tx.id}
                className={`border p-4 rounded shadow ${bgClass}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span>{icon}</span>
                  <span className="font-bold">{isMint ? 'Minted' : 'Transfer'}</span>
                  <span>
                    {tx.amount.toLocaleString()} {getTokenSymbol(tx.token_id)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(tx.timestamp).toLocaleTimeString()}
                </div>
                {!isMint && (
                  <div className="text-sm mt-1">
                    <p>From: {tx.from_address?.substring(0, 8)}...</p>
                    <p>To: {tx.to_address.substring(0, 8)}...</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;