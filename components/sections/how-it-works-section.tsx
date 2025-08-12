"use client";

import { motion } from "framer-motion";
import { UserPlus, Store, CreditCard, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up & Connect",
    description:
      "Create your account and connect your crypto wallet in seconds. No complex setup required.",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    icon: Store,
    title: "Create Your Store",
    description:
      "Add your products, courses, or services. Upload files, set prices, and customize your storefront.",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    icon: CreditCard,
    title: "Start Selling",
    description:
      "Share your store link, payment links, or link-in-bio. Accept crypto payments instantly from anywhere.",
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    icon: TrendingUp,
    title: "Scale & Grow",
    description:
      "Track your performance, engage with customers, and grow your business with powerful analytics.",
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
];

export function HowItWorksSection() {
  return (
    <section
      className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
      id="howitworks"
    >
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            How It{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get started in minutes and begin monetizing your skills with crypto
            payments. It's simple, fast, and powerful.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600 z-0" />
              )}

              <div className="relative z-10 text-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>

                {/* Icon */}
                <div
                  className={`w-16 h-16 mx-auto mb-6 rounded-2xl ${step.bgColor} flex items-center justify-center mt-4`}
                >
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              ⚡ Get started in under 5 minutes
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
