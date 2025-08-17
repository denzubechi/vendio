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
import {
  ExternalLink,
  ShoppingBag,
  Heart,
  Globe,
  Github,
  Twitter,
  Sparkles,
  Instagram,
  Linkedin,
  Wallet,
  Zap,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";
import { createBaseAccountSDK, pay } from "@base-org/account";
import {
  SignInWithBaseButton,
  BasePayButton,
} from "@base-org/account-ui/react";
import logo from "@/public/vendio.png";
import { useAccount } from "wagmi";

import Image from "next/image";
interface LinkInBioLink {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
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
  const { address, isConnected } = useAccount();
  const [isSignedIn, setIsSignedIn] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <div className="container max-w-md sm:max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 2xl:gap-16">
          {/* Main Profile Card */}
          <div className="lg:col-span-4 xl:col-span-3 2xl:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden sticky top-6 animate-in slide-in-from-bottom duration-700">
              <div className="relative p-8 text-center bg-gradient-to-br from-purple-50 via-white to-blue-50 border-b border-slate-100/50">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-blue-100/20" />

                <div className="relative mb-6 animate-in zoom-in duration-500 delay-100">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 mx-auto flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white/50">
                    {bio.avatar ? (
                      <img
                        src={bio.avatar || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-slate-600">
                        {bio.title.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="animate-in slide-in-from-bottom duration-500 delay-200">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                    {bio.title}
                  </h1>
                  {bio.description && (
                    <p className="text-slate-600 text-base leading-relaxed mb-6 max-w-sm mx-auto">
                      {bio.description}
                    </p>
                  )}
                </div>

                {bio.socialUrls &&
                  Object.values(bio.socialUrls).some((url) => url) && (
                    <div className="flex justify-center gap-3 animate-in slide-in-from-bottom duration-500 delay-300">
                      {Object.entries(bio.socialUrls).map(([platform, url]) => {
                        if (!url) return null;
                        const IconComponent = getSocialIcon(platform);
                        return (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white hover:shadow-lg transition-all duration-200 border border-slate-200/50 hover:scale-110 hover:-translate-y-1"
                          >
                            <IconComponent className="w-5 h-5 text-slate-700" />
                          </a>
                        );
                      })}
                    </div>
                  )}
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-3 animate-in slide-in-from-bottom duration-500 delay-400">
                  {store && (
                    <Link href={`/store/${store.slug}`}>
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-5 hover:from-purple-100 hover:to-blue-100 transition-all duration-300 cursor-pointer border border-purple-200/50 shadow-sm hover:shadow-md hover:scale-[1.02] hover:-translate-y-1">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <ShoppingBag className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 text-base">
                              Visit My Store
                            </p>
                            <p className="text-sm text-slate-600">
                              Browse all my products
                            </p>
                          </div>
                          <ExternalLink className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        </div>
                      </div>
                    </Link>
                  )}

                  <div
                    onClick={() => setTipModalOpen(true)}
                    className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-5 hover:from-pink-100 hover:to-purple-100 transition-all duration-300 cursor-pointer border border-pink-200/50 shadow-sm hover:shadow-md hover:scale-[1.02] hover:-translate-y-1"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-base">
                          Send a Tip
                        </p>
                        <p className="text-sm text-slate-600">
                          Show your support
                        </p>
                      </div>
                      <Zap className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Links and Projects Section */}
          <div className="lg:col-span-8 xl:col-span-9 2xl:col-span-9 space-y-8">
            {bio.links &&
              bio.links.filter((link: any) => link.isActive).length > 0 && (
                <div className="space-y-5 animate-in slide-in-from-bottom duration-500 delay-500">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 px-2">
                    Quick Links
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {bio.links
                      .filter((link: any) => link.isActive)
                      .map((link: any, index: number) => (
                        <Link
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group animate-in slide-in-from-bottom duration-500"
                          style={{ animationDelay: `${600 + index * 100}ms` }}
                        >
                          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 hover:bg-white transition-all duration-300 border border-slate-200/50 shadow-sm hover:shadow-lg group-hover:border-slate-300/50 hover:scale-[1.02] hover:-translate-y-1">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-slate-200 group-hover:to-slate-300 transition-all duration-300">
                                <Globe className="w-6 h-6 text-slate-600" />
                              </div>
                              <span className="font-semibold text-slate-900 text-base flex-1 min-w-0 truncate group-hover:text-slate-700 transition-colors">
                                {link.title}
                              </span>
                              <ExternalLink className="w-5 h-5 text-slate-400 flex-shrink-0 group-hover:text-slate-600 transition-colors" />
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
              )}

            {bio.projects && bio.projects.length > 0 && (
              <div className="space-y-5 animate-in slide-in-from-bottom duration-500 delay-700">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 px-2">
                  Featured Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {bio.projects
                    .slice(0, 6)
                    .map((project: any, index: number) => (
                      <div
                        key={project.id}
                        className="group animate-in slide-in-from-bottom duration-500"
                        style={{ animationDelay: `${800 + index * 100}ms` }}
                      >
                        <Link
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Card className="border-slate-200/50 hover:border-slate-300/50 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm hover:shadow-lg overflow-hidden hover:scale-[1.02] hover:-translate-y-1 h-full">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                {project.image && (
                                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-200">
                                    <img
                                      src={project.image || "/placeholder.svg"}
                                      alt={project.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-slate-900 text-lg mb-2 truncate group-hover:text-slate-700 transition-colors">
                                    {project.title}
                                  </h3>
                                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                                    {project.description}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="fixed bottom-4 left-4 z-50"
      >
        <Link href="https://tryvendio.vercel.app">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200/50 px-3 py-2">
            <div className="flex items-center space-x-2">
              <span>Powered by </span>
              <div className="flex items-center space-x-1">
                <Image
                  src={logo || "/placeholder.svg"}
                  alt="Vendio"
                  className="w-4 h-4 object-contain"
                />
                <span className="text-slate-800 font-bold">Vendio</span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      <Dialog open={tipModalOpen} onOpenChange={setTipModalOpen}>
        <DialogContent className="sm:max-w-lg mx-4 bg-white/95 backdrop-blur-md border-white/20 rounded-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader className="pb-6">
            <DialogTitle className="flex items-center text-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              Send a Tip to {bio.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700">
                Quick Amount (USD)
              </Label>
              <div className="grid grid-cols-4 gap-3">
                {["5", "10", "25", "50"].map((amount) => (
                  <Button
                    key={amount}
                    variant={tipAmount === amount ? "default" : "outline"}
                    onClick={() => setTipAmount(amount)}
                    className="h-12 text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105"
                    size="sm"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="tip-amount"
                className="text-sm font-semibold text-slate-700"
              >
                Custom Amount (USD)
              </Label>
              <Input
                id="tip-amount"
                type="number"
                step="0.01"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value)}
                placeholder="Enter amount"
                className="h-12 rounded-xl border-slate-200 focus:border-purple-300 focus:ring-purple-200 transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label
                  htmlFor="tipper-name"
                  className="text-sm font-semibold text-slate-700"
                >
                  Your Name *
                </Label>
                <Input
                  id="tipper-name"
                  value={tipperName}
                  onChange={(e) => setTipperName(e.target.value)}
                  placeholder="Your name"
                  className="h-12 rounded-xl border-slate-200 focus:border-purple-300 focus:ring-purple-200 transition-all duration-200"
                />
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="tipper-email"
                  className="text-sm font-semibold text-slate-700"
                >
                  Your Email *
                </Label>
                <Input
                  id="tipper-email"
                  type="email"
                  value={tipperEmail}
                  onChange={(e) => setTipperEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="h-12 rounded-xl border-slate-200 focus:border-purple-300 focus:ring-purple-200 transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="tip-message"
                className="text-sm font-semibold text-slate-700"
              >
                Message (Optional)
              </Label>
              <Textarea
                id="tip-message"
                value={tipMessage}
                onChange={(e) => setTipMessage(e.target.value)}
                placeholder="Say something nice..."
                rows={3}
                className="rounded-xl border-slate-200 focus:border-purple-300 focus:ring-purple-200 resize-none transition-all duration-200"
              />
            </div>

            <div className="space-y-4 pt-2">
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
                  <BasePayButton colorScheme="light" onClick={handleTip} />
                </div>
              )}
              <div className="flex items-center justify-center space-x-6 text-xs text-slate-500">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Instant</span>
                </div>
                <div className="flex items-center space-x-2">
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
