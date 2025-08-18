"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAccount, useConnect } from "wagmi";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle } from "lucide-react";
import logo from "@/public/vendio.png";
import coinbaseLogo from "@/public/wallet/coinbase.svg";
import metamaskLogo from "@/public/wallet/metamask.svg";
import { sdk } from "@farcaster/miniapp-sdk"; // 👈 Import the Farcaster mini-app SDK

const walletOptions = [
  {
    id: "coinbaseWallet",
    name: "Coinbase Wallet",
    description: "Connect with Coinbase Wallet",
    icon: coinbaseLogo,
    popular: true,
  },
  {
    id: "metaMask",
    name: "MetaMask",
    description: "Connect with MetaMask",
    icon: metamaskLogo,
    popular: false,
  },
];

export default function SignInPage() {
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { connect, connectors } = useConnect();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isFarcaster, setIsFarcaster] = useState(false); // 👈 New state to track Farcaster env

  // 👈 Effect to detect Farcaster environment and trigger auto-connect
  useEffect(() => {
    const checkFarcaster = async () => {
      const isMiniApp = await sdk.isInMiniApp();
      setIsFarcaster(isMiniApp);

      if (isMiniApp && !isConnected) {
        const farcasterConnector = connectors.find(
          (c) => c.id === "farcasterMiniApp"
        );
        if (farcasterConnector) {
          connect({ connector: farcasterConnector });
        }
      }
    };
    checkFarcaster();
  }, [connect, connectors, isConnected]);

  const handleWalletConnect = async (walletId: string) => {
    setSelectedWallet(walletId);
    const connector = connectors.find(
      (c) =>
        c.name.toLowerCase().includes(walletId.toLowerCase()) ||
        (walletId === "coinbaseWallet" &&
          c.name.toLowerCase().includes("coinbase")) ||
        (walletId === "walletConnect" &&
          c.name.toLowerCase().includes("walletconnect"))
    );

    if (connector) {
      try {
        await connect({ connector });
      } catch (error) {
        toast.error("Failed to connect wallet");
        setSelectedWallet(null);
      }
    }
  };

  const handleSignIn = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: address,
        }),
      });

      if (response.ok) {
        toast.success("Welcome back!");
        router.push("/dashboard");
      } else {
        const error = await response.json();
        toast.error(error.message || "Sign in failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isFarcasterConnected = isConnected && isFarcaster;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 relative">
              <Image
                src={logo || "/placeholder.svg"}
                alt="Vendio Logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Vendio
            </h1>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Welcome back
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Connect your wallet to continue
          </p>
        </div>

        <Card className="border border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {/* 👈 Conditionally render based on connection status and environment */}
              {!isFarcasterConnected && !isConnected ? (
                <motion.div
                  key="connect"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {walletOptions.map((wallet) => (
                    <motion.button
                      key={wallet.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleWalletConnect(wallet.id)}
                      disabled={selectedWallet === wallet.id}
                      className="w-full p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors disabled:opacity-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 relative">
                          {selectedWallet === wallet.id ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-600"></div>
                          ) : (
                            <Image
                              src={wallet.icon || "/placeholder.svg"}
                              alt={`${wallet.name} icon`}
                              fill
                              style={{ objectFit: "contain" }}
                            />
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-slate-900 dark:text-white">
                            {wallet.name}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {wallet.description}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      Wallet Connected
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                  </div>

                  <Button
                    onClick={handleSignIn}
                    disabled={loading}
                    className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white dark:border-slate-900 border-t-transparent"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <>
                        Continue to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-center text-sm mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">
                Don't have an account?{" "}
              </span>
              <Link
                href="/auth/signup"
                className="text-slate-900 dark:text-white font-medium hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
