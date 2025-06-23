"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api";
import { motion } from "framer-motion";
import Image from "next/image";
import { Google } from "@/components/icons";

interface UserCreate {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
      valid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    const userData: UserCreate = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone || undefined,
    };

    try {
      const token = await apiClient.register(userData);
      localStorage.setItem("access_token", token.access_token);
      toast({
        title: "Success",
        description: "Registration successful! Welcome to our platform.",
      });
      router.push("/");
    } catch {
      toast({
        title: "Error",
        description: "Failed to register. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      // Open Google auth window
      const authWindow = window.open(
        `https://naija-concierge-api.onrender.com/auth/google/login`,
        "googleAuth",
        "width=500,height=600"
      );

      // Listen for message from the popup
      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== new URL(process.env.NEXT_PUBLIC_API_URL!).origin) {
          return;
        }

        if (event.data.type === "google-auth-success") {
          const { token, user } = event.data;
          localStorage.setItem("access_token", token);
          toast({
            title: "Registration Successful",
            description: "Welcome to our platform!",
          });
          router.push("/");
          authWindow?.close();
          window.removeEventListener("message", messageHandler);
        }

        if (event.data.type === "google-auth-error") {
          toast({
            title: "Registration Error",
            description: event.data.message,
            variant: "destructive",
          });
          authWindow?.close();
          window.removeEventListener("message", messageHandler);
        }
      };

      window.addEventListener("message", messageHandler);
    } catch (error) {
      toast({
        title: "Registration Error",
        description: "Failed to register with Google",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 max-w-5xl w-full bg-black border border-muted/50 rounded-xl overflow-hidden shadow-lg">
        <div className="hidden md:block relative bg-gradient-to-br from-black to-muted/20">
          <div className="absolute inset-0 p-12 flex flex-col justify-between z-10">
            <div>
              <h1 className="text-3xl font-semibold text-secondary-light tracking-wider">
                Join Sorted Concierge
              </h1>
              <p className="mt-4 text-muted-foreground font-normal">
                Create your account to access exclusive concierge services and
                luxurious experiences.
              </p>
            </div>
            <div className="text-sm text-muted-foreground font-normal">
              <p>Already have an account?</p>
              <p>Sign in to continue your premium concierge experience.</p>
            </div>
          </div>
          <Image
            src="/image13.png"
            alt="Luxury Concierge"
            width={600}
            height={800}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 md:p-12 bg-black"
        >
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-white tracking-wider">
              Create an Account
            </h1>
            <p className="mt-2 text-muted-foreground font-normal">
              Sign up to access our premium concierge services
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white font-normal">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="h-12 bg-card border-muted/50 text-white placeholder:text-muted-foreground focus:border-secondary-light focus:ring-secondary-light"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-400">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white font-normal">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="h-12 bg-card border-muted/50 text-white placeholder:text-muted-foreground focus:border-secondary-light focus:ring-secondary-light"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-400">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-normal">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                className="h-12 bg-card border-muted/50 text-white placeholder:text-muted-foreground focus:border-secondary-light focus:ring-secondary-light"
              />
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white font-normal">
                Phone Number (Optional)
              </Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+234 123 456 7890"
                value={formData.phone}
                onChange={handleChange}
                className="h-12 bg-card border-muted/50 text-white placeholder:text-muted-foreground focus:border-secondary-light focus:ring-secondary-light"
              />
              {errors.phone && (
                <p className="text-sm text-red-400">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-normal">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="h-12 bg-card border-muted/50 text-white placeholder:text-muted-foreground focus:border-secondary-light focus:ring-secondary-light"
              />
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-white font-normal"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="h-12 bg-card border-muted/50 text-white placeholder:text-muted-foreground focus:border-secondary-light focus:ring-secondary-light"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="mt-6">
              <Button
                type="submit"
                className="w-full h-12 bg-gold-gradient text-black font-normal uppercase tracking-wider hover:bg-secondary-light/80"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Sign Up"
                )}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignUp}
                disabled={isLoading || isGoogleLoading}
                className="w-full h-12 border-muted/50 text-white hover:bg-card/80 hover:text-white"
              >
                {isGoogleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Google className="mr-2 h-4 w-4" />
                    Sign up with Google
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground font-normal mt-4">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-secondary-light hover:opacity-80 underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
