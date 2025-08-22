"use client";

import { useState } from "react";
import { MarketOverview } from "@/components/MarketOverview";
import { TradingChart } from "@/components/TradingChart";
import { TopCryptos } from "@/components/TopCryptos";
import { MarketStats } from "@/components/MarketStats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function HomePage() {
  const { user } = useAuth();
  const [selectedCrypto, setSelectedCrypto] = useState("BTC/USDT");

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Professional Crypto Trading
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Advanced trading platform with real-time market data, professional charts, and comprehensive portfolio management.
        </p>
        {!user && (
          <div className="flex justify-center gap-4 pt-6">
            <Link href="/auth/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Trading
              </Button>
            </Link>
            <Link href="/markets">
              <Button size="lg" variant="outline">
                Explore Markets
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Market Stats */}
      <MarketStats />

      {/* Main Trading Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
          <CardDescription>Real-time cryptocurrency price movements and trading data</CardDescription>
        </CardHeader>
        <CardContent>
          <TradingChart symbol={selectedCrypto} height={400} />
        </CardContent>
      </Card>

      {/* Market Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MarketOverview onSymbolSelect={setSelectedCrypto} />
        </div>
        <div>
          <TopCryptos />
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Advanced Trading</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Professional trading tools with advanced order types, real-time charts, and technical indicators.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle>Portfolio Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Comprehensive portfolio tracking with P&L analysis, asset allocation, and performance metrics.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle>Real-time Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Live market data, order book updates, and instant trade execution for optimal trading experience.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}