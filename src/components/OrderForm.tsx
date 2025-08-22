"use client";

import { useState } from "react";
import { useMarketData } from "@/contexts/MarketDataContext";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface OrderFormProps {
  symbol: string;
}

type OrderType = "market" | "limit" | "stop-limit";

export function OrderForm({ symbol }: OrderFormProps) {
  const { getCryptoBySymbol } = useMarketData();
  const { portfolio, addTransaction } = usePortfolio();
  const [orderType, setOrderType] = useState<OrderType>("market");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const crypto = getCryptoBySymbol(symbol);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(value);
  };

  const calculateTotal = () => {
    const qty = parseFloat(quantity) || 0;
    const orderPrice = orderType === "market" ? (crypto?.price || 0) : (parseFloat(price) || 0);
    return qty * orderPrice;
  };

  const handleOrder = async (side: "buy" | "sell") => {
    if (!crypto || !portfolio) {
      console.error("Unable to place order at this time");
      return;
    }

    const qty = parseFloat(quantity);
    const orderPrice = orderType === "market" ? crypto.price : parseFloat(price);

    if (!qty || qty <= 0) {
      console.error("Please enter a valid quantity");
      return;
    }

    if (orderType !== "market" && (!orderPrice || orderPrice <= 0)) {
      console.error("Please enter a valid price");
      return;
    }

    const total = qty * orderPrice;
    const fee = total * 0.001; // 0.1% fee

    // Validation
    if (side === "buy") {
      if (total + fee > portfolio.usdBalance) {
        console.error("Insufficient USD balance");
        return;
      }
    } else {
      const asset = portfolio.assets.find(a => a.symbol === symbol);
      if (!asset || asset.quantity < qty) {
        console.error("Insufficient asset balance");
        return;
      }
    }

    setIsLoading(true);

    try {
      // Simulate order processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      addTransaction({
        type: side,
        symbol,
        quantity: qty,
        price: orderPrice,
        total,
        fee,
      });

      // Success notification would be handled by a toast system
      console.log(`${side.toUpperCase()} order executed successfully!`);
      
      // Reset form
      setQuantity("");
      setPrice("");
      setStopPrice("");

    } catch (error) {
      console.error("Failed to execute order");
    } finally {
      setIsLoading(false);
    }
  };

  if (!crypto) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Trading not available for this symbol</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Place Order</CardTitle>
          <Badge variant="outline" className="text-xs">
            {symbol}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Order Type Selection */}
        <div className="space-y-2">
          <Label>Order Type</Label>
          <Select value={orderType} onValueChange={(value: OrderType) => setOrderType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="market">Market</SelectItem>
              <SelectItem value="limit">Limit</SelectItem>
              <SelectItem value="stop-limit">Stop-Limit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Fields */}
        {orderType !== "market" && (
          <div className="space-y-2">
            <Label>Price</Label>
            <Input
              type="number"
              placeholder={`Price in USD`}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.000001"
            />
          </div>
        )}

        {orderType === "stop-limit" && (
          <div className="space-y-2">
            <Label>Stop Price</Label>
            <Input
              type="number"
              placeholder="Stop price in USD"
              value={stopPrice}
              onChange={(e) => setStopPrice(e.target.value)}
              step="0.000001"
            />
          </div>
        )}

        {/* Quantity */}
        <div className="space-y-2">
          <Label>Quantity</Label>
          <Input
            type="number"
            placeholder={`Amount in ${symbol.split('/')[0]}`}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            step="0.000001"
          />
        </div>

        {/* Order Summary */}
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span>Market Price:</span>
            <span className="font-medium">{formatCurrency(crypto.price)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Order Total:</span>
            <span className="font-medium">{formatCurrency(calculateTotal())}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Estimated Fee:</span>
            <span className="font-medium">{formatCurrency(calculateTotal() * 0.001)}</span>
          </div>
        </div>

        {/* Available Balances */}
        <div className="p-4 border rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span>USD Balance:</span>
            <span className="font-medium">
              {formatCurrency(portfolio?.usdBalance || 0)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{symbol.split('/')[0]} Balance:</span>
            <span className="font-medium">
              {(portfolio?.assets.find(a => a.symbol === symbol)?.quantity || 0).toFixed(6)}
            </span>
          </div>
        </div>

        {/* Buy/Sell Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => handleOrder("buy")}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? "Processing..." : "Buy"}
          </Button>
          <Button
            onClick={() => handleOrder("sell")}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? "Processing..." : "Sell"}
          </Button>
        </div>

        {/* Quick Amount Buttons */}
        <div className="space-y-2">
          <Label className="text-xs">Quick Amounts (% of balance)</Label>
          <div className="grid grid-cols-4 gap-2">
            {["25%", "50%", "75%", "100%"].map((percentage) => (
              <Button
                key={percentage}
                variant="outline"
                size="sm"
                onClick={() => {
                  const percent = parseInt(percentage) / 100;
                  const maxQuantity = (portfolio?.usdBalance || 0) / crypto.price * percent;
                  setQuantity(maxQuantity.toFixed(6));
                }}
                className="text-xs"
              >
                {percentage}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}