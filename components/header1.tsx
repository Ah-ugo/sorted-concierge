"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

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

  const mainCategories = [
    { name: "HOME", href: "/" },
    { name: "ABOUT", href: "/about" },
    { name: "SERVICES", href: "/services" },
    { name: "BLOG", href: "/blog" },
    { name: "CONTACT", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname.startsWith(href);
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
                <li key={category.name}>
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
      </header>

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
