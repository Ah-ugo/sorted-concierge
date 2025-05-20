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
      } catch (error: any) {
        console.error("Error fetching services:", error);
        toast({
          title: "Error",
          description:
            error.message || "Failed to load services. Please try again.",
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
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
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
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast({
        title: "Booking Failed",
        description:
          error.message ||
          "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[40vh] items-center justify-center">
        <div className="absolute inset-0 bg-neutral-900">
          <div className="h-full w-full bg-[url('/image11.png')] bg-cover bg-center bg-no-repeat opacity-50" />
        </div>
        <div className="container relative z-10 mx-auto my-32 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-teal-400/20 text-teal-400 px-4 py-1">
              Book Now
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Request Our Concierge Services
            </h1>
            <p className="text-white/80 text-lg mb-8">
              Complete the form below to request our services. Our team will
              contact you shortly to confirm your booking.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex justify-between items-center">
                <div
                  className={`flex flex-col items-center ${
                    step >= 1 ? "text-teal-600" : "text-neutral-400"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      step >= 1
                        ? "bg-teal-400 text-neutral-900"
                        : "bg-neutral-200 text-neutral-500"
                    }`}
                  >
                    1
                  </div>
                  <span className="text-sm">Personal Info</span>
                </div>
                <div
                  className={`flex-1 h-1 mx-4 ${
                    step >= 2 ? "bg-teal-400" : "bg-neutral-200"
                  }`}
                ></div>
                <div
                  className={`flex flex-col items-center ${
                    step >= 2 ? "text-teal-600" : "text-neutral-400"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      step >= 2
                        ? "bg-teal-400 text-neutral-900"
                        : "bg-neutral-200 text-neutral-500"
                    }`}
                  >
                    2
                  </div>
                  <span className="text-sm">Service Details</span>
                </div>
                <div
                  className={`flex-1 h-1 mx-4 ${
                    step >= 3 ? "bg-teal-400" : "bg-neutral-200"
                  }`}
                ></div>
                <div
                  className={`flex flex-col items-center ${
                    step >= 3 ? "text-teal-600" : "text-neutral-400"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      step >= 3
                        ? "bg-teal-400 text-neutral-900"
                        : "bg-neutral-200 text-neutral-500"
                    }`}
                  >
                    3
                  </div>
                  <span className="text-sm">Confirmation</span>
                </div>
              </div>
            </div>

            <Card className="border-none shadow-lg">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Personal Information */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-light uppercase tracking-wider mb-6">
                        Personal Information
                      </h2>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email address"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            required
                          />
                        </div>
                      </div>

                      <div className="mt-8 flex justify-end">
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="bg-teal-400 hover:bg-teal-500 text-neutral-900"
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
                      <h2 className="text-2xl font-light uppercase tracking-wider mb-6">
                        Service Details
                      </h2>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="serviceId">Select Service *</Label>
                          <Select
                            onValueChange={(value) =>
                              handleSelectChange("serviceId", value)
                            }
                            value={formData.serviceId}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                            <SelectContent>
                              {services.map((service) => (
                                <SelectItem key={service.id} value={service.id}>
                                  {service.name} - {formatPrice(service.price)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Date *</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
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
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={date}
                                  onSelect={handleDateChange}
                                  initialFocus
                                  disabled={(date) => date < new Date()}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div>
                            <Label htmlFor="time">Time *</Label>
                            <Select
                              onValueChange={(value) =>
                                handleSelectChange("time", value)
                              }
                              value={formData.time}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a time" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeSlots.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="specialRequests">
                            Special Requests
                          </Label>
                          <Textarea
                            id="specialRequests"
                            name="specialRequests"
                            value={formData.specialRequests}
                            onChange={handleChange}
                            placeholder="Any special requirements or additional information"
                            rows={4}
                          />
                        </div>
                      </div>

                      <div className="mt-8 flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          className="border-teal-400 text-teal-600 hover:bg-teal-50"
                        >
                          Previous Step
                        </Button>
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="bg-teal-400 hover:bg-teal-500 text-neutral-900"
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
                      <h2 className="text-2xl font-light uppercase tracking-wider mb-6">
                        Confirm Your Booking
                      </h2>

                      <div className="space-y-6">
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <h3 className="font-medium text-lg mb-4">
                            Personal Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-neutral-500">Name</p>
                              <p>{formData.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-neutral-500">Email</p>
                              <p>{formData.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-neutral-500">Phone</p>
                              <p>{formData.phone}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <h3 className="font-medium text-lg mb-4">
                            Service Details
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-neutral-500">
                                Service
                              </p>
                              <p>{selectedService?.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-neutral-500">Price</p>
                              <p>{formatPrice(selectedService?.price || 0)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-neutral-500">Date</p>
                              <p>
                                {formData.date
                                  ? format(formData.date, "PPP")
                                  : ""}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-neutral-500">Time</p>
                              <p>{formData.time}</p>
                            </div>
                          </div>

                          {formData.specialRequests && (
                            <div className="mt-4">
                              <p className="text-sm text-neutral-500">
                                Special Requests
                              </p>
                              <p>{formData.specialRequests}</p>
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="font-medium text-lg mb-4">
                            Payment Method
                          </h3>
                          <RadioGroup
                            value={formData.paymentMethod}
                            onValueChange={handleRadioChange}
                            className="flex flex-col space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="card" id="card" />
                              <Label htmlFor="card">Credit/Debit Card</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="transfer" id="transfer" />
                              <Label htmlFor="transfer">Bank Transfer</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="cash" id="cash" />
                              <Label htmlFor="cash">Cash on Delivery</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>

                      <div className="mt-8 flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          className="border-teal-400 text-teal-600 hover:bg-teal-50"
                        >
                          Previous Step
                        </Button>
                        <Button
                          type="submit"
                          className="bg-teal-400 hover:bg-teal-500 text-neutral-900"
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
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-teal-400/20 text-teal-600 px-4 py-1">
                FAQs
              </Badge>
              <h2 className="text-3xl font-light uppercase tracking-widest mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-neutral-600">
                Find answers to common questions about our booking process and
                services.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-medium text-lg mb-2">
                  How far in advance should I book?
                </h3>
                <p className="text-neutral-600">
                  We recommend booking at least 24-48 hours in advance for most
                  services. For special events or during peak seasons, earlier
                  booking is advised.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-medium text-lg mb-2">
                  What is your cancellation policy?
                </h3>
                <p className="text-neutral-600">
                  Cancellations made 24 hours or more before the scheduled
                  service will receive a full refund. Cancellations within 24
                  hours may be subject to a cancellation fee.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-medium text-lg mb-2">
                  Can I modify my booking after confirmation?
                </h3>
                <p className="text-neutral-600">
                  Yes, you can modify your booking by contacting our concierge
                  team. Changes are subject to availability and may affect
                  pricing.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-medium text-lg mb-2">
                  How do I pay for services?
                </h3>
                <p className="text-neutral-600">
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
