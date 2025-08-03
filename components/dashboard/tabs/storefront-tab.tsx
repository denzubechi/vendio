"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ExternalLink, Copy } from "lucide-react"
import { toast } from "sonner"

export function StorefrontTab() {
  const storeUrl = "https://chainstore.app/store/johndoe"

  const copyStoreUrl = () => {
    navigator.clipboard.writeText(storeUrl)
    toast.success("Store URL copied to clipboard")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Storefront</h1>
        <Button>
          <ExternalLink className="mr-2 h-4 w-4" />
          Preview Store
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Store Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="store-name">Store Name</Label>
              <Input id="store-name" defaultValue="John's Digital Store" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="store-description">Description</Label>
              <Textarea
                id="store-description"
                defaultValue="Premium digital products and courses for entrepreneurs"
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
              <Switch id="store-active" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Link in Bio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio-title">Bio Title</Label>
              <Input id="bio-title" defaultValue="John Doe - Digital Creator" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio-description">Bio Description</Label>
              <Textarea
                id="bio-description"
                defaultValue="Helping entrepreneurs build successful online businesses"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio-url">Bio Page URL</Label>
              <div className="flex space-x-2">
                <Input id="bio-url" value="https://chainstore.app/bio/johndoe" readOnly />
                <Button size="icon" variant="outline">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="bio-active">Bio Page Active</Label>
              <Switch id="bio-active" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theme Customization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="flex space-x-2">
                <div className="w-8 h-8 rounded bg-purple-600 border-2 border-purple-600"></div>
                <div className="w-8 h-8 rounded bg-blue-600 border"></div>
                <div className="w-8 h-8 rounded bg-green-600 border"></div>
                <div className="w-8 h-8 rounded bg-red-600 border"></div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Layout Style</Label>
              <div className="space-y-2">
                <div className="p-2 border rounded cursor-pointer bg-muted">
                  <div className="text-sm font-medium">Grid Layout</div>
                </div>
                <div className="p-2 border rounded cursor-pointer">
                  <div className="text-sm font-medium">List Layout</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Font Style</Label>
              <div className="space-y-2">
                <div className="p-2 border rounded cursor-pointer bg-muted">
                  <div className="text-sm font-medium font-sans">Modern Sans</div>
                </div>
                <div className="p-2 border rounded cursor-pointer">
                  <div className="text-sm font-medium font-serif">Classic Serif</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
