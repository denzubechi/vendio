import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, ArrowLeft, Home } from "lucide-react";

export default function BioNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Profile Not Found
          </h1>
          <p className="text-purple-100 mb-8">
            The profile you're looking for doesn't exist or has been moved. The
            username might be incorrect or the creator hasn't set up their bio
            page yet.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="secondary">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <h3 className="font-semibold text-white mb-2">
              Want to create your own bio page?
            </h3>
            <p className="text-sm text-purple-100 mb-3">
              Build your personalized link-in-bio page and showcase your work.
            </p>
            <Button
              asChild
              size="sm"
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
