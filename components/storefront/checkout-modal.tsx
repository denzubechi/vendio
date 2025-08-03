"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { useAccount } from "wagmi"
import { toast } from "sonner"
import { createPayment } from "@/lib/base-account"

interface CheckoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  storeId: string
  storeName: string
  creatorAddress: string
}

export function CheckoutModal({ open, onOpenChange, storeId, storeName, creatorAddress }: CheckoutModalProps) {
  const { cart, getCartTotal, clearCart } = useStore()
  const { address, isConnected } = useAccount()
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
  })
  const [loading, setLoading] = useState(false)

  const total = getCartTotal()

  const handlePayment = async (type: "guest" | "wallet") => {
    if (!creatorAddress) {
      toast.error("Creator address not found")
      return
    }

    if (type === "guest" && (!guestInfo.name || !guestInfo.email)) {
      toast.error("Please fill in all fields")
      return
    }

    if (type === "wallet" && !isConnected) {
      toast.error("Please connect your wallet")
      return
    }

    setLoading(true)
    try {
      // Create payment using Base Pay
      const paymentResult = await createPayment({
        amount: total,
        to: creatorAddress,
        message: `Purchase from ${storeName}`,
        testnet: process.env.NODE_ENV !== "production",
      })

      if (paymentResult.success) {
        // Record the order
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: cart,
            total,
            buyerInfo: type === "guest" ? guestInfo : undefined,
            buyerAddress: type === "wallet" ? address : undefined,
            type,
            paymentId: paymentResult.id,
            transactionHash: paymentResult.id,
          }),
        })

        if (response.ok) {
          toast.success("Payment successful! Check your email for confirmation.")
          clearCart()
          onOpenChange(false)
        } else {
          toast.error("Order recording failed")
        }
      } else {
        toast.error(`Payment failed: ${paymentResult.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Payment failed:", error)
      toast.error("Payment failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>
                      {(item.price * item.quantity).toFixed(2)} {item.currency}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{total.toFixed(2)} USDC</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Options */}
          <Tabs defaultValue="guest" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="guest">Guest Checkout</TabsTrigger>
              <TabsTrigger value="wallet">Pay with Wallet</TabsTrigger>
            </TabsList>

            <TabsContent value="guest" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guest-name">Full Name</Label>
                  <Input
                    id="guest-name"
                    value={guestInfo.name}
                    onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guest-email">Email</Label>
                  <Input
                    id="guest-email"
                    type="email"
                    value={guestInfo.email}
                    onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                    placeholder="Enter your email"
                  />
                </div>

                <Button
                  onClick={() => handlePayment("guest")}
                  className="w-full"
                  disabled={loading || !guestInfo.name || !guestInfo.email}
                >
                  {loading ? "Processing..." : `Pay ${total.toFixed(2)} USDC`}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="wallet" className="space-y-4">
              {isConnected ? (
                <div className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                  </div>

                  <Button onClick={() => handlePayment("wallet")} className="w-full" disabled={loading}>
                    {loading ? "Processing..." : `Pay ${total.toFixed(2)} USDC`}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Connect your wallet to continue</p>
                  <Button>Connect Wallet</Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
