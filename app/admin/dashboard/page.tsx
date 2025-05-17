"use client";

import * as React from "react";
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
} from "lucide-react";
import { useState, useEffect } from "react";
import { ChartContainer } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DashboardStat {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

interface Booking {
  id: string;
  customer: string;
  service: string;
  date: string;
  status: "Completed" | "Pending" | "In Progress";
}

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly">("weekly");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats: DashboardStat[] = [
    {
      title: "Total Bookings",
      value: "248",
      change: 12,
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Active Users",
      value: "1,024",
      change: 8,
      icon: <Users className="h-5 w-5 text-green-500" />,
    },
    {
      title: "Revenue",
      value: "₦4.2M",
      change: 15,
      icon: <DollarSign className="h-5 w-5 text-yellow-500" />,
    },
    {
      title: "Growth",
      value: "24%",
      change: -3,
      icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
    },
  ];

  const bookingData =
    timeframe === "weekly"
      ? [
          { name: "Mon", bookings: 12, completed: 8 },
          { name: "Tue", bookings: 19, completed: 12 },
          { name: "Wed", bookings: 15, completed: 10 },
          { name: "Thu", bookings: 22, completed: 18 },
          { name: "Fri", bookings: 27, completed: 22 },
          { name: "Sat", bookings: 18, completed: 15 },
          { name: "Sun", bookings: 14, completed: 10 },
        ]
      : [
          { name: "Week 1", bookings: 45, completed: 32 },
          { name: "Week 2", bookings: 52, completed: 40 },
          { name: "Week 3", bookings: 68, completed: 55 },
          { name: "Week 4", bookings: 74, completed: 60 },
        ];

  const revenueData =
    timeframe === "weekly"
      ? [
          { name: "Mon", revenue: 120000 },
          { name: "Tue", revenue: 190000 },
          { name: "Wed", revenue: 150000 },
          { name: "Thu", revenue: 220000 },
          { name: "Fri", revenue: 270000 },
          { name: "Sat", revenue: 180000 },
          { name: "Sun", revenue: 140000 },
        ]
      : [
          { name: "Week 1", revenue: 450000 },
          { name: "Week 2", revenue: 520000 },
          { name: "Week 3", revenue: 680000 },
          { name: "Week 4", revenue: 740000 },
        ];

  const recentBookings: Booking[] = [
    {
      id: "B-1234",
      customer: "John Doe",
      service: "Airport Pickup",
      date: "2023-05-15",
      status: "Completed",
    },
    {
      id: "B-1235",
      customer: "Jane Smith",
      service: "City Tour",
      date: "2023-05-16",
      status: "Pending",
    },
    {
      id: "B-1236",
      customer: "Robert Johnson",
      service: "Hotel Booking",
      date: "2023-05-17",
      status: "In Progress",
    },
    {
      id: "B-1237",
      customer: "Emily Davis",
      service: "Restaurant Reservation",
      date: "2023-05-18",
      status: "Pending",
    },
    {
      id: "B-1238",
      customer: "Michael Wilson",
      service: "Event Planning",
      date: "2023-05-19",
      status: "Completed",
    },
  ];

  const chartConfig = {
    bookings: { color: "#3b82f6", label: "Bookings" },
    completed: { color: "#10b981", label: "Completed" },
    revenue: { color: "#8b5cf6", label: "Revenue" },
  };

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
              variant={timeframe === "weekly" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("weekly")}
            >
              Weekly
            </Button>
            <Button
              variant={timeframe === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("monthly")}
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
              {!isLoading ? (
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={bookingData}>
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
                      />
                      <Area
                        type="monotone"
                        dataKey="completed"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {!isLoading ? (
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" />
                      <YAxis
                        tickFormatter={(value) =>
                          `₦${(value / 1000).toFixed(1)}k`
                        }
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
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              )}
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
                  <th className="px-4 py-3 text-left font-medium">Customer</th>
                  <th className="px-4 py-3 text-left font-medium">Service</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-3">{booking.id}</td>
                    <td className="px-4 py-3">{booking.customer}</td>
                    <td className="px-4 py-3">{booking.service}</td>
                    <td className="px-4 py-3">{booking.date}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          booking.status === "Completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : booking.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/bookings/${booking.id}`}>View</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
