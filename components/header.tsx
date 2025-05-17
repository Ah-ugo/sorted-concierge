"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { usePathname } from "next/navigation";
import { useMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/lib/auth-context";
import { Menu, X, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const pathname = usePathname();
  const isMobile = useMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Add this useEffect to handle body class for preventing scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }

    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [isOpen]);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  const getInitials = (name: string) => {
    if (!name) return "NC";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="font-playfair text-2xl font-bold relative z-[101]"
          >
            <span
              className={
                isScrolled || pathname !== "/" || isOpen
                  ? "text-primary"
                  : "text-white"
              }
            >
              Sorted Concierge
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-[101]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium transition-colors ${
                  pathname === item.href
                    ? "text-primary"
                    : isScrolled || pathname !== "/"
                    ? "text-gray-900 dark:text-gray-100 hover:text-primary"
                    : "text-white hover:text-white/80"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar>
                      <AvatarImage
                        src={user?.profileImage || "/placeholder.svg"}
                        alt={user?.firstName}
                      />
                      <AvatarFallback>
                        {getInitials(`${user?.firstName} ${user?.lastName}`)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <User className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Link href="/auth/login">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile Navigation - Always in DOM but conditionally visible */}
          <div
            className={`md:hidden fixed inset-0 z-[100] bg-white dark:bg-gray-900 transition-opacity duration-300 ${
              isOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="container mx-auto px-4 py-6 flex flex-col h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <Link
                  href="/"
                  className="font-playfair text-2xl font-bold text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Sorted Concierge
                </Link>
              </div>

              <nav className="flex flex-col space-y-6 flex-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-xl font-medium ${
                      pathname === item.href
                        ? "text-primary"
                        : "text-gray-900 dark:text-gray-100"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700 mt-auto">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-4 mb-6">
                      <Avatar>
                        <AvatarImage
                          src={user?.profileImage || "/placeholder.svg"}
                          alt={user?.firstName}
                        />
                        <AvatarFallback>
                          {getInitials(`${user?.firstName} ${user?.lastName}`)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{`${user?.firstName} ${user?.lastName}`}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Button
                        asChild
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Link href="/profile" onClick={() => setIsOpen(false)}>
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </Button>
                      {user?.role === "admin" && (
                        <Button
                          asChild
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Link href="/admin" onClick={() => setIsOpen(false)}>
                            <User className="mr-2 h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <Button
                      asChild
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                    >
                      <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link
                        href="/auth/register"
                        onClick={() => setIsOpen(false)}
                      >
                        Register
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              <div className="pt-6 flex justify-center mt-6">
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
