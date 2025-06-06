"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";
import { useCurrency } from "@/lib/currency-context";
import { apiClient, type Service } from "@/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function BookingPage() {
  const { toast } = useToast();
  const { user, token, isAuthenticated } = useAuth();
  const { formatPrice } = useCurrency();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date>();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceId: "",
    date: null as Date | null,
    time: "",
    specialRequests: "",
    paymentMethod: "card",
  });

  useEffect(() => {
    // Fetch services
    const fetchServices = async () => {
      try {
        const data = await apiClient.getServices();
        setServices(data);
      } catch (error: unknown) {
        console.error("Error fetching services:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to load services. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();

    // Pre-fill user data if authenticated
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user, toast]);

  // Update selected service when serviceId changes
  useEffect(() => {
    if (formData.serviceId && services.length > 0) {
      const service = services.find((s) => s.id === formData.serviceId) || null;
      setSelectedService(service);
    } else {
      setSelectedService(null);
    }
  }, [formData.serviceId, services]);

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      setFormData((prev) => ({ ...prev, date }));
    }
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
      if (!formData.serviceId || !formData.date || !formData.time) {
        toast({
          title: "Missing Information",
          description: "Please select a service, date, and time.",
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
        description: "Please log in to book a service.",
        variant: "destructive",
      });
      router.push("/auth/login");
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse time string to get hours and minutes
      const timeMatch = formData.time.match(/(\d+):(\d+)\s*([AP]M)/);
      if (!timeMatch) {
        throw new Error("Invalid time format");
      }

      let hours = Number.parseInt(timeMatch[1], 10);
      const minutes = Number.parseInt(timeMatch[2], 10);
      const period = timeMatch[3];

      // Convert to 24-hour format
      if (period === "PM" && hours < 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }

      // Create a new date object with the selected date and time
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

      const bookingData = {
        userId: user.id,
        serviceId: formData.serviceId,
        bookingDate: bookingDateTime.toISOString(),
        specialRequests: formData.specialRequests,
        status: "pending",
      };

      // Create booking in the database
      await apiClient.createBooking(bookingData);

      // Redirect to the confirmation page
      router.push("/booking/confirmation");
    } catch (error: unknown) {
      console.error("Error creating booking:", error);
      toast({
        title: "Booking Failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <>
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
            <Badge className="mb-4 bg-secondary/20 text-secondary px-3 sm:px-4 py-1 text-xs sm:text-sm font-lora">
              Book Now
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold tracking-widest text-overlay mb-4 sm:mb-6">
              Request Our Concierge Services
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-lora text-overlay mb-6 sm:mb-8">
              Complete the form below to request our services. Our team will
              contact you shortly to confirm your booking.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8 sm:mb-12">
              <div className="flex justify-between items-center">
                <div
                  className={`flex flex-col items-center ${
                    step >= 1 ? "text-secondary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center mb-2 text-xs sm:text-sm ${
                      step >= 1
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    1
                  </div>
                  <span className="text-xs sm:text-sm font-lora">
                    Personal Info
                  </span>
                </div>
                <div
                  className={`flex-1 h-1 mx-2 sm:mx-4 ${
                    step >= 2 ? "bg-secondary" : "bg-muted"
                  }`}
                ></div>
                <div
                  className={`flex flex-col items-center ${
                    step >= 2 ? "text-secondary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center mb-2 text-xs sm:text-sm ${
                      step >= 2
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    2
                  </div>
                  <span className="text-xs sm:text-sm font-lora">
                    Service Details
                  </span>
                </div>
                <div
                  className={`flex-1 h-1 mx-2 sm:mx-4 ${
                    step >= 3 ? "bg-secondary" : "bg-muted"
                  }`}
                ></div>
                <div
                  className={`flex flex-col items-center ${
                    step >= 3 ? "text-secondary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center mb-2 text-xs sm:text-sm ${
                      step >= 3
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    3
                  </div>
                  <span className="text-xs sm:text-sm font-lora">
                    Confirmation
                  </span>
                </div>
              </div>
            </div>

            <Card className="border-border bg-card shadow-sm">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Personal Information */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-cinzel font-bold uppercase tracking-widest text-foreground mb-4 sm:mb-6">
                        Personal Information
                      </h2>

                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <Label
                            htmlFor="name"
                            className="text-xs sm:text-sm font-lora text-foreground"
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
                            className="border-border bg-card text-sm sm:text-base text-foreground focus:border-secondary focus:ring-secondary font-lora"
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="email"
                            className="text-xs sm:text-sm font-lora text-foreground"
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
                            className="border-border bg-card text-sm sm:text-base text-foreground focus:border-secondary focus:ring-secondary font-lora"
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="phone"
                            className="text-xs sm:text-sm font-lora text-foreground"
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
                            className="border-border bg-card text-sm sm:text-base text-foreground focus:border-secondary focus:ring-secondary font-lora"
                          />
                        </div>
                      </div>

                      <div className="mt-6 sm:mt-8 flex justify-end">
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="bg-secondary hover:bg-secondary/90 text-xs sm:text-sm text-secondary-foreground font-lora px-4 sm:px-6 py-2 sm:py-3"
                        >
                          Next Step
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Service Details */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-cinzel font-bold uppercase tracking-widest text-foreground mb-4 sm:mb-6">
                        Service Details
                      </h2>

                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <Label
                            htmlFor="serviceId"
                            className="text-xs sm:text-sm font-lora text-foreground"
                          >
                            Select Service *
                          </Label>
                          <Select
                            onValueChange={(value) =>
                              handleSelectChange("serviceId", value)
                            }
                            value={formData.serviceId}
                          >
                            <SelectTrigger className="border-border bg-card text-sm sm:text-base text-foreground focus:border-secondary focus:ring-secondary font-lora">
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                            <SelectContent className="bg-card text-foreground border-border">
                              {services.map((service) => (
                                <SelectItem
                                  key={service.id}
                                  value={service.id}
                                  className="text-sm sm:text-base font-lora"
                                >
                                  {service.name} - {formatPrice(service.price)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <Label className="text-xs sm:text-sm font-lora text-foreground">
                              Date *
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-lora border-border bg-card text-sm sm:text-base text-foreground",
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
                              <PopoverContent className="w-auto p-0 bg-card border-border">
                                <Calendar
                                  mode="single"
                                  selected={date}
                                  onSelect={handleDateChange}
                                  initialFocus
                                  disabled={(date) => date < new Date()}
                                  className="bg-card text-foreground text-sm sm:text-base"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div>
                            <Label
                              htmlFor="time"
                              className="text-xs sm:text-sm font-lora text-foreground"
                            >
                              Time *
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                handleSelectChange("time", value)
                              }
                              value={formData.time}
                            >
                              <SelectTrigger className="border-border bg-card text-sm sm:text-base text-foreground focus:border-secondary focus:ring-secondary font-lora">
                                <SelectValue placeholder="Select a time" />
                              </SelectTrigger>
                              <SelectContent className="bg-card text-foreground border-border">
                                {timeSlots.map((time) => (
                                  <SelectItem
                                    key={time}
                                    value={time}
                                    className="text-sm sm:text-base font-lora"
                                  >
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label
                            htmlFor="specialRequests"
                            className="text-xs sm:text-sm font-lora text-foreground"
                          >
                            Special Requests
                          </Label>
                          <Textarea
                            id="specialRequests"
                            name="specialRequests"
                            value={formData.specialRequests}
                            onChange={handleChange}
                            placeholder="Any special requirements or additional information"
                            rows={4}
                            className="border-border bg-card text-sm sm:text-base text-foreground focus:border-secondary focus:ring-secondary font-lora"
                          />
                        </div>
                      </div>

                      <div className="mt-6 sm:mt-8 flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          className="border-secondary text-xs sm:text-sm text-foreground hover:bg-secondary/10 hover:text-secondary font-lora px-4 sm:px-6 py-2 sm:py-3"
                        >
                          Previous Step
                        </Button>
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="bg-secondary hover:bg-secondary/90 text-xs sm:text-sm text-secondary-foreground font-lora px-4 sm:px-6 py-2 sm:py-3"
                        >
                          Next Step
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Confirmation */}
                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-cinzel font-bold uppercase tracking-widest text-foreground mb-4 sm:mb-6">
                        Confirm Your Booking
                      </h2>

                      <div className="space-y-4 sm:space-y-6">
                        <div className="bg-card p-3 sm:p-4 rounded-lg border-border">
                          <h3 className="font-lora text-base sm:text-lg text-foreground mb-3 sm:mb-4">
                            Personal Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <p className="text-xs sm:text-sm text-muted-foreground font-lora">
                                Name
                              </p>
                              <p className="text-sm sm:text-base font-lora">
                                {formData.name}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm text-muted-foreground font-lora">
                                Email
                              </p>
                              <p className="text-sm sm:text-base font-lora">
                                {formData.email}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm text-muted-foreground font-lora">
                                Phone
                              </p>
                              <p className="text-sm sm:text-base font-lora">
                                {formData.phone}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-card p-3 sm:p-4 rounded-lg border-border">
                          <h3 className="font-lora text-base sm:text-lg text-foreground mb-3 sm:mb-4">
                            Service Details
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <p className="text-xs sm:text-sm text-muted-foreground font-lora">
                                Service
                              </p>
                              <p className="text-sm sm:text-base font-lora">
                                {selectedService?.name}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm text-muted-foreground font-lora">
                                Price
                              </p>
                              <p className="text-sm sm:text-base font-lora">
                                {formatPrice(selectedService?.price || 0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm text-muted-foreground font-lora">
                                Date
                              </p>
                              <p className="text-sm sm:text-base font-lora">
                                {formData.date
                                  ? format(formData.date, "PPP")
                                  : ""}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm text-muted-foreground font-lora">
                                Time
                              </p>
                              <p className="text-sm sm:text-base font-lora">
                                {formData.time}
                              </p>
                            </div>
                          </div>

                          {formData.specialRequests && (
                            <div className="mt-3 sm:mt-4">
                              <p className="text-xs sm:text-sm text-muted-foreground font-lora">
                                Special Requests
                              </p>
                              <p className="text-sm sm:text-base font-lora">
                                {formData.specialRequests}
                              </p>
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="font-lora text-base sm:text-lg text-foreground mb-3 sm:mb-4">
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
                                className="text-secondary focus:ring-secondary"
                              />
                              <Label
                                htmlFor="card"
                                className="text-xs sm:text-sm font-lora text-foreground"
                              >
                                Credit/Debit Card
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="transfer"
                                id="transfer"
                                className="text-secondary focus:ring-secondary"
                              />
                              <Label
                                htmlFor="transfer"
                                className="text-xs sm:text-sm font-lora text-foreground"
                              >
                                Bank Transfer
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="cash"
                                id="cash"
                                className="text-secondary focus:ring-secondary"
                              />
                              <Label
                                htmlFor="cash"
                                className="text-xs sm:text-sm font-lora text-foreground"
                              >
                                Cash on Delivery
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
                          className="border-secondary text-xs sm:text-sm text-foreground hover:bg-secondary/10 hover:text-secondary font-lora px-4 sm:px-6 py-2 sm:py-3"
                        >
                          Previous Step
                        </Button>
                        <Button
                          type="submit"
                          className="bg-secondary hover:bg-secondary/90 text-xs sm:text-sm text-secondary-foreground font-lora px-4 sm:px-6 py-2 sm:py-3"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                              Processing
                            </>
                          ) : (
                            "Confirm Booking"
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

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <Badge className="mb-3 sm:mb-4 bg-secondary/20 text-secondary px-3 sm:px-4 py-1 text-xs sm:text-sm font-lora">
                FAQs
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-foreground mb-3 sm:mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-sm sm:text-base md:text-lg font-lora text-muted-foreground">
                Find answers to common questions about our booking process and
                services.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm">
                <h3 className="font-lora text-base sm:text-lg text-foreground mb-2">
                  How far in advance should I book?
                </h3>
                <p className="text-sm sm:text-base font-lora text-muted-foreground">
                  We recommend booking at least 24-48 hours in advance for most
                  services. For special events or during peak seasons, earlier
                  booking is advised.
                </p>
              </div>

              <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm">
                <h3 className="font-lora text-base sm:text-lg text-foreground mb-2">
                  What is your cancellation policy?
                </h3>
                <p className="text-sm sm:text-base font-lora text-muted-foreground">
                  Cancellations made 24 hours or more before the scheduled
                  service will receive a full refund. Cancellations within 24
                  hours may be subject to a cancellation fee.
                </p>
              </div>

              <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm">
                <h3 className="font-lora text-base sm:text-lg text-foreground mb-2">
                  Can I modify my booking after confirmation?
                </h3>
                <p className="text-sm sm:text-base font-lora text-muted-foreground">
                  Yes, you can modify your booking by contacting our concierge
                  team. Changes are subject to availability and may affect
                  pricing.
                </p>
              </div>

              <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm">
                <h3 className="font-lora text-base sm:text-lg text-foreground mb-2">
                  How do I pay for services?
                </h3>
                <p className="text-sm sm:text-base font-lora text-muted-foreground">
                  We accept credit/debit cards, bank transfers, and cash
                  payments. For most services, a deposit or full payment is
                  required at the time of booking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
