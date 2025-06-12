"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import Image from "next/image";

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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch your bookings. Please try again.",
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
    } catch {
      toast({
        title: "Error",
        description: "Failed to update your profile. Please try again.",
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
    } catch {
      toast({
        title: "Error",
        description: "Failed to upload profile picture. Please try again.",
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
        return "bg-green-600";
      case "confirmed":
        return "bg-secondary-light";
      case "pending":
        return "bg-amber-600";
      case "cancelled":
        return "bg-red-600";
      default:
        return "bg-muted";
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-secondary-light" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-4">
        <Card className="max-w-md border-muted/50 bg-card p-8 shadow-sm">
          <div className="text-center">
            <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-xl sm:text-2xl font-semibold uppercase tracking-widest text-white">
              Authentication Required
            </h2>
            <p className="mb-6 text-sm sm:text-base font-normal text-muted-foreground">
              Please log in to view your profile
            </p>
            <Button
              asChild
              className="w-full bg-gold-gradient text-black py-4 sm:py-6 text-xs sm:text-sm font-normal uppercase tracking-widest hover:bg-secondary-light/80"
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
      <section className="relative flex min-h-[40vh] items-center justify-center">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0"
        >
          <Image
            src="/image14.png"
            alt="Profile Hero"
            fill
            priority
            className="w-full h-full object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>

        <div className="container relative z-10 mx-auto my-24 sm:my-32 px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mx-auto max-w-3xl"
          >
            <p className="mb-4 text-center font-normal uppercase tracking-wider text-white text-xs sm:text-sm">
              YOUR ACCOUNT
            </p>
            <h1 className="mb-6 text-center text-3xl sm:text-4xl md:text-5xl font-semibold uppercase tracking-widest text-white">
              MY PROFILE
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-normal text-muted-foreground">
              Manage your account details and view your booking history
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-black py-16 sm:py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6">
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
              <TabsList className="mb-8 sm:mb-12 grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger
                  value="profile"
                  className="py-4 sm:py-6 text-xs sm:text-sm font-normal uppercase tracking-widest text-white data-[state=active]:bg-gold-gradient data-[state=active]:text-black"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="bookings"
                  className="py-4 sm:py-6 text-xs sm:text-sm font-normal uppercase tracking-widest text-white data-[state=active]:bg-gold-gradient data-[state=active]:text-black"
                >
                  My Bookings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card className="overflow-hidden border-muted/50 bg-card shadow-sm">
                  <CardContent className="p-6 sm:p-8">
                    <h2 className="mb-6 text-2xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-widest text-white">
                      Profile Information
                    </h2>
                    <form
                      onSubmit={handleSubmit}
                      className="space-y-6 sm:space-y-8"
                    >
                      <div className="flex items-center space-x-4 sm:space-x-6">
                        <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-secondary-light/10">
                          {user.profileImage ? (
                            <Image
                              src={
                                user.profileImage ||
                                "/placeholder.svg?height=96&width=96"
                              }
                              alt="Profile"
                              width={96}
                              height={96}
                              className="h-full w-full object-cover"
                              sizes="(max-width: 768px) 24vw, 96px"
                            />
                          ) : (
                            <span className="text-xl sm:text-2xl font-semibold text-secondary-light">
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
                            <div className="flex items-center space-x-2 text-xs sm:text-sm font-normal uppercase tracking-wider text-secondary-light hover:text-secondary-light/80">
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

                      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label
                            htmlFor="firstName"
                            className="text-xs sm:text-sm font-normal uppercase tracking-wider text-muted-foreground"
                          >
                            First Name
                          </Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="border-muted/50 bg-card py-4 sm:py-6 text-sm sm:text-base text-white focus:border-secondary-light focus:ring-secondary-light font-normal"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="lastName"
                            className="text-xs sm:text-sm font-normal uppercase tracking-wider text-muted-foreground"
                          >
                            Last Name
                          </Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="border-muted/50 bg-card py-4 sm:py-6 text-sm sm:text-base text-white focus:border-secondary-light focus:ring-secondary-light font-normal"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-xs sm:text-sm font-normal uppercase tracking-wider text-muted-foreground"
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
                          className="border-muted/50 bg-muted/50 py-4 sm:py-6 text-sm sm:text-base text-muted-foreground focus:border-secondary-light focus:ring-secondary-light font-normal"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-xs sm:text-sm font-normal uppercase tracking-wider text-muted-foreground"
                        >
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="border-muted/50 bg-card py-4 sm:py-6 text-sm sm:text-base text-white focus:border-secondary-light focus:ring-secondary-light font-normal"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="address"
                          className="text-xs sm:text-sm font-normal uppercase tracking-wider text-muted-foreground"
                        >
                          Address
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="border-muted/50 bg-card py-4 sm:py-6 text-sm sm:text-base text-white focus:border-secondary-light focus:ring-secondary-light font-normal"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gold-gradient text-black py-4 sm:py-6 text-xs sm:text-sm font-normal uppercase tracking-widest hover:bg-secondary-light/80"
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
                <Card className="overflow-hidden border-muted/50 bg-card shadow-sm">
                  <CardContent className="p-6 sm:p-8">
                    <h2 className="mb-6 text-2xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-widest text-white">
                      Your Bookings
                    </h2>

                    {isLoadingBookings ? (
                      <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-secondary-light" />
                      </div>
                    ) : bookings.length === 0 ? (
                      <div className="py-12 text-center">
                        <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                        <p className="mb-6 text-sm sm:text-base font-normal text-muted-foreground">
                          You have no bookings yet.
                        </p>
                        <Button
                          asChild
                          className="bg-gold-gradient text-black px-6 sm:px-8 py-4 sm:py-6 text-xs sm:text-sm font-normal uppercase tracking-widest hover:bg-secondary-light/80"
                        >
                          <Link href="/membership-booking">Book a Service</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4 sm:space-y-6">
                        {bookings.map((booking) => (
                          <Card
                            key={booking.id}
                            className="overflow-hidden border-muted/50 bg-card p-0 transition-all duration-300 hover:shadow-md"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-4">
                              <div className="bg-muted/50 p-4 sm:p-6 md:col-span-1">
                                <div className="flex flex-col space-y-3 sm:space-y-4">
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-5 w-5 text-secondary-light" />
                                    <span className="text-xs sm:text-sm text-muted-foreground font-normal">
                                      {format(
                                        new Date(booking.bookingDate),
                                        "PPP"
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-5 w-5 text-secondary-light" />
                                    <span className="text-xs sm:text-sm text-muted-foreground font-normal">
                                      {format(
                                        new Date(booking.bookingDate),
                                        "p"
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="h-5 w-5 text-secondary-light" />
                                    <span className="text-xs sm:text-sm text-muted-foreground font-normal">
                                      {booking.location || "Not specified"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="p-4 sm:p-6 md:col-span-3">
                                <div className="mb-3 sm:mb-4 flex items-center justify-between">
                                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold uppercase tracking-wider text-white">
                                    {booking.service?.name || "Service"}
                                  </h3>
                                  <Badge
                                    className={`${getStatusColor(
                                      booking.status
                                    )} px-2 sm:px-3 py-1 text-xs font-normal uppercase tracking-wider text-white`}
                                  >
                                    {booking.status}
                                  </Badge>
                                </div>

                                <p className="mb-4 sm:mb-6 text-sm sm:text-base font-normal text-muted-foreground">
                                  {booking.specialRequests ||
                                    "No special requests"}
                                </p>

                                {booking.status.toLowerCase() === "pending" && (
                                  <Button
                                    variant="outline"
                                    className="border-red-600 text-red-600 hover:bg-red-600/10 hover:text-red-700 text-xs sm:text-sm font-normal"
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
                                      } catch {
                                        toast({
                                          title: "Error",
                                          description:
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

      <section
        className="relative aspect-[21/9] w-full"
        style={{ minHeight: "300px" }}
      >
        <Image
          src="/image15.png"
          alt="CTA Background"
          fill
          priority
          className="w-full h-full object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-6 text-2xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-widest text-white">
              Experience Our Premium Services
            </h2>
            <Button
              asChild
              className="bg-gold-gradient text-black px-6 sm:px-8 py-4 sm:py-6 text-xs sm:text-sm font-normal uppercase tracking-widest hover:bg-secondary-light/80"
            >
              <Link href="/membership-booking">Book Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
