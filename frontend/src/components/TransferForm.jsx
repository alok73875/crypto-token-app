import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { tokenAPI } from '../services/api';

const TransferForm = ({ tokens = [], wallets = [], onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);

  const selectedTokenId = watch('token_id');
  const selectedFromAddress = watch('from_address');

  const generateAddress = () => {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    setValue('to_address', address);
  };

  const getBalance = () => {
    if (!selectedTokenId || !selectedFromAddress) return 0;
    const wallet = wallets.find((w) => w.address === selectedFromAddress);
    return wallet?.balances?.[selectedTokenId] || 0;
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await tokenAPI.transferTokens({
        token_id: data.token_id,
        from_address: data.from_address,
        to_address: data.to_address,
        amount: parseFloat(data.amount),
      });
      toast.success(result.message);
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to transfer tokens');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="text-lg font-semibold">💸 Transfer Tokens</h3>
      <p className="text-sm text-gray-600">Send tokens between wallets</p>

      {/* Token Selection */}
      <div>
        <label className="block font-medium">Select Token</label>
        <select
          {...register('token_id', { required: 'Token selection is required' })}
          className="w-full border p-2 rounded"
        >
          <option value="">Choose a token...</option>
          {tokens.map((token) => (
            <option key={token.id} value={token.id}>
              {token.name} ({token.symbol})
            </option>
          ))}
        </select>
        {errors.token_id && <p className="text-red-500 text-sm">{errors.token_id.message}</p>}
      </div>

      {/* From Address */}
      <div>
        <label className="block font-medium">From Address</label>
        <select
          {...register('from_address', { required: 'Sender address is required' })}
          className="w-full border p-2 rounded"
        >
          <option value="">Select sender wallet...</option>
          {wallets.map((wallet) => (
            <option key={wallet.address} value={wallet.address}>
              {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
            </option>
          ))}
        </select>
        {errors.from_address && <p className="text-red-500 text-sm">{errors.from_address.message}</p>}
      </div>

      {/* To Address */}
      <div>
        <label className="block font-medium">To Address</label>
        <div className="flex gap-2">
          <input
            type="text"
            {...register('to_address', { required: 'Recipient address is required' })}
            className="flex-1 border p-2 rounded"
            placeholder="0x742d35Cc6634C0532925a3b8D404fD4C0b4f5678"
          />
          <button
            type="button"
            onClick={generateAddress}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Generate
          </button>
        </div>
        {errors.to_address && <p className="text-red-500 text-sm">{errors.to_address.message}</p>}
      </div>

      {/* Amount */}
      <div>
        <label className="block font-medium">Amount</label>
        <input
          type="number"
          step="0.01"
          {...register('amount', {
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be greater than 0' },
          })}
          className="w-full border p-2 rounded"
          placeholder="100.00"
        />
        {selectedTokenId && selectedFromAddress && (
          <p className="text-sm text-gray-500">
            Available balance: {getBalance().toLocaleString()}
          </p>
        )}
        {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {isLoading ? 'Processing Transfer...' : '💸 Transfer Tokens'}
      </button>
    </form>
  );
};

export default TransferForm;

