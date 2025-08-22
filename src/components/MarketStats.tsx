"use client";

import { useMarketData } from "@/contexts/MarketDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MarketStats() {
  const { cryptos, isLoading } = useMarketData();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-2">
                <div className="w-32 h-4 bg-muted rounded"></div>
                <div className="w-24 h-8 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalMarketCap = cryptos.reduce((sum, crypto) => sum + crypto.marketCap, 0);
  const totalVolume24h = cryptos.reduce((sum, crypto) => sum + crypto.volume24h, 0);
  const gainers = cryptos.filter(crypto => crypto.change24h > 0).length;
  const losers = cryptos.filter(crypto => crypto.change24h < 0).length;

  const formatCurrency = (value: number) => {
    if (value >= 1000000000000) {
      return `$${(value / 1000000000000).toFixed(2)}T`;
    } else if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    return `$${value.toFixed(2)}`;
  };

  const stats = [
    {
      title: "Total Market Cap",
      value: formatCurrency(totalMarketCap),
      description: "Combined value of all cryptocurrencies",
      trend: "+2.45%",
      positive: true,
    },
    {
      title: "24h Trading Volume",
      value: formatCurrency(totalVolume24h),
      description: "Total trading volume across all pairs",
      trend: "+8.12%",
      positive: true,
    },
    {
      title: "Market Gainers",
      value: gainers.toString(),
      description: `${gainers} cryptocurrencies are up today`,
      trend: `${((gainers / cryptos.length) * 100).toFixed(0)}%`,
      positive: gainers > losers,
    },
    {
      title: "Market Losers",
      value: losers.toString(),
      description: `${losers} cryptocurrencies are down today`,
      trend: `${((losers / cryptos.length) * 100).toFixed(0)}%`,
      positive: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">
                {stat.description}
              </div>
              <div className="flex items-center text-xs">
                <span
                  className={`font-medium ${
                    stat.positive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.positive ? "+" : ""}{stat.trend}
                </span>
                <span className="text-muted-foreground ml-1">from yesterday</span>
              </div>
            </div>
          </CardContent>
          
          {/* Background gradient */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-3xl"></div>
        </Card>
      ))}
    </div>
  );
}