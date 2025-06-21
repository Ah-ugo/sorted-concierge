"use client";
import { useState, useEffect } from "react";
import type React from "react";

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
  Plus,
  Package,
  Layers,
  Settings,
  Upload,
  X,
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { apiClient } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface EnhancedServiceCategory {
  id: string;
  name: string;
  description: string;
  category_type: "tiered" | "contact_only";
  image?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  tiers: EnhancedServiceTier[];
  services: EnhancedService[];
  totalServices: number;
  totalTiers: number;
}

interface EnhancedServiceTier {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image?: string;
  features: string[];
  is_popular: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  services: EnhancedService[];
  categoryName?: string;
  serviceCount: number;
}

interface EnhancedService {
  id: string;
  name: string;
  description: string;
  image?: string;
  duration: string;
  isAvailable: boolean;
  features: string[];
  requirements: string[];
  category_id?: string;
  tier_id?: string;
  createdAt: string;
  updatedAt: string;
  categoryName?: string;
  tierName?: string;
}

interface ServiceFormData {
  name: string;
  description: string;
  duration: string;
  isAvailable: boolean;
  features: string[];
  requirements: string[];
  category_id: string;
  tier_id?: string;
  image?: File;
}

interface CategoryFormData {
  name: string;
  description: string;
  category_type: "tiered" | "contact_only";
  is_active: boolean;
  image?: File;
}

interface TierFormData {
  name: string;
  description: string;
  price: number;
  category_id: string;
  features: string[];
  is_popular: boolean;
  is_available: boolean;
  image?: File;
}

