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
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  apiClient,
  type CRMClient,
  type CRMClientCreate,
  type CRMClientUpdate,
} from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CRMPage() {
  const [clients, setClients] = useState<CRMClient[]>([]);
  const [filteredClients, setFilteredClients] = useState<CRMClient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<CRMClient | null>(null);
  const [editClient, setEditClient] = useState<CRMClientUpdate>({});
  const [cardRef, cardInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
        className: "font-lora",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
        className: "font-lora",
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
        className: "font-lora",
      });
    } catch (error: any) {
      console.error("Error creating client:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create client",
        className: "font-lora",
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
        className: "font-lora",
      });
    } catch (error: any) {
      console.error("Error deleting client:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete client",
        className: "font-lora",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-600/20 text-blue-500 border-blue-500/30";
      case "In Progress":
        return "bg-yellow-600/20 text-yellow-500 border-yellow-500/30";
      case "Completed":
        return "bg-green-600/20 text-green-500 border-green-500/30";
      case "On Hold":
        return "bg-orange-600/20 text-orange-500 border-orange-500/30";
      case "Cancelled":
        return "bg-red-600/20 text-red-500 border-red-500/30";
      default:
        return "bg-gray-600/20 text-gray-500 border-gray-500/30";
    }
  };

  const handleViewClient = (client: CRMClient) => {
    setSelectedClient(client);
    setIsViewModalOpen(true);
  };

  const handleEditClient = (client: CRMClient) => {
    setSelectedClient(client);
    setEditClient({
      clientName: client.clientName,
      contactInfo: client.contactInfo,
      serviceBooked: client.serviceBooked,
      status: client.status,
      assignedVendor: client.assignedVendor,
      notes: client.notes,
      dueDate: client.dueDate ? client.dueDate.split("T")[0] : "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    try {
      const updatedClient = await apiClient.updateCRMClient(
        selectedClient.id,
        editClient
      );
      setClients((prev) =>
        prev.map((c) => (c.id === selectedClient.id ? updatedClient : c))
      );
      setFilteredClients((prev) =>
        prev.map((c) => (c.id === selectedClient.id ? updatedClient : c))
      );
      setIsEditModalOpen(false);
      setSelectedClient(null);
      toast({
        title: "Success",
        description: "Client updated successfully",
        className: "font-lora",
      });
    } catch (error: any) {
      console.error("Error updating client:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update client",
        className: "font-lora",
      });
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
          CRM Clients
        </h1>
        <Button
          size="sm"
          className="flex items-center gap-1 gold-gradient text-black hover:opacity-90 font-lora"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Add Client</span>
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
              Manage CRM Clients
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
                  placeholder="Search by name, service, or ID..."
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
                        Client
                      </TableHead>
                      <TableHead className="font-lora text-foreground">
                        Contact
                      </TableHead>
                      <TableHead className="font-lora text-foreground">
                        Service
                      </TableHead>
                      <TableHead className="font-lora text-foreground">
                        Status
                      </TableHead>
                      <TableHead className="font-lora text-foreground">
                        Assigned Vendor
                      </TableHead>
                      <TableHead className="font-lora text-foreground">
                        Due Date
                      </TableHead>
                      <TableHead className="text-right font-lora text-foreground">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client, index) => (
                        <motion.tr
                          key={client.id}
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
                              <User className="h-4 w-4 text-gold-accent" />
                              <div>
                                <div className="font-lora text-foreground">
                                  {client.clientName}
                                </div>
                                <div className="text-xs font-lora text-muted-foreground">
                                  {client.id}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-lora text-foreground">
                            <div className="text-sm">
                              <div>{client.contactInfo.email}</div>
                              {client.contactInfo.phone && (
                                <div className="text-muted-foreground">
                                  {client.contactInfo.phone}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-lora text-foreground">
                            {client.serviceBooked}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`font-lora ${getStatusColor(
                                client.status
                              )}`}
                            >
                              {client.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-lora text-foreground">
                            {client.assignedVendor || "Unassigned"}
                          </TableCell>
                          <TableCell className="font-lora text-foreground">
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
                                <DropdownMenuItem
                                  className="font-lora"
                                  onClick={() => handleViewClient(client)}
                                >
                                  <Eye className="mr-2 h-4 w-4 text-gold-accent" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="font-lora"
                                  onClick={() => handleEditClient(client)}
                                >
                                  <Edit className="mr-2 h-4 w-4 text-gold-accent" />
                                  Edit Client
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-gold-accent/20" />
                                <DropdownMenuItem
                                  className="font-lora text-red-500"
                                  onClick={() =>
                                    handleDeleteClient(
                                      client.id,
                                      client.clientName
                                    )
                                  }
                                >
                                  <Trash className="mr-2 h-4 w-4 text-red-500" />
                                  Delete Client
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
      </motion.div>

      {/* View Client Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl bg-card border-gold-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
              Client Details
            </DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <User className="h-12 w-12 text-gold-accent bg-primary/10 rounded-full p-2" />
                  <div>
                    <h2 className="text-xl font-lora text-foreground">
                      {selectedClient.clientName}
                    </h2>
                    <Badge
                      className={`font-lora ${getStatusColor(
                        selectedClient.status
                      )}`}
                    >
                      {selectedClient.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-lora text-foreground mb-1">
                        Contact Information
                      </h3>
                      <div className="text-sm font-lora text-muted-foreground space-y-1">
                        <p>Email: {selectedClient.contactInfo.email}</p>
                        {selectedClient.contactInfo.phone && (
                          <p>Phone: {selectedClient.contactInfo.phone}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-lora text-foreground mb-1">
                        Service Booked
                      </h3>
                      <p className="text-sm font-lora text-muted-foreground">
                        {selectedClient.serviceBooked}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-lora text-foreground mb-1">
                        Assigned Vendor
                      </h3>
                      <p className="text-sm font-lora text-muted-foreground">
                        {selectedClient.assignedVendor || "Unassigned"}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-lora text-foreground mb-1">
                        Due Date
                      </h3>
                      <p className="text-sm font-lora text-muted-foreground">
                        {selectedClient.dueDate
                          ? new Date(
                              selectedClient.dueDate
                            ).toLocaleDateString()
                          : "No due date"}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedClient.notes && (
                  <div>
                    <h3 className="font-lora text-foreground mb-2">Notes</h3>
                    <p className="text-sm font-lora text-muted-foreground bg-primary/10 p-3 rounded-md">
                      {selectedClient.notes}
                    </p>
                  </div>
                )}

                <div className="border-t border-gold-accent/20 pt-4">
                  <h3 className="font-lora text-foreground mb-2">
                    Client Information
                  </h3>
                  <div className="text-sm font-lora text-muted-foreground space-y-1">
                    <p>Client ID: {selectedClient.id}</p>
                    <p>
                      Created:{" "}
                      {new Date(selectedClient.createdAt).toLocaleString()}
                    </p>
                    <p>
                      Last Updated:{" "}
                      {new Date(selectedClient.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button
              onClick={() => setIsViewModalOpen(false)}
              className="gold-gradient text-black hover:opacity-90 font-lora"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Client Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] bg-card border-gold-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
              Edit CRM Client
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateClient} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="editClientName"
                  className="font-lora text-foreground"
                >
                  Client Name
                </Label>
                <Input
                  id="editClientName"
                  value={editClient.clientName || ""}
                  onChange={(e) =>
                    setEditClient((prev) => ({
                      ...prev,
                      clientName: e.target.value,
                    }))
                  }
                  placeholder="Enter client name"
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                />
              </div>
              <div>
                <Label
                  htmlFor="editServiceBooked"
                  className="font-lora text-foreground"
                >
                  Service Booked
                </Label>
                <Input
                  id="editServiceBooked"
                  value={editClient.serviceBooked || ""}
                  onChange={(e) =>
                    setEditClient((prev) => ({
                      ...prev,
                      serviceBooked: e.target.value,
                    }))
                  }
                  placeholder="Enter service name"
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="editEmail"
                  className="font-lora text-foreground"
                >
                  Email
                </Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editClient.contactInfo?.email || ""}
                  onChange={(e) =>
                    setEditClient((prev) => ({
                      ...prev,
                      contactInfo: {
                        ...prev.contactInfo,
                        email: e.target.value,
                      },
                    }))
                  }
                  placeholder="Enter email"
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                />
              </div>
              <div>
                <Label
                  htmlFor="editPhone"
                  className="font-lora text-foreground"
                >
                  Phone
                </Label>
                <Input
                  id="editPhone"
                  value={editClient.contactInfo?.phone || ""}
                  onChange={(e) =>
                    setEditClient((prev) => ({
                      ...prev,
                      contactInfo: {
                        ...prev.contactInfo,
                        phone: e.target.value,
                      },
                    }))
                  }
                  placeholder="Enter phone number"
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="editStatus"
                  className="font-lora text-foreground"
                >
                  Status
                </Label>
                <Select
                  value={editClient.status || ""}
                  onValueChange={(value) =>
                    setEditClient((prev) => ({ ...prev, status: value }))
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
              <div>
                <Label
                  htmlFor="editAssignedVendor"
                  className="font-lora text-foreground"
                >
                  Assigned Vendor
                </Label>
                <Input
                  id="editAssignedVendor"
                  value={editClient.assignedVendor || ""}
                  onChange={(e) =>
                    setEditClient((prev) => ({
                      ...prev,
                      assignedVendor: e.target.value,
                    }))
                  }
                  placeholder="Enter vendor name"
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="editDueDate"
                className="font-lora text-foreground"
              >
                Due Date
              </Label>
              <Input
                id="editDueDate"
                type="date"
                value={editClient.dueDate || ""}
                onChange={(e) =>
                  setEditClient((prev) => ({
                    ...prev,
                    dueDate: e.target.value,
                  }))
                }
                className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
              />
            </div>
            <div>
              <Label htmlFor="editNotes" className="font-lora text-foreground">
                Notes
              </Label>
              <Textarea
                id="editNotes"
                value={editClient.notes || ""}
                onChange={(e) =>
                  setEditClient((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Enter any additional notes"
                rows={3}
                className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black font-lora"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="gold-gradient text-black hover:opacity-90 font-lora"
              >
                Update Client
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Client Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] bg-card border-gold-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
              Add New CRM Client
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateClient} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="clientName"
                  className="font-lora text-foreground"
                >
                  Client Name
                </Label>
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
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="serviceBooked"
                  className="font-lora text-foreground"
                >
                  Service Booked
                </Label>
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
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="font-lora text-foreground">
                  Email
                </Label>
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
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone" className="font-lora text-foreground">
                  Phone
                </Label>
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
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status" className="font-lora text-foreground">
                  Status
                </Label>
                <Select
                  value={newClient.status}
                  onValueChange={(value) =>
                    setNewClient((prev) => ({ ...prev, status: value }))
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
              <div>
                <Label
                  htmlFor="assignedVendor"
                  className="font-lora text-foreground"
                >
                  Assigned Vendor
                </Label>
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
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="dueDate" className="font-lora text-foreground">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={newClient.dueDate}
                onChange={(e) =>
                  setNewClient((prev) => ({ ...prev, dueDate: e.target.value }))
                }
                className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
              />
            </div>
            <div>
              <Label htmlFor="notes" className="font-lora text-foreground">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={newClient.notes}
                onChange={(e) =>
                  setNewClient((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Enter any additional notes"
                rows={3}
                className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
              />
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
                Add Client
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
