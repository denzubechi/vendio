"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  // const { isConnected } = useAccount()
  // const router = useRouter()

  // useEffect(() => {
  //   if (!isConnected) {
  //     router.push("/auth/signup")
  //   }
  // }, [isConnected, router])

  // if (!isConnected) {
  //   return <div>Loading...</div>
  // }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6">
          <DashboardContent activeTab={activeTab} />
        </main>
      </div>
    </div>
  );
}
