"use client";

import { useState, useEffect, Suspense } from "react";
import { useAccount } from "wagmi";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ModernSidebar } from "@/components/dashboard/modern-sidebar";
import { ModernNavbar } from "@/components/dashboard/modern-navbar";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { useSearchParams } from "next/navigation";

interface UserData {
  id?: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  walletAddress: string;
  store?: {
    id: string;
    slug: string;
  } | null;
}

// Create a separate component to handle the useSearchParams hook
function DashboardPageContent() {
  const { address, isConnected } = useAccount();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!address || !isConnected) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ walletAddress: address }),
        });
        console.log("User data response:", response);
        if (response.ok) {
          const userData: UserData = await response.json();
          setUser(userData);
        } else {
          setUser({
            name: `Creator ${address.slice(0, 6)}`,
            email: `${address.slice(0, 8)}@https://tryvendio.vercel.app`,
            username: address.slice(0, 10),
            avatar: `/placeholder.svg?height=40&width=40&text=${address.slice(
              0,
              2
            )}`,
            walletAddress: address,
            store: null,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser({
          name: `Creator ${address.slice(0, 6)}`,
          email: `${address.slice(0, 8)}@https://tryvendio.vercel.app`,
          username: address.slice(0, 10),
          avatar: `/placeholder.svg?height=40&width=40&text=${address.slice(
            0,
            2
          )}`,
          walletAddress: address,
          store: null,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [address, isConnected]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <ModernSidebar
          user={user}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <SidebarInset className="flex flex-col">
          <ModernNavbar />
          <main className="flex-1 p-6">
            <DashboardContent activeTab={activeTab} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

// The main page component that wraps the content in a Suspense boundary
export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardPageContent />
    </Suspense>
  );
}
