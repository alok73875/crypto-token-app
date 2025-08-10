import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { tokenAPI } from '../services/api';

const MintTokenForm = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);

  const generateAddress = () => {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    setValue('owner_address', address);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await tokenAPI.mintToken({
        name: data.name,
        symbol: data.symbol,
        initial_supply: parseFloat(data.initial_supply),
        owner_address: data.owner_address,
      });
      toast.success(result.message);
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mint token');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block font-medium">Token Name</label>
        <input
          type="text"
          {...register('name', { required: 'Token name is required' })}
          className="w-full border p-2 rounded"
          placeholder="Bitcoin Gold"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Token Symbol</label>
        <input
          type="text"
          {...register('symbol', { required: 'Token symbol is required' })}
          className="w-full border p-2 rounded"
          placeholder="BTG"
        />
        {errors.symbol && <p className="text-red-500 text-sm">{errors.symbol.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Initial Supply</label>
        <input
          type="number"
          {...register('initial_supply', {
            required: 'Initial supply is required',
            min: { value: 1, message: 'Supply must be at least 1' },
          })}
          className="w-full border p-2 rounded"
          placeholder="1000000"
        />
        {errors.initial_supply && (
          <p className="text-red-500 text-sm">{errors.initial_supply.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium">Owner Wallet Address</label>
        <div className="flex gap-2">
          <input
            type="text"
            {...register('owner_address', { required: 'Owner address is required' })}
            className="flex-1 border p-2 rounded"
            placeholder="0x742d35Cc6634C0532925a3b8D404fD4C0b4f1234"
          />
          <button
            type="button"
            onClick={generateAddress}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Generate
          </button>
        </div>
        {errors.owner_address && (
          <p className="text-red-500 text-sm">{errors.owner_address.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {isLoading ? 'Minting Token...' : '🏭 Mint Token'}
      </button>
    </form>
  );
};

export default MintTokenForm;