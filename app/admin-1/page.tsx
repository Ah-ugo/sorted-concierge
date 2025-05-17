"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Search, Plus, Edit, Trash, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AdminDashboard() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for dashboard
  const stats = {
    totalUsers: 256,
    totalBookings: 1024,
    totalRevenue: "₦15,750,000",
    activePackages: 128,
    userGrowth: 12.5,
    bookingGrowth: 18.3,
    revenueGrowth: 22.7,
    packageGrowth: 8.4,
  }

  // Mock data for charts
  const revenueData = [
    { name: "Jan", total: 1800000 },
    { name: "Feb", total: 2200000 },
    { name: "Mar", total: 2700000 },
    { name: "Apr", total: 2400000 },
    { name: "May", total: 2900000 },
    { name: "Jun", total: 3100000 },
    { name: "Jul", total: 3400000 },
  ]

  const bookingsData = [
    { name: "Jan", bookings: 65 },
    { name: "Feb", bookings: 78 },
    { name: "Mar", bookings: 92 },
    { name: "Apr", bookings: 86 },
    { name: "May", bookings: 99 },
    { name: "Jun", bookings: 112 },
    { name: "Jul", bookings: 120 },
  ]

  const serviceDistributionData = [
    { name: "Transportation", value: 35 },
    { name: "Dining", value: 25 },
    { name: "Events", value: 20 },
    { name: "Lifestyle", value: 15 },
    { name: "Business", value: 5 },
  ]

  // Mock data for bookings
  const bookings = [
    {
      id: "BK-001",
      user: "John Doe",
      service: "Airport Transfer",
      date: "2023-05-15",
      time: "10:00 AM",
      status: "completed",
      amount: "₦25,000",
    },
    {
      id: "BK-002",
      user: "Sarah Johnson",
      service: "Restaurant Reservation",
      date: "2023-05-16",
      time: "07:30 PM",
      status: "confirmed",
      amount: "₦10,000",
    },
    {
      id: "BK-003",
      user: "Michael Brown",
      service: "Chauffeur Service",
      date: "2023-05-17",
      time: "09:00 AM",
      status: "pending",
      amount: "₦45,000",
    },
    {
      id: "BK-004",
      user: "Emily Wilson",
      service: "Event Planning",
      date: "2023-05-20",
      time: "02:00 PM",
      status: "confirmed",
      amount: "₦150,000",
    },
    {
      id: "BK-005",
      user: "David Lee",
      service: "VIP Nightlife Access",
      date: "2023-05-19",
      time: "10:00 PM",
      status: "pending",
      amount: "₦50,000",
    },
  ]

  // Mock data for users
  const users = [
    {
      id: "USR-001",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+234 123 456 7890",
      joinDate: "2023-01-15",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "USR-002",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "+234 234 567 8901",
      joinDate: "2023-02-20",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "USR-003",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "+234 345 678 9012",
      joinDate: "2023-03-10",
      status: "inactive",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "USR-004",
      name: "Emily Wilson",
      email: "emily.wilson@example.com",
      phone: "+234 456 789 0123",
      joinDate: "2023-04-05",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "USR-005",
      name: "David Lee",
      email: "david.lee@example.com",
      phone: "+234 567 890 1234",
      joinDate: "2023-05-01",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Mock data for services
  const services = [
    {
      id: "SRV-001",
      name: "Airport Transfer",
      category: "Transportation",
      price: "₦25,000",
      status: "available",
    },
    {
      id: "SRV-002",
      name: "Restaurant Reservation",
      category: "Dining",
      price: "₦10,000",
      status: "available",
    },
    {
      id: "SRV-003",
      name: "Event Planning",
      category: "Events",
      price: "From ₦150,000",
      status: "available",
    },
    {
      id: "SRV-004",
      name: "Personal Shopping",
      category: "Lifestyle",
      price: "₦35,000",
      status: "available",
    },
    {
      id: "SRV-005",
      name: "Chauffeur Service",
      category: "Transportation",
      price: "₦45,000/day",
      status: "available",
    },
  ]

  // Filter data based on search query
  const filteredBookings = searchQuery
    ? bookings.filter(
        (booking) =>
          booking.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.id.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : bookings

  const filteredUsers = searchQuery
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.id.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : users

  const filteredServices = searchQuery
    ? services.filter(
        (service) =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.id.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : services

  // Handle actions
  const handleAction = (action: string, type: string, id: string) => {
    toast({
      title: `${action} ${type}`,
      description: `Successfully ${action.toLowerCase()}ed ${type.toLowerCase()} with ID: ${id}`,
      action: (
        <div className="h-8 w-8 bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle className="h-5 w-5 text-green-500" />
        </div>
      ),
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Admin Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              <Button asChild variant="outline">
                <Link href="/">View Website</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">{/* Dashboard content */}</TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Bookings Management</CardTitle>
                <div className="flex items-center space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Booking
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>{booking.user}</TableCell>
                        <TableCell>{booking.service}</TableCell>
                        <TableCell>
                          {booking.date} at {booking.time}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              booking.status === "completed"
                                ? "bg-green-500"
                                : booking.status === "confirmed"
                                  ? "bg-blue-500"
                                  : booking.status === "cancelled"
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{booking.amount}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAction("Edit", "Booking", booking.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAction("Delete", "Booking", booking.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                            {booking.status === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-500 border-green-500 hover:bg-green-50"
                                onClick={() => handleAction("Confirm", "Booking", booking.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Users Management</CardTitle>
                <div className="flex items-center space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                              <Image
                                src={user.avatar || "/placeholder.svg"}
                                alt={user.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span>{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>
                          <Badge className={user.status === "active" ? "bg-green-500" : "bg-gray-500"}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleAction("Edit", "User", user.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleAction("Delete", "User", user.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                            {user.status === "inactive" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-500 border-green-500 hover:bg-green-50"
                                onClick={() => handleAction("Activate", "User", user.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 border-red-500 hover:bg-red-50"
                                onClick={() => handleAction("Deactivate", "User", user.id)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Services Management</CardTitle>
                <div className="flex items-center space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="transportation">Transportation</SelectItem>
                      <SelectItem value="dining">Dining</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Service
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Service Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.id}</TableCell>
                        <TableCell>{service.name}</TableCell>
                        <TableCell>{service.category}</TableCell>
                        <TableCell>{service.price}</TableCell>
                        <TableCell>
                          <Badge className={service.status === "available" ? "bg-green-500" : "bg-gray-500"}>
                            {service.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAction("Edit", "Service", service.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAction("Delete", "Service", service.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                            {service.status === "available" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 border-red-500 hover:bg-red-50"
                                onClick={() => handleAction("Disable", "Service", service.id)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-500 border-green-500 hover:bg-green-50"
                                onClick={() => handleAction("Enable", "Service", service.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
