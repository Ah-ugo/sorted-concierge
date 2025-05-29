"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  FileText,
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  apiClient,
  type Blog,
  type BlogCreate,
  type BlogUpdate,
} from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form state for new blog
  const [newBlog, setNewBlog] = useState<BlogCreate>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    coverImage: "",
    author: { name: "", email: "" },
    tags: [],
  });
  const [tagsInput, setTagsInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Edit form state
  const [editBlog, setEditBlog] = useState<BlogUpdate>({});
  const [editTagsInput, setEditTagsInput] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string>("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const blogsData = await apiClient.getBlogs();
      setBlogs(blogsData);
      setFilteredBlogs(blogsData);
    } catch (error: any) {
      console.error("Error fetching blogs:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch blogs",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Apply search filter
    let result = blogs;

    if (searchTerm) {
      result = result.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setFilteredBlogs(result);
  }, [searchTerm, blogs]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleImageUpload = async (file: File, isEdit = false) => {
    setIsUploading(true);
    try {
      const response = await apiClient.uploadBlogImage(file);
      if (isEdit) {
        setEditBlog((prev) => ({ ...prev, coverImage: response.imageUrl }));
        setEditImagePreview(response.imageUrl);
      } else {
        setNewBlog((prev) => ({ ...prev, coverImage: response.imageUrl }));
        setImagePreview(response.imageUrl);
      }
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to upload image",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit = false
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select an image file",
        });
        return;
      }

      if (isEdit) {
        setEditImageFile(file);
      } else {
        setImageFile(file);
      }
      handleImageUpload(file, isEdit);
    }
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.content || !newBlog.excerpt) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all required fields",
      });
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const slug = newBlog.slug || generateSlug(newBlog.title);

    try {
      const createdBlog = await apiClient.createBlog({
        ...newBlog,
        slug,
        tags,
      });
      setBlogs((prev) => [createdBlog, ...prev]);
      setFilteredBlogs((prev) => [createdBlog, ...prev]);
      setIsCreateModalOpen(false);
      resetCreateForm();
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
    } catch (error: any) {
      console.error("Error creating blog:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create blog post",
      });
    }
  };

  const handleUpdateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBlog) return;

    const tags = editTagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    try {
      const updatedBlog = await apiClient.updateBlog(selectedBlog.id, {
        ...editBlog,
        tags: tags.length > 0 ? tags : undefined,
      });
      setBlogs((prev) =>
        prev.map((b) => (b.id === selectedBlog.id ? updatedBlog : b))
      );
      setFilteredBlogs((prev) =>
        prev.map((b) => (b.id === selectedBlog.id ? updatedBlog : b))
      );
      setIsEditModalOpen(false);
      setSelectedBlog(null);
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating blog:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update blog post",
      });
    }
  };

  const handleDeleteBlog = async (blogId: string, blogTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${blogTitle}"?`)) return;

    try {
      await apiClient.deleteBlog(blogId);
      setBlogs((prev) => prev.filter((b) => b.id !== blogId));
      setFilteredBlogs((prev) => prev.filter((b) => b.id !== blogId));
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting blog:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete blog post",
      });
    }
  };

  const handleViewBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsViewModalOpen(true);
  };

  const handleEditBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setEditBlog({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt,
      coverImage: blog.coverImage,
      author: blog.author,
    });
    setEditTagsInput(blog.tags.join(", "));
    setEditImagePreview(blog.coverImage || "");
    setIsEditModalOpen(true);
  };

  const resetCreateForm = () => {
    setNewBlog({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      coverImage: "",
      author: { name: "", email: "" },
      tags: [],
    });
    setTagsInput("");
    setImageFile(null);
    setImagePreview("");
  };

  const removeImage = (isEdit = false) => {
    if (isEdit) {
      setEditBlog((prev) => ({ ...prev, coverImage: "" }));
      setEditImagePreview("");
      setEditImageFile(null);
    } else {
      setNewBlog((prev) => ({ ...prev, coverImage: "" }));
      setImagePreview("");
      setImageFile(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1>
        <Button
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Add Blog Post</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Manage Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search by title, slug, or tags..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog) => (
                      <TableRow key={blog.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <div>
                              <div className="font-medium">{blog.title}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                /{blog.slug}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{blog.author.name}</div>
                            <div className="text-gray-500">
                              {blog.author.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {blog.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {blog.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{blog.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(blog.createdAt).toLocaleDateString()}
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
                              <DropdownMenuItem
                                onClick={() => handleViewBlog(blog)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Post
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditBlog(blog)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Post
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 dark:text-red-400"
                                onClick={() =>
                                  handleDeleteBlog(blog.id, blog.title)
                                }
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete Post
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No blog posts found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Blog Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Blog Post</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateBlog} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newBlog.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setNewBlog((prev) => ({
                      ...prev,
                      title,
                      slug: generateSlug(title),
                    }));
                  }}
                  placeholder="Enter blog title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={newBlog.slug}
                  onChange={(e) =>
                    setNewBlog((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="auto-generated-from-title"
                />
              </div>
            </div>

            {/* Cover Image Upload */}
            <div>
              <Label htmlFor="coverImage">Cover Image</Label>
              <div className="space-y-2">
                <Input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e)}
                  disabled={isUploading}
                />
                {isUploading && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    Uploading image...
                  </div>
                )}
                {imagePreview && (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Cover preview"
                      className="h-32 w-48 object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => removeImage()}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={newBlog.excerpt}
                onChange={(e) =>
                  setNewBlog((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                placeholder="Brief description of the blog post"
                rows={2}
                required
              />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={newBlog.content}
                onChange={(e) =>
                  setNewBlog((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Write your blog content here..."
                rows={10}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="authorName">Author Name</Label>
                <Input
                  id="authorName"
                  value={newBlog.author.name}
                  onChange={(e) =>
                    setNewBlog((prev) => ({
                      ...prev,
                      author: { ...prev.author, name: e.target.value },
                    }))
                  }
                  placeholder="Author name"
                />
              </div>
              <div>
                <Label htmlFor="authorEmail">Author Email</Label>
                <Input
                  id="authorEmail"
                  type="email"
                  value={newBlog.author.email}
                  onChange={(e) =>
                    setNewBlog((prev) => ({
                      ...prev,
                      author: { ...prev.author, email: e.target.value },
                    }))
                  }
                  placeholder="author@example.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="technology, business, lifestyle"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                Create Blog Post
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Blog Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>View Blog Post</DialogTitle>
          </DialogHeader>
          {selectedBlog && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-4">
                {selectedBlog.coverImage && (
                  <img
                    src={selectedBlog.coverImage || "/placeholder.svg"}
                    alt={selectedBlog.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold">{selectedBlog.title}</h2>
                  <p className="text-sm text-gray-500">
                    Slug: /{selectedBlog.slug}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Excerpt</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedBlog.excerpt}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Content</h3>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">
                      {selectedBlog.content}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Author</h3>
                    <p>{selectedBlog.author.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedBlog.author.email}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedBlog.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Metadata</h3>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(selectedBlog.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Updated: {new Date(selectedBlog.updatedAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">ID: {selectedBlog.id}</p>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Blog Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateBlog} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editTitle">Title</Label>
                <Input
                  id="editTitle"
                  value={editBlog.title || ""}
                  onChange={(e) => {
                    const title = e.target.value;
                    setEditBlog((prev) => ({
                      ...prev,
                      title,
                      slug: generateSlug(title),
                    }));
                  }}
                  placeholder="Enter blog title"
                />
              </div>
              <div>
                <Label htmlFor="editSlug">Slug</Label>
                <Input
                  id="editSlug"
                  value={editBlog.slug || ""}
                  onChange={(e) =>
                    setEditBlog((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="auto-generated-from-title"
                />
              </div>
            </div>

            {/* Cover Image Upload */}
            <div>
              <Label htmlFor="editCoverImage">Cover Image</Label>
              <div className="space-y-2">
                <Input
                  id="editCoverImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, true)}
                  disabled={isUploading}
                />
                {isUploading && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    Uploading image...
                  </div>
                )}
                {editImagePreview && (
                  <div className="relative inline-block">
                    <img
                      src={editImagePreview || "/placeholder.svg"}
                      alt="Cover preview"
                      className="h-32 w-48 object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => removeImage(true)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="editExcerpt">Excerpt</Label>
              <Textarea
                id="editExcerpt"
                value={editBlog.excerpt || ""}
                onChange={(e) =>
                  setEditBlog((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                placeholder="Brief description of the blog post"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="editContent">Content</Label>
              <Textarea
                id="editContent"
                value={editBlog.content || ""}
                onChange={(e) =>
                  setEditBlog((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Write your blog content here..."
                rows={10}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editAuthorName">Author Name</Label>
                <Input
                  id="editAuthorName"
                  value={editBlog.author?.name || ""}
                  onChange={(e) =>
                    setEditBlog((prev) => ({
                      ...prev,
                      author: { ...prev.author, name: e.target.value },
                    }))
                  }
                  placeholder="Author name"
                />
              </div>
              <div>
                <Label htmlFor="editAuthorEmail">Author Email</Label>
                <Input
                  id="editAuthorEmail"
                  type="email"
                  value={editBlog.author?.email || ""}
                  onChange={(e) =>
                    setEditBlog((prev) => ({
                      ...prev,
                      author: { ...prev.author, email: e.target.value },
                    }))
                  }
                  placeholder="author@example.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="editTags">Tags (comma-separated)</Label>
              <Input
                id="editTags"
                value={editTagsInput}
                onChange={(e) => setEditTagsInput(e.target.value)}
                placeholder="technology, business, lifestyle"
              />
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
                Update Blog Post
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
