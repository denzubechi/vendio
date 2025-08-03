"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Copy, ExternalLink, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { useAccount, useBalance } from "wagmi"
import { toast } from "sonner"

export function WalletTab() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({
    address,
    token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
  })

  const [transactions, setTransactions] = useState([
    {
      id: "1",
      type: "received",
      amount: 99.0,
      currency: "USDC",
      from: "0x9876...5432",
      txHash: "0xabcd...efgh",
      timestamp: "2024-01-15T10:30:00Z",
      description: "Payment for Digital Marketing Course",
    },
    {
      id: "2",
      type: "received",
      amount: 29.99,
      currency: "USDC",
      from: "0x5555...7777",
      txHash: "0x1234...abcd",
      timestamp: "2024-01-15T09:15:00Z",
      description: "Payment for Web3 E-book",
    },
  ])

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success("Address copied to clipboard")
    }
  }

  const openInExplorer = () => {
    if (address) {
      window.open(`https://basescan.org/address/${address}`, "_blank")
    }
  }

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Wallet</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No wallet connected</h3>
            <p className="text-muted-foreground mb-4">Connect your wallet to view balance and transactions</p>
            <Button>
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Wallet</h1>
        <Button variant="outline" onClick={openInExplorer}>
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Wallet Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-mono text-sm">{address}</span>
                <Button size="sm" variant="outline" onClick={copyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                This is your Base wallet address where you'll receive payments
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">USDC</span>
                <span className="text-2xl font-bold">
                  {balance ? Number.parseFloat(balance.formatted).toFixed(2) : "0.00"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">ETH</span>
                <span className="text-lg font-medium">0.00 ETH</span>
              </div>
              <Button className="w-full bg-transparent" variant="outline">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Withdraw Funds
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                    <ArrowDownLeft className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-muted-foreground">From {tx.from}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    +{tx.amount} {tx.currency}
                  </p>
                  <p className="text-sm text-muted-foreground">{new Date(tx.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No transactions yet</p>
                <p className="text-sm">Your payment history will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
