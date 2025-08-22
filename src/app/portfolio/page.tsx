"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function PortfolioPage() {
  const { user } = useAuth();
  const { portfolio, transactions, isLoading } = usePortfolio();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">No portfolio data available</p>
              <p className="text-sm text-muted-foreground">
                Start trading to build your portfolio
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const recentTransactions = transactions
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <p className="text-muted-foreground">
          Track your cryptocurrency investments and performance
        </p>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">
              {formatCurrency(portfolio.totalValue)}
            </div>
            <div className="text-sm text-muted-foreground">
              Updated {formatDate(portfolio.lastUpdated)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total P&L
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className={`text-2xl font-bold ${
              portfolio.totalPnL >= 0 ? "text-green-600" : "text-red-600"
            }`}>
              {portfolio.totalPnL >= 0 ? "+" : ""}{formatCurrency(portfolio.totalPnL)}
            </div>
            <div className={`text-sm ${
              portfolio.totalPnL >= 0 ? "text-green-600" : "text-red-600"
            }`}>
              {portfolio.totalPnL >= 0 ? "+" : ""}{portfolio.totalPnLPercentage.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              USD Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">
              {formatCurrency(portfolio.usdBalance)}
            </div>
            <div className="text-sm text-muted-foreground">
              Available for trading
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Assets
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">
              {portfolio.assets.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Different cryptocurrencies
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Holdings */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Holdings</CardTitle>
          <CardDescription>
            Your current cryptocurrency positions and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {portfolio.assets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No assets in your portfolio yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Start trading to build your portfolio
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {portfolio.assets.map((asset) => {
                const allocationPercentage = (asset.currentValue / portfolio.totalValue) * 100;
                
                return (
                  <div key={asset.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {asset.symbol.split('/')[0].charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{asset.symbol}</p>
                        <p className="text-sm text-muted-foreground">
                          {asset.quantity.toFixed(6)} units
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Current Value</p>
                        <p className="font-medium">{formatCurrency(asset.currentValue)}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">P&L</p>
                        <div className={`font-medium ${
                          asset.pnl >= 0 ? "text-green-600" : "text-red-600"
                        }`}>
                          {asset.pnl >= 0 ? "+" : ""}{formatCurrency(asset.pnl)}
                        </div>
                      </div>
                      
                      <div className="text-right min-w-24">
                        <Badge
                          variant={asset.pnlPercentage >= 0 ? "secondary" : "destructive"}
                          className={asset.pnlPercentage >= 0 ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                        >
                          {asset.pnlPercentage >= 0 ? "+" : ""}{asset.pnlPercentage.toFixed(2)}%
                        </Badge>
                      </div>
                      
                      <div className="w-24">
                        <div className="text-xs text-muted-foreground mb-1">
                          {allocationPercentage.toFixed(1)}%
                        </div>
                        <Progress value={allocationPercentage} className="h-2" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Your latest trading activity and account transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      transaction.type === 'buy' ? 'bg-green-600' :
                      transaction.type === 'sell' ? 'bg-red-600' :
                      transaction.type === 'deposit' ? 'bg-blue-600' : 'bg-orange-600'
                    }`}>
                      {transaction.type === 'buy' ? 'B' :
                       transaction.type === 'sell' ? 'S' :
                       transaction.type === 'deposit' ? 'D' : 'W'}
                    </div>
                    <div>
                      <p className="font-medium capitalize">{transaction.type} {transaction.symbol}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transaction.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">
                      {transaction.quantity.toFixed(6)} @ {formatCurrency(transaction.price)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total: {formatCurrency(transaction.total)}
                    </p>
                  </div>
                  
                  <Badge
                    variant={transaction.status === 'completed' ? 'secondary' : 
                            transaction.status === 'pending' ? 'default' : 'destructive'}
                  >
                    {transaction.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}