"use client";

import { useMarketData } from "@/contexts/MarketDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface MarketOverviewProps {
  onSymbolSelect?: (symbol: string) => void;
}

export function MarketOverview({ onSymbolSelect }: MarketOverviewProps) {
  const { cryptos, isLoading } = useMarketData();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'price' | 'change' | 'volume' | 'marketCap'>('marketCap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(value);
  };

  const filteredAndSortedCryptos = cryptos
    .filter(crypto => 
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let valueA: number, valueB: number;
      
      switch (sortBy) {
        case 'price':
          valueA = a.price;
          valueB = b.price;
          break;
        case 'change':
          valueA = a.change24h;
          valueB = b.change24h;
          break;
        case 'volume':
          valueA = a.volume24h;
          valueB = b.volume24h;
          break;
        case 'marketCap':
        default:
          valueA = a.marketCap;
          valueB = b.marketCap;
          break;
      }

      return sortOrder === 'desc' ? valueB - valueA : valueA - valueB;
    });

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading market data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle>Cryptocurrency Markets</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-sm text-muted-foreground">
                <th className="text-left p-2">#</th>
                <th className="text-left p-2">Name</th>
                <th 
                  className="text-right p-2 cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('price')}
                >
                  Price {sortBy === 'price' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th 
                  className="text-right p-2 cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('change')}
                >
                  24h Change {sortBy === 'change' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th 
                  className="text-right p-2 cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('volume')}
                >
                  24h Volume {sortBy === 'volume' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th 
                  className="text-right p-2 cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('marketCap')}
                >
                  Market Cap {sortBy === 'marketCap' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th className="text-right p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedCryptos.map((crypto, index) => (
                <tr 
                  key={crypto.symbol} 
                  className="border-b hover:bg-muted/50 transition-colors"
                >
                  <td className="p-2 text-sm text-muted-foreground">
                    {index + 1}
                  </td>
                  <td className="p-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {crypto.symbol.split('/')[0].charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{crypto.name}</p>
                        <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 text-right font-medium">
                    {formatCurrency(crypto.price)}
                  </td>
                  <td className="p-2 text-right">
                    <Badge
                      variant={crypto.change24h >= 0 ? "secondary" : "destructive"}
                      className={crypto.change24h >= 0 ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                    >
                      {crypto.change24h >= 0 ? "+" : ""}{crypto.change24h.toFixed(2)}%
                    </Badge>
                  </td>
                  <td className="p-2 text-right text-sm">
                    {formatCurrency(crypto.volume24h)}
                  </td>
                  <td className="p-2 text-right text-sm">
                    {formatCurrency(crypto.marketCap)}
                  </td>
                  <td className="p-2 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSymbolSelect?.(crypto.symbol)}
                    >
                      View Chart
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedCryptos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No cryptocurrencies found matching your search.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}