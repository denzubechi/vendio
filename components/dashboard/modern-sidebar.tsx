"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Store,
  Link,
  Wallet,
  Settings,
  Home,
  DollarSign,
  Plus,
  ExternalLink,
} from "lucide-react";

import { AddProductDialog } from "@/components/dashboard/add-product-dialog";
interface User {
  name: string;
  email: string;
  username: string;
  avatar: string;
  walletAddress?: string;
}

interface ModernSidebarProps {
  user: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalViews: number;
}

export function ModernSidebar({
  user,
  activeTab,
  onTabChange,
}: ModernSidebarProps) {
  const { address } = useAccount();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  useEffect(() => {
    const fetchStats = async () => {
      if (!address) return;

      try {
        const response = await fetch("/api/dashboard/overview", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats({
            totalRevenue: data.totalRevenue || 0,
            totalOrders: data.totalOrders || 0,
            totalCustomers: data.totalCustomers || 0,
            totalViews: data.totalViews || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats({
          totalRevenue: 0,
          totalOrders: 0,
          totalCustomers: 0,
          totalViews: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [address]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/products?walletAddress=${address}`);
      if (response.ok) {
        const data = await response.json();
        //  setProducts(data)
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: Home,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: "customers",
      label: "Customers",
      icon: Users,
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: "storefront",
      label: "Storefront",
      icon: Store,
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      id: "link-in-bio",
      label: "Link in Bio",
      icon: Link,
      gradient: "from-pink-500 to-rose-500",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      id: "wallet",
      label: "Wallet",
      icon: Wallet,
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      gradient: "from-gray-500 to-slate-500",
    },
  ];

  const quickStats = [
    {
      label: "Revenue",
      value: loading ? null : formatCurrency(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Orders",
      value: loading ? null : formatNumber(stats?.totalOrders || 0),
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Customers",
      value: loading ? null : formatNumber(stats?.totalCustomers || 0),
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {(user.name || "BaseUser")
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              @{user.username}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-2">
          {quickStats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded ${stat.bgColor}`}>
                  <stat.icon className={`h-3 w-3 ${stat.color}`} />
                </div>
                <span className="text-xs font-medium">{stat.label}</span>
              </div>
              {loading ? (
                <Skeleton className="h-4 w-12" />
              ) : (
                <span className="text-xs font-semibold">{stat.value}</span>
              )}
            </div>
          ))}
        </div>

        <Separator className="my-4" />
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => onTabChange(item.id)}
                isActive={activeTab === item.id}
                className="w-full justify-start gap-3 h-10 px-3"
              >
                <div
                  className={`p-1.5 rounded-md bg-gradient-to-br ${item.gradient} text-white`}
                >
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="font-medium">{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-3">
          <Button
            size="sm"
            onClick={() => setShowAddDialog(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full bg-transparent"
            onClick={() => window.open(`/store/${user.username}`, "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Store
          </Button>
        </div>
      </SidebarFooter>

      <SidebarRail />

      <AddProductDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onProductAdded={fetchProducts}
      />
    </Sidebar>
  );
}
