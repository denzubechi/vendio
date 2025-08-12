"use client"

import { motion } from "framer-motion"
import { Store, Link2, Heart, GraduationCap, CreditCard, Zap, Shield, Globe, TrendingUp, Wallet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const creatorTools = [
  {
    icon: Link2,
    title: "Link in Bio",
    description:
      "Showcase your work, services, and personality in one beautiful, customizable page that converts visitors into supporters.",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    icon: Heart,
    title: "Global Tips",
    description: "Receive tips from anyone, anywhere in the world with instant crypto payments. No borders, no limits.",
    color: "text-pink-500",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
  },
  {
    icon: GraduationCap,
    title: "Course Creation",
    description:
      "Monetize your knowledge by creating and selling courses with seamless crypto payments and instant delivery.",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
]

const businessTools = [
  {
    icon: Store,
    title: "Smart Storefront",
    description:
      "Create a professional store that turns visitors into customers with optimized checkout flows and instant payments.",
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    icon: CreditCard,
    title: "Payment Links",
    description:
      "Generate unique payment links for any product and get paid instantly. Perfect for social media and direct sales.",
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    icon: TrendingUp,
    title: "Analytics Dashboard",
    description: "Track your performance with detailed analytics on sales, customers, and revenue growth.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
  },
]

const web3Features = [
  {
    icon: Zap,
    title: "Instant Settlements",
    description: "Get paid instantly with crypto. No waiting for bank transfers or payment processors.",
    color: "text-yellow-500",
  },
  {
    icon: Shield,
    title: "Secure & Transparent",
    description: "All transactions are secured by blockchain technology with full transparency.",
    color: "text-red-500",
  },
  {
    icon: Globe,
    title: "Global by Default",
    description: "Accept payments from anywhere in the world without currency conversion fees.",
    color: "text-blue-500",
  },
  {
    icon: Wallet,
    title: "Your Keys, Your Crypto",
    description: "Maintain full control of your funds with non-custodial wallet integration.",
    color: "text-green-500",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Succeed</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            From creator tools to business solutions, Vendio provides everything you need to monetize your skills and
            grow your audience in the Web3 economy.
          </p>
        </motion.div>

        {/* Creator Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Creator Tools</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">Build your brand and connect with your audience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {creatorTools.map((tool, index) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${tool.bgColor} flex items-center justify-center mb-4`}>
                      <tool.icon className={`w-6 h-6 ${tool.color}`} />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{tool.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Business Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Business Tools</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">Scale your business with professional tools</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {businessTools.map((tool, index) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${tool.bgColor} flex items-center justify-center mb-4`}>
                      <tool.icon className={`w-6 h-6 ${tool.color}`} />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{tool.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Web3 Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Web3 Native</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">Built for the future of digital commerce</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {web3Features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center">
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
