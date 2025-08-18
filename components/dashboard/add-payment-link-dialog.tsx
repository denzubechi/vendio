"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "../ui/file-upload";
interface PaymentLink {
  id: string;
  title: string;
  slug: string;
  type: string;
  price: number;
  isActive: boolean;
  views?: number;
  purchases: number;
  revenue: number;
  description?: string;
  currency?: string;
  allowTips?: boolean;
  imageUrl?: string;
  digitalFileUrl?: string;
}

interface PaymentLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentLink?: PaymentLink | null;
  onSuccess: () => void;
}

export function PaymentLinkDialog({
  open,
  onOpenChange,
  paymentLink,
  onSuccess,
}: PaymentLinkDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [productFileUrls, setProductFileUrls] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    price: "",
    currency: "USDC",
    allowTips: false,
    slug: "",
    isActive: true,
  });

  const isEditing = !!paymentLink;

  // Reset form when dialog opens/closes or paymentLink changes
  useEffect(() => {
    if (open) {
      if (paymentLink) {
        // Editing mode - populate form with existing data
        setFormData({
          title: paymentLink.title,
          description: paymentLink.description || "",
          type: paymentLink.type,
          price: paymentLink.price.toString(),
          currency: paymentLink.currency || "USDC",
          allowTips: paymentLink.allowTips || false,
          slug: paymentLink.slug,
          isActive: paymentLink.isActive,
        });
        setImageUrls(paymentLink.imageUrl ? [paymentLink.imageUrl] : []);
        setProductFileUrls(
          paymentLink.digitalFileUrl ? [paymentLink.digitalFileUrl] : []
        );
      } else {
        // Creating mode - reset form
        setFormData({
          title: "",
          description: "",
          type: "",
          price: "",
          currency: "USDC",
          allowTips: false,
          slug: "",
          isActive: true,
        });
        setImageUrls([]);
        setProductFileUrls([]);
      }
    }
  }, [open, paymentLink]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate slug from title only when creating new payment link
    if (field === "title" && typeof value === "string" && !isEditing) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({
        ...prev,
        slug: slug,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        price: Number.parseFloat(formData.price),
        currency: formData.currency,
        allowTips: formData.allowTips,
        isActive: formData.isActive,
        imageUrl: imageUrls[0] || undefined,
        digitalFileUrl: productFileUrls[0] || undefined,
      };

      const url = isEditing
        ? `/api/dashboard/payment-link/${paymentLink.id}`
        : "/api/dashboard/payment-link";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${isEditing ? "update" : "create"} payment link`
        );
      }

      toast({
        title: `Payment link ${isEditing ? "updated" : "created"}!`,
        description: `Your payment link has been ${
          isEditing ? "updated" : "created"
        } successfully.`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${
          isEditing ? "update" : "create"
        } payment link. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Payment Link" : "Create Payment Link"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your payment link details."
              : "Create a new payment link for your product, service, or invoice."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Digital Marketing Course"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you're selling..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRODUCT">Product</SelectItem>
                    <SelectItem value="SERVICE">Service</SelectItem>
                    <SelectItem value="INVOICE">Invoice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) =>
                      handleInputChange("currency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USDC">USDC</SelectItem>
                      {/* <SelectItem value="ETH">ETH</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Custom URL</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                    /pay-with-vendio/
                  </span>
                  <Input
                    id="slug"
                    className="rounded-l-none"
                    placeholder="my-payment-link"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    disabled={isEditing} // Don't allow slug changes when editing
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="allowTips"
                  checked={formData.allowTips}
                  onCheckedChange={(checked) =>
                    handleInputChange("allowTips", checked)
                  }
                />
                <Label htmlFor="allowTips">Allow tips</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    handleInputChange("isActive", checked)
                  }
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>

            <div className="space-y-4">
              <FileUpload
                value={imageUrls}
                onChange={setImageUrls}
                multiple={false}
                label="Product Image"
                accept="image/*"
                className="space-y-2"
              />

              {formData.type === "PRODUCT" && (
                <FileUpload
                  value={productFileUrls}
                  onChange={setProductFileUrls}
                  multiple={false}
                  label="Digital Product File"
                  accept="*/*"
                  className="space-y-2"
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Payment Link"
              ) : (
                "Create Payment Link"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
