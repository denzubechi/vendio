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
    description: "Only pay when you sell - 2.9% per transaction",
    highlight: "Save $300+/year",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Zap,
    title: "Instant crypto payments",
    description: "Get paid in USDC with instant blockchain settlements",
    highlight: "< 3 seconds",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "Built-in wallet creation",
    description: "Customers can create wallets seamlessly during checkout",
    highlight: "Zero friction",
    color: "from-purple-500 to-violet-500",
  },
  {
    icon: TrendingUp,
    title: "Mobile-responsive storefronts",
    description: "Beautiful stores that work perfectly on all devices",
    highlight: "80% mobile traffic",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Sparkles,
    title: "Real-time payment tracking",
    description: "Monitor all transactions with detailed analytics",
    highlight: "Live updates",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: CheckCircle,
    title: "Decentralized and secure",
    description: "Built on Base blockchain for maximum security",
    highlight: "Bank-level security",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: TrendingUp,
    title: "Global accessibility",
    description: "Sell to customers in 190+ countries worldwide",
    highlight: "No borders",
    color: "from-teal-500 to-green-500",
  },
  {
    icon: Zap,
    title: "No coding required",
    description: "Build professional stores with our drag-and-drop builder",
    highlight: "5min setup",
    color: "from-yellow-500 to-orange-500",
  },
];

export function BenefitsSection() {
  return (
    <section
      id="benefits"
      className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-gray-900 dark:to-blue-950/30"
    >
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
                    className="flex items-start space-x-4 p-4 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-300"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-r ${benefit.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <benefit.icon className="w-5 h-5 text-white" />
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

            {/* Right Content - Benefits Grid */}
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
                    <Card className="h-full overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-r ${benefit.color} flex items-center justify-center`}
                          >
                            <benefit.icon className="w-6 h-6 text-white" />
                          </div>

                          <Badge
                            className={`bg-gradient-to-r ${benefit.color} text-white border-0`}
                          >
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
                className="absolute -top-4 -right-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4 w-48"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Success Rate
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600">94.7%</div>
                <div className="text-xs text-gray-500">
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
