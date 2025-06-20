"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";
import { useCurrency } from "@/lib/currency-context";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Loader2,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { apiClient, APIError } from "@/lib/api";

interface ServiceTier {
  id: string;
  name: string;
  description: string;
  price: number;
  convertedPrice: number;
  currency: string;
  originalPrice: number;
  category_id: string;
  image?: string;
  features: string[];
  is_popular: boolean;
  is_available: boolean;
  services: Array<{
    id: string;
    name: string;
    description: string;
    duration: string;
  }>;
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  category_type: string;
  tiers: ServiceTier[];
}

export default function TierBookingPage() {
  const { toast } = useToast();
  const { user, token, isAuthenticated, setAuthData } = useAuth();
  const { formatPrice, changeCurrency, currentCurrency, currencies } =
    useCurrency();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCategoryId = searchParams.get("categoryId");
  const [step, setStep] = useState(isAuthenticated ? 2 : 1);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string>("");
  const [authSuccess, setAuthSuccess] = useState<string>("");
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedTier, setSelectedTier] = useState<ServiceTier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(
    {}
  );
  const [date, setDate] = useState<Date>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    tierId: "",
    bookingDate: null as Date | null,
    specialRequests: "",
    paymentMethod: "card",
  });

  // Fetch exchange rates
  const fetchExchangeRates = async () => {
    try {
      const response = await fetch(
        "https://naija-concierge-api.onrender.com/exchange-rates"
      );
      const data = await response.json();
      setExchangeRates(data.rates);
    } catch (error) {
      console.error("Failed to fetch exchange rates:", error);
    }
  };

  // Fetch categories and tiers
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://naija-concierge-api.onrender.com/service-categories?category_type=tiered",
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const tieredCategories = data.filter(
        (category: ServiceCategory) => category.category_type === "tiered"
      );

      const categoriesWithConvertedPrices = await Promise.all(
        tieredCategories.map(async (category: ServiceCategory) => {
          const tiersWithConvertedPrices = await Promise.all(
            category.tiers.map(async (tier: ServiceTier) => {
              let convertedPrice = tier.price;
              if (currentCurrency.code !== "NGN" && token) {
                try {
                  const response = await fetch(
                    `https://naija-concierge-api.onrender.com/service-tiers/${tier.id}/convert?currency=${currentCurrency.code}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                    }
                  );

                  if (response.ok) {
                    const conversionData = await response.json();
                    convertedPrice = conversionData.convertedPrice;
                  } else {
                    const rate =
                      exchangeRates[currentCurrency.code] ||
                      currentCurrency.rate;
                    convertedPrice = tier.price * rate;
                  }
                } catch (error) {
                  console.error(
                    `Failed to convert price for tier ${tier.id}:`,
                    error
                  );
                  const rate =
                    exchangeRates[currentCurrency.code] || currentCurrency.rate;
                  convertedPrice = tier.price * rate;
                }
              }

              return {
                ...tier,
                convertedPrice: Math.max(convertedPrice, 0.01),
                currency: currentCurrency.code,
                originalPrice: tier.price,
              };
            })
          );

          return {
            ...category,
            tiers: tiersWithConvertedPrices,
          };
        })
      );

      setCategories(categoriesWithConvertedPrices);

      if (preselectedCategoryId) {
        const preselected = categoriesWithConvertedPrices.find(
          (cat: ServiceCategory) => cat.id === preselectedCategoryId
        );
        if (preselected && preselected.tiers.length > 0) {
          setFormData((prev) => ({
            ...prev,
            tierId: preselected.tiers[0].id,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast({
        title: "Error",
        description: "Failed to load service tiers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Convert prices when currency changes
  const convertPrices = async () => {
    if (categories.length === 0 || !token) return;

    setIsConverting(true);
    try {
      const updatedCategories = await Promise.all(
        categories.map(async (category) => {
          const updatedTiers = await Promise.all(
            category.tiers.map(async (tier) => {
              let convertedPrice = tier.originalPrice;
              if (currentCurrency.code !== "NGN") {
                try {
                  const response = await fetch(
                    `https://naija-concierge-api.onrender.com/service-tiers/${tier.id}/convert?currency=${currentCurrency.code}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                    }
                  );

                  if (response.ok) {
                    const conversionData = await response.json();
                    convertedPrice = conversionData.convertedPrice;
                  } else {
                    const rate =
                      exchangeRates[currentCurrency.code] ||
                      currentCurrency.rate;
                    convertedPrice = tier.originalPrice * rate;
                  }
                } catch (error) {
                  console.error(
                    `Failed to convert price for tier ${tier.id}:`,
                    error
                  );
                  const rate =
                    exchangeRates[currentCurrency.code] || currentCurrency.rate;
                  convertedPrice = tier.originalPrice * rate;
                }
              }

              return {
                ...tier,
                convertedPrice: Math.max(convertedPrice, 0.01),
                currency: currentCurrency.code,
              };
            })
          );

          return {
            ...category,
            tiers: updatedTiers,
          };
        })
      );

      setCategories(updatedCategories);

      if (selectedTier) {
        const updatedCategory = updatedCategories.find((cat) =>
          cat.tiers.some((tier) => tier.id === selectedTier.id)
        );
        if (updatedCategory) {
          const updatedTier = updatedCategory.tiers.find(
            (tier) => tier.id === selectedTier.id
          );
          if (updatedTier) {
            setSelectedTier(updatedTier);
          }
        }
      }
    } catch (error) {
      console.error("Failed to convert prices:", error);
      toast({
        title: "Currency Conversion Error",
        description: "Failed to convert prices. Using fallback rates.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [token]);

  useEffect(() => {
    if (categories.length > 0) {
      convertPrices();
    }
  }, [currentCurrency.code]);

  useEffect(() => {
    if (formData.tierId && categories.length > 0) {
      const tier =
        categories
          .flatMap((cat) => cat.tiers)
          .find((t) => t.id === formData.tierId) || null;
      setSelectedTier(tier);
    } else {
      setSelectedTier(null);
    }
  }, [formData.tierId, categories]);

  useEffect(() => {
    if (isAuthenticated) {
      setStep(2);
      setFormData((prev) => ({
        ...prev,
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || "",
      }));
    }
  }, [isAuthenticated, user]);

  const validateStep = (stepNumber: number) => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1 && !isAuthenticated) {
      if (authMode === "register") {
        if (!formData.firstName) newErrors.firstName = "First name is required";
        if (!formData.lastName) newErrors.lastName = "Last name is required";
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 8)
          newErrors.password = "Password must be at least 8 characters";
        if (formData.password !== formData.confirmPassword)
          newErrors.confirmPassword = "Passwords do not match";
      }
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email is invalid";
      if (!formData.password && authMode === "login")
        newErrors.password = "Password is required";
    }

    if (stepNumber === 2) {
      if (!formData.tierId) newErrors.tierId = "Please select a service tier";
      if (!formData.bookingDate) newErrors.bookingDate = "Please select a date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCurrencyChange = (value: string) => {
    changeCurrency(value);
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }));
  };

  const handleLogin = async () => {
    if (!validateStep(1)) return;

    setIsSubmitting(true);
    setAuthError("");
    setAuthSuccess("");

    try {
      const response = await apiClient.login({
        username: formData.email,
        password: formData.password,
      });

      if (response?.access_token && response?.user) {
        setAuthData(response.access_token, response.user);
        setAuthSuccess("Successfully logged in!");
        setStep(2);
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
      } else {
        throw new Error("Login failed");
      }
    } catch (error: any) {
      let errorMessage = "Login failed";
      if (error instanceof APIError) {
        errorMessage = error.message;
        if (error.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (error.status === 422) {
          errorMessage = "Please check your email and password";
        }
      }
      setAuthError(errorMessage);
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async () => {
    if (!validateStep(1)) return;

    setIsSubmitting(true);
    setAuthError("");
    setAuthSuccess("");

    try {
      const response = await apiClient.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (response?.access_token && response?.user) {
        setAuthData(response.access_token, response.user);
        setAuthSuccess("Account created successfully!");
        setStep(2);
        toast({
          title: "Success",
          description: "Account created successfully!",
        });
      } else {
        throw new Error("Registration failed");
      }
    } catch (error: any) {
      let errorMessage = "Registration failed";
      if (error instanceof APIError) {
        errorMessage = error.message;
        if (error.status === 422) {
          errorMessage = Array.isArray(error.details?.detail)
            ? error.details.detail.map((e: any) => e.msg).join(", ")
            : error.details?.detail || "Invalid registration data";
        } else if (error.status === 400) {
          errorMessage = "Email already exists or invalid data provided";
        }
      }
      setAuthError(errorMessage);
      toast({
        title: "Registration Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !token || !user) {
      setStep(1);
      return;
    }

    if (!validateStep(3)) return;

    if (!selectedTier) {
      toast({
        title: "No Tier Selected",
        description: "Please select a service tier.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const params = new URLSearchParams({
        tier_id: formData.tierId,
        booking_date: formData.bookingDate
          ? formData.bookingDate.toISOString()
          : new Date().toISOString(),
        preferred_currency: currentCurrency.code,
      }).toString();

      const response = await fetch(
        `https://naija-concierge-api.onrender.com/bookings/tier?${params}`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      const booking = await response.json();

      if (booking.payment_url) {
        window.location.href = booking.payment_url;
      } else {
        toast({
          title: "Booking Created",
          description:
            "Your booking has been created. Payment link will be provided shortly.",
        });
        router.push("/dashboard/bookings");
      }
    } catch (error) {
      console.error("Booking creation failed:", error);
      toast({
        title: "Booking Failed",
        description:
          "There was an error creating your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !isAuthenticated) {
      if (authMode === "login") {
        handleLogin();
      } else {
        handleRegister();
      }
    } else if (step === 2) {
      if (validateStep(2)) setStep(3);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-secondary-light" />
      </div>
    );
  }

  return (
    <>
      <section className="relative flex min-h-[40vh] items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/image11.png"
            alt="Tier Booking Hero"
            fill
            priority
            className="w-full h-full object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container relative z-10 mx-auto my-24 sm:my-32 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-secondary-light/20 text-secondary-light px-3 sm:px-4 py-1 text-xs sm:text-sm font-normal">
              Premium Tiers
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-widest text-white mb-4 sm:mb-6">
              Book a Service Tier
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-normal text-muted-foreground mb-6 sm:mb-8">
              Choose from our premium service tiers and enjoy comprehensive
              lifestyle management.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 sm:mb-12">
              <div className="flex justify-between items-center">
                {[
                  { number: 1, label: isAuthenticated ? "Account" : "Sign In" },
                  { number: 2, label: "Tier Selection" },
                  { number: 3, label: "Confirmation" },
                ].map((stepItem, index) => (
                  <div key={stepItem.number} className="flex items-center">
                    <div
                      className={`flex flex-col items-center ${
                        step >= stepItem.number
                          ? "text-secondary-light"
                          : "text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center mb-2 text-xs sm:text-sm ${
                          step >= stepItem.number
                            ? "bg-secondary-light text-black"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {stepItem.number}
                      </div>
                      <span className="text-xs sm:text-sm font-normal">
                        {stepItem.label}
                      </span>
                    </div>
                    {index < 2 && (
                      <div
                        className={`flex-1 h-1 mx-2 sm:mx-4 ${
                          step > stepItem.number
                            ? "bg-secondary-light"
                            : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Card className="border-muted/50 bg-card shadow-sm">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <form onSubmit={handleSubmit}>
                  {step === 1 && !isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold uppercase tracking-widest text-white mb-4 sm:mb-6 text-center">
                        Welcome to Sorted Concierge
                      </h2>

                      {authSuccess && (
                        <Alert className="mb-6 border-green-500 bg-green-500/10">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <AlertDescription className="text-green-500">
                            {authSuccess}
                          </AlertDescription>
                        </Alert>
                      )}

                      {authError && (
                        <Alert className="mb-6 border-red-500 bg-red-500/10">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <AlertDescription className="text-red-500">
                            {authError}
                          </AlertDescription>
                        </Alert>
                      )}

                      <Tabs
                        value={authMode}
                        onValueChange={(value) =>
                          setAuthMode(value as "login" | "register")
                        }
                      >
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                          <TabsTrigger value="login">Sign In</TabsTrigger>
                          <TabsTrigger value="register">
                            Create Account
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="login" className="space-y-4">
                          <div>
                            <Label
                              htmlFor="email"
                              className="text-white text-xs sm:text-sm font-normal"
                            >
                              Email *
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="your.email@example.com"
                              className="border-muted/50 bg-card text-sm sm:text-base text-white focus:border-secondary-light focus:ring-secondary-light font-normal"
                            />
                            {errors.email && (
                              <p className="text-red-400 text-sm mt-1">
                                {errors.email}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label
                              htmlFor="password"
                              className="text-white text-xs sm:text-sm font-normal"
                            >
                              Password *
                            </Label>
                            <div className="relative">
                              <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="border-muted/50 bg-card text-sm sm:text-base text-white focus:border-secondary-light focus:ring-secondary-light font-normal pr-10"
                                placeholder="••••••••"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-white"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                            {errors.password && (
                              <p className="text-red-400 text-sm mt-1">
                                {errors.password}
                              </p>
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="register" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label
                                htmlFor="firstName"
                                className="text-white text-xs sm:text-sm font-normal"
                              >
                                First Name *
                              </Label>
                              <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="border-muted/50 bg-card text-sm sm:text-base text-white focus:border-secondary-light focus:ring-secondary-light font-normal"
                                placeholder="John"
                              />
                              {errors.firstName && (
                                <p className="text-red-400 text-sm mt-1">
                                  {errors.firstName}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label
                                htmlFor="lastName"
                                className="text-white text-xs sm:text-sm font-normal"
                              >
                                Last Name *
                              </Label>
                              <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="border-muted/50 bg-card text-sm sm:text-base text-white focus:border-secondary-light focus:ring-secondary-light font-normal"
                                placeholder="Doe"
                              />
                              {errors.lastName && (
                                <p className="text-red-400 text-sm mt-1">
                                  {errors.lastName}
                                </p>
                              )}
                            </div>
                          </div>
                          <div>
                            <Label
                              htmlFor="email"
                              className="text-white text-xs sm:text-sm font-normal"
                            >
                              Email *
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="border-muted/50 bg-card text-sm sm:text-base text-white focus:border-secondary-light focus:ring-secondary-light font-normal"
                              placeholder="your.email@example.com"
                            />
                            {errors.email && (
                              <p className="text-red-400 text-sm mt-1">
                                {errors.email}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label
                              htmlFor="phone"
                              className="text-white text-xs sm:text-sm font-normal"
                            >
                              Phone (Optional)
                            </Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="border-muted/50 bg-card text-sm sm:text-base text-white focus:border-secondary-light focus:ring-secondary-light font-normal"
                              placeholder="+234 123 456 7890"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor="password"
                              className="text-white text-xs sm:text-sm font-normal"
                            >
                              Password *
                            </Label>
                            <div className="relative">
                              <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="border-muted/50 bg-card text-sm sm:text-base text-white focus:border-secondary-light focus:ring-secondary-light font-normal pr-10"
                                placeholder="••••••••"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-white"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                            {errors.password && (
                              <p className="text-red-400 text-sm mt-1">
                                {errors.password}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label
                              htmlFor="confirmPassword"
                              className="text-white text-xs sm:text-sm font-normal"
                            >
                              Confirm Password *
                            </Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              className="border-muted/50 bg-card text-sm sm:text-base text-white focus:border-secondary-light focus:ring-secondary-light font-normal"
                              placeholder="••••••••"
                            />
                            {errors.confirmPassword && (
                              <p className="text-red-400 text-sm mt-1">
                                {errors.confirmPassword}
                              </p>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>

                      <div className="mt-6 sm:mt-8 flex justify-end">
                        <Button
                          type="button"
                          onClick={nextStep}
                          disabled={isSubmitting}
                          className="bg-gold-gradient hover:bg-secondary-light/80 text-black text-xs sm:text-sm font-normal px-4 sm:px-6 py-2 sm:py-3"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {authMode === "register"
                                ? "Creating Account..."
                                : "Signing In..."}
                            </>
                          ) : authMode === "register" ? (
                            "Create Account"
                          ) : (
                            "Sign In"
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between items-center mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold uppercase tracking-widest text-white">
                          Select Service Tier
                        </h2>
                        {isConverting && (
                          <RefreshCw className="h-4 w-4 animate-spin text-secondary-light" />
                        )}
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <Label
                            htmlFor="currency"
                            className="text-xs sm:text-sm font-normal text-muted-foreground"
                          >
                            Preferred Currency *
                          </Label>
                          <Select
                            value={currentCurrency.code}
                            onValueChange={handleCurrencyChange}
                          >
                            <SelectTrigger className="border-muted/50 bg-card text-sm sm:text-base text-white focus:border-secondary-light focus:ring-secondary-light font-normal">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="NGN">NGN (₦)</SelectItem>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                              <SelectItem value="GBP">GBP (£)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label
                            htmlFor="bookingDate"
                            className="text-xs sm:text-sm font-normal text-muted-foreground"
                          >
                            Preferred Date *
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal bg-card border-muted/50 text-white",
                                  !date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? (
                                  format(date, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-card border-muted/50">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(selectedDate) => {
                                  setDate(selectedDate);
                                  setFormData((prev) => ({
                                    ...prev,
                                    bookingDate: selectedDate || null,
                                  }));
                                }}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          {errors.bookingDate && (
                            <p className="text-red-400 text-sm mt-1">
                              {errors.bookingDate}
                            </p>
                          )}
                        </div>

                        {categories.map((category) => (
                          <div key={category.id} className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">
                              {category.name}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {category.tiers.map((tier) => (
                                <Card
                                  key={tier.id}
                                  className={`border cursor-pointer hover:border-secondary-light/50 transition-colors ${
                                    formData.tierId === tier.id
                                      ? "border-secondary-light"
                                      : "border-muted/50"
                                  } ${
                                    !tier.is_available
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    if (tier.is_available) {
                                      setFormData((prev) => ({
                                        ...prev,
                                        tierId: tier.id,
                                      }));
                                    }
                                  }}
                                >
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                      <div>
                                        <h4 className="text-base sm:text-lg font-semibold text-white">
                                          {tier.name}
                                        </h4>
                                        <div className="space-y-1">
                                          <p className="text-lg sm:text-xl font-bold text-secondary-light">
                                            {currentCurrency.symbol}
                                            {tier.convertedPrice.toFixed(2)}
                                          </p>
                                          {currentCurrency.code !== "NGN" && (
                                            <p className="text-xs text-muted-foreground">
                                              Originally ₦
                                              {tier.originalPrice.toLocaleString()}
                                              <br />
                                              (converted from NGN)
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      {tier.is_popular && (
                                        <Badge className="bg-secondary-light text-black">
                                          Popular
                                        </Badge>
                                      )}
                                    </div>

                                    <p className="text-xs sm:text-sm font-normal text-muted-foreground mb-3">
                                      {tier.description}
                                    </p>

                                    <div className="space-y-2">
                                      <p className="text-xs font-semibold text-white">
                                        Features:
                                      </p>
                                      <ul className="space-y-1">
                                        {tier.features
                                          .slice(0, 3)
                                          .map((feature, index) => (
                                            <li
                                              key={index}
                                              className="text-xs text-white"
                                            >
                                              • {feature}
                                            </li>
                                          ))}
                                        {tier.features.length > 3 && (
                                          <li className="text-xs text-secondary-light">
                                            +{tier.features.length - 3} more
                                            features
                                          </li>
                                        )}
                                      </ul>
                                    </div>

                                    {tier.services.length > 0 && (
                                      <div className="mt-3 space-y-2">
                                        <p className="text-xs font-semibold text-white">
                                          Included Services:
                                        </p>
                                        <ul className="space-y-1">
                                          {tier.services
                                            .slice(0, 2)
                                            .map((service, index) => (
                                              <li
                                                key={index}
                                                className="text-xs text-muted-foreground"
                                              >
                                                • {service.name}
                                              </li>
                                            ))}
                                          {tier.services.length > 2 && (
                                            <li className="text-xs text-secondary-light">
                                              +{tier.services.length - 2} more
                                              services
                                            </li>
                                          )}
                                        </ul>
                                      </div>
                                    )}

                                    {!tier.is_available && (
                                      <div className="mt-3">
                                        <Badge
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          Currently Unavailable
                                        </Badge>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        ))}

                        <div>
                          <Label
                            htmlFor="specialRequests"
                            className="text-xs sm:text-sm font-normal text-muted-foreground"
                          >
                            Special Requests (Optional)
                          </Label>
                          <Textarea
                            id="specialRequests"
                            name="specialRequests"
                            value={formData.specialRequests}
                            onChange={handleChange}
                            placeholder="Any special requirements or requests..."
                            rows={3}
                            className="w-full border border-muted/50 bg-card text-sm sm:text-base text-white focus:border-secondary-light focus:ring-secondary-light font-normal rounded-md px-3 py-2"
                          />
                        </div>
                      </div>

                      <div className="mt-6 sm:mt-8 flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          className="border-secondary-light text-xs sm:text-sm text-white hover:bg-secondary-light/10 hover:text-secondary-light font-normal px-4 sm:px-6 py-2 sm:py-3"
                        >
                          Previous Step
                        </Button>
                        <Button
                          type="button"
                          onClick={nextStep}
                          disabled={
                            isSubmitting ||
                            !formData.tierId ||
                            !formData.bookingDate
                          }
                          className="bg-gold-gradient hover:bg-secondary-light/80 text-black text-xs sm:text-sm font-normal px-4 sm:px-6 py-2 sm:py-3 disabled:opacity-50"
                        >
                          Next Step
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold uppercase tracking-widest text-white mb-4 sm:mb-6">
                        Confirm Your Booking
                      </h2>

                      <div className="space-y-4 sm:space-y-6">
                        <div className="bg-card p-3 sm:p-4 rounded-lg border border-muted/50">
                          <h3 className="font-normal text-base sm:text-lg text-white mb-3 sm:mb-4">
                            Personal Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                                Name
                              </p>
                              <p className="text-sm sm:text-base font-normal text-white">
                                {user
                                  ? `${user.firstName} ${user.lastName}`
                                  : `${formData.firstName} ${formData.lastName}`}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                                Email
                              </p>
                              <p className="text-sm sm:text-base font-normal text-white">
                                {formData.email}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                                Phone
                              </p>
                              <p className="text-sm sm:text-base font-normal text-white">
                                {formData.phone || "Not provided"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                                Date
                              </p>
                              <p className="text-sm sm:text-base font-normal text-white">
                                {formData.bookingDate
                                  ? format(formData.bookingDate, "PPP")
                                  : "Not selected"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {selectedTier && (
                          <div className="bg-card p-3 sm:p-4 rounded-lg border border-muted/50">
                            <h3 className="font-normal text-base sm:text-lg text-white mb-3 sm:mb-4">
                              Tier Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                              <div>
                                <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                                  Tier
                                </p>
                                <p className="text-sm sm:text-base font-normal text-white">
                                  {selectedTier.name}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                                  Price
                                </p>
                                <div>
                                  <p className="text-lg font-bold text-secondary-light">
                                    {currentCurrency.symbol}
                                    {selectedTier.convertedPrice.toFixed(2)}
                                  </p>
                                  {currentCurrency.code !== "NGN" && (
                                    <p className="text-xs text-muted-foreground">
                                      Originally ₦
                                      {selectedTier.originalPrice.toLocaleString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="md:col-span-2">
                                <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                                  Currency
                                </p>
                                <p className="text-sm sm:text-base font-normal text-white">
                                  {currentCurrency.code}
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 sm:mt-4">
                              <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                                Features
                              </p>
                              <ul className="text-sm sm:text-base font-normal text-white space-y-1">
                                {selectedTier.features.map((feature, index) => (
                                  <li key={index}>• {feature}</li>
                                ))}
                              </ul>
                            </div>

                            {selectedTier.services.length > 0 && (
                              <div className="mt-3 sm:mt-4">
                                <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                                  Included Services
                                </p>
                                <ul className="text-sm sm:text-base font-normal text-white space-y-1">
                                  {selectedTier.services.map(
                                    (service, index) => (
                                      <li key={index}>• {service.name}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {formData.specialRequests && (
                          <div className="bg-card p-3 sm:p-4 rounded-lg border border-muted/50">
                            <h3 className="font-normal text-base sm:text-lg text-white mb-3 sm:mb-4">
                              Special Requests
                            </h3>
                            <p className="text-sm sm:text-base font-normal text-white">
                              {formData.specialRequests}
                            </p>
                          </div>
                        )}

                        <div>
                          <h3 className="font-normal text-base sm:text-lg text-white mb-3 sm:mb-4">
                            Payment Method
                          </h3>
                          <RadioGroup
                            value={formData.paymentMethod}
                            onValueChange={handleRadioChange}
                            className="flex flex-col space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="card"
                                id="card"
                                className="text-secondary-light focus:ring-secondary-light"
                              />
                              <Label
                                htmlFor="card"
                                className="text-xs sm:text-sm font-normal text-white"
                              >
                                Credit/Debit Card
                              </Label>
                            </div>
                            {currentCurrency.code === "NGN" && (
                              <>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="transfer"
                                    id="transfer"
                                    className="text-secondary-light focus:ring-secondary-light"
                                  />
                                  <Label
                                    htmlFor="transfer"
                                    className="text-xs sm:text-sm font-normal text-white"
                                  >
                                    Bank Transfer
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="ussd"
                                    id="ussd"
                                    className="text-secondary-light focus:ring-secondary-light"
                                  />
                                  <Label
                                    htmlFor="ussd"
                                    className="text-xs sm:text-sm font-normal text-white"
                                  >
                                    USSD
                                  </Label>
                                </div>
                              </>
                            )}
                          </RadioGroup>
                        </div>
                      </div>

                      <div className="mt-6 sm:mt-8 flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          className="border-secondary-light text-xs sm:text-sm text-white hover:bg-secondary-light/10 hover:text-secondary-light font-normal px-4 sm:px-6 py-2 sm:py-3"
                        >
                          Previous Step
                        </Button>
                        <Button
                          type="submit"
                          className="bg-gold-gradient hover:bg-secondary-light/80 text-black text-xs sm:text-sm font-normal px-4 sm:px-6 py-2 sm:py-3"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing
                            </>
                          ) : (
                            `Proceed to Payment (${
                              currentCurrency.symbol
                            }${selectedTier?.convertedPrice.toFixed(2)})`
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
