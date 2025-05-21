"use client";
import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/utils/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Get the ID token
      const idToken = await userCredential.user.getIdToken();

      // Send token to your API
      const response = await fetch("/api/firebase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to store user data");
      }

      toast({
        title: "Success!",
        description: "Your account has been created successfully.",
      });

      // Redirect to login page after successful signup
      router.push("/auth/login");
    } catch (error: any) {
      // Handle Firebase auth errors
      let errorMessage = "An error occurred during signup";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "An account already exists with this email";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Email/password accounts are not enabled";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters";
      }

      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      // Get the ID token
      const idToken = await userCredential.user.getIdToken();

      // Send token to your API
      const response = await fetch("/api/firebase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If user already exists, redirect to login
        if (data.error === "User already exists") {
          toast({
            title: "Account Exists",
            description: "Please login with your existing account.",
          });
          router.push("/auth/login");
          return;
        }
        throw new Error(data.error || "Failed to store user data");
      }

      toast({
        title: "Success!",
        description: "Your account has been created with Google successfully.",
      });

      // Redirect to login page after successful signup
      router.push("/auth/login");
    } catch (error: any) {
      let errorMessage = "Failed to sign up with Google";

      if (error.code === "auth/account-exists-with-different-credential") {
        errorMessage = "An account already exists with this email";
      } else if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign up was cancelled";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Pop-up was blocked by your browser";
      }

      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <Card className="max-w-md mx-auto mt-20 p-6">
        <CardHeader>
          <CardTitle className="text-center">Create an Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <Separator className="my-6" />

          <Button
            variant="outline"
            onClick={handleGoogleSignUp}
            className="w-full"
            type="button"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign up with Google"}
          </Button>

          <div className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Login here
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
