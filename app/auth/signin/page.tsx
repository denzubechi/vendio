"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAccount, useConnect } from "wagmi";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wallet, ArrowRight } from "lucide-react";

export default function SignInPage() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleWalletSignIn = async () => {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Connect your wallet to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isConnected ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Connect your wallet to sign in
                </p>
                <div className="space-y-3">
                  {connectors.map((connector) => (
                    <Button
                      key={connector.id}
                      variant="outline"
                      onClick={() => connect({ connector })}
                      className="w-full h-12 text-left justify-start"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-xs">
                          {connector.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      Connect with {connector.name}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      Wallet Connected
                    </span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                </div>

                <Button
                  onClick={handleWalletSignIn}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-primary hover:underline font-medium"
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
