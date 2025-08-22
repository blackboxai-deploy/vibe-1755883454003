"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CryptoCurrency {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  lastUpdate: Date;
}

export interface PriceData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

interface MarketDataContextType {
  cryptos: CryptoCurrency[];
  priceHistory: Record<string, PriceData[]>;
  orderBooks: Record<string, OrderBook>;
  isLoading: boolean;
  getCryptoBySymbol: (symbol: string) => CryptoCurrency | undefined;
  getPriceHistory: (symbol: string, period: string) => PriceData[];
  getOrderBook: (symbol: string) => OrderBook;
}

const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

// Mock cryptocurrency data
const initialCryptos: CryptoCurrency[] = [
  {
    symbol: 'BTC/USDT',
    name: 'Bitcoin',
    price: 43250.00,
    change24h: 2.45,
    volume24h: 28500000000,
    marketCap: 847000000000,
    high24h: 43800.00,
    low24h: 42100.00,
    lastUpdate: new Date(),
  },
  {
    symbol: 'ETH/USDT',
    name: 'Ethereum',
    price: 2685.50,
    change24h: -1.23,
    volume24h: 15200000000,
    marketCap: 322000000000,
    high24h: 2750.00,
    low24h: 2650.00,
    lastUpdate: new Date(),
  },
  {
    symbol: 'BNB/USDT',
    name: 'BNB',
    price: 315.80,
    change24h: 3.67,
    volume24h: 950000000,
    marketCap: 47000000000,
    high24h: 320.00,
    low24h: 305.00,
    lastUpdate: new Date(),
  },
  {
    symbol: 'SOL/USDT',
    name: 'Solana',
    price: 102.45,
    change24h: 5.23,
    volume24h: 2100000000,
    marketCap: 44000000000,
    high24h: 105.00,
    low24h: 98.50,
    lastUpdate: new Date(),
  },
  {
    symbol: 'ADA/USDT',
    name: 'Cardano',
    price: 0.485,
    change24h: -2.18,
    volume24h: 450000000,
    marketCap: 17000000000,
    high24h: 0.498,
    low24h: 0.475,
    lastUpdate: new Date(),
  },
  {
    symbol: 'DOT/USDT',
    name: 'Polkadot',
    price: 7.32,
    change24h: 1.87,
    volume24h: 180000000,
    marketCap: 9500000000,
    high24h: 7.45,
    low24h: 7.18,
    lastUpdate: new Date(),
  },
];

// Generate mock price history
const generatePriceHistory = (crypto: CryptoCurrency, days: number = 30): PriceData[] => {
  const data: PriceData[] = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  
  let currentPrice = crypto.price * 0.9; // Start 10% lower
  
  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * dayMs);
    const volatility = 0.05; // 5% volatility
    const change = (Math.random() - 0.5) * volatility * currentPrice;
    
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) * (1 + Math.random() * 0.02);
    const low = Math.min(open, close) * (1 - Math.random() * 0.02);
    const volume = Math.random() * crypto.volume24h * 0.1;
    
    data.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume,
    });
    
    currentPrice = close;
  }
  
  return data;
};

// Generate mock order book
const generateOrderBook = (crypto: CryptoCurrency): OrderBook => {
  const bids: OrderBookEntry[] = [];
  const asks: OrderBookEntry[] = [];
  
  const basePrice = crypto.price;
  const spread = basePrice * 0.001; // 0.1% spread
  
  // Generate bids (buy orders)
  for (let i = 0; i < 20; i++) {
    const price = basePrice - spread - (i * basePrice * 0.0001);
    const quantity = Math.random() * 10 + 0.1;
    bids.push({
      price: Math.round(price * 100) / 100,
      quantity: Math.round(quantity * 1000) / 1000,
      total: Math.round(price * quantity * 100) / 100,
    });
  }
  
  // Generate asks (sell orders)
  for (let i = 0; i < 20; i++) {
    const price = basePrice + spread + (i * basePrice * 0.0001);
    const quantity = Math.random() * 10 + 0.1;
    asks.push({
      price: Math.round(price * 100) / 100,
      quantity: Math.round(quantity * 1000) / 1000,
      total: Math.round(price * quantity * 100) / 100,
    });
  }
  
  return { bids, asks };
};

export function MarketDataProvider({ children }: { children: React.ReactNode }) {
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>(initialCryptos);
  const [priceHistory, setPriceHistory] = useState<Record<string, PriceData[]>>({});
  const [orderBooks, setOrderBooks] = useState<Record<string, OrderBook>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize price history and order books
    const histories: Record<string, PriceData[]> = {};
    const books: Record<string, OrderBook> = {};
    
    initialCryptos.forEach(crypto => {
      histories[crypto.symbol] = generatePriceHistory(crypto);
      books[crypto.symbol] = generateOrderBook(crypto);
    });
    
    setPriceHistory(histories);
    setOrderBooks(books);
    setIsLoading(false);
    
    // Simulate real-time price updates
    const interval = setInterval(() => {
      setCryptos(prevCryptos => 
        prevCryptos.map(crypto => {
          const change = (Math.random() - 0.5) * 0.02; // 2% max change
          const newPrice = crypto.price * (1 + change);
          
          return {
            ...crypto,
            price: Math.round(newPrice * 100) / 100,
            change24h: crypto.change24h + (Math.random() - 0.5) * 0.5,
            lastUpdate: new Date(),
          };
        })
      );
      
      // Update order books
      setOrderBooks(prevBooks => {
        const newBooks = { ...prevBooks };
        Object.keys(newBooks).forEach(symbol => {
          const crypto = cryptos.find(c => c.symbol === symbol);
          if (crypto) {
            newBooks[symbol] = generateOrderBook(crypto);
          }
        });
        return newBooks;
      });
    }, 3000); // Update every 3 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getCryptoBySymbol = (symbol: string): CryptoCurrency | undefined => {
    return cryptos.find(crypto => crypto.symbol === symbol);
  };

  const getPriceHistory = (symbol: string, period: string = '1D'): PriceData[] => {
    const history = priceHistory[symbol] || [];
    
    switch (period) {
      case '1H':
        return history.slice(-24); // Last 24 hours
      case '1D':
        return history.slice(-7); // Last 7 days
      case '1W':
        return history.slice(-30); // Last 30 days
      case '1M':
        return history; // All data
      default:
        return history;
    }
  };

  const getOrderBook = (symbol: string): OrderBook => {
    return orderBooks[symbol] || { bids: [], asks: [] };
  };

  return (
    <MarketDataContext.Provider
      value={{
        cryptos,
        priceHistory,
        orderBooks,
        isLoading,
        getCryptoBySymbol,
        getPriceHistory,
        getOrderBook,
      }}
    >
      {children}
    </MarketDataContext.Provider>
  );
}

export function useMarketData() {
  const context = useContext(MarketDataContext);
  if (context === undefined) {
    throw new Error('useMarketData must be used within a MarketDataProvider');
  }
  return context;
}