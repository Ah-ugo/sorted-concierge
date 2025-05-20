"use client";

import React, { useState, useEffect } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Search, Filter, Download, Plus } from "lucide-react";
import { apiClient, Booking, Service, User, BookingCreate } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

interface DisplayBooking extends Booking {
  customer?: string;
  email?: string;
  serviceName?: string;
  amount?: string;
}

// Predefined time slots (adjust as needed)
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

export default function BookingsPage() {
  const [bookings, setBookings] = useState<DisplayBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<DisplayBooking[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const itemsPerPage = 10;

  // Form state for new booking
  const [newBooking, setNewBooking] = useState<{
    userId: string;
    serviceId: string;
    date: Date | undefined;
    time: string;
    status: string;
    specialRequests: string;
  }>({
    userId: "",
    serviceId: "",
    date: new Date(),
    time: timeSlots[0],
    status: "Pending",
    specialRequests: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const bookingsData = await apiClient.getBookings();
        const usersData = await apiClient.getUsers();
        const servicesData = await apiClient.getServices();
        setUsers(usersData);
        setServices(servicesData);

        const enrichedBookings: DisplayBooking[] = bookingsData.map(
          (booking) => {
            const user = usersData.find((u) => u.id === booking.userId);
            const service = servicesData.find(
              (s) => s.id === booking.serviceId
            );
            return {
              ...booking,
              customer: user ? `${user.firstName} ${user.lastName}` : "Unknown",
              email: user?.email || "N/A",
              serviceName: service?.name || "Unknown",
              amount: service ? `₦${service.price}` : "N/A",
            };
          }
        );

        setBookings(enrichedBookings);
        setFilteredBookings(enrichedBookings);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch bookings",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = bookings;

    if (searchTerm) {
      result = result.filter(
        (booking) =>
          booking.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.serviceName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((booking) => booking.status === statusFilter);
    }

    if (dateFilter) {
      const filterDate = dateFilter.toISOString().split("T")[0];
      result = result.filter((booking) =>
        booking.bookingDate.startsWith(filterDate)
      );
    }

    setFilteredBookings(result);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter, bookings]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter(undefined);
  };

  const exportToCSV = () => {
    toast({
      title: "Export",
      description: "Export to CSV functionality would go here",
    });
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.date || !newBooking.userId || !newBooking.serviceId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all required fields",
      });
      return;
    }

    // Combine date and time into ISO string
    const [hours, minutes, period] = newBooking.time
      .match(/(\d+):(\d+)\s(\w+)/)!
      .slice(1);
    const hours24 =
      period === "PM" && hours !== "12"
        ? parseInt(hours) + 12
        : parseInt(hours);
    const bookingDate = new Date(newBooking.date);
    bookingDate.setHours(hours24, parseInt(minutes));

    const bookingData: BookingCreate = {
      userId: newBooking.userId,
      serviceId: newBooking.serviceId,
      bookingDate: bookingDate.toISOString(),
      status: newBooking.status,
      specialRequests: newBooking.specialRequests,
    };

    try {
      const createdBooking = await apiClient.createBooking(bookingData);
      const user = users.find((u) => u.id === createdBooking.userId);
      const service = services.find((s) => s.id === createdBooking.serviceId);
      const enrichedBooking: DisplayBooking = {
        ...createdBooking,
        customer: user ? `${user.firstName} ${user.lastName}` : "Unknown",
        email: user?.email || "N/A",
        serviceName: service?.name || "Unknown",
        amount: service ? `₦${service.price}` : "N/A",
      };
      setBookings((prev) => [enrichedBooking, ...prev]);
      setFilteredBookings((prev) => [enrichedBooking, ...prev]);
      setIsModalOpen(false);
      setNewBooking({
        userId: "",
        serviceId: "",
        date: new Date(),
        time: timeSlots[0],
        status: "Pending",
        specialRequests: "",
      });
      toast({
        title: "Success",
        description: "Booking created successfully",
      });
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create booking",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
        <Button
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>New Booking</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Manage Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search by customer, ID, or service..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <DatePicker
                date={dateFilter}
                setDate={setDateFilter}
                placeholder="Filter by date"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetFilters}
                  title="Reset filters"
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={exportToCSV}
                  title="Export to CSV"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Service
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Date & Time
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Amount
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.length > 0 ? (
                      currentItems.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">
                            {booking.id}
                          </TableCell>
                          <TableCell>
                            <div>{booking.customer}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 md:hidden">
                              {booking.serviceName}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 md:hidden">
                              {new Date(
                                booking.bookingDate
                              ).toLocaleDateString()}{" "}
                              •{" "}
                              {new Date(booking.bookingDate).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {booking.serviceName}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(booking.bookingDate).toLocaleDateString()}
                            <br />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(booking.bookingDate).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </TableCell>
                          <TableCell>
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
                            <div className="text-xs text-gray-500 dark:text-gray-400 md:hidden mt-1">
                              {booking.amount}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {booking.amount}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8"
                              asChild
                            >
                              <Link href={`/admin/bookings/${booking.id}`}>
                                View
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No bookings found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((prev) =>
                              prev > 1 ? prev - 1 : prev
                            )
                          }
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (page) =>
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        )
                        .map((page, i, array) => (
                          <React.Fragment key={page}>
                            {i > 0 && array[i - 1] !== page - 1 && (
                              <PaginationItem>
                                <span className="px-4 py-2">...</span>
                              </PaginationItem>
                            )}
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={page === currentPage}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          </React.Fragment>
                        ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((prev) =>
                              prev < totalPages ? prev + 1 : prev
                            )
                          }
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Booking</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateBooking} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Customer
              </label>
              <Select
                value={newBooking.userId}
                onValueChange={(value) =>
                  setNewBooking((prev) => ({ ...prev, userId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Service
              </label>
              <Select
                value={newBooking.serviceId}
                onValueChange={(value) =>
                  setNewBooking((prev) => ({ ...prev, serviceId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} (₦{service.price})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Booking Date
              </label>
              <DatePicker
                date={newBooking.date}
                setDate={(date) => setNewBooking((prev) => ({ ...prev, date }))}
                placeholder="Select date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Booking Time
              </label>
              <Select
                value={newBooking.time}
                onValueChange={(value) =>
                  setNewBooking((prev) => ({ ...prev, time: value }))
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <Select
                value={newBooking.status}
                onValueChange={(value) =>
                  setNewBooking((prev) => ({ ...prev, status: value }))
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Special Requests
              </label>
              <Input
                value={newBooking.specialRequests}
                onChange={(e) =>
                  setNewBooking((prev) => ({
                    ...prev,
                    specialRequests: e.target.value,
                  }))
                }
                placeholder="Enter any special requests"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !newBooking.userId ||
                  !newBooking.serviceId ||
                  !newBooking.date
                }
              >
                Create Booking
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
