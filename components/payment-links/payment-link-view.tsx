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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Secure Payment Link
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-0">
                {paymentLink.imageUrl ? (
                  <div className="relative aspect-square">
                    <Image
                      src={paymentLink.imageUrl || "/placeholder.svg"}
                      alt={paymentLink.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <ImageIcon className="w-16 h-16 text-slate-400 mx-auto" />
                      <p className="text-slate-500 dark:text-slate-400">
                        No image available
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Creator Info */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {paymentLink.creator.name || "Anonymous Creator"}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Creator
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {paymentLink.title}
                    </CardTitle>
                    <Badge variant="secondary" className="w-fit">
                      {paymentLink.type}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(paymentLink.price, paymentLink.currency)}
                    </div>
                    {paymentLink.allowTips && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        + optional tip
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Description */}
                {paymentLink.description && (
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Description
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {paymentLink.description}
                    </p>
                  </div>
                )}

                <Separator />

                {/* Features */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    What you get:
                  </h3>
                  <div className="space-y-2">
                    {paymentLink.digitalFileUrl && (
                      <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                        <Download className="w-4 h-4 text-green-500" />
                        <span>Digital download included</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span>Secure payment processing</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                      <FileText className="w-4 h-4 text-purple-500" />
                      <span>Email receipt & confirmation</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Purchase Button */}
                <div className="space-y-4">
                  <Button
                    onClick={() => setCheckoutOpen(true)}
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <DollarSign className="w-5 h-5 mr-2" />
                    Purchase Now
                  </Button>

                  <div className="flex items-center justify-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Shield className="w-3 h-3" />
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Instant</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>Trusted</span>
                    </div>
                  </div>
                </div>

                {/* Created Date */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Created on {formatDate(paymentLink.createdAt)}
                  </p>
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
