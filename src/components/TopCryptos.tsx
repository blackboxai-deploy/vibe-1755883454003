"use client";

import { useMarketData } from "@/contexts/MarketDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TopCryptos() {
  const { cryptos, isLoading } = useMarketData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(value);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Gainers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="w-24 h-4 bg-muted rounded"></div>
                    <div className="w-16 h-3 bg-muted rounded"></div>
                  </div>
                  <div className="w-16 h-6 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const topGainers = [...cryptos]
    .sort((a, b) => b.change24h - a.change24h)
    .slice(0, 5);

  const topLosers = [...cryptos]
    .sort((a, b) => a.change24h - b.change24h)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Top Gainers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topGainers.map((crypto) => (
              <div key={crypto.symbol} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {crypto.symbol.split('/')[0].charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{crypto.name}</p>
                    <p className="text-xs text-muted-foreground">{crypto.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(crypto.price)}</p>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    +{crypto.change24h.toFixed(2)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Top Losers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topLosers.map((crypto) => (
              <div key={crypto.symbol} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {crypto.symbol.split('/')[0].charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{crypto.name}</p>
                    <p className="text-xs text-muted-foreground">{crypto.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(crypto.price)}</p>
                  <Badge variant="destructive">
                    {crypto.change24h.toFixed(2)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}