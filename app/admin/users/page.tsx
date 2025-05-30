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
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  User,
  Mail,
  Phone,
  MapPin,
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { apiClient, type User as ApiUser, type UserUpdate } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

export default function UsersPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ApiUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const [cardRef, cardInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [editUser, setEditUser] = useState<UserUpdate>({});
  const roles = ["user", "admin"];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const usersData = await apiClient.getUsers();
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch users",
        className: "font-lora",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let result = users;
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }
    setFilteredUsers(result);
  }, [searchTerm, roleFilter, users]);

  const handleViewUser = (user: ApiUser) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user: ApiUser) => {
    setSelectedUser(user);
    setEditUser({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      address: user.address,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsActionLoading(true);
    try {
      const updatedUser = await apiClient.updateUser(selectedUser.id, editUser);
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? updatedUser : u))
      );
      setFilteredUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? updatedUser : u))
      );
      setIsEditModalOpen(false);
      setSelectedUser(null);
      toast({
        title: "Success",
        description: "User updated successfully",
        className: "font-lora",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update user",
        className: "font-lora",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete "${userName}"?`)) return;
    setIsActionLoading(true);
    try {
      await apiClient.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setFilteredUsers((prev) => prev.filter((u) => u.id !== userId));
      toast({
        title: "Success",
        description: "User deleted successfully",
        className: "font-lora",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete user",
        className: "font-lora",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-600/20 text-purple-400";
      case "user":
        return "bg-blue-600/20 text-blue-400";
      default:
        return "bg-muted/20 text-muted-foreground";
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
          Members
        </h1>
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
              Manage Members
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
                  placeholder="Search by name, email, or ID..."
                  className="pl-8 bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-primary/10 border-gold-accent/20 text-foreground font-lora">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent className="bg-card border-gold-accent/20">
                  <SelectItem value="all" className="font-lora">
                    All Roles
                  </SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role} className="font-lora">
                      {role.charAt(0).toUpperCase() + role.slice(1)}
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
                        Member
                      </TableHead>
                      <TableHead className="font-cinzel uppercase tracking-wider text-secondary">
                        Email
                      </TableHead>
                      <TableHead className="font-cinzel uppercase tracking-wider text-secondary">
                        Role
                      </TableHead>
                      <TableHead className="font-cinzel uppercase tracking-wider text-secondary">
                        Phone
                      </TableHead>
                      <TableHead className="font-cinzel uppercase tracking-wider text-secondary">
                        Joined
                      </TableHead>
                      <TableHead className="text-right font-cinzel uppercase tracking-wider text-secondary">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user, index) => (
                        <motion.tr
                          key={user.id}
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
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={user.profileImage || "/placeholder.svg"}
                                  alt={user.firstName}
                                />
                                <AvatarFallback className="font-lora">
                                  {user.firstName.charAt(0)}
                                  {user.lastName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-lora text-foreground">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-xs font-lora text-muted-foreground">
                                  {user.id}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-lora text-muted-foreground">
                            {user.email}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${getRoleColor(user.role)} font-lora`}
                            >
                              {user.role.charAt(0).toUpperCase() +
                                user.role.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-lora text-muted-foreground">
                            {user.phone || "Not provided"}
                          </TableCell>
                          <TableCell className="font-lora text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gold-accent hover:bg-gold-accent/10"
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
                                  onClick={() => handleViewUser(user)}
                                  disabled={isActionLoading}
                                >
                                  <Eye className="mr-2 h-4 w-4 text-gold-accent" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="font-lora"
                                  onClick={() => handleEditUser(user)}
                                  disabled={isActionLoading}
                                >
                                  <Edit className="mr-2 h-4 w-4 text-gold-accent" />
                                  Edit Member
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-gold-accent/20" />
                                <DropdownMenuItem
                                  className="font-lora text-red-600 dark:text-red-400"
                                  onClick={() =>
                                    handleDeleteUser(
                                      user.id,
                                      `${user.firstName} ${user.lastName}`
                                    )
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
                                      Delete Member
                                    </>
                                  )}
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
                          No members found.
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
              Member Details
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedUser.profileImage || "/placeholder.svg"}
                    alt={selectedUser.firstName}
                  />
                  <AvatarFallback className="font-lora text-lg">
                    {selectedUser.firstName.charAt(0)}
                    {selectedUser.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-lora text-foreground">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h2>
                  <Badge
                    className={`${getRoleColor(selectedUser.role)} font-lora`}
                  >
                    {selectedUser.role.charAt(0).toUpperCase() +
                      selectedUser.role.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gold-accent" />
                    <div>
                      <p className="text-sm font-lora text-foreground">Email</p>
                      <p className="text-sm font-lora text-muted-foreground">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gold-accent" />
                    <div>
                      <p className="text-sm font-lora text-foreground">Phone</p>
                      <p className="text-sm font-lora text-muted-foreground">
                        {selectedUser.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gold-accent" />
                    <div>
                      <p className="text-sm font-lora text-foreground">
                        Address
                      </p>
                      <p className="text-sm font-lora text-muted-foreground">
                        {selectedUser.address || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gold-accent" />
                    <div>
                      <p className="text-sm font-lora text-foreground">
                        Member ID
                      </p>
                      <p className="text-sm font-lora text-muted-foreground">
                        {selectedUser.id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gold-accent/20 pt-4">
                <h3 className="font-lora text-foreground mb-2">
                  Account Information
                </h3>
                <div className="text-sm font-lora text-muted-foreground space-y-1">
                  <p>
                    Created: {new Date(selectedUser.createdAt).toLocaleString()}
                  </p>
                  <p>
                    Last Updated:{" "}
                    {new Date(selectedUser.updatedAt).toLocaleString()}
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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl bg-card border-gold-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-cinzel uppercase tracking-widest text-secondary">
              Edit Member
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="firstName"
                  className="font-lora text-foreground"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={editUser.firstName || ""}
                  onChange={(e) =>
                    setEditUser((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  placeholder="Enter first name"
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  disabled={isActionLoading}
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="font-lora text-foreground">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={editUser.lastName || ""}
                  onChange={(e) =>
                    setEditUser((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  placeholder="Enter last name"
                  className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                  disabled={isActionLoading}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone" className="font-lora text-foreground">
                Phone
              </Label>
              <Input
                id="phone"
                value={editUser.phone || ""}
                onChange={(e) =>
                  setEditUser((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="Enter phone number"
                className="bg-primary/10 border-gold-accent/20 text-foreground font-lora"
                disabled={isActionLoading}
              />
            </div>
            <div>
              <Label htmlFor="address" className="font-lora text-foreground">
                Address
              </Label>
              <Input
                id="address"
                value={editUser.address || ""}
                onChange={(e) =>
                  setEditUser((prev) => ({ ...prev, address: e.target.value }))
                }
                placeholder="Enter address"
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
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  "Update Member"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
