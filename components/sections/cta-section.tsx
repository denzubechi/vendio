"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-blue-700">
              <CardContent className="p-12 text-center text-white relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />

                {/* Floating Elements */}
                <div className="absolute top-8 left-8 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse" />
                <div className="absolute bottom-8 right-8 w-20 h-20 bg-blue-300/20 rounded-full blur-xl animate-pulse delay-1000" />

                <div className="relative z-10 space-y-8">
                  {/* Header */}
                  <div className="space-y-4">
                    {/* <div className="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Ready to start your journey?
                    </div> */}
                    <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                      Ready to start selling onchain?
                    </h2>
                    <p className="text-xl text-purple-100 max-w-2xl mx-auto">
                      Join thousands of creators who are already building their
                      digital empire with Vendio.
                    </p>
                  </div>

                  {/* Features */}
                  {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                    <div className="flex items-center justify-center space-x-2 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                      <Zap className="w-5 h-5" />
                      <span className="text-sm font-medium">5min setup</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                      <Shield className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        Secure payments
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                      <ArrowRight className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        Instant payouts
                      </span>
                    </div>
                  </div> */}

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/auth/signup">
                      <Button
                        size="lg"
                        className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold w-full sm:w-auto"
                      >
                        Start Selling Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="#how-it-works">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent w-full sm:w-auto"
                      >
                        Learn How It Works
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
