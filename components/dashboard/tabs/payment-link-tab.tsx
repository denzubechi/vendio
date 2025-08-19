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
import { useAccount } from "wagmi"
import { PaymentLinkDialog } from "../add-payment-link-dialog"

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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Payment Links</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Create and manage payment links for your products, services, and invoices.
          </p>
        </div>
        <Button onClick={handleCreateNew} className="w-full sm:w-auto shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Create Payment Link
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentLinks.length}</div>
            <p className="text-xs text-muted-foreground">{paymentLinks.filter((l) => l.isActive).length} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentLinks.reduce((sum, link) => sum + link.purchases, 0)}</div>
            <p className="text-xs text-muted-foreground">Successful payments</p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${paymentLinks.reduce((sum, link) => sum + link.revenue, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Payment Links</CardTitle>
          <CardDescription>Manage your payment links and track their performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payment links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLinks.length > 0 ? (
                      filteredLinks.map((link) => (
                        <TableRow key={link.id}>
                          <TableCell className="font-medium">
                            <div className="max-w-[200px] truncate">{link.title}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {link.type.toLowerCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>${link.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={link.isActive ? "default" : "secondary"} className="text-xs">
                              {link.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>{link.purchases}</TableCell>
                          <TableCell>${link.revenue.toLocaleString()}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => copyLink(link.slug)}>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Copy link
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <a href={`/pay-with-vendio/${link.slug}`} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    View page
                                  </a>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleEdit(link)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
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
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                          No payment links found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredLinks.length > 0 ? (
                filteredLinks.map((link) => (
                  <Card key={link.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate pr-2">{link.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {link.type.toLowerCase()}
                            </Badge>
                            <Badge variant={link.isActive ? "default" : "secondary"} className="text-xs">
                              {link.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 shrink-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => copyLink(link.slug)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy link
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href={`/pay-with-vendio/${link.slug}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View page
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(link)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Price</p>
                          <p className="font-medium">${link.price.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Sales</p>
                          <p className="font-medium">{link.purchases}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Revenue</p>
                          <p className="font-medium">${link.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">No payment links found.</CardContent>
                </Card>
              )}
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
