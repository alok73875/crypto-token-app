import React from 'react';

const WalletView = ({ wallets = [], tokens = [] }) => {
  const getTokenSymbol = (tokenId) => {
    const token = tokens.find((t) => t.id === tokenId);
    return token ? token.symbol : 'Unknown';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">🧾 Active Wallets</h3>

      {wallets.length === 0 ? (
        <p>No wallets yet.</p>
      ) : (
        wallets.slice(0, 5).map((wallet, index) => {
          const hasBalances = Object.values(wallet.balances).some((balance) => balance > 0);

          return (
            <div key={index} className="border p-4 rounded shadow">
              <h4 className="font-bold text-md mb-1">
                💼 Wallet: {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
              </h4>

              <p className="font-medium">Holdings:</p>
              {hasBalances ? (
                <ul className="list-disc ml-5">
                  {Object.entries(wallet.balances)
                    .filter(([_, balance]) => balance > 0)
                    .map(([tokenId, balance]) => (
                      <li key={tokenId}>
                        {balance.toLocaleString()} {getTokenSymbol(tokenId)}
                      </li>
                    ))}
                </ul>
              ) : (
                <p>No tokens</p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default WalletView;