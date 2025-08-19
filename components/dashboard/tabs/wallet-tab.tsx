"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, ExternalLink, ArrowDownLeft, ArrowUpRight, TrendingUp, DollarSign } from "lucide-react"
import { useAccount, useBalance } from "wagmi"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface Transaction {
  id: string
  type: "received" | "sent"
  amount: number
  currency: string
  from?: string
  to?: string
  txHash: string
  timestamp: string
  description: string
  status: "completed" | "pending" | "failed"
}

export function WalletTab() {
  const { address, isConnected } = useAccount()
  const { data: ethBalance } = useBalance({ address })
  const { data: usdcBalance } = useBalance({
    address,
    token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  })

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEarnings: 0,
    monthlyEarnings: 0,
    transactionCount: 0,
    averageTransaction: 0,
  })

  useEffect(() => {
    if (address) {
      fetchWalletData()
    }
  }, [address])

  const fetchWalletData = async () => {
    if (!address) return

    try {
      const response = await fetch(`/api/dashboard/wallet?walletAddress=${address}`)
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions)
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Failed to fetch wallet data:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success("Address copied to clipboard")
    }
  }

  const openInExplorer = (txHash?: string) => {
    const url = txHash ? `https://basescan.org/tx/${txHash}` : `https://basescan.org/address/${address}`
    window.open(url, "_blank")
  }

  

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Wallet</h1>
        <Button variant="outline" onClick={() => openInExplorer()} className="w-full sm:w-auto">
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-300">
                ${stats.totalEarnings.toFixed(2)}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">All time revenue</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600 flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-300">
                ${stats.monthlyEarnings.toFixed(2)}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">Monthly earnings</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">USDC Balance</CardTitle>
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">$</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {usdcBalance ? Number.parseFloat(usdcBalance.formatted).toFixed(2) : "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">USDC</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ETH Balance</CardTitle>
              <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">Ξ</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {ethBalance ? Number.parseFloat(ethBalance.formatted).toFixed(4) : "0.0000"}
              </div>
              <p className="text-xs text-muted-foreground">ETH</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Wallet Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3 sm:p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs sm:text-sm break-all">{address}</p>
                <p className="text-xs text-muted-foreground">Your Base wallet address</p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={copyAddress} className="w-full sm:w-auto bg-transparent">
              <Copy className="h-4 w-4 mr-2 sm:mr-0" />
              <span className="sm:hidden">Copy Address</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="text-lg sm:text-xl">Recent Transactions</CardTitle>
            <Badge variant="outline" className="w-fit">
              {transactions.length} transactions
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2 text-sm">Loading transactions...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ArrowDownLeft className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm sm:text-base">No transactions yet</p>
                <p className="text-xs sm:text-sm">Your payment history will appear here</p>
              </div>
            ) : (
              transactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                    <div
                      className={`p-2 rounded-full flex-shrink-0 ${
                        tx.type === "received" ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"
                      }`}
                    >
                      {tx.type === "received" ? (
                        <ArrowDownLeft className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base truncate">{tx.description}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                        <span className="truncate">
                          {tx.type === "received" ? "From" : "To"}: {tx.from || tx.to}
                        </span>
                        <Badge
                          variant={
                            tx.status === "completed"
                              ? "default"
                              : tx.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs w-fit"
                        >
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                    <p
                      className={`font-medium text-sm sm:text-base ${
                        tx.type === "received" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.type === "received" ? "+" : "-"}${tx.amount.toFixed(2)} {tx.currency}
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openInExplorer(tx.txHash)}
                        className="h-6 w-6 p-0 flex-shrink-0"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
