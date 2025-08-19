"use client";

import { useState, useEffect, Suspense } from "react";
import { useAccount } from "wagmi";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ModernSidebar } from "@/components/dashboard/modern-sidebar";
import { ModernNavbar } from "@/components/dashboard/modern-navbar";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

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

function DashboardPageContent() {
  const { address, isConnected } = useAccount();
  const searchParams = useSearchParams();
  const router = useRouter();
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
    if (!isConnected) {
      setLoading(false);
      router.push("/");
      return;
    }

    const fetchUserData = async () => {
      if (!address || !isConnected) {
        setLoading(false);
        router.push("/");
        return;
      }

      try {
        const response = await fetch(`/api/auth/user?walletAddress=${address}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ walletAddress: address }),
        });
        console.log("User data response:", response);
        if (response.ok) {
          const userData: UserData = await response.json();
          if (userData && userData.id) {
            setUser(userData);
          } else {
            router.push("/");
          }
        } else {
          console.error("Failed to fetch user data:", response.status, await response.text());
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [address, isConnected, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
      return null;
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

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardPageContent />
    </Suspense>
  );
}

