"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Layers,
  Star,
  DollarSign,
  Calendar,
  Loader2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { apiClient } from "@/lib/api";

interface DashboardStat {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

interface EnhancedBooking {
  id: string;
  userId: string;
  serviceId?: string;
  tierId?: string;
  bookingDate: string;
  status: string;
  specialRequests?: string;
  payment_status?: string;
  payment_amount?: number;
  booking_type: string;
  createdAt: string;
  updatedAt: string;
  // Enhanced fields populated by frontend
  userEmail?: string;
  serviceCategoryName?: string;
  serviceName?: string;
  service?: {
    name: string;
  };
  tier?: {
    name: string;
    price: number;
  };
}

interface AdminStats {
  totalBookings: number;
  totalUsers: number;
  totalBookingRevenue: number;
  totalServiceTiers: number;
  bookingGrowth: number;
  userGrowth: number;
  revenueGrowth: number;
  tierGrowth: number;
}

enum Timeframe {
  weekly = "weekly",
  monthly = "monthly",
}

interface ChartDataResponse {
  bookingData: Array<{
    name: string;
    bookings: number;
    completed: number;
  }>;
  revenueData: Array<{
    name: string;
    revenue: number;
  }>;
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>(Timeframe.weekly);
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [recentBookings, setRecentBookings] = useState<EnhancedBooking[]>([]);
  const [chartData, setChartData] = useState<ChartDataResponse | null>(null);

  // Helper function to enhance bookings with additional data
  const enhanceBookingsWithDetails = async (
    bookings: any[]
  ): Promise<EnhancedBooking[]> => {
    const enhancedBookings: EnhancedBooking[] = [];

    for (const booking of bookings) {
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

        // Get service details and category
        if (booking.serviceId) {
          try {
            const service = await apiClient.getService(booking.serviceId);
            enhanced.serviceName = service.name;

            // Get service category if available
            if (service.category_id) {
              try {
                const category = await apiClient.getServiceCategory(
                  service.category_id
                );
                enhanced.serviceCategoryName = category.name;

                // For contact-only categories, the service is directly under category
                if (category.category_type === "contact_only") {
                  enhanced.serviceCategoryName = category.name;
                }
              } catch (error) {
                console.warn(
                  `Failed to fetch category ${service.category_id}:`,
                  error
                );
                enhanced.serviceCategoryName = "Unknown Category";
              }
            }
          } catch (error) {
            console.warn(
              `Failed to fetch service ${booking.serviceId}:`,
              error
            );
            enhanced.serviceName = "Unknown Service";
          }
        }

        // Get tier details and category (only for tiered categories)
        if (booking.tierId) {
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

      enhancedBookings.push(enhanced);
    }

    return enhancedBookings;
  };

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        setError(null);

        const statsData: AdminStats = await apiClient.getAdminStats();

        const dashboardStats: DashboardStat[] = [
          {
            title: "Total Bookings",
            value: statsData.totalBookings.toString(),
            change: statsData.bookingGrowth,
            icon: <Calendar className="h-5 w-5 text-gold-accent" />,
          },
          {
            title: "Active Users",
            value: statsData.totalUsers.toString(),
            change: statsData.userGrowth,
            icon: <Star className="h-5 w-5 text-gold-accent" />,
          },
          {
            title: "Booking Revenue",
            value: formatCurrency(statsData.totalBookingRevenue),
            change: statsData.revenueGrowth,
            icon: <DollarSign className="h-5 w-5 text-gold-accent" />,
          },
          {
            title: "Service Tiers",
            value: statsData.totalServiceTiers.toString(),
            change: statsData.tierGrowth,
            icon: <Layers className="h-5 w-5 text-gold-accent" />,
          },
        ];
        setStats(dashboardStats);

        // Fetch recent bookings and enhance them with additional details
        const bookingsResponse = await apiClient.getBookings({ limit: 5 });
        const enhancedBookingsData = await enhanceBookingsWithDetails(
          bookingsResponse
        );
        setRecentBookings(enhancedBookingsData);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const data: ChartDataResponse = await apiClient.getChartData(timeframe);
        setChartData(data);
      } catch (err: any) {
        console.error("Error fetching chart data:", err);
      }
    }

