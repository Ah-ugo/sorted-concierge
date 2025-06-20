"use client";
import { useState, useEffect, useRef } from "react";
import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  User,
  LogOut,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { apiClient, type ServiceCategory } from "@/lib/api";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const servicesRef = useRef<HTMLLIElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use the auth context
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }
    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsServicesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchServiceCategories = async () => {
      setIsLoading(true);
      try {
        const data = await apiClient.getServiceCategories({
          skip: 0,
          limit: 100,
        });
        const activeCategories = data.filter(
          (category: ServiceCategory) => category.is_active
        );
        setServiceCategories(activeCategories);
      } catch (error) {
        console.error("Failed to fetch service categories:", error);
        setServiceCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceCategories();
  }, []);

  const mainCategories = [
    { name: "HOME", href: "/" },
    { name: "ABOUT", href: "/about" },
    {
      name: "SERVICES",
      href: "/services",
      hasDropdown: true,
    },
    { name: "BLOG", href: "/blog" },
    { name: "CONTACT", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname.startsWith(href);
  };

  const handleServicesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsServicesOpen(!isServicesOpen);
  };

  const getServiceCategoryDescription = (category: ServiceCategory) => {
    const shortDesc =
      category.description.split(".")[0] || category.description;
    return shortDesc.length > 60
      ? shortDesc.substring(0, 60) + "..."
      : shortDesc;
  };

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-40 transition-all duration-300",
          isScrolled ? "bg-black shadow-sm" : "bg-transparent"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 md:h-20">
          <Link href="/" className="flex items-center">
            <span
              className={cn(
                "text-xl font-semibold tracking-wider",
                isScrolled ? "text-white" : "text-white"
              )}
            >
              SORTED CONCIERGE
            </span>
          </Link>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              {mainCategories.map((category) => (
                <li
                  key={category.name}
                  className="relative"
                  ref={category.name === "SERVICES" ? servicesRef : undefined}
                >
                  {category.hasDropdown ? (
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        margin: 0,
                        fontFamily: "inherit",
                        fontSize: "0.875rem",
                        fontWeight: 400,
                        lineHeight: "1.5",
                        letterSpacing: "0.1em",
                        textDecoration: "none",
                        textTransform: "uppercase",
                        color: "inherit",
                        cursor: "pointer",
                        outline: "none",
                        appearance: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        verticalAlign: "middle",
                        height: "100%",
                        boxSizing: "border-box",
                      }}
                      onClick={handleServicesClick}
                      className={cn(
                        "flex items-center gap-1 text-sm font-normal uppercase tracking-widest transition-colors",
                        isActive(category.href)
                          ? "text-secondary"
                          : isScrolled
                          ? "text-white/80 hover:text-secondary"
                          : "text-white hover:text-secondary"
                      )}
                    >
                      {category.name}
                      <ChevronDown
                        className={cn(
                          "h-3 w-3 transition-transform duration-200",
                          isServicesOpen ? "rotate-180" : ""
                        )}
                      />
                    </button>
                  ) : (
                    <Link
                      href={category.href}
                      className={cn(
                        "text-sm font-normal uppercase tracking-widest transition-colors",
                        isActive(category.href)
                          ? "text-secondary"
                          : isScrolled
                          ? "text-white/80 hover:text-secondary"
                          : "text-white hover:text-secondary"
                      )}
                    >
                      {category.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center space-x-2">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2">
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "hover:bg-secondary/10",
                      isScrolled ? "text-white" : "text-white"
                    )}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  onClick={logout}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "hover:bg-secondary/10",
                    isScrolled ? "text-white" : "text-white"
                  )}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button
                  className={cn(
                    "text-sm font-normal uppercase tracking-widest bg-gold-gradient text-black hover:bg-secondary/80"
                  )}
                >
                  Login
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(true)}
              className={cn(
                "md:hidden",
                isScrolled ? "text-white" : "text-white"
              )}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Desktop Services Dropdown */}
        {isServicesOpen && (
          <div
            ref={dropdownRef}
            className="absolute left-0 right-0 top-full bg-black border-b border-muted/50 shadow-lg z-50 hidden md:block"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="mb-4">
                <Link
                  href="/services"
                  className="text-lg font-normal text-white hover:text-secondary transition-colors"
                  onClick={() => setIsServicesOpen(false)}
                >
                  View All Services
                </Link>
              </div>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {serviceCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/services/${category.id}`}
                      className="group block"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      <div
                        className="relative h-40 bg-cover bg-center rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105"
                        style={{
                          backgroundImage: `url(${
                            category.image ||
                            "/placeholder.svg?height=160&width=300"
                          })`,
                        }}
                      >
                        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors duration-300" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
                          <h3 className="text-xl font-semibold tracking-wider mb-2">
                            {category.name}
                          </h3>
                          <p className="text-sm font-normal opacity-90 mb-3">
                            {getServiceCategoryDescription(category)}
                          </p>
                          <div className="text-xs uppercase tracking-wider opacity-75">
                            {category.category_type === "tiered"
                              ? "Membership Tiers"
                              : "Custom Experience"}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black shadow-lg md:hidden">
          <div className="flex h-16 items-center justify-between border-b border-muted/50 px-4">
            <span className="text-xl font-semibold tracking-wider text-white">
              SORTED CONCIERGE
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(false)}
              className="text-white"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="mb-8">
              <ul className="space-y-6">
                {mainCategories.map((category) => (
                  <li key={category.name}>
                    <Link
                      href={category.href}
                      className={cn(
                        "text-xl font-normal uppercase tracking-widest",
                        isActive(category.href)
                          ? "text-secondary"
                          : "text-white hover:text-secondary"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                    {category.name === "SERVICES" && (
                      <ul className="ml-4 mt-3 space-y-3">
                        {isLoading ? (
                          <li className="text-sm font-normal text-muted-foreground">
                            Loading services...
                          </li>
                        ) : (
                          serviceCategories.map((serviceCategory) => (
                            <li key={serviceCategory.id}>
                              <Link
                                href={`/services/${serviceCategory.id}`}
                                className="block p-3 rounded-lg border border-muted/50 hover:border-secondary transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <div className="text-base font-semibold text-white mb-1">
                                  {serviceCategory.name}
                                </div>
                                <div className="text-sm font-normal text-muted-foreground mb-2">
                                  {getServiceCategoryDescription(
                                    serviceCategory
                                  )}
                                </div>
                                <div className="text-xs uppercase tracking-wider text-secondary">
                                  {serviceCategory.category_type === "tiered"
                                    ? "Membership Tiers Available"
                                    : "Custom Experience"}
                                </div>
                              </Link>
                            </li>
                          ))
                        )}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="space-y-6 border-t border-muted/50 pt-6">
              <div className="space-y-2">
                <h3 className="text-sm font-normal uppercase text-muted-foreground">
                  Contact Us
                </h3>
                <p className="flex items-center gap-2 text-sm font-normal text-white">
                  <Phone className="h-4 w-4" /> +234 803 408 6086
                </p>
                <p className="flex items-center gap-2 text-sm font-normal text-white">
                  <Mail className="h-4 w-4" /> info@sortedconcierge.com
                </p>
                <p className="flex items-center gap-2 text-sm font-normal text-white">
                  <MapPin className="h-4 w-4" /> Lagos, Nigeria
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-normal uppercase text-muted-foreground">
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  <Link
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-white hover:bg-secondary/10"
                    >
                      <Instagram className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-white hover:bg-secondary/10"
                    >
                      <Facebook className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-white hover:bg-secondary/10"
                    >
                      <Twitter className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              {isAuthenticated && user ? (
                <div className="pt-2">
                  <Button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full border-secondary text-white hover:bg-secondary hover:text-black"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    asChild
                    className="w-full bg-gold-gradient text-black hover:bg-secondary/80"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-secondary text-white hover:bg-secondary hover:text-black"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/auth/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
