"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-8xl md:text-9xl font-bold text-white mb-4 leading-tight">
            404
          </h1>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
            Page Not Found
          </h2>

          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            Sorry, we couldn't find the page you're looking for. The page might
            have been moved, deleted, or you entered the wrong URL.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button
                size="lg"
                className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg rounded-full font-medium"
              >
                Go Home
              </Button>
            </Link>

            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-8 py-4 text-lg rounded-full font-medium backdrop-blur-sm"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
