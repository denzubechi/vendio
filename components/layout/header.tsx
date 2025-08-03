"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-xl">Selar</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => scrollToSection("features")}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            How it Works
          </button>
          <button
            onClick={() => scrollToSection("benefits")}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Benefits
          </button>
          <button
            onClick={() => scrollToSection("testimonials")}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Reviews
          </button>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <Link href="/auth/signin">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
              Start Selling
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden border-t bg-background"
        >
          <nav className="container mx-auto py-4 space-y-4 px-4">
            <button
              onClick={() => scrollToSection("features")}
              className="block text-sm font-medium hover:text-primary transition-colors w-full text-left"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="block text-sm font-medium hover:text-primary transition-colors w-full text-left"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection("benefits")}
              className="block text-sm font-medium hover:text-primary transition-colors w-full text-left"
            >
              Benefits
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="block text-sm font-medium hover:text-primary transition-colors w-full text-left"
            >
              Reviews
            </button>
            <div className="pt-4 space-y-2">
              <Link href="/auth/signin" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup" className="block">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  Start Selling
                </Button>
              </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
