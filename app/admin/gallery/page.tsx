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
  Search,
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add after existing state:
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Edit form state
  const [editImage, setEditImage] = useState<GalleryImageUpdate>({});
  const [editTagsInput, setEditTagsInput] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  // Form state for new image
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
      console.error("Error fetching gallery images:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch gallery images",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Apply filters
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
  }, [searchTerm, categoryFilter, images]);

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

    const tags = editTagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

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
      setIsEditModalOpen(false);
      setSelectedImage(null);
      toast({
        title: "Success",
        description: "Image updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating image:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update image",
      });
    }
  };

  const handleImageFileUpdate = async (file: File) => {
    if (!selectedImage) return;

    setIsUploading(true);
    try {
      await apiClient.updateGalleryImageFile(selectedImage.id, file);
      // Refresh the images list to get the updated image URL
      fetchImages();
      toast({
        title: "Success",
        description: "Image file updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating image file:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update image file",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage.title || !newImage.category || !newImage.file) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all required fields and select an image",
      });
      return;
    }

    try {
      const createdImage = await apiClient.createGalleryImage({
        title: newImage.title,
        description: newImage.description,
        category: newImage.category,
        tags: newImage.tags,
        file: newImage.file,
      });
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
      });
    } catch (error: any) {
      console.error("Error creating image:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to upload image",
      });
    }
  };

  const handleDeleteImage = async (imageId: string, imageTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${imageTitle}"?`)) return;

    try {
      await apiClient.deleteGalleryImage(imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      setFilteredImages((prev) => prev.filter((img) => img.id !== imageId));
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting image:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete image",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Gallery</h1>
        <Button
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Upload Image</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Manage Gallery Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search by title or tags..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredImages.length > 0 ? (
                filteredImages.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
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
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleViewImage(image)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Full Size
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditImage(image)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Image
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 dark:text-red-400"
                              onClick={() =>
                                handleDeleteImage(image.id, image.title)
                              }
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete Image
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-sm mb-1">
                        {image.title}
                      </h3>
                      {image.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                          {image.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {image.category}
                        </Badge>
                        <div className="flex flex-wrap gap-1">
                          {image.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {image.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{image.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {new Date(image.created_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No images found.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Image Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Details</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <img
                  src={selectedImage.image_url || "/placeholder.svg"}
                  alt={selectedImage.title}
                  className="max-w-full max-h-96 object-contain rounded-md"
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">
                  {selectedImage.title}
                </h2>
                {selectedImage.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {selectedImage.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1">Category</h3>
                  <Badge variant="outline">{selectedImage.category}</Badge>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Created By</h3>
                  <p className="text-sm text-gray-600">
                    {selectedImage.created_by}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {selectedImage.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Image Information</h3>
                <div className="text-sm text-gray-600 space-y-1">
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
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Image Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateImage} className="space-y-4">
            <div>
              <Label htmlFor="editTitle">Title</Label>
              <Input
                id="editTitle"
                value={editImage.title || ""}
                onChange={(e) =>
                  setEditImage((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter image title"
              />
            </div>
            <div>
              <Label htmlFor="editDescription">Description</Label>
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
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="editCategory">Category</Label>
              <Select
                value={editImage.category || ""}
                onValueChange={(value) =>
                  setEditImage((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="editTags">Tags (comma-separated)</Label>
              <Input
                id="editTags"
                value={editTagsInput}
                onChange={(e) => setEditTagsInput(e.target.value)}
                placeholder="tag1, tag2, tag3"
              />
            </div>
            <div>
              <Label htmlFor="editFile">Replace Image File (optional)</Label>
              <Input
                id="editFile"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setEditImageFile(file);
                    handleImageFileUpdate(file);
                  }
                }}
                disabled={isUploading}
              />
              {isUploading && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  Uploading new image...
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                Update Image
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload New Image</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateImage} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newImage.title}
                onChange={(e) =>
                  setNewImage((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter image title"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
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
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={newImage.category}
                onValueChange={(value) =>
                  setNewImage((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={newImage.tags}
                onChange={(e) =>
                  setNewImage((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="tag1, tag2, tag3"
              />
            </div>
            <div>
              <Label htmlFor="file">Image File</Label>
              <Input
                id="file"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setNewImage((prev) => ({ ...prev, file }));
                }}
                required
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
              <Button type="submit">
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
