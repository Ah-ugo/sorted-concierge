"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  apiClient,
  type Booking,
  type User,
  type Service,
  type BookingUpdate,
} from "@/lib/api";
import { ArrowLeft, Trash2 } from "lucide-react";

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
];

interface BookingDetails {
  booking: Booking;
  user: User | null;
  service: Service | null;
}

export default function BookingDetailsPage() {
  const router = useRouter();
  const params = useParams<{ bookingId: string }>();
  const bookingId = Array.isArray(params.bookingId)
    ? params.bookingId[0]
    : params.bookingId;

  const [details, setDetails] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{
    date: Date | undefined;
    time: string;
    status: string;
    specialRequests: string;
  }>({
    date: undefined,
    time: "",
    status: "",
    specialRequests: "",
  });

  useEffect(() => {
    console.log("Params:", params);
    console.log("Booking ID:", bookingId);
  }, [params, bookingId]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setError("Invalid booking ID");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const booking = await apiClient.getBooking(bookingId);
        const user = await apiClient.getUser(booking.userId).catch(() => null);
        const service = await apiClient
          .getService(booking.serviceId)
          .catch(() => null);

        const bookingDate = new Date(booking.bookingDate);
        const hours = bookingDate.getHours();
        const minutes = bookingDate.getMinutes();
        const period = hours >= 12 ? "PM" : "AM";
        const hours12 = hours % 12 || 12;
        const time = `${hours12.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")} ${period}`;

        setDetails({ booking, user, service });
        setFormData({
          date: bookingDate,
          time,
          status: booking.status,
          specialRequests: booking.specialRequests || "",
        });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load booking details";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleUpdateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a valid date and time",
      });
      return;
    }

    const timeMatch = formData.time.match(/(\d+):(\d+)\s(\w+)/);
    if (!timeMatch) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid time format",
      });
      return;
    }

    const [hours, minutes, period] = timeMatch.slice(1);
    const hours24 =
      period === "PM" && hours !== "12"
        ? parseInt(hours) + 12
        : parseInt(hours);
    const bookingDate = new Date(formData.date);
    bookingDate.setHours(hours24, parseInt(minutes));

    const updateData: BookingUpdate = {
      bookingDate: bookingDate.toISOString(),
      status: formData.status,
      specialRequests: formData.specialRequests,
    };

    try {
      if (!bookingId) throw new Error("No booking ID");

      const updatedBooking = await apiClient.updateBooking(
        bookingId,
        updateData
      );
      setDetails((prev) =>
        prev ? { ...prev, booking: updatedBooking } : null
      );
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Booking updated successfully",
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update booking";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
  };

  const handleDeleteBooking = async () => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      if (!bookingId) throw new Error("No booking ID");

      await apiClient.deleteBooking(bookingId);
      toast({
        title: "Success",
        description: "Booking deleted successfully",
      });
      router.push("/admin/bookings");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete booking";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/bookings")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Booking Details</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 dark:text-red-400">
              {error || "Booking not found."}
            </p>
            <p className="mt-2">
              Please check the booking ID or try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { booking, user, service } = details;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/admin/bookings")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bookings
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          Booking Details: {booking.id}
        </h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Booking Information</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit"}
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDeleteBooking}
              title="Delete Booking"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleUpdateBooking} className="space-y-4">
              <div>
                <Label>Customer</Label>
                <Input
                  value={`${user?.firstName} ${user?.lastName} (${user?.email})`}
                  disabled
                />
              </div>
              <div>
                <Label>Service</Label>
                <Input
                  value={`${service?.name} (₦${service?.price})`}
                  disabled
                />
              </div>
              <div>
                <Label>Booking Date</Label>
                <DatePicker
                  date={formData.date}
                  setDate={(date) => setFormData((prev) => ({ ...prev, date }))}
                  placeholder="Select date"
                />
              </div>
              <div>
                <Label>Booking Time</Label>
                <Select
                  value={formData.time}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, time: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Special Requests</Label>
                <Input
                  value={formData.specialRequests}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      specialRequests: e.target.value,
                    }))
                  }
                  placeholder="Enter any special requests"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          ) : (
            <div className="grid gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Booking ID
                </Label>
                <p>{booking.id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Customer
                </Label>
                <p>
                  {user
                    ? `${user.firstName} ${user.lastName} (${user.email})`
                    : "Unknown"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Service
                </Label>
                <p>
                  {service ? `${service.name} (₦${service.price})` : "Unknown"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Date & Time
                </Label>
                <p>
                  {new Date(booking.bookingDate).toLocaleDateString()} •{" "}
                  {new Date(booking.bookingDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </Label>
                <p>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      booking.status === "Completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : booking.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : booking.status === "Confirmed"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {booking.status}
                  </span>
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Special Requests
                </Label>
                <p>{booking.specialRequests || "None"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Created At
                </Label>
                <p>{new Date(booking.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Updated At
                </Label>
                <p>{new Date(booking.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
