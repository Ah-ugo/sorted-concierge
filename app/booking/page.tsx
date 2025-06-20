"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import {
  CalendarIcon,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import {
  apiClient,
  type ServiceCategory,
  APIError,
  BookingCreate,
} from "@/lib/api";

export default function Booking() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCategoryId = searchParams.get("categoryId");
  const { user, isAuthenticated, setAuthData } = useAuth();

  const [step, setStep] = useState(isAuthenticated ? 2 : 1);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [date, setDate] = useState<Date>();
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string>("");
  const [authSuccess, setAuthSuccess] = useState<string>("");

  const [formData, setFormData] = useState({
    // Auth fields
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    // Booking fields
    categoryId: preselectedCategoryId || "",
    date: null as Date | null,
    time: "",
    specialRequests: "",
    contactPreference: "email",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
  ];

  useEffect(() => {
    const fetchServiceCategories = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getServiceCategories({
          skip: 0,
          limit: 100,
          category_type: "contact_only",
        });
        const contactOnlyCategories = data.filter(
          (category: ServiceCategory) =>
            category.is_active && category.category_type === "contact_only"
        );
        setServiceCategories(contactOnlyCategories);

        // Auto-select preselected category
        if (preselectedCategoryId) {
          const preselected = contactOnlyCategories.find(
            (cat: ServiceCategory) => cat.id === preselectedCategoryId
          );
          if (preselected) {
            setSelectedCategory(preselected);
            setFormData((prev) => ({
              ...prev,
              categoryId: preselectedCategoryId,
            }));
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load service categories. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServiceCategories();
  }, [preselectedCategoryId, toast]);

  useEffect(() => {
    if (isAuthenticated) {
      setStep(2);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (formData.categoryId && serviceCategories.length > 0) {
      const category = serviceCategories.find(
        (c) => c.id === formData.categoryId
      );
      setSelectedCategory(category || null);
    }
  }, [formData.categoryId, serviceCategories]);

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
      if (!formData.categoryId)
        newErrors.categoryId = "Please select a service category";
      if (!formData.date) newErrors.date = "Please select a date";
      if (!formData.time) newErrors.time = "Please select a time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Separate login function that doesn't redirect
  const handleLogin = async () => {
    if (!validateStep(1)) return;

    setSubmitting(true);
    setAuthError("");
    setAuthSuccess("");

    try {
      const response = await apiClient.login({
        username: formData.email,
        password: formData.password,
      });

      if (response?.access_token && response?.user) {
        // Set auth data without redirecting
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
      setSubmitting(false);
    }
  };

  // Separate register function that doesn't redirect
  const handleRegister = async () => {
    if (!validateStep(1)) return;

    setSubmitting(true);
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
        // Set auth data without redirecting
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
          if (error.details?.detail) {
            errorMessage = Array.isArray(error.details.detail)
              ? error.details.detail.map((e: any) => e.msg).join(", ")
              : error.details.detail;
          }
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
      setSubmitting(false);
    }
  };

  const handleBooking = async () => {
    console.log(selectedCategory, "category");
    if (!validateStep(3)) return;

    setSubmitting(true);
    try {
      // Validate required data
      if (!selectedCategory) {
        throw new Error("No service category selected");
      }

      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      // Create booking date from selected date and time
      const timeMatch = formData.time.match(/(\d+):(\d+)\s*([AP]M)/);
      if (!timeMatch) throw new Error("Invalid time format");

      let hours = Number.parseInt(timeMatch[1], 10);
      const minutes = Number.parseInt(timeMatch[2], 10);
      const period = timeMatch[3];

      if (period === "PM" && hours < 12) hours += 12;
      else if (period === "AM" && hours === 12) hours = 0;

      const bookingDateTime = formData.date
        ? new Date(
            formData.date.getFullYear(),
            formData.date.getMonth(),
            formData.date.getDate(),
            hours,
            minutes,
            0
          )
        : new Date();

      // For category bookings (contact-only), we don't provide serviceId or tierId
      // Instead, we'll use the Airtable booking endpoint which handles category bookings
      // const airtableBookingData = {
      //   clientName: `${user.firstName} ${user.lastName}`,
      //   email: user.email,
      //   phone: user.phone || "",
      //   serviceId: selectedCategory.id, // No specific service for category booking
      //   tierId: null, // No specific tier for category booking
      //   bookingDate: bookingDateTime.toISOString(),
      //   specialRequests: `Category: ${selectedCategory.name}\nPreferences: ${formData.specialRequests}\nContact via: ${formData.contactPreference}`,
      // };

      const bookingData: BookingCreate = {
        userId: user.id,
        serviceId: selectedCategory.id,
        tierId: null,
        bookingDate: new Date().toISOString(),
        status: "pending",
        specialRequests: formData.specialRequests,
        booking_type: "consultation",
        contact_preference: "email",
        payment_required: true,
      };

      console.log("Creating category booking via Airtable:", bookingData);

      await apiClient.createBooking(bookingData);

      toast({
        title: "Booking Successful",
        description: `Your ${selectedCategory?.name} booking has been submitted successfully! Our team will contact you within 24 hours.`,
      });

      router.push("/booking/confirmation");
    } catch (error: any) {
      console.error("Booking error:", error);

      let errorMessage = "Booking failed";

      if (error instanceof APIError) {
        errorMessage = error.message;
        if (error.status === 422) {
          errorMessage = "Please check your booking details and try again";
        } else if (error.status === 400) {
          errorMessage =
            "Invalid booking data. Please review your information.";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Booking Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
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
    } else if (step === 3) {
      handleBooking();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative flex min-h-[40vh] items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/image11.png"
            alt="Booking Hero"
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
              Book Service Category
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-widest text-white mb-4 sm:mb-6">
              Book Premium Experience
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-normal text-muted-foreground mb-6 sm:mb-8">
              Book an entire service category and let our team customize the
              perfect experience for you
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex justify-between items-center">
                {[
                  { number: 1, label: isAuthenticated ? "Account" : "Sign In" },
                  { number: 2, label: "Service Category" },
                  { number: 3, label: "Confirmation" },
                ].map((stepItem, index) => (
                  <div key={stepItem.number} className="flex items-center">
                    <div
                      className={`flex flex-col items-center ${
                        step >= stepItem.number
                          ? "text-secondary"
                          : "text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 text-sm font-bold ${
                          step >= stepItem.number
                            ? "bg-secondary text-black"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {stepItem.number}
                      </div>
                      <span className="text-sm font-crimson_pro">
                        {stepItem.label}
                      </span>
                    </div>
                    {index < 2 && (
                      <div
                        className={`flex-1 h-1 mx-4 ${
                          step > stepItem.number ? "bg-secondary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-card border-0 elegant-shadow">
              <CardContent className="p-8">
                {/* Step 1: Authentication */}
                {step === 1 && !isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-3xl font-cinzel font-bold text-white mb-6 text-center">
                      Welcome to Sorted Concierge
                    </h2>

                    {/* Success/Error Alerts */}
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
                          <Label htmlFor="email" className="text-white">
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            className="bg-card border-muted text-white"
                            placeholder="your.email@example.com"
                          />
                          {errors.email && (
                            <p className="text-red-400 text-sm mt-1">
                              {errors.email}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="password" className="text-white">
                            Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  password: e.target.value,
                                }))
                              }
                              className="bg-card border-muted text-white pr-10"
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
                            <Label htmlFor="firstName" className="text-white">
                              First Name
                            </Label>
                            <Input
                              id="firstName"
                              value={formData.firstName}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  firstName: e.target.value,
                                }))
                              }
                              className="bg-card border-muted text-white"
                              placeholder="John"
                            />
                            {errors.firstName && (
                              <p className="text-red-400 text-sm mt-1">
                                {errors.firstName}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="lastName" className="text-white">
                              Last Name
                            </Label>
                            <Input
                              id="lastName"
                              value={formData.lastName}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  lastName: e.target.value,
                                }))
                              }
                              className="bg-card border-muted text-white"
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
                          <Label htmlFor="email" className="text-white">
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            className="bg-card border-muted text-white"
                            placeholder="your.email@example.com"
                          />
                          {errors.email && (
                            <p className="text-red-400 text-sm mt-1">
                              {errors.email}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-white">
                            Phone (Optional)
                          </Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            className="bg-card border-muted text-white"
                            placeholder="+234 123 456 7890"
                          />
                        </div>
                        <div>
                          <Label htmlFor="password" className="text-white">
                            Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  password: e.target.value,
                                }))
                              }
                              className="bg-card border-muted text-white pr-10"
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
                            className="text-white"
                          >
                            Confirm Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                confirmPassword: e.target.value,
                              }))
                            }
                            className="bg-card border-muted text-white"
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

                    <div className="mt-8 flex justify-end">
                      <Button
                        onClick={nextStep}
                        disabled={submitting}
                        className="bg-gold-gradient text-black hover:bg-secondary/80 px-8 py-3"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
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

                {/* Step 2: Category Selection */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-3xl font-cinzel font-bold text-white mb-6 text-center">
                      Service Category Details
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <Label className="text-white mb-4 block text-lg">
                          Select Service Category
                        </Label>
                        <div className="grid gap-4">
                          {serviceCategories.map((category) => (
                            <Card
                              key={category.id}
                              className={`cursor-pointer transition-all duration-300 ${
                                formData.categoryId === category.id
                                  ? "border-secondary bg-secondary/10"
                                  : "border-muted hover:border-secondary/50"
                              }`}
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  categoryId: category.id,
                                }))
                              }
                            >
                              <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row items-start gap-4">
                                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                      src={
                                        category.image ||
                                        "/placeholder.svg?height=80&width=80"
                                      }
                                      alt={category.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="text-xl font-cinzel font-bold text-white mb-2">
                                      {category.name}
                                    </h3>
                                    <p className="text-muted-foreground text-sm mb-3">
                                      {category.description}
                                    </p>
                                    <Badge
                                      variant="outline"
                                      className="border-secondary text-secondary"
                                    >
                                      Full Category Experience
                                    </Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        {errors.categoryId && (
                          <p className="text-red-400 text-sm mt-2">
                            {errors.categoryId}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white mb-2 block">
                            Preferred Date
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal bg-card border-muted text-white",
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
                            <PopoverContent className="w-auto p-0 bg-card border-muted">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(selectedDate) => {
                                  setDate(selectedDate);
                                  setFormData((prev) => ({
                                    ...prev,
                                    date: selectedDate || null,
                                  }));
                                }}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          {errors.date && (
                            <p className="text-red-400 text-sm mt-1">
                              {errors.date}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label className="text-white mb-2 block">
                            Preferred Time
                          </Label>
                          <select
                            value={formData.time}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                time: e.target.value,
                              }))
                            }
                            className="w-full p-3 bg-card border border-muted rounded-md text-white"
                          >
                            <option value="">Select time</option>
                            {timeSlots.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                          {errors.time && (
                            <p className="text-red-400 text-sm mt-1">
                              {errors.time}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="specialRequests"
                          className="text-white mb-2 block"
                        >
                          Special Requests & Preferences
                        </Label>
                        <Textarea
                          id="specialRequests"
                          value={formData.specialRequests}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              specialRequests: e.target.value,
                            }))
                          }
                          className="bg-card border-muted text-white"
                          rows={4}
                          placeholder="Tell us about your preferences, special requirements, or any specific aspects of the service category you're most interested in..."
                        />
                      </div>

                      <div>
                        <Label className="text-white mb-2 block">
                          Contact Preference
                        </Label>
                        <RadioGroup
                          value={formData.contactPreference}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              contactPreference: value,
                            }))
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="email" id="email-contact" />
                            <Label
                              htmlFor="email-contact"
                              className="text-white"
                            >
                              Email
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="phone" id="phone-contact" />
                            <Label
                              htmlFor="phone-contact"
                              className="text-white"
                            >
                              Phone
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="flex justify-between mt-8">
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="border-secondary text-white hover:bg-secondary/10"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={nextStep}
                        className="bg-gold-gradient text-black hover:bg-secondary/80 px-8 py-3"
                      >
                        Continue
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-3xl font-cinzel font-bold text-white mb-6 text-center">
                      Confirm Your Booking
                    </h2>

                    <div className="space-y-6">
                      {/* Account Info */}
                      <Card className="bg-card/50 border-muted">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-cinzel font-bold text-white mb-4">
                            Contact Information
                          </h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Name:
                              </span>
                              <p className="text-white">
                                {user?.firstName} {user?.lastName}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Email:
                              </span>
                              <p className="text-white">{user?.email}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Service Details */}
                      <Card className="bg-card/50 border-muted">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-cinzel font-bold text-white mb-4">
                            Service Category Details
                          </h3>
                          {selectedCategory && (
                            <div className="space-y-3">
                              <div>
                                <span className="text-muted-foreground">
                                  Service Category:
                                </span>
                                <p className="text-white font-bold">
                                  {selectedCategory.name}
                                </p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Description:
                                </span>
                                <p className="text-white text-sm">
                                  {selectedCategory.description}
                                </p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Date & Time:
                                </span>
                                <p className="text-white">
                                  {formData.date
                                    ? format(formData.date, "PPP")
                                    : ""}{" "}
                                  at {formData.time}
                                </p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Contact Preference:
                                </span>
                                <p className="text-white capitalize">
                                  {formData.contactPreference}
                                </p>
                              </div>
                              {formData.specialRequests && (
                                <div>
                                  <span className="text-muted-foreground">
                                    Special Requests:
                                  </span>
                                  <p className="text-white text-sm">
                                    {formData.specialRequests}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Booking Type Info */}
                      <Card className="bg-secondary/10 border-secondary/20">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-cinzel font-bold text-white mb-4">
                            Booking Information
                          </h3>
                          <div className="space-y-2">
                            <p className="text-white">
                              <strong>Booking Type:</strong> Full Category
                              Experience
                            </p>
                            <p className="text-muted-foreground text-sm">
                              You are booking the entire{" "}
                              {selectedCategory?.name} service category. Our
                              team will contact you within 24 hours to discuss
                              your specific requirements and provide a
                              customized quote.
                            </p>
                            <p className="text-secondary text-sm font-bold">
                              No payment required at booking - we'll discuss
                              pricing during consultation.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex justify-between mt-8">
                      <Button
                        variant="outline"
                        onClick={() => setStep(2)}
                        className="border-secondary text-white hover:bg-secondary/10"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={nextStep}
                        disabled={submitting}
                        className="bg-gold-gradient text-black hover:bg-secondary/80 px-8 py-3"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Processing...
                          </>
                        ) : (
                          "Confirm Booking"
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
