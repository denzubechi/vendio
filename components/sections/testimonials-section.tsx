"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, TrendingUp, DollarSign, Users, Zap } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Digital Artist",
    company: "Independent Creator",
    avatar:
      "https://res.cloudinary.com/dqny2b4gb/image/upload/v1729123752/47f40d1d-e9f7-4c26-bb74-d9361bd3934a_frohxv.jpg",
    content:
      "Selar Onchain transformed my art business. I've made $15K in just 3 months selling digital art with crypto payments. The setup was incredibly smooth!",
    rating: 5,
    stats: { revenue: "$15K", sales: "127", timeframe: "3 months" },
    verified: true,
    featured: true,
  },
  {
    name: "Marcus Johnson",
    role: "Course Creator",
    company: "TechEdu Pro",
    avatar:
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?cs=srgb&dl=pexels-vinicius-wiesehofer-289347-1130626.jpg&fm=jpg",
    content:
      "Finally, a platform that understands the future of payments. My students love paying with crypto, and I love the instant settlements. Game changer!",
    rating: 5,
    stats: { revenue: "$32K", sales: "89", timeframe: "6 months" },
    verified: true,
    featured: true,
  },
  {
    name: "Elena Rodriguez",
    role: "Software Developer",
    company: "DevTools Inc",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?cs=srgb&dl=pexels-italo-melo-881954-2379004.jpg&fm=jpg",
    content:
      "The onchain approach gives me confidence that my payments are secure and transparent. Built my entire SaaS business on this platform.",
    rating: 5,
    stats: { revenue: "$48K", sales: "234", timeframe: "8 months" },
    verified: true,
    featured: true,
  },
];

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="py-24 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="col-span-1"
              >
                <Card
                  className={`h-full overflow-hidden border-0 shadow-sm  transition-all duration-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm ${
                    testimonial.featured
                      ? "ring-2 ring-purple-200 dark:ring-purple-800"
                      : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-start justify-between">
                        <Quote className="w-8 h-8 text-purple-400 opacity-60" />
                        {testimonial.featured && (
                          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                            Featured
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>

                      <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        "{testimonial.content}"
                      </blockquote>

                      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <DollarSign className="w-4 h-4 text-green-500" />
                          </div>
                          <div className="text-sm font-semibold">
                            {testimonial.stats.revenue}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Revenue
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                          </div>
                          <div className="text-sm font-semibold">
                            {testimonial.stats.sales}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Sales
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Zap className="w-4 h-4 text-purple-500" />
                          </div>
                          <div className="text-sm font-semibold">
                            {testimonial.stats.timeframe}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Time
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={testimonial.avatar || "/placeholder.svg"}
                          />
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
              </motion.div>
            ))}
          </div>

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
