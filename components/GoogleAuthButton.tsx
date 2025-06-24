"use client";

import { Button } from "./ui/button";
import { Google } from "./icons";
import { useToast } from "./ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function GoogleAuthButton({
  isRegister = false,
}: {
  isRegister?: boolean;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const startGoogleAuth = () => {
    setIsLoading(true);
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://naija-concierge-api.onrender.com";
    const redirectUri = encodeURIComponent(
      `${window.location.origin}/api/auth/callback`
    );

    window.location.href = `${apiUrl}/api/v1/auth/google/login?redirect_uri=${redirectUri}&register=${isRegister}`;
  };

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      toast({
        title: "Authentication Error",
        description: decodeURIComponent(error),
        variant: "destructive",
      });
      cleanUrl();
    }

    if (token) {
      // Handle successful authentication
      cleanUrl();
      router.push("/dashboard");
    }

    function cleanUrl() {
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
      setIsLoading(false);
    }
  }, [searchParams, router, toast]);

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
