"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Star, Plus } from "lucide-react"
import { useStore } from "@/lib/store"
import { CartDrawer } from "@/components/storefront/cart-drawer"
import { CheckoutModal } from "@/components/storefront/checkout-modal"
import { toast } from "sonner"
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
    toast.success(`${product.name} added to cart`)
  }

  const cartCount = getCartCount()

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
    <div className="min-h-screen bg-background">
      {/* Store Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container px-4 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                {store.logo ? (
                  <Image
                    src={store.logo || "/placeholder.svg"}
                    alt={store.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                ) : (
                  <span className="text-2xl font-bold">{store.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{store.name}</h1>
                <p className="text-purple-100 mt-2">{store.description}</p>
                <div className="flex items-center mt-4 space-x-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1">4.9 (127 reviews)</span>
                  </div>
                  <Badge variant="secondary">{store.products.length} Products</Badge>
                </div>
              </div>
            </div>

            {/* Cart Button */}
            <Button
              onClick={() => setCartOpen(true)}
              className="relative bg-white/10 hover:bg-white/20 border-white/20"
              variant="outline"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {store.products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                {product.images.length > 0 ? (
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">{product.type}</p>
                  </div>
                )}
              </div>

              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant="outline" className="capitalize">
                    {product.type.toLowerCase()}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {product.price} {product.currency}
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => handleAddToCart(product)}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {store.products.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products available</h3>
            <p className="text-muted-foreground">This store hasn't added any products yet.</p>
          </div>
        )}
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
