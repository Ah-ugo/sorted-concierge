"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/use-toast";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthData } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!searchParams) return;

    const error = searchParams.get("error");
    const message = searchParams.get("message");
    const token = searchParams.get("token");
    const userJson = searchParams.get("user");
    const originPath = searchParams.get("origin");

    const cleanUrl = () => {
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("token");
      cleanUrl.searchParams.delete("error");
      cleanUrl.searchParams.delete("user");
      cleanUrl.searchParams.delete("message");
      cleanUrl.searchParams.delete("origin");
      window.history.replaceState({}, "", cleanUrl.toString());
    };

    const handleError = (errorMessage: string) => {
      cleanUrl();
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
      router.push("/auth/login");
    };

    if (error) {
      handleError(message || "Failed to authenticate");
      return;
    }

    if (!token || !userJson) {
      handleError("Missing authentication data");
      return;
    }

    try {
      const user = JSON.parse(userJson);
      setAuthData(token, user);
      cleanUrl();

      // Determine redirect path based on user role and origin
      let redirectPath = "/profile"; // Default for regular users

      if (user.role === "admin") {
        redirectPath = "/admin/dashboard";
      } else if (originPath) {
        // Check if the origin was a booking-related path
        const bookingPaths = ["/membership-booking", "/booking"];
        const shouldStayOnPath = bookingPaths.some((path) =>
          originPath.includes(path)
        );

        if (shouldStayOnPath) {
          redirectPath = originPath;
        }
      }

      // Use window.location.href for more reliable redirects
      window.location.href = redirectPath;
    } catch (e) {
      handleError("Failed to process user data");
    }
  }, [searchParams, router, setAuthData, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Processing authentication...</h1>
        <p className="mt-2 text-muted-foreground">
          Please wait while we verify your credentials
        </p>
      </div>
    </div>
  );
}
