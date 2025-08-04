"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { createBaseAccountSDK, pay, getPaymentStatus } from "@base-org/account";
import {
  SignInWithBaseButton,
  BasePayButton,
} from "@base-org/account-ui/react";
import { Wallet, CreditCard, Shield, Zap } from "lucide-react";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: string;
  storeName: string;
  creatorAddress: string;
}

export function CheckoutModal({
  open,
  onOpenChange,
  storeId,
  storeName,
  creatorAddress,
}: CheckoutModalProps) {
  const { cart, getCartTotal, clearCart } = useStore();
  const { address, isConnected } = useAccount();
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
  });
  const [paymentId, setPaymentId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const total = getCartTotal();

  // Initialize Base Account SDK
  const sdk = createBaseAccountSDK({
    appName: "Vendio",
  });

  const handleSignIn = async () => {
    try {
      await sdk.getProvider().request({ method: "wallet_connect" });
      setIsSignedIn(true);
      toast.success("Connected to Base Account!");
    } catch (error) {
      console.error("Sign in failed:", error);
      toast.error("Failed to connect wallet");
    }
  };

  const handleBasePayment = async () => {
    if (!guestInfo.name || !guestInfo.email) {
      toast.error("Please fill in your name and email");
      return;
    }

    setLoading(true);
    try {
      const paymentResult = await pay({
        amount: total.toFixed(2),
        to: creatorAddress,
        testnet: process.env.NODE_ENV !== "production",
      });

      if (paymentResult.success) {
        const { id } = paymentResult;
        setPaymentId(id);
        setPaymentStatus("Payment initiated! Processing...");

        await handleOrderCreation(id);
        setTimeout(async () => {
          try {
            const { status } = await getPaymentStatus({ id: id });
            setPaymentStatus(`Payment status: ${status}`);
          } catch (error) {
            console.error("Status check failed:", error);
            setPaymentStatus("Status check failed");
          }
        }, 3000);
      } else {
        toast.error("Failed to send tip");
      }
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Payment failed");
      setPaymentStatus("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderCreation = async (transactionHash: string) => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
          total,
          buyerInfo: guestInfo,
          buyerAddress: address,
          type: guestInfo.name ? "guest" : "wallet",
          transactionHash,
        }),
      });

      if (response.ok) {
        toast.success("Order completed successfully! 🎉");
        clearCart();
        onOpenChange(false);
        setPaymentStatus("");
        setPaymentId("");
      } else {
        toast.error("Order recording failed");
      }
    } catch (error) {
      console.error("Failed to record order:", error);
      toast.error("Failed to record order");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <span>Secure Checkout</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Order Summary</span>
                <Badge className="bg-gradient-to-r from-purple-500 to-blue-500">
                  {cart.length} items
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground ml-2">
                        x{item.quantity}
                      </span>
                    </div>
                    <span className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)} {item.currency}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-purple-600">
                    ${total.toFixed(2)} USDC
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Tabs defaultValue="base-pay" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="base-pay"
                className="flex items-center space-x-2"
              >
                <Wallet className="w-4 h-4" />
                <span>Base Pay</span>
              </TabsTrigger>
              <TabsTrigger
                value="wallet"
                className="flex items-center space-x-2"
              >
                <Shield className="w-4 h-4" />
                <span>Wallet Connect</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="base-pay" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span>Pay with Base Account</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Customer Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="guest-name">Full Name *</Label>
                      <Input
                        id="guest-name"
                        value={guestInfo.name}
                        onChange={(e) =>
                          setGuestInfo({ ...guestInfo, name: e.target.value })
                        }
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guest-email">Email *</Label>
                      <Input
                        id="guest-email"
                        type="email"
                        value={guestInfo.email}
                        onChange={(e) =>
                          setGuestInfo({ ...guestInfo, email: e.target.value })
                        }
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  {/* Base Account Integration */}
                  <div className="space-y-4">
                    {!isSignedIn ? (
                      <div className="text-center p-6 border-2 border-dashed border-muted rounded-lg">
                        <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">
                          Connect your Base Account to continue
                        </p>
                        <SignInWithBaseButton
                          align="center"
                          variant="solid"
                          colorScheme="light"
                          onClick={handleSignIn}
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium text-green-700 dark:text-green-300">
                              ✅ Connected to Base Account
                            </span>
                          </div>
                        </div>

                        <BasePayButton
                          colorScheme="light"
                          onClick={handleBasePayment}
                        />

                        {paymentStatus && (
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              {paymentStatus}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wallet" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  {isConnected ? (
                    <div className="space-y-4">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Connected: {address?.slice(0, 6)}...
                          {address?.slice(-4)}
                        </p>
                      </div>
                      <Button className="w-full" disabled>
                        Wallet Connect Payment (Coming Soon)
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        Connect your wallet to continue
                      </p>
                      <Button>Connect Wallet</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Security Features */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <Shield className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Secure Payment</p>
            </div>
            <div className="text-center">
              <Zap className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">
                Instant Settlement
              </p>
            </div>
            <div className="text-center">
              <Wallet className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Base Blockchain</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
