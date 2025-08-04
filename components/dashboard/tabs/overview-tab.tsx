"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { useAccount } from "wagmi";
import Link from "next/link";

import { AddProductDialog } from "@/components/dashboard/add-product-dialog";

interface OverviewData {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalCustomers: number;
  customersChange: number;
  conversionRate: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: Array<{
      product: {
        name: string;
      };
    }>;
  }>;
}

export function OverviewTab() {
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();

  const [showAddDialog, setShowAddDialog] = useState(false);
  useEffect(() => {
    fetchOverviewData();
  }, [address]);

  const fetchOverviewData = async () => {
    if (!address) return;

    try {
      const response = await fetch(
        `/api/dashboard/overview?walletAddress=${address}`
      );
      if (response.ok) {
        const data = await response.json();
        setOverviewData(data);
      }
    } catch (error) {
      console.error("Failed to fetch overview data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading dashboard...
      </div>
    );
  }

  if (!overviewData) {
    return (
      <div className="flex items-center justify-center h-64">
        No data available
      </div>
    );
  }

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    const sign = isPositive ? "+" : "";
    const color = isPositive ? "text-green-600" : "text-red-600";
    return (
      <span className={`text-xs ${color}`}>
        {sign}
        {change.toFixed(1)}% from last month
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <Link href="/dashboard?tab=products">
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${overviewData.totalRevenue.toFixed(2)}
            </div>
            {formatChange(overviewData.revenueChange)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewData.totalOrders}</div>
            {formatChange(overviewData.ordersChange)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewData.totalCustomers}
            </div>
            <p className="text-xs text-muted-foreground">Unique buyers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewData.conversionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Visitors to buyers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overviewData.recentOrders.length > 0 ? (
                overviewData.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">
                        {order.items[0]?.product.name || "Unknown Product"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                      <p
                        className={`text-sm ${
                          order.status === "COMPLETED"
                            ? "text-green-600"
                            : order.status === "PENDING"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No orders yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard?tab=products">
              <Button className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Add New Product
              </Button>
            </Link>
            <Link href="/dashboard?tab=orders">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                View All Orders
              </Button>
            </Link>
            <Link href="/dashboard?tab=analytics">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <AddProductDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onProductAdded={() => console.log("Product added")}
      />
    </div>
  );
}
