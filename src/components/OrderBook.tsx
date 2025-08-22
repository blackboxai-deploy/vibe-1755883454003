"use client";

import { useMarketData } from "@/contexts/MarketDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OrderBookProps {
  symbol: string;
}

export function OrderBook({ symbol }: OrderBookProps) {
  const { getOrderBook, getCryptoBySymbol } = useMarketData();
  
  const orderBook = getOrderBook(symbol);
  const crypto = getCryptoBySymbol(symbol);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(value);
  };

  const formatQuantity = (value: number) => {
    return value.toFixed(6);
  };

  if (!crypto) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Order book not available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Order Book</CardTitle>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{symbol}</span>
          <Badge variant="outline" className="text-xs">
            Live
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-0">
        <div className="space-y-4">
          {/* Current Price */}
          <div className="px-6 py-2 bg-muted/30">
            <div className="text-center">
              <div className="text-lg font-bold">
                {formatCurrency(crypto.price)}
              </div>
              <div className={`text-sm ${
                crypto.change24h >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                {crypto.change24h >= 0 ? "+" : ""}{crypto.change24h.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Asks (Sell Orders) */}
          <div>
            <div className="px-6 pb-2">
              <h4 className="text-sm font-medium text-red-600">Asks (Sell Orders)</h4>
            </div>
            <div className="space-y-1">
              {orderBook.asks.slice(0, 10).reverse().map((ask, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-6 py-1 text-sm hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <span className="text-red-600 font-mono">
                    {formatCurrency(ask.price)}
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {formatQuantity(ask.quantity)}
                  </span>
                  <span className="font-mono text-muted-foreground text-xs">
                    {formatCurrency(ask.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bids (Buy Orders) */}
          <div>
            <div className="px-6 pb-2 pt-4 border-t">
              <h4 className="text-sm font-medium text-green-600">Bids (Buy Orders)</h4>
            </div>
            <div className="space-y-1">
              {orderBook.bids.slice(0, 10).map((bid, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-6 py-1 text-sm hover:bg-green-50 dark:hover:bg-green-950/20"
                >
                  <span className="text-green-600 font-mono">
                    {formatCurrency(bid.price)}
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {formatQuantity(bid.quantity)}
                  </span>
                  <span className="font-mono text-muted-foreground text-xs">
                    {formatCurrency(bid.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Book Legend */}
          <div className="px-6 pt-4 border-t">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Price</span>
              <span>Amount</span>
              <span>Total</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}