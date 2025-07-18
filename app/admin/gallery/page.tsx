"use client";

import React from "react";
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
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  ImageIcon,
  Upload,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  apiClient,
  type GalleryImage,
  type GalleryImageUpdate,
} from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [cardRef, cardInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [editImage, setEditImage] = useState<GalleryImageUpdate>({});
  const [editTagsInput, setEditTagsInput] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  const [newImage, setNewImage] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    file: null as File | null,
  });

  const categories = [
    "Services",
    "Events",
    "Team",
    "Facilities",
    "Projects",
    "Testimonials",
  ];

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const imagesData = await apiClient.getGallery();
      setImages(imagesData);
      setFilteredImages(imagesData);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch gallery images",
        className: "font-lora",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let result = images;

    if (searchTerm) {
      result = result.filter(
        (image) =>
          image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          image.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((image) => image.category === categoryFilter);
    }

    setFilteredImages(result);
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, images]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredImages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
  };

  const handleViewImage = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsViewModalOpen(true);
  };

  const handleEditImage = (image: GalleryImage) => {
    setSelectedImage(image);
    setEditImage({
      title: image.title,
      description: image.description,
      category: image.category,
    });
    setEditTagsInput(image.tags.join(", "));
    setIsEditModalOpen(true);
  };

  const handleUpdateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;

    if (!editImage.title || !editImage.category) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all required fields",
        className: "font-lora",
      });
      return;
    }

    const tags = editTagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (tags.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide at least one tag",
        className: "font-lora",
      });
      return;
    }

    setIsActionLoading(true);
    try {
      const updatedImage = await apiClient.updateGalleryImage(
        selectedImage.id,
        {
          ...editImage,
          tags,
        }
      );
      setImages((prev) =>
        prev.map((img) => (img.id === selectedImage.id ? updatedImage : img))
      );
      setFilteredImages((prev) =>
        prev.map((img) => (img.id === selectedImage.id ? updatedImage : img))
      );
      if (editImageFile) {
        await apiClient.updateGalleryImageFile(selectedImage.id, editImageFile);
        await fetchImages();
      }
      setIsEditModalOpen(false);
      setSelectedImage(null);
      setEditImageFile(null);
      setEditTagsInput("");
      toast({
        title: "Success",
        description: "Image updated successfully",
        className: "font-lora",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update image",
        className: "font-lora",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCreateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage.title || !newImage.category || !newImage.file) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all required fields and select an image",
        className: "font-lora",
      });
      return;
    }

    const tags = newImage.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (tags.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide at least one tag",
        className: "font-lora",
      });
      return;
    }

    setIsActionLoading(true);
    try {
      const createdImage = await apiClient.createGalleryImage(
        newImage.title,
        newImage.category,
        newImage.file,
        newImage.description,
        newImage.tags
      );
      setImages((prev) => [createdImage, ...prev]);
      setFilteredImages((prev) => [createdImage, ...prev]);
      setIsModalOpen(false);
      setNewImage({
        title: "",
        description: "",
        category: "",
        tags: "",
        file: null,
      });
      toast({
        title: "Success",
        description: "Image uploaded successfully",
        className: "font-lora",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to upload image",
        className: "font-lora",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: string, imageTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${imageTitle}"?`)) return;

    setIsActionLoading(true);
    try {
      await apiClient.deleteGalleryImage(imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      setFilteredImages((prev) => prev.filter((img) => img.id !== imageId));
      toast({
        title: "Success",
        description: "Image deleted successfully",
        className: "font-lora",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete image",
        className: "font-lora",
      });
    } finally {
      setIsActionLoading(false);
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
          Concierge Gallery
        </h1>
        <Button
          size="sm"
          className="flex items-center gap-1 gold-gradient text-black hover:opacity-90 font-lora"
          onClick={() => setIsModalOpen(true)}
          disabled={isActionLoading}
        >
          <Plus className="h-4 w-4" />
          <span>Upload Image</span>
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
              Manage Gallery Images
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
                  placeholder="Search by title or tags..."
                  className="pl-8 bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isActionLoading}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                  disabled={isActionLoading}
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
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetFilters}
                  title="Reset filters"
                  className="border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black"
                  disabled={isActionLoading}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {currentItems.length > 0 ? (
                    currentItems.map((image, index) => (
                      <motion.div
                        key={image.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                          cardInView
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 20 }
                        }
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="overflow-hidden bg-card border-gold-accent/20 hover:shadow-gold-accent/10">
                          <div className="aspect-square relative">
                            <img
                              src={image.image_url || "/placeholder.svg"}
                              alt={image.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-8 w-8 bg-card/80 text-gold-accent hover:bg-gold-accent/10"
                                    disabled={isActionLoading}
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
                                    onClick={() => handleViewImage(image)}
                                    disabled={isActionLoading}
                                  >
                                    <Eye className="mr-2 h-4 w-4 text-gold-accent" />
                                    View Full Size
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="font-lora"
                                    onClick={() => handleEditImage(image)}
                                    disabled={isActionLoading}
                                  >
                                    <Edit className="mr-2 h-4 w-4 text-gold-accent" />
                                    Edit Image
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-gold-accent/20" />
                                  <DropdownMenuItem
                                    className="font-lora text-red-600 dark:text-red-400"
                                    onClick={() =>
                                      handleDeleteImage(image.id, image.title)
                                    }
                                    disabled={isActionLoading}
                                  >
                                    {isActionLoading ? (
                                      <div className="flex items-center">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent mr-2"></div>
                                        Deleting...
                                      </div>
                                    ) : (
                                      <>
                                        <Trash className="mr-2 h-4 w-4" />
                                        Delete Image
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-lora text-foreground text-sm mb-1">
                              {image.title}
                            </h3>
                            {image.description && (
                              <p className="text-xs font-lora text-muted-foreground mb-2 line-clamp-2">
                                {image.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <Badge
                                variant="outline"
                                className="text-xs font-lora border-gold-accent/20 text-gold-accent"
                              >
                                {image.category}
                              </Badge>
                              <div className="flex flex-wrap gap-1">
                                {image.tags.slice(0, 2).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs font-lora bg-gold-accent/20 text-gold-accent"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                {image.tags.length > 2 && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs font-lora border-gold-accent/20 text-gold-accent"
                                  >
                                    +{image.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-xs font-lora text-muted-foreground mt-2">
                              {new Date(image.created_at).toLocaleDateString()}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <ImageIcon className="h-12 w-12 text-gold-accent mx-auto mb-4" />
                      <p className="font-lora text-muted-foreground italic">
                        No images found.
                      </p>
                    </div>
                  )}
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
                            <React.Fragment key={`page-${page}`}>
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

      {/* View Image Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl bg-card border-gold-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
              Image Details
            </DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                <div className="flex justify-center">
                  <img
                    src={selectedImage.image_url || "/placeholder.svg"}
                    alt={selectedImage.title}
                    className="max-w-full max-h-96 object-contain rounded-md"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-lora text-foreground mb-2">
                    {selectedImage.title}
                  </h2>
                  {selectedImage.description && (
                    <p className="font-lora text-muted-foreground mb-4">
                      {selectedImage.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-lora text-foreground mb-1">Category</h3>
                    <Badge
                      variant="outline"
                      className="font-lora border-gold-accent/20 text-gold-accent"
                    >
                      {selectedImage.category}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-lora text-foreground mb-1">
                      Created By
                    </h3>
                    <p className="text-sm font-lora text-muted-foreground">
                      {selectedImage.created_by}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-lora text-foreground mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedImage.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="font-lora bg-gold-accent/20 text-gold-accent"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gold-accent/20 pt-4">
                  <h3 className="font-lora text-foreground mb-2">
                    Image Information
                  </h3>
                  <div className="text-sm font-lora text-muted-foreground space-y-1">
                    <p>Image ID: {selectedImage.id}</p>
                    <p>
                      Created:{" "}
                      {new Date(selectedImage.created_at).toLocaleString()}
                    </p>
                    <p>
                      Last Updated:{" "}
                      {new Date(selectedImage.updated_at).toLocaleString()}
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
              disabled={isActionLoading}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] bg-card border-gold-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
              Upload New Image
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <form onSubmit={handleCreateImage} className="space-y-4">
              <div>
                <Label htmlFor="title" className="font-lora text-foreground">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newImage.title}
                  onChange={(e) =>
                    setNewImage((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter image title"
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  required
                  disabled={isActionLoading}
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
                  value={newImage.description}
                  onChange={(e) =>
                    setNewImage((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter image description"
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  rows={3}
                  disabled={isActionLoading}
                />
              </div>
              <div>
                <Label htmlFor="category" className="font-lora text-foreground">
                  Category
                </Label>
                <Select
                  value={newImage.category}
                  onValueChange={(value) =>
                    setNewImage((prev) => ({ ...prev, category: value }))
                  }
                  disabled={isActionLoading}
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
                <Label htmlFor="tags" className="font-lora text-foreground">
                  Tags (comma-separated)
                </Label>
                <Input
                  id="tags"
                  value={newImage.tags}
                  onChange={(e) =>
                    setNewImage((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  placeholder="tag1, tag2, tag3"
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  disabled={isActionLoading}
                />
              </div>
              <div>
                <Label htmlFor="file" className="font-lora text-foreground">
                  Image File
                </Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setNewImage((prev) => ({ ...prev, file }));
                  }}
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  required
                  disabled={isActionLoading}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black font-lora"
                  disabled={isActionLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="gold-gradient text-black hover:opacity-90 font-lora"
                  disabled={isActionLoading}
                >
                  {isActionLoading ? (
                    <div className="flex items-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                      Uploading...
                    </div>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Edit Image Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] bg-card border-gold-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
              Edit Image
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <form onSubmit={handleUpdateImage} className="space-y-4">
              <div>
                <Label
                  htmlFor="editTitle"
                  className="font-lora text-foreground"
                >
                  Title
                </Label>
                <Input
                  id="editTitle"
                  value={editImage.title || ""}
                  onChange={(e) =>
                    setEditImage((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter image title"
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  required
                  disabled={isActionLoading}
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
                  value={editImage.description || ""}
                  onChange={(e) =>
                    setEditImage((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter image description"
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  rows={3}
                  disabled={isActionLoading}
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
                  value={editImage.category || ""}
                  onValueChange={(value) =>
                    setEditImage((prev) => ({ ...prev, category: value }))
                  }
                  disabled={isActionLoading}
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
                <Label htmlFor="editTags" className="font-lora text-foreground">
                  Tags (comma-separated)
                </Label>
                <Input
                  id="editTags"
                  value={editTagsInput}
                  onChange={(e) => setEditTagsInput(e.target.value)}
                  placeholder="tag1, tag2, tag3"
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  disabled={isActionLoading}
                />
              </div>
              <div>
                <Label htmlFor="editFile" className="font-lora text-foreground">
                  Replace Image File (optional)
                </Label>
                <Input
                  id="editFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setEditImageFile(file);
                  }}
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  disabled={isActionLoading}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black font-lora"
                  disabled={isActionLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="gold-gradient text-black hover:opacity-90 font-lora"
                  disabled={isActionLoading}
                >
                  {isActionLoading ? (
                    <div className="flex items-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    "Update Image"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
