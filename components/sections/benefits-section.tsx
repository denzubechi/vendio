"use client";

import { motion } from "framer-motion";
import {
  CheckCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const benefits = [
  {
    icon: CheckCircle,
    title: "No monthly fees",
    description: "Only pay when you sell - 1.3% per transaction",
    highlight: "Save $300+/year",
  },
  {
    icon: Zap,
    title: "Instant crypto payments",
    description: "Get paid in USDC with instant blockchain settlements",
    highlight: "< 3 seconds",
  },
  {
    icon: Shield,
    title: "Built-in wallet creation",
    description: "Customers can create wallets seamlessly during checkout",
    highlight: "Zero friction",
  },
  {
    icon: TrendingUp,
    title: "Mobile-responsive storefronts",
    description: "Beautiful stores that work perfectly on all devices",
    highlight: "80% mobile traffic",
  },
  {
    icon: Sparkles,
    title: "Real-time payment tracking",
    description: "Monitor all transactions with detailed analytics",
    highlight: "Live updates",
  },
  {
    icon: CheckCircle,
    title: "Decentralized and secure",
    description: "Built on Base blockchain for maximum security",
    highlight: "Bank-level security",
  },
  {
    icon: TrendingUp,
    title: "Global accessibility",
    description: "Sell to customers in 190+ countries worldwide",
    highlight: "No borders",
  },
  {
    icon: Zap,
    title: "No coding required",
    description: "Build professional stores with our drag-and-drop builder",
    highlight: "5min setup",
  },
];

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <Badge variant="outline" className="mb-4 px-4 py-2">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Why Choose Vendio
                </Badge>
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                  Built for the
                  <br />
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    future of commerce
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Join the revolution of creators who are building sustainable
                  businesses with blockchain technology
                </p>
              </div>

              {/* Key Benefits List */}
              <div className="space-y-4">
                {benefits.slice(0, 4).map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{benefit.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {benefit.highlight}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    Start Building Your Empire
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-6">
                {benefits.slice(4).map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <Card className="h-full overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-500 bg-white dark:bg-slate-900">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                            <benefit.icon className="w-6 h-6 text-purple-600" />
                          </div>

                          <Badge className="bg-gray-200 text-gray-700 border-0">
                            {benefit.highlight}
                          </Badge>

                          <div>
                            <h3 className="font-semibold mb-2">
                              {benefit.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -right-4 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-4 w-48"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    Success Rate
                  </div>
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  94.7%
                </div>
                <div className="text-xs text-muted-foreground">
                  Creators profitable in 30 days
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
