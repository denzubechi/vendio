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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { createBaseAccountSDK, pay, getPaymentStatus } from "@base-org/account";
import {
  SignInWithBaseButton,
  BasePayButton,
} from "@base-org/account-ui/react";
import { Wallet, CreditCard, Shield, Zap, Plus, Minus } from "lucide-react";

interface PaymentLinkCheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentLink: {
    id: string;
    title: string;
    price: number;
    currency: string;
    allowTips: boolean;
    digitalFileUrl: string | null;
    creator: {
      id: string;
      name: string | null;
      email: string;
    };
  };
}

export function PaymentLinkCheckoutModal({
  open,
  onOpenChange,
  paymentLink,
}: PaymentLinkCheckoutModalProps) {
  const { toast } = useToast();
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    email: "",
  });
  const [tipAmount, setTipAmount] = useState(0);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");

  const total = paymentLink.price + tipAmount;

  const sdk = createBaseAccountSDK({
    appName: "Payment Links",
  });

  const handleSignIn = async () => {
    try {
      await sdk.getProvider().request({ method: "wallet_connect" });
      setIsSignedIn(true);
      toast({
        title: "Success",
        description: "Connected to Base Account!",
      });
    } catch (error) {
      console.error("Sign in failed:", error);
      toast({
        title: "Error",
        description: "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const handlePayment = async () => {
    if (!buyerInfo.name || !buyerInfo.email) {
      toast({
        title: "Error",
        description: "Please fill in your name and email",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const paymentResult = await pay({
        amount: total.toFixed(2),
        to: paymentLink.creator.id, // Creator's wallet address
        testnet: process.env.NODE_ENV !== "production",
      });

      if (paymentResult.success) {
        const { id } = paymentResult;
        setPaymentStatus("Payment initiated! Processing...");

        await handlePurchaseCreation(id);

        setTimeout(async () => {
          try {
            const { status } = await getPaymentStatus({ id });
            setPaymentStatus(`Payment status: ${status}`);

            if (status === "completed") {
              toast({
                title: "Success",
                description: "Payment completed successfully! 🎉",
              });
              onOpenChange(false);
              resetForm();
            }
          } catch (error) {
            console.error("Status check failed:", error);
            setPaymentStatus("Status check failed");
          }
        }, 3000);
      } else {
        toast({
          title: "Error",
          description: "Payment failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment failed:", error);
      toast({
        title: "Error",
        description: "Payment failed",
        variant: "destructive",
      });
      setPaymentStatus("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseCreation = async (transactionHash: string) => {
    try {
      const response = await fetch("/api/payment-link/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentLinkId: paymentLink.id,
          totalAmount: total,
          currency: paymentLink.currency,
          buyerEmail: buyerInfo.email,
          buyerName: buyerInfo.name,
          paymentHash: transactionHash,
          tipAmount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to record purchase");
      }

      const result = await response.json();
      console.log("[v0] Purchase recorded:", result);
    } catch (error) {
      console.error("Failed to record purchase:", error);
      toast({
        title: "Warning",
        description: "Payment successful but failed to record purchase",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setBuyerInfo({ name: "", email: "" });
    setTipAmount(0);
    setPaymentStatus("");
    setIsSignedIn(false);
  };

  const adjustTip = (amount: number) => {
    const newTip = Math.max(0, tipAmount + amount);
    setTipAmount(newTip);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <span>Secure Checkout</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <CardHeader>
              <CardTitle className="text-lg">{paymentLink.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Price:</span>
                <span className="font-semibold">
                  ${paymentLink.price.toFixed(2)} {paymentLink.currency}
                </span>
              </div>

              {paymentLink.allowTips && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Tip (optional):</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => adjustTip(-1)}
                        disabled={tipAmount <= 0}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="font-semibold min-w-[60px] text-center">
                        ${tipAmount.toFixed(2)}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => adjustTip(1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {[5, 10, 20].map((amount) => (
                      <Button
                        key={amount}
                        size="sm"
                        variant="outline"
                        onClick={() => setTipAmount(amount)}
                        className="flex-1"
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-blue-600">
                  ${total.toFixed(2)} {paymentLink.currency}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buyer-name">Full Name *</Label>
                  <Input
                    id="buyer-name"
                    value={buyerInfo.name}
                    onChange={(e) =>
                      setBuyerInfo({ ...buyerInfo, name: e.target.value })
                    }
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyer-email">Email *</Label>
                  <Input
                    id="buyer-email"
                    type="email"
                    value={buyerInfo.email}
                    onChange={(e) =>
                      setBuyerInfo({ ...buyerInfo, email: e.target.value })
                    }
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-500" />
                <span>Pay with Base Account</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                        ✅ Wallet Connected
                      </span>
                    </div>
                  </div>

                  <BasePayButton colorScheme="light" onClick={handlePayment} />

                  {paymentStatus && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {paymentStatus}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

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
