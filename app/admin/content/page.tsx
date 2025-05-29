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
  FileText,
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
import { apiClient, type Content, type ContentCreate } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

export default function ContentPage() {
  const [content, setContent] = useState<Content[]>([]);
  const [filteredContent, setFilteredContent] = useState<Content[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageFilter, setPageFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for new content
  const [newContent, setNewContent] = useState<ContentCreate>({
    page: "",
    section: "",
    content_type: "text",
    text: {},
    image_url: "",
    metadata: {},
  });
  const [textInput, setTextInput] = useState("");
  const [metadataInput, setMetadataInput] = useState("");

  const pages = ["Home", "About", "Services", "Contact", "Blog", "Gallery"];
  const contentTypes = ["text", "image", "video", "link", "json"];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const contentData = await apiClient.getContent();
      setContent(contentData);
      setFilteredContent(contentData);
    } catch (error: any) {
      console.error("Error fetching content:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch content",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Apply filters
    let result = content;

    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.page.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (pageFilter !== "all") {
      result = result.filter((item) => item.page === pageFilter);
    }

    if (typeFilter !== "all") {
      result = result.filter((item) => item.content_type === typeFilter);
    }

    setFilteredContent(result);
  }, [searchTerm, pageFilter, typeFilter, content]);

  const handleCreateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.page || !newContent.section || !newContent.content_type) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all required fields",
      });
      return;
    }

    try {
      let text = {};
      let metadata = {};

      if (textInput) {
        try {
          text = JSON.parse(textInput);
        } catch {
          text = { content: textInput };
        }
      }

      if (metadataInput) {
        try {
          metadata = JSON.parse(metadataInput);
        } catch {
          metadata = { data: metadataInput };
        }
      }

      const createdContent = await apiClient.createContent({
        page: newContent.page,
        section: newContent.section,
        content_type: newContent.content_type,
        text: JSON.stringify(text),
        image_url: newContent.image_url,
        metadata: JSON.stringify(metadata),
      });

      setContent((prev) => [createdContent, ...prev]);
      setFilteredContent((prev) => [createdContent, ...prev]);
      setIsModalOpen(false);
      setNewContent({
        page: "",
        section: "",
        content_type: "text",
        text: {},
        image_url: "",
        metadata: {},
      });
      setTextInput("");
      setMetadataInput("");
      toast({
        title: "Success",
        description: "Content created successfully",
      });
    } catch (error: any) {
      console.error("Error creating content:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create content",
      });
    }
  };

  const handleDeleteContent = async (
    contentId: string,
    contentPage: string,
    contentSection: string
  ) => {
    if (
      !confirm(
        `Are you sure you want to delete content from "${contentPage} - ${contentSection}"?`
      )
    )
      return;

    try {
      await apiClient.deleteContent(contentId);
      setContent((prev) => prev.filter((c) => c.id !== contentId));
      setFilteredContent((prev) => prev.filter((c) => c.id !== contentId));
      toast({
        title: "Success",
        description: "Content deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting content:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete content",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Content Management
        </h1>
        <Button
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Add Content</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Manage Website Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search by page, section, or ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={pageFilter} onValueChange={setPageFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Filter by page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pages</SelectItem>
                {pages.map((page) => (
                  <SelectItem key={page} value={page}>
                    {page}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {contentTypes.map((type) => (
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
                    <TableHead>Page</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Content Preview</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContent.length > 0 ? (
                    filteredContent.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <div>
                              <div className="font-medium">{item.page}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {item.id}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{item.section}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.content_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate text-sm">
                            {item.content_type === "text" && item.text
                              ? typeof item.text === "string"
                                ? item.text
                                : JSON.stringify(item.text).substring(0, 50) +
                                  "..."
                              : item.content_type === "image" && item.image_url
                              ? item.image_url
                              : "No preview available"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(item.created_at).toLocaleDateString()}
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
                                View Content
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Content
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 dark:text-red-400"
                                onClick={() =>
                                  handleDeleteContent(
                                    item.id,
                                    item.page,
                                    item.section
                                  )
                                }
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete Content
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No content found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Content Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Content</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateContent} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="page">Page</Label>
                <Select
                  value={newContent.page}
                  onValueChange={(value) =>
                    setNewContent((prev) => ({ ...prev, page: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select page" />
                  </SelectTrigger>
                  <SelectContent>
                    {pages.map((page) => (
                      <SelectItem key={page} value={page}>
                        {page}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  value={newContent.section}
                  onChange={(e) =>
                    setNewContent((prev) => ({
                      ...prev,
                      section: e.target.value,
                    }))
                  }
                  placeholder="e.g., hero, about, features"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="content_type">Content Type</Label>
              <Select
                value={newContent.content_type}
                onValueChange={(value) =>
                  setNewContent((prev) => ({ ...prev, content_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {newContent.content_type === "text" && (
              <div>
                <Label htmlFor="text">Text Content (JSON format)</Label>
                <Textarea
                  id="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder='{"title": "Welcome", "description": "Our services..."}'
                  rows={4}
                />
              </div>
            )}
            {newContent.content_type === "image" && (
              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={newContent.image_url}
                  onChange={(e) =>
                    setNewContent((prev) => ({
                      ...prev,
                      image_url: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}
            <div>
              <Label htmlFor="metadata">Metadata (JSON format)</Label>
              <Textarea
                id="metadata"
                value={metadataInput}
                onChange={(e) => setMetadataInput(e.target.value)}
                placeholder='{"order": 1, "visible": true}'
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
              <Button type="submit">Add Content</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
