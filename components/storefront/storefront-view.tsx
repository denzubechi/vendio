"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Star, Plus, Search, Filter, Heart, Share2, TrendingUp } from "lucide-react"
import { useStore } from "@/lib/store"
import { CartDrawer } from "@/components/storefront/cart-drawer"
import { CheckoutModal } from "@/components/storefront/checkout-modal"
import { toast } from "sonner"
import { motion } from "framer-motion"
import Image from "next/image"

interface StorefrontViewProps {
  store: {
    id: string
    name: string
    description: string | null
    logo: string | null
    banner: string | null
    user: {
      name: string | null
      avatar: string | null
      walletAddress: string | null
    }
    products: Array<{
      id: string
      name: string
      description: string
      price: number
      currency: string
      type: string
      images: string[]
    }>
  }
}

export function StorefrontView({ store }: StorefrontViewProps) {
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { cart, addToCart, getCartCount } = useStore()

  const handleAddToCart = (product: any) => {
    addToCart({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      storeId: store.id,
      storeName: store.name,
    })
    toast.success(`${product.name} added to cart! 🛒`)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Store link copied to clipboard! 📋")
  }

  const cartCount = getCartCount()
  const categories = ["all", ...new Set(store.products.map((p) => p.type.toLowerCase()))]

  const filteredProducts = store.products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.type.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (!store.user.walletAddress) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Store Configuration Error</h1>
          <p className="text-muted-foreground">This store owner hasn't configured their wallet address yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/30">
      {/* Enhanced Store Header */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-300/20 rounded-full blur-xl animate-pulse delay-1000" />

        <div className="container relative z-10 px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Store Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-6 text-white"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    {store.logo ? (
                      <Image
                        src={store.logo || "/placeholder.svg"}
                        alt={store.name}
                        width={96}
                        height={96}
                        className="rounded-2xl"
                      />
                    ) : (
                      <span className="text-3xl font-bold">{store.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>

                <div>
                  <h1 className="text-4xl font-bold mb-2">{store.name}</h1>
                  <p className="text-purple-100 text-lg mb-4 max-w-md">{store.description}</p>

                  {/* Store Stats */}
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">4.9</span>
                      <span className="text-purple-100">(127 reviews)</span>
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      {store.products.length} Products
                    </Badge>
                    <div className="flex items-center space-x-1 text-purple-100">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">Trending</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center space-x-4"
              >
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Store
                </Button>

                <Button
                  onClick={() => setCartOpen(true)}
                  className="relative bg-white text-purple-600 hover:bg-gray-100 font-semibold"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Cart
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {filteredProducts.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm || selectedCategory !== "all" ? "No products found" : "No products available"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "This store hasn't added any products yet."}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm">
                    {/* Product Image */}
                    <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                      {product.images.length > 0 ? (
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 capitalize">{product.type}</p>
                          </div>
                        </div>
                      )}

                      {/* Product Type Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-black/50 text-white border-0 backdrop-blur-sm">{product.type}</Badge>
                      </div>

                      {/* Wishlist Button */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="outline" className="bg-white/80 backdrop-blur-sm border-0">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg line-clamp-2 group-hover:text-purple-600 transition-colors">
                          {product.name}
                        </CardTitle>
                        <div className="flex items-center space-x-1 text-yellow-400">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm text-muted-foreground">4.8</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <p className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-2xl font-bold text-purple-600">
                            ${product.price} {product.currency}
                          </div>
                          <div className="text-xs text-muted-foreground">Instant delivery</div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                            className="bg-transparent hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600 transition-all duration-300"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>

                      {/* Product Features */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span>Digital</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span>Instant</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">23 sold</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        onCheckout={() => {
          setCartOpen(false)
          setCheckoutOpen(true)
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        storeId={store.id}
        storeName={store.name}
        creatorAddress={store.user.walletAddress!}
      />
    </div>
  )
}
