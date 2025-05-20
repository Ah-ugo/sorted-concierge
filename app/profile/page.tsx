"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload, Calendar, Clock, MapPin, User } from "lucide-react";
import { apiClient, type Booking, type UserUpdate } from "@/lib/api";
import { format } from "date-fns";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function ProfilePage() {
  const {
    user,
    token,
    isLoading: authLoading,
    updateUser,
    uploadProfileImage,
  } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.1]);

  const [profileRef, profileInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (token && activeTab === "bookings") {
      fetchBookings();
    }
  }, [token, activeTab]);

  const fetchBookings = async () => {
    if (!token || !user) return;

    setIsLoadingBookings(true);
    try {
      const data = await apiClient.getBookings();
      setBookings(data);
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to fetch your bookings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const updateData: UserUpdate = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
      };
      const success = await updateUser(updateData);
      if (success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const profileImageUrl = await uploadProfileImage(file);
      if (profileImageUrl) {
        toast({
          title: "Profile Picture Updated",
          description: "Your profile picture has been updated successfully.",
        });
      } else {
        throw new Error("Failed to upload profile picture");
      }
    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      toast({
        title: "Error",
        description:
          error.message ||
          "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "NC";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500";
      case "confirmed":
        return "bg-teal-500";
      case "pending":
        return "bg-amber-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-neutral-500";
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
        <Card className="max-w-md border-none bg-white p-8 shadow-lg">
          <div className="text-center">
            <User className="mx-auto mb-4 h-12 w-12 text-neutral-300" />
            <h2 className="mb-2 text-2xl font-light uppercase tracking-widest text-neutral-800">
              Authentication Required
            </h2>
            <p className="mb-8 text-neutral-600">
              Please log in to view your profile
            </p>
            <Button
              asChild
              className="w-full bg-teal-400 py-6 text-sm font-medium uppercase tracking-widest text-neutral-900 hover:bg-teal-500"
            >
              <Link href="/auth/login">Login</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[40vh] items-center justify-center">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-neutral-900">
            <div className="h-full w-full bg-[url('/image14.png')] bg-cover bg-center bg-no-repeat opacity-50" />
          </div>
        </motion.div>

        <div className="container relative z-10 mx-auto my-32 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mx-auto max-w-3xl"
          >
            <p className="mb-4 text-center font-medium uppercase tracking-wider text-white/90">
              YOUR ACCOUNT
            </p>
            <h1 className="mb-6 text-center text-4xl font-bold uppercase tracking-widest text-white md:text-5xl">
              MY PROFILE
            </h1>
            <p className="text-lg text-white/80">
              Manage your account details and view your booking history
            </p>
          </motion.div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="bg-neutral-50 py-32">
        <div className="container mx-auto px-6">
          <motion.div
            ref={profileRef}
            initial={{ opacity: 0, y: 40 }}
            animate={
              profileInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Tabs
              defaultValue="profile"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-12 grid w-full grid-cols-2 bg-neutral-100">
                <TabsTrigger
                  value="profile"
                  className="py-6 text-sm font-medium uppercase tracking-widest data-[state=active]:bg-teal-400 data-[state=active]:text-neutral-900"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="bookings"
                  className="py-6 text-sm font-medium uppercase tracking-widest data-[state=active]:bg-teal-400 data-[state=active]:text-neutral-900"
                >
                  My Bookings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card className="overflow-hidden border-none bg-white shadow-lg">
                  <CardContent className="p-8">
                    <h2 className="mb-8 text-3xl font-light uppercase tracking-widest text-neutral-800">
                      Profile Information
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="flex items-center space-x-6">
                        <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-teal-400/10">
                          {user.profileImage ? (
                            <img
                              src={user.profileImage || "/placeholder.svg"}
                              alt="Profile"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl font-semibold text-teal-600">
                              {getInitials(
                                `${user.firstName} ${user.lastName}`
                              )}
                            </span>
                          )}
                        </div>
                        <div>
                          <Label
                            htmlFor="profileImage"
                            className="cursor-pointer"
                          >
                            <div className="flex items-center space-x-2 text-sm font-medium uppercase tracking-wider text-teal-600 hover:text-teal-700">
                              <Upload className="h-4 w-4" />
                              <span>Change Profile Picture</span>
                            </div>
                            <Input
                              id="profileImage"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileUpload}
                              disabled={isLoading}
                            />
                          </Label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label
                            htmlFor="firstName"
                            className="text-sm font-medium uppercase tracking-wider text-neutral-700"
                          >
                            First Name
                          </Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="border-neutral-300 bg-neutral-50 py-6 text-neutral-800 focus:border-teal-400 focus:ring-teal-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="lastName"
                            className="text-sm font-medium uppercase tracking-wider text-neutral-700"
                          >
                            Last Name
                          </Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="border-neutral-300 bg-neutral-50 py-6 text-neutral-800 focus:border-teal-400 focus:ring-teal-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium uppercase tracking-wider text-neutral-700"
                        >
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled
                          className="border-neutral-300 bg-neutral-100 py-6 text-neutral-600 focus:border-teal-400 focus:ring-teal-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-sm font-medium uppercase tracking-wider text-neutral-700"
                        >
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="border-neutral-300 bg-neutral-50 py-6 text-neutral-800 focus:border-teal-400 focus:ring-teal-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="address"
                          className="text-sm font-medium uppercase tracking-wider text-neutral-700"
                        >
                          Address
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="border-neutral-300 bg-neutral-50 py-6 text-neutral-800 focus:border-teal-400 focus:ring-teal-400"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-teal-400 py-6 text-sm font-medium uppercase tracking-widest text-neutral-900 hover:bg-teal-500"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Update Profile"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bookings">
                <Card className="overflow-hidden border-none bg-white shadow-lg">
                  <CardContent className="p-8">
                    <h2 className="mb-8 text-3xl font-light uppercase tracking-widest text-neutral-800">
                      Your Bookings
                    </h2>

                    {isLoadingBookings ? (
                      <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
                      </div>
                    ) : bookings.length === 0 ? (
                      <div className="py-12 text-center">
                        <Calendar className="mx-auto mb-4 h-12 w-12 text-neutral-300" />
                        <p className="mb-8 text-neutral-600">
                          You have no bookings yet.
                        </p>
                        <Button
                          asChild
                          className="bg-teal-400 px-8 py-6 text-sm font-medium uppercase tracking-widest text-neutral-900 hover:bg-teal-500"
                        >
                          <Link href="/booking">Book a Service</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {bookings.map((booking) => (
                          <Card
                            key={booking.id}
                            className="overflow-hidden border border-neutral-100 bg-neutral-50 p-0 transition-all duration-300 hover:shadow-md"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-4">
                              <div className="bg-neutral-100 p-6 md:col-span-1">
                                <div className="flex flex-col space-y-4">
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-5 w-5 text-teal-600" />
                                    <span className="text-sm text-neutral-600">
                                      {format(
                                        new Date(booking.bookingDate),
                                        "PPP"
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-5 w-5 text-teal-600" />
                                    <span className="text-sm text-neutral-600">
                                      {format(
                                        new Date(booking.bookingDate),
                                        "p"
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="h-5 w-5 text-teal-600" />
                                    <span className="text-sm text-neutral-600">
                                      {booking.location || "Not specified"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="p-6 md:col-span-3">
                                <div className="mb-4 flex items-center justify-between">
                                  <h3 className="text-xl font-light uppercase tracking-wider text-neutral-800">
                                    {booking.service?.name || "Service"}
                                  </h3>
                                  <Badge
                                    className={`${getStatusColor(
                                      booking.status
                                    )} px-3 py-1 text-xs font-medium uppercase tracking-wider text-white`}
                                  >
                                    {booking.status}
                                  </Badge>
                                </div>

                                <p className="mb-6 text-neutral-600">
                                  {booking.specialRequests ||
                                    "No special requests"}
                                </p>

                                {booking.status.toLowerCase() === "pending" && (
                                  <Button
                                    variant="outline"
                                    className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                                    onClick={async () => {
                                      try {
                                        await apiClient.updateBooking(
                                          booking.id,
                                          {
                                            status: "cancelled",
                                          }
                                        );
                                        toast({
                                          title: "Booking Cancelled",
                                          description:
                                            "Your booking has been cancelled successfully.",
                                        });
                                        fetchBookings();
                                      } catch (error: any) {
                                        toast({
                                          title: "Error",
                                          description:
                                            error.message ||
                                            "Failed to cancel booking.",
                                          variant: "destructive",
                                        });
                                      }
                                    }}
                                  >
                                    Cancel Booking
                                  </Button>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative aspect-[21/9] w-full"
        style={{ minHeight: "300px" }}
      >
        <div className="absolute inset-0 bg-neutral-900">
          <div className="h-full w-full bg-[url('/image15.png')] bg-cover bg-center bg-no-repeat opacity-30" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-8 text-3xl font-light uppercase tracking-widest text-white md:text-4xl">
              Experience Our Premium Services
            </h2>
            <Button
              asChild
              className="bg-teal-400 px-8 py-6 text-sm font-medium uppercase tracking-widest text-neutral-900 hover:bg-teal-500"
            >
              <Link href="/booking">Book Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
