"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink } from "lucide-react";
import { useAccount } from "wagmi";

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  currency: string;
  status: string;
  paymentHash: string | null;
  buyerEmail: string | null;
  buyerName: string | null;
  buyerAddress: string | null;
  createdAt: string;
  items: Array<{
    product: {
      name: string;
    };
    quantity: number;
    price: number;
  }>;
}

export function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();

  useEffect(() => {
    fetchOrders();
  }, [address]);

  const fetchOrders = async () => {
    if (!address) return;

    try {
      const response = await fetch(`/api/dashboard/orders`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "default";
      case "PENDING":
        return "secondary";
      case "CANCELLED":
      case "REFUNDED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const openTransactionInExplorer = (txHash: string) => {
    window.open(`https://basescan.org/tx/${txHash}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Badge variant="outline">{orders.length} total orders</Badge>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-4">
                Your orders will appear here once customers start buying
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Order #{order.orderNumber}
                  </CardTitle>
                  <Badge variant={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Products</p>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <p key={index} className="text-sm">
                          {item.product.name} x{item.quantity}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="text-sm">{order.buyerName || "Anonymous"}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.buyerEmail ||
                        (order.buyerAddress
                          ? `${order.buyerAddress.slice(
                              0,
                              6
                            )}...${order.buyerAddress.slice(-4)}`
                          : "N/A")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium">
                      ${order.totalAmount.toFixed(2)} {order.currency}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {order.paymentHash && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          openTransactionInExplorer(order.paymentHash!)
                        }
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Tx
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
