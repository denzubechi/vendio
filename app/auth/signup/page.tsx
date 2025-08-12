"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image"; // Import the Next.js Image component
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAccount, useConnect } from "wagmi";
import { toast } from "sonner";
import Link from "next/link";
import {
  Wallet,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  TrendingUp,
  Crown,
} from "lucide-react";
import logo from "@/public/vendio.png";
const walletOptions = [
  {
    id: "coinbaseWallet",
    name: "Coinbase Wallet",
    description: "Connect with Coinbase Wallet",
    icon: "/wallet-icons/coinbase.svg",
    color: "from-blue-500 to-blue-600",
    popular: true,
  },
  {
    id: "metaMask",
    name: "Trust Wallet",
    description: "Connect with Trust Wallet",
    icon: "/wallet-icons/trust.svg",
    color: "from-blue-600 to-purple-600",
    popular: false,
  },
];

const features = [
  { icon: Shield, text: "Bank-level security", color: "text-green-500" },
  { icon: Zap, text: "Instant payments", color: "text-yellow-500" },
  { icon: Globe, text: "Global reach", color: "text-blue-500" },
  { icon: TrendingUp, text: "Real-time analytics", color: "text-purple-500" },
];

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
  });
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  useEffect(() => {
    if (isConnected && step === 1) {
      setStep(2);
    }
  }, [isConnected, step]);

  const handleWalletConnect = (walletId: string) => {
    setSelectedWallet(walletId);
    const connector = connectors.find(
      (c) =>
        c.name.toLowerCase().includes(walletId.toLowerCase()) ||
        (walletId === "coinbaseWallet" &&
          c.name.toLowerCase().includes("coinbase")) ||
        (walletId === "metaMask" && c.name.toLowerCase().includes("metamask"))
    );

    if (connector) {
      connect({ connector });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          walletAddress: address,
        }),
      });

      if (response.ok) {
        toast.success("Account created successfully! 🎉");
        window.location.href = "/dashboard";
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to create account");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-indigo-200/30 rounded-full blur-2xl animate-pulse delay-2000" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8 hidden lg:block"
            >
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-flex items-center space-x-3 mb-6"
                >
                  <div className="w-12 h-12 relative rounded-2xl bg-transparent flex items-center justify-center shadow-lg">
                    <Image
                      src={logo}
                      alt="Vendio Logo"
                      fill
                      style={{ objectFit: "contain" }}
                      priority
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Vendio
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Creator Economy Platform
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                    Start Your
                    <br />
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Digital Empire
                    </span>
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    Join thousands of creators earning with crypto payments. No
                    monthly fees, just pay when you sell.
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-2 gap-4"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="flex items-center space-x-3 p-4 rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/20"
                  >
                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                    <span className="font-medium text-sm">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="space-y-4"
              >
                <h3 className="font-semibold text-lg">Why choose Vendio?</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-4 rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/20">
                    <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        Instant Crypto Payments
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Get paid instantly in USDC with zero delays
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/20">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mt-0.5">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">No Monthly Fees</p>
                      <p className="text-xs text-muted-foreground">
                        Only pay a small fee when you make a sale
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/20">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mt-0.5">
                      <Globe className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Global Marketplace</p>
                      <p className="text-xs text-muted-foreground">
                        Sell to customers worldwide without restrictions
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex items-center justify-center lg:justify-start space-x-8"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    $2.5M+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Creator Earnings
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">10K+</div>
                  <div className="text-sm text-muted-foreground">
                    Active Creators
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Sign Up Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-md mx-auto"
            >
              <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                          step >= 1
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {step > 1 ? <CheckCircle className="w-4 h-4" /> : "1"}
                      </div>
                      <div
                        className={`w-12 h-0.5 transition-all ${
                          step >= 2 ? "bg-purple-600" : "bg-gray-200"
                        }`}
                      />
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                          step >= 2
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {step > 2 ? <CheckCircle className="w-4 h-4" /> : "2"}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-8">
                          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Wallet className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold mb-2">
                            Connect Your Wallet
                          </h3>
                          <p className="text-muted-foreground">
                            Choose your preferred wallet to get started
                          </p>
                        </div>

                        <div className="space-y-3">
                          {walletOptions.map((wallet) => (
                            <motion.button
                              key={wallet.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleWalletConnect(wallet.id)}
                              disabled={selectedWallet === wallet.id}
                              className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm group disabled:opacity-50"
                            >
                              <div className="flex items-center space-x-4">
                                <div
                                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${wallet.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
                                >
                                  {/* Conditionally render Image or text based on icon type */}
                                  {wallet.icon.startsWith("/") ? (
                                    <Image
                                      src={wallet.icon}
                                      alt={`${wallet.name} icon`}
                                      width={32}
                                      height={32}
                                      className="object-contain"
                                    />
                                  ) : (
                                    <span className="text-white font-bold text-lg">
                                      {wallet.icon}
                                    </span>
                                  )}
                                </div>
                                <div className="flex-1 text-left">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-semibold">
                                      {wallet.name}
                                    </span>
                                    {wallet.popular && (
                                      <Crown className="w-4 h-4 text-yellow-500" />
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {wallet.description}
                                  </p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-600 transition-colors" />
                              </div>
                            </motion.button>
                          ))}
                        </div>

                        <div className="text-center pt-4">
                          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                            <Shield className="w-4 h-4" />
                            <span>Secured by Base blockchain</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-8">
                          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <CheckCircle className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold mb-2">
                            Complete Your Profile
                          </h3>
                          <p className="text-muted-foreground">
                            Tell us about yourself to personalize your
                            experience
                          </p>
                        </div>

                        {isConnected && (
                          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 mb-6">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                Wallet Connected Successfully
                              </span>
                            </div>
                            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                              {address?.slice(0, 6)}...{address?.slice(-4)}
                            </p>
                          </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name: e.target.value,
                                })
                              }
                              placeholder="Enter your full name"
                              className="h-12"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  email: e.target.value,
                                })
                              }
                              placeholder="Enter your email"
                              className="h-12"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="username">Username *</Label>
                            <Input
                              id="username"
                              value={formData.username}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  username: e.target.value,
                                })
                              }
                              placeholder="Choose a unique username"
                              className="h-12"
                              required
                            />
                            <p className="text-xs text-muted-foreground">
                              This will be your store URL:
                              https://tryvendio.vercel.app/store/
                              {formData.username || "username"}
                            </p>
                          </div>

                          <Button
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                          >
                            Create My Account
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="text-center text-sm mt-6 pt-6 border-t">
                    Already have an account?{" "}
                    <Link
                      href="/auth/signin"
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Sign in
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
