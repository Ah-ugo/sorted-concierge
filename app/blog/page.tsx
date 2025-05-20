"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";
import { Search, Calendar, Tag, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/api";
import BlogCard from "@/components/blog-card";

// Interface for API response (based on api.ts Blog type)
interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  coverImage?: string;
  published_at?: string; // Assumed date field
  author: { [key: string]: string }; // Matches api.ts
  tags: string[];
}

// Interface for BlogPage UI
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  coverImage?: string;
  date: string;
  author: {
    name: string;
    avatar?: string;
  };
  tags: string[];
}

export default function BlogPage() {
  const { toast } = useToast();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch blog posts
    const fetchBlogPosts = async () => {
      try {
        const params =
          searchQuery && allTags.includes(searchQuery)
            ? { tag: searchQuery }
            : {};
        const apiPosts: Blog[] = await apiClient.getBlogs(params);
        // Transform Blog[] to BlogPost[]
        const posts: BlogPost[] = apiPosts.map((post) => ({
          ...post,
          date:
            post.published_at ||
            new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }), // Fallback to current date
          author: {
            name: post.author.name || post.author.username || "Unknown Author", // Fallback for name
            avatar: post.author.avatar || "/placeholder.svg?height=80&width=80",
          },
        }));
        setBlogPosts(posts);
      } catch (error: any) {
        console.error("Error fetching blog posts:", error);
        toast({
          title: "Error",
          description:
            error.message || "Failed to load blog posts. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, [searchQuery, toast]);

  const allTags = Array.from(new Set(blogPosts.flatMap((post) => post.tags)));

  const filteredPosts =
    searchQuery && !allTags.includes(searchQuery)
      ? blogPosts.filter(
          (post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : blogPosts;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] items-center justify-center">
        <div className="absolute inset-0 bg-neutral-900">
          <div className="h-full w-full bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center bg-no-repeat opacity-50" />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-teal-400/20 text-teal-400 px-4 py-1">
              Our Blog
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Insights & Experiences
            </h1>
            <p className="text-white/80 text-lg mb-8">
              Discover the latest trends, tips, and stories from our concierge
              team and lifestyle experts.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-20 bg-white" ref={ref}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-8">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={
                        inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                      }
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <BlogCard
                        post={{
                          ...post,
                          coverImage:
                            post.coverImage ||
                            "/placeholder.svg?height=400&width=600",
                          author: {
                            ...post.author,
                            avatar:
                              post.author.avatar ||
                              "/placeholder.svg?height=80&width=80",
                          },
                        }}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-neutral-500 mb-4">
                      No articles found matching your search.
                    </p>
                    <Button
                      onClick={() => setSearchQuery("")}
                      variant="outline"
                      className="border-teal-400 text-teal-600 hover:bg-teal-50"
                    >
                      Clear Search
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="mt-8 md:mt-0">
              <div className="sticky top-24">
                {/* Categories */}
                <div className="bg-neutral-50 p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-semibold mb-4">Categories</h3>
                  <ul className="space-y-2">
                    {allTags.map((tag) => (
                      <li key={tag}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-neutral-700 hover:text-teal-600 hover:bg-teal-50"
                          onClick={() => setSearchQuery(tag)}
                        >
                          <Tag className="mr-2 h-4 w-4" />
                          {tag}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recent Posts */}
                <div className="bg-neutral-50 p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-semibold mb-4">Recent Posts</h3>
                  <ul className="space-y-4">
                    {blogPosts.slice(0, 3).map((post) => (
                      <li key={post.id} className="flex items-start space-x-3">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={
                              post.coverImage ||
                              "/placeholder.svg?height=400&width=600" ||
                              "/placeholder.svg"
                            }
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="font-medium hover:text-teal-600 transition-colors"
                          >
                            {post.title}
                          </Link>
                          <div className="flex items-center text-sm text-neutral-500 mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {post.date}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Newsletter */}
                <div className="bg-teal-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">
                    Subscribe to Our Newsletter
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    Stay updated with our latest articles and exclusive offers.
                  </p>
                  <div className="space-y-3">
                    <Input placeholder="Your email address" />
                    <Button className="w-full bg-teal-400 hover:bg-teal-500 text-neutral-900">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
