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
  Star,
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  apiClient,
  type Package,
  type PackageCreate,
  type PackageUpdate,
} from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [cardRef, cardInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [newPackage, setNewPackage] = useState<PackageCreate>({
    name: "",
    description: "",
    price: 0,
    duration: "",
    features: [],
    type: "",
    isPopular: false,
  });
  const [featuresInput, setFeaturesInput] = useState("");

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const [editPackage, setEditPackage] = useState<PackageUpdate>({});
  const [editFeaturesInput, setEditFeaturesInput] = useState("");

  const packageTypes = ["Basic", "Premium", "Enterprise", "Custom"];

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const packagesData = await apiClient.getPackages();
      setPackages(packagesData);
      setFilteredPackages(packagesData);
    } catch (error: any) {
      console.error("Error fetching packages:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch packages",
        className: "font-lora",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let result = packages;

    if (searchTerm) {
      result = result.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((pkg) => pkg.type === typeFilter);
    }

    setFilteredPackages(result);
  }, [searchTerm, typeFilter, packages]);

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newPackage.name ||
      !newPackage.description ||
      !newPackage.type ||
      !newPackage.duration
    ) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all required fields",
        className: "font-lora",
      });
      return;
    }

    const features = featuresInput
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    try {
      const createdPackage = await apiClient.createPackage({
        ...newPackage,
        features,
      });
      setPackages((prev) => [createdPackage, ...prev]);
      setFilteredPackages((prev) => [createdPackage, ...prev]);
      setIsModalOpen(false);
      setNewPackage({
        name: "",
        description: "",
        price: 0,
        duration: "",
        features: [],
        type: "",
        isPopular: false,
      });
      setFeaturesInput("");
      toast({
        title: "Success",
        description: "Package created successfully",
        className: "font-lora",
      });
    } catch (error: any) {
      console.error("Error creating package:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create package",
        className: "font-lora",
      });
    }
  };

  const handleDeletePackage = async (
    packageId: string,
    packageName: string
  ) => {
    if (!confirm(`Are you sure you want to delete "${packageName}"?`)) return;

    try {
      await apiClient.deletePackage(packageId);
      setPackages((prev) => prev.filter((p) => p.id !== packageId));
      setFilteredPackages((prev) => prev.filter((p) => p.id !== packageId));
      toast({
        title: "Success",
        description: "Package deleted successfully",
        className: "font-lora",
      });
    } catch (error: any) {
      console.error("Error deleting package:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete package",
        className: "font-lora",
      });
    }
  };

  const handleViewPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsViewModalOpen(true);
  };

  const handleEditPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setEditPackage({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      duration: pkg.duration,
      type: pkg.type,
      isPopular: pkg.isPopular,
    });
    setEditFeaturesInput(pkg.features.join("\n"));
    setIsEditModalOpen(true);
  };

  const handleUpdatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;

    const features = editFeaturesInput
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    try {
      const updatedPackage = await apiClient.updatePackage(selectedPackage.id, {
        ...editPackage,
        features,
      });
      setPackages((prev) =>
        prev.map((p) => (p.id === selectedPackage.id ? updatedPackage : p))
      );
      setFilteredPackages((prev) =>
        prev.map((p) => (p.id === selectedPackage.id ? updatedPackage : p))
      );
      setIsEditModalOpen(false);
      setSelectedPackage(null);
      toast({
        title: "Success",
        description: "Package updated successfully",
        className: "font-lora",
      });
    } catch (error: any) {
      console.error("Error updating package:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update package",
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
          Membership Packages
        </h1>
        <Button
          size="sm"
          className="flex items-center gap-1 gold-gradient text-black hover:opacity-90 font-lora"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Add Package</span>
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
              Manage Membership Packages
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
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-primary/10 border-gold-accent/20 text-foreground font-lora">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-gold-accent/20">
                  <SelectItem value="all" className="font-lora">
                    All Types
                  </SelectItem>
                  {packageTypes.map((type) => (
                    <SelectItem key={type} value={type} className="font-lora">
                      {type}
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
                        Name
                      </TableHead>
                      <TableHead className="font-cinzel uppercase tracking-wider text-secondary">
                        Type
                      </TableHead>
                      <TableHead className="font-cinzel uppercase tracking-wider text-secondary">
                        Price
                      </TableHead>
                      <TableHead className="font-cinzel uppercase tracking-wider text-secondary">
                        Duration
                      </TableHead>
                      <TableHead className="font-cinzel uppercase tracking-wider text-secondary">
                        Features
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
                    {filteredPackages.length > 0 ? (
                      filteredPackages.map((pkg, index) => (
                        <motion.tr
                          key={pkg.id}
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
                              <div>
                                <div className="font-lora text-foreground">
                                  {pkg.name}
                                </div>
                                <div className="text-xs font-lora text-muted-foreground">
                                  {pkg.id}
                                </div>
                              </div>
                              {pkg.isPopular && (
                                <Star className="h-4 w-4 text-gold-accent fill-current" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="font-lora border-gold-accent/20 text-foreground"
                            >
                              {pkg.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-lora text-foreground">
                            ₦{pkg.price.toLocaleString()}
                          </TableCell>
                          <TableCell className="font-lora text-muted-foreground">
                            {pkg.duration}
                          </TableCell>
                          <TableCell className="font-lora text-muted-foreground">
                            {pkg.features.length} features
                          </TableCell>
                          <TableCell>
                            {pkg.isPopular && (
                              <Badge className="bg-gold-accent/20 text-gold-accent font-lora">
                                Popular
                              </Badge>
                            )}
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
                                  onClick={() => handleViewPackage(pkg)}
                                >
                                  <Eye className="mr-2 h-4 w-4 text-gold-accent" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="font-lora"
                                  onClick={() => handleEditPackage(pkg)}
                                >
                                  <Edit className="mr-2 h-4 w-4 text-gold-accent" />
                                  Edit Package
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-gold-accent/20" />
                                <DropdownMenuItem
                                  className="font-lora text-red-600 dark:text-red-400"
                                  onClick={() =>
                                    handleDeletePackage(pkg.id, pkg.name)
                                  }
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete Package
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
                          No packages found.
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

      {/* View Package Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl bg-card border-gold-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
              Package Details
            </DialogTitle>
          </DialogHeader>
          {selectedPackage && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-lora text-foreground">
                        {selectedPackage.name}
                      </h2>
                      {selectedPackage.isPopular && (
                        <Star className="h-5 w-5 text-gold-accent fill-current" />
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className="font-lora border-gold-accent/20 text-foreground"
                    >
                      {selectedPackage.type}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-lora text-foreground">
                      ₦{selectedPackage.price.toLocaleString()}
                    </p>
                    <p className="text-sm font-lora text-muted-foreground">
                      {selectedPackage.duration}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-lora text-foreground mb-2">
                    Description
                  </h3>
                  <p className="font-lora text-muted-foreground">
                    {selectedPackage.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-lora text-foreground mb-2">Features</h3>
                  <ul className="space-y-1">
                    {selectedPackage.features.map((feature, index) => (
                      <li
                        key={index}
                        className="text-sm font-lora text-muted-foreground flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 bg-gold-accent rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gold-accent/20 pt-4">
                  <h3 className="font-lora text-foreground mb-2">
                    Package Information
                  </h3>
                  <div className="text-sm font-lora text-muted-foreground space-y-1">
                    <p>Package ID: {selectedPackage.id}</p>
                    <p>
                      Created:{" "}
                      {new Date(selectedPackage.createdAt).toLocaleString()}
                    </p>
                    <p>
                      Last Updated:{" "}
                      {new Date(selectedPackage.updatedAt).toLocaleString()}
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

      {/* Create Package Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] bg-card border-gold-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
              Create New Package
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreatePackage} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="font-lora text-foreground">
                  Package Name
                </Label>
                <Input
                  id="name"
                  value={newPackage.name}
                  onChange={(e) =>
                    setNewPackage((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter package name"
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type" className="font-lora text-foreground">
                  Type
                </Label>
                <Select
                  value={newPackage.type}
                  onValueChange={(value) =>
                    setNewPackage((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger className="bg-primary/10 border-gold-accent/20 text-foreground font-lora">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-gold-accent/20">
                    {packageTypes.map((type) => (
                      <SelectItem key={type} value={type} className="font-lora">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                value={newPackage.description}
                onChange={(e) =>
                  setNewPackage((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter package description"
                className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" className="font-lora text-foreground">
                  Price (₦)
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={newPackage.price}
                  onChange={(e) =>
                    setNewPackage((prev) => ({
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
                  value={newPackage.duration}
                  onChange={(e) =>
                    setNewPackage((prev) => ({
                      ...prev,
                      duration: e.target.value,
                    }))
                  }
                  placeholder="e.g., 1 month, 6 months"
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="features" className="font-lora text-foreground">
                Features (one per line)
              </Label>
              <Textarea
                id="features"
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                placeholder="Enter features, one per line"
                className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                rows={5}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isPopular"
                checked={newPackage.isPopular}
                onCheckedChange={(checked) =>
                  setNewPackage((prev) => ({ ...prev, isPopular: checked }))
                }
              />
              <Label htmlFor="isPopular" className="font-lora text-foreground">
                Mark as Popular
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
                Create Package
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Package Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] bg-card border-gold-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
              Edit Package
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdatePackage} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editName" className="font-lora text-foreground">
                  Package Name
                </Label>
                <Input
                  id="editName"
                  value={editPackage.name || ""}
                  onChange={(e) =>
                    setEditPackage((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter package name"
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                />
              </div>
              <div>
                <Label htmlFor="editType" className="font-lora text-foreground">
                  Type
                </Label>
                <Select
                  value={editPackage.type || ""}
                  onValueChange={(value) =>
                    setEditPackage((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger className="bg-primary/10 border-gold-accent/20 text-foreground font-lora">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-gold-accent/20">
                    {packageTypes.map((type) => (
                      <SelectItem key={type} value={type} className="font-lora">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                value={editPackage.description || ""}
                onChange={(e) =>
                  setEditPackage((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter package description"
                className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
              />
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
                  value={editPackage.price || ""}
                  onChange={(e) =>
                    setEditPackage((prev) => ({
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
                  value={editPackage.duration || ""}
                  onChange={(e) =>
                    setEditPackage((prev) => ({
                      ...prev,
                      duration: e.target.value,
                    }))
                  }
                  placeholder="e.g., 1 month, 6 months"
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="editFeatures"
                className="font-lora text-foreground"
              >
                Features (one per line)
              </Label>
              <Textarea
                id="editFeatures"
                value={editFeaturesInput}
                onChange={(e) => setEditFeaturesInput(e.target.value)}
                placeholder="Enter features, one per line"
                className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                rows={5}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="editIsPopular"
                checked={editPackage.isPopular ?? false}
                onCheckedChange={(checked) =>
                  setEditPackage((prev) => ({ ...prev, isPopular: checked }))
                }
              />
              <Label
                htmlFor="editIsPopular"
                className="font-lora text-foreground"
              >
                Mark as Popular
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
                Update Package
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
