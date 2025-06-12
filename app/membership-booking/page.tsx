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
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";
import { useCurrency } from "@/lib/currency-context";
import { apiClient, type Package, type SubscriptionInitiate } from "@/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface ConvertedPackage extends Package {
  convertedPrice: number;
  currency: string;
}

export default function MembershipBookingPage() {
  const { toast } = useToast();
  const { user, token, isAuthenticated } = useAuth();
  const { formatPrice, changeCurrency, currentCurrency, currencies } =
    useCurrency();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [packages, setPackages] = useState<ConvertedPackage[]>([]);
  const [selectedPackage, setSelectedPackage] =
    useState<ConvertedPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    packageId: "",
    paymentMethod: "card",
  });

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        const data = await apiClient.getPackages();
        const convertedPackages = await Promise.all(
          data.map(async (pkg: Package) => {
            let convertedPrice = pkg.price;
            if (currentCurrency.code !== "NGN") {
              try {
                const response = await apiClient.getConvertedPrice(
                  pkg.id,
                  currentCurrency.code
                );
                convertedPrice = response.convertedPrice;
              } catch {
                const targetCurrency = currencies.find(
                  (c) => c.code === currentCurrency.code
                );
                if (targetCurrency) {
                  convertedPrice = pkg.price * targetCurrency.rate;
                }
              }
            }
            if (isNaN(convertedPrice) || convertedPrice <= 0) {
              convertedPrice = pkg.price;
            }
            return {
              ...pkg,
              convertedPrice,
              currency: currentCurrency.code,
            };
          })
        );
        setPackages(convertedPackages);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load packages. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();

    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user, toast, currentCurrency.code, currencies]);

  useEffect(() => {
    if (formData.packageId && packages.length > 0) {
      const pkg = packages.find((p) => p.id === formData.packageId) || null;
      setSelectedPackage(pkg);
    } else {
      setSelectedPackage(null);
    }
  }, [formData.packageId, packages]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
    } else if (step === 2) {
      if (!formData.packageId) {
        toast({
          title: "Missing Information",
          description: "Please select a service package.",
          variant: "destructive",
        });
        return;
      }
    }
    setStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !token || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to subscribe to a service.",
        variant: "destructive",
      });
      router.push("/auth/login");
      return;
    }
    setIsSubmitting(true);
    try {
      const subscriptionData: SubscriptionInitiate = {
        userId: user.id,
        packageId: formData.packageId,
        preferredCurrency: currentCurrency.code,
      };
      const { payment_url } = await apiClient.initiateSubscriptionPayment(
        subscriptionData
      );
      window.location.href = payment_url;
    } catch {
      toast({
        title: "Subscription Failed",
        description:
          "There was an error processing your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
            alt="Membership Hero"
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
              Join Now
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-widest text-white mb-4 sm:mb-6">
              Book a Service
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-normal text-muted-foreground mb-6 sm:mb-8">
              Select a service package and enjoy exclusive benefits. Complete
              the form below to start your booking.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 sm:mb-12">
              <div className="flex justify-between items-center">
                <div
                  className={`flex flex-col items-center ${
                    step >= 1 ? "text-secondary-light" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center mb-2 text-xs sm:text-sm ${
                      step >= 1
                        ? "bg-secondary-light text-black"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    1
                  </div>
                  <span className="text-xs sm:text-sm font-normal">
                    Personal Info
                  </span>
                </div>
                <div
                  className={`flex-1 h-1 mx-2 sm:mx-4 ${
                    step >= 2 ? "bg-secondary-light" : "bg-muted"
                  }`}
                ></div>
                <div
                  className={`flex flex-col items-center ${
                    step >= 2 ? "text-secondary-light" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center mb-2 text-xs sm:text-sm ${
                      step >= 2
                        ? "bg-secondary-light text-black"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    2
                  </div>
                  <span className="text-xs sm:text-sm font-normal">
                    Package Selection
                  </span>
                </div>
                <div
                  className={`flex-1 h-1 mx-2 sm:mx-4 ${
                    step >= 3 ? "bg-secondary-light" : "bg-muted"
                  }`}
                ></div>
                <div
                  className={`flex flex-col items-center ${
                    step >= 3 ? "text-secondary-light" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center mb-2 text-xs sm:text-sm ${
                      step >= 3
                        ? "bg-secondary-light text-black"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    3
                  </div>
                  <span className="text-xs sm:text-sm font-normal">
                    Confirmation
                  </span>
                </div>
              </div>
            </div>

            <Card className="border-muted/50 bg-card shadow-sm">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold uppercase tracking-widest text-white mb-4 sm:mb-6">
                        Personal Information
                      </h2>
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <Label
                            htmlFor="name"
                            className="text-xs sm:text-sm font-normal text-muted-foreground"
                          >
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                            className="border-muted/50 bg-card text-sm sm:text-base text-white focus:border-secondary-light focus:ring-secondary-light font-normal"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="email"
                            className="text-xs sm:text-sm font-normal text-muted-foreground"
                          >
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email address"
                            required
                            className="border-muted/50 bg-card text-sm sm:text-base text-white focus:border-secondary-light focus:ring-secondary-light font-normal"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="phone"
                            className="text-xs sm:text-sm font-normal text-muted-foreground"
                          >
                            Phone Number *
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            required
                            className="border-muted/50 bg-card text-sm sm:text-base text-white focus:border-secondary-light focus:ring-secondary-light font-normal"
                          />
                        </div>
                      </div>
                      <div className="mt-6 sm:mt-8 flex justify-end">
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="bg-gold-gradient hover:bg-secondary-light/80 text-black text-xs sm:text-sm font-normal px-4 sm:px-6 py-2 sm:py-3"
                        >
                          Next Step
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
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold uppercase tracking-widest text-white mb-4 sm:mb-6">
                        Select Service Package
                      </h2>
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <Label
                            htmlFor="packageId"
                            className="text-xs sm:text-sm font-normal text-muted-foreground"
                          >
                            Select Package *
                          </Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {packages.map((pkg) => (
                              <Card
                                key={pkg.id}
                                className={`border ${
                                  formData.packageId === pkg.id
                                    ? "border-secondary-light"
                                    : "border-muted/50"
                                } cursor-pointer hover:border-secondary-light/50 transition-colors`}
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    packageId: pkg.id,
                                  }))
                                }
                              >
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="text-base sm:text-lg font-semibold text-white">
                                        {pkg.name}
                                      </h3>
                                      <p className="text-sm sm:text-base font-normal text-muted-foreground">
                                        {formatPrice(
                                          pkg.convertedPrice,
                                          pkg.currency
                                        )}{" "}
                                        / {pkg.duration}
                                      </p>
                                      <p className="text-xs sm:text-sm font-normal text-muted-foreground mt-2">
                                        {pkg.description}
                                      </p>
                                      <ul className="mt-2 space-y-1">
                                        {pkg.features.map((feature, index) => (
                                          <li
                                            key={index}
                                            className="text-xs sm:text-sm font-normal text-white"
                                          >
                                            • {feature}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    {pkg.isPopular && (
                                      <Badge className="bg-secondary-light text-black">
                                        Popular
                                      </Badge>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
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
                              <SelectItem value="NGN">NGN</SelectItem>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                            </SelectContent>
                          </Select>
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
                          className="bg-gold-gradient hover:bg-secondary-light/80 text-black text-xs sm:text-sm font-normal px-4 sm:px-6 py-2 sm:py-3"
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
                        Confirm Your Service
                      </h2>
                      <div className="space-y-4 sm:space-y-6">
                        <div className="bg-card p-3 sm:p-4 rounded-lg border-muted/50">
                          <h3 className="font-normal text-base sm:text-lg text-white mb-3 sm:mb-4">
                            Personal Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                                Name
                              </p>
                              <p className="text-sm sm:text-base font-normal">
                                {formData.name}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                                Email
                              </p>
                              <p className="text-sm sm:text-base font-normal">
                                {formData.email}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                                Phone
                              </p>
                              <p className="text-sm sm:text-base font-normal">
                                {formData.phone}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-card p-3 sm:p-4 rounded-lg border-muted/50">
                          <h3 className="font-normal text-base sm:text-lg text-white mb-3 sm:mb-4">
                            Package Details
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                                Package
                              </p>
                              <p className="text-sm sm:text-base font-normal">
                                {selectedPackage?.name}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                                Price
                              </p>
                              <p className="text-sm sm:text-base font-normal">
                                {formatPrice(
                                  selectedPackage?.convertedPrice || 0,
                                  selectedPackage?.currency
                                )}{" "}
                                / {selectedPackage?.duration}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                                Currency
                              </p>
                              <p className="text-sm sm:text-base font-normal">
                                {currentCurrency.code}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 sm:mt-4">
                            <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                              Features
                            </p>
                            <ul className="text-sm sm:text-base font-normal">
                              {selectedPackage?.features.map(
                                (feature, index) => (
                                  <li key={index}>• {feature}</li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
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
                            "Proceed to Payment"
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

      <section className="py-12 sm:py-16 md:py-20 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <Badge className="mb-3 sm:mb-4 bg-secondary-light/20 text-secondary-light px-3 sm:px-4 py-1 text-xs sm:text-sm font-normal">
                FAQs
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-widest text-white mb-3 sm:mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-sm sm:text-base md:text-lg font-normal text-muted-foreground">
                Find answers to common questions about our service packages.
              </p>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border-muted/50">
                <h3 className="font-normal text-base sm:text-lg text-white mb-2">
                  What are the benefits of a service?
                </h3>
                <p className="text-sm sm:text-base font-normal text-muted-foreground">
                  Service packages offer exclusive benefits such as priority
                  booking, discounted services, and access to special events.
                  Each package has unique features tailored to your needs.
                </p>
              </div>
              <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border-muted/50">
                <h3 className="font-normal text-base sm:text-lg text-white mb-2">
                  Can I cancel my service?
                </h3>
                <p className="text-sm sm:text-base font-normal text-muted-foreground">
                  Yes, you can cancel your service by contacting our support
                  team. Cancellation policies vary by package, and some may
                  include a minimum commitment period.
                </p>
              </div>
              <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border-muted/50">
                <h3 className="font-normal text-base sm:text-lg text-white mb-2">
                  How do I upgrade or downgrade my service?
                </h3>
                <p className="text-sm sm:text-base font-normal text-muted-foreground">
                  You can upgrade or downgrade your service by contacting our
                  concierge team. Changes take effect at the start of the next
                  billing cycle.
                </p>
              </div>
              <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border-muted/50">
                <h3 className="font-normal text-base sm:text-lg text-white mb-2">
                  What payment methods are accepted?
                </h3>
                <p className="text-sm sm:text-base font-normal text-muted-foreground">
                  We accept credit/debit cards and bank transfers for service
                  subscriptions. Payments are processed securely through our
                  payment gateway.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
