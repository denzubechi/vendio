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
  Globe,
  Github,
  Twitter,
  Instagram,
  Linkedin,
  Zap,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";
import { createBaseAccountSDK, pay } from "@base-org/account";
import { BasePayButton } from "@base-org/account-ui/react";
interface LinkInBioLink {
  id: string;
  title: string;
  url: string;
}
interface LinkInBioSocials {
  website?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

interface LinkInBioTheme {
  id: string;
  name: string;
  preview: string;
}
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
      avatar: string | null;
      theme: {
        id: string;
        name: string;
        preview: string;
      } | null;
      links: LinkInBioLink[] | null;
      projects: any[] | null;
      socialUrls: LinkInBioSocials | null;
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

const getThemeClasses = (themeId: string) => {
  const themes = {
    gradient: "bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600",
    dark: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700",
    sunset: "bg-gradient-to-br from-orange-500 via-red-500 to-pink-500",
    ocean: "bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-600",
  };
  return themes[themeId as keyof typeof themes] || themes.gradient;
};

const getSocialIcon = (platform: string) => {
  const icons = {
    website: Globe,
    github: Github,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
  };
  return icons[platform as keyof typeof icons] || Globe;
};

export function LinkInBioView({ user }: LinkInBioViewProps) {
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [tipAmount, setTipAmount] = useState("");
  const [tipMessage, setTipMessage] = useState("");
  const [tipperName, setTipperName] = useState("");
  const [tipperEmail, setTipperEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const bio = user.linkInBio!;
  const store = user.stores[0];
  const themeClass = getThemeClasses(bio.theme?.id || "gradient");
  const sdk = createBaseAccountSDK({
    appName: "Vendio",
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
    <div className={`min-h-screen ${themeClass} relative overflow-hidden`}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container max-w-md mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-white/20"
        >
          {/* Profile Section */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative mb-6"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-white/20 to-white/10 mx-auto flex items-center justify-center backdrop-blur-sm border-2 border-white/30 overflow-hidden">
                {bio.avatar ? (
                  <img
                    src={bio.avatar || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl sm:text-4xl font-bold">
                    {bio.title.charAt(0)}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                {bio.title}
              </h1>
              {bio.description && (
                <p className="text-purple-100 text-base sm:text-lg mb-4">
                  {bio.description}
                </p>
              )}
            </motion.div>

            {/* Social Links */}
            {bio.socialUrls &&
              Object.values(bio.socialUrls).some((url) => url) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex justify-center gap-3 mb-6"
                >
                  {Object.entries(bio.socialUrls).map(([platform, url]) => {
                    if (!url) return null;
                    const IconComponent = getSocialIcon(platform);
                    return (
                      <motion.a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors"
                      >
                        <IconComponent className="w-5 h-5" />
                      </motion.a>
                    );
                  })}
                </motion.div>
              )}
          </div>

          {/* Projects Section */}
          {bio.projects && bio.projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">
                Featured Projects
              </h2>
              <div className="space-y-3">
                {bio.projects.slice(0, 3).map((project: any, index: number) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    <Card className="bg-gradient-to-r from-white/15 to-white/5 border-white/20 backdrop-blur-sm">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start gap-3">
                          {project.image && (
                            <img
                              src={project.image || "/placeholder.svg"}
                              alt={project.title}
                              className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white text-sm sm:text-base mb-1 truncate">
                              {project.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-white/80 line-clamp-2">
                              {project.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Featured Products */}
          {store && store.products.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">
                Featured Products
              </h2>
              <div className="space-y-3">
                {store.products.slice(0, 2).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  >
                    <Card className="bg-gradient-to-r from-white/15 to-white/5 border-white/20 backdrop-blur-sm">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white mb-1 text-sm sm:text-base truncate">
                              {product.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-green-500/20 text-green-100 border-green-300/30 text-xs">
                                ${product.price} {product.currency}
                              </Badge>
                            </div>
                          </div>
                          <Link href={`/store/${store.slug}`}>
                            <Button
                              size="sm"
                              className="bg-white/20 hover:bg-white/30 border-white/30 text-xs sm:text-sm"
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
            className="space-y-3 sm:space-y-4 mb-8"
          >
            {/* Store Link */}
            {store && (
              <Link href={`/store/${store.slug}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center hover:from-white/20 hover:to-white/10 transition-all duration-300 cursor-pointer border border-white/20"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base">
                        Visit My Store
                      </p>
                      <p className="text-xs text-purple-100">
                        Browse all products
                      </p>
                    </div>
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-purple-200 flex-shrink-0" />
                  </div>
                </motion.div>
              </Link>
            )}

            {/* Tip Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTipModalOpen(true)}
              className="bg-gradient-to-r from-pink-500/80 to-rose-500/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center hover:from-pink-600/80 hover:to-rose-600/80 transition-all duration-300 cursor-pointer border border-pink-300/30"
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-400 to-rose-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base">
                    Send a Tip
                  </p>
                  <p className="text-xs text-pink-100">Show your support</p>
                </div>
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-pink-200 flex-shrink-0" />
              </div>
            </motion.div>

            {/* Custom Links */}
            {bio.links &&
              bio.links
                .filter((link: any) => link.isActive)
                .map((link: any, index: number) => (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="block"
                  >
                    <div className="bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center hover:from-white/20 hover:to-white/10 transition-all duration-300 border border-white/20">
                      <div className="flex items-center justify-center space-x-3">
                        <Globe className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span className="font-medium text-sm sm:text-base flex-1 min-w-0 truncate">
                          {link.title}
                        </span>
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
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
            <p className="text-purple-100 text-xs sm:text-sm">
              Powered by Selar Onchain ⚡
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Tip Modal */}
      <Dialog open={tipModalOpen} onOpenChange={setTipModalOpen}>
        <DialogContent className="sm:max-w-[450px] mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center text-lg sm:text-xl">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mr-3">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
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
                    className="h-10 sm:h-12 text-sm"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
