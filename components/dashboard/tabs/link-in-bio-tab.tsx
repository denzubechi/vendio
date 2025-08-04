"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import { Plus, Trash2, ExternalLink, Copy, Save } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { useAccount } from "wagmi";

const bioThemes = [
  {
    id: "gradient",
    name: "Gradient",
    preview: "bg-gradient-to-br from-purple-500 to-blue-600",
    colors: {
      background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
      text: "#ffffff",
      accent: "#ffffff20",
    },
  },
  {
    id: "dark",
    name: "Dark",
    preview: "bg-gradient-to-br from-gray-900 to-gray-700",
    colors: {
      background: "linear-gradient(135deg, #111827 0%, #374151 100%)",
      text: "#ffffff",
      accent: "#ffffff10",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    preview: "bg-gradient-to-br from-orange-500 to-pink-500",
    colors: {
      background: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
      text: "#ffffff",
      accent: "#ffffff20",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    preview: "bg-gradient-to-br from-cyan-500 to-blue-500",
    colors: {
      background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
      text: "#ffffff",
      accent: "#ffffff20",
    },
  },
];

interface LinkItem {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
}

export function LinkInBioTab() {
  const { address } = useAccount();
  const { linkInBio, setLinkInBio, updateLinkInBio, user } = useStore();
  const [bioData, setBioData] = useState({
    title: "",
    description: "",
    avatar: "",
    theme: bioThemes[0],
    isActive: true,
  });
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLinkInBio();
  }, [address]);

  useEffect(() => {
    if (linkInBio) {
      setBioData({
        title: linkInBio.title || "",
        description: linkInBio.description || "",
        avatar: linkInBio.avatar || "",
        theme: linkInBio.theme
          ? bioThemes.find((t) => t.id === linkInBio.theme.id) || bioThemes[0]
          : bioThemes[0],
        isActive: linkInBio.isActive ?? true,
      });
      setLinks(linkInBio.links || []);
    }
  }, [linkInBio]);

  const fetchLinkInBio = async () => {
    if (!address) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/link-in-bio?walletAddress=${address}`);
      if (response.ok) {
        const data = await response.json();
        setLinkInBio(data);
      }
    } catch (error) {
      console.error("Failed to fetch link in bio:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!address) return;

    setSaving(true);
    try {
      const response = await fetch("/api/link-in-bio", {
        method: linkInBio ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...bioData,
          links,
          walletAddress: address,
          linkInBioId: linkInBio?.id,
        }),
      });

      if (response.ok) {
        const updatedLinkInBio = await response.json();
        if (linkInBio) {
          updateLinkInBio(updatedLinkInBio);
        } else {
          setLinkInBio(updatedLinkInBio);
        }
        toast.success("Link in Bio updated successfully!");
      } else {
        toast.error("Failed to update Link in Bio");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to update Link in Bio");
    } finally {
      setSaving(false);
    }
  };

  const bioUrl = `https://tryvendio.vercel.app/bio/${user?.username || "user"}`;

  const addLink = () => {
    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: "New Link",
      url: "",
      isActive: true,
    };
    setLinks([...links, newLink]);
  };

  const updateLink = (id: string, updates: Partial<LinkItem>) => {
    setLinks(
      links.map((link) => (link.id === id ? { ...link, ...updates } : link))
    );
  };

  const removeLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const copyBioUrl = () => {
    navigator.clipboard.writeText(bioUrl);
    toast.success("Bio URL copied to clipboard");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Link in Bio</h1>
          <div className="flex space-x-2">
            <Button disabled>
              <Copy className="mr-2 h-4 w-4" />
              Copy URL
            </Button>
            <Button disabled>
              <ExternalLink className="mr-2 h-4 w-4" />
              Preview
            </Button>
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
        <h1 className="text-3xl font-bold">Link in Bio</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={copyBioUrl}>
            <Copy className="mr-2 h-4 w-4" />
            Copy URL
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(bioUrl, "_blank")}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bio Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Bio Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload
              value={bioData.avatar ? [bioData.avatar] : []}
              onChange={(urls) =>
                setBioData({ ...bioData, avatar: urls[0] || "" })
              }
              multiple={false}
              label="Profile Picture"
            />

            <div className="space-y-2">
              <Label htmlFor="bio-title">Title</Label>
              <Input
                id="bio-title"
                value={bioData.title}
                onChange={(e) =>
                  setBioData({ ...bioData, title: e.target.value })
                }
                placeholder="Your name or brand"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio-description">Description</Label>
              <Textarea
                id="bio-description"
                value={bioData.description}
                onChange={(e) =>
                  setBioData({ ...bioData, description: e.target.value })
                }
                placeholder="Brief description about yourself"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio-url">Bio Page URL</Label>
              <div className="flex space-x-2">
                <Input id="bio-url" value={bioUrl} readOnly />
                <Button size="icon" variant="outline" onClick={copyBioUrl}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="bio-active">Bio Page Active</Label>
              <Switch
                id="bio-active"
                checked={bioData.isActive}
                onCheckedChange={(checked) =>
                  setBioData({ ...bioData, isActive: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Links Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Links</CardTitle>
              <Button size="sm" onClick={addLink}>
                <Plus className="mr-2 h-4 w-4" />
                Add Link
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {links.map((link) => (
                <div key={link.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Input
                      value={link.title}
                      onChange={(e) =>
                        updateLink(link.id, { title: e.target.value })
                      }
                      placeholder="Link title"
                      className="flex-1 mr-2"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeLink(link.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <Input
                    value={link.url}
                    onChange={(e) =>
                      updateLink(link.id, { url: e.target.value })
                    }
                    placeholder="https://example.com"
                  />

                  <div className="flex items-center justify-between">
                    <Label>Active</Label>
                    <Switch
                      checked={link.isActive}
                      onCheckedChange={(checked) =>
                        updateLink(link.id, { isActive: checked })
                      }
                    />
                  </div>
                </div>
              ))}

              {links.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No links added yet</p>
                  <Button className="mt-2" onClick={addLink}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Link
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bioThemes.map((theme) => (
              <div
                key={theme.id}
                className={`cursor-pointer rounded-lg border-2 transition-all ${
                  bioData.theme.id === theme.id
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-muted hover:border-muted-foreground/50"
                }`}
                onClick={() => setBioData({ ...bioData, theme })}
              >
                <div className={`h-20 rounded-t-md ${theme.preview}`}></div>
                <div className="p-3">
                  <h4 className="font-medium text-sm">{theme.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm mx-auto">
            <div
              className={`${bioData.theme.preview} rounded-2xl p-6 text-white`}
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  {bioData.avatar ? (
                    <img
                      src={bioData.avatar || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold">
                      {bioData.title ? bioData.title.charAt(0) : "U"}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold">
                  {bioData.title || "Your Name"}
                </h2>
                <p className="text-white/80 mt-1">
                  {bioData.description || "Your description"}
                </p>
              </div>

              <div className="space-y-3">
                {links
                  .filter((link) => link.isActive)
                  .map((link) => (
                    <div
                      key={link.id}
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      <span className="font-medium">
                        {link.title || "Link Title"}
                      </span>
                    </div>
                  ))}
                {links.filter((link) => link.isActive).length === 0 && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                    <span className="font-medium opacity-60">
                      Add some links to get started
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
