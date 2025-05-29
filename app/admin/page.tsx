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
  Plane,
  Star,
  Heart,
  Calendar,
  Shield,
  Loader2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
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
  const [chartData, setChartData] = useState<ChartDataResponse | null>(null);

  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [chartsRef, chartsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [bookingsRef, bookingsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        setError(null);

        const statsData = await apiClient.getAdminStats();
        setApiStats(statsData);

        const dashboardStats: DashboardStat[] = [
          {
            title: "Travel Bookings",
            value: statsData.totalBookings.toString(),
            change: statsData.bookingGrowth,
            icon: <Plane className="h-5 w-5 text-gold-accent" />,
          },
          {
            title: "Active Members",
            value: statsData.totalUsers.toString(),
            change: statsData.userGrowth,
            icon: <Star className="h-5 w-5 text-gold-accent" />,
          },
          {
            title: "Membership Revenue",
            value: formatCurrency(statsData.totalRevenue),
            change: statsData.revenueGrowth,
            icon: <Heart className="h-5 w-5 text-gold-accent" />,
          },
          {
            title: "Event Bookings",
            value: statsData.activePackages.toString(),
            change: statsData.packageGrowth,
            icon: <Calendar className="h-5 w-5 text-gold-accent" />,
          },
        ];
        setStats(dashboardStats);

        const bookingsResponse = await apiClient.getBookings({ limit: 5 });
        setRecentBookings(bookingsResponse);
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
        const data = await apiClient.getChartData(timeframe);
        setChartData(data);
      } catch (err: any) {
        console.error("Error fetching chart data:", err);
        setError(err.message || "Failed to load chart data");
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
      case "in progress":
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
      <div className="flex h-[600px] w-full items-center justify-center bg-background">
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
      <div className="p-6 bg-background">
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
    <div className="space-y-6 bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <h1 className="text-2xl sm:text-3xl font-cinzel font-bold uppercase tracking-widest text-secondary">
          Luxury Concierge Dashboard
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
          <Button
            size="sm"
            className="gold-gradient text-black hover:opacity-90"
          >
            Generate Report
          </Button>
        </div>
      </motion.div>

      <motion.div
        ref={statsRef}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
          >
            <Card className="overflow-hidden bg-card elegant-shadow border-gold-accent/20">
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
                    from last {timeframe}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        ref={chartsRef}
        initial={{ opacity: 0, y: 40 }}
        animate={chartsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8 }}
      >
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
                variant={
                  timeframe === Timeframe.monthly ? "default" : "outline"
                }
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
                      tickFormatter={(value) =>
                        `₦${(value / 1000).toFixed(1)}k`
                      }
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
      </motion.div>

      <motion.div
        ref={bookingsRef}
        initial={{ opacity: 0, y: 40 }}
        animate={bookingsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8 }}
      >
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
                          {booking.service?.name || "Unknown Service"}
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
                        colSpan={5}
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
      </motion.div>
    </div>
  );
}
