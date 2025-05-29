"use client";

import type React from "react";
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
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  AlertTriangle,
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  apiClient,
  type EmergencyAlert,
  type EmergencyAlertCreate,
} from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

export default function EmergencyAlertsPage() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<EmergencyAlert[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [cardRef, cardInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [newAlert, setNewAlert] = useState<EmergencyAlertCreate>({
    userId: "",
    message: "",
    location: "",
    status: "Active",
  });

  const statuses = ["Active", "Resolved", "In Progress", "Cancelled"];

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const alertsData = await apiClient.getEmergencyAlerts();
      setAlerts(alertsData);
      setFilteredAlerts(alertsData);
    } catch (error: any) {
      console.error("Error fetching emergency alerts:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch emergency alerts",
        className: "font-lora",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let result = alerts;

    if (searchTerm) {
      result = result.filter(
        (alert) =>
          alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (alert.location &&
            alert.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
          alert.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((alert) => alert.status === statusFilter);
    }

    setFilteredAlerts(result);
  }, [searchTerm, statusFilter, alerts]);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlert.userId || !newAlert.message) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all required fields",
        className: "font-lora",
      });
      return;
    }

    try {
      const createdAlert = await apiClient.createEmergencyAlert(newAlert);
      setAlerts((prev) => [createdAlert, ...prev]);
      setFilteredAlerts((prev) => [createdAlert, ...prev]);
      setIsModalOpen(false);
      setNewAlert({
        userId: "",
        message: "",
        location: "",
        status: "Active",
      });
      toast({
        title: "Success",
        description: "Emergency alert created successfully",
        className: "font-lora",
      });
    } catch (error: any) {
      console.error("Error creating alert:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create emergency alert",
        className: "font-lora",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-red-600/20 text-red-500 border-red-500/30";
      case "In Progress":
        return "bg-yellow-600/20 text-yellow-500 border-yellow-500/30";
      case "Resolved":
        return "bg-green-600/20 text-green-500 border-green-500/30";
      case "Cancelled":
        return "bg-gray-600/20 text-gray-500 border-gray-500/30";
      default:
        return "bg-gray-600/20 text-gray-500 border-gray-500/30";
    }
  };

  const getPriorityIcon = (status: string) => {
    if (status === "Active") {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    return <AlertTriangle className="h-4 w-4 text-gold-accent" />;
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
          Emergency Alerts
        </h1>
        <Button
          size="sm"
          className="flex items-center gap-1 gold-gradient text-black hover:opacity-90 font-lora"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Create Alert</span>
        </Button>
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
              Manage Emergency Alerts
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
                  placeholder="Search by message, location, or ID..."
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
                      {status}
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
                    <TableRow className="bg-card hover:bg-card">
                      <TableHead className="font-lora text-foreground">
                        Alert
                      </TableHead>
                      <TableHead className="font-lora text-foreground">
                        User ID
                      </TableHead>
                      <TableHead className="font-lora text-foreground">
                        Location
                      </TableHead>
                      <TableHead className="font-lora text-foreground">
                        Status
                      </TableHead>
                      <TableHead className="font-lora text-foreground">
                        Created
                      </TableHead>
                      <TableHead className="text-right font-lora text-foreground">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAlerts.length > 0 ? (
                      filteredAlerts.map((alert, index) => (
                        <motion.tr
                          key={alert.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={
                            cardInView
                              ? { opacity: 1, y: 0 }
                              : { opacity: 0, y: 20 }
                          }
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="hover:bg-gold-accent/5"
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getPriorityIcon(alert.status)}
                              <div>
                                <div className="font-lora text-foreground max-w-xs truncate">
                                  {alert.message}
                                </div>
                                <div className="text-xs font-lora text-muted-foreground">
                                  {alert.id}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-lora text-foreground">
                            {alert.userId}
                          </TableCell>
                          <TableCell className="font-lora text-foreground">
                            {alert.location || "Not specified"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`font-lora ${getStatusColor(
                                alert.status
                              )}`}
                            >
                              {alert.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-lora text-foreground">
                            {new Date(alert.createdAt).toLocaleDateString()}
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
                                  Update Status
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-24 text-center font-lora text-muted-foreground italic"
                        >
                          No emergency alerts found.
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

      {/* Create Alert Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl bg-card border-gold-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
              Create Emergency Alert
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateAlert} className="space-y-4">
            <div>
              <Label htmlFor="userId" className="font-lora text-foreground">
                User ID
              </Label>
              <Input
                id="userId"
                value={newAlert.userId}
                onChange={(e) =>
                  setNewAlert((prev) => ({ ...prev, userId: e.target.value }))
                }
                placeholder="Enter user ID"
                className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                required
              />
            </div>
            <div>
              <Label htmlFor="message" className="font-lora text-foreground">
                Alert Message
              </Label>
              <Textarea
                id="message"
                value={newAlert.message}
                onChange={(e) =>
                  setNewAlert((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="Enter emergency alert message"
                className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                rows={3}
                required
              />
            </div>
            <div>
              <Label htmlFor="location" className="font-lora text-foreground">
                Location
              </Label>
              <Input
                id="location"
                value={newAlert.location}
                onChange={(e) =>
                  setNewAlert((prev) => ({ ...prev, location: e.target.value }))
                }
                placeholder="Enter location (optional)"
                className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
              />
            </div>
            <div>
              <Label htmlFor="status" className="font-lora text-foreground">
                Status
              </Label>
              <Select
                value={newAlert.status}
                onValueChange={(value) =>
                  setNewAlert((prev) => ({ ...prev, status: value }))
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
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black font-lora"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="gold-gradient text-black hover:opacity-90 font-lora"
              >
                Create Alert
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
