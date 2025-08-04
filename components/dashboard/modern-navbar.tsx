"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Search,
  Bell,
  HelpCircle,
  Plus,
  TrendingUp,
  DollarSign,
  Users,
  Package,
  Settings,
} from "lucide-react";
import { useAccount } from "wagmi";
import Link from "next/link";

interface StatsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
}

interface NotificationData {
  id: string;
  title: string;
  description: string;
  time: string;
  type: string;
  unread: boolean;
}

export function ModernNavbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      fetchStats();
      fetchNotifications();
    }
  }, [address]);

  const fetchStats = async () => {
    if (!address) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/dashboard/overview?walletAddress=${address}`
      );
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalRevenue: data.totalRevenue || 0,
          totalOrders: data.totalOrders || 0,
          totalCustomers: data.totalCustomers || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      setStats({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    if (!address) return;

    try {
      // For now, we'll create notifications based on recent orders
      const response = await fetch(
        `/api/dashboard/orders?walletAddress=${address}`
      );
      if (response.ok) {
        const data = await response.json();
        const recentOrders = data.orders?.slice(0, 3) || [];

        const orderNotifications: NotificationData[] = recentOrders.map(
          (order: any, index: number) => ({
            id: order.id,
            title: "New order received",
            description: `${order.items?.[0]?.product?.name || "Product"} - $${
              order.totalAmount?.toFixed(2) || "0.00"
            }`,
            time: getTimeAgo(order.createdAt),
            type: "order",
            unread: index < 2, // Mark first 2 as unread
          })
        );

        setNotifications(orderNotifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} hour${
        Math.floor(diffInMinutes / 60) > 1 ? "s" : ""
      } ago`;
    return `${Math.floor(diffInMinutes / 1440)} day${
      Math.floor(diffInMinutes / 1440) > 1 ? "s" : ""
    } ago`;
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Handle keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="flex h-16 items-center justify-between px-6">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Breadcrumb */}
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Dashboard</span>
              <span>/</span>
              <span className="text-foreground font-medium">Overview</span>
            </div>
            <SidebarTrigger className="md:hidden" />
          </div>

          {/* Center Section - Search */}
          {/* <div className="flex-1 max-w-md mx-4">
            <Button
              variant="outline"
              className="w-full justify-start text-muted-foreground hover:bg-muted/50 bg-transparent"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">
                Search products, orders...
              </span>
              <span className="sm:hidden">Search...</span>
              <div className="ml-auto flex items-center space-x-1">
                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </Button>
          </div> */}

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Quick Stats */}
            <div className="hidden md:flex items-center space-x-4 mr-4">
              {loading ? (
                <>
                  <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-muted animate-pulse">
                    <div className="w-4 h-4 bg-muted-foreground/20 rounded"></div>
                    <div className="w-12 h-4 bg-muted-foreground/20 rounded"></div>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-muted animate-pulse">
                    <div className="w-4 h-4 bg-muted-foreground/20 rounded"></div>
                    <div className="w-8 h-4 bg-muted-foreground/20 rounded"></div>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-muted animate-pulse">
                    <div className="w-4 h-4 bg-muted-foreground/20 rounded"></div>
                    <div className="w-8 h-4 bg-muted-foreground/20 rounded"></div>
                  </div>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
                  >
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                      ${stats?.totalRevenue.toFixed(2) || "0.00"}
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
                  >
                    <Package className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                      {stats?.totalOrders || 0}
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
                  >
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                      {stats?.totalCustomers || 0}
                    </span>
                  </motion.div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Add Product Button */}
              {/* <Button
                size="sm"
                className="hidden sm:flex bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button> */}

              {/* Notifications */}
              <DropdownMenu
                open={notificationOpen}
                onOpenChange={setNotificationOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-500">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between p-4">
                    <h4 className="font-semibold">Notifications</h4>
                    {unreadCount > 0 && (
                      <Badge variant="secondary">{unreadCount} new</Badge>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === "order"
                                ? "bg-green-500"
                                : notification.type === "payment"
                                ? "bg-blue-500"
                                : "bg-purple-500"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {notification.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {notification.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {notification.time}
                            </p>
                          </div>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="p-4 text-center">
                    <span className="text-sm text-muted-foreground">
                      View all notifications
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Help */}
              {/* <Button variant="ghost" size="icon">
                <HelpCircle className="h-4 w-4" />
              </Button> */}

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        {address ? address.slice(0, 2).toUpperCase() : "CR"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">Creator Account</p>
                      <p className="text-xs text-muted-foreground">
                        {address
                          ? `${address.slice(0, 6)}...${address.slice(-4)}`
                          : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/store/preview">
                      <span className="flex items-center">
                        <Package className="mr-2 h-4 w-4" />
                        View Store
                      </span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            <CommandItem>
              <Plus className="mr-2 h-4 w-4" />
              <span>Add Product</span>
            </CommandItem>
            <CommandItem>
              <Users className="mr-2 h-4 w-4" />
              <span>View Customers</span>
            </CommandItem>
            <CommandItem>
              <TrendingUp className="mr-2 h-4 w-4" />
              <span>Analytics</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Navigation">
            <CommandItem>
              <Package className="mr-2 h-4 w-4" />
              <span>Products</span>
            </CommandItem>
            <CommandItem>
              <DollarSign className="mr-2 h-4 w-4" />
              <span>Orders</span>
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
