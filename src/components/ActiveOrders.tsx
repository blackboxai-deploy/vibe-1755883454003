"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for demonstration
const mockOrders = [
  {
    id: "1",
    symbol: "BTC/USDT",
    type: "limit",
    side: "buy",
    amount: 0.5,
    price: 42500,
    filled: 0,
    status: "open",
    timestamp: new Date('2024-01-15T10:30:00'),
  },
  {
    id: "2",
    symbol: "ETH/USDT",
    type: "limit",
    side: "sell",
    amount: 2.0,
    price: 2700,
    filled: 0,
    status: "open",
    timestamp: new Date('2024-01-15T09:15:00'),
  },
];

const mockTrades = [
  {
    id: "1",
    symbol: "BTC/USDT",
    side: "buy",
    amount: 0.25,
    price: 43200,
    total: 10800,
    fee: 10.8,
    timestamp: new Date('2024-01-15T08:45:00'),
  },
  {
    id: "2",
    symbol: "ETH/USDT",
    side: "sell",
    amount: 1.5,
    price: 2650,
    total: 3975,
    fee: 3.98,
    timestamp: new Date('2024-01-15T07:30:00'),
  },
];

export function ActiveOrders() {
  const [orders, setOrders] = useState(mockOrders);

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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders & Trades</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders">Open Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="trades">Recent Trades</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No open orders</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your active orders will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        order.side === 'buy' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{order.symbol}</span>
                          <Badge variant="outline" className="text-xs">
                            {order.type.toUpperCase()}
                          </Badge>
                          <Badge
                            variant={order.side === 'buy' ? 'secondary' : 'destructive'}
                            className={order.side === 'buy' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {order.side.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(order.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {order.amount.toFixed(6)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @ {formatCurrency(order.price)}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatCurrency(order.amount * order.price)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Total Value
                        </p>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelOrder(order.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trades" className="space-y-4">
            {mockTrades.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No recent trades</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your completed trades will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {mockTrades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        trade.side === 'buy' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{trade.symbol}</span>
                          <Badge
                            variant={trade.side === 'buy' ? 'secondary' : 'destructive'}
                            className={trade.side === 'buy' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {trade.side.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(trade.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {trade.amount.toFixed(6)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @ {formatCurrency(trade.price)}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatCurrency(trade.total)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Fee: {formatCurrency(trade.fee)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}