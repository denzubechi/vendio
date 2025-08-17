"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PaymentLinkCheckoutModal } from "../dashboard/payment-link-checkout-modal";
import { Shield, User, DollarSign } from "lucide-react";
import Image from "next/image";

interface PaymentLinkViewProps {
  paymentLink: {
    id: string;
    title: string;
    description: string | null;
    type: string;
    price: number;
    currency: string;
    slug: string;
    imageUrl: string | null;
    digitalFileUrl: string | null;
    allowTips: boolean;
    createdAt: Date;
    creator: {
      id: string;
      name: string | null;
      email: string;
    };
  };
}

export function SimplePaymentView({ paymentLink }: PaymentLinkViewProps) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    return `$${price.toFixed(2)} ${currency}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {paymentLink.title}
            </CardTitle>
            <Badge variant="secondary" className="w-fit mx-auto mt-2">
              {paymentLink.type}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Product Image */}
            {paymentLink.imageUrl ? (
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={paymentLink.imageUrl || "/placeholder.svg"}
                  alt={paymentLink.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">No image available</p>
              </div>
            )}

            {/* Description */}
            {paymentLink.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">
                  {paymentLink.description}
                </p>
              </div>
            )}

            <Separator />

            {/* Creator Info */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  {paymentLink.creator.name || "Creator"}
                </p>
                <p className="text-sm text-muted-foreground">Seller</p>
              </div>
            </div>

            <Separator />

            {/* Price and Purchase */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">
                  {formatPrice(paymentLink.price, paymentLink.currency)}
                </div>
                {paymentLink.allowTips && (
                  <p className="text-sm text-muted-foreground mt-1">
                    + optional tip
                  </p>
                )}
              </div>

              <Button
                onClick={() => setCheckoutOpen(true)}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Purchase Now
              </Button>

              {/* Security Badge */}
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Secure Payment</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checkout Modal */}
        <PaymentLinkCheckoutModal
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          paymentLink={paymentLink}
        />
      </div>
    </div>
  );
}
