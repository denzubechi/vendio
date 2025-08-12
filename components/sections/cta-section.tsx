"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 relative overflow-hidden mx-2 rounded-2xl">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

      <div className="container relative z-10 px-4 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 mb-8 text-sm font-medium text-white/90 bg-white/20 backdrop-blur-sm rounded-full border border-white/20"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Join the Web3 Creator Economy
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Ready to Start{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Earning
            </span>{" "}
            with Crypto?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Join thousands of creators and businesses who are already monetizing
            their skills with Vendio. Start your journey today - it's free to
            get started!
          </motion.p>
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                $0
              </div>
              <div className="text-white/80">Setup Cost</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                5min
              </div>
              <div className="text-white/80">To Get Started</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                24/7
              </div>
              <div className="text-white/80">Global Payments</div>
            </div>
          </motion.div> */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Start Your Store Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 pt-8 border-t border-white/20"
          >
            <p className="text-white/70 text-sm mb-4">
              Trusted by creators worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 opacity-60">
              <div className="text-white/60 text-sm">🔒 Secure</div>
              <div className="text-white/60 text-sm">⚡ Fast</div>
              <div className="text-white/60 text-sm">🌍 Global</div>
              <div className="text-white/60 text-sm">💎 Web3 Native</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
