"use client";

import { Button } from "./ui/button";
import { Google } from "./icons";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface GoogleAuthButtonProps {
  variant?: "default" | "outline" | "link";
  size?: "default" | "sm" | "lg";
  className?: string;
  text?: string;
  isRegister?: boolean;
}

export function GoogleAuthButton({
  variant = "outline",
  size = "default",
  className = "",
  text = "Continue with Google",
  isRegister = false,
}: GoogleAuthButtonProps) {
  const { loginWithGoogle, registerWithGoogle } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleGoogleAuth = async () => {
    try {
      const width = 600;
      const height = 800;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const authWindow = window.open(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google/login`,
        "googleAuth",
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!authWindow) {
        throw new Error(
          "Popup window blocked. Please allow popups for this site."
        );
      }

      const checkWindow = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(checkWindow);
        }
      }, 500);

      window.addEventListener("message", (event) => {
        // Verify the origin is your API URL
        if (event.origin !== process.env.NEXT_PUBLIC_API_URL) {
          return;
        }

        if (event.data.type === "google-auth-success") {
          const { token, user } = event.data;
          if (isRegister) {
            registerWithGoogle(token);
          } else {
            loginWithGoogle(token);
          }
          authWindow.close();
          router.refresh();
        }

        if (event.data.type === "google-auth-error") {
          toast({
            title: "Authentication Error",
            description: event.data.message,
            variant: "destructive",
          });
          authWindow.close();
        }
      });
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description:
          error.message || "Failed to initiate Google authentication",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      type="button"
      onClick={handleGoogleAuth}
      className={`w-full gap-2 ${className}`}
    >
      <Google className="h-4 w-4" />
      {text}
    </Button>
  );
}
