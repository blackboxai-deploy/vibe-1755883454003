"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useMarketData } from './MarketDataContext';

export interface PortfolioAsset {
  symbol: string;
  quantity: number;
  averagePrice: number;
  totalCost: number;
  currentValue: number;
  pnl: number;
  pnlPercentage: number;
  lastUpdated: Date;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdrawal';
  symbol: string;
  quantity: number;
  price: number;
  total: number;
  fee: number;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}

export interface Portfolio {
  totalValue: number;
  totalCost: number;
  totalPnL: number;
  totalPnLPercentage: number;
  assets: PortfolioAsset[];
  usdBalance: number;
  lastUpdated: Date;
}

interface PortfolioContextType {
  portfolio: Portfolio | null;
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp' | 'status'>) => void;
  updatePortfolio: () => void;
  getAssetBySymbol: (symbol: string) => PortfolioAsset | undefined;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// Mock initial portfolio data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    symbol: 'USDT',
    quantity: 10000,
    price: 1,
    total: 10000,
    fee: 0,
    timestamp: new Date('2024-01-01'),
    status: 'completed',
  },
  {
    id: '2',
    type: 'buy',
    symbol: 'BTC/USDT',
    quantity: 0.25,
    price: 42000,
    total: 10500,
    fee: 10.5,
    timestamp: new Date('2024-01-02'),
    status: 'completed',
  },
  {
    id: '3',
    type: 'buy',
    symbol: 'ETH/USDT',
    quantity: 2.5,
    price: 2600,
    total: 6500,
    fee: 6.5,
    timestamp: new Date('2024-01-03'),
    status: 'completed',
  },
];

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { cryptos } = useMarketData();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Load user's portfolio and transactions
      const storedTransactions = localStorage.getItem(`transactions_${user.id}`);
      if (storedTransactions) {
        const parsed = JSON.parse(storedTransactions);
        setTransactions(parsed.map((t: any) => ({
          ...t,
          timestamp: new Date(t.timestamp),
        })));
      } else {
        setTransactions(mockTransactions);
        localStorage.setItem(`transactions_${user.id}`, JSON.stringify(mockTransactions));
      }
    } else {
      setTransactions([]);
      setPortfolio(null);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (transactions.length > 0 && cryptos.length > 0) {
      updatePortfolio();
    }
  }, [transactions, cryptos]);

  const calculatePortfolio = (): Portfolio => {
    const assetMap = new Map<string, { quantity: number; totalCost: number; }>();
    let usdBalance = 0;

    // Process all transactions
    transactions.forEach(transaction => {
      if (transaction.status !== 'completed') return;

      switch (transaction.type) {
        case 'deposit':
          if (transaction.symbol === 'USDT') {
            usdBalance += transaction.quantity;
          }
          break;

        case 'withdrawal':
          if (transaction.symbol === 'USDT') {
            usdBalance -= transaction.quantity;
          }
          break;

        case 'buy':
          const buyAsset = assetMap.get(transaction.symbol) || { quantity: 0, totalCost: 0 };
          buyAsset.quantity += transaction.quantity;
          buyAsset.totalCost += transaction.total + transaction.fee;
          assetMap.set(transaction.symbol, buyAsset);
          usdBalance -= (transaction.total + transaction.fee);
          break;

        case 'sell':
          const sellAsset = assetMap.get(transaction.symbol) || { quantity: 0, totalCost: 0 };
          const sellRatio = transaction.quantity / sellAsset.quantity;
          sellAsset.quantity -= transaction.quantity;
          sellAsset.totalCost -= (sellAsset.totalCost * sellRatio);
          assetMap.set(transaction.symbol, sellAsset);
          usdBalance += (transaction.total - transaction.fee);
          break;
      }
    });

    // Calculate portfolio assets
    const assets: PortfolioAsset[] = [];
    let totalValue = usdBalance;
    let totalCost = 0;

    assetMap.forEach((data, symbol) => {
      if (data.quantity <= 0) return;

      const crypto = cryptos.find(c => c.symbol === symbol);
      if (!crypto) return;

      const currentValue = data.quantity * crypto.price;
      const averagePrice = data.totalCost / data.quantity;
      const pnl = currentValue - data.totalCost;
      const pnlPercentage = (pnl / data.totalCost) * 100;

      assets.push({
        symbol,
        quantity: data.quantity,
        averagePrice,
        totalCost: data.totalCost,
        currentValue,
        pnl,
        pnlPercentage,
        lastUpdated: new Date(),
      });

      totalValue += currentValue;
      totalCost += data.totalCost;
    });

    const totalPnL = totalValue - totalCost;
    const totalPnLPercentage = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

    return {
      totalValue,
      totalCost,
      totalPnL,
      totalPnLPercentage,
      assets,
      usdBalance,
      lastUpdated: new Date(),
    };
  };

  const updatePortfolio = () => {
    if (transactions.length > 0 && cryptos.length > 0) {
      const newPortfolio = calculatePortfolio();
      setPortfolio(newPortfolio);
    }
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'timestamp' | 'status'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
      timestamp: new Date(),
      status: 'completed',
    };

    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);

    if (user) {
      localStorage.setItem(`transactions_${user.id}`, JSON.stringify(updatedTransactions));
    }
  };

  const getAssetBySymbol = (symbol: string): PortfolioAsset | undefined => {
    return portfolio?.assets.find(asset => asset.symbol === symbol);
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        transactions,
        isLoading,
        addTransaction,
        updatePortfolio,
        getAssetBySymbol,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}