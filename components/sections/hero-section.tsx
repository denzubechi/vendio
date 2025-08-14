// "use client";

// import { Button } from "@/components/ui/button";
// import { ArrowRight, Sparkles, Zap, Globe, Play, Wallet } from "lucide-react";
// import { motion } from "framer-motion";
// import Link from "next/link";

// export function HeroSection() {
//   return (
//     <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/30">
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full blur-3xl" />
//       </div>

//       <div className="container relative z-10 px-4 mx-auto text-center">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="max-w-4xl mx-auto"
//         >
//           {/* Badge */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.2, duration: 0.5 }}
//             className="inline-flex items-center px-4 py-2 mb-8 text-sm font-medium text-purple-700 bg-purple-100 rounded-full dark:text-purple-300 dark:bg-purple-900/30"
//           >
//             <Sparkles className="w-4 h-4 mr-2" />
//             Powered By Base
//           </motion.div>

//           {/* Main Headline */}
//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3, duration: 0.8 }}
//             className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
//           >
//             Turn Your{" "}
//             <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//               Creativity
//             </span>{" "}
//             Into{" "}
//             <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//               Crypto
//             </span>
//           </motion.h1>

//           {/* Subtitle */}
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4, duration: 0.8 }}
//             className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
//           >
//             The all-in-one platform for creators and businesses to{" "}
//             <span className="font-semibold text-purple-600 dark:text-purple-400">
//               monetize knowledge
//             </span>
//             ,{" "}
//             <span className="font-semibold text-blue-600 dark:text-blue-400">
//               showcase work
//             </span>
//             , and{" "}
//             <span className="font-semibold text-green-600 dark:text-green-400">
//               receive payments
//             </span>{" "}
//             seamlessly with crypto
//           </motion.p>

//           {/* Feature Pills */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5, duration: 0.8 }}
//             className="flex flex-wrap justify-center gap-3 mb-12"
//           >
//             <div className="flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
//               <Zap className="w-4 h-4 mr-2 text-yellow-500" />
//               <span className="text-sm font-medium">
//                 Instant Crypto Payments
//               </span>
//             </div>
//             <div className="flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
//               <Globe className="w-4 h-4 mr-2 text-blue-500" />
//               <span className="text-sm font-medium">Global Reach</span>
//             </div>
//             <div className="flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
//               <Wallet className="w-4 h-4 mr-2 text-green-500" />
//               <span className="text-sm font-medium">Web3 Native</span>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.6, duration: 0.8 }}
//             className="flex flex-col sm:flex-row gap-4 justify-center items-center"
//           >
//             <Link href="/auth/signup">
//               <Button
//                 size="lg"
//                 className="bg-gradient-to-r w-full from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
//               >
//                 Start Creating
//                 <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
//               </Button>
//             </Link>
//             <Button
//               size="lg"
//               variant="outline"
//               className="px-8 py-4 text-lg bg-transparent w-full sm:w-auto"
//             >
//               <Play className="mr-2 h-5 w-5" />
//               Watch Demo
//             </Button>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.8, duration: 0.8 }}
//             className="grid **grid-cols-3** gap-8 mt-20 pt-12 border-t border-gray-200 dark:border-gray-700"
//           >
//             <div className="text-center">
//               <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
//                 $0
//               </div>
//               <div className="text-gray-600 dark:text-gray-400">Setup Fees</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
//                 99.9%
//               </div>
//               <div className="text-gray-600 dark:text-gray-400">Uptime</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
//                 ∞
//               </div>
//               <div className="text-gray-600 dark:text-gray-400">
//                 Possibilities
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Play, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200 dark:bg-purple-800 rounded-full blur-xl opacity-70 animate-pulse" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full blur-xl opacity-50 animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-pink-200 dark:bg-pink-800 rounded-full blur-xl opacity-60 animate-pulse delay-2000" />

      <div className="container relative z-10 mx-auto px-4 py-20 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900 px-4 py-2 text-sm font-medium text-purple-700 dark:text-purple-300 mb-6">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Powered By Base
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-4"
              >
                {/* Main Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
                >
                  Turn Your{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Creativity
                  </span>{" "}
                  Into{" "}
                  <span className="bg-gradient-to-r text-gray-900 dark:text-white bg-clip-text leading-tight">
                    Crypto
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
                >
                  The all-in-one platform for creators and businesses to{" "}
                  monetize knowledge, showcase work and receive payments
                  seamlessly with crypto.
                </motion.p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-black text-white px-8 py-4 text-lg w-full sm:w-auto"
                  >
                    Start Selling for Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 text-lg bg-transparent w-full sm:w-auto"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center justify-center lg:justify-start space-x-8 pt-8"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    0%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Setup Fees
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    99%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Uptime
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ∞
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Possibilities
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Content - Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative max-w-lg w-full">
                {/* Main Dashboard Preview */}
                <div className="relative rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Dashboard
                      </h3>
                      <div className="flex items-center text-green-600 text-sm">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +23% this month
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          $1,247
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Revenue
                        </div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          89
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Sales
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {/* <div className="w-10 h-10 bg-gray-100 rounded-lg"></div> */}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              Digital Course
                            </div>
                            <div className="text-sm text-gray-500">
                              2 hours ago
                            </div>
                          </div>
                        </div>
                        <div className="text-green-600 font-medium">+$99</div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg"></div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              E-book Bundle
                            </div>
                            <div className="text-sm text-gray-500">
                              5 hours ago
                            </div>
                          </div>
                        </div>
                        <div className="text-green-600 font-medium">+$49</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
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
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Payment Received
                    </div>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    +$299 USDC
                  </div>
                  <div className="text-xs text-gray-500">
                    From 0x1234...5678
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4 w-44"
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    New Customer
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Sarah from UK
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Bought Web3 Course
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
