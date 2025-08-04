"use client";

import {
  Monitor,
  BookOpen,
  GraduationCap,
  Ticket,
  Star,
  Package,
} from "lucide-react";

import { motion } from "framer-motion";

const features = [
  {
    icon: Monitor,
    title: "Digital Products",
    description:
      "Sell any and every kind of digital product, from content packs to designs to bundles and more without stress.",
  },
  {
    icon: BookOpen,
    title: "Ebooks",
    description:
      "Vendio is the best platform to sell your ebooks, both downloadable and non-downloadable, in any format.",
  },
  {
    icon: GraduationCap,
    title: "Courses & Memberships",
    description:
      "You can host your courses & membership sites with unlimited videos & files, unlimited storage, and have unlimited students, plus you get content security to prevent theft.",
  },
  {
    icon: Ticket,
    title: "Event Tickets & Training",
    description:
      "Sell tickets for all kinds of events and access to masterclasses, events, workshops, training, webinars, and even more.",
  },
  {
    icon: Star,
    title: "Services",
    description:
      "Sell any kind of service, from coaching services to consultations to counseling sessions to design services and more.",
  },
  {
    icon: Package,
    title: "Physical Goods",
    description:
      "You can also use Vendio to sell your physical products, from clothing to books to electronics and appliances and more.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                Sell Any Kind of Products
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  on Vendio
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Whether digital, physical, or services, Vendio provides the
                tools to manage and sell your creations seamlessly.
              </p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center space-y-4"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Icon */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <feature.icon className="w-12 h-12 text-purple-600" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
