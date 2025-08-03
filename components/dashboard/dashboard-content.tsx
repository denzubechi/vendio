"use client"

import { OverviewTab } from "./tabs/overview-tab"
import { ProductsTab } from "./tabs/products-tab"
import { OrdersTab } from "./tabs/orders-tab"
import { CustomersTab } from "./tabs/customers-tab"
import { StorefrontTab } from "./tabs/storefront-tab"
import { LinkInBioTab } from "./tabs/link-in-bio-tab"
import { AnalyticsTab } from "./tabs/analytics-tab"
import { WalletTab } from "./tabs/wallet-tab"
import { SettingsTab } from "./tabs/settings-tab"

interface DashboardContentProps {
  activeTab: string
}

export function DashboardContent({ activeTab }: DashboardContentProps) {
  switch (activeTab) {
    case "overview":
      return <OverviewTab />
    case "products":
      return <ProductsTab />
    case "orders":
      return <OrdersTab />
    case "customers":
      return <CustomersTab />
    case "storefront":
      return <StorefrontTab />
    case "link-in-bio":
      return <LinkInBioTab />
    case "analytics":
      return <AnalyticsTab />
    case "wallet":
      return <WalletTab />
    case "settings":
      return <SettingsTab />
    default:
      return <OverviewTab />
  }
}
