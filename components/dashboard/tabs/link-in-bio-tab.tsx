"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, ExternalLink, Copy } from "lucide-react"
import { toast } from "sonner"

interface LinkItem {
  id: string
  title: string
  url: string
  isActive: boolean
}

export function LinkInBioTab() {
  const [bioData, setBioData] = useState({
    title: "John Doe",
    description: "Digital Creator & Entrepreneur",
    avatar: "",
    isActive: true,
  })

  const [links, setLinks] = useState<LinkItem[]>([
    { id: "1", title: "My Digital Store", url: "/store/johndoe", isActive: true },
    { id: "2", title: "Latest Course", url: "/product/digital-marketing", isActive: true },
  ])

  const bioUrl = "https://selar-onchain.vercel.app/bio/johndoe"

  const addLink = () => {
    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: "New Link",
      url: "",
      isActive: true,
    }
    setLinks([...links, newLink])
  }

  const updateLink = (id: string, updates: Partial<LinkItem>) => {
    setLinks(links.map((link) => (link.id === id ? { ...link, ...updates } : link)))
  }

  const removeLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id))
  }

  const copyBioUrl = () => {
    navigator.clipboard.writeText(bioUrl)
    toast.success("Bio URL copied to clipboard")
  }

  const saveBio = () => {
    toast.success("Link in Bio updated successfully!")
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
          <Button>
            <ExternalLink className="mr-2 h-4 w-4" />
            Preview
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
            <div className="space-y-2">
              <Label htmlFor="bio-title">Title</Label>
              <Input
                id="bio-title"
                value={bioData.title}
                onChange={(e) => setBioData({ ...bioData, title: e.target.value })}
                placeholder="Your name or brand"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio-description">Description</Label>
              <Textarea
                id="bio-description"
                value={bioData.description}
                onChange={(e) => setBioData({ ...bioData, description: e.target.value })}
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
                onCheckedChange={(checked) => setBioData({ ...bioData, isActive: checked })}
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
                      onChange={(e) => updateLink(link.id, { title: e.target.value })}
                      placeholder="Link title"
                      className="flex-1 mr-2"
                    />
                    <Button size="sm" variant="outline" onClick={() => removeLink(link.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <Input
                    value={link.url}
                    onChange={(e) => updateLink(link.id, { url: e.target.value })}
                    placeholder="https://example.com"
                  />

                  <div className="flex items-center justify-between">
                    <Label>Active</Label>
                    <Switch
                      checked={link.isActive}
                      onCheckedChange={(checked) => updateLink(link.id, { isActive: checked })}
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

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm mx-auto bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold">{bioData.title.charAt(0)}</span>
              </div>
              <h2 className="text-xl font-bold">{bioData.title}</h2>
              <p className="text-purple-100 mt-1">{bioData.description}</p>
            </div>

            <div className="space-y-3">
              {links
                .filter((link) => link.isActive)
                .map((link) => (
                  <div
                    key={link.id}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <span className="font-medium">{link.title}</span>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveBio}>Save Changes</Button>
      </div>
    </div>
  )
}
