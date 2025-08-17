"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  Star,
  Plus,
  Search,
  Filter,
  Heart,
  Share2,
  MapPin,
  Shield,
  Zap,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { CartDrawer } from "@/components/storefront/cart-drawer";
import { CheckoutModal } from "@/components/storefront/checkout-modal";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Image from "next/image";

interface StorefrontViewProps {
  store: {
    id: string;
    name: string;
    description: string | null;
    logo: string | null;
    banner: string | null;
    theme: {
      id: string;
      name: string;
      preview: string;
      colors: {
        primary: string;
        secondary: string;
        accent: string;
      };
    } | null;
    user: {
      name: string | null;
      avatar: string | null;
      walletAddress: string | null;
    };
    products: Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      currency: string;
      type: string;
      imageUrls: string[];
    }>;
  };
}

export function StorefrontView({ store }: StorefrontViewProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { cart, addToCart, getCartCount } = useStore();

  const handleAddToCart = (product: any) => {
    addToCart({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      storeId: store.id,
      storeName: store.name,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Store link copied to clipboard!");
  };

  const cartCount = getCartCount();
  const categories = [
    "all",
    ...new Set(store.products.map((p) => p.type.toLowerCase())),
  ];

  const filteredProducts = store.products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      product.type.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!store.user.walletAddress) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">
            Store Setup Required
          </h1>
          <p className="text-gray-600 leading-relaxed">
            This store owner needs to configure their wallet address to start
            selling.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            {/* Store Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-start space-x-6"
            >
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden">
                  {store.logo ? (
                    <Image
                      src={store.logo || "/placeholder.svg"}
                      alt={store.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-semibold text-gray-600">
                      {store.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  {store.name}
                </h1>
                {store.description && (
                  <p className="text-lg text-gray-600 mb-4 max-w-2xl leading-relaxed">
                    {store.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-6">
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-700"
                  >
                    {store.products.length} Products
                  </Badge>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center space-x-3"
            >
              <Button
                variant="outline"
                onClick={handleShare}
                className="border-gray-200 hover:bg-gray-50 bg-transparent"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              <Button
                onClick={() => setCartOpen(true)}
                className="relative bg-gray-900 hover:bg-gray-800 text-white"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-blue-600">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 bg-white border-gray-200 focus:border-gray-300 focus:ring-0"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="flex space-x-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  onClick={() => setSelectedCategory(category)}
                  className={`capitalize whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-gray-900 hover:bg-gray-800 text-white"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || selectedCategory !== "all"
                ? "No products found"
                : "No products available"}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filter criteria to find what you're looking for."
                : "This store hasn't added any products yet. Check back soon!"}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="group"
              >
                <Card className="h-full overflow-hidden border-gray-200 hover:shadow-lg transition-all duration-300 bg-white">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    {product.imageUrls.length > 0 ? (
                      <Image
                        src={product.imageUrls[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                            <ShoppingCart className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-gray-500 capitalize text-sm font-medium">
                            {product.type}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Product Type Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/90 text-gray-700 border-0 text-xs font-medium">
                        {product.type}
                      </Badge>
                    </div>

                    {/* Wishlist Button */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/90 border-gray-200 h-8 w-8 p-0 hover:bg-white"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
                        {product.name}
                      </CardTitle>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm text-gray-600 font-medium">
                          4.8
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          ${product.price}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          {product.currency} • Instant delivery
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        className="bg-gray-900 hover:bg-gray-800 text-white"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>

                    {/* Product Features */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Zap className="w-3 h-3 text-emerald-500" />
                          <span className="text-xs text-gray-600 font-medium">
                            Digital
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Shield className="w-3 h-3 text-blue-500" />
                          <span className="text-xs text-gray-600 font-medium">
                            Secure
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">23 sold</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
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
  );
}
