"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
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
import { apiClient } from "@/lib/api";

interface MembershipTier {
  name: string;
  href: string;
  bgImage: string;
  description: string;
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [membershipTiers, setMembershipTiers] = useState<MembershipTier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const servicesRef = useRef<HTMLLIElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
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

  // Fetch packages from API
  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true);
      try {
        const packages = await apiClient.getPackages();
        const tiers: MembershipTier[] = packages.map((pkg: any) => ({
          name: pkg.name,
          href: `/services/${pkg.id}`, // Use ID-based routing
          bgImage: pkg.image || "/images/default-membership.jpg", // Fallback image
          description:
            pkg.description.split(".")[0] ||
            "Explore this exclusive membership.", // Fallback description
        }));
        setMembershipTiers(tiers);
      } catch (error: any) {
        console.error("Failed to fetch packages:", error.message);
        setMembershipTiers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const mainCategories = [
    { name: "HOME", href: "/" },
    { name: "ABOUT", href: "/about" },
    {
      name: "SERVICES",
      href: "/services/6829b41919d4815586fee5f8",
      hasDropdown: true,
    }, // Default to Sorted Lifestyle ID
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

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-40 transition-all duration-300",
          isScrolled ? "bg-background subtle-glow shadow-sm" : "bg-transparent"
        )}
      >
        <div className="container flex h-16 items-center justify-between px-4 md:h-20">
          <Link href="/" className="flex items-center">
            <span
              className={cn(
                "text-xl font-cinzel font-bold tracking-wider",
                isScrolled ? "text-foreground" : "text-header"
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
                        padding: 0,
                        border: "none",
                        background: "none",
                        outline: "none",
                        cursor: "pointer",
                        font: "inherit",
                        color: "inherit",
                        textAlign: "inherit",
                        appearance: "none",
                      }}
                      onClick={handleServicesClick}
                      className={cn(
                        "flex items-center gap-1 text-sm font-lora uppercase tracking-widest transition-colors",
                        isActive(category.href)
                          ? "text-secondary"
                          : isScrolled
                          ? "text-foreground/80 hover:text-secondary"
                          : "text-header hover:text-secondary"
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
                        "text-sm font-lora uppercase tracking-widest",
                        isActive(category.href)
                          ? "text-secondary"
                          : isScrolled
                          ? "text-foreground/80 hover:text-secondary"
                          : "text-header hover:text-secondary"
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
            {/* <ModeToggle /> */}
            {user ? (
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "hover:bg-secondary/10",
                    isScrolled ? "text-foreground" : "text-header"
                  )}
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button
                  className={cn(
                    "text-sm font-lora uppercase tracking-widest bg-secondary text-secondary-foreground hover:bg-secondary/90",
                    isScrolled ? "text-secondary-foreground" : "text-header"
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
                isScrolled ? "text-foreground" : "text-header"
              )}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Services Dropdown - Desktop */}
        {isServicesOpen && (
          <div
            ref={dropdownRef}
            className="absolute left-0 right-0 top-full bg-background border-b border-border shadow-lg z-50 hidden md:block"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="mb-4">
                <Link
                  href="/services"
                  className="text-lg font-lora text-foreground hover:text-secondary transition-colors"
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
                <div className="grid grid-cols-3 gap-6">
                  {membershipTiers.map((tier) => (
                    <Link
                      key={tier.name}
                      href={tier.href}
                      className="group block"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      <div
                        className="relative h-40 bg-cover bg-center rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105"
                        style={{ backgroundImage: `url(${tier.bgImage})` }}
                      >
                        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors duration-300" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
                          <h3 className="text-xl font-cinzel font-bold tracking-wider mb-2">
                            {tier.name}
                          </h3>
                          <p className="text-sm font-lora opacity-90">
                            {tier.description}
                          </p>
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
        <div className="fixed inset-0 z-50 flex flex-col bg-background subtle-glow md:hidden">
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <span className="text-xl font-cinzel font-bold tracking-wider text-foreground">
              SORTED CONCIERGE
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(false)}
              className="text-foreground"
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
                        "text-xl font-lora uppercase tracking-widest",
                        isActive(category.href)
                          ? "text-secondary"
                          : "text-foreground hover:text-secondary"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                    {category.name === "SERVICES" && (
                      <ul className="ml-4 mt-3 space-y-3">
                        {isLoading ? (
                          <li className="text-sm font-lora text-muted-foreground">
                            Loading services...
                          </li>
                        ) : (
                          membershipTiers.map((tier) => (
                            <li key={tier.name}>
                              <Link
                                href={tier.href}
                                className="block p-3 rounded-lg border border-border hover:border-secondary transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <div className="text-base font-cinzel font-semibold text-foreground mb-1">
                                  {tier.name}
                                </div>
                                <div className="text-sm font-lora text-muted-foreground">
                                  {tier.description}
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

            <div className="space-y-6 border-t border-border pt-6">
              <div className="space-y-2">
                <h3 className="text-sm font-lora uppercase text-muted-foreground">
                  Contact Us
                </h3>
                <p className="flex items-center gap-2 text-sm font-lora text-foreground">
                  <Phone className="h-4 w-4" /> +234 123 456 7890
                </p>
                <p className="flex items-center gap-2 text-sm font-lora text-foreground">
                  <Mail className="h-4 w-4" /> info@sortedconcierge.com
                </p>
                <p className="flex items-center gap-2 text-sm font-lora text-foreground">
                  <MapPin className="h-4 w-4" /> Lagos, Nigeria
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-lora uppercase text-muted-foreground">
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
                      className="h-9 w-9 text-foreground hover:bg-secondary/10"
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
                      className="h-9 w-9 text-foreground hover:bg-secondary/10"
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
                      className="h-9 w-9 text-foreground hover:bg-secondary/10"
                    >
                      <Twitter className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {user ? (
                <div className="pt-2">
                  <Button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full border-secondary text-foreground hover:bg-secondary hover:text-secondary-foreground"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    asChild
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-secondary text-foreground hover:bg-secondary hover:text-secondary-foreground"
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
