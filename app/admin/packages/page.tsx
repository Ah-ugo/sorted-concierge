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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { apiClient, type Package, type PackageCreate } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for new package
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
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Apply filters
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
      });
    } catch (error: any) {
      console.error("Error creating package:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create package",
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
      });
    } catch (error: any) {
      console.error("Error deleting package:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete package",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Packages</h1>
        <Button
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Add Package</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Manage Packages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search by name or ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {packageTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
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
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPackages.length > 0 ? (
                    filteredPackages.map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div>
                              <div className="font-medium">{pkg.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {pkg.id}
                              </div>
                            </div>
                            {pkg.isPopular && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{pkg.type}</Badge>
                        </TableCell>
                        <TableCell>₦{pkg.price.toLocaleString()}</TableCell>
                        <TableCell>{pkg.duration}</TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {pkg.features.length} features
                          </div>
                        </TableCell>
                        <TableCell>
                          {pkg.isPopular && (
                            <Badge className="bg-yellow-100 text-yellow-800">
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
                                Edit Package
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 dark:text-red-400"
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
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
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

      {/* Create Package Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Package</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreatePackage} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Package Name</Label>
                <Input
                  id="name"
                  value={newPackage.name}
                  onChange={(e) =>
                    setNewPackage((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter package name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newPackage.type}
                  onValueChange={(value) =>
                    setNewPackage((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {packageTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
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
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₦)</Label>
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
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
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
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="features">Features (one per line)</Label>
              <Textarea
                id="features"
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                placeholder="Enter features, one per line"
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
              <Label htmlFor="isPopular">Mark as Popular</Label>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Package</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