export default function ServicesManagementPage() {
  const [categories, setCategories] = useState<EnhancedServiceCategory[]>([]);
  const [tiers, setTiers] = useState<EnhancedServiceTier[]>([]);
  const [services, setServices] = useState<EnhancedService[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<
    EnhancedServiceCategory[]
  >([]);
  const [filteredTiers, setFilteredTiers] = useState<EnhancedServiceTier[]>([]);
  const [filteredServices, setFilteredServices] = useState<EnhancedService[]>(
    []
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryTypeFilter, setCategoryTypeFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("categories");

  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalType, setModalType] = useState<"category" | "tier" | "service">(
    "service"
  );

  // Form states
  const [serviceForm, setServiceForm] = useState<ServiceFormData>({
    name: "",
    description: "",
    duration: "",
    isAvailable: true,
    features: [],
    requirements: [],
    category_id: "",
    tier_id: "",
  });
  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
    name: "",
    description: "",
    category_type: "contact_only",
    is_active: true,
  });
  const [tierForm, setTierForm] = useState<TierFormData>({
    name: "",
    description: "",
    price: 0,
    category_id: "",
    features: [],
    is_popular: false,
    is_available: true,
  });

  // Feature/requirement input states
  const [newFeature, setNewFeature] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [newTierFeature, setNewTierFeature] = useState("");

  // Image upload states
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [cardRef, cardInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Helper function to enhance categories with additional data
  const enhanceCategoriesWithDetails = async (
    categories: any[]
  ): Promise<EnhancedServiceCategory[]> => {
    const enhancedCategories: EnhancedServiceCategory[] = [];

    for (const category of categories) {
      const enhanced: EnhancedServiceCategory = {
        ...category,
        totalServices: 0,
        totalTiers: 0,
        tiers: [],
        services: [],
      };

      try {
        if (category.category_type === "tiered") {
          // Get tiers for this category
          const categoryTiers = await apiClient.getServiceTiers({
            category_id: category.id,
          });
          enhanced.totalTiers = categoryTiers.length;

          let totalServices = 0;
          const enhancedTiers = [];

          for (const tier of categoryTiers) {
            const tierServices = await apiClient.getServices({
              tier_id: tier.id,
            });
            totalServices += tierServices.length;

            enhancedTiers.push({
              ...tier,
              categoryName: category.name,
              serviceCount: tierServices.length,
              services: tierServices.map((service) => ({
                ...service,
                categoryName: category.name,
                tierName: tier.name,
              })),
            });
          }

          enhanced.totalServices = totalServices;
          enhanced.tiers = enhancedTiers;
        } else {
          // Get individual services for contact-only categories
          const categoryServices = await apiClient.getServices({
            category_id: category.id,
          });
          enhanced.totalServices = categoryServices.length;
          enhanced.services = categoryServices.map((service) => ({
            ...service,
            categoryName: category.name,
          }));
        }
      } catch (error) {
        console.warn(`Error enhancing category ${category.id}:`, error);
      }

      enhancedCategories.push(enhanced);
    }

    return enhancedCategories;
  };

  // Helper function to enhance tiers with category names
  const enhanceTiersWithDetails = async (
    tiers: any[]
  ): Promise<EnhancedServiceTier[]> => {
    const enhancedTiers: EnhancedServiceTier[] = [];

    for (const tier of tiers) {
      const enhanced: EnhancedServiceTier = {
        ...tier,
        serviceCount: 0,
        services: [],
      };

      try {
        // Get category name
        if (tier.category_id) {
          const category = await apiClient.getServiceCategory(tier.category_id);
          enhanced.categoryName = category.name;
        }

        // Get services for this tier
        const tierServices = await apiClient.getServices({ tier_id: tier.id });
        enhanced.serviceCount = tierServices.length;
        enhanced.services = tierServices.map((service) => ({
          ...service,
          categoryName: enhanced.categoryName,
          tierName: tier.name,
        }));
      } catch (error) {
        console.warn(`Error enhancing tier ${tier.id}:`, error);
      }

      enhancedTiers.push(enhanced);
    }

    return enhancedTiers;
  };

  // Helper function to enhance services with category and tier names
  const enhanceServicesWithDetails = async (
    services: any[]
  ): Promise<EnhancedService[]> => {
    const enhancedServices: EnhancedService[] = [];

    for (const service of services) {
      const enhanced: EnhancedService = { ...service };

      try {
        // Get category name
        if (service.category_id) {
          const category = await apiClient.getServiceCategory(
            service.category_id
          );
          enhanced.categoryName = category.name;
        }

        // Get tier name if applicable
        if (service.tier_id) {
          const tier = await apiClient.getServiceTier(service.tier_id);
          enhanced.tierName = tier.name;
        }
      } catch (error) {
        console.warn(`Error enhancing service ${service.id}:`, error);
      }

      enhancedServices.push(enhanced);
    }

    return enhancedServices;
  };

  // Fixed image upload handler - use specific upload functions
  const handleImageUpload = async (
    file: File,
    type: "category" | "tier" | "service"
  ): Promise<string> => {
    setIsUploading(true);
    try {
      let uploadResponse;

      switch (type) {
        case "category":
          uploadResponse = await apiClient.uploadServiceCategoryImage(file);
          break;
        case "tier":
          uploadResponse = await apiClient.uploadServiceTierImage(file);
          break;
        case "service":
          uploadResponse = await apiClient.uploadServiceImage(file);
          break;
        default:
          throw new Error("Invalid upload type");
      }

      return uploadResponse.imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Image preview handler
  const handleImagePreview = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Fetch all data
      const [categoriesData, tiersData, servicesData] = await Promise.all([
        apiClient.getServiceCategories(),
        apiClient.getServiceTiers(),
        apiClient.getServices(),
      ]);

      // Enhance data with additional details
      const [enhancedCategories, enhancedTiers, enhancedServices] =
        await Promise.all([
          enhanceCategoriesWithDetails(categoriesData),
          enhanceTiersWithDetails(tiersData),
          enhanceServicesWithDetails(servicesData),
        ]);

      setCategories(enhancedCategories);
      setTiers(enhancedTiers);
      setServices(enhancedServices);
      setFilteredCategories(enhancedCategories);
      setFilteredTiers(enhancedTiers);
      setFilteredServices(enhancedServices);
    } catch (error: any) {
      console.error("Error fetching services data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch services data",
        className: "font-lora",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter effects
  useEffect(() => {
    let result = categories;

    if (searchTerm) {
      result = result.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryTypeFilter !== "all") {
      result = result.filter(
        (category) => category.category_type === categoryTypeFilter
      );
    }

    setFilteredCategories(result);
  }, [searchTerm, categoryTypeFilter, categories]);

  useEffect(() => {
    let result = tiers;

    if (searchTerm) {
      result = result.filter(
        (tier) =>
          tier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tier.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (tier.categoryName &&
            tier.categoryName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (availabilityFilter !== "all") {
      result = result.filter((tier) =>
        availabilityFilter === "available"
          ? tier.is_available
          : !tier.is_available
      );
    }

    setFilteredTiers(result);
  }, [searchTerm, availabilityFilter, tiers]);

  useEffect(() => {
    let result = services;

    if (searchTerm) {
      result = result.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (service.categoryName &&
            service.categoryName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (service.tierName &&
            service.tierName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (availabilityFilter !== "all") {
      result = result.filter((service) =>
        availabilityFilter === "available"
          ? service.isAvailable
          : !service.isAvailable
      );
    }

    setFilteredServices(result);
  }, [searchTerm, availabilityFilter, services]);

  // Modal handlers
  const handleView = (item: any, type: "category" | "tier" | "service") => {
    setSelectedItem(item);
    setModalType(type);
    setIsViewModalOpen(true);
  };

  const handleEdit = (item: any, type: "category" | "tier" | "service") => {
    setSelectedItem(item);
    setModalType(type);

    if (type === "service") {
      setServiceForm({
        name: item.name,
        description: item.description,
        duration: item.duration,
        isAvailable: item.isAvailable,
        features: item.features || [],
        requirements: item.requirements || [],
        category_id: item.category_id || "",
        tier_id: item.tier_id || "no-tier",
      });
    } else if (type === "category") {
      setCategoryForm({
        name: item.name,
        description: item.description,
        category_type: item.category_type,
        is_active: item.is_active,
      });
    } else if (type === "tier") {
      setTierForm({
        name: item.name,
        description: item.description,
        price: item.price,
        category_id: item.category_id,
        features: item.features || [],
        is_popular: item.is_popular,
        is_available: item.is_available,
      });
    }

    setImagePreview(item.image || null);
    setIsEditModalOpen(true);
  };

  const handleAdd = (type: "category" | "tier" | "service") => {
    setModalType(type);

    // Reset forms
    setServiceForm({
      name: "",
      description: "",
      duration: "",
      isAvailable: true,
      features: [],
      requirements: [],
      category_id: "",
      tier_id: "",
    });
    setCategoryForm({
      name: "",
      description: "",
      category_type: "contact_only",
      is_active: true,
    });
    setTierForm({
      name: "",
      description: "",
      price: 0,
      category_id: "",
      features: [],
      is_popular: false,
      is_available: true,
    });

    setImagePreview(null);
    setIsAddModalOpen(true);
  };

  const handleDelete = async (
    id: string,
    type: "category" | "tier" | "service"
  ) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      if (type === "service") {
        await apiClient.deleteService(id);
      } else if (type === "category") {
        await apiClient.deleteServiceCategory(id);
      } else if (type === "tier") {
        await apiClient.deleteServiceTier(id);
      }

      await fetchAllData();
      toast({
        title: "Success",
        description: `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } deleted successfully`,
        className: "font-lora",
      });
    } catch (error: any) {
      console.error(`Error deleting ${type}:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || `Failed to delete ${type}`,
        className: "font-lora",
      });
    }
  };

  // Form submission handlers
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = selectedItem?.image;

      if (serviceForm.image) {
        imageUrl = await handleImageUpload(serviceForm.image, "service");
      }

      const serviceData = {
        ...serviceForm,
        tier_id:
          serviceForm.tier_id === "no-tier" ? undefined : serviceForm.tier_id,
        image: imageUrl,
      };

      if (selectedItem) {
        await apiClient.updateService(selectedItem.id, serviceData);
        toast({
          title: "Success",
          description: "Service updated successfully",
          className: "font-lora",
        });
      } else {
        await apiClient.createService(serviceData);
        toast({
          title: "Success",
          description: "Service created successfully",
          className: "font-lora",
        });
      }

      setIsEditModalOpen(false);
      setIsAddModalOpen(false);
      await fetchAllData();
    } catch (error: any) {
      console.error("Error saving service:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save service",
        className: "font-lora",
      });
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = selectedItem?.image;

      if (categoryForm.image) {
        imageUrl = await handleImageUpload(categoryForm.image, "category");
      }

      const categoryData = {
        ...categoryForm,
        image: imageUrl,
      };

      if (selectedItem) {
        await apiClient.updateServiceCategory(selectedItem.id, categoryData);
        toast({
          title: "Success",
          description: "Category updated successfully",
          className: "font-lora",
        });
      } else {
        await apiClient.createServiceCategory(categoryData);
        toast({
          title: "Success",
          description: "Category created successfully",
          className: "font-lora",
        });
      }

      setIsEditModalOpen(false);
      setIsAddModalOpen(false);
      await fetchAllData();
    } catch (error: any) {
      console.error("Error saving category:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save category",
        className: "font-lora",
      });
    }
  };

  const handleTierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = selectedItem?.image;

      if (tierForm.image) {
        imageUrl = await handleImageUpload(tierForm.image, "tier");
      }

      const tierData = {
        ...tierForm,
        image: imageUrl,
      };

      if (selectedItem) {
        await apiClient.updateServiceTier(selectedItem.id, tierData);
        toast({
          title: "Success",
          description: "Tier updated successfully",
          className: "font-lora",
        });
      } else {
        await apiClient.createServiceTier(tierData);
        toast({
          title: "Success",
          description: "Tier created successfully",
          className: "font-lora",
        });
      }

      setIsEditModalOpen(false);
      setIsAddModalOpen(false);
      await fetchAllData();
    } catch (error: any) {
      console.error("Error saving tier:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save tier",
        className: "font-lora",
      });
    }
  };

  // Feature/requirement handlers
  const addFeature = () => {
    if (newFeature.trim()) {
      if (modalType === "service") {
        setServiceForm((prev) => ({
          ...prev,
          features: [...prev.features, newFeature.trim()],
        }));
      } else if (modalType === "tier") {
        setTierForm((prev) => ({
          ...prev,
          features: [...prev.features, newTierFeature.trim()],
        }));
      }
      setNewFeature("");
      setNewTierFeature("");
    }
  };

  const removeFeature = (index: number) => {
    if (modalType === "service") {
      setServiceForm((prev) => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index),
      }));
    } else if (modalType === "tier") {
      setTierForm((prev) => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index),
      }));
    }
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setServiceForm((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }));
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setServiceForm((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryTypeColor = (type: string) => {
    return type === "tiered"
      ? "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300"
      : "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300";
  };

  const getAvailabilityColor = (isAvailable: boolean) => {
    return isAvailable
      ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
      : "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300";
  };

  // Get available categories for tier/service forms
  const getAvailableCategories = () => {
    return categories.filter((cat) => cat.is_active);
  };

  // Get available tiers for service forms
  const getAvailableTiers = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (category?.category_type === "tiered") {
      return tiers.filter(
        (tier) => tier.category_id === categoryId && tier.is_available
      );
    }
    return [];
  };

  if (isLoading) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-accent border-t-transparent" />
          <p className="text-sm font-lora text-muted-foreground">
            Loading services data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <h1 className="text-2xl sm:text-3xl font-cinzel font-bold uppercase tracking-widest text-secondary">
          Services Management
        </h1>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border-gold-accent/20">
              <DropdownMenuItem
                onClick={() => handleAdd("category")}
                className="font-lora"
              >
                <Package className="mr-2 h-4 w-4" />
                Add Category
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAdd("tier")}
                className="font-lora"
              >
                <Layers className="mr-2 h-4 w-4" />
                Add Tier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAdd("service")}
                className="font-lora"
              >
                <Settings className="mr-2 h-4 w-4" />
                Add Service
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 40 }}
        animate={cardInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <Card className="bg-card elegant-shadow border-gold-accent/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
              Manage Services
              <motion.div
                className="h-0.5 bg-gradient-to-r from-transparent via-gold-accent to-transparent mt-2"
                initial={{ width: 0 }}
                animate={cardInView ? { width: "100px" } : {}}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList className="bg-primary/10">
                <TabsTrigger
                  value="categories"
                  className="font-lora uppercase tracking-wider text-secondary data-[state=active]:bg-gold-accent data-[state=active]:text-black"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Categories ({categories.length})
                </TabsTrigger>
                <TabsTrigger
                  value="tiers"
                  className="font-lora uppercase tracking-wider text-secondary data-[state=active]:bg-gold-accent data-[state=active]:text-black"
                >
                  <Layers className="h-4 w-4 mr-2" />
                  Tiers ({tiers.length})
                </TabsTrigger>
                <TabsTrigger
                  value="services"
                  className="font-lora uppercase tracking-wider text-secondary data-[state=active]:bg-gold-accent data-[state=active]:text-black"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Services ({services.length})
                </TabsTrigger>
              </TabsList>

              {/* Search and Filter Controls */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gold-accent" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-8 bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {activeTab === "categories" && (
                  <Select
                    value={categoryTypeFilter}
                    onValueChange={setCategoryTypeFilter}
                  >
                    <SelectTrigger className="w-full sm:w-[180px] bg-primary/10 border-gold-accent/20 text-foreground font-lora">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-gold-accent/20">
                      <SelectItem value="all" className="font-lora">
                        All Types
                      </SelectItem>
                      <SelectItem value="tiered" className="font-lora">
                        Tiered
                      </SelectItem>
                      <SelectItem value="contact_only" className="font-lora">
                        Contact Only
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {(activeTab === "tiers" || activeTab === "services") && (
                  <Select
                    value={availabilityFilter}
                    onValueChange={setAvailabilityFilter}
                  >
                    <SelectTrigger className="w-full sm:w-[180px] bg-primary/10 border-gold-accent/20 text-foreground font-lora">
                      <SelectValue placeholder="Filter by availability" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-gold-accent/20">
                      <SelectItem value="all" className="font-lora">
                        All
                      </SelectItem>
                      <SelectItem value="available" className="font-lora">
                        Available
                      </SelectItem>
                      <SelectItem value="unavailable" className="font-lora">
                        Unavailable
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Categories Tab */}
              <TabsContent value="categories" className="space-y-4">
                <div className="overflow-x-auto rounded-md border border-gold-accent/20">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-card hover:bg-card">
                        <TableHead className="font-lora text-foreground">
                          Category
                        </TableHead>
                        <TableHead className="font-lora text-foreground">
                          Type
                        </TableHead>
                        <TableHead className="font-lora text-foreground">
                          Services
                        </TableHead>
                        <TableHead className="font-lora text-foreground">
                          Tiers
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
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((category, index) => (
                          <motion.tr
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={cardInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="hover:bg-gold-accent/5"
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {category.image && (
                                  <img
                                    src={category.image || "/placeholder.svg"}
                                    alt={category.name}
                                    className="h-10 w-10 rounded-md object-cover"
                                  />
                                )}
                                <div>
                                  <div className="font-lora font-medium text-foreground">
                                    {category.name}
                                  </div>
                                  <div className="text-xs font-lora text-muted-foreground line-clamp-2">
                                    {category.description}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={getCategoryTypeColor(
                                  category.category_type
                                )}
                              >
                                {category.category_type === "tiered"
                                  ? "Tiered"
                                  : "Contact Only"}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-lora text-foreground">
                              {category.totalServices}
                            </TableCell>
                            <TableCell className="font-lora text-foreground">
                              {category.category_type === "tiered"
                                ? category.totalTiers
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={getAvailabilityColor(
                                  category.is_active
                                )}
                              >
                                {category.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-lora text-foreground">
                              {formatDate(category.created_at)}
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
                                    onClick={() =>
                                      handleView(category, "category")
                                    }
                                  >
                                    <Eye className="mr-2 h-4 w-4 text-gold-accent" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="font-lora"
                                    onClick={() =>
                                      handleEdit(category, "category")
                                    }
                                  >
                                    <Edit className="mr-2 h-4 w-4 text-gold-accent" />
                                    Edit Category
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-gold-accent/20" />
                                  <DropdownMenuItem
                                    className="font-lora text-red-500"
                                    onClick={() =>
                                      handleDelete(category.id, "category")
                                    }
                                  >
                                    <Trash className="mr-2 h-4 w-4 text-red-500" />
                                    Delete Category
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
                            No categories found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Tiers Tab */}
              <TabsContent value="tiers" className="space-y-4">
                <div className="overflow-x-auto rounded-md border border-gold-accent/20">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-card hover:bg-card">
                        <TableHead className="font-lora text-foreground">
                          Tier
                        </TableHead>
                        <TableHead className="font-lora text-foreground">
                          Category
                        </TableHead>
                        <TableHead className="font-lora text-foreground">
                          Price
                        </TableHead>
                        <TableHead className="font-lora text-foreground">
                          Services
                        </TableHead>
                        <TableHead className="font-lora text-foreground">
                          Popular
                        </TableHead>
                        <TableHead className="font-lora text-foreground">
                          Status
                        </TableHead>
                        <TableHead className="text-right font-lora text-foreground">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTiers.length > 0 ? (
                        filteredTiers.map((tier, index) => (
                          <motion.tr
                            key={tier.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={cardInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="hover:bg-gold-accent/5"
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {tier.image && (
                                  <img
                                    src={tier.image || "/placeholder.svg"}
                                    alt={tier.name}
                                    className="h-10 w-10 rounded-md object-cover"
                                  />
                                )}
                                <div>
                                  <div className="font-lora font-medium text-foreground">
                                    {tier.name}
                                  </div>
                                  <div className="text-xs font-lora text-muted-foreground line-clamp-2">
                                    {tier.description}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-lora text-foreground">
                              {tier.categoryName || "Unknown"}
                            </TableCell>
                            <TableCell className="font-lora text-foreground">
                              ₦{tier.price.toLocaleString()}
                            </TableCell>
                            <TableCell className="font-lora text-foreground">
                              {tier.serviceCount}
                            </TableCell>
                            <TableCell>
                              {tier.is_popular && (
                                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                  Popular
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={getAvailabilityColor(
                                  tier.is_available
                                )}
                              >
                                {tier.is_available
                                  ? "Available"
                                  : "Unavailable"}
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
                                    onClick={() => handleView(tier, "tier")}
                                  >
                                    <Eye className="mr-2 h-4 w-4 text-gold-accent" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="font-lora"
                                    onClick={() => handleEdit(tier, "tier")}
                                  >
                                    <Edit className="mr-2 h-4 w-4 text-gold-accent" />
                                    Edit Tier
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-gold-accent/20" />
                                  <DropdownMenuItem
                                    className="font-lora text-red-500"
                                    onClick={() =>
                                      handleDelete(tier.id, "tier")
                                    }
                                  >
                                    <Trash className="mr-2 h-4 w-4 text-red-500" />
                                    Delete Tier
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
                            No tiers found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services" className="space-y-4">
                <div className="overflow-x-auto rounded-md border border-gold-accent/20">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-card hover:bg-card">
                        <TableHead className="font-lora text-foreground">
                          Service
                        </TableHead>
                        <TableHead className="font-lora text-foreground">
                          Category
                        </TableHead>
                        <TableHead className="font-lora text-foreground">
                          Tier
                        </TableHead>
                        <TableHead className="font-lora text-foreground">
                          Duration
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
                      {filteredServices.length > 0 ? (
                        filteredServices.map((service, index) => (
                          <motion.tr
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={cardInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="hover:bg-gold-accent/5"
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {service.image && (
                                  <img
                                    src={service.image || "/placeholder.svg"}
                                    alt={service.name}
                                    className="h-10 w-10 rounded-md object-cover"
                                  />
                                )}
                                <div>
                                  <div className="font-lora font-medium text-foreground">
                                    {service.name}
                                  </div>
                                  <div className="text-xs font-lora text-muted-foreground line-clamp-2">
                                    {service.description}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-lora text-foreground">
                              {service.categoryName || "Unknown"}
                            </TableCell>
                            <TableCell className="font-lora text-foreground">
                              {service.tierName || "N/A"}
                            </TableCell>
                            <TableCell className="font-lora text-foreground">
                              {service.duration}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={getAvailabilityColor(
                                  service.isAvailable
                                )}
                              >
                                {service.isAvailable
                                  ? "Available"
                                  : "Unavailable"}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-lora text-foreground">
                              {formatDate(service.createdAt)}
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
                                    onClick={() =>
                                      handleView(service, "service")
                                    }
                                  >
                                    <Eye className="mr-2 h-4 w-4 text-gold-accent" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="font-lora"
                                    onClick={() =>
                                      handleEdit(service, "service")
                                    }
                                  >
                                    <Edit className="mr-2 h-4 w-4 text-gold-accent" />
                                    Edit Service
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-gold-accent/20" />
                                  <DropdownMenuItem
                                    className="font-lora text-red-500"
                                    onClick={() =>
                                      handleDelete(service.id, "service")
                                    }
                                  >
                                    <Trash className="mr-2 h-4 w-4 text-red-500" />
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
                            colSpan={7}
                            className="h-24 text-center font-lora text-muted-foreground italic"
                          >
                            No services found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl bg-card border-gold-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
              {modalType.charAt(0).toUpperCase() + modalType.slice(1)} Details
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6">
              <div className="flex items-start gap-6">
                {selectedItem.image && (
                  <img
                    src={selectedItem.image || "/placeholder.svg"}
                    alt={selectedItem.name}
                    className="h-32 w-32 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-cinzel font-bold text-secondary">
                      {selectedItem.name}
                    </h3>
                    <p className="text-sm font-lora text-muted-foreground">
                      {selectedItem.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {modalType === "category" && (
                      <>
                        <div>
                          <p className="text-sm font-lora font-medium text-foreground">
                            Type
                          </p>
                          <Badge
                            className={getCategoryTypeColor(
                              selectedItem.category_type
                            )}
                          >
                            {selectedItem.category_type === "tiered"
                              ? "Tiered"
                              : "Contact Only"}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-lora font-medium text-foreground">
                            Status
                          </p>
                          <Badge
                            className={getAvailabilityColor(
                              selectedItem.is_active
                            )}
                          >
                            {selectedItem.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-lora font-medium text-foreground">
                            Total Services
                          </p>
                          <p className="text-sm font-lora text-muted-foreground">
                            {selectedItem.totalServices}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-lora font-medium text-foreground">
                            Total Tiers
                          </p>
                          <p className="text-sm font-lora text-muted-foreground">
                            {selectedItem.category_type === "tiered"
                              ? selectedItem.totalTiers
                              : "N/A"}
                          </p>
                        </div>
                      </>
                    )}

                    {modalType === "tier" && (
                      <>
                        <div>
                          <p className="text-sm font-lora font-medium text-foreground">
                            Category
                          </p>
                          <p className="text-sm font-lora text-muted-foreground">
                            {selectedItem.categoryName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-lora font-medium text-foreground">
                            Price
                          </p>
                          <p className="text-sm font-lora text-muted-foreground">
                            ₦{selectedItem.price.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-lora font-medium text-foreground">
                            Services
                          </p>
                          <p className="text-sm font-lora text-muted-foreground">
                            {selectedItem.serviceCount}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-lora font-medium text-foreground">
                            Status
                          </p>
                          <div className="flex gap-2">
                            <Badge
                              className={getAvailabilityColor(
                                selectedItem.is_available
                              )}
                            >
                              {selectedItem.is_available
                                ? "Available"
                                : "Unavailable"}
                            </Badge>
                            {selectedItem.is_popular && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                Popular
                              </Badge>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {modalType === "service" && (
                      <>
                        <div>
                          <p className="text-sm font-lora font-medium text-foreground">
                            Category
                          </p>
                          <p className="text-sm font-lora text-muted-foreground">
                            {selectedItem.categoryName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-lora font-medium text-foreground">
                            Tier
                          </p>
                          <p className="text-sm font-lora text-muted-foreground">
                            {selectedItem.tierName || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-lora font-medium text-foreground">
                            Duration
                          </p>
                          <p className="text-sm font-lora text-muted-foreground">
                            {selectedItem.duration}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-lora font-medium text-foreground">
                            Status
                          </p>
                          <Badge
                            className={getAvailabilityColor(
                              selectedItem.isAvailable
                            )}
                          >
                            {selectedItem.isAvailable
                              ? "Available"
                              : "Unavailable"}
                          </Badge>
                        </div>
                      </>
                    )}
                  </div>

                  {(selectedItem.features?.length > 0 ||
                    selectedItem.requirements?.length > 0) && (
                    <div className="border-t border-gold-accent/20 pt-4">
                      {selectedItem.features?.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-lora font-medium text-foreground mb-2">
                            Features
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedItem.features.map(
                              (feature: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="font-lora"
                                >
                                  {feature}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}
                      {selectedItem.requirements?.length > 0 && (
                        <div>
                          <h4 className="font-lora font-medium text-foreground mb-2">
                            Requirements
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedItem.requirements.map(
                              (requirement: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="font-lora"
                                >
                                  {requirement}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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

      {/* Add/Edit Modal */}
      <Dialog
        open={isAddModalOpen || isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            setImagePreview(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl bg-card border-gold-accent/20 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
              {isEditModalOpen ? "Edit" : "Add"}{" "}
              {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
            </DialogTitle>
          </DialogHeader>

          {/* Service Form */}
          {modalType === "service" && (
            <form onSubmit={handleServiceSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="serviceName"
                    className="font-lora text-foreground"
                  >
                    Service Name
                  </Label>
                  <Input
                    id="serviceName"
                    value={serviceForm.name}
                    onChange={(e) =>
                      setServiceForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="serviceDuration"
                    className="font-lora text-foreground"
                  >
                    Duration
                  </Label>
                  <Input
                    id="serviceDuration"
                    value={serviceForm.duration}
                    onChange={(e) =>
                      setServiceForm((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    placeholder="e.g., 2 hours, 1 day"
                    className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                    required
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="serviceDescription"
                  className="font-lora text-foreground"
                >
                  Description
                </Label>
                <Textarea
                  id="serviceDescription"
                  value={serviceForm.description}
                  onChange={(e) =>
                    setServiceForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="serviceCategory"
                    className="font-lora text-foreground"
                  >
                    Category
                  </Label>
                  <Select
                    value={serviceForm.category_id}
                    onValueChange={(value) => {
                      setServiceForm((prev) => ({
                        ...prev,
                        category_id: value,
                        tier_id: "",
                      }));
                    }}
                  >
                    <SelectTrigger className="bg-primary/10 border-gold-accent/20 text-foreground font-lora">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-gold-accent/20">
                      {getAvailableCategories().map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                          className="font-lora"
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="serviceTier"
                    className="font-lora text-foreground"
                  >
                    Tier (Optional)
                  </Label>
                  <Select
                    value={serviceForm.tier_id || ""}
                    onValueChange={(value) =>
                      setServiceForm((prev) => ({ ...prev, tier_id: value }))
                    }
                    disabled={
                      !serviceForm.category_id ||
                      getAvailableTiers(serviceForm.category_id).length === 0
                    }
                  >
                    <SelectTrigger className="bg-primary/10 border-gold-accent/20 text-foreground font-lora">
                      <SelectValue placeholder="Select tier (if applicable)" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-gold-accent/20">
                      <SelectItem value="no-tier" className="font-lora">
                        No Tier (Direct Service)
                      </SelectItem>
                      {getAvailableTiers(serviceForm.category_id).map(
                        (tier) => (
                          <SelectItem
                            key={tier.id}
                            value={tier.id}
                            className="font-lora"
                          >
                            {tier.name} - ₦{tier.price.toLocaleString()}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <Label className="font-lora text-foreground">
                  Service Image
                </Label>
                <div className="mt-2 space-y-4">
                  {imagePreview && (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="h-32 w-32 rounded-lg object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => {
                          setImagePreview(null);
                          setServiceForm((prev) => ({
                            ...prev,
                            image: undefined,
                          }));
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setServiceForm((prev) => ({ ...prev, image: file }));
                          handleImagePreview(file);
                        }
                      }}
                      className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <Label className="font-lora text-foreground">Features</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature"
                      className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addFeature())
                      }
                    />
                    <Button
                      type="button"
                      onClick={addFeature}
                      variant="outline"
                      size="sm"
                      className="border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {serviceForm.features.map((feature, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="font-lora"
                      >
                        {feature}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-4 w-4 p-0"
                          onClick={() => removeFeature(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <Label className="font-lora text-foreground">
                  Requirements
                </Label>
                <div className="mt-2 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      placeholder="Add a requirement"
                      className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addRequirement())
                      }
                    />
                    <Button
                      type="button"
                      onClick={addRequirement}
                      variant="outline"
                      size="sm"
                      className="border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {serviceForm.requirements.map((requirement, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="font-lora"
                      >
                        {requirement}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-4 w-4 p-0"
                          onClick={() => removeRequirement(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="serviceAvailable"
                  checked={serviceForm.isAvailable}
                  onCheckedChange={(checked) =>
                    setServiceForm((prev) => ({
                      ...prev,
                      isAvailable: checked,
                    }))
                  }
                />
                <Label
                  htmlFor="serviceAvailable"
                  className="font-lora text-foreground"
                >
                  Service Available
                </Label>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setIsAddModalOpen(false);
                  }}
                  className="border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black font-lora"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUploading}
                  className="gold-gradient text-black hover:opacity-90 font-lora"
                >
                  {isUploading
                    ? "Uploading..."
                    : isEditModalOpen
                    ? "Update Service"
                    : "Create Service"}
                </Button>
              </DialogFooter>
            </form>
          )}

          {/* Category Form */}
          {modalType === "category" && (
            <form onSubmit={handleCategorySubmit} className="space-y-6">
              <div>
                <Label
                  htmlFor="categoryName"
                  className="font-lora text-foreground"
                >
                  Category Name
                </Label>
                <Input
                  id="categoryName"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="categoryDescription"
                  className="font-lora text-foreground"
                >
                  Description
                </Label>
                <Textarea
                  id="categoryDescription"
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="categoryType"
                  className="font-lora text-foreground"
                >
                  Category Type
                </Label>
                <Select
                  value={categoryForm.category_type}
                  onValueChange={(value: "tiered" | "contact_only") =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      category_type: value,
                    }))
                  }
                >
                  <SelectTrigger className="bg-primary/10 border-gold-accent/20 text-foreground font-lora">
                    <SelectValue placeholder="Select category type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-gold-accent/20">
                    <SelectItem value="contact_only" className="font-lora">
                      Contact Only - Direct services, contact admin
                    </SelectItem>
                    <SelectItem value="tiered" className="font-lora">
                      Tiered - Has tiers with online payment
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Image Upload */}
              <div>
                <Label className="font-lora text-foreground">
                  Category Image
                </Label>
                <div className="mt-2 space-y-4">
                  {imagePreview && (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="h-32 w-32 rounded-lg object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => {
                          setImagePreview(null);
                          setCategoryForm((prev) => ({
                            ...prev,
                            image: undefined,
                          }));
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCategoryForm((prev) => ({ ...prev, image: file }));
                          handleImagePreview(file);
                        }
                      }}
                      className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="categoryActive"
                  checked={categoryForm.is_active}
                  onCheckedChange={(checked) =>
                    setCategoryForm((prev) => ({ ...prev, is_active: checked }))
                  }
                />
                <Label
                  htmlFor="categoryActive"
                  className="font-lora text-foreground"
                >
                  Category Active
                </Label>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setIsAddModalOpen(false);
                  }}
                  className="border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black font-lora"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUploading}
                  className="gold-gradient text-black hover:opacity-90 font-lora"
                >
                  {isUploading
                    ? "Uploading..."
                    : isEditModalOpen
                    ? "Update Category"
                    : "Create Category"}
                </Button>
              </DialogFooter>
            </form>
          )}

          {/* Tier Form */}
          {modalType === "tier" && (
            <form onSubmit={handleTierSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="tierName"
                    className="font-lora text-foreground"
                  >
                    Tier Name
                  </Label>
                  <Input
                    id="tierName"
                    value={tierForm.name}
                    onChange={(e) =>
                      setTierForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="tierPrice"
                    className="font-lora text-foreground"
                  >
                    Price (₦)
                  </Label>
                  <Input
                    id="tierPrice"
                    type="number"
                    value={tierForm.price}
                    onChange={(e) =>
                      setTierForm((prev) => ({
                        ...prev,
                        price: Number(e.target.value),
                      }))
                    }
                    className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                    required
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="tierDescription"
                  className="font-lora text-foreground"
                >
                  Description
                </Label>
                <Textarea
                  id="tierDescription"
                  value={tierForm.description}
                  onChange={(e) =>
                    setTierForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="tierCategory"
                  className="font-lora text-foreground"
                >
                  Category
                </Label>
                <Select
                  value={tierForm.category_id}
                  onValueChange={(value) =>
                    setTierForm((prev) => ({ ...prev, category_id: value }))
                  }
                >
                  <SelectTrigger className="bg-primary/10 border-gold-accent/20 text-foreground font-lora">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-gold-accent/20">
                    {categories
                      .filter(
                        (cat) => cat.category_type === "tiered" && cat.is_active
                      )
                      .map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                          className="font-lora"
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Image Upload */}
              <div>
                <Label className="font-lora text-foreground">Tier Image</Label>
                <div className="mt-2 space-y-4">
                  {imagePreview && (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="h-32 w-32 rounded-lg object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => {
                          setImagePreview(null);
                          setTierForm((prev) => ({
                            ...prev,
                            image: undefined,
                          }));
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setTierForm((prev) => ({ ...prev, image: file }));
                          handleImagePreview(file);
                        }
                      }}
                      className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <Label className="font-lora text-foreground">Features</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newTierFeature}
                      onChange={(e) => setNewTierFeature(e.target.value)}
                      placeholder="Add a feature"
                      className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addFeature())
                      }
                    />
                    <Button
                      type="button"
                      onClick={addFeature}
                      variant="outline"
                      size="sm"
                      className="border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tierForm.features.map((feature, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="font-lora"
                      >
                        {feature}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-4 w-4 p-0"
                          onClick={() => removeFeature(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="tierAvailable"
                    checked={tierForm.is_available}
                    onCheckedChange={(checked) =>
                      setTierForm((prev) => ({
                        ...prev,
                        is_available: checked,
                      }))
                    }
                  />
                  <Label
                    htmlFor="tierAvailable"
                    className="font-lora text-foreground"
                  >
                    Available
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="tierPopular"
                    checked={tierForm.is_popular}
                    onCheckedChange={(checked) =>
                      setTierForm((prev) => ({ ...prev, is_popular: checked }))
                    }
                  />
                  <Label
                    htmlFor="tierPopular"
                    className="font-lora text-foreground"
                  >
                    Popular
                  </Label>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setIsAddModalOpen(false);
                  }}
                  className="border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black font-lora"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUploading}
                  className="gold-gradient text-black hover:opacity-90 font-lora"
                >
                  {isUploading
                    ? "Uploading..."
                    : isEditModalOpen
                    ? "Update Tier"
                    : "Create Tier"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
