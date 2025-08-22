"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useMarketData } from "@/contexts/MarketDataContext";
import { TradingChart } from "@/components/TradingChart";
import { OrderBook } from "@/components/OrderBook";
import { OrderForm } from "@/components/OrderForm";
import { ActiveOrders } from "@/components/ActiveOrders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TradePage() {
  const { user } = useAuth();
  const { cryptos } = useMarketData();
  const [selectedSymbol, setSelectedSymbol] = useState("BTC/USDT");
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Advanced Trading</h1>
          <p className="text-muted-foreground">
            Professional cryptocurrency trading with real-time data and advanced order types
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="min-w-48">
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger>
                <SelectValue placeholder="Select trading pair" />
              </SelectTrigger>
              <SelectContent>
                {cryptos.map((crypto) => (
                  <SelectItem key={crypto.symbol} value={crypto.symbol}>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {crypto.symbol.split('/')[0].charAt(0)}
                        </span>
                      </div>
                      <span>{crypto.symbol}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Trading Chart - Takes 3 columns */}
        <div className="lg:col-span-3 space-y-6">
          <TradingChart symbol={selectedSymbol} height={500} />
          <ActiveOrders />
        </div>

        {/* Trading Panel - Takes 1 column */}
        <div className="space-y-6">
          <OrderForm symbol={selectedSymbol} />
          <OrderBook symbol={selectedSymbol} />
        </div>
      </div>
    </div>
  );
}