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
  CreditCard,
  Calendar,
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
        const response = await fetch(
          `/api/dashboard/overview?walletAddress=${address}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

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

  const mainMenuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: Home,
      color: "border-blue-500 text-black-500",
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      color: "border-green-500 text-green-500",
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      color: "border-orange-500 text-orange-500",
    },
    {
      id: "customers",
      label: "Customers",
      icon: Users,
      color: "border-purple-500 text-purple-500",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      color: "border-cyan-500 text-cyan-500",
    },
    {
      id: "wallet",
      label: "Wallet",
      icon: Wallet,
      color: "border-yellow-500 text-yellow-500",
    },
    {
      id: "link-in-bio",
      label: "Link in Bio",
      icon: Link,
      color: "border-pink-500 text-pink-500",
    },
    {
      id: "storefront",
      label: "Storefront",
      icon: Store,
      color: "border-indigo-500 text-indigo-500",
    },
    {
      id: "payment-link",
      label: "Payment Links",
      icon: CreditCard,
      color: "border-red-500 text-blue-500",
    },
  ];

  const linkItems = [
    // {
    //   id: "events",
    //   label: "Events",
    //   icon: Calendar,
    //   href: "/dashboard/events",
    // },
    {
      id: "link-in-bio-preview",
      label: "Link in Bio Preview",
      icon: Link,
      href: `/bio/${user.username}`,
    },
    {
      id: "storefront-preview",
      label: "Storefront Preview",
      icon: Store,
      href: `/store/${user.username}`,
    },
  ];

  const quickStats = [
    {
      label: "Revenue",
      value: loading ? null : formatCurrency(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: "text-muted-foreground",
    },
    {
      label: "Orders",
      value: loading ? null : formatNumber(stats?.totalOrders || 0),
      icon: ShoppingCart,
      color: "text-muted-foreground",
    },
    {
      label: "Customers",
      value: loading ? null : formatNumber(stats?.totalCustomers || 0),
      icon: Users,
      color: "text-muted-foreground",
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

        <div className="space-y-2">
          {quickStats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
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
          {mainMenuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => onTabChange(item.id)}
                isActive={activeTab === item.id}
                className={`w-full justify-start gap-3 h-10 px-3 ${
                  item.color && activeTab === item.id
                    ? `border-l-2 ${item.color.split(" ")[0]} bg-muted/30`
                    : item.color && activeTab !== item.id
                    ? `border-l-2 border-transparent hover:${
                        item.color.split(" ")[0]
                      } hover:bg-muted/20`
                    : ""
                }`}
              >
                <item.icon
                  className={`h-4 w-4 ${
                    item.color && activeTab === item.id
                      ? item.color.split(" ")[1]
                      : item.color && activeTab !== item.id
                      ? `${item.color.split(" ")[1]} opacity-70`
                      : activeTab === item.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <div className="my-4">
            <Separator />
            <p className="text-xs font-medium text-muted-foreground px-3 py-2">
              Quick Links
            </p>
          </div>

          {linkItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => {
                  window.location.href = item.href;
                }}
                className="w-full justify-start gap-3 h-10 px-3 hover:bg-muted/50"
              >
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <div className="mt-4">
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => onTabChange("settings")}
                isActive={activeTab === "settings"}
                className={`w-full justify-start gap-3 h-10 px-3 ${
                  activeTab === "settings"
                    ? "border-l-2 border-slate-500 bg-muted/30"
                    : "border-l-2 border-transparent hover:border-slate-500 hover:bg-muted/20"
                }`}
              >
                <Settings
                  className={`h-4 w-4 ${
                    activeTab === "settings"
                      ? "text-slate-500"
                      : "text-slate-500 opacity-70"
                  }`}
                />
                <span className="font-medium">Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </div>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          size="sm"
          onClick={() => setShowAddDialog(true)}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Product
        </Button>
      </SidebarFooter>

      <SidebarRail />

      <AddProductDialog
        open={showAddDialog}
        walletAddress={address || ""}
        onOpenChange={setShowAddDialog}
        onProductAdded={fetchProducts}
      />
    </Sidebar>
  );
}
