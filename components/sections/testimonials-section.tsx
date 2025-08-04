"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  Quote,
  TrendingUp,
  DollarSign,
  Users,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

const allTestimonials = [
  // Renamed to avoid conflict with the sliced array
  {
    name: "Sarah Chen",
    role: "Digital Artist",
    company: "Independent Creator",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "Vendio transformed my art business. I've made $15K in just 3 months selling digital art with crypto payments. The setup was incredibly smooth!",
    rating: 5,
    stats: { revenue: "$15K", sales: "127", timeframe: "3 months" },
    verified: true,
    featured: true,
  },
  {
    name: "Marcus Johnson",
    role: "Course Creator",
    company: "TechEdu Pro",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "Finally, a platform that understands the future of payments. My students love paying with crypto, and I love the instant settlements. Game changer!",
    rating: 5,
    stats: { revenue: "$32K", sales: "89", timeframe: "6 months" },
    verified: true,
    featured: false,
  },
  {
    name: "Elena Rodriguez",
    role: "Software Developer",
    company: "DevTools Inc",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "The onchain approach gives me confidence that my payments are secure and transparent. Built my entire SaaS business on this platform.",
    rating: 5,
    stats: { revenue: "$48K", sales: "234", timeframe: "8 months" },
    verified: true,
    featured: true,
  },
  {
    name: "David Kim",
    role: "Music Producer",
    company: "Beat Factory",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "Selling beats and samples has never been easier. The global reach is incredible - customers from 40+ countries!",
    rating: 5,
    stats: { revenue: "$22K", sales: "156", timeframe: "4 months" },
    verified: true,
    featured: false,
  },
  {
    name: "Priya Patel",
    role: "UX Designer",
    company: "Design Studio",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "The link-in-bio feature is perfect for showcasing my design portfolio and selling templates. Clean, professional, and converts amazingly well.",
    rating: 5,
    stats: { revenue: "$18K", sales: "93", timeframe: "5 months" },
    verified: true,
    featured: false,
  },
  {
    name: "Alex Thompson",
    role: "Content Creator",
    company: "Creator Economy",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "The tip feature alone has generated $5K in additional revenue. My community loves supporting me directly with crypto!",
    rating: 5,
    stats: { revenue: "$28K", sales: "178", timeframe: "7 months" },
    verified: true,
    featured: true,
  },
];

// Use only the first 3 testimonials for display
const testimonials = allTestimonials.slice(0, 3);

export function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-slide functionality for mobile
  useEffect(() => {
    if (!isMobile) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isMobile]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section
      id="testimonials"
      className="py-24 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20"
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
                <Users className="w-4 h-4 mr-2" />
                Creator Success Stories
              </Badge>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                Loved by creators
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  worldwide
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Join thousands of creators who are building successful
                businesses with onchain payments
              </p>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                $2.5M+
              </div>
              <div className="text-sm text-muted-foreground">
                Creator Earnings
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">
                Active Creators
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">Products Sold</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                190+
              </div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
          </motion.div>

          {/* Desktop Grid / Mobile Slider */}
          <div className="relative">
            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-8">
              {" "}
              {/* Changed to md:grid-cols-3 */}
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  // Removed conditional class for featured testimonials to ensure equal length
                >
                  <TestimonialCard testimonial={testimonial} />
                </motion.div>
              ))}
            </div>

            {/* Mobile Slider */}
            <div className="md:hidden">
              <div className="relative overflow-hidden">
                <motion.div
                  className="flex"
                  animate={{ x: `-${currentSlide * 100}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={testimonial.name}
                      className="w-full flex-shrink-0 px-2"
                    >
                      <TestimonialCard testimonial={testimonial} />
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevSlide}
                  className="h-10 w-10 rounded-full bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Dots Indicator */}
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "bg-purple-600 w-6"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextSlide}
                  className="h-10 w-10 rounded-full bg-transparent"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <motion.div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-1 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${
                      ((currentSlide + 1) / testimonials.length) * 100
                    }%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
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
              <span>Join 10,000+ successful creators</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Testimonial Card Component
function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof allTestimonials)[0]; // Changed type to allTestimonials to match original
}) {
  return (
    <Card
      className={`h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm ${
        testimonial.featured
          ? "ring-2 ring-purple-200 dark:ring-purple-800"
          : ""
      }`}
    >
      <CardContent className="p-6">
        <div className="space-y-6 flex flex-col h-full">
          {" "}
          {/* Added flex-col and h-full */}
          {/* Quote Icon */}
          <div className="flex items-start justify-between">
            <Quote className="w-8 h-8 text-purple-400 opacity-60" />
            {testimonial.featured && (
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                Featured
              </Badge>
            )}
          </div>
          {/* Rating */}
          <div className="flex items-center space-x-1">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          {/* Content */}
          <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed flex-grow">
            {" "}
            {/* Added flex-grow */}"{testimonial.content}"
          </blockquote>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg mt-auto">
            {" "}
            {/* Added mt-auto */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <DollarSign className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-sm font-semibold">
                {testimonial.stats.revenue}
              </div>
              <div className="text-xs text-muted-foreground">Revenue</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-sm font-semibold">
                {testimonial.stats.sales}
              </div>
              <div className="text-xs text-muted-foreground">Sales</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Zap className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-sm font-semibold">
                {testimonial.stats.timeframe}
              </div>
              <div className="text-xs text-muted-foreground">Time</div>
            </div>
          </div>
          {/* Author */}
          <div className="flex items-center space-x-4 mt-4">
            {" "}
            {/* Added mt-4 */}
            <Avatar className="w-12 h-12">
              <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {testimonial.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <p className="font-semibold">{testimonial.name}</p>
                {testimonial.verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {testimonial.role}
              </p>
              <p className="text-xs text-muted-foreground">
                {testimonial.company}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
