"use client";

import type React from "react";
import { Component, type ReactNode, useState, useEffect } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  Calendar,
  User,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { apiClient, type Booking, type BookingUpdate } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center font-lora text-red-500">
          Something went wrong. Please refresh the page.
        </div>
      );
    }
    return this.props.children;
  }
}

interface EnhancedBooking extends Booking {
  userEmail?: string;
  serviceCategoryName?: string;
  serviceName?: string;
  categoryType?: "tiered" | "contact_only";
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<EnhancedBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<EnhancedBooking[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<EnhancedBooking | null>(null);
  const [editBooking, setEditBooking] = useState<BookingUpdate>({});
  const [cardRef, cardInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const statuses = ["pending", "confirmed", "completed", "cancelled"];

  // Helper function to enhance bookings with additional data
  const enhanceBookingWithDetails = async (
    booking: Booking
  ): Promise<EnhancedBooking> => {
    const enhanced: EnhancedBooking = { ...booking };

    try {
      // Get user email by userId
      if (booking.userId) {
        try {
          const user = await apiClient.getUser(booking.userId);
          enhanced.userEmail = user.email;
        } catch (error) {
          console.warn(`Failed to fetch user ${booking.userId}:`, error);
          enhanced.userEmail = "Unknown";
        }
      }

      // Handle service-based bookings (both tiered and contact-only)
      if (booking.serviceId) {
        try {
          const service = await apiClient.getServiceCategory(booking.serviceId);
          enhanced.serviceName = service.name;

          // Get service category from the service
          if (service.id) {
            try {
              const category = await apiClient.getServiceCategory(service.id);
              enhanced.serviceCategoryName = category.name;
              enhanced.categoryType = category.category_type;
              console.log(service, "service===");

              // For tiered categories, also get tier info if service has tier_id
              if (category.category_type === "tiered" && service.tier.id) {
                try {
                  const tier = await apiClient.getServiceTier(service.tier_id);
                  enhanced.serviceName = `${tier.name} - ${service.name}`;
                  enhanced.tier = { name: tier.name, price: tier.price };
                } catch (error) {
                  console.warn(
                    `Failed to fetch tier ${service.tier_id}:`,
                    error
                  );
                }
              }
              // For contact-only categories, service is directly under category
              // No additional processing needed, serviceName and categoryName are already set
            } catch (error) {
              console.warn(
                `Failed to fetch category ${service.category_id}:`,
                error
              );
              enhanced.serviceCategoryName = "Unknown Category";
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch service ${booking.serviceId}:`, error);
          enhanced.serviceName = "Unknown Service";
        }
      }

      // Handle direct tier bookings (tier_booking type) - when booking directly through a tier
      if (booking.tierId && !booking.serviceId) {
        try {
          const tier = await apiClient.getServiceTier(booking.tierId);
          enhanced.serviceName = tier.name;
          enhanced.tier = { name: tier.name, price: tier.price };

          // Get tier's category
          if (tier.category_id) {
            try {
              const category = await apiClient.getServiceCategory(
                tier.category_id
              );
              enhanced.serviceCategoryName = category.name;
              enhanced.categoryType = category.category_type;
            } catch (error) {
              console.warn(
                `Failed to fetch category ${tier.category_id}:`,
                error
              );
              enhanced.serviceCategoryName = "Unknown Category";
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch tier ${booking.tierId}:`, error);
          enhanced.serviceName = "Unknown Tier";
        }
      }
    } catch (error) {
      console.warn(`Error enhancing booking ${booking.id}:`, error);
    }

    return enhanced;
  };

  const enhanceBookingsWithDetails = async (
    bookings: Booking[]
  ): Promise<EnhancedBooking[]> => {
    const enhancedBookings: EnhancedBooking[] = [];

    for (const booking of bookings) {
      const enhanced = await enhanceBookingWithDetails(booking);
      enhancedBookings.push(enhanced);
    }

    return enhancedBookings;
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const bookingsData = await apiClient.getBookings();
      // Validate data
      const validBookings = bookingsData.filter(
        (booking: Booking) => booking?.id && booking?.userId
      );
      if (validBookings.length < bookingsData.length) {
        console.warn(
          `Filtered out ${
            bookingsData.length - validBookings.length
          } invalid bookings`
        );
      }

      // Enhance bookings with additional details
      const enhancedBookings = await enhanceBookingsWithDetails(validBookings);

      setBookings(enhancedBookings);
      setFilteredBookings(enhancedBookings);
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch bookings",
        className: "font-lora",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let result = bookings;

    if (searchTerm) {
      result = result.filter(
        (booking) =>
          (booking?.id?.toLowerCase()?.includes(searchTerm.toLowerCase()) ??
            false) ||
          (booking?.userEmail
            ?.toLowerCase()
            ?.includes(searchTerm.toLowerCase()) ??
            false) ||
          (booking?.serviceCategoryName
            ?.toLowerCase()
            ?.includes(searchTerm.toLowerCase()) ??
            false) ||
          (booking?.serviceName
            ?.toLowerCase()
            ?.includes(searchTerm.toLowerCase()) ??
            false) ||
          (booking.service?.name
            ?.toLowerCase()
            ?.includes(searchTerm.toLowerCase()) ??
            false) ||
          (booking.tier?.name
            ?.toLowerCase()
            ?.includes(searchTerm.toLowerCase()) ??
            false)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((booking) => booking.status === statusFilter);
    }

    setFilteredBookings(result);
  }, [searchTerm, statusFilter, bookings]);

  const handleViewBooking = async (booking: EnhancedBooking) => {
    // Ensure booking has enhanced details before viewing
    if (!booking.userEmail || !booking.serviceCategoryName) {
      const enhanced = await enhanceBookingWithDetails(booking);
      setSelectedBooking(enhanced);
    } else {
      setSelectedBooking(booking);
    }
    setIsViewModalOpen(true);
  };

  const handleEditBooking = (booking: EnhancedBooking) => {
    setSelectedBooking(booking);
    setEditBooking({
      bookingDate: booking.bookingDate.split("T")[0],
      status: booking.status,
      specialRequests: booking.specialRequests,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    try {
      const updatedBooking = await apiClient.updateBooking(
        selectedBooking.id,
        editBooking
      );

      // Enhance the updated booking
      const enhancedUpdated = await enhanceBookingWithDetails(updatedBooking);

      setBookings((prev) =>
        prev.map((b) => (b.id === selectedBooking.id ? enhancedUpdated : b))
      );
      setFilteredBookings((prev) =>
        prev.map((b) => (b.id === selectedBooking.id ? enhancedUpdated : b))
      );
      setIsEditModalOpen(false);
      setSelectedBooking(null);
      toast({
        title: "Success",
        description: "Booking updated successfully",
        className: "font-lora",
      });
      await fetchBookings();
    } catch (error: any) {
      console.error("Error updating booking:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update booking",
        className: "font-lora",
      });
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!bookingId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid booking ID",
        className: "font-lora",
      });
      return;
    }

    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      await apiClient.deleteBooking(bookingId);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      setFilteredBookings((prev) => prev.filter((b) => b.id !== bookingId));
      toast({
        title: "Success",
        description: "Booking deleted successfully",
        className: "font-lora",
      });
      await fetchBookings();
    } catch (error: any) {
      console.error("Error deleting booking:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete booking",
        className: "font-lora",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-600/20 text-yellow-500 border-yellow-500/30 font-lora";
      case "confirmed":
        return "bg-blue-600/20 text-blue-500 border-blue-500/30 font-lora";
      case "completed":
        return "bg-green-600/20 text-green-500 border-green-500/30 font-lora";
      case "cancelled":
        return "bg-red-600/20 text-red-500 border-red-500/30 font-lora";
      default:
        return "bg-gray-600/20 text-gray-500 border-gray-500/30 font-lora";
    }
  };

  const getCategoryTypeColor = (type?: "tiered" | "contact_only") => {
    if (!type) return "bg-gray-100 text-gray-800";
    return type === "tiered"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <h1 className="text-2xl sm:text-3xl font-cinzel font-bold uppercase tracking-widest text-secondary">
            Bookings Management
          </h1>
        </motion.div>

        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 40 }}
          animate={cardInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Card className="bg-card elegant-shadow border-gold-accent/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
                Manage Bookings
                <motion.div
                  className="h-0.5 bg-gradient-to-r from-transparent via-gold-accent to-transparent mt-2"
                  initial={{ width: 0 }}
                  animate={cardInView ? { width: "100px" } : {}}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gold-accent" />
                  <Input
                    type="search"
                    placeholder="Search by booking ID, user email, service category, or service..."
                    className="pl-8 bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-primary/10 border-gold-accent/20 text-foreground font-lora">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-gold-accent/20">
                    <SelectItem value="all" className="font-lora">
                      All Statuses
                    </SelectItem>
                    {statuses.map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="font-lora"
                      >
                        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-accent border-t-transparent" />
                </div>
              ) : (
                <div className="overflow-x-auto rounded-md border border-gold-accent/20">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-card hover:bg-card">
                        <TableHead className="font-lora text-foreground">
                          Booking
                        </TableHead>
                        <TableHead className="font-lora text-foreground">
                          User Email
                        </TableHead>
                        <TableHead className="font-lora text-foreground">
                          Service Category
                        </TableHead>
                        <TableHead className="font-lora text-foreground">
                          Service
                        </TableHead>
                        <TableHead className="font-lora text-foreground">
                          Type
                        </TableHead>
                        <TableHead className="font-lora text-foreground">
                          Date
                        </TableHead>
                        <TableHead className="font-lora text-foreground">
                          Status
                        </TableHead>
                        <TableHead className="text-right font-lora text-foreground">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking, index) => (
                          <motion.tr
                            key={booking.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={cardInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="hover:bg-gold-accent/5"
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gold-accent" />
                                <div>
                                  <div className="font-lora text-foreground">
                                    {booking?.id
                                      ? booking.id.substring(0, 8) + "..."
                                      : "N/A"}
                                  </div>
                                  <div className="text-xs font-lora text-muted-foreground">
                                    Created:{" "}
                                    {booking.createdAt
                                      ? new Date(
                                          booking.createdAt
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-lora text-foreground">
                              {booking.userEmail || "Loading..."}
                            </TableCell>
                            <TableCell className="font-lora text-foreground">
                              {booking.serviceCategoryName || "Loading..."}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-lora text-foreground">
                                  {booking.serviceName ||
                                    booking.service?.name ||
                                    booking.tier?.name ||
                                    "Loading..."}
                                </div>
                                {booking.tier && (
                                  <div className="text-xs font-lora text-muted-foreground">
                                    Tier - ₦
                                    {booking.tier.price.toLocaleString()}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={getCategoryTypeColor(
                                  booking.categoryType
                                )}
                              >
                                {booking.categoryType === "tiered"
                                  ? "Tiered"
                                  : booking.categoryType === "contact_only"
                                  ? "Contact Only"
                                  : "Unknown"}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-lora text-foreground">
                              {booking.bookingDate
                                ? new Date(
                                    booking.bookingDate
                                  ).toLocaleDateString()
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status?.charAt(0)?.toUpperCase() +
                                  booking.status?.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gold-accent hover:bg-gold-accent/10"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="bg-card border-gold-accent/20"
                                >
                                  <DropdownMenuLabel className="font-lora text-secondary">
                                    Actions
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator className="bg-gold-accent/20" />
                                  <DropdownMenuItem
                                    className="font-lora"
                                    onClick={() => handleViewBooking(booking)}
                                  >
                                    <Eye className="mr-2 h-4 w-4 text-gold-accent" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="font-lora"
                                    onClick={() => handleEditBooking(booking)}
                                  >
                                    <Edit className="mr-2 h-4 w-4 text-gold-accent" />
                                    Edit Booking
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-gold-accent/20" />
                                  <DropdownMenuItem
                                    className="font-lora text-red-500"
                                    onClick={() =>
                                      handleDeleteBooking(booking.id)
                                    }
                                  >
                                    <Trash className="mr-2 h-4 w-4 text-red-500" />
                                    Delete Booking
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </motion.tr>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            className="h-24 text-center font-lora text-muted-foreground italic"
                          >
                            No bookings found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* View Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl bg-card border-gold-accent/20">
            <DialogHeader>
              <DialogTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
                Booking Details
              </DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gold-accent" />
                      <div>
                        <p className="text-sm font-lora font-medium text-foreground">
                          Booking ID
                        </p>
                        <p className="text-sm font-lora text-muted-foreground">
                          {selectedBooking?.id ?? "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gold-accent" />
                      <div>
                        <p className="text-sm font-lora font-medium text-foreground">
                          User Email
                        </p>
                        <p className="text-sm font-lora text-muted-foreground">
                          {selectedBooking?.userEmail ?? "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gold-accent" />
                      <div>
                        <p className="text-sm font-lora font-medium text-foreground">
                          Booking Date
                        </p>
                        <p className="text-sm font-lora text-muted-foreground">
                          {selectedBooking?.bookingDate
                            ? new Date(
                                selectedBooking.bookingDate
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-lora font-medium text-foreground">
                        Service Category
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm font-lora text-muted-foreground">
                          {selectedBooking.serviceCategoryName || "N/A"}
                        </p>
                        {selectedBooking.categoryType && (
                          <Badge
                            className={getCategoryTypeColor(
                              selectedBooking.categoryType
                            )}
                          >
                            {selectedBooking.categoryType === "tiered"
                              ? "Tiered"
                              : "Contact Only"}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-lora font-medium text-foreground">
                        Service
                      </p>
                      {selectedBooking.service ? (
                        <div className="mt-1">
                          <p className="text-sm font-lora text-foreground">
                            {selectedBooking.service.name}
                          </p>
                          <p className="text-xs font-lora text-muted-foreground">
                            Individual Service
                          </p>
                        </div>
                      ) : selectedBooking.tier ? (
                        <div className="mt-1">
                          <p className="text-sm font-lora text-foreground">
                            {selectedBooking.tier.name}
                          </p>
                          <p className="text-xs font-lora text-muted-foreground">
                            Tier - ₦
                            {selectedBooking.tier.price.toLocaleString()}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm font-lora text-muted-foreground">
                          {selectedBooking.serviceName || "Unknown Service"}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-lora font-medium text-foreground">
                        Status
                      </p>
                      <Badge className={getStatusColor(selectedBooking.status)}>
                        {selectedBooking.status?.charAt(0)?.toUpperCase() +
                          selectedBooking.status?.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-lora font-medium text-foreground">
                        Payment Status
                      </p>
                      <Badge
                        className={
                          selectedBooking.payment_status === "successful"
                            ? "bg-green-600/20 text-green-500"
                            : "bg-yellow-600/20 text-yellow-500"
                        }
                      >
                        {selectedBooking.payment_status || "pending"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {selectedBooking.specialRequests && (
                  <div>
                    <p className="text-sm font-lora font-medium text-foreground mb-2">
                      Special Requests
                    </p>
                    <p className="text-sm font-lora text-muted-foreground bg-primary/10 p-3 rounded-md">
                      {selectedBooking.specialRequests}
                    </p>
                  </div>
                )}

                <div className="border-t border-gold-accent/20 pt-4">
                  <h3 className="font-lora font-medium text-foreground mb-2">
                    Booking Information
                  </h3>
                  <div className="text-sm font-lora text-muted-foreground space-y-1">
                    <p>
                      Created:{" "}
                      {selectedBooking.createdAt
                        ? new Date(selectedBooking.createdAt).toLocaleString()
                        : "N/A"}
                    </p>
                    <p>
                      Last Updated:{" "}
                      {selectedBooking.updatedAt
                        ? new Date(selectedBooking.updatedAt).toLocaleString()
                        : "N/A"}
                    </p>
                    <p>Booking Type: {selectedBooking.booking_type ?? "N/A"}</p>
                    {selectedBooking.payment_amount && (
                      <p>
                        Amount: ₦
                        {selectedBooking.payment_amount.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                onClick={() => setIsViewModalOpen(false)}
                className="gold-gradient text-black hover:opacity-90 font-lora"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl bg-card border-gold-accent/20">
            <DialogHeader>
              <DialogTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
                Edit Booking
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateBooking} className="space-y-4">
              <div>
                <Label
                  htmlFor="bookingDate"
                  className="font-lora text-foreground"
                >
                  Booking Date
                </Label>
                <Input
                  id="bookingDate"
                  type="date"
                  value={editBooking.bookingDate || ""}
                  onChange={(e) =>
                    setEditBooking((prev) => ({
                      ...prev,
                      bookingDate: e.target.value,
                    }))
                  }
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                />
              </div>
              <div>
                <Label htmlFor="status" className="font-lora text-foreground">
                  Status
                </Label>
                <Select
                  value={editBooking.status || ""}
                  onValueChange={(value) =>
                    setEditBooking((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="bg-primary/10 border-gold-accent/20 text-foreground font-lora">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-gold-accent/20">
                    {statuses.map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="font-lora"
                      >
                        {status?.charAt(0)?.toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="specialRequests"
                  className="font-lora text-foreground"
                >
                  Special Requests
                </Label>
                <Textarea
                  id="specialRequests"
                  value={editBooking.specialRequests || ""}
                  onChange={(e) =>
                    setEditBooking((prev) => ({
                      ...prev,
                      specialRequests: e.target.value,
                    }))
                  }
                  placeholder="Enter special requests"
                  rows={3}
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black font-lora"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="gold-gradient text-black hover:opacity-90 font-lora"
                >
                  Update Booking
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  );
}
