"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import { ExternalLink, Copy, Save } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { useAccount } from "wagmi";

const themes = [
  {
    id: "modern",
    name: "Modern",
    colors: {
      primary: "#6366f1",
      secondary: "#8b5cf6",
      accent: "#06b6d4",
    },
    preview: "bg-gradient-to-br from-indigo-500 to-purple-600",
  },
  {
    id: "minimal",
    name: "Minimal",
    colors: {
      primary: "#000000",
      secondary: "#6b7280",
      accent: "#f59e0b",
    },
    preview: "bg-gradient-to-br from-gray-900 to-gray-600",
  },
  {
    id: "vibrant",
    name: "Vibrant",
    colors: {
      primary: "#ec4899",
      secondary: "#f97316",
      accent: "#10b981",
    },
    preview: "bg-gradient-to-br from-pink-500 to-orange-500",
  },
  {
    id: "nature",
    name: "Nature",
    colors: {
      primary: "#059669",
      secondary: "#0d9488",
      accent: "#84cc16",
    },
    preview: "bg-gradient-to-br from-emerald-600 to-teal-600",
  },
];

export function StorefrontTab() {
  const { address } = useAccount();
  const { store, setStore, updateStore, user } = useStore();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    banner: "",
    theme: themes[0],
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStore();
  }, [address]);

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name || "",
        description: store.description || "",
        logo: store.logo || "",
        banner: store.banner || "",
        theme: store.theme
          ? themes.find((t) => t.id === store.theme.id) || themes[0]
          : themes[0],
        isActive: store.isActive ?? true,
      });
    }
  }, [store]);

  const fetchStore = async () => {
    if (!address) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/store`);
      if (response.ok) {
        const storeData = await response.json();
        setStore(storeData);
      }
    } catch (error) {
      console.error("Failed to fetch store:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!address) return;

    setSaving(true);
    try {
      const response = await fetch("/api/store", {
        method: store ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          walletAddress: address,
          storeId: store?.id,
        }),
      });

      if (response.ok) {
        const updatedStore = await response.json();
        if (store) {
          updateStore(updatedStore);
        } else {
          setStore(updatedStore);
        }
        toast.success("Storefront updated successfully!");
      } else {
        toast.error("Failed to update storefront");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to update storefront");
    } finally {
      setSaving(false);
    }
  };

  const storeUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/store/${store?.slug || user?.username || "store"}`;

  const copyStoreUrl = () => {
    navigator.clipboard.writeText(storeUrl);
    toast.success("Store URL copied to clipboard");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Storefront</h1>
          <div className="flex gap-2">
            {/* <Button disabled>
              <ExternalLink className="mr-2 h-4 w-4" />
              Preview Store
            </Button> */}
            <Button disabled>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
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
        <h1 className="text-3xl font-bold">Storefront</h1>
        <div className="flex gap-2">
          {/* <Button
            variant="outline"
            onClick={() => window.open(storeUrl, "_blank")}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Preview Store
          </Button> */}
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Store Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="store-name">Store Name</Label>
              <Input
                id="store-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter store name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="store-description">Description</Label>
              <Textarea
                id="store-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your store"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="store-url">Store URL</Label>
              <div className="flex space-x-2">
                <Input id="store-url" value={storeUrl} readOnly />
                <Button size="icon" variant="outline" onClick={copyStoreUrl}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="store-active">Store Active</Label>
              <Switch
                id="store-active"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload
              value={formData.logo ? [formData.logo] : []}
              onChange={(urls) =>
                setFormData({ ...formData, logo: urls[0] || "" })
              }
              multiple={false}
              label="Store Logo"
            />

            <ImageUpload
              value={formData.banner ? [formData.banner] : []}
              onChange={(urls) =>
                setFormData({ ...formData, banner: urls[0] || "" })
              }
              multiple={false}
              label="Store Banner"
            />
          </CardContent>
        </Card>
      </div>

      {/* <Card>
        <CardHeader>
          <CardTitle>Theme Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className={`cursor-pointer rounded-lg border-2 transition-all ${
                  formData.theme.id === theme.id
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-muted hover:border-muted-foreground/50"
                }`}
                onClick={() => setFormData({ ...formData, theme })}
              >
                <div className={`h-20 rounded-t-md ${theme.preview}`}></div>
                <div className="p-3">
                  <h4 className="font-medium text-sm">{theme.name}</h4>
                  <div className="flex gap-1 mt-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.colors.primary }}
                    ></div>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.colors.secondary }}
                    ></div>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.colors.accent }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}

      {/* Preview */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <div
              className={`h-32 ${formData.theme.preview} flex items-center justify-center relative`}
            >
              {formData.banner && (
                <img
                  src={formData.banner || "/placeholder.svg"}
                  alt="Store banner"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-xl font-bold">
                    {formData.name || "Your Store Name"}
                  </h2>
                  <p className="text-sm opacity-90">
                    {formData.description || "Store description"}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                {formData.logo && (
                  <img
                    src={formData.logo || "/placeholder.svg"}
                    alt="Store logo"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold">
                    {formData.name || "Your Store"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formData.description || "Welcome to our store"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="aspect-square bg-muted rounded mb-2"></div>
                  <h4 className="font-medium">Sample Product</h4>
                  <p className="text-sm text-muted-foreground">$29.99</p>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="aspect-square bg-muted rounded mb-2"></div>
                  <h4 className="font-medium">Another Product</h4>
                  <p className="text-sm text-muted-foreground">$49.99</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
