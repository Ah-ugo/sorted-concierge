"use client";

import { useState, useEffect } from "react";
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
  CreditCard,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { apiClient, type Subscription, SubscriptionStatus } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<
    Subscription[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const statuses = Object.values(SubscriptionStatus);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const subscriptionsData = await apiClient.getSubscriptions();
      setSubscriptions(subscriptionsData);
      setFilteredSubscriptions(subscriptionsData);
    } catch (error: any) {
      console.error("Error fetching subscriptions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch subscriptions",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Apply filters
    let result = subscriptions;

    if (searchTerm) {
      result = result.filter(
        (subscription) =>
          subscription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subscription.userId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (subscription) => subscription.status === statusFilter
      );
    }

    setFilteredSubscriptions(result);
  }, [searchTerm, statusFilter, subscriptions]);

  const handleDeleteSubscription = async (subscriptionId: string) => {
    if (!confirm("Are you sure you want to delete this subscription?")) return;

    try {
      await apiClient.deleteSubscription(subscriptionId);
      setSubscriptions((prev) => prev.filter((s) => s.id !== subscriptionId));
      setFilteredSubscriptions((prev) =>
        prev.filter((s) => s.id !== subscriptionId)
      );
      toast({
        title: "Success",
        description: "Subscription deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting subscription:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete subscription",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case SubscriptionStatus.active:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case SubscriptionStatus.inactive:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case SubscriptionStatus.cancelled:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Manage Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search by subscription ID or user ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subscription</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.length > 0 ? (
                    filteredSubscriptions.map((subscription) => (
                      <TableRow key={subscription.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-gray-500" />
                            <div>
                              <div className="font-medium">
                                {subscription.id}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Created:{" "}
                                {new Date(
                                  subscription.createdAt
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{subscription.userId}</TableCell>
                        <TableCell>
                          {subscription.package ? (
                            <div>
                              <div className="font-medium">
                                {subscription.package.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                ₦{subscription.package.price.toLocaleString()}
                              </div>
                            </div>
                          ) : (
                            subscription.packageId
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusColor(subscription.status)}
                          >
                            {subscription.status.charAt(0).toUpperCase() +
                              subscription.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(
                            subscription.startDate
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(subscription.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Subscription
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 dark:text-red-400"
                                onClick={() =>
                                  handleDeleteSubscription(subscription.id)
                                }
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete Subscription
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No subscriptions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
