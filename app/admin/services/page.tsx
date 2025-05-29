"use client";

import React, { useState, useEffect } from "react";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  apiClient,
  type Service,
  type ServiceCreate,
  type ServiceUpdate,
} from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  const [cardRef, cardInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [newService, setNewService] = useState<ServiceCreate>({
    name: "",
    description: "",
    category: "",
    price: 0,
    duration: "",
    isAvailable: true,
  });

  const [editService, setEditService] = useState<ServiceUpdate>({});

  const categories = [
    "Transportation",
    "Accommodation",
    "Food & Dining",
    "Entertainment",
    "Business",
    "Lifestyle",
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const servicesData = await apiClient.getServices();
      setServices(servicesData);
      setFilteredServices(servicesData);
    } catch (error: any) {
      console.error("Error fetching services:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch services",
        className: "font-lora",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let result = services;

    if (searchTerm) {
      result = result.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((service) => service.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      const isAvailable = statusFilter === "Active";
      result = result.filter((service) => service.isAvailable === isAvailable);
    }

    setFilteredServices(result);
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, statusFilter, services]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredServices.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newService.name ||
      !newService.description ||
      !newService.category ||
      !newService.duration
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
      const createdService = await apiClient.createService(newService);
      setServices((prev) => [createdService, ...prev]);
      setFilteredServices((prev) => [createdService, ...prev]);
      setIsModalOpen(false);
      setNewService({
        name: "",
        description: "",
        category: "",
        price: 0,
        duration: "",
        isAvailable: true,
      });
      toast({
        title: "Success",
        description: "Service created successfully",
        className: "font-lora",
      });
    } catch (error: any) {
      console.error("Error creating service:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create service",
        className: "font-lora",
      });
    }
  };

  const handleViewService = (service: Service) => {
    setSelectedService(service);
    setIsViewModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setEditService({
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price,
      duration: service.duration,
      isAvailable: service.isAvailable,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    try {
      const updatedService = await apiClient.updateService(
        selectedService.id,
        editService
      );
      setServices((prev) =>
        prev.map((s) => (s.id === selectedService.id ? updatedService : s))
      );
      setFilteredServices((prev) =>
        prev.map((s) => (s.id === selectedService.id ? updatedService : s))
      );
      setIsEditModalOpen(false);
      setSelectedService(null);
      toast({
        title: "Success",
        description: "Service updated successfully",
        className: "font-lora",
      });
    } catch (error: any) {
      console.error("Error updating service:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update service",
        className: "font-lora",
      });
    }
  };

  const handleDeleteService = async (
    serviceId: string,
    serviceName: string
  ) => {
    if (!confirm(`Are you sure you want to delete "${serviceName}"?`)) return;

    try {
      await apiClient.deleteService(serviceId);
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
      setFilteredServices((prev) => prev.filter((s) => s.id !== serviceId));
      toast({
        title: "Success",
        description: "Service deleted successfully",
        className: "font-lora",
      });
    } catch (error: any) {
      console.error("Error deleting service:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete service",
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
          Concierge Services
        </h1>
        <Button
          size="sm"
          className="flex items-center gap-1 gold-gradient text-black hover:opacity-90 font-lora"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Add Service</span>
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
              Manage Concierge Services
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
                  placeholder="Search by name or ID..."
                  className="pl-8 bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full sm:w-[180px] bg-primary/10 border-gold-accent/20 text-foreground font-lora">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-gold-accent/20">
                    <SelectItem value="all" className="font-lora">
                      All Categories
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        className="font-lora"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[150px] bg-primary/10 border-gold-accent/20 text-foreground font-lora">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-gold-accent/20">
                    <SelectItem value="all" className="font-lora">
                      All Statuses
                    </SelectItem>
                    <SelectItem value="Active" className="font-lora">
                      Active
                    </SelectItem>
                    <SelectItem value="Inactive" className="font-lora">
                      Inactive
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetFilters}
                  title="Reset filters"
                  className="border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-accent border-t-transparent"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-md border border-gold-accent/20">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gold-accent/20">
                        <TableHead className="font-cinzel uppercase tracking-wider text-secondary">
                          Name
                        </TableHead>
                        <TableHead className="hidden md:table-cell font-cinzel uppercase tracking-wider text-secondary">
                          Category
                        </TableHead>
                        <TableHead className="font-cinzel uppercase tracking-wider text-secondary">
                          Price
                        </TableHead>
                        <TableHead className="hidden md:table-cell font-cinzel uppercase tracking-wider text-secondary">
                          Duration
                        </TableHead>
                        <TableHead className="font-cinzel uppercase tracking-wider text-secondary">
                          Status
                        </TableHead>
                        <TableHead className="text-right font-cinzel uppercase tracking-wider text-secondary">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.length > 0 ? (
                        currentItems.map((service, index) => (
                          <motion.tr
                            key={service.id}
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
                              <div className="font-lora text-foreground">
                                {service.name}
                              </div>
                              <div className="text-xs font-lora text-muted-foreground">
                                {service.id}
                              </div>
                              <div className="text-xs font-lora text-muted-foreground md:hidden mt-1">
                                {service.category}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell font-lora text-muted-foreground">
                              {service.category}
                            </TableCell>
                            <TableCell className="font-lora text-foreground">
                              ₦{service.price.toLocaleString()}
                            </TableCell>
                            <TableCell className="hidden md:table-cell font-lora text-muted-foreground">
                              {service.duration}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`font-lora ${
                                  service.isAvailable
                                    ? "bg-green-600/20 text-green-400"
                                    : "bg-red-600/20 text-red-400"
                                }`}
                              >
                                {service.isAvailable ? "Active" : "Inactive"}
                              </Badge>
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
                                    onClick={() => handleViewService(service)}
                                  >
                                    <Eye className="mr-2 h-4 w-4 text-gold-accent" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="font-lora"
                                    onClick={() => handleEditService(service)}
                                  >
                                    <Edit className="mr-2 h-4 w-4 text-gold-accent" />
                                    Edit Service
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-gold-accent/20" />
                                  <DropdownMenuItem
                                    className="font-lora text-red-600 dark:text-red-400"
                                    onClick={() =>
                                      handleDeleteService(
                                        service.id,
                                        service.name
                                      )
                                    }
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete Service
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
                            No services found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              setCurrentPage((prev) =>
                                prev > 1 ? prev - 1 : prev
                              )
                            }
                            className={`font-lora text-gold-accent hover:bg-gold-accent/10 ${
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : ""
                            }`}
                          />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(
                            (page) =>
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 &&
                                page <= currentPage + 1)
                          )
                          .map((page, i, array) => (
                            <React.Fragment key={page}>
                              {i > 0 && array[i - 1] !== page - 1 && (
                                <PaginationItem>
                                  <span className="px-4 py-2 font-lora text-muted-foreground">
                                    ...
                                  </span>
                                </PaginationItem>
                              )}
                              <PaginationItem>
                                <PaginationLink
                                  onClick={() => setCurrentPage(page)}
                                  isActive={page === currentPage}
                                  className={`font-lora ${
                                    page === currentPage
                                      ? "gold-gradient text-black"
                                      : "text-gold-accent hover:bg-gold-accent/10"
                                  }`}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            </React.Fragment>
                          ))}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              setCurrentPage((prev) =>
                                prev < totalPages ? prev + 1 : prev
                              )
                            }
                            className={`font-lora text-gold-accent hover:bg-gold-accent/10 ${
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : ""
                            }`}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Create Service Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md bg-card border-gold-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
              Create New Service
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateService} className="space-y-4">
            <div>
              <Label htmlFor="name" className="font-lora text-foreground">
                Service Name
              </Label>
              <Input
                id="name"
                value={newService.name}
                onChange={(e) =>
                  setNewService((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter service name"
                className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="description"
                className="font-lora text-foreground"
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={newService.description}
                onChange={(e) =>
                  setNewService((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter service description"
                className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                required
              />
            </div>
            <div>
              <Label htmlFor="category" className="font-lora text-foreground">
                Category
              </Label>
              <Select
                value={newService.category}
                onValueChange={(value) =>
                  setNewService((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger className="bg-primary/10 border-gold-accent/20 text-foreground font-lora">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-card border-gold-accent/20">
                  {categories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="font-lora"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="price" className="font-lora text-foreground">
                Price (₦)
              </Label>
              <Input
                id="price"
                type="number"
                value={newService.price}
                onChange={(e) =>
                  setNewService((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
                placeholder="Enter price"
                className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                required
              />
            </div>
            <div>
              <Label htmlFor="duration" className="font-lora text-foreground">
                Duration
              </Label>
              <Input
                id="duration"
                value={newService.duration}
                onChange={(e) =>
                  setNewService((prev) => ({
                    ...prev,
                    duration: e.target.value,
                  }))
                }
                placeholder="e.g., 2 hours, Half day"
                className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isAvailable"
                checked={newService.isAvailable}
                onCheckedChange={(checked) =>
                  setNewService((prev) => ({ ...prev, isAvailable: checked }))
                }
              />
              <Label
                htmlFor="isAvailable"
                className="font-lora text-foreground"
              >
                Available
              </Label>
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
                Create Service
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Service Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl bg-card border-gold-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
              Service Details
            </DialogTitle>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-lora text-foreground">
                    {selectedService.name}
                  </h2>
                  <Badge
                    variant="outline"
                    className="font-lora border-gold-accent/20 text-foreground"
                  >
                    {selectedService.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-lora text-foreground">
                    ₦{selectedService.price.toLocaleString()}
                  </p>
                  <p className="text-sm font-lora text-muted-foreground">
                    {selectedService.duration}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-lora text-foreground mb-2">Description</h3>
                <p className="font-lora text-muted-foreground">
                  {selectedService.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-lora text-foreground mb-1">Status</h3>
                  <Badge
                    className={`font-lora ${
                      selectedService.isAvailable
                        ? "bg-green-600/20 text-green-400"
                        : "bg-red-600/20 text-red-400"
                    }`}
                  >
                    {selectedService.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-lora text-foreground mb-1">Service ID</h3>
                  <p className="text-sm font-lora text-muted-foreground">
                    {selectedService.id}
                  </p>
                </div>
              </div>

              <div className="border-t border-gold-accent/20 pt-4">
                <h3 className="font-lora text-foreground mb-2">
                  Service Information
                </h3>
                <div className="text-sm font-lora text-muted-foreground space-y-1">
                  <p>
                    Created:{" "}
                    {new Date(selectedService.createdAt).toLocaleString()}
                  </p>
                  <p>
                    Last Updated:{" "}
                    {new Date(selectedService.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
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

      {/* Edit Service Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl bg-card border-gold-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
              Edit Service
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateService} className="space-y-4">
            <div>
              <Label htmlFor="editName" className="font-lora text-foreground">
                Service Name
              </Label>
              <Input
                id="editName"
                value={editService.name || ""}
                onChange={(e) =>
                  setEditService((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter service name"
                className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
              />
            </div>
            <div>
              <Label
                htmlFor="editDescription"
                className="font-lora text-foreground"
              >
                Description
              </Label>
              <Textarea
                id="editDescription"
                value={editService.description || ""}
                onChange={(e) =>
                  setEditService((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter service description"
                className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
              />
            </div>
            <div>
              <Label
                htmlFor="editCategory"
                className="font-lora text-foreground"
              >
                Category
              </Label>
              <Select
                value={editService.category || ""}
                onValueChange={(value) =>
                  setEditService((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger className="bg-primary/10 border-gold-accent/20 text-foreground font-lora">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-card border-gold-accent/20">
                  {categories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="font-lora"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="editPrice"
                  className="font-lora text-foreground"
                >
                  Price (₦)
                </Label>
                <Input
                  id="editPrice"
                  type="number"
                  value={editService.price || ""}
                  onChange={(e) =>
                    setEditService((prev) => ({
                      ...prev,
                      price: Number(e.target.value),
                    }))
                  }
                  placeholder="Enter price"
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                />
              </div>
              <div>
                <Label
                  htmlFor="editDuration"
                  className="font-lora text-foreground"
                >
                  Duration
                </Label>
                <Input
                  id="editDuration"
                  value={editService.duration || ""}
                  onChange={(e) =>
                    setEditService((prev) => ({
                      ...prev,
                      duration: e.target.value,
                    }))
                  }
                  placeholder="e.g., 2 hours, Half day"
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="editIsAvailable"
                checked={editService.isAvailable ?? false}
                onCheckedChange={(checked) =>
                  setEditService((prev) => ({ ...prev, isAvailable: checked }))
                }
              />
              <Label
                htmlFor="editIsAvailable"
                className="font-lora text-foreground"
              >
                Available
              </Label>
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
                Update Service
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
