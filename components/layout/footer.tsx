"use client";

import logo from "@/public/logo.png";
import { motion } from "framer-motion";
import Image from "next/image";
export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            {/* Logo */}
            <div className="flex items-center justify-center space-x-2">
              <div className="h-8 w-8 relative">
                <Image
                  src={logo}
                  alt="Vendio Logo"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
              <span className="font-bold text-xl">Vendio</span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground max-w-md mx-auto">
              The future of e-commerce is onchain. Start selling your digital
              products with crypto payments today.
            </p>

            {/* Links */}
            <div className="flex items-center justify-center space-x-8 text-sm">
              <button
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                How it Works
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("benefits")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Benefits
              </button>
              {/* <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link> */}
            </div>

            {/* Copyright */}
            <div className="pt-8 border-t">
              <p className="text-muted-foreground text-sm">
                &copy; 2025 Vendio. All rights reserved. Built with ❤️.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
