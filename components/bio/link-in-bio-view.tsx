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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-slate-400" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mb-2">
            Profile Configuration Required
          </h1>
          <p className="text-slate-600">
            This creator hasn't configured their wallet address yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container max-w-md mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          {/* Profile Section */}
          <div className="p-6 text-center border-b border-slate-100">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative mb-4"
            >
              <div className="w-20 h-20 rounded-full bg-slate-100 mx-auto flex items-center justify-center overflow-hidden">
                {bio.avatar ? (
                  <img
                    src={bio.avatar || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-slate-600">
                    {bio.title.charAt(0)}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-xl font-semibold text-slate-900 mb-1">
                {bio.title}
              </h1>
              {bio.description && (
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
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
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex justify-center gap-2"
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
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
                      >
                        <IconComponent className="w-4 h-4 text-slate-600" />
                      </motion.a>
                    );
                  })}
                </motion.div>
              )}
          </div>

          <div className="p-6 space-y-4">
            {/* Featured Products */}
            {store && store.products.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-3"
              >
                <h2 className="text-sm font-medium text-slate-700 mb-3">
                  Featured Products
                </h2>
                {store.products.slice(0, 2).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  >
                    <Card className="border-slate-200 hover:border-slate-300 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-slate-900 mb-1 text-sm truncate">
                              {product.name}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              ${product.price} {product.currency}
                            </Badge>
                          </div>
                          <Link href={`/store/${store.slug}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs bg-transparent"
                            >
                              View
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Projects Section */}
            {bio.projects && bio.projects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="space-y-3"
              >
                <h2 className="text-sm font-medium text-slate-700 mb-3">
                  Featured Projects
                </h2>
                {bio.projects.slice(0, 3).map((project: any, index: number) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  >
                    <Card className="border-slate-200 hover:border-slate-300 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          {project.image && (
                            <img
                              src={project.image || "/placeholder.svg"}
                              alt={project.title}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-slate-900 text-sm mb-1 truncate">
                              {project.title}
                            </h3>
                            <p className="text-xs text-slate-600 line-clamp-2">
                              {project.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Action Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="space-y-3"
            >
              {/* Store Link */}
              {store && (
                <Link href={`/store/${store.slug}`}>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm">
                          Visit My Store
                        </p>
                        <p className="text-xs text-slate-600">
                          Browse all products
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    </div>
                  </motion.div>
                </Link>
              )}

              {/* Tip Button */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setTipModalOpen(true)}
                className="bg-emerald-50 rounded-xl p-4 hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm">
                      Send a Tip
                    </p>
                    <p className="text-xs text-slate-600">Show your support</p>
                  </div>
                  <Zap className="w-4 h-4 text-emerald-500 flex-shrink-0" />
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
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="block"
                    >
                      <div className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors border border-slate-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Globe className="w-5 h-5 text-slate-600" />
                          </div>
                          <span className="font-medium text-slate-900 text-sm flex-1 min-w-0 truncate">
                            {link.title}
                          </span>
                          <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        </div>
                      </div>
                    </motion.a>
                  ))}
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="px-6 py-4 border-t border-slate-100 text-center"
          >
            <p className="text-slate-500 text-xs">
              Powered by Selar Onchain ⚡
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Tip Modal */}
      <Dialog open={tipModalOpen} onOpenChange={setTipModalOpen}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center text-lg">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                <Heart className="w-4 h-4 text-emerald-600" />
              </div>
              Send a Tip to {bio.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Quick Amount Presets */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Quick Amount (USD)</Label>
              <div className="grid grid-cols-4 gap-2">
                {["5", "10", "25", "50"].map((amount) => (
                  <Button
                    key={amount}
                    variant={tipAmount === amount ? "default" : "outline"}
                    onClick={() => setTipAmount(amount)}
                    className="h-10 text-sm"
                    size="sm"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="space-y-2">
              <Label htmlFor="tip-amount" className="text-sm font-medium">
                Custom Amount (USD)
              </Label>
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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="tipper-name" className="text-sm font-medium">
                  Your Name *
                </Label>
                <Input
                  id="tipper-name"
                  value={tipperName}
                  onChange={(e) => setTipperName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipper-email" className="text-sm font-medium">
                  Your Email *
                </Label>
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
              <Label htmlFor="tip-message" className="text-sm font-medium">
                Message (Optional)
              </Label>
              <Textarea
                id="tip-message"
                value={tipMessage}
                onChange={(e) => setTipMessage(e.target.value)}
                placeholder="Say something nice..."
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <BasePayButton colorScheme="light" onClick={handleTip} />

              <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3" />
                  <span>Instant</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="w-3 h-3" />
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
