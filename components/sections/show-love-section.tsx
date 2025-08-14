"use client";

import { motion } from "framer-motion";
import { Heart, Globe, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ShowLoveSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center rounded-full  bg-purple-100 dark:bg-purple-900 px-4 py-2 text-sm font-medium text-purple-700 dark:text-purple-300   mb-6">
                <Heart className="mr-2 h-4 w-4" />
                Show Love Feature
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                Give your fans an easy way to show love!
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Show Love enables you to easily accept tips and donations from
                your supporters and fans from all over the world.
              </p>
              <Link href="/learn">
                <Button size="lg" variant="outline" className="bg-transparent">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content - Features */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="font-semibold mb-2">Global Reach</h3>
                  <p className="text-sm text-muted-foreground">
                    Accept tips from supporters worldwide
                  </p>
                </div>

                <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="font-semibold mb-2">Instant Payments</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive tips instantly on the blockchain
                  </p>
                </div>

                <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="font-semibold mb-2">Secure & Transparent</h3>
                  <p className="text-sm text-muted-foreground">
                    All transactions on Base blockchain
                  </p>
                </div>

                <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="font-semibold mb-2">Show Appreciation</h3>
                  <p className="text-sm text-muted-foreground">
                    Let fans support your work directly
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Tip Interface Demo */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative flex justify-center"
            >
              <div className="relative max-w-sm w-full">
                <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-8 text-white shadow-2xl border border-slate-700">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-slate-700 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold">JD</span>
                    </div>
                    <h3 className="text-xl font-bold">John Doe</h3>
                    <p className="text-slate-300 mt-1">
                      Digital Creator & Entrepreneur
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="bg-slate-700 rounded-lg p-3 text-center">
                      <span className="font-medium">My Digital Store</span>
                    </div>
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 rounded-lg p-3 text-center cursor-pointer">
                      <div className="flex items-center justify-center space-x-2">
                        <Heart className="w-5 h-5" />
                        <span className="font-medium">Send a Tip</span>
                      </div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-3 text-center">
                      <span className="font-medium">Latest Course</span>
                    </div>
                  </div>

                  <div className="text-center pt-4 border-t border-slate-700">
                    <p className="text-slate-400 text-sm">Powered by Vendio</p>
                  </div>
                </div>

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 w-48"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="w-5 h-5 text-purple-600" />
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      Tip Received!
                    </div>
                  </div>
                  <div className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    +$25 ETH
                  </div>
                  <div className="text-xs text-slate-500">
                    From @supporter123
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1.5,
                  }}
                  className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 w-44"
                >
                  <div className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                    New Supporter
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Emma from Canada
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    "Love your content!"
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
