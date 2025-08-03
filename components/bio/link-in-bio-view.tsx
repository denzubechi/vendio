"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ExternalLink, ShoppingBag, Heart, Star, Users, Award } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { createPayment } from "@/lib/base-account"

interface LinkInBioViewProps {
  user: {
    name: string | null
    username: string | null
    avatar: string | null
    bio: string | null
    walletAddress: string | null
    linkInBio: {
      title: string
      description: string | null
      links: any[]
    } | null
    stores: Array<{
      slug: string
      name: string
      products: Array<{
        id: string
        name: string
        price: number
        currency: string
      }>
    }>
  }
}

export function LinkInBioView({ user }: LinkInBioViewProps) {
  const [tipModalOpen, setTipModalOpen] = useState(false)
  const [tipAmount, setTipAmount] = useState("")
  const [tipMessage, setTipMessage] = useState("")
  const [tipperName, setTipperName] = useState("")
  const [tipperEmail, setTipperEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const bio = user.linkInBio!
  const store = user.stores[0]

  const handleTip = async () => {
    if (!user.walletAddress) {
      toast.error("Creator wallet address not found")
      return
    }

    if (!tipAmount || Number.parseFloat(tipAmount) <= 0) {
      toast.error("Please enter a valid tip amount")
      return
    }

    if (!tipperName || !tipperEmail) {
      toast.error("Please fill in your name and email")
      return
    }

    setLoading(true)
    try {
      // Create payment using Base Pay
      const paymentResult = await createPayment({
        amount: Number.parseFloat(tipAmount),
        to: user.walletAddress,
        message: tipMessage || `Tip from ${tipperName}`,
        testnet: process.env.NODE_ENV !== "production",
      })

      if (paymentResult.success) {
        // Record the tip
        await fetch("/api/tips", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            creatorUsername: user.username,
            amount: Number.parseFloat(tipAmount),
            message: tipMessage,
            tipperName,
            tipperEmail,
            transactionHash: paymentResult.id,
          }),
        })

        toast.success("Tip sent successfully! 💝")
        setTipModalOpen(false)
        setTipAmount("")
        setTipMessage("")
        setTipperName("")
        setTipperEmail("")
      } else {
        toast.error(`Tip failed: ${paymentResult.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Tip failed:", error)
      toast.error("Tip failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!user.walletAddress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Profile Configuration Error</h1>
          <p className="text-purple-100">This creator hasn't configured their wallet address yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600">
      <div className="container max-w-md mx-auto px-4 py-12">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
          {/* Profile Section */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-bold">{bio.title.charAt(0)}</span>
            </div>
            <h1 className="text-2xl font-bold">{bio.title}</h1>
            {bio.description && <p className="text-purple-100 mt-2">{bio.description}</p>}

            {/* Creator Stats */}
            <div className="flex justify-center space-x-6 mt-4">
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-semibold">4.9</span>
                </div>
                <p className="text-xs text-purple-100">Rating</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span className="font-semibold">1.2k</span>
                </div>
                <p className="text-xs text-purple-100">Customers</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <Award className="w-4 h-4 mr-1" />
                  <span className="font-semibold">127</span>
                </div>
                <p className="text-xs text-purple-100">Reviews</p>
              </div>
            </div>
          </div>

          {/* What I Do Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-center">What I Do</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <ShoppingBag className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Digital Products</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <Award className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm font-medium">Online Courses</p>
              </div>
            </div>
          </div>

          {/* Featured Products */}
          {store && store.products.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Featured Products</h2>
              <div className="space-y-3">
                {store.products.slice(0, 3).map((product) => (
                  <Card key={product.id} className="bg-white/10 border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-white">{product.name}</h3>
                          <p className="text-purple-100 text-sm">
                            {product.price} {product.currency}
                          </p>
                        </div>
                        <Link href={`/store/${store.slug}`}>
                          <Button size="sm" variant="secondary">
                            View
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="space-y-3 mb-8">
            {/* Store Link */}
            {store && (
              <Link href={`/store/${store.slug}`}>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/20 transition-colors cursor-pointer">
                  <div className="flex items-center justify-center space-x-2">
                    <ShoppingBag className="w-5 h-5" />
                    <span className="font-medium">Visit My Store</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Tip Button */}
            <div
              onClick={() => setTipModalOpen(true)}
              className="bg-gradient-to-r from-pink-500 to-rose-500 backdrop-blur-sm rounded-lg p-4 text-center hover:from-pink-600 hover:to-rose-600 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-center space-x-2">
                <Heart className="w-5 h-5" />
                <span className="font-medium">Send a Tip</span>
              </div>
            </div>

            {/* Custom Links */}
            {bio.links.map((link: any, index: number) => (
              <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="block">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/20 transition-colors">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="font-medium">{link.title}</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center pt-6 border-t border-white/20">
            <p className="text-purple-100 text-sm">Powered by Selar Onchain</p>
          </div>
        </div>
      </div>

      {/* Tip Modal */}
      <Dialog open={tipModalOpen} onOpenChange={setTipModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-pink-500" />
              Send a Tip to {bio.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipper-name">Your Name</Label>
                <Input
                  id="tipper-name"
                  value={tipperName}
                  onChange={(e) => setTipperName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipper-email">Your Email</Label>
                <Input
                  id="tipper-email"
                  type="email"
                  value={tipperEmail}
                  onChange={(e) => setTipperEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tip-amount">Tip Amount (USDC)</Label>
              <Input
                id="tip-amount"
                type="number"
                step="0.01"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value)}
                placeholder="5.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tip-message">Message (Optional)</Label>
              <Textarea
                id="tip-message"
                value={tipMessage}
                onChange={(e) => setTipMessage(e.target.value)}
                placeholder="Say something nice..."
                rows={3}
              />
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setTipModalOpen(false)} className="flex-1">
                Cancel
              </Button>

              <Button
                onClick={handleTip}
                className="flex-1"
                disabled={loading || !tipAmount || Number.parseFloat(tipAmount) <= 0 || !tipperName || !tipperEmail}
              >
                {loading ? "Sending..." : "Send Tip"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
