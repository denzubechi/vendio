"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAccount, useConnect } from "wagmi";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import logo from "@/public/vendio.png";
import coinbaseLogo from "@/public/wallet/coinbase.svg";
import metamaskLogo from "@/public/wallet/metamask.svg";
import { sdk } from "@farcaster/miniapp-sdk"; // Import the mini-app SDK

const walletOptions = [
  {
    id: "coinbaseWallet",
    name: "Coinbase Wallet",
    icon: coinbaseLogo,
  },
  {
    id: "metaMask",
    name: "MetaMask",
    icon: metamaskLogo,
  },
];

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
  });
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFarcaster, setIsFarcaster] = useState(false);
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { connect, connectors } = useConnect();

  useEffect(() => {
    const checkFarcaster = async () => {
      const isMiniApp = await sdk.isInMiniApp();
      setIsFarcaster(isMiniApp);
    };
    checkFarcaster();
  }, []);

  useEffect(() => {
    // If connected, move to the next step
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

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          walletAddress: address,
          // You may also want to send the Farcaster FID if available
          // fid: isFarcaster ? (await sdk.context.user.fid) : null,
        }),
      });

      if (response.ok) {
        toast.success("Account created successfully!");
        window.location.href = "/auth/signin";
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to create account");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const farcasterConnector = connectors.find((c) => c.id === "farcaster");

  // New useEffect to handle automatic Farcaster connection
  useEffect(() => {
    if (isFarcaster && farcasterConnector && !isConnected) {
      connect({ connector: farcasterConnector });
    }
  }, [isFarcaster, farcasterConnector, isConnected, connect]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 relative mx-auto mb-4">
            <Image
              src={logo || "/placeholder.svg"}
              alt="Vendio Logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Create Account
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Join Vendio to start selling
          </p>
        </div>

        <Card className="border border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 1
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                  }`}
                >
                  {step > 1 ? <CheckCircle className="w-4 h-4" /> : "1"}
                </div>
                <div
                  className={`w-8 h-0.5 ${
                    step >= 2
                      ? "bg-slate-900 dark:bg-white"
                      : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 2
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                  }`}
                >
                  2
                </div>
              </div>
            </div>

            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium mb-2">Connect Wallet</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Choose your wallet to continue
                  </p>
                </div>

                {/* Conditionally render wallet options */}
                {isFarcaster && isConnected ? (
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800 mb-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700 dark:text-green-300">
                        Farcaster Wallet Connected
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {walletOptions.map((wallet) => (
                      <button
                        key={wallet.id}
                        onClick={() => handleWalletConnect(wallet.id)}
                        disabled={selectedWallet === wallet.id}
                        className="w-full p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors disabled:opacity-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center p-2">
                            <Image
                              src={wallet.icon || "/placeholder.svg"}
                              alt={`${wallet.name} logo`}
                              width={24}
                              height={24}
                              className="w-6 h-6"
                            />
                          </div>
                          <span className="font-medium">{wallet.name}</span>
                          <ArrowRight className="w-4 h-4 text-slate-400 ml-auto" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium mb-2">Complete Profile</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Fill in your details
                  </p>
                </div>

                {isConnected && (
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800 mb-6">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700 dark:text-green-300">
                        Wallet Connected
                      </span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Your name"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="your@email.com"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      placeholder="username"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            )}

            <div className="text-center text-sm mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-slate-900 dark:text-white hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
