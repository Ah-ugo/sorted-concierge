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
    // Prevent body scroll when menu is open
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMenuOpen]);

  const mainCategories = [
    {
      name: "HOME",
      href: "/",
    },
    {
      name: "ABOUT",
      href: "/about",
    },
    {
      name: "SERVICES",
      href: "/services",
    },
    {
      name: "BLOG",
      href: "/blog",
    },
    {
      name: "CONTACT",
      href: "/contact",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-40 transition-all duration-300",
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        )}
      >
        <div className="container flex h-16 items-center justify-between px-4 md:h-20">
          <Link href="/" className="flex items-center">
            <span
              className={`text-xl font-bold ${
                isScrolled ? "text-neutral-900" : "text-white"
              }`}
            >
              SORTED CONCIERGE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {mainCategories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className={`border-b-2 text-sm font-medium tracking-wide ${
                      isActive(category.href)
                        ? `border-teal-400 ${
                            isScrolled ? "text-neutral-900" : "text-white"
                          }`
                        : `border-transparent ${
                            isScrolled ? "text-neutral-700" : "text-white/80"
                          } hover:border-white/50`
                    } pb-1 transition-all duration-300`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-1">
            {/* <ModeToggle /> */}

            {user ? (
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="icon"
                  className={isScrolled ? "text-neutral-900" : "text-white"}
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button
                  className={`border ${
                    isScrolled
                      ? "border-teal-600 text-teal-600"
                      : "border-white text-white"
                  } bg-transparent hover:bg-teal-600 hover:text-white`}
                >
                  Login
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(true)}
              className={`md:hidden ${
                isScrolled ? "text-neutral-900" : "text-white"
              }`}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white md:hidden">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <span className="text-xl font-bold text-neutral-900">
              SORTED CONCIERGE
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(false)}
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
                      className={`text-xl font-medium ${
                        isActive(category.href)
                          ? "text-teal-600"
                          : "text-neutral-900"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-6 border-t border-neutral-200 pt-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-neutral-500">
                  Contact Us
                </h3>
                <p className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" /> +234 123 456 7890
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4" /> info@naijaconcierge.com
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" /> Lagos, Nigeria
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-neutral-500">
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  <Link
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Instagram className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Facebook className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="ghost" size="icon" className="h-9 w-9">
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
                    className="w-full"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    asChild
                    className="w-full bg-teal-600 hover:bg-teal-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
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
