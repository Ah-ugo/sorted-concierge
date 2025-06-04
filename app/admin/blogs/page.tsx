"use client";

import type React from "react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
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
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  apiClient,
  type Blog,
  type BlogCreate,
  type BlogUpdate,
} from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import react-quill-new with SSR disabled
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

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
  const [cardRef, cardInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
  const [imagePreview, setImagePreview] = useState("");

  const [editBlog, setEditBlog] = useState<BlogUpdate>({});
  const [editTagsInput, setEditTagsInput] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState("");

  // Quill editor modules configuration
  const quillModules = {
    toolbar: [
      [{ header: [2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

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
        className: "font-lora",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
        variant: "default",
        title: "Success",
        description: "Image uploaded successfully",
        className: "font-lora",
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to upload image",
        className: "font-lora",
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
          className: "font-lora",
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
        className: "font-lora",
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
        variant: "default",
        title: "Success",
        description: "Blog post created successfully",
        className: "font-lora",
      });
    } catch (error: any) {
      console.error("Error creating blog:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create blog post",
        className: "font-lora",
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
        variant: "default",
        title: "Success",
        description: "Blog post updated successfully",
        className: "font-lora",
      });
    } catch (error: any) {
      console.error("Error updating blog:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update blog post",
        className: "font-lora",
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
        variant: "default",
        title: "Success",
        description: "Blog post deleted successfully",
        className: "font-lora",
      });
    } catch (error: any) {
      console.error("Error deleting blog:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete blog post",
        className: "font-lora",
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
    <div className="space-y-6 bg-background p-6">
      <style jsx global>{`
        .ql-toolbar.ql-snow {
          background: hsl(var(--card)) !important;
          border: 1px solid hsl(var(--border)) !important;
          font-family: "Lora", serif !important;
          color: hsl(var(--foreground)) !important;
        }

        .ql-toolbar.ql-snow .ql-picker-label {
          color: hsl(var(--foreground)) !important;
        }

        .ql-toolbar.ql-snow .ql-picker-label:hover {
          color: hsl(var(--primary)) !important;
        }

        /* NUCLEAR OPTION - Force all possible dropdown selectors */
        .ql-picker-options,
        .ql-snow .ql-picker-options,
        .ql-snow .ql-picker.ql-header .ql-picker-options,
        .ql-toolbar .ql-picker-options,
        div[class*="ql-picker-options"],
        [class*="ql-picker-options"] {
          background: #1a1a1a !important;
          background-color: #1a1a1a !important;
          border: 1px solid #333 !important;
          color: white !important;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3) !important;
        }

        /* Force all picker items */
        .ql-picker-item,
        .ql-snow .ql-picker-item,
        .ql-snow .ql-picker.ql-header .ql-picker-item,
        .ql-toolbar .ql-picker-item,
        div[class*="ql-picker-item"],
        [class*="ql-picker-item"] {
          font-family: "Lora", serif !important;
          color: white !important;
          background: transparent !important;
          background-color: transparent !important;
        }

        /* Force hover states */
        .ql-picker-item:hover,
        .ql-snow .ql-picker-item:hover,
        .ql-snow .ql-picker.ql-header .ql-picker-item:hover,
        .ql-toolbar .ql-picker-item:hover,
        div[class*="ql-picker-item"]:hover,
        [class*="ql-picker-item"]:hover {
          background: #333 !important;
          background-color: #333 !important;
          color: #d4af37 !important;
        }

        /* Target any white backgrounds globally within quill */
        .ql-snow *[style*="background: white"],
        .ql-snow *[style*="background-color: white"],
        .ql-snow *[style*="background: #fff"],
        .ql-snow *[style*="background-color: #fff"] {
          background: #1a1a1a !important;
          background-color: #1a1a1a !important;
        }

        /* Fix for the editor container */
        .ql-container.ql-snow {
          border: 1px solid hsl(var(--border)) !important;
          font-family: "Lora", serif !important;
          background: hsl(var(--card)) !important;
        }

        /* Fix for the editor content area */
        .ql-editor {
          color: hsl(var(--foreground)) !important;
          background: hsl(var(--card)) !important;
        }

        /* Additional fixes for other toolbar elements */
        .ql-toolbar.ql-snow .ql-stroke {
          stroke: hsl(var(--foreground)) !important;
        }

        .ql-toolbar.ql-snow .ql-fill {
          fill: hsl(var(--foreground)) !important;
        }

        .ql-toolbar.ql-snow button:hover,
        .ql-toolbar.ql-snow button:focus {
          background: hsl(var(--accent)) !important;
        }

        .ql-toolbar.ql-snow button.ql-active {
          background: hsl(var(--primary)) !important;
        }

        .ql-toolbar.ql-snow button.ql-active .ql-stroke {
          stroke: hsl(var(--primary-foreground)) !important;
        }

        .ql-toolbar.ql-snow button.ql-active .ql-fill {
          fill: hsl(var(--primary-foreground)) !important;
        }
      `}</style>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <h1 className="text-2xl sm:text-3xl font-cinzel font-bold uppercase tracking-widest text-secondary">
          Blog Management
        </h1>
        <Button
          size="sm"
          className="flex items-center gap-1 gold-gradient text-black hover:opacity-90 font-lora"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Create Blog Post</span>
        </Button>
      </motion.div>

      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={cardInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <Card className="bg-card elegant-shadow border">
          <CardHeader className="pb-3">
            <div className="text-xl font-cinzel uppercase tracking-widest text-foreground">
              <h3>Manage Blogs</h3>
              <motion.div
                className="h-0.5 bg-gradient-to-r from-transparent via-gold-accent to-transparent mt-2"
                initial={{ width: 0 }}
                animate={cardInView ? { width: "100px" } : {}}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gold-accent" />
                <Input
                  type="search"
                  placeholder="Search by title, slug, or tags..."
                  className="pl-8 bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-accent border-t-transparent" />
              </div>
            ) : (
              <div className="overflow-x-auto rounded-md border border-gold-accent/20">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-card hover:bg-card">
                      <TableHead className="font-lora text-foreground">
                        Title
                      </TableHead>
                      <TableHead className="font-lora text-foreground">
                        Author
                      </TableHead>
                      <TableHead className="font-lora text-foreground">
                        Tags
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
                    {filteredBlogs.length > 0 ? (
                      filteredBlogs.map((blog, index) => (
                        <motion.tr
                          key={blog.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={cardInView ? { opacity: 1, y: 0 } : {}}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="hover:bg-gold-accent/5"
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gold-accent" />
                              <div>
                                <div className="font-lora text-foreground">
                                  {blog.title}
                                </div>
                                <div className="text-xs font-lora text-muted-foreground">
                                  /{blog.slug}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-lora">
                              <div className="text-foreground">
                                {blog.author.name}
                              </div>
                              <div className="text-muted-foreground">
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
                                  className="text-xs font-lora bg-gray-600/20 text-gray-500 border-gray-500/30"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {blog.tags.length > 3 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs font-lora border-gold-accent/30 text-gold-accent"
                                >
                                  +{blog.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-lora text-foreground">
                            {new Date(blog.createdAt).toLocaleDateString()}
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
                                  onClick={() => handleViewBlog(blog)}
                                >
                                  <Eye className="mr-2 h-4 w-4 text-gold-accent" />
                                  View Post
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="font-lora"
                                  onClick={() => handleEditBlog(blog)}
                                >
                                  <Edit className="mr-2 h-4 w-4 text-gold-accent" />
                                  Edit Post
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-gold-accent/20" />
                                <DropdownMenuItem
                                  className="font-lora text-red-500"
                                  onClick={() =>
                                    handleDeleteBlog(blog.id, blog.title)
                                  }
                                >
                                  <Trash className="mr-2 h-4 w-4 text-red-500" />
                                  Delete Post
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-24 text-center font-lora text-muted-foreground italic"
                        >
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
      </motion.div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-card border-gold-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
              Create New Blog Post
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <form onSubmit={handleCreateBlog} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="font-lora text-foreground">
                    Title
                  </Label>
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
                    className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug" className="font-lora text-foreground">
                    Slug
                  </Label>
                  <Input
                    id="slug"
                    value={newBlog.slug}
                    onChange={(e) =>
                      setNewBlog((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="auto-generated-from-title"
                    className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="coverImage"
                  className="font-lora text-foreground"
                >
                  Cover Image
                </Label>
                <div className="space-y-2">
                  <Input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e)}
                    disabled={isUploading}
                    className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  />
                  {isUploading && (
                    <div className="flex items-center gap-2 text-sm font-lora text-muted-foreground">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gold-accent border-t-transparent" />
                      Uploading image...
                    </div>
                  )}
                  {imagePreview && (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Cover preview"
                        className="h-32 w-48 object-cover rounded-md border border-gold-accent/20"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 hover:bg-red-600"
                        onClick={() => removeImage()}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt" className="font-lora text-foreground">
                  Excerpt
                </Label>
                <Textarea
                  id="excerpt"
                  value={newBlog.excerpt}
                  onChange={(e) =>
                    setNewBlog((prev) => ({ ...prev, excerpt: e.target.value }))
                  }
                  placeholder="Brief description of the blog post"
                  rows={2}
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  required
                />
              </div>
              <div>
                <Label htmlFor="content" className="font-lora text-foreground">
                  Content
                </Label>
                <ReactQuill
                  value={newBlog.content}
                  onChange={(value: string) =>
                    setNewBlog((prev) => ({ ...prev, content: value }))
                  }
                  modules={quillModules}
                  theme="snow"
                  className="bg-primary/10 border border-gold-accent/20 text-foreground font-lora"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="authorName"
                    className="font-lora text-foreground"
                  >
                    Author Name
                  </Label>
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
                    className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="authorEmail"
                    className="font-lora text-foreground"
                  >
                    Author Email
                  </Label>
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
                    className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="tags" className="font-lora text-foreground">
                  Tags (comma-separated)
                </Label>
                <Input
                  id="tags"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="technology, business, lifestyle"
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black font-lora"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUploading}
                  className="gold-gradient text-black hover:opacity-90 font-lora"
                >
                  Create Blog Post
                </Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-card border-gold-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
              View Blog Post
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            {selectedBlog && (
              <div className="space-y-4">
                {selectedBlog.coverImage && (
                  <img
                    src={selectedBlog.coverImage}
                    alt={selectedBlog.title}
                    className="w-full h-48 object-cover rounded-md border border-gold-accent/20"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-cinzel font-bold text-foreground">
                    {selectedBlog.title}
                  </h2>
                  <p className="text-sm font-lora text-muted-foreground">
                    Slug: /{selectedBlog.slug}
                  </p>
                </div>
                <div>
                  <h3 className="font-lora font-semibold text-foreground mb-2">
                    Excerpt
                  </h3>
                  <p className="text-foreground font-lora">
                    {selectedBlog.excerpt}
                  </p>
                </div>
                <div>
                  <h3 className="font-lora font-semibold text-foreground mb-2">
                    Content
                  </h3>
                  <div
                    className="prose max-w-none text-foreground font-lora"
                    dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-lora font-semibold text-foreground mb-2">
                      Author
                    </h3>
                    <p className="font-lora text-foreground">
                      {selectedBlog.author.name}
                    </p>
                    <p className="text-sm font-lora text-muted-foreground">
                      {selectedBlog.author.email}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-lora font-semibold text-foreground mb-2">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedBlog.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="font-lora bg-gray-600/20 text-gray-500 border-gray-500/30"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-lora font-semibold text-foreground mb-2">
                    Metadata
                  </h3>
                  <p className="text-sm font-lora text-muted-foreground">
                    Created: {new Date(selectedBlog.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm font-lora text-muted-foreground">
                    Updated: {new Date(selectedBlog.updatedAt).toLocaleString()}
                  </p>
                  <p className="text-sm font-lora text-muted-foreground">
                    ID: {selectedBlog.id}
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-card border-gold-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
              Edit Blog Post
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <form onSubmit={handleUpdateBlog} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="editTitle"
                    className="font-lora text-foreground"
                  >
                    Title
                  </Label>
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
                    className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="editSlug"
                    className="font-lora text-foreground"
                  >
                    Slug
                  </Label>
                  <Input
                    id="editSlug"
                    value={editBlog.slug || ""}
                    onChange={(e) =>
                      setEditBlog((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="auto-generated-from-title"
                    className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="editCoverImage"
                  className="font-lora text-foreground"
                >
                  Cover Image
                </Label>
                <div className="space-y-2">
                  <Input
                    id="editCoverImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, true)}
                    disabled={isUploading}
                    className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  />
                  {isUploading && (
                    <div className="flex items-center gap-2 text-sm font-lora text-muted-foreground">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gold-accent border-t-transparent" />
                      Uploading image...
                    </div>
                  )}
                  {editImagePreview && (
                    <div className="relative inline-block">
                      <img
                        src={editImagePreview}
                        alt="Cover preview"
                        className="h-32 w-48 object-cover rounded-md border border-gold-accent/20"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 hover:bg-red-600"
                        onClick={() => removeImage(true)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label
                  htmlFor="editExcerpt"
                  className="font-lora text-foreground"
                >
                  Excerpt
                </Label>
                <Textarea
                  id="editExcerpt"
                  value={editBlog.excerpt || ""}
                  onChange={(e) =>
                    setEditBlog((prev) => ({
                      ...prev,
                      excerpt: e.target.value,
                    }))
                  }
                  placeholder="Brief description of the blog post"
                  rows={2}
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                />
              </div>
              <div>
                <Label
                  htmlFor="editContent"
                  className="font-lora text-foreground"
                >
                  Content
                </Label>
                <ReactQuill
                  value={editBlog.content || ""}
                  onChange={(value: string) =>
                    setEditBlog((prev) => ({ ...prev, content: value }))
                  }
                  modules={quillModules}
                  theme="snow"
                  className="bg-primary/10 border border-gold-accent/20 text-foreground font-lora"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="editAuthorName"
                    className="font-lora text-foreground"
                  >
                    Author Name
                  </Label>
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
                    className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="editAuthorEmail"
                    className="font-lora text-foreground"
                  >
                    Author Email
                  </Label>
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
                    className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editTags" className="font-lora text-foreground">
                  Tags (comma-separated)
                </Label>
                <Input
                  id="editTags"
                  value={editTagsInput}
                  onChange={(e) => setEditTagsInput(e.target.value)}
                  placeholder="technology, business, lifestyle"
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
                  disabled={isUploading}
                  className="gold-gradient text-black hover:opacity-90 font-lora"
                >
                  Update Blog Post
                </Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
