"use client";

import React, { useState, useEffect } from "react";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Filter, Download, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { apiClient, User } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface DisplayUser {
  id: string;
  name: string;
  email: string;
  role: "Customer" | "Admin" | "Staff";
  joinDate: string;
  profileImage?: string; // Added profileImage
}

export default function UsersPage() {
  const [users, setUsers] = useState<DisplayUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<DisplayUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<
    "all" | "Customer" | "Admin" | "Staff"
  >("all");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const usersData = await apiClient.getUsers();
        const enrichedUsers: DisplayUser[] = usersData.map((user) => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role:
            user.role.toLowerCase() === "user"
              ? "Customer"
              : user.role.toLowerCase() === "admin"
              ? "Admin"
              : "Staff",
          joinDate: new Date(user.createdAt).toISOString().split("T")[0],
          profileImage: user.profileImage, // Include profileImage
        }));
        setUsers(enrichedUsers);
        setFilteredUsers(enrichedUsers);
      } catch (error: any) {
        console.error("Error fetching users:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch users",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let result = users;

    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [searchTerm, roleFilter, users]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const resetFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
  };

  const exportToCSV = () => {
    toast({
      title: "Export",
      description: "Export to CSV functionality would go here",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Manage Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search by name, email, or ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select
                value={roleFilter}
                onValueChange={(
                  value: "all" | "Customer" | "Admin" | "Staff"
                ) => setRoleFilter(value)}
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetFilters}
                  title="Reset filters"
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={exportToCSV}
                  title="Export to CSV"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead className="hidden md:table-cell">ID</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Role
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Join Date
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.length > 0 ? (
                      currentItems.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={
                                    user.profileImage ||
                                    `/placeholder.svg?height=32&width=32`
                                  }
                                  alt={user.name}
                                />
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {user.email}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 md:hidden mt-1">
                                  {user.role} • {user.id}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {user.id}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                user.role === "Admin"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                  : user.role === "Staff"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                              }`}
                            >
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {user.joinDate}
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
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/users/${user.id}`}>
                                    View Profile
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/users/${user.id}/edit`}>
                                    Edit User
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/admin/users/${user.id}/bookings`}
                                  >
                                    View Bookings
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 dark:text-red-400"
                                  onClick={async () => {
                                    if (
                                      confirm(
                                        `Are you sure you want to delete ${user.name}?`
                                      )
                                    ) {
                                      try {
                                        await apiClient.deleteUser(user.id);
                                        setUsers((prev) =>
                                          prev.filter((u) => u.id !== user.id)
                                        );
                                        setFilteredUsers((prev) =>
                                          prev.filter((u) => u.id !== user.id)
                                        );
                                        toast({
                                          title: "Success",
                                          description:
                                            "User deleted successfully",
                                        });
                                      } catch (error: any) {
                                        console.error(
                                          "Error deleting user:",
                                          error
                                        );
                                        toast({
                                          variant: "destructive",
                                          title: "Error",
                                          description:
                                            error.message ||
                                            "Failed to delete user",
                                        });
                                      }
                                    }
                                  }}
                                >
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
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
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (page) =>
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        )
                        .map((page, i, array) => (
                          <React.Fragment key={page}>
                            {i > 0 && array[i - 1] !== page - 1 && (
                              <PaginationItem>
                                <span className="px-4 py-2">...</span>
                              </PaginationItem>
                            )}
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={page === currentPage}
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
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
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
    </div>
  );
}
