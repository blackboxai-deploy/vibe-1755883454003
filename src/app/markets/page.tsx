"use client";

import { useState } from "react";
import { MarketOverview } from "@/components/MarketOverview";
import { TradingChart } from "@/components/TradingChart";
import { TopCryptos } from "@/components/TopCryptos";
import { MarketStats } from "@/components/MarketStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MarketsPage() {
  const [selectedSymbol, setSelectedSymbol] = useState("BTC/USDT");

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Cryptocurrency Markets</h1>
        <p className="text-muted-foreground">
          Real-time market data, price charts, and trading information for all major cryptocurrencies.
        </p>
      </div>

      {/* Market Statistics */}
      <MarketStats />

      {/* Selected Crypto Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Price Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <TradingChart symbol={selectedSymbol} height={400} />
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Market Overview - Takes 3 columns */}
        <div className="lg:col-span-3">
          <MarketOverview onSymbolSelect={setSelectedSymbol} />
        </div>
        
        {/* Top Gainers/Losers - Takes 1 column */}
        <div className="lg:col-span-1">
          <TopCryptos />
        </div>
      </div>
    </div>
  );
}