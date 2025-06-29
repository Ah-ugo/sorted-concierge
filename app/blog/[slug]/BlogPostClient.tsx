"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/api";

interface AuthorUI {
  name: string;
  image: string;
  bio: string;
}

interface RelatedPostUI {
  title: string;
  slug: string;
  image: string;
}

interface BlogPostUI {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: AuthorUI;
  date: string;
  readTime: string;
  image: string;
  category: string;
  tags: string[];
  relatedPosts: RelatedPostUI[];
}

export default function BlogPostClient({ post }: { post: BlogPostUI }) {
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
        className: "bg-secondary-light text-black border-secondary-dark", // Updated to secondary.light and secondary.dark
        duration: 3000,
      });
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to subscribe. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen pb-12 md:pb-16 bg-black">
      {" "}
      {/* Updated to black (background) */}
      {/* Hero section with image */}
      <div className="relative h-[50vh] md:h-[60vh] bg-black">
        {" "}
        {/* Updated to black */}
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover opacity-70"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />{" "}
        {/* Updated to black */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-12">
          <div className="container mx-auto max-w-4xl">
            <Link
              href="/blog"
              className="flex items-center text-white mb-4 hover:text-secondary-light transition-colors text-sm sm:text-base" // Updated to white and secondary.light
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {" "}
              {/* Updated to white */}
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center text-white/80 gap-4 md:gap-6 text-xs sm:text-sm">
              {" "}
              {/* Updated to white */}
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Blog content */}
            <div
              className="prose prose-base sm:prose-lg prose-invert max-w-none text-white" // Updated to prose-invert and text-white
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Share section */}
            <div className="mt-8 md:mt-12 border-t border-muted pt-6">
              {" "}
              {/* Updated to muted */}
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4 flex items-center text-white">
                {" "}
                {/* Updated to white */}
                <Share2 className="mr-2 h-5 w-5" />
                Share this article
              </h3>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-muted text-white hover:bg-secondary-light hover:text-black" // Updated to muted, white, secondary.light, and black
                >
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-muted text-white hover:bg-secondary-light hover:text-black" // Updated to muted, white, secondary.light, and black
                >
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-muted text-white hover:bg-secondary-light hover:text-black" // Updated to muted, white, secondary.light, and black
                >
                  <Linkedin className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Author bio */}
            <div className="mt-8 md:mt-12 border-t border-muted pt-6">
              {" "}
              {/* Updated to muted */}
              <div className="flex items-start space-x-4">
                <Image
                  src={post.author.image}
                  alt={post.author.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                  sizes="(max-width: 768px) 20vw, 80px"
                />
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white">
                    {" "}
                    {/* Updated to white */}
                    {post.author.name}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1">
                    {post.author.bio}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Newsletter subscription */}
            <Card className="bg-card">
              {" "}
              {/* Ensured bg-card (#2B2B2B) */}
              <CardContent className="pt-6">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4 text-white">
                  {" "}
                  {/* Updated to white */}
                  Subscribe to our Newsletter
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  Get the latest updates and offers directly to your inbox.
                </p>
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <Input
                    placeholder="Your email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-sm sm:text-base text-white bg-muted placeholder:text-muted-foreground" // Updated to white and muted
                    disabled={isSubscribing}
                    aria-label="Email address for newsletter subscription"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-gold-gradient hover:bg-secondary-light/90 text-xs sm:text-sm text-black" // Updated to gold-gradient and secondary.light
                    disabled={isSubscribing}
                  >
                    {isSubscribing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Subscribe
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Related posts */}
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4 text-white">
                {" "}
                {/* Updated to white */}
                Related Posts
              </h3>
              <div className="space-y-4">
                {post.relatedPosts.map((relatedPost) => (
                  <Link
                    href={`/blog/${relatedPost.slug}`}
                    key={relatedPost.slug}
                    className="block group"
                  >
                    <div className="flex space-x-4">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          fill
                          className="object-cover rounded-md"
                          sizes="(max-width: 768px) 20vw, 80px"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-medium text-white group-hover:text-secondary-light transition-colors">
                          {" "}
                          {/* Updated to white and secondary.light */}
                          {relatedPost.title}
                        </h4>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
