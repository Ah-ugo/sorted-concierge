"use client";

import { Button } from "./ui/button";
import { Google } from "./icons";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "./ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function GoogleAuthButton({
  isRegister = false,
}: {
  isRegister?: boolean;
}) {
  const { loginWithGoogle, registerWithGoogle } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const startGoogleAuth = () => {
    setIsLoading(true);
    const redirectUri = encodeURIComponent(
      `${window.location.origin}/auth/callback`
    );
    window.location.href = `https://naija-concierge-api.onrender.com/auth/google/login?redirect_uri=${redirectUri}&register=${isRegister}`;
  };

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");
    const register = searchParams.get("register") === "true";

    if (error) {
      toast({
        title: "Authentication Error",
        description: decodeURIComponent(error),
        variant: "destructive",
      });
      // Clean up the URL
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);
      setIsLoading(false);
      return;
    }

    if (token) {
      const handleAuth = async () => {
        try {
          const userJson = searchParams.get("user");
          if (!userJson) throw new Error("User data missing");

          const user = JSON.parse(decodeURIComponent(userJson));

          if (register) {
            await registerWithGoogle(token);
          } else {
            await loginWithGoogle(token);
          }

          // Clean up the URL and redirect
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, "", cleanUrl);
          router.push("/dashboard");
        } catch (err: any) {
          toast({
            title: "Authentication Error",
            description: err.message || "Failed to process authentication",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      handleAuth();
    }
  }, [searchParams, loginWithGoogle, registerWithGoogle, router, toast]);

  return (
    <Button
      variant="outline"
      onClick={startGoogleAuth}
      disabled={isLoading}
      className="w-full gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Google className="h-4 w-4" />
          {isRegister ? "Sign up with Google" : "Continue with Google"}
        </>
      )}
    </Button>
  );
}
