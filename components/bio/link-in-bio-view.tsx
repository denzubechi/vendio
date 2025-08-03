"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  ShoppingBag,
  Heart,
  Star,
  Users,
  Award,
  Zap,
  Globe,
  TrendingUp,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";
import { createBaseAccountSDK, pay } from "@base-org/account";
import { BasePayButton } from "@base-org/account-ui/react";

interface LinkInBioViewProps {
  user: {
    name: string | null;
    username: string | null;
    avatar: string | null;
    bio: string | null;
    walletAddress: string | null;
    linkInBio: {
      title: string;
      description: string | null;
      links: any[];
    } | null;
    stores: Array<{
      slug: string;
      name: string;
      products: Array<{
        id: string;
        name: string;
        price: number;
        currency: string;
      }>;
    }>;
  };
}

export function LinkInBioView({ user }: LinkInBioViewProps) {
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [tipAmount, setTipAmount] = useState("");
  const [tipMessage, setTipMessage] = useState("");
  const [tipperName, setTipperName] = useState("");
  const [tipperEmail, setTipperEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const bio = user.linkInBio!;
  const store = user.stores[0];

  const sdk = createBaseAccountSDK({
    appName: "Selar Onchain",
  });

  const handleTip = async () => {
    if (!tipAmount || !tipperName || !tipperEmail) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const paymentResult = await pay({
        amount: tipAmount,
        to: user.walletAddress!,
        testnet: process.env.NODE_ENV !== "production",
      });

      if (paymentResult.success) {
        const { id, payerInfoResponses } = paymentResult;
        toast.success("Tip sent successfully! 💝");
        setTipModalOpen(false);
        setTipAmount("");
        setTipMessage("");
        setTipperName("");
        setTipperEmail("");

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
            transactionHash: id,
          }),
        });
      } else {
        const { error } = paymentResult;
        toast.error("Failed to send tip");
      }
    } catch (error) {
      console.error("Failed to send tip:", error);
      toast.error("Failed to send tip");
    } finally {
      setLoading(false);
    }
  };

  if (!user.walletAddress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">
            Profile Configuration Error
          </h1>
          <p className="text-purple-100">
            This creator hasn't configured their wallet address yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container max-w-md mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-white shadow-2xl border border-white/20"
        >
          {/* Profile Section */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative mb-6"
            >
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-white/20 to-white/10 mx-auto flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
                <span className="text-4xl font-bold">
                  {bio.title.charAt(0)}
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h1 className="text-3xl font-bold mb-2">{bio.title}</h1>
              {bio.description && (
                <p className="text-purple-100 text-lg mb-4">
                  {bio.description}
                </p>
              )}
            </motion.div>

            {/* Creator Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 mb-6"
            >
              <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="flex items-center justify-center mb-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-bold text-lg">4.9</span>
                </div>
                <p className="text-xs text-purple-100">Rating</p>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="flex items-center justify-center mb-1">
                  <Users className="w-4 h-4 mr-1" />
                  <span className="font-bold text-lg">1.2k</span>
                </div>
                <p className="text-xs text-purple-100">Customers</p>
              </div>
              <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="flex items-center justify-center mb-1">
                  <Award className="w-4 h-4 mr-1" />
                  <span className="font-bold text-lg">127</span>
                </div>
                <p className="text-xs text-purple-100">Reviews</p>
              </div>
            </motion.div>
          </div>

          {/* What I Do Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 text-center">
              What I Do
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-white/15 to-white/5 rounded-xl p-4 text-center backdrop-blur-sm border border-white/20">
                <ShoppingBag className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Digital Products</p>
                <p className="text-xs text-purple-100 mt-1">Premium content</p>
              </div>
              <div className="bg-gradient-to-br from-white/15 to-white/5 rounded-xl p-4 text-center backdrop-blur-sm border border-white/20">
                <Award className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Online Courses</p>
                <p className="text-xs text-purple-100 mt-1">Expert training</p>
              </div>
            </div>
          </motion.div>

          {/* Featured Products */}
          {store && store.products.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
              <div className="space-y-3">
                {store.products.slice(0, 3).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  >
                    <Card className="bg-gradient-to-r from-white/15 to-white/5 border-white/20 backdrop-blur-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-white mb-1">
                              {product.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-green-500/20 text-green-100 border-green-300/30">
                                ${product.price} {product.currency}
                              </Badge>
                              <div className="flex items-center text-xs text-purple-100">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Popular
                              </div>
                            </div>
                          </div>
                          <Link href={`/store/${store.slug}`}>
                            <Button
                              size="sm"
                              className="bg-white/20 hover:bg-white/30 border-white/30"
                            >
                              View
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="space-y-4 mb-8"
          >
            {/* Store Link */}
            {store && (
              <Link href={`/store/${store.slug}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-sm rounded-xl p-4 text-center hover:from-white/20 hover:to-white/10 transition-all duration-300 cursor-pointer border border-white/20"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">Visit My Store</p>
                      <p className="text-xs text-purple-100">
                        Browse all products
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-purple-200" />
                  </div>
                </motion.div>
              </Link>
            )}

            {/* Tip Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTipModalOpen(true)}
              className="bg-gradient-to-r from-pink-500/80 to-rose-500/80 backdrop-blur-sm rounded-xl p-4 text-center hover:from-pink-600/80 hover:to-rose-600/80 transition-all duration-300 cursor-pointer border border-pink-300/30"
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-400 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Send a Tip</p>
                  <p className="text-xs text-pink-100">Show your support</p>
                </div>
                <Zap className="w-4 h-4 text-pink-200" />
              </div>
            </motion.div>

            {/* Custom Links */}
            {bio.links.map((link: any, index: number) => (
              <motion.a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block"
              >
                <div className="bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-sm rounded-xl p-4 text-center hover:from-white/20 hover:to-white/10 transition-all duration-300 border border-white/20">
                  <div className="flex items-center justify-center space-x-3">
                    <Globe className="w-5 h-5" />
                    <span className="font-medium">{link.title}</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-center pt-6 border-t border-white/20"
          >
            <p className="text-purple-100 text-sm">
              Powered by Selar Onchain ⚡
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Tip Modal */}
      <Dialog open={tipModalOpen} onOpenChange={setTipModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mr-3">
                <Heart className="w-4 h-4 text-white" />
              </div>
              Send a Tip to {bio.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Tip Amount Presets */}
            <div className="space-y-3">
              <Label>Quick Amount (USD)</Label>
              <div className="grid grid-cols-4 gap-2">
                {["5", "10", "25", "50"].map((amount) => (
                  <Button
                    key={amount}
                    variant={tipAmount === amount ? "default" : "outline"}
                    onClick={() => setTipAmount(amount)}
                    className="h-12"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="space-y-2">
              <Label htmlFor="tip-amount">Custom Amount (USD)</Label>
              <Input
                id="tip-amount"
                type="number"
                step="0.01"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>

            {/* Tipper Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipper-name">Your Name *</Label>
                <Input
                  id="tipper-name"
                  value={tipperName}
                  onChange={(e) => setTipperName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipper-email">Your Email *</Label>
                <Input
                  id="tipper-email"
                  type="email"
                  value={tipperEmail}
                  onChange={(e) => setTipperEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Message */}
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

            <div className="space-y-4">
              <BasePayButton colorScheme="light" onClick={handleTip} />

              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>Instant</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="w-4 h-4" />
                  <span>Global</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