    fetchChartData();
  }, [timeframe]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300";
      case "confirmed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-gold-accent" />
          <p className="text-sm font-lora text-muted-foreground">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-cinzel text-secondary">Error</AlertTitle>
          <AlertDescription className="font-lora">{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button
            onClick={() => window.location.reload()}
            className="gold-gradient text-black hover:opacity-90"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-cinzel font-bold uppercase tracking-widest text-secondary">
          Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black"
          >
            <Link href="/admin/bookings">View All Bookings</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="overflow-hidden bg-card elegant-shadow border-gold-accent/20"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-lora uppercase tracking-wider text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="rounded-full p-1 bg-gold-accent/10">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-cinzel font-bold text-secondary">
                {stat.value}
              </div>
              <div className="flex items-center pt-1 text-xs font-lora">
                {stat.change > 0 ? (
                  <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                )}
                <span
                  className={
                    stat.change > 0 ? "text-green-500" : "text-red-500"
                  }
                >
                  {Math.abs(stat.change)}%
                </span>
                <span className="ml-1 text-muted-foreground">
                  from last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="bookings" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="bg-primary/10">
            <TabsTrigger
              value="bookings"
              className="font-lora uppercase tracking-wider text-secondary data-[state=active]:bg-gold-accent data-[state=active]:text-black"
            >
              Bookings
            </TabsTrigger>
            <TabsTrigger
              value="revenue"
              className="font-lora uppercase tracking-wider text-secondary data-[state=active]:bg-gold-accent data-[state=active]:text-black"
            >
              Revenue
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button
              variant={timeframe === Timeframe.weekly ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(Timeframe.weekly)}
              className={`font-lora uppercase tracking-wider ${
                timeframe === Timeframe.weekly
                  ? "gold-gradient text-black"
                  : "border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black"
              }`}
            >
              Weekly
            </Button>
            <Button
              variant={timeframe === Timeframe.monthly ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(Timeframe.monthly)}
              className={`font-lora uppercase tracking-wider ${
                timeframe === Timeframe.monthly
                  ? "gold-gradient text-black"
                  : "border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black"
              }`}
            >
              Monthly
            </Button>
          </div>
        </div>
        <TabsContent value="bookings" className="space-y-4">
          <Card className="bg-card elegant-shadow border-gold-accent/20">
            <CardHeader>
              <CardTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
                Booking Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData?.bookingData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
                  <XAxis dataKey="name" stroke="#ffffff" fontFamily="Lora" />
                  <YAxis stroke="#ffffff" fontFamily="Lora" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #d4af37",
                      color: "#ffffff",
                      fontFamily: "Lora",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="bookings"
                    stroke="#d4af37"
                    fill="#d4af37"
                    fillOpacity={0.2}
                    name="Total Bookings"
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#f0c05a"
                    fill="#f0c05a"
                    fillOpacity={0.2}
                    name="Completed"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="revenue" className="space-y-4">
          <Card className="bg-card elegant-shadow border-gold-accent/20">
            <CardHeader>
              <CardTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
                Revenue Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData?.revenueData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
                  <XAxis dataKey="name" stroke="#ffffff" fontFamily="Lora" />
                  <YAxis
                    tickFormatter={(value) => `₦${(value / 1000).toFixed(1)}k`}
                    stroke="#ffffff"
                    fontFamily="Lora"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #d4af37",
                      color: "#ffffff",
                      fontFamily: "Lora",
                    }}
                    formatter={(value) => [
                      `₦${Number(value).toLocaleString()}`,
                      "Revenue",
                    ]}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#d4af37"
                    radius={[4, 4, 0, 0]}
                    name="Revenue"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-card elegant-shadow border-gold-accent/20">
        <CardHeader>
          <CardTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
            Recent Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-lora">
              <thead>
                <tr className="border-b border-gold-accent/20">
                  <th className="px-4 py-3 text-left font-cinzel uppercase tracking-wider text-secondary">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left font-cinzel uppercase tracking-wider text-secondary">
                    User Email
                  </th>
                  <th className="px-4 py-3 text-left font-cinzel uppercase tracking-wider text-secondary">
                    Service Category
                  </th>
                  <th className="px-4 py-3 text-left font-cinzel uppercase tracking-wider text-secondary">
                    Service
                  </th>
                  <th className="px-4 py-3 text-left font-cinzel uppercase tracking-wider text-secondary">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-cinzel uppercase tracking-wider text-secondary">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-cinzel uppercase tracking-wider text-secondary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-gold-accent/20 hover:bg-primary/10"
                    >
                      <td className="px-4 py-3 text-muted-foreground">
                        {booking.id.substring(0, 8)}...
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {booking.userEmail || "Loading..."}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {booking.serviceCategoryName || "Loading..."}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {booking.serviceName ||
                          booking.service?.name ||
                          booking.tier?.name ||
                          "Loading..."}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(booking.bookingDate)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={getStatusColor(booking.status)}
                          variant="outline"
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="text-gold-accent hover:bg-gold-accent/10"
                        >
                          <Link href={`/admin/bookings/${booking.id}`}>
                            View
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-muted-foreground font-lora italic"
                    >
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
