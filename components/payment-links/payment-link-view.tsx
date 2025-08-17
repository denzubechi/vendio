"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PaymentLinkCheckoutModal } from "../dashboard/payment-link-checkout-modal";
import {
  Download,
  Shield,
  Clock,
  User,
  DollarSign,
  FileText,
  ImageIcon,
  Star,
  Sparkles,
  CheckCircle,
  Lock,
} from "lucide-react";
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

export function PaymentLinkView({ paymentLink }: PaymentLinkViewProps) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    return `$${price.toFixed(2)} ${currency}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-primary/15 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-accent/25 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 bg-card/80 backdrop-blur-xl rounded-full px-6 py-3 mb-6 border border-border/50 shadow-lg">
            <div className="relative">
              <Shield className="w-5 h-5 text-primary" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            </div>
            <span className="text-sm font-semibold text-foreground">
              Premium Secure Payment
            </span>
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground text-lg">
              Experience premium payment processing
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <Card className="overflow-hidden bg-card/60 backdrop-blur-xl border-0 shadow-2xl ring-1 ring-border/20">
              <CardContent className="p-0">
                {paymentLink.imageUrl ? (
                  <div className="relative aspect-square group">
                    <Image
                      src={paymentLink.imageUrl || "/placeholder.svg"}
                      alt={paymentLink.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                ) : (
                  <div className="aspect-square bg-gradient-to-br from-muted via-card to-muted flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
                    <div className="text-center space-y-4 relative z-10">
                      <div className="relative">
                        <ImageIcon className="w-20 h-20 text-muted-foreground mx-auto" />
                        <Sparkles className="w-6 h-6 text-primary absolute -top-2 -right-2 animate-pulse" />
                      </div>
                      <p className="text-muted-foreground font-medium">
                        Premium Content Preview
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card/60 backdrop-blur-xl border-0 shadow-xl ring-1 ring-border/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                      <CheckCircle className="w-2.5 h-2.5 text-accent-foreground" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-lg">
                      {paymentLink.creator.name || "Premium Creator"}
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-muted-foreground">
                        Verified Creator
                      </p>
                      <Star className="w-3 h-3 text-accent fill-current" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-card/60 backdrop-blur-xl border-0 shadow-2xl ring-1 ring-border/20">
              <CardHeader className="pb-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-4 flex-1">
                    <div className="space-y-2">
                      <CardTitle className="text-3xl font-bold text-foreground leading-tight">
                        {paymentLink.title}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="w-fit bg-primary/10 text-primary border-primary/20 font-medium"
                      >
                        {paymentLink.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {formatPrice(paymentLink.price, paymentLink.currency)}
                    </div>
                    {paymentLink.allowTips && (
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Sparkles className="w-3 h-3" />
                        <span>+ optional tip</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-8">
                {paymentLink.description && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground text-lg flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <span>What You'll Get</span>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {paymentLink.description}
                    </p>
                  </div>
                )}

                <Separator className="bg-border/50" />

                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground text-lg flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <span>Premium Features</span>
                  </h3>
                  <div className="grid gap-3">
                    {paymentLink.digitalFileUrl && (
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Download className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-foreground font-medium">
                          Instant Digital Download
                        </span>
                      </div>
                    )}
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent/5 border border-accent/10">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                        <Lock className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-foreground font-medium">
                        Bank-Grade Security
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-foreground font-medium">
                        Detailed Receipt & Confirmation
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-border/50" />

                <div className="space-y-6">
                  <Button
                    onClick={() => setCheckoutOpen(true)}
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <DollarSign className="w-6 h-6 mr-3" />
                    <span>Complete Purchase</span>
                    <Sparkles className="w-5 h-5 ml-3" />
                  </Button>

                  <div className="flex items-center justify-center space-x-8 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="font-medium">256-bit SSL</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-accent" />
                      <span className="font-medium">Instant Access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-primary fill-current" />
                      <span className="font-medium">Premium Support</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Created on {formatDate(paymentLink.createdAt)}
                    </span>
                    <div className="flex items-center space-x-1 text-primary">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">Verified</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

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
