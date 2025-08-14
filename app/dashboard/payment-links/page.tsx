"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Copy, ExternalLink } from "lucide-react"

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

// Mock data - in real app this would come from your API
const mockPaymentLinks = [
  {
    id: "1",
    title: "Digital Marketing Course",
    type: "PRODUCT",
    price: 299.0,
    currency: "USD",
    slug: "digital-marketing-course",
    isActive: true,
    views: 1234,
    purchases: 45,
    revenue: 13455.0,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "1-on-1 Consultation",
    type: "SERVICE",
    price: 150.0,
    currency: "USD",
    slug: "consultation-service",
    isActive: true,
    views: 567,
    purchases: 23,
    revenue: 3450.0,
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    title: "Website Design Invoice",
    type: "INVOICE",
    price: 2500.0,
    currency: "USD",
    slug: "website-design-invoice",
    isActive: false,
    views: 12,
    purchases: 1,
    revenue: 2500.0,
    createdAt: "2024-01-05",
  },
]

export default function PaymentLinksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/pay/${slug}`
    navigator.clipboard.writeText(url)
    toast({
      title: "Link copied!",
      description: "Payment link has been copied to your clipboard.",
    })
  }

  const filteredLinks = mockPaymentLinks.filter((link) => link.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Links</h1>
          <p className="text-muted-foreground">
            Create and manage payment links for your products, services, and invoices.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/payment-links/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Payment Link
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPaymentLinks.length}</div>
            <p className="text-xs text-muted-foreground">{mockPaymentLinks.filter((l) => l.isActive).length} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPaymentLinks.reduce((sum, link) => sum + link.views, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all links</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPaymentLinks.reduce((sum, link) => sum + link.purchases, 0)}</div>
            <p className="text-xs text-muted-foreground">Successful payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${mockPaymentLinks.reduce((sum, link) => sum + link.revenue, 0).toLocaleString()}
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
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payment links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-medium">{link.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{link.type.toLowerCase()}</Badge>
                    </TableCell>
                    <TableCell>${link.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={link.isActive ? "default" : "secondary"}>
                        {link.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{link.views.toLocaleString()}</TableCell>
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
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => copyLink(link.slug)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy link
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/pay/${link.slug}`} target="_blank">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View page
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/payment-links/${link.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/payment-links/${link.id}/analytics`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Analytics
                            </Link>
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
