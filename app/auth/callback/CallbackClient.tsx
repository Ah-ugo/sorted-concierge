"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/use-toast";

// AuthCallbackPage.tsx
export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthData } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const error = searchParams.get("error");
    const message = searchParams.get("message");
    const token = searchParams.get("token");
    const userJson = searchParams.get("user");

    // Clean up URL immediately
    const cleanUrl = () => {
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      url.searchParams.delete("error");
      url.searchParams.delete("user");
      url.searchParams.delete("message");
      window.history.replaceState({}, "", url.toString());
    };

    if (error) {
      cleanUrl();
      toast({
        title: "Authentication Error",
        description: message || "Failed to authenticate",
        variant: "destructive",
      });
      router.push("/auth/login");
    } else if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        setAuthData(token, user);
        cleanUrl();
        router.push(user.role === "admin" ? "/admin/dashboard" : "/profile");
      } catch (e) {
        cleanUrl();
        toast({
          title: "Authentication Error",
          description: "Failed to process user data",
          variant: "destructive",
        });
        router.push("/auth/login");
      }
    } else {
      cleanUrl();
      router.push("/auth/login");
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
