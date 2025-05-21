"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="flex justify-between items-center p-6 shadow-sm bg-white">
        <h1 className="text-2xl font-bold">MiniTelephony</h1>
        <nav className="flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl font-bold mb-4">Simple, Scalable Telephony</h2>
        <p className="text-gray-600 max-w-xl mb-6">
          Build voice and messaging features into your app with ease. Our
          platform is developer-friendly and ready to integrate with your
          workflows.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/auth/signup">Get Started</Link>
          </Button>
          {/* <Button asChild variant="outline">
            <Link href="/learn-more">Learn More</Link>
          </Button> */}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6">
        &copy; {new Date().getFullYear()} MiniTelephony. All rights reserved.
      </footer>
    </div>
  );
}
