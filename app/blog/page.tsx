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
  published_at?: string;
  author: { [key: string]: string };
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
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const params =
          searchQuery && allTags.includes(searchQuery)
            ? { tag: searchQuery }
            : {};
        const apiPosts: Blog[] = await apiClient.getBlogs(params);
        const posts: BlogPost[] = apiPosts.map((post) => ({
          ...post,
          date:
            post.published_at ||
            new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          author: {
            name: post.author.name || post.author.username || "Unknown Author",
            avatar: post.author.avatar || "/placeholder.svg?height=80&width=80",
          },
        }));
        setBlogPosts(posts);
      } catch (error: unknown) {
        console.error("Error fetching blog posts:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to load blog posts. Please try again.",
          variant: "destructive",
          duration: 3000,
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

  // Handle newsletter subscription
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

    // Basic email validation
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        {" "}
        {/* Updated to black (background) */}
        <Loader2 className="h-8 w-8 animate-spin text-secondary-light" />{" "}
        {/* Updated to secondary.light */}
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/image8.png"
            alt="Blog Hero"
            fill
            priority
            className="w-full h-full object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />{" "}
          {/* Updated to muted */}
        </div>
        <div className="container relative z-10 mx-auto my-16 md:my-32 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-secondary-light/20 text-secondary-light px-4 py-1 text-xs sm:text-sm font-lora">
              {" "}
              {/* Updated to secondary.light */}
              Our Blog
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold tracking-widest text-white mb-6">
              {" "}
              {/* Updated to white */}
              Insights & Experiences
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-lora text-white mb-8">
              {" "}
              {/* Updated to white */}
              Discover the latest trends, tips, and stories from our concierge
              team and lifestyle experts.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/10 border-muted text-white placeholder:text-muted-foreground focus:bg-muted/20 text-sm sm:text-base font-lora" // Updated to muted and white
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-12 md:py-20 bg-black" ref={ref}>
        {" "}
        {/* Updated to black (background) */}
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
                    <p className="text-sm sm:text-base font-lora text-muted-foreground mb-4">
                      No articles found matching your search.
                    </p>
                    <Button
                      onClick={() => setSearchQuery("")}
                      variant="outline"
                      className="border-secondary text-xs sm:text-sm text-white hover:bg-secondary hover:text-black font-lora" // Updated to white and black
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
                <div className="bg-card p-6 rounded-lg mb-8 shadow-sm">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-cinzel font-bold tracking-wider text-white mb-4">
                    {" "}
                    {/* Updated to white */}
                    Categories
                  </h3>
                  <ul className="space-y-2">
                    {allTags.map((tag) => (
                      <li key={tag}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-xs sm:text-sm text-white hover:text-secondary-light hover:bg-secondary-light/10 font-lora" // Updated to white and secondary.light
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
                <div className="bg-card p-6 rounded-lg mb-8 shadow-sm">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-cinzel font-bold tracking-wider text-white mb-4">
                    {" "}
                    {/* Updated to white */}
                    Recent Posts
                  </h3>
                  <ul className="space-y-4">
                    {blogPosts.slice(0, 3).map((post) => (
                      <li key={post.id} className="flex items-start space-x-3">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={
                              post.coverImage ||
                              "/placeholder.svg?height=400&width=600"
                            }
                            alt={post.title}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                            sizes="(max-width: 768px) 16vw, 80px"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-sm sm:text-base font-lora font-medium text-white hover:text-secondary-light transition-colors" // Updated to white and secondary.light
                          >
                            {post.title}
                          </Link>
                          <div className="flex items-center text-xs sm:text-sm text-muted-foreground font-lora mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {post.date}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Newsletter */}
                <div className="bg-card p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-cinzel font-bold tracking-wider text-white mb-4">
                    {" "}
                    {/* Updated to white */}
                    Subscribe to Our Newsletter
                  </h3>
                  <p className="text-sm sm:text-base font-lora text-muted-foreground mb-4">
                    Stay updated with our latest articles and exclusive offers.
                  </p>
                  <form onSubmit={handleSubscribe} className="space-y-3">
                    <Input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-muted text-sm sm:text-base text-white placeholder:text-muted-foreground font-lora" // Updated to white
                      disabled={isSubscribing}
                      aria-label="Email address for newsletter subscription"
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gold-gradient hover:bg-gold-gradient/90 text-xs sm:text-sm text-black font-lora" // Updated to gold-gradient and black
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
