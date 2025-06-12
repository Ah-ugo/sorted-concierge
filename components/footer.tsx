"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export default function Footer() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsSubscribing(true);
    try {
      await apiClient.subscribeToNewsletter(email);
      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter!",
        variant: "default",
        className: "bg-green-500 text-white border-green-600",
        duration: 3000,
      });
      setEmail("");
    } catch {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-semibold text-2xl mb-4">Sorted Concierge</h3>
            <p className="text-muted-foreground mb-6">
              Experience Lagos like never before with our premium concierge
              services. We handle everything so you can focus on what matters
              most.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-secondary-light transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-secondary-light transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-secondary-light transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-secondary-light transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-secondary-light transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-secondary-light transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-muted-foreground hover:text-secondary-light transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-secondary-light transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-secondary-light transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-secondary-light mr-2 mt-0.5" />
                <span className="text-muted-foreground">
                  123 Victoria Island, Lagos, Nigeria
                </span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-secondary-light mr-2 mt-0.5" />
                <span className="text-muted-foreground">+234 123 456 7890</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-secondary-light mr-2 mt-0.5" />
                <span className="text-muted-foreground">
                  info@sortedconcierge.com
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 uppercase tracking-wider">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-muted-foreground mb-4">
              Stay updated with our latest news and special offers.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col space-y-2"
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="bg-card border-muted/50 text-white placeholder:text-muted-foreground"
                disabled={isSubscribing}
                aria-label="Email address for newsletter subscription"
              />
              <Button
                type="submit"
                className="bg-gold-gradient hover:bg-secondary-light/80 text-black"
                disabled={isSubscribing}
              >
                {isSubscribing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="pt-8 border-t border-muted/50 text-center text-muted-foreground text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>
              © {new Date().getFullYear()} Sorted Concierge. All rights
              reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                href="/terms"
                className="hover:text-secondary-light transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy"
                className="hover:text-secondary-light transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/cookies"
                className="hover:text-secondary-light transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
