"use client";

import { Button } from "./ui/button";
import { Google } from "./icons";
import { useToast } from "./ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function GoogleAuthButton({
  isRegister = false,
}: {
  isRegister?: boolean;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const startGoogleAuth = () => {
    setIsLoading(true);
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://naija-concierge-api.onrender.com";

    // Get the current path before redirecting to Google auth
    const currentPath = window.location.pathname;

    const frontendCallbackUrl = `${window.location.origin}/auth/callback`;

    // Include the original path in the callback URL
    const callbackWithPath = `${frontendCallbackUrl}?origin=${encodeURIComponent(
      currentPath
    )}`;

    window.location.href = `${apiUrl}/auth/google/login?frontend_callback=${encodeURIComponent(
      callbackWithPath
    )}&register=${isRegister}`;
  };

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
