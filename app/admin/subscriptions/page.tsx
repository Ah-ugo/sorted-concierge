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
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
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

  const [cardRef, cardInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
        className: "font-lora",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
        className: "font-lora",
      });
    } catch (error: any) {
      console.error("Error deleting subscription:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete subscription",
        className: "font-lora",
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
    <div className="space-y-6 bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <h1 className="text-2xl sm:text-3xl font-cinzel font-bold uppercase tracking-widest text-secondary">
          Subscription Management
        </h1>
      </motion.div>

      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 40 }}
        animate={cardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="bg-card elegant-shadow border-gold-accent/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
              Manage Subscriptions
              <motion.div
                className="h-0.5 bg-gradient-to-r from-transparent via-gold-accent to-transparent mt-2"
                initial={{ width: 0 }}
                animate={cardInView ? { width: "100px" } : { width: 0 }}
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
                  placeholder="Search by subscription ID or member ID..."
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
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-accent border-t-transparent"></div>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-md border border-gold-accent/20">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gold-accent/20">
                      <TableHead className="font-cinzel uppercase tracking-wider text-secondary">
                        Subscription
                      </TableHead>
                      <TableHead className="font-cinzel uppercase tracking-wider text-secondary">
                        Member ID
                      </TableHead>
                      <TableHead className="font-cinzel uppercase tracking-wider text-secondary">
                        Package
                      </TableHead>
                      <TableHead className="font-cinzel uppercase tracking-wider text-secondary">
                        Status
                      </TableHead>
                      <TableHead className="font-cinzel uppercase tracking-wider text-secondary">
                        Start Date
                      </TableHead>
                      <TableHead className="font-cinzel uppercase tracking-wider text-secondary">
                        End Date
                      </TableHead>
                      <TableHead className="text-right font-cinzel uppercase tracking-wider text-secondary">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.length > 0 ? (
                      filteredSubscriptions.map((subscription, index) => (
                        <motion.tr
                          key={subscription.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={
                            cardInView
                              ? { opacity: 1, y: 0 }
                              : { opacity: 0, y: 20 }
                          }
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="border-b border-gold-accent/20 hover:bg-primary/10"
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-gold-accent" />
                              <div>
                                <div className="font-lora text-foreground">
                                  {subscription.id}
                                </div>
                                <div className="text-xs font-lora text-muted-foreground">
                                  Created:{" "}
                                  {new Date(
                                    subscription.createdAt
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-lora text-muted-foreground">
                            {subscription.userId}
                          </TableCell>
                          <TableCell>
                            {subscription.package ? (
                              <div>
                                <div className="font-lora text-foreground">
                                  {subscription.package.name}
                                </div>
                                <div className="text-xs font-lora text-muted-foreground">
                                  ₦{subscription.package.price.toLocaleString()}
                                </div>
                              </div>
                            ) : (
                              <span className="font-lora text-muted-foreground">
                                {subscription.packageId}
                              </span>
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
                          <TableCell className="font-lora text-muted-foreground">
                            {new Date(
                              subscription.startDate
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-lora text-muted-foreground">
                            {new Date(
                              subscription.endDate
                            ).toLocaleDateString()}
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
                                <DropdownMenuItem className="font-lora">
                                  <Eye className="mr-2 h-4 w-4 text-gold-accent" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="font-lora">
                                  <Edit className="mr-2 h-4 w-4 text-gold-accent" />
                                  Edit Subscription
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-gold-accent/20" />
                                <DropdownMenuItem
                                  className="font-lora text-red-600 dark:text-red-400"
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
                        </motion.tr>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="h-24 text-center font-lora text-muted-foreground italic"
                        >
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
      </motion.div>
    </div>
  );
}
