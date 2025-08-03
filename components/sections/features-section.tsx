"use client";

import { motion } from "framer-motion";
import {
  Wallet,
  ShoppingBag,
  LinkIcon,
  Shield,
  Zap,
  Globe,
  Smartphone,
  BarChart3,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Wallet,
    title: "Crypto Payments",
    description:
      "Accept USDC payments directly with seamless Base Pay integration",
    color: "from-purple-500 to-purple-600",
    stats: "99.9% uptime",
    image: "/placeholder.svg?height=300&width=400&text=Crypto+Payments",
  },
  {
    icon: ShoppingBag,
    title: "Digital Storefronts",
    description: "Create beautiful, responsive stores without writing any code",
    color: "from-blue-500 to-blue-600",
    stats: "5min setup",
    image: "/placeholder.svg?height=300&width=400&text=Digital+Store",
  },
  {
    icon: LinkIcon,
    title: "Link in Bio",
    description:
      "Showcase all your offerings in one customizable, mobile-optimized page",
    color: "from-green-500 to-green-600",
    stats: "1-click share",
    image: "/placeholder.svg?height=300&width=400&text=Link+in+Bio",
  },
  {
    icon: Shield,
    title: "Secure & Decentralized",
    description:
      "Built on Base blockchain for maximum security and transparency",
    color: "from-red-500 to-red-600",
    stats: "Bank-level security",
    image: "/placeholder.svg?height=300&width=400&text=Blockchain+Security",
  },
  {
    icon: Zap,
    title: "Instant Settlements",
    description:
      "Get paid instantly with blockchain transactions, no waiting periods",
    color: "from-yellow-500 to-yellow-600",
    stats: "<3sec confirmation",
    image: "/placeholder.svg?height=300&width=400&text=Instant+Payments",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Sell to anyone, anywhere in the world with borderless payments",
    color: "from-indigo-500 to-indigo-600",
    stats: "190+ countries",
    image: "/placeholder.svg?height=300&width=400&text=Global+Reach",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24 bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/30"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4 px-4 py-2">
                <Smartphone className="w-4 h-4 mr-2" />
                Powerful Features
              </Badge>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                Everything you need to
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  sell onchain
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Powerful features designed to help creators build, manage, and
                scale their digital businesses with ease
              </p>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  {/* Feature Image */}
                  <div className="relative h-48 overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-90`}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <feature.icon className="w-16 h-16 text-white" />
                    </div>
                    {/* Floating Stats Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                        {feature.stats}
                      </Badge>
                    </div>
                    {/* Animated Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">
                          {feature.title}
                        </h3>
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center`}
                        >
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>

                      {/* Feature Highlights */}
                      <div className="flex items-center space-x-4 pt-2">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-xs text-muted-foreground">
                            Active
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BarChart3 className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Analytics
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Multi-user
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Enjoy All Features!</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
