"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import Image from "next/image";
import { APIError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

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
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        // Check user role from auth context
        const isAdmin = user?.role === "admin";

        // Redirect based on role
        router.push(isAdmin ? "/admin/dashboard" : "/");

        toast({
          title: "Login Successful",
          description: `Welcome back! Redirecting to ${
            isAdmin ? "admin" : "your"
          } dashboard...`,
          variant: "default",
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      let errorMessage = "Login failed";

      if (error instanceof APIError) {
        if (error.status === 422) {
          errorMessage =
            "Validation error: " +
            (Array.isArray(error.details)
              ? error.details.join(", ")
              : error.message);
        } else if (error.status === 401) {
          errorMessage = "Invalid credentials";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 max-w-4xl w-full bg-white rounded-xl overflow-hidden shadow-lg">
        <div className="hidden md:block relative bg-teal-400/20">
          <div className="absolute inset-0 p-12 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-teal-800">
                Welcome Back
              </h1>
              <p className="mt-4 text-teal-700">
                Login to access premium concierge services tailored just for
                you.
              </p>
            </div>
            <div className="text-sm text-teal-700">
              <p>Don't have an account?</p>
              <p>Sign up to experience luxury concierge services in Lagos.</p>
            </div>
          </div>
          <Image
            src="/placeholder.svg?height=800&width=600&text=Naija+Concierge"
            alt="Naija Concierge"
            width={600}
            height={800}
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 sm:p-12"
        >
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold">Sign In</h1>
            <p className="mt-2 text-neutral-600">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="h-12"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-teal-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="h-12"
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-teal-400 hover:bg-teal-500 text-neutral-900"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center text-sm text-neutral-600">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-teal-600 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
