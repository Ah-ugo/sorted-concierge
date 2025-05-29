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
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  apiClient,
  type Content,
  type ContentCreate,
  type ContentUpdate,
} from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ContentPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [editContent, setEditContent] = useState<ContentUpdate>({});
  const [cardRef, cardInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [newContentFile, setNewContentFile] = useState<File | null>(null);
  const [editContentFile, setEditContentFile] = useState<File | null>(null);

  const [newContent, setNewContent] = useState<ContentCreate>({
    page: "",
    section: "",
    content_type: "text",
    text: {},
  });

  const contentTypes = ["text", "image", "html", "json"];

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    setIsLoading(true);
    try {
      const contentsData = await apiClient.getContent();
      setContents(contentsData);
      setFilteredContents(contentsData);
    } catch (error: any) {
      console.error("Error fetching contents:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch contents",
        className: "font-lora",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let result = contents;

    if (searchTerm) {
      result = result.filter(
        (content) =>
          content.page.toLowerCase().includes(searchTerm.toLowerCase()) ||
          content.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
          content.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (contentTypeFilter !== "all") {
      result = result.filter(
        (content) => content.content_type === contentTypeFilter
      );
    }

    setFilteredContents(result);
  }, [searchTerm, contentTypeFilter, contents]);

  const handleCreateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.page || !newContent.section || !newContent.content_type) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all required fields",
        className: "font-lora",
      });
      return;
    }

    try {
      const createData: any = {
        page: newContent.page,
        section: newContent.section,
        content_type: newContent.content_type,
      };
      if (newContent.text && Object.keys(newContent.text).length > 0) {
        createData.text = JSON.stringify(newContent.text);
      }
      if (newContentFile) {
        createData.file = newContentFile;
      }

      const createdContent = await apiClient.createContent(createData);
      setContents((prev) => [createdContent, ...prev]);
      setFilteredContents((prev) => [createdContent, ...prev]);
      setIsModalOpen(false);
      setNewContent({
        page: "",
        section: "",
        content_type: "text",
        text: {},
      });
      setNewContentFile(null);
      toast({
        title: "Success",
        description: "Content created successfully",
        className: "font-lora",
      });
    } catch (error: any) {
      console.error("Error creating content:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create content",
        className: "font-lora",
      });
    }
  };

  const handleDeleteContent = async (
    contentId: string,
    contentPage: string
  ) => {
    if (
      !confirm(
        `Are you sure you want to delete content for page "${contentPage}"?`
      )
    )
      return;

    try {
      await apiClient.deleteContent(contentId);
      setContents((prev) => prev.filter((c) => c.id !== contentId));
      setFilteredContents((prev) => prev.filter((c) => c.id !== contentId));
      toast({
        title: "Success",
        description: "Content deleted successfully",
        className: "font-lora",
      });
    } catch (error: any) {
      console.error("Error deleting content:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete content",
        className: "font-lora",
      });
    }
  };

  const getContentTypeColor = (contentType: string) => {
    switch (contentType) {
      case "text":
        return "bg-gray-600/20 text-gray-500 border-gray-500/30";
      case "image":
        return "bg-blue-600/20 text-blue-500 border-blue-500/30";
      case "html":
        return "bg-green-600/20 text-green-500 border-green-500/30";
      case "json":
        return "bg-yellow-600/20 text-yellow-500 border-yellow-500/30";
      default:
        return "bg-gray-600/20 text-gray-500 border-gray-500/30";
    }
  };

  const handleViewContent = (content: Content) => {
    setSelectedContent(content);
    setIsViewModalOpen(true);
  };

  const handleEditContent = (content: Content) => {
    setSelectedContent(content);
    setEditContent({
      page: content.page,
      section: content.section,
      content_type: content.content_type,
      text: content.text,
      image_url: content.image_url,
      metadata: content.metadata,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContent) return;

    try {
      const updatedContent = await apiClient.updateContent(
        selectedContent.id,
        editContent,
        editContentFile || undefined
      );
      setContents((prev) =>
        prev.map((c) => (c.id === selectedContent.id ? updatedContent : c))
      );
      setFilteredContents((prev) =>
        prev.map((c) => (c.id === selectedContent.id ? updatedContent : c))
      );
      setIsEditModalOpen(false);
      setSelectedContent(null);
      setEditContentFile(null);
      toast({
        title: "Success",
        description: "Content updated successfully",
        className: "font-lora",
      });
    } catch (error: any) {
      console.error("Error updating content:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update content",
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
          Content Management
        </h1>
        <Button
          size="sm"
          className="flex items-center gap-1 gold-gradient text-black hover:opacity-90 font-lora"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Add Content</span>
        </Button>
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
              Manage Content
              <motion.div
                className="h-0.5 bg-gradient-to-r from-transparent via-gold-accent to-transparent mt-2"
                initial={{ width: 0 }}
                animate={cardInView ? { width: "100px" } : {}}
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
                  placeholder="Search by page, section, or ID..."
                  className="pl-8 bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={contentTypeFilter}
                onValueChange={setContentTypeFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px] bg-primary/10 border-gold-accent/20 text-foreground font-lora">
                  <SelectValue placeholder="Filter by content type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-gold-accent/20">
                  <SelectItem value="all" className="font-lora">
                    All Types
                  </SelectItem>
                  {contentTypes.map((type) => (
                    <SelectItem key={type} value={type} className="font-lora">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                        Page
                      </TableHead>
                      <TableHead className="font-lora text-foreground">
                        Section
                      </TableHead>
                      <TableHead className="font-lora text-foreground">
                        Content Type
                      </TableHead>
                      <TableHead className="font-lora text-foreground">
                        Created By
                      </TableHead>
                      <TableHead className="font-lora text-foreground">
                        Created At
                      </TableHead>
                      <TableHead className="text-right font-lora text-foreground">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContents.length > 0 ? (
                      filteredContents.map((content, index) => (
                        <motion.tr
                          key={content.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={cardInView ? { opacity: 1, y: 0 } : {}}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="hover:bg-gold-accent/5"
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gold-accent" />
                              <div className="font-lora text-foreground">
                                {content.page}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-lora text-foreground">
                            {content.section}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`font-lora ${getContentTypeColor(
                                content.content_type
                              )}`}
                            >
                              {content.content_type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-lora text-foreground">
                            {content.created_by}
                          </TableCell>
                          <TableCell className="font-lora text-foreground">
                            {new Date(content.created_at).toLocaleDateString()}
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
                                  onClick={() => handleViewContent(content)}
                                >
                                  <Eye className="mr-2 h-4 w-4 text-gold-accent" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="font-lora"
                                  onClick={() => handleEditContent(content)}
                                >
                                  <Edit className="mr-2 h-4 w-4 text-gold-accent" />
                                  Edit Content
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-gold-accent/20" />
                                <DropdownMenuItem
                                  className="font-lora text-red-500"
                                  onClick={() =>
                                    handleDeleteContent(
                                      content.id,
                                      content.page
                                    )
                                  }
                                >
                                  <Trash className="mr-2 h-4 w-4 text-red-500" />
                                  Delete Content
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
      </motion.div>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl bg-card border-gold-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
              Content Details
            </DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <FileText className="h-12 w-12 text-gold-accent bg-primary/10 rounded-full p-2" />
                  <div>
                    <h2 className="text-xl font-lora text-foreground">
                      {selectedContent.page}
                    </h2>
                    <Badge
                      className={`font-lora ${getContentTypeColor(
                        selectedContent.content_type
                      )}`}
                    >
                      {selectedContent.content_type}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-lora text-foreground mb-1">
                        Section
                      </h3>
                      <p className="text-sm font-lora text-muted-foreground">
                        {selectedContent.section}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-lora text-foreground mb-1">
                        Created By
                      </h3>
                      <p className="text-sm font-lora text-muted-foreground">
                        {selectedContent.created_by}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-lora text-foreground mb-1">
                        Created At
                      </h3>
                      <p className="text-sm font-lora text-muted-foreground">
                        {new Date(
                          selectedContent.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-lora text-foreground mb-1">
                        Updated At
                      </h3>
                      <p className="text-sm font-lora text-muted-foreground">
                        {new Date(
                          selectedContent.updated_at
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedContent.text &&
                  Object.keys(selectedContent.text).length > 0 && (
                    <div>
                      <h3 className="font-lora text-foreground mb-2">
                        Text Content
                      </h3>
                      <pre className="text-sm font-lora text-muted-foreground bg-primary/10 p-3 rounded-md overflow-auto">
                        {JSON.stringify(selectedContent.text, null, 2)}
                      </pre>
                    </div>
                  )}

                {selectedContent.image_url && (
                  <div>
                    <h3 className="font-lora text-foreground mb-2">Image</h3>
                    <img
                      src={selectedContent.image_url}
                      alt="Content"
                      className="max-w-full h-auto rounded-md border border-gold-accent/20"
                    />
                  </div>
                )}

                {selectedContent.metadata && (
                  <div>
                    <h3 className="font-lora text-foreground mb-2">Metadata</h3>
                    <pre className="text-sm font-lora text-muted-foreground bg-primary/10 p-3 rounded-md overflow-auto">
                      {JSON.stringify(selectedContent.metadata, null, 2)}
                    </pre>
                  </div>
                )}
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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] bg-card border-gold-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
              Edit Content
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateContent} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editPage" className="font-lora text-foreground">
                  Page
                </Label>
                <Input
                  id="editPage"
                  value={editContent.page || ""}
                  onChange={(e) =>
                    setEditContent((prev) => ({
                      ...prev,
                      page: e.target.value,
                    }))
                  }
                  placeholder="Enter page name"
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                />
              </div>
              <div>
                <Label
                  htmlFor="editSection"
                  className="font-lora text-foreground"
                >
                  Section
                </Label>
                <Input
                  id="editSection"
                  value={editContent.section || ""}
                  onChange={(e) =>
                    setEditContent((prev) => ({
                      ...prev,
                      section: e.target.value,
                    }))
                  }
                  placeholder="Enter section name"
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="editContentType"
                className="font-lora text-foreground"
              >
                Content Type
              </Label>
              <Select
                value={editContent.content_type || ""}
                onValueChange={(value) =>
                  setEditContent((prev) => ({ ...prev, content_type: value }))
                }
              >
                <SelectTrigger className="bg-primary/10 border-gold-accent/20 text-foreground font-lora">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-gold-accent/20">
                  {contentTypes.map((type) => (
                    <SelectItem key={type} value={type} className="font-lora">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="editText" className="font-lora text-foreground">
                Text Content (JSON)
              </Label>
              <Textarea
                id="editText"
                value={
                  editContent.text
                    ? JSON.stringify(editContent.text, null, 2)
                    : "{}"
                }
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setEditContent((prev) => ({ ...prev, text: parsed }));
                  } catch {
                    // Ignore invalid JSON for now
                  }
                }}
                placeholder='Enter text content as JSON (e.g., {"key": "value"})'
                rows={4}
                className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
              />
            </div>
            <div>
              <Label htmlFor="editImage" className="font-lora text-foreground">
                Image File
              </Label>
              <Input
                id="editImage"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditContentFile(e.target.files?.[0] || null)
                }
                className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
              />
            </div>
            <div>
              <Label
                htmlFor="editMetadata"
                className="font-lora text-foreground"
              >
                Metadata (JSON)
              </Label>
              <Textarea
                id="editMetadata"
                value={
                  editContent.metadata
                    ? JSON.stringify(editContent.metadata, null, 2)
                    : "{}"
                }
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setEditContent((prev) => ({ ...prev, metadata: parsed }));
                  } catch {
                    // Ignore invalid JSON for now
                  }
                }}
                placeholder='Enter metadata as JSON (e.g., {"key": "value"})'
                rows={4}
                className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditContentFile(null);
                }}
                className="border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black font-lora"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="gold-gradient text-black hover:opacity-90 font-lora"
              >
                Update Content
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] bg-card border-gold-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
              Add New Content
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateContent} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="page" className="font-lora text-foreground">
                  Page
                </Label>
                <Input
                  id="page"
                  value={newContent.page}
                  onChange={(e) =>
                    setNewContent((prev) => ({ ...prev, page: e.target.value }))
                  }
                  placeholder="Enter page name"
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  required
                />
              </div>
              <div>
                <Label htmlFor="section" className="font-lora text-foreground">
                  Section
                </Label>
                <Input
                  id="section"
                  value={newContent.section}
                  onChange={(e) =>
                    setNewContent((prev) => ({
                      ...prev,
                      section: e.target.value,
                    }))
                  }
                  placeholder="Enter section name"
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  required
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="contentType"
                className="font-lora text-foreground"
              >
                Content Type
              </Label>
              <Select
                value={newContent.content_type}
                onValueChange={(value) =>
                  setNewContent((prev) => ({ ...prev, content_type: value }))
                }
              >
                <SelectTrigger className="bg-primary/10 border-gold-accent/20 text-foreground font-lora">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-gold-accent/20">
                  {contentTypes.map((type) => (
                    <SelectItem key={type} value={type} className="font-lora">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="text" className="font-lora text-foreground">
                Text Content (JSON)
              </Label>
              <Textarea
                id="text"
                value={
                  newContent.text
                    ? JSON.stringify(newContent.text, null, 2)
                    : "{}"
                }
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setNewContent((prev) => ({ ...prev, text: parsed }));
                  } catch {
                    // Ignore invalid JSON for now
                  }
                }}
                placeholder='Enter text content as JSON (e.g., {"key": "value"})'
                rows={4}
                className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
              />
            </div>
            <div>
              <Label htmlFor="image" className="font-lora text-foreground">
                Image File
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setNewContentFile(e.target.files?.[0] || null)}
                className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setNewContentFile(null);
                }}
                className="border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black font-lora"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="gold-gradient text-black hover:opacity-90 font-lora"
              >
                Add Content
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
