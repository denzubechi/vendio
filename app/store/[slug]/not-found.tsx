import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowLeft, Home } from "lucide-react";

export default function StoreNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/30 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Store Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            The store you're looking for doesn't exist or has been moved. It
            might be temporarily unavailable or the URL might be incorrect.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="default">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-blue-100 mb-2">
              Looking to create your own store?
            </h3>
            <p className="text-sm text-purple-700 dark:text-blue-200 mb-3">
              Start selling your digital products with Vendio today.
            </p>
            <Button
              asChild
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
