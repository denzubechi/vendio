"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, Package, Search } from "lucide-react";
import { AddProductDialog } from "@/components/dashboard/add-product-dialog";
import { EditProductDialog } from "@/components/dashboard/edit-product-dialog";
import { useAccount } from "wagmi";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export function ProductsTab() {
  const { address } = useAccount();
  const {
    products,
    setProducts,
    deleteProduct,
    selectedProduct,
    setSelectedProduct,
    showAddProductModal,
    setShowAddProductModal,
    showEditProductModal,
    setShowEditProductModal,
    productFilters,
    setProductFilters,
    isLoading,
    setIsLoading,
  } = useStore();

  useEffect(() => {
    fetchProducts();
  }, [address]);

  const fetchProducts = async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/products?walletAddress=${address}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        deleteProduct(productId);
        toast.success("Product deleted successfully");
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setShowEditProductModal(true);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(productFilters.search.toLowerCase()) ||
      product.description
        .toLowerCase()
        .includes(productFilters.search.toLowerCase());
    const matchesCategory =
      !productFilters.category || product.category === productFilters.category;
    const matchesType =
      !productFilters.type || product.type === productFilters.type;
    const matchesStatus =
      !productFilters.status ||
      (productFilters.status === "active" && product.isActive) ||
      (productFilters.status === "draft" && !product.isActive);

    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Products</h1>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => setShowAddProductModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={productFilters.search}
            onChange={(e) => setProductFilters({ search: e.target.value })}
            className="pl-10"
          />
        </div>
        <Select
          value={productFilters.type}
          onValueChange={(value) => setProductFilters({ type: value })}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="DIGITAL">Digital</SelectItem>
            <SelectItem value="PHYSICAL">Physical</SelectItem>
            <SelectItem value="COURSE">Course</SelectItem>
            <SelectItem value="SERVICE">Service</SelectItem>
            <SelectItem value="EVENT">Event</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={productFilters.status}
          onValueChange={(value) => setProductFilters({ status: value })}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {products.length === 0
                ? "No products yet"
                : "No products match your filters"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {products.length === 0
                ? "Start by adding your first product"
                : "Try adjusting your search criteria"}
            </p>
            {products.length === 0 && (
              <Button onClick={() => setShowAddProductModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Product
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg line-clamp-1">
                    {product.name}
                  </CardTitle>
                  <Badge variant={product.isActive ? "default" : "secondary"}>
                    {product.isActive ? "Active" : "Draft"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {product.imageUrls && product.imageUrls.length > 0 && (
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={product.imageUrls[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="capitalize">
                      {product.type.toLowerCase()}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">
                      {product.price} {product.currency}
                    </span>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 bg-transparent"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddProductDialog
        open={showAddProductModal}
        onOpenChange={setShowAddProductModal}
        onProductAdded={fetchProducts}
      />

      <EditProductDialog
        open={showEditProductModal}
        onOpenChange={setShowEditProductModal}
        product={selectedProduct}
        onProductUpdated={fetchProducts}
      />
    </div>
  );
}
