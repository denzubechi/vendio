"use client"

import { useState, useEffect } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Copy, ExternalLink, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { PaymentLinkDialog } from "../add-payment-link-dialog"
import { useAccount } from "wagmi"

interface PaymentLink {
  id: string
  title: string
  slug: string
  type: string
  price: number
  isActive: boolean
  views?: number
  purchases: number
  revenue: number
  description?: string
  currency?: string
  allowTips?: boolean
  imageUrl?: string
  digitalFileUrl?: string
}

export default function PaymentLinkTab() {
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPaymentLink, setEditingPaymentLink] = useState<PaymentLink | null>(null)
  const { toast } = useToast()
  const { address } = useAccount()

  useEffect(() => {
    fetchPaymentLinks()
  }, [address])

  const fetchPaymentLinks = async () => {
    if (!address) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/dashboard/payment-link?walletAddress=${address}`)
      if (!response.ok) {
        throw new Error("Failed to fetch payment links")
      }
      const data = await response.json()
      setPaymentLinks(data)
      setIsError(false)
    } catch (error) {
      setIsError(true)
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/pay-with-vendio/${slug}`
    navigator.clipboard.writeText(url)
    toast({
      title: "Link copied!",
      description: "Payment link has been copied to your clipboard.",
    })
  }

  const handleCreateNew = () => {
    setEditingPaymentLink(null)
    setDialogOpen(true)
  }

  const handleEdit = (paymentLink: PaymentLink) => {
    setEditingPaymentLink(paymentLink)
    setDialogOpen(true)
  }

  const handleDialogSuccess = () => {
    fetchPaymentLinks()
  }

  const filteredLinks = paymentLinks.filter((link) => link.title.toLowerCase().includes(searchQuery.toLowerCase()))

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin border-primary" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-96 items-center justify-center text-center text-red-500">
        <p>There was an error loading your payment links. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="flex flex-col space-y-3 sm:space-y-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Payment Links</h1>
          <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
            Create and manage payment links for your products, services, and invoices.
          </p>
        </div>
        <Button onClick={handleCreateNew} className="w-full sm:w-auto min-w-[160px] h-10 sm:h-9">
          <Plus className="mr-2 h-4 w-4" />
          <span className="text-sm">Create Payment Link</span>
        </Button>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="min-h-[100px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Links</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="text-xl sm:text-2xl font-bold">{paymentLinks.length}</div>
            <p className="text-xs text-muted-foreground">{paymentLinks.filter((l) => l.isActive).length} active</p>
          </CardContent>
        </Card>

        <Card className="min-h-[100px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="text-xl sm:text-2xl font-bold">
              {paymentLinks.reduce((sum, link) => sum + link.purchases, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Successful payments</p>
          </CardContent>
        </Card>

        <Card className="min-h-[100px] sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="text-xl sm:text-2xl font-bold">
              ${paymentLinks.reduce((sum, link) => sum + link.revenue, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">Your Payment Links</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Manage your payment links and track their performance.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payment links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 text-sm"
              />
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px] px-3 sm:px-4">Title</TableHead>
                    <TableHead className="min-w-[70px] px-2 sm:px-4">Type</TableHead>
                    <TableHead className="min-w-[70px] px-2 sm:px-4">Price</TableHead>
                    <TableHead className="min-w-[70px] px-2 sm:px-4">Status</TableHead>
                    <TableHead className="min-w-[60px] px-2 sm:px-4">Sales</TableHead>
                    <TableHead className="min-w-[80px] px-2 sm:px-4 hidden md:table-cell">Revenue</TableHead>
                    <TableHead className="w-[50px] px-2"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLinks.length > 0 ? (
                    filteredLinks.map((link) => (
                      <TableRow key={link.id}>
                        <TableCell className="font-medium px-3 sm:px-4">
                          <div className="max-w-[100px] sm:max-w-[150px] truncate text-sm">{link.title}</div>
                        </TableCell>
                        <TableCell className="px-2 sm:px-4">
                          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                            {link.type.toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 text-sm">${link.price.toFixed(2)}</TableCell>
                        <TableCell className="px-2 sm:px-4">
                          <Badge variant={link.isActive ? "default" : "secondary"} className="text-xs px-1.5 py-0.5">
                            {link.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 text-sm">{link.purchases}</TableCell>
                        <TableCell className="hidden md:table-cell px-2 sm:px-4 text-sm">
                          ${link.revenue.toLocaleString()}
                        </TableCell>
                        <TableCell className="px-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => copyLink(link.slug)} className="text-sm py-2">
                                <Copy className="mr-2 h-4 w-4" />
                                Copy link
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild className="text-sm py-2">
                                <a href={`/pay-with-vendio/${link.slug}`} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  View page
                                </a>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEdit(link)} className="text-sm py-2">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive text-sm py-2">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                        No payment links found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <PaymentLinkDialog
        open={dialogOpen}
        walletAddress={address}
        onOpenChange={setDialogOpen}
        paymentLink={editingPaymentLink}
        onSuccess={handleDialogSuccess}
      />
    </div>
  )
}
