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
  Trash,
  User,
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
import { apiClient, type CRMClient, type CRMClientCreate } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

export default function CRMPage() {
  const [clients, setClients] = useState<CRMClient[]>([]);
  const [filteredClients, setFilteredClients] = useState<CRMClient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for new client
  const [newClient, setNewClient] = useState<CRMClientCreate>({
    clientName: "",
    contactInfo: { email: "", phone: "" },
    serviceBooked: "",
    status: "New",
    assignedVendor: "",
    notes: "",
    dueDate: "",
  });

  const statuses = ["New", "In Progress", "Completed", "On Hold", "Cancelled"];

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const clientsData = await apiClient.getCRMClients();
      setClients(clientsData);
      setFilteredClients(clientsData);
    } catch (error: any) {
      console.error("Error fetching CRM clients:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch CRM clients",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Apply filters
    let result = clients;

    if (searchTerm) {
      result = result.filter(
        (client) =>
          client.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.serviceBooked
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          client.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((client) => client.status === statusFilter);
    }

    setFilteredClients(result);
  }, [searchTerm, statusFilter, clients]);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newClient.clientName ||
      !newClient.serviceBooked ||
      !newClient.contactInfo.email
    ) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all required fields",
      });
      return;
    }

    try {
      const createdClient = await apiClient.createCRMClient(newClient);
      setClients((prev) => [createdClient, ...prev]);
      setFilteredClients((prev) => [createdClient, ...prev]);
      setIsModalOpen(false);
      setNewClient({
        clientName: "",
        contactInfo: { email: "", phone: "" },
        serviceBooked: "",
        status: "New",
        assignedVendor: "",
        notes: "",
        dueDate: "",
      });
      toast({
        title: "Success",
        description: "Client created successfully",
      });
    } catch (error: any) {
      console.error("Error creating client:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create client",
      });
    }
  };

  const handleDeleteClient = async (clientId: string, clientName: string) => {
    if (!confirm(`Are you sure you want to delete "${clientName}"?`)) return;

    try {
      await apiClient.deleteCRMClient(clientId);
      setClients((prev) => prev.filter((c) => c.id !== clientId));
      setFilteredClients((prev) => prev.filter((c) => c.id !== clientId));
      toast({
        title: "Success",
        description: "Client deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting client:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete client",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "On Hold":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">CRM Clients</h1>
        <Button
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Add Client</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Manage CRM Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search by name, service, or ID..."
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
                    {status}
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
                    <TableHead>Client</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned Vendor</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <div>
                              <div className="font-medium">
                                {client.clientName}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {client.id}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{client.contactInfo.email}</div>
                            {client.contactInfo.phone && (
                              <div className="text-gray-500">
                                {client.contactInfo.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{client.serviceBooked}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(client.status)}>
                            {client.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {client.assignedVendor || "Unassigned"}
                        </TableCell>
                        <TableCell>
                          {client.dueDate
                            ? new Date(client.dueDate).toLocaleDateString()
                            : "No due date"}
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
                                Edit Client
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 dark:text-red-400"
                                onClick={() =>
                                  handleDeleteClient(
                                    client.id,
                                    client.clientName
                                  )
                                }
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete Client
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No clients found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Client Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New CRM Client</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateClient} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={newClient.clientName}
                  onChange={(e) =>
                    setNewClient((prev) => ({
                      ...prev,
                      clientName: e.target.value,
                    }))
                  }
                  placeholder="Enter client name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="serviceBooked">Service Booked</Label>
                <Input
                  id="serviceBooked"
                  value={newClient.serviceBooked}
                  onChange={(e) =>
                    setNewClient((prev) => ({
                      ...prev,
                      serviceBooked: e.target.value,
                    }))
                  }
                  placeholder="Enter service name"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newClient.contactInfo.email}
                  onChange={(e) =>
                    setNewClient((prev) => ({
                      ...prev,
                      contactInfo: {
                        ...prev.contactInfo,
                        email: e.target.value,
                      },
                    }))
                  }
                  placeholder="Enter email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newClient.contactInfo.phone}
                  onChange={(e) =>
                    setNewClient((prev) => ({
                      ...prev,
                      contactInfo: {
                        ...prev.contactInfo,
                        phone: e.target.value,
                      },
                    }))
                  }
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newClient.status}
                  onValueChange={(value) =>
                    setNewClient((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="assignedVendor">Assigned Vendor</Label>
                <Input
                  id="assignedVendor"
                  value={newClient.assignedVendor}
                  onChange={(e) =>
                    setNewClient((prev) => ({
                      ...prev,
                      assignedVendor: e.target.value,
                    }))
                  }
                  placeholder="Enter vendor name"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={newClient.dueDate}
                onChange={(e) =>
                  setNewClient((prev) => ({ ...prev, dueDate: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newClient.notes}
                onChange={(e) =>
                  setNewClient((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Enter any additional notes"
                rows={3}
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
              <Button type="submit">Add Client</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
