"use client";

import { useState } from "react";
import { useMarketData } from "@/contexts/MarketDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface TradingChartProps {
  symbol: string;
  height?: number;
}

const timeframes = [
  { label: "1H", value: "1H" },
  { label: "1D", value: "1D" },
  { label: "1W", value: "1W" },
  { label: "1M", value: "1M" },
];

export function TradingChart({ symbol, height = 500 }: TradingChartProps) {
  const { getPriceHistory, getCryptoBySymbol } = useMarketData();
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const [chartType, setChartType] = useState<"line" | "candle" | "volume">("line");
  
  const crypto = getCryptoBySymbol(symbol);
  const priceData = getPriceHistory(symbol, selectedTimeframe);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(value);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: selectedTimeframe === '1H' ? 'numeric' : undefined,
    });
  };

  if (!crypto) {
    return (
      <Card className="h-96">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Crypto not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle className="text-2xl font-bold">
              {crypto.name} ({symbol})
            </CardTitle>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-3xl font-bold">
                {formatCurrency(crypto.price)}
              </span>
              <span
                className={`text-lg font-semibold ${
                  crypto.change24h >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {crypto.change24h >= 0 ? "+" : ""}
                {crypto.change24h.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <Tabs value={chartType} onValueChange={(value: any) => setChartType(value)}>
              <TabsList>
                <TabsTrigger value="line">Line</TabsTrigger>
                <TabsTrigger value="candle">Candles</TabsTrigger>
                <TabsTrigger value="volume">Volume</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex space-x-1">
              {timeframes.map((tf) => (
                <Button
                  key={tf.value}
                  variant={selectedTimeframe === tf.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTimeframe(tf.value)}
                >
                  {tf.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div style={{ height: height, width: "100%" }}>
          <ResponsiveContainer>
            {chartType === "line" && (
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatDate}
                  stroke="currentColor"
                  className="text-xs"
                />
                <YAxis
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  stroke="currentColor"
                  className="text-xs"
                />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(value), "Price"]}
                  labelFormatter={(label) => formatDate(label)}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            )}

            {chartType === "volume" && (
              <BarChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatDate}
                  stroke="currentColor"
                  className="text-xs"
                />
                <YAxis
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  stroke="currentColor"
                  className="text-xs"
                />
                <Tooltip
                  formatter={(value: any) => [
                    `${(value / 1000000).toFixed(2)}M`,
                    "Volume",
                  ]}
                  labelFormatter={(label) => formatDate(label)}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Bar
                  dataKey="volume"
                  fill="hsl(var(--primary))"
                  opacity={0.7}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Additional Price Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">24h High</p>
            <p className="text-lg font-semibold">{formatCurrency(crypto.high24h)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">24h Low</p>
            <p className="text-lg font-semibold">{formatCurrency(crypto.low24h)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">24h Volume</p>
            <p className="text-lg font-semibold">
              ${(crypto.volume24h / 1000000000).toFixed(2)}B
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Market Cap</p>
            <p className="text-lg font-semibold">
              ${(crypto.marketCap / 1000000000).toFixed(1)}B
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}