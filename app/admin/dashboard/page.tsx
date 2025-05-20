"use client";

import type * as React from "react";
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
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// Import the new types from the API client
import {
  apiClient,
  type AdminStats,
  type Booking,
  type ChartDataResponse,
  Timeframe,
} from "@/lib/api";

interface DashboardStat {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>(Timeframe.weekly);
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [apiStats, setApiStats] = useState<AdminStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  // Replace the useState declarations for bookingData and revenueData with:
  const [chartData, setChartData] = useState<ChartDataResponse | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch admin stats
        const statsData = await apiClient.getAdminStats();
        setApiStats(statsData);

        // Transform API data into dashboard stats
        const dashboardStats: DashboardStat[] = [
          {
            title: "Total Bookings",
            value: statsData.totalBookings.toString(),
            change: statsData.bookingGrowth,
            icon: <Calendar className="h-5 w-5 text-blue-500" />,
          },
          {
            title: "Active Users",
            value: statsData.totalUsers.toString(),
            change: statsData.userGrowth,
            icon: <Users className="h-5 w-5 text-green-500" />,
          },
          {
            title: "Revenue",
            value: formatCurrency(statsData.totalRevenue),
            change: statsData.revenueGrowth,
            icon: <DollarSign className="h-5 w-5 text-yellow-500" />,
          },
          {
            title: "Active Packages",
            value: statsData.activePackages.toString(),
            change: statsData.packageGrowth,
            icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
          },
        ];
        setStats(dashboardStats);

        // Fetch recent bookings
        const bookingsResponse = await apiClient.getBookings({ limit: 5 });
        setRecentBookings(bookingsResponse);

        // Generate booking and revenue data based on timeframe
        //generateChartData(timeframe)
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Replace the useEffect that calls generateChartData with:
  useEffect(() => {
    // Fetch chart data when timeframe changes
    async function fetchChartData() {
      try {
        const data = await apiClient.getChartData(timeframe);
        setChartData(data);
      } catch (err: any) {
        console.error("Error fetching chart data:", err);
        setError(err.message || "Failed to load chart data");
      }
    }

    fetchChartData();
  }, [timeframe]);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Remove the generateChartData function entirely
  // Generate chart data based on bookings and timeframe
  // const generateChartData = (timeframe: "weekly" | "monthly") => {
  //   // In a real implementation, you would fetch this data from the API
  //   // For now, we'll generate it based on the timeframe
  //   if (timeframe === "weekly") {
  //     setBookingData([
  //       { name: "Mon", bookings: 12, completed: 8 },
  //       { name: "Tue", bookings: 19, completed: 12 },
  //       { name: "Wed", bookings: 15, completed: 10 },
  //       { name: "Thu", bookings: 22, completed: 18 },
  //       { name: "Fri", bookings: 27, completed: 22 },
  //       { name: "Sat", bookings: 18, completed: 15 },
  //       { name: "Sun", bookings: 14, completed: 10 },
  //     ])

  //     setRevenueData([
  //       { name: "Mon", revenue: 120000 },
  //       { name: "Tue", revenue: 190000 },
  //       { name: "Wed", revenue: 150000 },
  //       { name: "Thu", revenue: 220000 },
  //       { name: "Fri", revenue: 270000 },
  //       { name: "Sat", revenue: 180000 },
  //       { name: "Sun", revenue: 140000 },
  //     ])
  //   } else {
  //     setBookingData([
  //       { name: "Week 1", bookings: 45, completed: 32 },
  //       { name: "Week 2", bookings: 52, completed: 40 },
  //       { name: "Week 3", bookings: 68, completed: 55 },
  //       { name: "Week 4", bookings: 74, completed: 60 },
  //     ])

  //     setRevenueData([
  //       { name: "Week 1", revenue: 450000 },
  //       { name: "Week 2", revenue: 520000 },
  //       { name: "Week 3", revenue: 680000 },
  //       { name: "Week 4", revenue: 740000 },
  //     ])
  //   }
  // }

  // Format booking date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-900";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-900";
      case "in progress":
      case "confirmed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-900";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-900";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
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
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/bookings">View All Bookings</Link>
          </Button>
          <Button size="sm">Generate Report</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="rounded-full p-1">{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center pt-1 text-xs">
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
                <span className="ml-1 text-gray-500 dark:text-gray-400">
                  from last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="bookings" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button
              variant={timeframe === Timeframe.weekly ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(Timeframe.weekly)}
            >
              Weekly
            </Button>
            <Button
              variant={timeframe === Timeframe.monthly ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(Timeframe.monthly)}
            >
              Monthly
            </Button>
          </div>
        </div>
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {/* In the JSX for the AreaChart, replace:
                <AreaChart data={bookingData}> */}
                <AreaChart data={chartData?.bookingData || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="bookings"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.2}
                    name="Total Bookings"
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.2}
                    name="Completed"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {/* In the JSX for the BarChart, replace:
                <BarChart data={revenueData}> */}
                <BarChart data={chartData?.revenueData || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) => `₦${(value / 1000).toFixed(1)}k`}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `₦${Number(value).toLocaleString()}`,
                      "Revenue",
                    ]}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                    name="Revenue"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">ID</th>
                  <th className="px-4 py-3 text-left font-medium">Service</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-4 py-3">
                        {booking.id.substring(0, 8)}...
                      </td>
                      <td className="px-4 py-3">
                        {booking.service?.name || "Unknown Service"}
                      </td>
                      <td className="px-4 py-3">
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
                        <Button variant="ghost" size="sm" asChild>
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
                      colSpan={5}
                      className="px-4 py-6 text-center text-muted-foreground"
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
